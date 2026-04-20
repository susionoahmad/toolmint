<template>
  <div class="max-w-6xl mx-auto px-4 py-16">
    <div class="text-center mb-16">
      <h1 class="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
        Free Business &<br/> <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">Finance Tools</span>
      </h1>
      <p class="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
        Simple, high-converting tools to help you calculate, plan, and grow your modern business. No sign up required.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Feature Card -->
      <router-link 
        v-for="(tool, index) in tools" 
        :key="index"
        :to="tool.route"
        class="group bg-white rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm hover:shadow-xl border border-slate-200 transition-all duration-300 transform hover:-translate-y-1 block"
      >
        <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
          <component :is="tool.icon" class="w-6 h-6" />
        </div>
        <h3 class="text-xl font-bold text-slate-800">{{ tool.title }}</h3>
        <p class="text-slate-500 text-sm leading-relaxed">{{ tool.description }}</p>
        <div class="pt-4 flex items-center text-blue-600 font-semibold text-sm">
          Use Tool
          <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { setSEO } from '../utils/seo';
import { tools } from '../data/tools';

onMounted(() => {
  setSEO('Free Business & Finance Tools', 'Simple, high-converting tools to help you calculate, plan, and grow your modern business.');
});
</script>
