<template>
  <ToolLayout 
    title="Dropship Calculator" 
    description="Make solid decisions by calculating accurate net profits considering real ad spend."
  >
    <template #inputs>
      <InputCard title="Dropship Metrics">
        <template #icon><PercentIcon class="w-5 h-5 text-slate-400" /></template>
        
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Product Cost (include shipping) ($)</label>
          <input 
            type="number" 
            v-model.number="store.dropshipState.productCost" 
            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="e.g. 20"
            @input="unhideResult = false"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Selling Price ($)</label>
          <input 
            type="number" 
            v-model.number="store.dropshipState.sellingPrice" 
            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="e.g. 60"
            @input="unhideResult = false"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Ad Cost per Sale (CPA) ($)</label>
          <input 
            type="number" 
            v-model.number="store.dropshipState.adCost" 
            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="e.g. 15"
            @input="unhideResult = false"
          />
        </div>
      </InputCard>
    </template>

    <template #results>
      <ResultCard title="Profitability Result">
        <template #icon><PieChartIcon class="w-5 h-5 text-blue-200" /></template>
        
        <div v-if="!unhideResult">
          <div class="text-blue-100 text-sm mb-2">Estimated Output</div>
          <div class="h-10 bg-blue-700/50 rounded-lg animate-pulse mb-4"></div>
          <div class="h-10 bg-blue-700/50 rounded-lg animate-pulse w-2/3"></div>
          
          <DownloadGate 
            primary-text="See your true profit numbers"
            primary-button-text="Calculate Net Profit"
            @finalize="unhideResult = true"
          >
            <template #primaryIcon><PercentIcon class="w-4 h-4" /></template>
          </DownloadGate>
        </div>

        <div v-else class="space-y-6">
          <div>
            <div class="text-blue-200 text-sm font-medium uppercase tracking-wider mb-1">Net Profit per Sale</div>
            <div class="text-4xl font-bold" :class="netProfit >= 0 ? 'text-white' : 'text-red-300'">${{ netProfit.toFixed(2) }}</div>
          </div>
          <div class="h-px bg-blue-400/30"></div>
          <div>
            <div class="text-blue-200 text-sm font-medium uppercase tracking-wider mb-1">True Profit Margin</div>
            <div class="text-4xl font-bold" :class="profitMargin >= 0 ? 'text-white' : 'text-red-300'">{{ profitMargin.toFixed(2) }}%</div>
          </div>
          
          <div class="pt-6">
            <button @click="unhideResult = false" class="text-sm text-blue-200 hover:text-white underline transition">
              Reset Calculation
            </button>
          </div>
        </div>
      </ResultCard>
    </template>
  </ToolLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useToolsStore } from '../stores/tools';
import ToolLayout from '../components/ToolLayout.vue';
import InputCard from '../components/InputCard.vue';
import ResultCard from '../components/ResultCard.vue';
import DownloadGate from '../components/DownloadGate.vue';
import { Percent as PercentIcon, PieChart as PieChartIcon } from 'lucide-vue-next';

const store = useToolsStore();
const unhideResult = ref(false);

const netProfit = computed(() => {
  return (store.dropshipState.sellingPrice || 0) - (store.dropshipState.productCost || 0) - (store.dropshipState.adCost || 0);
});

const profitMargin = computed(() => {
  if (!store.dropshipState.sellingPrice) return 0;
  return (netProfit.value / store.dropshipState.sellingPrice) * 100;
});
</script>
