<template>
  <div class="h-96 w-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 z-0">
    <client-only>
      <l-map ref="map" :zoom="zoom" :center="center" :use-global-leaflet="false">
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          layer-type="base"
          name="OpenStreetMap"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        ></l-tile-layer>
        <l-marker v-if="hasLocation" :lat-lng="center">
          <l-popup>
            <div>
              <strong>Device: {{ deviceCode }}</strong><br>
              Lat: {{ center[0] }}<br>
              Lng: {{ center[1] }}<br>
              Last Updated: {{ lastUpdated }}
            </div>
          </l-popup>
        </l-marker>
      </l-map>
    </client-only>
    <div v-if="!hasLocation" class="flex h-full items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500">
      No GPS data available for this device.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps<{
  deviceCode: string
  data: any[]
}>()

const zoom = ref(13)

const hasLocation = computed(() => {
  if (!props.data || props.data.length === 0) return false
  const latest = props.data[0]
  return latest.gps_latitude && latest.gps_longitude
})

const center = computed(() => {
  if (hasLocation.value) {
    const latest = props.data[0]
    return [Number(latest.gps_latitude), Number(latest.gps_longitude)]
  }
  // Default to somewhere central if no data
  return [0, 0]
})

const lastUpdated = computed(() => {
  if (props.data && props.data.length > 0) {
    return new Date(props.data[0].created_at).toLocaleString()
  }
  return '-'
})
</script>

<style>
/* Leaflet fixes for Nuxt */
.leaflet-container {
  height: 100%;
  width: 100%;
  z-index: 1;
}
</style>
