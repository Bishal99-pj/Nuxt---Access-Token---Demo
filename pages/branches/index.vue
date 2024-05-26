<template>
  <div class="w-full h-screen">
    <!-- locator map goes here -->
    <div ref="woosmapRef" id="map"></div>
  </div>
</template>

<script setup lang="ts">
//-------- TYPES
import type * as GeoJSON from "geojson";
import Supercluster from "supercluster";

import type { Geoposition } from "~/types/Branch.type";

declare global {
  interface Window {
    initMap: () => void;
  }
}

const runtimeConfig = useRuntimeConfig();

const { data, pending, error, refresh } = await useFetch("/api/branches");
// console.log(data.value?.data);

//-------- STATES
const currentLoc = ref<Geoposition | null>(null);
const woosmapRef = ref<HTMLElement | null>(null);
//  get initial center
const center = computed<woosmap.map.LatLngLiteral>(() => ({
  lat: currentLoc.value ? Number(currentLoc.value.latitude) : 51.50940214,
  lng: currentLoc.value ? Number(currentLoc.value.longitude) : -0.133012,
}));

// Initialize and add the map
let map: woosmap.map.Map;

let infoWindow: woosmap.map.InfoWindow;
let index: Supercluster;
let markers: woosmap.map.Marker[] = [];
const ICON_URL = "https://images.woosmap.com/icons/pin-green.png";

const SUPERCLUSTER_OPTIONS: Supercluster.Options<any, any> = {
  radius: 30,
  extent: 256,
  maxZoom: 15,
  minPoints: 2,
};

//-------- METHODS
function getCurrentLocation() {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      currentLoc.value = {
        latitude: String(position.coords.latitude),
        longitude: String(position.coords.longitude),
      };
    },
    (e) => {
      console.log("Geo location error >>>", e.message);
    }
  );
}
// woosmap init
function initMap(): void {
  infoWindow = new woosmap.map.InfoWindow({});

  map = new woosmap.map.Map(woosmapRef.value as HTMLElement, {
    zoom: 13,
    center: center.value,
  });

  getAllBranches().then((stores) => {
    index = new Supercluster(SUPERCLUSTER_OPTIONS).load(stores);
    update();
  });

  manageEvents();
}

// Store service
function getAllBranches(): Promise<woosmap.map.stores.StoreResponse[]> {
  const allStores: woosmap.map.stores.StoreResponse[] = [];

  const query: woosmap.map.stores.StoresSearchRequest = {
    storesByPage: 300,
  };
  const storesService = new woosmap.map.StoresService();

  // GET PAGINATED STORES
  const fetchStores = async (
    storePage?: number
  ): Promise<woosmap.map.stores.StoreResponse[]> => {
    if (storePage) {
      query.page = storePage;
    }
    return storesService
      .search(query)
      .then((response: woosmap.map.stores.StoresSearchResponse) => {
        // TODO: handle initial cluster of branches
        allStores.push(...response.features);

        if (query.page === response.pagination.pageCount) {
          return allStores;
        }
        return fetchStores(response.pagination.page + 1);
      })
      .catch((err: Error) => {
        console.error(err);
        throw new Error(`Error getting all stores: ${err.message}`);
      });
  };
  return fetchStores();
}

// Map Events
function manageEvents(): void {
  map.addListener("dragend", useDebounceFn(update, 20));
  map.addListener("zoom_changed", useDebounceFn(update, 20));
  window.addEventListener("resize", useDebounceFn(update, 100));
}

function update(): void {
  clearMarkers();
  const bounds = map.getBounds();
  // geographical bounds
  const bbox: GeoJSON.BBox = [
    bounds.getSouthWest().lng(),
    bounds.getSouthWest().lat(),
    bounds.getNorthEast().lng(),
    bounds.getNorthEast().lat(),
  ];
  const clusterData = index.getClusters(bbox, map.getZoom());

  // update markers
  for (const feature of clusterData) {
    const latlng = {
      lat: feature.geometry.coordinates[1],
      lng: feature.geometry.coordinates[0],
    };
    //
    markers.push(createClusterIcon(feature, latlng));
  }
}

function clearMarkers(): void {
  for (const marker of markers) {
    marker.setMap(null);
  }
  markers = [];
}

function createClusterIcon(
  feature: any,
  latlng: woosmap.map.LatLngLiteral
): woosmap.map.Marker {
  if (!feature.properties.cluster) {
    return createMarker(feature, latlng);
  }
  return createCluster(feature, latlng);
}

function createCluster(
  feature: any,
  latlng: woosmap.map.LatLngLiteral
): woosmap.map.Marker {
  const count = feature.properties.point_count;

  const size = count < 80 ? 45 : count < 400 ? 55 : 65;

  const svg = window.btoa(`
<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
  <circle cx="120" cy="120" opacity=".8" r="70" />
  <circle cx="120" cy="120" opacity=".3" r="80" />
  <circle cx="120" cy="120" opacity=".2" r="110" />
</svg>`);

  const marker = new window.woosmap.map.Marker({
    label: {
      text: feature.properties["point_count_abbreviated"],
      color: "white",
    },
    position: latlng,
    icon: {
      url: `data:image/svg+xml;base64,${svg}`,
      scaledSize: new window.woosmap.map.Size(size, size),
    },
    map: map,
  });

  marker.addListener("click", (e) => {
    infoWindow.close();
    const expansionZoom = index.getClusterExpansionZoom(
      feature.properties["cluster_id"]
    );
    map.setCenter(marker.getPosition());
    map.setZoom(expansionZoom);
  });
  return marker;
}

function createMarker(
  feature: any,
  latlng: woosmap.map.LatLngLiteral
): woosmap.map.Marker {
  const marker = new window.woosmap.map.Marker({
    icon: {
      url: ICON_URL,
      scaledSize: {
        height: 50,
        width: 26,
      },
    },
    position: latlng,
    map: map,
  });
  marker.addListener("click", () => {
    infoWindow.setContent(`<h3>${feature.properties.name}</h3>`);
    infoWindow.open(map, marker);
  });
  return marker;
}

//-------- WATCHERS
watch(currentLoc, (newLoc) => {
  if (newLoc && map) {
    map.panTo({
      lat: Number(newLoc.latitude),
      lng: Number(newLoc.longitude),
    });
  }
});

//-------- SCRIPT
useHead({
  script: [
    {
      src: `https://sdk.woosmap.com/map/map.js?key=${runtimeConfig.public.woosmapKey}&callback=initMap`,
      defer: true,
    },
  ],
});

onMounted(() => {
  window.initMap = initMap;
  getCurrentLocation();
});
</script>

<style>
#map {
  height: 100%;
  width: 100%;
}
</style>
