<template>
  <ToolLayout 
    title="Profit Margin Calculator" 
    description="Calculate gross profit and margin percentage to ensure your pricing strategy is on track."
  >
    <template #inputs>
      <InputCard title="Cost & Pricing">
        <template #icon><CalculatorIcon class="w-5 h-5 text-slate-400" /></template>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Cost of Unit ($)</label>
            <input 
              type="number" 
              v-model.number="store.marginState.cost" 
              :class="[
                'w-full px-4 py-3 rounded-xl border transition-colors',
                errors.cost ? 'border-red-400 focus:ring-2 focus:ring-red-400 focus:border-red-400' : 'border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              ]"
              placeholder="e.g. 50"
              @input="handleInput('cost')"
            />
            <p v-if="errors.cost" class="text-xs text-red-500 mt-1.5">{{ errors.cost }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Selling Price ($)</label>
            <input 
              type="number" 
              v-model.number="store.marginState.sellingPrice" 
              :class="[
                'w-full px-4 py-3 rounded-xl border transition-colors',
                errors.sellingPrice ? 'border-red-400 focus:ring-2 focus:ring-red-400 focus:border-red-400' : 'border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              ]"
              placeholder="e.g. 150"
              @input="handleInput('sellingPrice')"
            />
            <p v-if="errors.sellingPrice" class="text-xs text-red-500 mt-1.5">{{ errors.sellingPrice }}</p>
          </div>
        </div>

        <div class="mt-8 border-t border-slate-100 pt-6">
          <button 
            @click="handleGenerate" 
            :disabled="!isValid" 
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Calculate Margin (Instant Result)
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
            <div :class="[showGate ? 'blur-sm opacity-60 select-none pointer-events-none' : 'opacity-100', 'transition-all duration-[600ms]']">
              <div class="text-blue-200 text-sm font-medium uppercase tracking-wider mb-1">Gross Profit</div>
              <div class="text-5xl font-extrabold text-white mb-4">{{ formatUSD(profit) }}</div>
              
              <div class="inline-flex items-center gap-2 bg-blue-500/20 text-blue-100 px-4 py-2 rounded-full font-medium border border-blue-400/30">
                Gross Margin: {{ formatPercent(margin) }}
              </div>
            </div>
            
            <!-- Padlock visual map overlay -->
            <div v-if="showGate" class="absolute inset-0 flex flex-col items-center justify-center z-10 pointers-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-400 mb-2 drop-shadow-md"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <span class="text-white font-bold drop-shadow-lg text-sm bg-blue-900/60 px-3 py-1 rounded-lg backdrop-blur-sm">Unlock Analysis</span>
            </div>
          </div>
          
          <DownloadGate 
            v-if="showGate"
            action-text="Unlock Analysis"
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
import { formatUSD, formatPercent } from '../utils/formatters';
import ToolLayout from '../components/ToolLayout.vue';
import InputCard from '../components/InputCard.vue';
import ResultCard from '../components/ResultCard.vue';
import DownloadGate from '../components/DownloadGate.vue';
import { Calculator as CalculatorIcon, PieChart as PieChartIcon } from 'lucide-vue-next';

onMounted(() => {
  setSEO('Profit Margin Calculator - Calculate Instantly', 'Calculate gross profit and margin percentage to ensure your pricing strategy is on track.');
});

const store = useToolsStore();
const showResult = ref(false);
const showGate = ref(false);

const errors = reactive<Record<string, string>>({});

const isValid = computed(() => {
  return typeof store.marginState.cost === 'number' && typeof store.marginState.sellingPrice === 'number';
});

const handleInput = (field: string) => {
  if (errors[field]) delete errors[field];
  
  if (field === 'cost' && typeof store.marginState.cost !== 'number') errors.cost = "Cannot be empty.";
  if (field === 'sellingPrice' && typeof store.marginState.sellingPrice !== 'number') errors.sellingPrice = "Cannot be empty.";
  
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
  showGate.value = false;
};

const resetFlow = () => {
  showResult.value = false;
  showGate.value = false;
};

const profit = computed(() => {
  return (store.marginState.sellingPrice || 0) - (store.marginState.cost || 0);
});

const margin = computed(() => {
  if (!store.marginState.sellingPrice) return 0;
  return (profit.value / store.marginState.sellingPrice) * 100;
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
