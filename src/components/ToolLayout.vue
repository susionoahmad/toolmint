<template>
  <div class="max-w-5xl mx-auto px-4 py-12">
    <!-- Main Form Grid -->
    <div class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
        {{ title }}
      </h1>
      <p class="text-lg text-slate-600 max-w-2xl mx-auto">
        {{ description }}
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
      <div class="lg:col-span-7">
        <slot name="inputs"></slot>
      </div>
      <div class="lg:col-span-5 sticky top-6">
        <slot name="results"></slot>
      </div>
    </div>

    <!-- Internal Linking Component (Revenue Boost) -->
    <div class="mt-10 border-t border-slate-200 pt-6">
      <p class="text-sm text-slate-500 mb-4 font-medium">Try similar tools to compare results:</p>
      <div class="flex flex-wrap gap-3">
        <router-link to="/invoice" class="bg-white border hover:bg-slate-50 border-slate-200 text-slate-700 text-sm font-medium py-2 px-4 rounded-lg transition shadow-sm">Invoice Generator</router-link>
        <router-link to="/margin" class="bg-white border hover:bg-slate-50 border-slate-200 text-slate-700 text-sm font-medium py-2 px-4 rounded-lg transition shadow-sm">Margin</router-link>
        <router-link to="/loan" class="bg-white border hover:bg-slate-50 border-slate-200 text-slate-700 text-sm font-medium py-2 px-4 rounded-lg transition shadow-sm">Loan Calculator</router-link>
        <router-link to="/discount" class="bg-white border hover:bg-slate-50 border-slate-200 text-slate-700 text-sm font-medium py-2 px-4 rounded-lg transition shadow-sm">Discount</router-link>
        <router-link to="/dropship" class="bg-white border hover:bg-slate-50 border-slate-200 text-slate-700 text-sm font-medium py-2 px-4 rounded-lg transition shadow-sm">Dropship</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
}>();
</script>
