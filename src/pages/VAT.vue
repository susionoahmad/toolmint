<template>
  <ToolLayout 
    title="VAT Calculator" 
    description="Calculate VAT amounts or reverse-calculate net prices instantly."
  >
    <template #inputs>
      <InputCard title="VAT Details">
        <template #icon><CalculatorIcon class="w-5 h-5 text-slate-400" /></template>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Amount ($)</label>
            <input 
              type="number" 
              v-model.number="store.vatState.amount" 
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g. 100"
              @input="handleInput"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">VAT Rate (%)</label>
            <input 
              type="number" 
              v-model.number="store.vatState.rate" 
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="20"
              @input="handleInput"
            />
          </div>
          <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-dotted border-slate-300">
            <input 
              type="checkbox" 
              id="isRemoving" 
              v-model="store.vatState.isRemoving"
              class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              @change="handleInput"
            />
            <label for="isRemoving" class="text-sm font-medium text-slate-700">Remove VAT (Reverse Calculate)</label>
          </div>
        </div>

        <div class="mt-8 border-t border-slate-100 pt-6">
          <button 
            @click="handleGenerate" 
            :disabled="!isValid" 
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Calculate VAT (Instant Result)
          </button>
        </div>
      </InputCard>
    </template>

    <template #results>
      <ResultCard title="Calculation Result">
        <template #icon><BarChartIcon class="w-5 h-5 text-blue-200" /></template>
        
        <div v-if="!showResult">
          <div class="text-blue-100 text-sm mb-2">Estimated Output</div>
          <div class="h-10 bg-blue-700/50 rounded-lg animate-pulse mb-4"></div>
          <div class="h-10 bg-blue-700/50 rounded-lg animate-pulse w-2/3"></div>
        </div>

        <div v-else class="space-y-6">
          <div class="bg-blue-800/40 p-6 rounded-2xl border border-blue-500/20 relative overflow-hidden transition-all duration-500">
            <div :class="[showGate ? 'blur-sm opacity-60 select-none pointer-events-none' : 'opacity-100', 'transition-all duration-[600ms]']">
              <div class="space-y-4">
                <div class="flex justify-between items-center pb-3 border-b border-blue-500/30">
                  <span class="text-blue-200">{{ store.vatState.isRemoving ? 'Net Price' : 'Gross Price' }}</span>
                  <span class="text-2xl font-bold text-white">{{ formatUSD(finalPrice) }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-blue-200">VAT Amount</span>
                  <span class="text-xl font-semibold text-emerald-300">+{{ formatUSD(vatAmount) }}</span>
                </div>
              </div>
            </div>

            <!-- Padlock visual map overlay -->
            <div v-if="showGate" class="absolute inset-0 flex flex-col items-center justify-center z-10 pointers-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-400 mb-2 drop-shadow-md"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <span class="text-white font-bold drop-shadow-lg text-sm bg-blue-900/60 px-3 py-1 rounded-lg backdrop-blur-sm">Unlock VAT Analysis</span>
            </div>
          </div>
          
          <DownloadGate 
            v-if="showGate"
            action-text="Unlock VAT Analysis"
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
import { ref, computed, onMounted } from 'vue';
import { useToolsStore } from '../stores/tools';
import { setSEO } from '../utils/seo';
import { track } from '../utils/tracker';
import { formatUSD } from '../utils/formatters';
import ToolLayout from '../components/ToolLayout.vue';
import InputCard from '../components/InputCard.vue';
import ResultCard from '../components/ResultCard.vue';
import DownloadGate from '../components/DownloadGate.vue';
import { Calculator as CalculatorIcon, BarChart3 as BarChartIcon } from 'lucide-vue-next';

onMounted(() => {
  setSEO('Free VAT Calculator - Add or Remove VAT Instantly', 'Easily calculate VAT amounts and reverse-calculate net prices for invoices and business planning.');
});

const store = useToolsStore();
const showResult = ref(false);
const showGate = ref(false);

const isValid = computed(() => !!store.vatState.amount && store.vatState.rate >= 0);

const handleInput = () => {
  showResult.value = false;
  showGate.value = false;
};

const vatAmount = computed(() => {
  const am = store.vatState.amount || 0;
  const rt = store.vatState.rate || 0;
  if (store.vatState.isRemoving) {
    const net = am / (1 + rt / 100);
    return am - net;
  } else {
    return am * (rt / 100);
  }
});

const finalPrice = computed(() => {
  const am = store.vatState.amount || 0;
  if (store.vatState.isRemoving) {
    return am / (1 + (store.vatState.rate || 0) / 100);
  } else {
    return am + vatAmount.value;
  }
});

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
