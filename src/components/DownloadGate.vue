<template>
  <div id="download-gate" class="mt-8 bg-slate-50/80 p-8 rounded-2xl border border-slate-200 backdrop-blur-sm text-center shadow-sm">
    <p class="text-slate-600 text-sm font-medium mb-1">Your result is ready ✅</p>
    <p class="text-xs text-slate-500 mb-6 flex flex-col gap-1">
      <span class="font-semibold text-amber-600">Action Required:</span>
      Unlock your full result before leaving this page
    </p>
    
    <button 
      @click="safeContinue"
      :disabled="isFinalizing || disabled"
      class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-10 rounded-2xl shadow-xl transition-transform duration-200 transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span v-if="isFinalizing" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
      <span v-else>Continue &rarr;</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { triggerAdAndContinue } from '../utils/AdTrigger';
import { track } from '../utils/tracker';

const props = withDefaults(defineProps<{
  disabled?: boolean;
}>(), {
  disabled: false
});

const emit = defineEmits<{
  (e: 'finalize'): void;
}>();

const isFinalizing = ref(false);
let lastClick = 0;

const safeContinue = () => {
  const now = Date.now();
  if (now - lastClick < 1500) return; // Anti-bot protection throttle
  lastClick = now;

  handleContinue();
};

const handleContinue = () => {
  if (props.disabled || isFinalizing.value) return;
  track('continue_clicked');
  
  isFinalizing.value = true;
  triggerAdAndContinue(() => {
    track('ad_opened');
    isFinalizing.value = false;
    emit('finalize');
  });
};
</script>
