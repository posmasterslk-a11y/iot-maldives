<script setup lang="ts">
import { useDashboardStore } from '../stores/dashboard'
import SummaryCard from '../components/Dashboard/SummaryCard.vue'
import StationCard from '../components/Dashboard/StationCard.vue'
import { computed, onMounted } from 'vue'

const store = useDashboardStore()

onMounted(() => {
  store.fetchRealData()
})

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num)
}
</script>

<template>
  <div class="min-h-screen bg-[#070b10] text-gray-200 p-8">
    <!-- Header -->
    <div class="flex justify-between items-start mb-8">
      <div>
        <div class="flex items-center gap-3">
          <div class="w-1.5 h-6 bg-[#00d2ff] rounded-full shadow-[0_0_10px_rgba(0,210,255,0.8)]"></div>
          <h1 class="text-3xl font-bold text-white tracking-tight">Fuel Monitoring Dashboard</h1>
        </div>
        <p class="text-[#597393] font-medium mt-2 pl-4">Trans Maldivian Airways — Real-time fuel status across all stations</p>
      </div>
      <div class="text-right">
        <div class="text-3xl font-bold text-[#00d2ff] tracking-widest font-mono">
          12:59:54
        </div>
        <div class="text-[#597393] text-sm font-medium mt-1">Wednesday, June 3, 2026</div>
      </div>
    </div>

    <!-- Summary Grid -->
    <div class="grid grid-cols-12 gap-5 mb-10">
      <SummaryCard 
        class="col-span-12 md:col-span-3"
        title="Total Available Fuel" 
        subtitle="Across all 30 stations"
        :value="formatNumber(store.stats.totalAvailableFuel)" 
        unit="L"
        icon="i-lucide-fuel" 
        iconColor="text-[#00d2ff]" 
        trend="+2.4%" 
        trendColor="text-green-400"
      />
      <SummaryCard 
        class="col-span-12 md:col-span-3"
        title="Total Consumption Today" 
        subtitle="All active stations"
        :value="formatNumber(store.stats.totalConsumptionToday)" 
        unit="L"
        icon="i-lucide-trending-down" 
        iconColor="text-yellow-500" 
        trend="-1.8%" 
        trendColor="text-red-400"
      />
      
      <!-- Smaller cards group -->
      <div class="col-span-12 md:col-span-6 grid grid-cols-3 gap-5">
        <SummaryCard 
          title="Fuel Received Today" 
          subtitle="6 stations refuelled"
          :value="formatNumber(store.stats.fuelReceivedToday)" 
          unit="L"
          icon="i-lucide-trending-up" 
          iconColor="text-green-400" 
        />
        <SummaryCard 
          title="Serviceable" 
          :value="`${store.stats.serviceable}`" 
          :unit="`/${store.stats.totalStations}`"
          icon="i-lucide-check-circle" 
          iconColor="text-green-500" 
        />
        <SummaryCard 
          title="Unserviceable" 
          :value="store.stats.unserviceable" 
          icon="i-lucide-alert-circle" 
          iconColor="text-red-500" 
        />
      </div>

      <SummaryCard 
        class="col-span-12 md:col-span-2"
        title="Active Alarms" 
        :value="store.stats.activeAlarms" 
        icon="i-lucide-bell" 
        iconColor="text-red-400" 
      />
      <SummaryCard 
        class="col-span-12 md:col-span-3"
        title="Under Maintenance" 
        subtitle="Temporarily offline"
        :value="store.stats.underMaintenance" 
        icon="i-lucide-wrench" 
        iconColor="text-yellow-500" 
      />
      <SummaryCard 
        class="col-span-12 md:col-span-3"
        title="Scheduled Cleaning" 
        subtitle="ARH station"
        :value="store.stats.scheduledCleaning" 
        icon="i-lucide-activity" 
        iconColor="text-orange-500" 
      />

      <!-- System Health Card -->
      <div class="col-span-12 md:col-span-4 bg-[#1a1215] border border-red-500/30 rounded-2xl p-5 flex items-center gap-6 relative overflow-hidden shadow-[0_0_30px_rgba(239,68,68,0.05)]">
        <div class="absolute -right-4 -top-4 w-32 h-32 bg-red-500/10 rounded-full blur-2xl"></div>
        <div class="p-4 rounded-full border border-red-500/20 bg-red-500/10 shrink-0">
          <UIcon name="i-lucide-activity" class="w-8 h-8 text-red-500" />
        </div>
        <div>
          <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">System Health Status</div>
          <div class="text-2xl font-bold text-red-500 tracking-wider">DEGRADED</div>
          <div class="text-red-400/70 text-xs font-medium mt-1">{{ store.stats.activeAlarms }} active alarms · {{ store.stats.unserviceable }} station(s) down</div>
        </div>
      </div>
    </div>

    <!-- Station Overview -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center gap-3">
        <div class="w-1 h-5 bg-[#00d2ff] rounded-full shadow-[0_0_8px_rgba(0,210,255,0.8)]"></div>
        <h2 class="text-xl font-bold text-white tracking-tight">Fuel Station Overview</h2>
        <div class="px-2.5 py-0.5 rounded-full bg-[#101722] border border-[#1e2a3b] text-[#00d2ff] text-xs font-bold tracking-wider ml-2">
          {{ store.stations.length }} OF {{ store.stats.totalStations }}
        </div>
      </div>
      <button class="px-4 py-1.5 rounded-full border border-[#1e2a3b] bg-[#101722] text-[#00d2ff] text-sm font-semibold hover:bg-[#1a2536] transition-colors flex items-center gap-2">
        View All Stations
        <UIcon name="i-lucide-chevron-right" class="w-4 h-4" />
      </button>
    </div>

    <!-- Stations Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      <StationCard 
        v-for="station in store.stations" 
        :key="station.id" 
        :station="station"
      />
    </div>

    <!-- Footer -->
    <div class="mt-12 flex justify-between items-center text-[#4b607a] text-xs font-medium border-t border-[#1e2a3b] pt-6 pb-4">
      <div>TMA Fuel Monitoring System v3.2.1 · Data refreshed every 30 seconds</div>
      <div>Last sync: 14:23:44 MVT</div>
    </div>
  </div>
</template>
