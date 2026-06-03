<template>
  <div v-if="station" class="h-full flex flex-col p-8 overflow-y-auto max-w-[1600px] mx-auto w-full custom-scrollbar">
    <!-- Header -->
    <div class="flex items-start justify-between mb-8">
      <div class="flex items-center gap-4">
        <NuxtLink to="/stations" class="w-10 h-10 rounded-full bg-[#162032] border border-[#1e2a3b] flex items-center justify-center hover:bg-[#1e2a3b] transition-colors group">
          <UIcon name="i-lucide-arrow-left" class="w-5 h-5 text-slate-400 group-hover:text-white" />
        </NuxtLink>
        
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-3xl font-bold text-white tracking-wide">{{ station.code }}</h1>
            <span class="text-slate-400 text-xl">{{ station.name }}</span>
            <div 
              class="px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ml-2"
              :class="statusColors"
            >
              <UIcon :name="statusIcon" class="w-3.5 h-3.5" />
              {{ station.status }}
            </div>
          </div>
          <p class="text-slate-500 text-sm mt-1">Fuel Station Detail - Real-time monitoring</p>
        </div>
      </div>
    </div>

    <!-- Top Grid: Tank Info & KPI Cards -->
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
      
      <!-- Tank Information Panel -->
      <div class="xl:col-span-5 bg-[#0b162c] border border-[#1e2a3b] rounded-xl p-6 shadow-lg flex flex-col">
        <div class="flex items-center gap-2 mb-8 text-[#00d2ff] text-sm font-bold tracking-widest uppercase">
          <UIcon name="i-lucide-database" class="w-4 h-4" />
          Tank Information
        </div>

        <!-- Big Visual Tank -->
        <div class="relative h-20 w-full mb-8">
          <!-- Glass capsule -->
          <div class="absolute inset-0 rounded-full border border-[#1e2a3b] bg-[#070b10] overflow-hidden">
            <!-- Fill level -->
            <div 
              class="absolute top-0 bottom-0 left-0 transition-all duration-1000 ease-in-out"
              :class="tankColor"
              :style="{ width: `${fillPercentage}%` }"
            ></div>
            <!-- Glass glare -->
            <div class="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent"></div>
            <!-- Percentage Text -->
            <div class="absolute inset-0 flex items-center justify-center font-bold text-white z-10 drop-shadow-md">
              {{ fillPercentage }}%
            </div>
          </div>
          <!-- Left/Right End Caps -->
          <div class="absolute top-0 bottom-0 -left-2 w-4 bg-[#162032] rounded-full border border-[#1e2a3b] shadow-inner"></div>
          <div class="absolute top-0 bottom-0 -right-2 w-4 bg-[#162032] rounded-full border border-[#1e2a3b] shadow-inner"></div>
        </div>

        <div class="space-y-4 text-sm mt-auto">
          <div class="flex justify-between items-center border-b border-[#1e2a3b] pb-2">
            <span class="text-slate-500">Tank Capacity</span>
            <span class="text-white font-mono font-bold">{{ formatNumber(station.maxVolume) }} L</span>
          </div>
          <div class="flex justify-between items-center border-b border-[#1e2a3b] pb-2">
            <span class="text-slate-500">Current Volume</span>
            <span class="text-[#00d2ff] font-mono font-bold text-base">{{ formatNumber(station.currentVolume) }} L</span>
          </div>
          <div class="flex justify-between items-center border-b border-[#1e2a3b] pb-2">
            <span class="text-slate-500">Fill Percentage</span>
            <span class="text-[#00d2ff] font-mono font-bold">{{ fillPercentage }}%</span>
          </div>
          <div class="flex justify-between items-center border-b border-[#1e2a3b] pb-2">
            <span class="text-slate-500">Last Filled</span>
            <span class="text-white font-medium">{{ station.lastFilled }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-500">Last Used</span>
            <span class="text-white font-medium">{{ station.lastUsed }}</span>
          </div>
        </div>
      </div>

      <!-- KPI Cards (2x3 Grid) -->
      <div class="xl:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Real-time Fuel Level -->
        <div class="bg-[#0b162c] border border-[#1e2a3b] rounded-xl p-5 shadow-lg flex flex-col justify-center">
          <div class="flex items-center gap-2 text-slate-500 text-xs font-bold tracking-widest uppercase mb-3">
            <UIcon name="i-lucide-activity" class="w-3.5 h-3.5 text-[#00d2ff]" /> Real-time Fuel Level
          </div>
          <div class="text-3xl font-bold text-[#00d2ff] font-mono">{{ fillPercentage }}%</div>
          <div class="text-slate-500 text-sm mt-1">{{ formatNumber(station.currentVolume) }} L remaining</div>
        </div>
        
        <!-- Real-time Flow Rate -->
        <div class="bg-[#0b162c] border border-[#1e2a3b] rounded-xl p-5 shadow-lg flex flex-col justify-center">
          <div class="flex items-center gap-2 text-slate-500 text-xs font-bold tracking-widest uppercase mb-3">
            <UIcon name="i-lucide-gauge" class="w-3.5 h-3.5 text-teal-400" /> Real-time Flow Rate
          </div>
          <div class="text-3xl font-bold text-teal-400 font-mono">41 L/hr</div>
          <div class="text-slate-500 text-sm mt-1">Current dispensing rate</div>
        </div>

        <!-- Daily Consumption -->
        <div class="bg-[#0b162c] border border-[#1e2a3b] rounded-xl p-5 shadow-lg flex flex-col justify-center">
          <div class="flex items-center gap-2 text-slate-500 text-xs font-bold tracking-widest uppercase mb-3">
            <UIcon name="i-lucide-trending-down" class="w-3.5 h-3.5 text-orange-400" /> Daily Consumption
          </div>
          <div class="text-3xl font-bold text-orange-400 font-mono">{{ formatNumber(station.todaysUsage) }} L</div>
          <div class="text-slate-500 text-sm mt-1">Dispensed today</div>
        </div>

        <!-- Weekly Consumption -->
        <div class="bg-[#0b162c] border border-[#1e2a3b] rounded-xl p-5 shadow-lg flex flex-col justify-center">
          <div class="flex items-center gap-2 text-slate-500 text-xs font-bold tracking-widest uppercase mb-3">
            <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5 text-purple-400" /> Weekly Consumption
          </div>
          <div class="text-3xl font-bold text-purple-400 font-mono">{{ formatNumber(station.todaysUsage * 7) }} L</div>
          <div class="text-slate-500 text-sm mt-1">Past 7 days</div>
        </div>

        <!-- Monthly Consumption -->
        <div class="bg-[#0b162c] border border-[#1e2a3b] rounded-xl p-5 shadow-lg flex flex-col justify-center">
          <div class="flex items-center gap-2 text-slate-500 text-xs font-bold tracking-widest uppercase mb-3">
            <UIcon name="i-lucide-pie-chart" class="w-3.5 h-3.5 text-green-400" /> Monthly Consumption
          </div>
          <div class="text-3xl font-bold text-green-400 font-mono">{{ formatNumber(station.todaysUsage * 30) }} L</div>
          <div class="text-slate-500 text-sm mt-1">Past 30 days</div>
        </div>

        <!-- Flow Meter Reading -->
        <div class="bg-[#0b162c] border border-[#1e2a3b] rounded-xl p-5 shadow-lg flex flex-col justify-center">
          <div class="flex items-center gap-2 text-slate-500 text-xs font-bold tracking-widest uppercase mb-3">
            <UIcon name="i-lucide-rotate-cw" class="w-3.5 h-3.5 text-[#00d2ff]" /> Flow Meter Reading
          </div>
          <div class="text-3xl font-bold text-[#00d2ff] font-mono">{{ formatNumber(station.flowMeter) }} L</div>
          <div class="text-slate-500 text-sm mt-1">Cumulative total</div>
        </div>
      </div>
    </div>

    <!-- Charts Grid -->
    <DashboardStationCharts :station="station" />
  </div>
  <div v-else class="h-full flex items-center justify-center">
    <div class="text-slate-500">Loading station data...</div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDashboardStore } from '../../stores/dashboard'

const route = useRoute()
const store = useDashboardStore()
const stationCode = route.params.code as string

onMounted(() => {
  if (stationCode === 'CCN') {
    store.fetchRealData()
  }
})

const station = computed(() => {
  return store.stations.find(s => s.code === stationCode)
})

const fillPercentage = computed(() => {
  if (!station.value) return 0
  return Math.min(100, Math.round((station.value.currentVolume / station.value.maxVolume) * 100))
})

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num)
}

// Styling computed props
const statusColors = computed(() => {
  if (!station.value) return ''
  switch (station.value.status) {
    case 'Serviceable': return 'text-green-400 border-green-500/30 bg-green-500/10'
    case 'Unserviceable': return 'text-red-400 border-red-500/30 bg-red-500/10'
    case 'Tank Cleaning': return 'text-orange-400 border-orange-500/30 bg-orange-500/10'
    case 'Maintenance': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'
    case 'Offline': return 'text-gray-400 border-gray-500/50 bg-gray-500/20'
    default: return 'text-gray-400 border-gray-500/30 bg-gray-500/10'
  }
})

const statusIcon = computed(() => {
  if (!station.value) return ''
  switch (station.value.status) {
    case 'Serviceable': return 'i-lucide-check-circle-2'
    case 'Unserviceable': return 'i-lucide-alert-circle'
    case 'Tank Cleaning': return 'i-lucide-droplets'
    case 'Maintenance': return 'i-lucide-wrench'
    case 'Offline': return 'i-lucide-wifi-off'
    default: return 'i-lucide-info'
  }
})

const tankColor = computed(() => {
  if (!station.value) return ''
  switch (station.value.status) {
    case 'Serviceable': return 'bg-[#00d2ff] shadow-[0_0_15px_rgba(0,210,255,0.5)]'
    case 'Unserviceable': return 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
    case 'Tank Cleaning': return 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]'
    case 'Maintenance': return 'bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]'
    case 'Offline': return 'bg-gray-600 shadow-none'
    default: return 'bg-[#00d2ff]'
  }
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #1e293b;
  border-radius: 20px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: #334155;
}
</style>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #1e293b;
  border-radius: 20px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: #334155;
}
</style>
