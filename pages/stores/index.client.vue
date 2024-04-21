.
<template>
    <!-- locator map goes here -->
    <div id="map"></div>
</template>

<script setup lang="ts">
declare global {
  interface Window {
    initMap: () => void;
  }
}
const currentLoc = ref({});
const runtimeConfig = useRuntimeConfig();

// woosmap map api fetch call

// Initialize and add the map
let map: woosmap.map.Map;

function initMap(): void {
  // The location of London
  const position: woosmap.map.LatLngLiteral = {
    lat: 51.50940214,
    lng: -0.133012,
  };

  // The map, centered at London
  map = new woosmap.map.Map(document?.getElementById("map") as HTMLElement, {
    zoom: 13,
    center: position,
  });
}


useHead({
    script: [{
        src: `https://sdk.woosmap.com/map/map.js?key=${runtimeConfig.public.woosmapKey}&callback=initMap`,
        defer: true
    }]
})

onMounted(() => {
    window.initMap = initMap;
    navigator.geolocation.getCurrentPosition((position) => {
        currentLoc.value = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        };
    });
});
</script>

<style>
#map {
    height: 600px;
    width: 100%;
}
</style>
