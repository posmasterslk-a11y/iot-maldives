<script setup lang="ts">
defineProps<{
  title: string
  value: string | number
  unit?: string
  subtitle?: string
  icon?: string
  iconColor?: string
  trend?: string
  trendColor?: string
}>()
</script>
<template>
  <div class="bg-[#101722] border border-[#1e2a3b] rounded-2xl p-5 flex flex-col justify-between shadow-lg">
    <div class="flex justify-between items-start mb-3">
      <div v-if="icon" :class="`p-2 rounded-xl bg-[#172130] border border-[#233146] ${iconColor}`">
        <UIcon :name="icon" class="w-5 h-5" />
      </div>
      <div v-if="trend" :class="`text-xs font-semibold flex items-center gap-1 ${trendColor}`">
        <UIcon v-if="trend.includes('+')" name="i-lucide-trending-up" class="w-3 h-3" />
        <UIcon v-if="trend.includes('-')" name="i-lucide-trending-down" class="w-3 h-3" />
        {{ trend }}
      </div>
    </div>
    <div>
      <div class="flex items-baseline gap-1">
        <span class="text-[28px] font-bold text-white tracking-tight">{{ value }}</span>
        <span v-if="unit" class="text-[#597393] font-semibold text-sm">{{ unit }}</span>
      </div>
      <div class="text-[#7e9bbd] text-sm mt-0.5 font-medium">{{ title }}</div>
      <div v-if="subtitle" class="text-[#4b607a] text-[11px] mt-1">{{ subtitle }}</div>
    </div>
  </div>
</template>
