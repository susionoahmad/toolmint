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
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g. 50"
              @input="handleInput"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Selling Price ($)</label>
            <input 
              type="number" 
              v-model.number="store.marginState.sellingPrice" 
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g. 150"
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
            Calculate Margin (Instant Result)
          </button>
        </div>
      </InputCard>
    </template>

    <template #results>
      <ResultCard title="Profit Analysis">
        <template #icon><PieChartIcon class="w-5 h-5 text-blue-200" /></template>
        
        <div v-if="!showResult">
          <div class="text-blue-100 text-sm mb-2">Estimated Output</div>
          <div class="h-10 bg-blue-700/50 rounded-lg animate-pulse mb-4"></div>
          <div class="h-10 bg-blue-700/50 rounded-lg animate-pulse w-2/3"></div>
        </div>

        <div v-else class="space-y-6">
          <!-- Basic Result (Trust Builder) -->
          <div class="bg-blue-800/40 p-6 rounded-2xl border border-blue-500/20 text-center relative overflow-hidden transition-all duration-500">
            <div class="text-blue-200 text-sm font-medium uppercase tracking-wider mb-1">Gross Profit</div>
            <div class="text-6xl font-extrabold text-white mb-4">{{ formatUSD(profit) }}</div>
            
            <div class="inline-flex items-center gap-2 bg-blue-500/20 text-blue-100 px-4 py-2 rounded-full font-bold border border-blue-400/30">
              Gross Margin: {{ formatPercent(margin) }}
            </div>
          </div>

          <!-- Advanced Insight Lock (Curiosity/Ads #1) -->
          <AdvancedInsight 
            storage-key="margin_insight_unlocked"
            cta="See Real Profit Strategy"
          >
            <!-- Teaser Slot (Curiosity Trigger) -->
            <template #teaser>
              <div class="grid grid-cols-1 gap-3">
                <div class="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <div class="text-[10px] uppercase text-slate-400 font-bold mb-1">Optimized Price</div>
                  <div class="text-xl font-bold text-slate-300">$2XX.XX</div>
                </div>
                <div class="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  <div class="text-[10px] uppercase text-slate-400 font-bold mb-1">Volume to 6-Figures</div>
                  <div class="text-xl font-bold text-slate-300">X,XXX units</div>
                </div>
              </div>
            </template>

            <!-- Real Content Slot (The Reward) -->
            <div class="grid grid-cols-1 gap-4">
              <div class="bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
                <div class="flex items-center gap-2 mb-2">
                  <TrendingUpIcon class="w-4 h-4 text-emerald-600" />
                  <span class="text-xs font-bold text-emerald-700 uppercase tracking-wide">Optimized Selling Price</span>
                </div>
                <div class="text-2xl font-black text-emerald-900">{{ formatUSD(optimizedPrice) }}</div>
                <p class="text-[11px] text-emerald-600 mt-1">Recommended for a healthy 45% net margin target.</p>
              </div>

              <div class="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                <div class="flex items-center gap-2 mb-2">
                  <TargetIcon class="w-4 h-4 text-blue-600" />
                  <span class="text-xs font-bold text-blue-700 uppercase tracking-wide">Volume to 6-Figure Profit</span>
                </div>
                <div class="text-2xl font-black text-blue-900">{{ formatNumber(Math.ceil(100000 / profit)) }} Units</div>
                <p class="text-[11px] text-blue-600 mt-1">Sales volume required to reach $100,000 net profit.</p>
              </div>
            </div>
          </AdvancedInsight>
          
          <!-- Final Download Gate (Utility/Ads #2) -->
          <DownloadGate 
            action-text="Unlock your Full Profit Analysis Report"
            @finalize="handleFinalize"
          />
          
          <div v-if="downloadUnlocked" class="pt-2 text-center fade-in">
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
import { formatUSD, formatPercent, formatNumber } from '../utils/formatters';
import ToolLayout from '../components/ToolLayout.vue';
import InputCard from '../components/InputCard.vue';
import ResultCard from '../components/ResultCard.vue';
import DownloadGate from '../components/DownloadGate.vue';
import AdvancedInsight from '../components/AdvancedInsight.vue';
import { 
  Calculator as CalculatorIcon, 
  PieChart as PieChartIcon, 
  TrendingUp as TrendingUpIcon,
  Target as TargetIcon
} from 'lucide-vue-next';

onMounted(() => {
  setSEO('Profit Margin Calculator - Calculate Instantly', 'Calculate gross profit and margin percentage to ensure your pricing strategy is on track.');
});

const store = useToolsStore();
const showResult = ref(false);
const downloadUnlocked = ref(false);

const isValid = computed(() => {
  return typeof store.marginState.cost === 'number' && typeof store.marginState.sellingPrice === 'number';
});

const handleInput = () => {
  showResult.value = false;
  downloadUnlocked.value = false;
};

const handleGenerate = () => {
  if (!isValid.value) return;
  showResult.value = true;
  track("generate_clicked");
  track("result_shown");
};

const handleFinalize = () => {
  // Use Dual Guard
  if (!sessionStorage.getItem("download_ad_triggered")) {
    const adLink = import.meta.env.VITE_ADSTERRA_LINK;
    if (adLink) {
      window.open(adLink, "_blank");
      sessionStorage.setItem("download_ad_triggered", "1");
    }
  }
  downloadUnlocked.value = true;
};

const resetFlow = () => {
  showResult.value = false;
  downloadUnlocked.value = false;
};

const profit = computed(() => {
  return (store.marginState.sellingPrice || 0) - (store.marginState.cost || 0);
});

const margin = computed(() => {
  if (!store.marginState.sellingPrice) return 0;
  return (profit.value / store.marginState.sellingPrice) * 100;
});

const optimizedPrice = computed(() => {
  const cost = store.marginState.cost || 0;
  // Recommend price for 45% margin: price = cost / (1 - margin)
  return cost / (1 - 0.45);
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
