<template>
  <div class="w-full h-screen">
    <!-- locator map goes here -->
    <ClientOnly>
      <div ref="woosmapRef" id="map"></div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
//-------- TYPES
import type { Geoposition } from "~/types/Branch.type";
declare global {
  interface Window {
    initMap: () => void;
  }
}

const runtimeConfig = useRuntimeConfig();
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
  map = new woosmap.map.Map(woosmapRef.value as HTMLElement, {
    zoom: 13,
    center: center.value,
  });
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
