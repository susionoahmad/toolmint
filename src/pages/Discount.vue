<template>
  <ToolLayout 
    title="Discount Calculator" 
    description="Calculate your final price and exactly how much you save after applied discounts."
  >
    <template #inputs>
      <InputCard title="Price Details">
        <template #icon><TagIcon class="w-5 h-5 text-slate-400" /></template>
        
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Original Price ($)</label>
          <input 
            type="number" 
            v-model.number="store.discountState.originalPrice" 
            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="e.g. 200"
            @input="unhideResult = false"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Discount (%)</label>
          <input 
            type="number" 
            v-model.number="store.discountState.discountPercentage" 
            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="e.g. 20"
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
            primary-text="Calculate exact savings"
            primary-button-text="Calculate Discount"
            @finalize="unhideResult = true"
          >
            <template #primaryIcon><TagIcon class="w-4 h-4" /></template>
          </DownloadGate>
        </div>

        <div v-else class="space-y-6">
          <div>
            <div class="text-blue-200 text-sm font-medium uppercase tracking-wider mb-1">Final Price</div>
            <div class="text-4xl font-bold">${{ finalPrice.toFixed(2) }}</div>
          </div>
          <div class="h-px bg-blue-400/30"></div>
          <div>
            <div class="text-emerald-300 text-sm font-medium uppercase tracking-wider mb-1">You Save</div>
            <div class="text-4xl font-bold text-emerald-400">+${{ amountSaved.toFixed(2) }}</div>
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
import { Tag as TagIcon, PieChart as PieChartIcon } from 'lucide-vue-next';

const store = useToolsStore();
const unhideResult = ref(false);

const amountSaved = computed(() => {
  return ((store.discountState.originalPrice || 0) * (store.discountState.discountPercentage || 0)) / 100;
});

const finalPrice = computed(() => {
  return (store.discountState.originalPrice || 0) - amountSaved.value;
});
</script>
