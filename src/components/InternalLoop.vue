<template>
  <div class="mt-16 border-t border-slate-200 pt-10">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">Maximize Your Results</h2>
        <p class="text-slate-500 text-sm mt-1">Try these similar tools to optimize your business decisions</p>
      </div>
      <div class="hidden sm:block">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
          🔥 Trending Now
        </span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div 
        v-for="tool in suggestedTools" 
        :key="tool.id"
        @click="handleNav(tool.route)"
        class="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
      >
        <div>
          <div class="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center mb-4 transition-all duration-300">
            <component :is="tool.icon" class="w-5 h-5" />
          </div>
          <h3 class="text-lg font-bold text-slate-800 mb-2">{{ tool.title }}</h3>
          <p class="text-slate-500 text-xs leading-relaxed mb-4">
            {{ tool.description }}
          </p>
        </div>
        
        <div class="flex items-center text-blue-600 font-bold text-sm">
          {{ tool.cta }}
          <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { tools } from '../data/tools';
import { track } from '../utils/tracker';

const props = defineProps<{
  currentPath: string;
}>();

const router = useRouter();

const suggestedTools = computed(() => {
  // 1. Exclude current tool
  const otherTools = tools.filter(t => t.route !== props.currentPath);
  
  // 2. Identify current category
  const currentTool = tools.find(t => t.route === props.currentPath);
  const currentCategory = currentTool?.category;
  
  // 3. Prioritize same category
  const related = otherTools.filter(t => t.category === currentCategory);
  const others = otherTools.filter(t => t.category !== currentCategory);
  
  // 4. Combine and random fill
  const combined = [...related, ...others.sort(() => 0.5 - Math.random())];
  
  // Return top 3
  return combined.slice(0, 3);
});

const handleNav = (route: string) => {
  track("internal_loop_click", { target: route });

  // Ad Trigger Logic (Session Guarded)
  if (!sessionStorage.getItem("loop_ad_triggered")) {
    const adLink = import.meta.env.VITE_ADSTERRA_LINK;
    if (adLink) {
      window.open(adLink, "_blank");
      sessionStorage.setItem("loop_ad_triggered", "1");
    }
    
    // Give time for ad tab to register before SPA navigation
    setTimeout(() => {
      router.push(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
  } else {
    // Regular faster navigation if ad already triggered in this session
    router.push(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
</script>

<style scoped>
/* Scale animation for cards */
.group:active {
  transform: scale(0.98);
}
</style>
