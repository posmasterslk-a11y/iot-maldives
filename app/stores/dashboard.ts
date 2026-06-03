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
      { id: '1', code: 'CCN', name: 'Resort Fuel Station', status: 'Serviceable', currentVolume: 11700, maxVolume: 15000, todaysUsage: 890, flowMeter: 512480, lastUsed: '5 min ago', lastFilled: '1 day ago' },
      { id: '2', code: 'IRU', name: 'Island Fuel Station', status: 'Serviceable', currentVolume: 10500, maxVolume: 15000, todaysUsage: 780, flowMeter: 445620, lastUsed: '11 min ago', lastFilled: '2 days ago' },
      { id: '3', code: 'FAF', name: 'Seaplane Base Fuel Station', status: 'Serviceable', currentVolume: 8712, maxVolume: 9900, todaysUsage: 650, flowMeter: 389420, lastUsed: '3 min ago', lastFilled: 'Today' },
      { id: '4', code: 'FUR', name: 'North Fuel Station', status: 'Serviceable', currentVolume: 8740, maxVolume: 9500, todaysUsage: 510, flowMeter: 274530, lastUsed: '8 min ago', lastFilled: 'Today' },
      { id: '5', code: 'AKM', name: 'Atoll Fuel Station', status: 'Serviceable', currentVolume: 6080, maxVolume: 9500, todaysUsage: 420, flowMeter: 284736, lastUsed: '14 min ago', lastFilled: '3 days ago' },
      { id: '6', code: 'EMR', name: 'Island Fuel Station', status: 'Serviceable', currentVolume: 4275, maxVolume: 9500, todaysUsage: 380, flowMeter: 163290, lastUsed: '38 min ago', lastFilled: '6 days ago' },
      { id: '7', code: 'ARH', name: 'Atoll Fuel Station', status: 'Tank Cleaning', currentVolume: 2772, maxVolume: 9900, todaysUsage: 310, flowMeter: 196340, lastUsed: '2 hr ago', lastFilled: '12 days ago' },
      { id: '8', code: 'JWK', name: 'Atoll Fuel Station', status: 'Serviceable', currentVolume: 3610, maxVolume: 9500, todaysUsage: 290, flowMeter: 134200, lastUsed: '1 hr 20 min ago', lastFilled: '8 days ago' },
      { id: '9', code: 'FIN', name: 'Atoll Fuel Station', status: 'Unserviceable', currentVolume: 1950, maxVolume: 15000, todaysUsage: 240, flowMeter: 98760, lastUsed: '4 hr ago', lastFilled: '18 days ago' },
      { id: '10', code: 'HPM', name: 'South Fuel Station', status: 'Maintenance', currentVolume: 5346, maxVolume: 9900, todaysUsage: 0, flowMeter: 214870, lastUsed: 'Yesterday', lastFilled: '9 days ago' },
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
    }
  }),
  actions: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },
    async fetchRealData() {
      try {
        const response = await fetch('/api/stations')
        const json = await response.json()
        
        if (json.code === 200 && json.data?.list) {
          const list = json.data.list
          const cumFlow = list.find((item: any) => item.cmd_desc === 'Cum. Flow')
          
          if (cumFlow) {
            let flowValue = parseFloat(cumFlow.data)
            if (cumFlow.unit === 'm³') flowValue *= 1000 // Convert to liters
            
            // Update the first station (CCN) with real data
            this.stations[0].flowMeter = Math.round(flowValue)
            // We can also update lastUsed if we want
            if (cumFlow.created_at) {
              this.stations[0].lastUsed = 'Just now'
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch real station data:', err)
      }
    }
  }
})
