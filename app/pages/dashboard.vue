<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <!-- Active Pumps -->
      <UCard>
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <UIcon name="i-heroicons-cpu-chip" class="h-6 w-6 text-green-500" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Active Devices</dt>
              <dd class="flex items-baseline">
                <div v-if="isLoading" class="h-8 w-16 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-1"></div>
                <div v-else class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ dashboardStore.stats.activeDevices || 0 }}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </UCard>
      
      <!-- Total Fuel Dispensed -->
      <UCard>
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <UIcon name="i-heroicons-beaker" class="h-6 w-6 text-yellow-500" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Cumulative Flow (Totalizer)</dt>
              <dd class="flex items-baseline">
                <div v-if="isLoading" class="h-8 w-32 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-1"></div>
                <div v-else class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ dashboardStore.stats.totalFuelDispensed || 0 }} L
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </UCard>
      
      <!-- Last Update -->
      <UCard>
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <UIcon name="i-heroicons-clock" class="h-6 w-6 text-teal-500" />
          </div>
          <div class="ml-5 w-0 flex-1">
            <dl>
              <dt class="text-sm font-medium text-gray-500 truncate">Last Update</dt>
              <dd class="flex items-baseline">
                <div v-if="isLoading" class="h-7 w-40 bg-gray-200 dark:bg-gray-700 animate-pulse rounded mt-1"></div>
                <div v-else class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ lastUpdateTime || 'N/A' }}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </UCard>
    </div>
    
    <div class="mt-8">
      <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
        Flow Meters Overview
      </h3>
      <div class="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <UTable :data="recentDevices" :columns="columns" :loading="isLoading">
          <template #lastReading-cell="{ row }">
            {{ row.original.lastReading }}
          </template>
        </UTable>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDashboardStore } from '../stores/dashboard'
import { useDeviceStore } from '../stores/device'
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'admin'
})

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
