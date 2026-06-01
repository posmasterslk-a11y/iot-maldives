<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
          <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" @click="router.back()" />
          <span>Device: {{ deviceCode }}</span>
          <UBadge color="gray" variant="solid" class="ml-2 uppercase">{{ deviceType }}</UBadge>
        </h2>
      </div>

      <div class="flex items-center space-x-2">
        <!-- Date Range (Mocked as text inputs for simplicity in this example, Nuxt UI DatePicker can be used for prod) -->
        <div class="flex space-x-2">
          <UInput type="date" v-model="startDate" size="sm" />
          <UInput type="date" v-model="endDate" size="sm" />
        </div>
        
        <USelect v-model="pageSize" :options="[10, 20, 50, 100, 200]" size="sm" />

        <div class="flex items-center space-x-2 border-l pl-2 dark:border-gray-700">
          <UToggle v-model="autoRefresh" label="Auto Refresh" />
          <span class="text-xs text-gray-500">60s</span>
        </div>

        <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-path" @click="fetchData" :loading="deviceStore.loading" />
        
        <UDropdown :items="exportItems">
          <UButton color="primary" variant="outline" icon="i-heroicons-arrow-down-tray">Export</UButton>
        </UDropdown>
      </div>
    </div>

    <!-- Tabs for Data, Chart, Map -->
    <UTabs :items="tabItems" class="w-full">
      <template #data>
        <UCard class="mt-4 overflow-x-auto">
          <UTable
            :data="deviceStore.currentDeviceData"
            :columns="dynamicColumns"
            :loading="deviceStore.loading"
          >
            <template #created_at-cell="{ row }">
              {{ new Date(row.original.created_at).toLocaleString() }}
            </template>
          </UTable>

          <div class="flex justify-between items-center px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
            <span class="text-sm text-gray-500">Total: {{ deviceStore.currentDeviceTotal }}</span>
            <UPagination
              v-model="page"
              :page-count="pageSize"
              :total="deviceStore.currentDeviceTotal"
            />
          </div>
        </UCard>
      </template>

      <template #chart>
        <div class="mt-4">
          <DeviceCharts :data="deviceStore.currentDeviceData" />
        </div>
      </template>

      <template #map>
        <div class="mt-4">
          <DeviceMap :device-code="deviceCode" :data="deviceStore.currentDeviceData" />
        </div>
      </template>
    </UTabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDeviceStore } from '../../stores/device'
import { exportToCSV, exportToExcel } from '../../utils/export'
import DeviceCharts from '../../components/DeviceCharts.vue'
import DeviceMap from '../../components/DeviceMap.vue'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const router = useRouter()
const deviceStore = useDeviceStore()

const deviceCode = computed(() => route.params.code as string)
const deviceType = computed(() => route.query.type as string || 'Unknown')

const startDate = ref('')
const endDate = ref('')
const page = ref(1)
const pageSize = ref(10)
const autoRefresh = ref(false)
let refreshInterval: any = null

const tabItems = [
  { label: 'Data Table', slot: 'data', icon: 'i-heroicons-table-cells' },
  { label: 'Charts', slot: 'chart', icon: 'i-heroicons-chart-bar' },
  { label: 'Map View', slot: 'map', icon: 'i-heroicons-map' }
]

const exportItems = [
  [{
    label: 'Export CSV',
    icon: 'i-heroicons-document-text',
    click: () => exportToCSV(deviceStore.currentDeviceData, `${deviceCode.value}_data.csv`)
  }],
  [{
    label: 'Export Excel',
    icon: 'i-heroicons-table-cells',
    click: () => exportToExcel(deviceStore.currentDeviceData, `${deviceCode.value}_data.xlsx`)
  }]
]

// Dynamically generate columns based on the first row of data
const dynamicColumns = computed(() => {
  const data = deviceStore.currentDeviceData
  if (!data || data.length === 0) {
    return [{ accessorKey: 'created_at', header: 'Time', id: 'created_at' }]
  }
  
  const firstRow = data[0]
  const keys = Object.keys(firstRow)
  
  return keys.map(key => {
    let header = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')
    // Prioritize timestamp
    if (key === 'created_at') header = 'Time'
    return { accessorKey: key, header, id: key, sortable: true }
  })
})

const fetchData = async () => {
  await deviceStore.fetchDeviceData({
    code: deviceCode.value,
    deviceType: deviceType.value,
    start: startDate.value,
    end: endDate.value,
    page: page.value,
    pageSize: pageSize.value
  })
}

watch([page, pageSize, startDate, endDate], () => {
  fetchData()
})

watch(autoRefresh, (newVal) => {
  if (newVal) {
    refreshInterval = setInterval(fetchData, 60000)
  } else {
    if (refreshInterval) clearInterval(refreshInterval)
  }
})

onMounted(() => {
  fetchData()
})

onUnmounted(() => {
  if (refreshInterval) clearInterval(refreshInterval)
})
</script>
