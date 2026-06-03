<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  station: {
    code: string
    name: string
    status: string
    currentVolume: number
    maxVolume: number
    todaysUsage: number
    flowMeter: number
    lastUsed: string
    lastFilled: string
  }
}>()

const statusColors = computed(() => {
  switch (props.station.status) {
    case 'Serviceable': return 'text-green-400 border-green-500/30 bg-green-500/10'
    case 'Unserviceable': return 'text-red-400 border-red-500/30 bg-red-500/10'
    case 'Tank Cleaning': return 'text-orange-400 border-orange-500/30 bg-orange-500/10'
    case 'Maintenance': return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'
    case 'Offline': return 'text-gray-400 border-gray-500/50 bg-gray-500/20'
    default: return 'text-gray-400 border-gray-500/30 bg-gray-500/10'
  }
})

const statusIcon = computed(() => {
  switch (props.station.status) {
    case 'Serviceable': return 'i-lucide-check-circle-2'
    case 'Unserviceable': return 'i-lucide-alert-circle'
    case 'Tank Cleaning': return 'i-lucide-droplets'
    case 'Maintenance': return 'i-lucide-wrench'
    case 'Offline': return 'i-lucide-wifi-off'
    default: return 'i-lucide-info'
  }
})

const borderColors = computed(() => {
  switch (props.station.status) {
    case 'Serviceable': return 'border-t-green-500'
    case 'Unserviceable': return 'border-t-red-500'
    case 'Tank Cleaning': return 'border-t-orange-500'
    case 'Maintenance': return 'border-t-yellow-500'
    case 'Offline': return 'border-t-gray-500 opacity-70 grayscale'
    default: return 'border-t-[#1e2a3b]'
  }
})

const fillPercentage = computed(() => {
  return Math.min(100, Math.round((props.station.currentVolume / props.station.maxVolume) * 100))
})

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num)
}

const tankColor = computed(() => {
    switch (props.station.status) {
    case 'Serviceable': return 'bg-[#00d2ff] shadow-[0_0_15px_rgba(0,210,255,0.5)]'
    case 'Unserviceable': return 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
    case 'Tank Cleaning': return 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]'
    case 'Maintenance': return 'bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]'
    case 'Offline': return 'bg-gray-600 shadow-none'
    default: return 'bg-[#00d2ff]'
  }
})
</script>

<template>
  <div :class="`bg-[#101722] border border-[#1e2a3b] border-t-2 rounded-xl p-5 flex flex-col gap-4 shadow-lg hover:shadow-xl transition-shadow ${borderColors}`">
    
    <!-- Header -->
    <div class="flex justify-between items-start">
      <div>
        <h3 class="text-xl font-bold text-white tracking-wider">{{ station.code }}</h3>
        <p class="text-[#597393] text-xs font-medium mt-0.5">{{ station.name }}</p>
      </div>
      <div :class="`px-2.5 py-1 rounded-full border text-[11px] font-semibold flex items-center gap-1.5 ${statusColors}`">
        <UIcon :name="statusIcon" class="w-3.5 h-3.5" />
        {{ station.status }}
      </div>
    </div>

    <!-- Tank Graphic -->
    <div class="mt-2 relative w-full h-10 bg-[#0b0f16] border border-[#1e2a3b] rounded-full overflow-hidden shadow-inner flex items-center justify-center p-1">
      <div class="absolute inset-1 rounded-full overflow-hidden bg-[#162032]">
        <div 
          class="h-full rounded-full transition-all duration-1000 ease-out" 
          :class="tankColor"
          :style="{ width: `${fillPercentage}%` }"
        ></div>
      </div>
      <span class="relative z-10 text-[10px] font-bold text-white mix-blend-difference">{{ fillPercentage }}%</span>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 gap-4 mt-2">
      <div>
        <p class="text-[#597393] text-[10px] font-bold uppercase tracking-wider mb-1">Current Volume</p>
        <div class="flex items-baseline gap-1">
          <span class="text-xl font-bold text-white">{{ formatNumber(station.currentVolume) }}</span>
          <span class="text-[#597393] text-xs font-semibold">L</span>
        </div>
        <p class="text-[#4b607a] text-[11px] mt-0.5">of {{ formatNumber(station.maxVolume) }} L</p>
      </div>
      <div>
        <p class="text-[#597393] text-[10px] font-bold uppercase tracking-wider mb-1">Today's Usage</p>
        <div class="flex items-baseline gap-1">
          <span class="text-xl font-bold text-white">{{ formatNumber(station.todaysUsage) }}</span>
          <span class="text-[#597393] text-xs font-semibold">L</span>
        </div>
        <p class="text-[#4b607a] text-[11px] mt-0.5">{{ Math.round((station.todaysUsage / station.maxVolume)*100) }}% filled</p>
      </div>
    </div>

    <!-- Flow Meter -->
    <div class="mt-1 flex items-center justify-between py-2 border-t border-b border-[#1e2a3b]">
      <div class="flex items-center gap-2 text-[#00d2ff]">
        <UIcon name="i-lucide-gauge" class="w-4 h-4" />
        <span class="text-[10px] font-bold uppercase tracking-wider">Flow Meter</span>
      </div>
      <div class="font-bold text-[#00d2ff] tracking-widest">
        {{ formatNumber(station.flowMeter) }} <span class="text-xs">L</span>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between text-[#4b607a] text-[10px] font-medium mt-1">
      <div class="flex items-center gap-1.5">
        <UIcon name="i-lucide-clock" class="w-3.5 h-3.5" />
        Used: {{ station.lastUsed }}
      </div>
      <div class="flex items-center gap-1.5">
        <UIcon name="i-lucide-droplet" class="w-3.5 h-3.5" />
        Filled: {{ station.lastFilled }}
      </div>
    </div>

  </div>
</template>
