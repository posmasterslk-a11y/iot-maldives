import { defineStore } from 'pinia'
import { deviceService } from '../services/device'
import type { Device, SensorData, DeviceDataQuery } from '../types'

export const useDeviceStore = defineStore('device', {
  state: () => ({
    devices: [] as Device[],
    currentDeviceData: [] as SensorData[],
    currentDeviceTotal: 0,
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchDevices() {
      this.loading = true
      this.error = null
      try {
        const data = await deviceService.getDeviceList()
        this.devices = data as Device[]
      } catch (e: any) {
        this.error = e.message || 'Failed to fetch devices'
      } finally {
        this.loading = false
      }
    },

    async fetchDeviceData(query: DeviceDataQuery) {
      this.loading = true
      this.error = null
      try {
        const response = await deviceService.getDeviceData(query)
        if (response.code === 200 || response.code === 0 || response.data) {
          this.currentDeviceData = Array.isArray(response.data) ? response.data : (response.data.list || response.data)
          this.currentDeviceTotal = response.total || this.currentDeviceData.length
        } else {
          this.error = response.msg || 'API returned an error'
        }
      } catch (e: any) {
        this.error = e.message || 'Failed to fetch device data'
        // For demonstration, fill with mock data if API fails to hit external server correctly
        if (process.dev) {
          console.warn('Mocking data due to fetch error:', e.message)
          this.currentDeviceData = [
            { created_at: new Date().toISOString(), battery_voltage: 12.0, status: 'online', press: 2.4, wd: 25.1, gps_longitude: 104.06, gps_latitude: 30.67 }
          ]
          this.currentDeviceTotal = 1
        }
      } finally {
        this.loading = false
      }
    }
  }
})
