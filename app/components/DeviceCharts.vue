<template>
  <div class="space-y-4">
    <div class="flex items-center space-x-4 mb-4">
      <div class="text-sm font-medium">Select Data to Plot:</div>
      <USelectMenu
        v-model="selectedKeys"
        :options="numericKeys"
        multiple
        placeholder="Select metrics"
        class="min-w-[200px]"
      />
    </div>

    <div v-if="selectedKeys.length > 0" class="h-96 w-full bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      <Line :data="chartData" :options="chartOptions" />
    </div>
    <div v-else class="h-96 flex items-center justify-center bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-500">
      Select at least one metric to visualize data.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const props = defineProps<{
  data: any[]
}>()

const numericKeys = computed(() => {
  if (!props.data || props.data.length === 0) return []
  const firstRow = props.data[0]
  const keys = Object.keys(firstRow).filter(key => 
    !['created_at', 'status', 'event', 'event_desc', 'id'].includes(key) &&
    !isNaN(Number(firstRow[key]))
  )
  return keys
})

const selectedKeys = ref<string[]>([])

// Auto-select first key if none selected when data arrives
watch(numericKeys, (newKeys) => {
  if (selectedKeys.value.length === 0 && newKeys.length > 0) {
    selectedKeys.value = [newKeys[0]]
  }
}, { immediate: true })

const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

const chartData = computed(() => {
  const reversedData = [...props.data].reverse() // chronological order

  return {
    labels: reversedData.map(d => new Date(d.created_at).toLocaleTimeString()),
    datasets: selectedKeys.value.map((key, index) => ({
      label: key.toUpperCase(),
      data: reversedData.map(d => Number(d[key])),
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length],
      tension: 0.3,
      fill: false
    }))
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: '#9ca3af'
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: '#9ca3af'
      },
      grid: {
        color: 'rgba(156, 163, 175, 0.1)'
      }
    },
    y: {
      ticks: {
        color: '#9ca3af'
      },
      grid: {
        color: 'rgba(156, 163, 175, 0.1)'
      }
    }
  }
}
</script>
