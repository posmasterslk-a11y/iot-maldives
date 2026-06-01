import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    sidebarOpen: false,
    stats: {
      activeSessions: 0,
      activeDevices: 0,
      totalFuelDispensed: 0,
      averageTankLevel: 0,
      totalRecords: 0,
      latestReadingTime: '-',
      alarmCount: 0
    }
  }),
  actions: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },
    updateStats(stats: any) {
      this.stats = { ...this.stats, ...stats }
    }
  }
})
