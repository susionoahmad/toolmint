<template>
  <div class="mt-6 border-t border-slate-100 pt-6 relative overflow-hidden transition-all duration-500">
    <!-- Header with Badge -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
        {{ title }}
        <span v-if="!unlocked" class="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold border border-amber-200">
          ✨ PRO INSIGHT
        </span>
        <span v-else class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-200">
          ✅ UNLOCKED
        </span>
      </h3>
    </div>

    <!-- Content Area -->
    <div class="relative min-h-[100px]">
      <!-- Locked State (Teaser) -->
      <div 
        v-if="!unlocked" 
        class="transition-all duration-700"
      >
        <div class="blur-[4px] opacity-40 select-none pointer-events-none filter">
          <slot name="teaser"></slot>
        </div>

        <div class="absolute inset-0 flex flex-col items-center justify-center p-4 bg-white/40 backdrop-blur-[2px] rounded-2xl z-20">
          <p class="text-slate-600 text-[13px] font-medium mb-3 text-center leading-tight">
            Unlock precision data & <br/>optimization strategies
          </p>
          <button 
            @click="handleUnlock"
            class="group relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-200 active:scale-95 transition-all duration-200"
          >
            {{ cta }} &rarr;
            <!-- Subtle Gleam Animation -->
            <div class="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
              <div class="absolute top-0 -left-[100%] w-[50%] h-full bg-white/20 transform skew-x-[-25deg] animate-[gleam_3s_infinite]"></div>
            </div>
          </button>
        </div>
      </div>

      <!-- Unlocked State (Full) -->
      <div 
        v-else 
        class="fade-in"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { track } from '../utils/tracker';

const props = withDefaults(defineProps<{
  title?: string;
  cta?: string;
  storageKey: string;
}>(), {
  title: "Advanced Insights",
  cta: "Unlock Optimization Data"
});

const emit = defineEmits<{
  (e: 'unlocked'): void;
}>();

const unlocked = ref(false);

onMounted(() => {
  // Check Persistence
  if (sessionStorage.getItem(props.storageKey) === "1") {
    unlocked.value = true;
  }
});

const handleUnlock = () => {
  track('insight_unlock_clicked', { key: props.storageKey });

  // Dual Ad-Trigger Guard
  if (!sessionStorage.getItem("insight_ad_triggered")) {
    const adLink = import.meta.env.VITE_ADSTERRA_LINK;
    if (adLink) {
      window.open(adLink, "_blank");
      sessionStorage.setItem("insight_ad_triggered", "1");
    }
  }

  // Set Persistence & Local State
  sessionStorage.setItem(props.storageKey, "1");
  unlocked.value = true;
  emit('unlocked');
};
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); filter: blur(5px); }
  to { opacity: 1; transform: translateY(0); filter: blur(0); }
}

@keyframes gleam {
  0% { left: -100%; }
  30% { left: 150%; }
  100% { left: 150%; }
}
</style>
