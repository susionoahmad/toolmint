<template>
  <ToolLayout 
    title="Compound Interest Calculator" 
    description="Visualize your long-term wealth growth with compounding math."
  >
    <template #inputs>
      <InputCard title="Savings Details">
        <template #icon><TrendingUpIcon class="w-5 h-5 text-slate-400" /></template>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Initial Principal ($)</label>
            <input 
              type="number" 
              v-model.number="store.compoundState.principal" 
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g. 5000"
              @input="handleInput"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Annual Rate (%)</label>
              <input 
                type="number" 
                v-model.number="store.compoundState.rate" 
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="7"
                @input="handleInput"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Years</label>
              <input 
                type="number" 
                v-model.number="store.compoundState.years" 
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="10"
                @input="handleInput"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Compounding Frequency</label>
            <select 
              v-model.number="store.compoundState.compounding"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
              @change="handleInput"
            >
              <option :value="1">Annually</option>
              <option :value="2">Semi-Annually</option>
              <option :value="4">Quarterly</option>
              <option :value="12">Monthly</option>
              <option :value="365">Daily</option>
            </select>
          </div>
        </div>

        <div class="mt-8 border-t border-slate-100 pt-6">
          <button 
            @click="handleGenerate" 
            :disabled="!isValid" 
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Calculate Growth (Instant Result)
          </button>
        </div>
      </InputCard>
    </template>

    <template #results>
      <ResultCard title="Future Value Estimate">
        <template #icon><PieChartIcon class="w-5 h-5 text-blue-200" /></template>
        
        <div v-if="!showResult">
          <div class="text-blue-100 text-sm mb-2">Estimated Output</div>
          <div class="h-10 bg-blue-700/50 rounded-lg animate-pulse mb-4"></div>
          <div class="h-10 bg-blue-700/50 rounded-lg animate-pulse w-2/3"></div>
        </div>

        <div v-else class="space-y-6">
          <div class="bg-blue-800/40 p-6 rounded-2xl border border-blue-500/20 relative overflow-hidden transition-all duration-500 text-center">
            <div :class="[showGate ? 'blur-sm opacity-60 select-none pointer-events-none' : 'opacity-100', 'transition-all duration-[600ms]']">
              <div class="text-blue-100 text-sm font-medium uppercase tracking-wider mb-1">Total Savings</div>
              <div class="text-5xl font-extrabold text-white mb-4">
                {{ formatUSD(futureValue) }}
              </div>
              
              <div class="grid grid-cols-2 gap-4 mt-6 border-t border-blue-500/30 pt-4">
                <div>
                  <div class="text-blue-300 text-xs uppercase tracking-wide">Principal</div>
                  <div class="text-lg font-bold text-white">{{ formatUSD(store.compoundState.principal) }}</div>
                </div>
                <div>
                  <div class="text-blue-300 text-xs uppercase tracking-wide">Interest Earned</div>
                  <div class="text-lg font-bold text-emerald-300">{{ formatUSD(futureValue - store.compoundState.principal) }}</div>
                </div>
              </div>
            </div>

            <!-- Padlock visual map overlay -->
            <div v-if="showGate" class="absolute inset-0 flex flex-col items-center justify-center z-10 pointers-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-400 mb-2 drop-shadow-md"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <span class="text-white font-bold drop-shadow-lg text-sm bg-blue-900/60 px-3 py-1 rounded-lg backdrop-blur-sm">Unlock Growth Plan</span>
            </div>
          </div>
          
          <DownloadGate 
            v-if="showGate"
            action-text="Unlock Growth Plan"
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
import { TrendingUp as TrendingUpIcon, PieChart as PieChartIcon } from 'lucide-vue-next';

onMounted(() => {
  setSEO('Compound Interest Calculator - Future Value Growth', 'Visualize how your initial savings Grow over time with the magic of compound interest.');
});

const store = useToolsStore();
const showResult = ref(false);
const showGate = ref(false);

const isValid = computed(() => !!store.compoundState.principal && store.compoundState.rate >= 0 && store.compoundState.years > 0);

const handleInput = () => {
  showResult.value = false;
  showGate.value = false;
};

const futureValue = computed(() => {
  const P = store.compoundState.principal || 0;
  const r = (store.compoundState.rate || 0) / 100;
  const n = store.compoundState.compounding || 1;
  const t = store.compoundState.years || 0;
  
  if (r === 0) return P;
  return P * Math.pow((1 + r/n), (n * t));
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
