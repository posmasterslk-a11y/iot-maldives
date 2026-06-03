<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    
    <!-- Fuel Usage Trend (Wide) -->
    <div class="lg:col-span-2 bg-[#0b162c] border border-[#1e2a3b] rounded-xl p-5 shadow-lg">
      <div class="mb-4">
        <h3 class="text-white font-bold text-lg">Fuel Usage Trend</h3>
        <p class="text-slate-500 text-xs">30-day daily consumption (litres)</p>
      </div>
      <div class="h-64">
        <Line :data="usageTrendData" :options="lineOptions" />
      </div>
    </div>

    <!-- Daily Consumption Bar -->
    <div class="bg-[#0b162c] border border-[#1e2a3b] rounded-xl p-5 shadow-lg">
      <div class="mb-4">
        <h3 class="text-white font-bold text-base">Daily Consumption</h3>
        <p class="text-slate-500 text-xs">Last 14 days (L/day)</p>
      </div>
      <div class="h-52">
        <Bar :data="dailyBarData" :options="barOptions" />
      </div>
    </div>

    <!-- Weekly Consumption Bar -->
    <div class="bg-[#0b162c] border border-[#1e2a3b] rounded-xl p-5 shadow-lg">
      <div class="mb-4">
        <h3 class="text-white font-bold text-base">Weekly Consumption</h3>
        <p class="text-slate-500 text-xs">Per week summary (L)</p>
      </div>
      <div class="h-52">
        <Bar :data="weeklyBarData" :options="barOptions" />
      </div>
    </div>

    <!-- Monthly Consumption Bar -->
    <div class="bg-[#0b162c] border border-[#1e2a3b] rounded-xl p-5 shadow-lg">
      <div class="mb-4">
        <h3 class="text-white font-bold text-base">Monthly Consumption</h3>
        <p class="text-slate-500 text-xs">2025 YTD (L/month)</p>
      </div>
      <div class="h-52">
        <Bar :data="monthlyBarData" :options="barOptions" />
      </div>
    </div>

    <!-- Tank Level History Line -->
    <div class="bg-[#0b162c] border border-[#1e2a3b] rounded-xl p-5 shadow-lg">
      <div class="mb-4">
        <h3 class="text-white font-bold text-base">Tank Level History</h3>
        <p class="text-slate-500 text-xs">30-day tank level (%)</p>
      </div>
      <div class="h-52">
        <Line :data="tankLevelData" :options="levelOptions" />
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line, Bar } from 'vue-chartjs'

// Register ChartJS plugins
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const props = defineProps<{
  station: any
}>()

// --- Chart Configs & Mock Data ---

const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#070b10',
      titleColor: '#fff',
      bodyColor: '#00d2ff',
      borderColor: '#1e2a3b',
      borderWidth: 1,
      padding: 10,
      displayColors: false,
    }
  },
  scales: {
    x: {
      grid: { color: '#1e2a3b', drawBorder: false, tickLength: 0 },
      ticks: { color: '#597393', font: { size: 10 } },
      border: { display: false }
    },
    y: {
      grid: { color: '#1e2a3b', drawBorder: false, borderDash: [5, 5] },
      ticks: { color: '#597393', font: { size: 10 }, padding: 10 },
      border: { display: false },
      beginAtZero: true
    }
  }
}

const lineOptions = {
  ...commonOptions,
  elements: {
    line: { tension: 0.4, borderWidth: 2 },
    point: { radius: 0, hitRadius: 10, hoverRadius: 4 }
  }
}

const levelOptions = {
  ...lineOptions,
  scales: {
    ...lineOptions.scales,
    y: {
      ...lineOptions.scales.y,
      max: 100,
      ticks: { stepSize: 25, color: '#597393', font: { size: 10 } }
    }
  }
}

const barOptions = {
  ...commonOptions,
  elements: {
    bar: { borderRadius: 4 }
  }
}

// Generate realistic mock data
const generateData = (length: number, min: number, max: number) => {
  return Array.from({ length }, () => Math.floor(Math.random() * (max - min + 1) + min))
}

const getDates = (daysAgo: number) => {
  const dates = []
  for (let i = daysAgo; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    dates.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
  }
  return dates
}

const usageTrendData = computed(() => ({
  labels: getDates(30),
  datasets: [{
    label: 'Usage (L)',
    data: generateData(31, 300, 1200),
    borderColor: '#00d2ff',
    backgroundColor: 'transparent',
  }]
}))

const dailyBarData = computed(() => ({
  labels: getDates(14),
  datasets: [{
    label: 'Daily Usage (L)',
    data: generateData(15, 300, 1200),
    backgroundColor: '#d97706', // amber-600
    hoverBackgroundColor: '#f59e0b',
  }]
}))

const weeklyBarData = computed(() => ({
  labels: ['W1 May', 'W2 May', 'W3 May', 'W4 May', 'W1 Jun'],
  datasets: [{
    label: 'Weekly Usage (L)',
    data: [7200, 6800, 7500, 6900, 7100],
    backgroundColor: '#9333ea', // purple-600
    hoverBackgroundColor: '#a855f7',
  }]
}))

const monthlyBarData = computed(() => ({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [{
    label: 'Monthly Usage (L)',
    data: [28000, 27500, 31000, 29000, 30500, 12000],
    backgroundColor: '#10b981', // emerald-500
    hoverBackgroundColor: '#34d399',
  }]
}))

const tankLevelData = computed(() => {
  const data = []
  let current = 85
  for (let i = 0; i <= 30; i++) {
    current = current - Math.random() * 5
    if (current < 20) current = 95 // Refill
    data.push(current)
  }
  return {
    labels: getDates(30),
    datasets: [{
      label: 'Level (%)',
      data: data.reverse(), // reverse so recent is current
      borderColor: '#06b6d4', // cyan-500
      backgroundColor: 'transparent',
    }]
  }
})
</script>
