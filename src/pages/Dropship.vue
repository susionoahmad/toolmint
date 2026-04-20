<template>
  <ToolLayout 
    title="Dropship Calculator" 
    description="Make solid decisions by calculating accurate net profits considering real ad spend."
  >
    <template #inputs>
      <InputCard title="Dropship Metrics">
        <template #icon><PercentIcon class="w-5 h-5 text-slate-400" /></template>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Product Cost (include shipping) ($)</label>
            <input 
              type="number" 
              v-model.number="store.dropshipState.productCost" 
              :class="[
                'w-full px-4 py-3 rounded-xl border transition-colors',
                errors.productCost ? 'border-red-400 focus:ring-2 focus:ring-red-400 focus:border-red-400' : 'border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              ]"
              placeholder="e.g. 20"
              @input="handleInput('productCost')"
            />
            <p v-if="errors.productCost" class="text-xs text-red-500 mt-1.5">{{ errors.productCost }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Selling Price ($)</label>
            <input 
              type="number" 
              v-model.number="store.dropshipState.sellingPrice" 
              :class="[
                'w-full px-4 py-3 rounded-xl border transition-colors',
                errors.sellingPrice ? 'border-red-400 focus:ring-2 focus:ring-red-400 focus:border-red-400' : 'border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              ]"
              placeholder="e.g. 60"
              @input="handleInput('sellingPrice')"
            />
            <p v-if="errors.sellingPrice" class="text-xs text-red-500 mt-1.5">{{ errors.sellingPrice }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Ad Cost per Sale (CPA) ($)</label>
            <input 
              type="number" 
              v-model.number="store.dropshipState.adCost" 
              :class="[
                'w-full px-4 py-3 rounded-xl border transition-colors',
                errors.adCost ? 'border-red-400 focus:ring-2 focus:ring-red-400 focus:border-red-400' : 'border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              ]"
              placeholder="e.g. 15"
              @input="handleInput('adCost')"
            />
            <p v-if="errors.adCost" class="text-xs text-red-500 mt-1.5">{{ errors.adCost }}</p>
          </div>
        </div>

        <div class="mt-8 border-t border-slate-100 pt-6">
          <button 
            @click="handleGenerate" 
            :disabled="!isValid" 
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Calculate Net Profit (Instant Result)
          </button>
        </div>
      </InputCard>
    </template>

    <template #results>
      <ResultCard title="Profitability Result">
        <template #icon><PieChartIcon class="w-5 h-5 text-blue-200" /></template>
        
        <div v-if="!showResult">
          <div class="text-blue-100 text-sm mb-2">Estimated Output</div>
          <div class="h-10 bg-blue-700/50 rounded-lg animate-pulse mb-4"></div>
          <div class="h-10 bg-blue-700/50 rounded-lg animate-pulse w-2/3"></div>
        </div>

        <div v-else class="space-y-6">
          <div class="bg-blue-800/40 p-6 rounded-2xl border border-blue-500/20 text-center relative overflow-hidden transition-all duration-500">
            <div :class="[showGate ? 'blur-sm opacity-60 select-none pointer-events-none' : 'opacity-100', 'transition-all duration-[600ms]']">
              <div class="text-blue-200 text-sm font-medium uppercase tracking-wider mb-1">Net Profit per Sale</div>
              <div class="text-5xl font-extrabold mb-4" :class="netProfit >= 0 ? 'text-white' : 'text-red-400'">
                {{ formatUSD(netProfit) }}
              </div>
              
              <div class="inline-flex items-center gap-2 bg-blue-500/20 text-blue-100 px-4 py-2 rounded-full font-medium border border-blue-400/30">
                Profit Margin: {{ formatPercent(profitMargin) }}
              </div>
            </div>

            <!-- Padlock visual map overlay -->
            <div v-if="showGate" class="absolute inset-0 flex flex-col items-center justify-center z-10 pointers-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-400 mb-2 drop-shadow-md"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <span class="text-white font-bold drop-shadow-lg text-sm bg-blue-900/60 px-3 py-1 rounded-lg backdrop-blur-sm">Unlock Required</span>
            </div>
          </div>
          
          <DownloadGate 
            v-if="showGate"
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
import { Percent as PercentIcon, PieChart as PieChartIcon } from 'lucide-vue-next';

onMounted(() => {
  setSEO('Dropship Profit Calculator - Advanced Analytics', 'Make solid decisions by calculating accurate net profits considering real ad spend.');
});

const store = useToolsStore();
const showResult = ref(false);
const showGate = ref(false);

const errors = reactive<Record<string, string>>({});

const isValid = computed(() => {
  const sc = store.dropshipState;
  return !!sc.productCost && !!sc.sellingPrice && typeof sc.adCost === 'number';
});

const handleInput = (field: string) => {
  if (errors[field]) delete errors[field];
  
  if (field === 'productCost' && !store.dropshipState.productCost) errors.productCost = "Required.";
  if (field === 'sellingPrice' && !store.dropshipState.sellingPrice) errors.sellingPrice = "Required.";
  if (field === 'adCost' && typeof store.dropshipState.adCost !== 'number') errors.adCost = "Required (0 is accepted).";

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

const netProfit = computed(() => {
  return (store.dropshipState.sellingPrice || 0) - (store.dropshipState.productCost || 0) - (store.dropshipState.adCost || 0);
});

const profitMargin = computed(() => {
  if (!store.dropshipState.sellingPrice) return 0;
  return (netProfit.value / store.dropshipState.sellingPrice) * 100;
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
