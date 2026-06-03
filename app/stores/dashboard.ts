import { defineStore } from 'pinia'

export interface Station {
  id: string
  code: string
  name: string
  status: 'Serviceable' | 'Unserviceable' | 'Maintenance' | 'Tank Cleaning'
  currentVolume: number
  maxVolume: number
  todaysUsage: number
  flowMeter: number
  lastUsed: string
  lastFilled: string
}

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    sidebarOpen: false,
    stations: [
      { id: '1', code: 'VPI', name: 'Central Hub Fuel Station', status: 'Offline', currentVolume: 0, maxVolume: 15000, todaysUsage: 0, flowMeter: 0, lastUsed: '-', lastFilled: '-' },
      { id: '2', code: 'OVE', name: 'Atoll Fuel Station', status: 'Offline', currentVolume: 0, maxVolume: 15000, todaysUsage: 0, flowMeter: 0, lastUsed: '-', lastFilled: '-' },
      { id: '3', code: 'CCN', name: 'Resort Fuel Station', status: 'Offline', currentVolume: 0, maxVolume: 15000, todaysUsage: 0, flowMeter: 0, lastUsed: '-', lastFilled: '-' },
      { id: '4', code: 'LMM', name: 'Central Fuel Station', status: 'Offline', currentVolume: 0, maxVolume: 15000, todaysUsage: 0, flowMeter: 0, lastUsed: '-', lastFilled: '-' },
      { id: '5', code: 'SWM', name: 'West Fuel Station', status: 'Offline', currentVolume: 0, maxVolume: 15000, todaysUsage: 0, flowMeter: 0, lastUsed: '-', lastFilled: '-' },
      { id: '6', code: 'IRU', name: 'Island Fuel Station', status: 'Offline', currentVolume: 0, maxVolume: 15000, todaysUsage: 0, flowMeter: 0, lastUsed: '-', lastFilled: '-' },
      { id: '7', code: 'RND', name: 'Central Fuel Station', status: 'Offline', currentVolume: 0, maxVolume: 9900, todaysUsage: 0, flowMeter: 0, lastUsed: '-', lastFilled: '-' },
      { id: '8', code: 'FAF', name: 'Seaplane Base Fuel Station', status: 'Offline', currentVolume: 0, maxVolume: 9900, todaysUsage: 0, flowMeter: 0, lastUsed: '-', lastFilled: '-' },
      { id: '9', code: 'KOT', name: 'South Fuel Station', status: 'Offline', currentVolume: 0, maxVolume: 9900, todaysUsage: 0, flowMeter: 0, lastUsed: '-', lastFilled: '-' },
      { id: '10', code: 'MGA', name: 'Island Fuel Station', status: 'Offline', currentVolume: 0, maxVolume: 15000, todaysUsage: 0, flowMeter: 0, lastUsed: '-', lastFilled: '-' },
      { id: '11', code: 'JWK', name: 'Atoll Fuel Station', status: 'Offline', currentVolume: 0, maxVolume: 9500, todaysUsage: 0, flowMeter: 0, lastUsed: '-', lastFilled: '-' },
      { id: '12', code: 'FIN', name: 'Atoll Fuel Station', status: 'Offline', currentVolume: 0, maxVolume: 15000, todaysUsage: 0, flowMeter: 0, lastUsed: '-', lastFilled: '-' },
      { id: '13', code: 'FUR', name: 'North Fuel Station', status: 'Offline', currentVolume: 0, maxVolume: 9500, todaysUsage: 0, flowMeter: 0, lastUsed: '-', lastFilled: '-' },
      { id: '14', code: 'AKM', name: 'Atoll Fuel Station', status: 'Offline', currentVolume: 0, maxVolume: 9500, todaysUsage: 0, flowMeter: 0, lastUsed: '-', lastFilled: '-' },
      { id: '15', code: 'EMR', name: 'Island Fuel Station', status: 'Offline', currentVolume: 0, maxVolume: 9500, todaysUsage: 0, flowMeter: 0, lastUsed: '-', lastFilled: '-' }
    ] as Station[],
    stats: {
      totalAvailableFuel: 204447,
      totalConsumptionToday: 14240,
      fuelReceivedToday: 34250,
      serviceable: 24,
      totalStations: 30,
      unserviceable: 3,
      activeAlarms: 10,
      underMaintenance: 2,
      scheduledCleaning: 1,
    },
    isLoadingRealData: true
  }),
  actions: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },
    async fetchRealData() {
      this.isLoadingRealData = true
      try {
        const response = await fetch('/api/stations')
        if (!response.ok) throw new Error('API failed')
        const json = await response.json()
        
        const ccnStation = this.stations.find(s => s.code === 'CCN')
        if (!ccnStation) return

        if (json.code === 200 && json.data?.list) {
          const list = json.data.list
          const cumFlow = list.find((item: any) => item.cmd_desc === 'Cum. Flow')
          const liquidLevel = list.find((item: any) => item.cmd_desc === 'Liquid Level')
          
          if (cumFlow) {
            let flowValue = parseFloat(cumFlow.data)
            if (cumFlow.unit === 'm³') flowValue *= 1000 // Convert to liters
            
            ccnStation.flowMeter = Math.round(flowValue)
            ccnStation.status = 'Serviceable'
            if (cumFlow.created_at) {
              ccnStation.lastUsed = 'Just now'
            }
          }

          if (liquidLevel) {
            let level = parseFloat(liquidLevel.data) // e.g., 1.624 m
            // Assuming tank max height is ~2 meters for 15,000L capacity
            let percentage = level / 2.0 
            if (percentage > 1) percentage = 1
            ccnStation.currentVolume = Math.round(percentage * ccnStation.maxVolume)
          }
        } else {
          ccnStation.status = 'Offline'
        }
      } catch (err) {
        console.error('Failed to fetch real station data:', err)
        const ccnStation = this.stations.find(s => s.code === 'CCN')
        if (ccnStation) ccnStation.status = 'Offline'
      } finally {
        this.isLoadingRealData = false
      }
    }
  }
})
