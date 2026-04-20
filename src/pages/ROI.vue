<template>
  <ToolLayout 
    title="ROI Calculator" 
    description="Calculate your Return on Investment for marketing, business, or stock trades."
  >
    <template #inputs>
      <InputCard title="Investment Details">
        <template #icon><TargetIcon class="w-5 h-5 text-slate-400" /></template>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Amount Invested ($)</label>
            <input 
              type="number" 
              v-model.number="store.roiState.amountInvested" 
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g. 1000"
              @input="handleInput"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Amount Returned ($)</label>
            <input 
              type="number" 
              v-model.number="store.roiState.amountReturned" 
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g. 1500"
              @input="handleInput"
            />
          </div>
        </div>

        <div class="mt-8 border-t border-slate-100 pt-6">
          <button 
            @click="handleGenerate" 
            :disabled="!isValid" 
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Calculate ROI (Instant Result)
          </button>
        </div>
      </InputCard>
    </template>

    <template #results>
      <ResultCard title="Investment Performance">
        <template #icon><ArrowUpRightIcon class="w-5 h-5 text-blue-200" /></template>
        
        <div v-if="!showResult">
          <div class="text-blue-100 text-sm mb-2">Estimated Output</div>
          <div class="h-10 bg-blue-700/50 rounded-lg animate-pulse mb-4"></div>
          <div class="h-10 bg-blue-700/50 rounded-lg animate-pulse w-2/3"></div>
        </div>

        <div v-else class="space-y-6">
          <div class="bg-blue-800/40 p-6 rounded-2xl border border-blue-500/20 relative overflow-hidden transition-all duration-500 text-center">
            <div :class="[showGate ? 'blur-sm opacity-60 select-none pointer-events-none' : 'opacity-100', 'transition-all duration-[600ms]']">
              <div class="text-blue-100 text-sm font-medium uppercase tracking-wider mb-1">Return on Investment</div>
              <div class="text-6xl font-extrabold text-white mb-2">
                {{ roiValue.toFixed(2) }}%
              </div>
              <p :class="[roiValue >= 0 ? 'text-emerald-400' : 'text-red-400', 'text-lg font-bold']">
                {{ roiValue >= 0 ? 'Profitable' : 'Loss' }}
              </p>
              
              <div class="grid grid-cols-2 gap-4 mt-6 border-t border-blue-500/30 pt-4">
                <div>
                  <div class="text-blue-300 text-xs uppercase tracking-wide">Net Profit</div>
                  <div class="text-lg font-bold text-white">{{ formatUSD(netProfit) }}</div>
                </div>
                <div>
                  <div class="text-blue-300 text-xs uppercase tracking-wide">Investment Multiple</div>
                  <div class="text-lg font-bold text-blue-100">{{ (store.roiState.amountReturned / store.roiState.amountInvested).toFixed(2) }}x</div>
                </div>
              </div>
            </div>

            <!-- Lock Overlay -->
            <div v-if="showGate" class="absolute inset-0 flex flex-col items-center justify-center z-10 pointers-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-400 mb-2 drop-shadow-md"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <span class="text-white font-bold drop-shadow-lg text-sm bg-blue-900/60 px-3 py-1 rounded-lg backdrop-blur-sm">Unlock ROI Report</span>
            </div>
          </div>
          
          <DownloadGate 
            v-if="showGate"
            action-text="Unlock ROI Report"
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
import { Target as TargetIcon, ArrowUpRight as ArrowUpRightIcon } from 'lucide-vue-next';

onMounted(() => {
  setSEO('ROI Calculator - Return on Investment Tracker', 'Quickly calculate the percentage return on any investment or business venture.');
});

const store = useToolsStore();
const showResult = ref(false);
const showGate = ref(false);

const isValid = computed(() => !!store.roiState.amountInvested);

const handleInput = () => {
  showResult.value = false;
  showGate.value = false;
};

const netProfit = computed(() => {
  return (store.roiState.amountReturned || 0) - (store.roiState.amountInvested || 0);
});

const roiValue = computed(() => {
  const invested = store.roiState.amountInvested || 1;
  const profit = netProfit.value;
  return (profit / invested) * 100;
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
