<script setup lang="ts">
import { useDashboardStore } from '../stores/dashboard'
import { useDeviceStore } from '../stores/device'
import { ref, computed, onMounted } from 'vue'

const dashboardStore = useDashboardStore()
const deviceStore = useDeviceStore()
const isLoading = ref(true)

const columns = [
  { accessorKey: 'code', header: 'Device ID', id: 'code' },
  { accessorKey: 'location', header: 'Location', id: 'location' },
  { accessorKey: 'lastReading', header: 'Last Reading Time', id: 'lastReading' },
  { accessorKey: 'totalizer', header: 'Totalizer (Liters)', id: 'totalizer' }
]

const recentDevices = computed(() => deviceStore.devices.slice(0, 5))

const lastUpdateTime = computed(() => {
  if (deviceStore.devices.length > 0) {
    return deviceStore.devices[0].lastReading;
  }
  return 'N/A';
})

onMounted(async () => {
  isLoading.value = true
  try {
    await deviceStore.fetchDevices()
    
    const totalizerSum = deviceStore.devices.reduce((acc, d) => acc + (d.totalizer || 0), 0)

    dashboardStore.updateStats({
      activeDevices: deviceStore.devices.filter(d => d.status === 'online').length,
      activeSessions: 0,
      totalFuelDispensed: totalizerSum,
      averageTankLevel: 0,
    })
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <UDashboardPanel id="dashboard">
    <template #header>
      <UDashboardNavbar title="Dashboard" />
    </template>

    <template #body>
      <!-- Error Alert -->
      <UAlert
        v-if="deviceStore.error"
        color="red"
        variant="soft"
        icon="i-lucide-alert-triangle"
        title="Connection Issue"
        :description="`Failed to sync with the flow meter API. The server might be slow or offline. Details: ${deviceStore.error}`"
        class="mb-6"
        :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'gray', variant: 'link', padded: false }"
        @close="deviceStore.error = null"
      />

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <!-- Active Devices -->
        <UCard class="shadow-sm">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <UIcon name="i-lucide-activity" class="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Active Flow Meters</p>
              <div v-if="isLoading" class="h-8 w-16 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mt-1"></div>
              <div v-else class="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {{ dashboardStore.stats.activeDevices || 0 }}
              </div>
            </div>
          </div>
        </UCard>

        <!-- Cumulative Flow -->
        <UCard class="shadow-sm border-t-4 border-t-yellow-500">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <UIcon name="i-lucide-droplets" class="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Fuel Dispensed</p>
              <div v-if="isLoading" class="h-8 w-32 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mt-1"></div>
              <div v-else class="text-3xl font-bold text-yellow-600 dark:text-yellow-500 mt-1">
                {{ dashboardStore.stats.totalFuelDispensed || 0 }} <span class="text-xl font-semibold">L</span>
              </div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Devices Table -->
      <UDashboardCard
        title="Flow Meters Overview"
        description="Recent readings from all connected flow meters."
        icon="i-heroicons-table-cells"
      >
        <UTable :data="recentDevices" :columns="columns" :loading="isLoading">
          <template #lastReading-cell="{ row }">
            {{ row.original.lastReading }}
          </template>
        </UTable>
      </UDashboardCard>
    </template>
  </UDashboardPanel>
</template>
