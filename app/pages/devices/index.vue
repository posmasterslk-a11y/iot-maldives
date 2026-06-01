<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:text-3xl sm:truncate">
        Devices
      </h2>
      <UButton color="primary" icon="i-heroicons-plus">Add Device</UButton>
    </div>

    <UCard>
      <DeviceTable 
        :devices="deviceStore.devices" 
        :loading="deviceStore.loading" 
        @refresh="refreshDevices" 
      />
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useDeviceStore } from '../../stores/device'

definePageMeta({
  middleware: 'auth'
})

const deviceStore = useDeviceStore()

const refreshDevices = async () => {
  await deviceStore.fetchDevices()
}

onMounted(() => {
  refreshDevices()
})
</script>
