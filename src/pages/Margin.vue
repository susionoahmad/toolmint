<template>
  <ToolLayout 
    title="Profit Margin Calculator" 
    description="Calculate gross profit and margin percentage to ensure your pricing strategy is on track."
  >
    <template #inputs>
      <InputCard title="Cost & Pricing">
        <template #icon><CalculatorIcon class="w-5 h-5 text-slate-400" /></template>
        
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Cost of Unit ($)</label>
          <input 
            type="number" 
            v-model.number="store.marginState.cost" 
            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="e.g. 50"
            @input="unhideResult = false"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Selling Price ($)</label>
          <input 
            type="number" 
            v-model.number="store.marginState.sellingPrice" 
            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="e.g. 150"
            @input="unhideResult = false"
          />
        </div>
      </InputCard>
    </template>

    <template #results>
      <ResultCard title="Calculation Result">
        <template #icon><PieChartIcon class="w-5 h-5 text-blue-200" /></template>
        
        <div v-if="!unhideResult">
          <div class="text-blue-100 text-sm mb-2">Estimated Output</div>
          <div class="h-10 bg-blue-700/50 rounded-lg animate-pulse mb-4"></div>
          <div class="h-10 bg-blue-700/50 rounded-lg animate-pulse w-2/3"></div>
          
          <DownloadGate 
            primary-text="Calculate exact margins"
            primary-button-text="Calculate Margin"
            @finalize="unhideResult = true"
          >
            <template #primaryIcon><CalculatorIcon class="w-4 h-4" /></template>
          </DownloadGate>
        </div>

        <div v-else class="space-y-6">
          <div>
            <div class="text-blue-200 text-sm font-medium uppercase tracking-wider mb-1">Gross Profit</div>
            <div class="text-4xl font-bold">${{ profit.toFixed(2) }}</div>
          </div>
          <div class="h-px bg-blue-400/30"></div>
          <div>
            <div class="text-blue-200 text-sm font-medium uppercase tracking-wider mb-1">Gross Margin</div>
            <div class="text-4xl font-bold">{{ margin.toFixed(2) }}%</div>
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
import { Calculator as CalculatorIcon, PieChart as PieChartIcon } from 'lucide-vue-next';

const store = useToolsStore();
const unhideResult = ref(false);

const profit = computed(() => {
  return (store.marginState.sellingPrice || 0) - (store.marginState.cost || 0);
});

const margin = computed(() => {
  if (!store.marginState.sellingPrice) return 0;
  return (profit.value / store.marginState.sellingPrice) * 100;
});
</script>
