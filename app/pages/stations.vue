<template>
  <div class="h-full flex flex-col p-8 overflow-hidden max-w-[1600px] mx-auto w-full">
    <!-- Header -->
    <div class="flex justify-between items-end mb-8">
      <div>
        <div class="flex items-center gap-3 mb-2">
          <div class="w-1.5 h-6 bg-[#00d2ff] rounded-full shadow-[0_0_10px_rgba(0,210,255,0.5)]"></div>
          <h1 class="text-3xl font-bold text-white tracking-wide">Fuel Stations</h1>
        </div>
        <p class="text-slate-400 text-sm pl-4.5">All 30 fuel stations — Click a card to view details</p>
      </div>
      <div class="text-slate-500 text-sm font-mono tracking-wider">
        {{ filteredStations.length }} / 30 stations
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="flex flex-wrap items-center gap-4 mb-8">
      <!-- Search Input -->
      <div class="relative w-64">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <div class="i-lucide-search text-slate-500 w-4 h-4"></div>
        </div>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search stations..." 
          class="w-full bg-[#0b162c] border border-slate-700/50 rounded-xl py-2 pl-10 pr-4 text-slate-300 placeholder-slate-600 focus:outline-none focus:border-[#00d2ff]/50 focus:ring-1 focus:ring-[#00d2ff]/50 transition-all text-sm"
        />
      </div>

      <div class="h-6 w-px bg-slate-800 mx-2 hidden sm:block"></div>

      <!-- Filter Pills -->
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="filter in filters" :key="filter.label"
          @click="activeFilter = filter.label"
          class="px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-300"
          :class="[
            activeFilter === filter.label 
              ? 'bg-[#00d2ff]/20 border-[#00d2ff]/50 text-white shadow-[0_0_10px_rgba(0,210,255,0.2)]' 
              : 'bg-transparent border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'
          ]"
        >
          {{ filter.label }} ({{ filter.count }})
        </button>
      </div>
    </div>

    <!-- Scrollable Grid Area -->
    <div class="flex-1 overflow-y-auto pr-2 -mr-2 pb-8 custom-scrollbar">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        <StationCard 
          v-for="station in filteredStations" 
          :key="station.id" 
          :station="station"
          class="cursor-pointer hover:border-[#00d2ff]/40 transition-colors duration-300 hover:-translate-y-1"
        />
      </div>
      
      <!-- Empty State -->
      <div v-if="filteredStations.length === 0" class="flex flex-col items-center justify-center h-64 text-slate-500">
        <div class="i-lucide-search-x w-12 h-12 mb-4 opacity-50"></div>
        <p>No stations found matching your criteria</p>
        <button @click="resetFilters" class="mt-4 text-[#00d2ff] hover:underline text-sm">Clear filters</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDashboardStore } from '../stores/dashboard'
import StationCard from '../components/Dashboard/StationCard.vue'

const store = useDashboardStore()

onMounted(() => {
  store.fetchRealData()
})

const searchQuery = ref('')
const activeFilter = ref('All')

// Duplicate the stations to simulate 30 of them based on our 15 mock ones
const allStations = computed(() => {
  return [
    ...store.stations,
    ...store.stations.map(s => ({...s, id: s.id + '-copy', code: s.code + '2'}))
  ]
})

const filters = computed(() => {
  const counts = {
    'All': allStations.value.length,
    'Serviceable': allStations.value.filter(s => s.status === 'Serviceable').length,
    'Unserviceable': allStations.value.filter(s => s.status === 'Unserviceable').length,
    'Tank Cleaning': allStations.value.filter(s => s.status === 'Tank Cleaning').length,
    'Maintenance in Progress': allStations.value.filter(s => s.status === 'Maintenance').length,
  }
  
  return [
    { label: 'All', count: counts['All'] },
    { label: 'Serviceable', count: counts['Serviceable'] },
    { label: 'Unserviceable', count: counts['Unserviceable'] },
    { label: 'Tank Cleaning', count: counts['Tank Cleaning'] },
    { label: 'Maintenance in Progress', count: counts['Maintenance in Progress'] }
  ]
})

const filteredStations = computed(() => {
  let result = allStations.value

  // Apply Status Filter
  if (activeFilter.value !== 'All') {
    const statusMap: Record<string, string> = {
      'Maintenance in Progress': 'Maintenance'
    }
    const targetStatus = statusMap[activeFilter.value] || activeFilter.value
    result = result.filter(s => s.status === targetStatus)
  }

  // Apply Search Filter
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(s => 
      s.code.toLowerCase().includes(q) || 
      s.name.toLowerCase().includes(q)
    )
  }

  return result
})

const resetFilters = () => {
  searchQuery.value = ''
  activeFilter.value = 'All'
}
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
