<template>
  <div class="mt-8 bg-blue-900/30 p-6 rounded-xl border border-blue-500/20 backdrop-blur-sm">
    <div v-if="step === 1" class="text-center">
      <h3 class="font-medium text-blue-50 mb-4">{{ primaryText }}</h3>
      <button 
        @click="goToStepTwo"
        class="w-full bg-white text-blue-700 hover:bg-blue-50 font-bold py-3.5 px-6 rounded-xl transition duration-200 transform hover:scale-[1.02] shadow-md flex items-center justify-center gap-2"
      >
        <slot name="primaryIcon"></slot>
        {{ primaryButtonText }}
      </button>
    </div>

    <div v-else-if="step === 2" class="text-center">
      <h3 class="font-medium text-blue-50 mb-4">Almost there! Complete to get your result.</h3>
      <button 
        @click="executeFinal"
        :disabled="isProcessing"
        class="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3.5 px-6 rounded-xl transition duration-200 transform hover:scale-[1.02] shadow-md flex items-center justify-center gap-2 disabled:opacity-75 disabled:hover:scale-100"
      >
        <span v-if="isProcessing" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
        <span v-else>Continue & Get Result &rarr;</span>
      </button>
      <p class="text-xs text-blue-200/60 mt-3 flex items-center justify-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        Secure processing
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { triggerAdAndContinue } from '../utils/AdTrigger';

const props = withDefaults(defineProps<{
  primaryText?: string;
  primaryButtonText?: string;
  canProceed?: boolean;
}>(), {
  primaryText: "Ready to view your full results?",
  primaryButtonText: "Generate Result",
  canProceed: true
});

const emit = defineEmits<{
  (e: 'finalize'): void;
}>();

const step = ref(1);
const isProcessing = ref(false);

const goToStepTwo = () => {
  if (props.canProceed) {
    step.value = 2;
  }
};

const executeFinal = () => {
  if (isProcessing.value) return;
  
  isProcessing.value = true;
  triggerAdAndContinue(() => {
    isProcessing.value = false;
    emit('finalize');
    // Reset back to step 1 for subsequent interactions if any
    step.value = 1;
  });
};
</script>
