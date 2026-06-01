<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <div class="w-1/3">
        <UInput
          v-model="searchQuery"
          icon="i-heroicons-magnifying-glass-20-solid"
          placeholder="Search devices by code..."
          size="sm"
        />
      </div>
      <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-path" @click="refresh" :loading="loading" />
    </div>

    <UTable
      :data="filteredDevices"
      :columns="columns"
      :loading="loading"
      class="w-full"
    >
      <template #status-cell="{ row }">
        <UBadge :color="getStatusColor(row.original.status)" variant="subtle">
          {{ row.original.status.toUpperCase() }}
        </UBadge>
      </template>

      <template #lastReading-cell="{ row }">
        {{ new Date(row.original.lastReading).toLocaleString() }}
      </template>

      <template #actions-cell="{ row }">
        <UDropdown :items="getActionItems(row.original)">
          <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
        </UDropdown>
      </template>
    </UTable>

    <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
      <UPagination v-model="page" :page-count="pageSize" :total="filteredDevices.length" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Device } from '../types'

const props = defineProps<{
  devices: Device[]
  loading: boolean
}>()

const emit = defineEmits(['refresh'])

const router = useRouter()
const searchQuery = ref('')
const page = ref(1)
const pageSize = ref(10)

const columns = [
  { accessorKey: 'code', header: 'Device Code', id: 'code' },
  { accessorKey: 'deviceType', header: 'Device Type', id: 'deviceType' },
  { accessorKey: 'lastReading', header: 'Last Reading', id: 'lastReading' },
  { accessorKey: 'battery_voltage', header: 'Battery (V)', id: 'battery_voltage' },
  { accessorKey: 'status', header: 'Status', id: 'status' },
  { id: 'actions', header: 'Actions' }
]

const filteredDevices = computed(() => {
  let result = props.devices

  if (searchQuery.value) {
    result = result.filter(d => d.code.toLowerCase().includes(searchQuery.value.toLowerCase()))
  }

  // Pagination (client-side for this mock table)
  const start = (page.value - 1) * pageSize.value
  return result.slice(start, start + pageSize.value)
})

const getStatusColor = (status: string) => {
  if (status === 'online') return 'green'
  if (status === 'alarm') return 'red'
  return 'gray'
}

const getActionItems = (row: Device) => [
  [{
    label: 'View Data',
    icon: 'i-heroicons-eye',
    click: () => router.push(`/devices/${row.code}?type=${row.deviceType}`)
  }],
  [{
    label: 'Edit Settings',
    icon: 'i-heroicons-cog-8-tooth'
  }]
]

const refresh = () => {
  emit('refresh')
}
</script>
