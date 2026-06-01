import api from './api'
import type { ApiResponse, DeviceDataQuery } from '../types'

export const deviceService = {
  async getDeviceData(params: DeviceDataQuery): Promise<ApiResponse<any>> {
    // According to the plan, we hit /data/getlist with GET
    const response = await api.get<ApiResponse<any>>('/data/getList', {
      params: {
        deviceType: params.deviceType,
        code: params.code,
        start: params.start,
        end: params.end,
        page: params.page || 1,
        pageSize: params.pageSize || 10
      }
    })
    return response.data
  },

  // Fetch real data for the seaplane pump
  async getDeviceList() {
    try {
      const response = await this.getDeviceData({
        deviceType: 'znwg',
        code: '61052604062000',
        page: 1,
        pageSize: 1
      })
      
      // The API might return an array of recent data points or a single object
      const dataList = Array.isArray(response.data) ? response.data : (response.data?.list || [response.data || {}])
      
      console.log('✅ ALL API DATA RECEIVED:', dataList)
      
      // Find specific metrics from the data list
      const cumFlowData = dataList.find((d: any) => d.cmd_desc === 'Cum. Flow') || dataList[0] || {}
      
      // Calculate Totalizer (convert m³ to Liters if needed)
      let totalizerValue = 0;
      if (cumFlowData.data) {
        totalizerValue = parseFloat(cumFlowData.data)
        if (cumFlowData.unit === 'm³') {
          totalizerValue = totalizerValue * 1000 // Convert m³ to Liters
        }
      }

      return [
        { 
          code: '61052604062000', 
          deviceType: 'FuelPump', 
          status: 'online', 
          pumpState: 'idle', // Hardcoded as API doesn't provide status yet
          lastReading: cumFlowData.created_at || new Date().toISOString(), 
          battery_voltage: 12.0,
          mainTankLevel: 8500, // mock if not provided
          mainTankPercentage: 85,
          totalizer: totalizerValue, 
          currentSessionVolume: 0,
          location: 'Maldives Seaplane Base',
        }
      ]
    } catch (e: any) {
      console.error('Failed to fetch real pump data', e)
      return [
        {
          code: '61052604062000', 
          deviceType: 'FuelPump', 
          status: 'offline', 
          pumpState: 'offline',
          lastReading: new Date().toISOString(), 
          battery_voltage: 0,
          mainTankLevel: 0, 
          mainTankPercentage: 0,
          totalizer: 0, 
          currentSessionVolume: 0,
          location: 'Maldives Seaplane Base'
        }
      ]
    }
  }
}
