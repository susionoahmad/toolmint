<template>
  <ToolLayout 
    title="Discount Calculator" 
    description="Calculate your final price and exactly how much you save after applied discounts."
  >
    <template #inputs>
      <InputCard title="Price Details">
        <template #icon><TagIcon class="w-5 h-5 text-slate-400" /></template>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Original Price ($)</label>
            <input 
              type="number" 
              v-model.number="store.discountState.originalPrice" 
              :class="[
                'w-full px-4 py-3 rounded-xl border transition-colors',
                errors.originalPrice ? 'border-red-400 focus:ring-2 focus:ring-red-400 focus:border-red-400' : 'border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              ]"
              placeholder="e.g. 200"
              @input="handleInput('originalPrice')"
            />
            <p v-if="errors.originalPrice" class="text-xs text-red-500 mt-1.5">{{ errors.originalPrice }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Discount (%)</label>
            <input 
              type="number" 
              v-model.number="store.discountState.discountPercentage" 
              :class="[
                'w-full px-4 py-3 rounded-xl border transition-colors',
                errors.discountPercentage ? 'border-red-400 focus:ring-2 focus:ring-red-400 focus:border-red-400' : 'border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              ]"
              placeholder="e.g. 20"
              @input="handleInput('discountPercentage')"
            />
            <p v-if="errors.discountPercentage" class="text-xs text-red-500 mt-1.5">{{ errors.discountPercentage }}</p>
          </div>
        </div>

        <div class="mt-8 border-t border-slate-100 pt-6">
          <button 
            @click="handleGenerate" 
            :disabled="!isValid" 
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Calculate Final Price (Instant Result)
          </button>
        </div>
      </InputCard>
    </template>

    <template #results>
      <ResultCard title="Calculation Result">
        <template #icon><PieChartIcon class="w-5 h-5 text-blue-200" /></template>
        
        <div v-if="!showResult">
          <div class="text-blue-100 text-sm mb-2">Estimated Output</div>
          <div class="h-10 bg-blue-700/50 rounded-lg animate-pulse mb-4"></div>
          <div class="h-10 bg-blue-700/50 rounded-lg animate-pulse w-2/3"></div>
        </div>

        <div v-else class="space-y-6">
          <div class="bg-blue-800/40 p-6 rounded-2xl border border-blue-500/20 text-center relative overflow-hidden transition-all duration-500">
            <!-- Result Psychology Lock -->
            <div :class="[showGate ? 'blur-sm opacity-60 select-none pointer-events-none' : 'opacity-100', 'transition-all duration-[600ms]']">
              <div class="text-blue-200 text-sm font-medium uppercase tracking-wider mb-1">Final Price</div>
              <div class="text-5xl font-extrabold text-white mb-4">{{ formatUSD(finalPrice) }}</div>
              
              <div class="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-2 rounded-full font-medium">
                You Save: +{{ formatUSD(amountSaved) }}
              </div>
            </div>
            
            <!-- Padlock visual map overlay -->
            <div v-if="showGate" class="absolute inset-0 flex flex-col items-center justify-center z-10 pointers-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-400 mb-2 drop-shadow-md"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <span class="text-white font-bold drop-shadow-lg text-sm bg-blue-900/60 px-3 py-1 rounded-lg backdrop-blur-sm">Unlock Savings Detail</span>
            </div>
          </div>
          
          <DownloadGate 
            v-if="showGate"
            action-text="Unlock Savings Detail"
            @finalize="handleFinalize"
          />
          
          <div v-if="!showGate" class="pt-2 text-center fade-in">
            <button @click="resetFlow" class="text-sm underline mt-2 text-blue-200 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>
              Recalculate
            </button>
          </div>
        </div>
      </ResultCard>
    </template>
  </ToolLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue';
import { useToolsStore } from '../stores/tools';
import { setSEO } from '../utils/seo';
import { track } from '../utils/tracker';
import { formatUSD } from '../utils/formatters';
import ToolLayout from '../components/ToolLayout.vue';
import InputCard from '../components/InputCard.vue';
import ResultCard from '../components/ResultCard.vue';
import DownloadGate from '../components/DownloadGate.vue';
import { Tag as TagIcon, PieChart as PieChartIcon } from 'lucide-vue-next';

onMounted(() => {
  setSEO('Discount Calculator - Find Savings Fast', 'Calculate your final price and exactly how much you save after applied discounts.');
});

const store = useToolsStore();
const showResult = ref(false);
const showGate = ref(false);

const errors = reactive<Record<string, string>>({});

const isValid = computed(() => {
  return !!store.discountState.originalPrice && !!store.discountState.discountPercentage;
});

const handleInput = (field: string) => {
  if (errors[field]) delete errors[field];
  
  if (field === 'originalPrice' && !store.discountState.originalPrice) {
    errors.originalPrice = "Cannot be empty.";
  }
  if (field === 'discountPercentage' && !store.discountState.discountPercentage) {
    errors.discountPercentage = "Cannot be empty.";
  }
  
  showResult.value = false;
  showGate.value = false;
};

const handleGenerate = () => {
  if (!isValid.value) return;

  showResult.value = true;
  showGate.value = true;
  
  track("generate_clicked");
  track("result_shown");

  setTimeout(() => {
    document.querySelector("#download-gate")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 200);
};

const handleFinalize = () => {
  // Gate cleared, reveal result
  showGate.value = false;
};

const resetFlow = () => {
  showResult.value = false;
  showGate.value = false;
};

const amountSaved = computed(() => {
  return ((store.discountState.originalPrice || 0) * (store.discountState.discountPercentage || 0)) / 100;
});

const finalPrice = computed(() => {
  return (store.discountState.originalPrice || 0) - amountSaved.value;
});
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.4s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
