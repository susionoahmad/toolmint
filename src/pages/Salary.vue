<template>
  <ToolLayout 
    title="Salary Calculator" 
    description="Estimate your annual and monthly income based on hourly or weekly pay."
  >
    <template #inputs>
      <InputCard title="Income Details">
        <template #icon><CoinsIcon class="w-5 h-5 text-slate-400" /></template>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Pay Amount ($)</label>
            <input 
              type="number" 
              v-model.number="store.salaryState.amount" 
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g. 25"
              @input="handleInput"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Frequency</label>
            <select 
              v-model="store.salaryState.frequency"
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
              @change="handleInput"
            >
              <option value="hourly">Hourly</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="annual">Annual</option>
            </select>
          </div>
        </div>

        <div class="mt-8 border-t border-slate-100 pt-6">
          <button 
            @click="handleGenerate" 
            :disabled="!isValid" 
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Calculate Pay (Instant Result)
          </button>
        </div>
      </InputCard>
    </template>

    <template #results>
      <ResultCard title="Pay Breakdown">
        <template #icon><BarChartIcon class="w-5 h-5 text-blue-200" /></template>
        
        <div v-if="!showResult">
          <div class="text-blue-100 text-sm mb-2">Estimated Output</div>
          <div class="h-10 bg-blue-700/50 rounded-lg animate-pulse mb-4"></div>
          <div class="h-10 bg-blue-700/50 rounded-lg animate-pulse w-2/3"></div>
        </div>

        <div v-else class="space-y-6">
          <div class="bg-blue-800/40 p-6 rounded-2xl border border-blue-500/20 relative overflow-hidden transition-all duration-500">
            <div :class="[showGate ? 'blur-sm opacity-60 select-none pointer-events-none' : 'opacity-100', 'transition-all duration-[600ms]']">
              
              <div class="text-center mb-6">
                <div class="text-blue-200 text-sm font-medium uppercase tracking-wider mb-1">Estimated Annual Pay</div>
                <div class="text-5xl font-extrabold text-white">
                  {{ formatUSD(breakdown.annual) }}
                </div>
              </div>

              <div class="space-y-3 border-t border-blue-500/30 pt-6">
                <div class="flex justify-between items-center text-blue-100">
                  <span class="font-medium">Monthly Gross</span>
                  <span class="font-bold text-lg">{{ formatUSD(breakdown.monthly) }}</span>
                </div>
                <div class="flex justify-between items-center text-blue-100 border-t border-blue-500/10 pt-3">
                  <span class="font-medium">Weekly Gross</span>
                  <span class="font-bold text-lg">{{ formatUSD(breakdown.weekly) }}</span>
                </div>
              </div>
            </div>

            <!-- Lock Overlay -->
            <div v-if="showGate" class="absolute inset-0 flex flex-col items-center justify-center z-10 pointers-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-400 mb-2 drop-shadow-md"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <span class="text-white font-bold drop-shadow-lg text-sm bg-blue-900/60 px-3 py-1 rounded-lg backdrop-blur-sm">Unlock Pay Breakdown</span>
            </div>
          </div>
          
          <DownloadGate 
            v-if="showGate"
            action-text="Unlock Pay Breakdown"
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
import { Coins as CoinsIcon, BarChart3 as BarChartIcon } from 'lucide-vue-next';

onMounted(() => {
  setSEO('Salary Calculator - Hourly to Annual Income', 'Convert your hourly wages or weekly pay into annual and monthly gross income estimates.');
});

const store = useToolsStore();
const showResult = ref(false);
const showGate = ref(false);

const isValid = computed(() => !!store.salaryState.amount);

const handleInput = () => {
  showResult.value = false;
  showGate.value = false;
};

const breakdown = computed(() => {
  const am = store.salaryState.amount || 0;
  const freq = store.salaryState.frequency;
  let annual = 0;

  if (freq === 'hourly') annual = am * 40 * 52;
  else if (freq === 'weekly') annual = am * 52;
  else if (freq === 'monthly') annual = am * 12;
  else annual = am;

  return {
    annual,
    monthly: annual / 12,
    weekly: annual / 52,
    daily: annual / (52 * 5)
  };
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
