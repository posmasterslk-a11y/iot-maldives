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
      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <!-- Active Devices -->
        <UDashboardCard
          title="Active Devices"
          description="Number of flow meters online"
          icon="i-heroicons-cpu-chip"
        >
          <div v-if="isLoading" class="h-8 w-16 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mt-2"></div>
          <div v-else class="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {{ dashboardStore.stats.activeDevices || 0 }}
          </div>
        </UDashboardCard>

        <!-- Cumulative Flow -->
        <UDashboardCard
          title="Cumulative Flow (Totalizer)"
          description="Total liters dispensed across all devices"
          icon="i-heroicons-beaker"
        >
          <div v-if="isLoading" class="h-8 w-32 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mt-2"></div>
          <div v-else class="text-3xl font-bold text-gray-900 dark:text-white mt-2 text-yellow-500">
            {{ dashboardStore.stats.totalFuelDispensed || 0 }} L
          </div>
        </UDashboardCard>

        <!-- Last Update -->
        <UDashboardCard
          title="Last Update"
          description="Latest data sync from Yunyi API"
          icon="i-heroicons-clock"
        >
          <div v-if="isLoading" class="h-8 w-40 bg-gray-200 dark:bg-gray-800 animate-pulse rounded mt-2"></div>
          <div v-else class="text-xl font-bold text-gray-900 dark:text-white mt-2">
            {{ lastUpdateTime || 'N/A' }}
          </div>
        </UDashboardCard>
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
