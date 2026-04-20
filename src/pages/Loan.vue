<template>
  <ToolLayout 
    title="Loan Calculator" 
    description="Estimate your structured monthly payments simply and accurately."
  >
    <template #inputs>
      <InputCard title="Loan Information">
        <template #icon><LandmarkIcon class="w-5 h-5 text-slate-400" /></template>
        
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Loan Amount ($)</label>
          <input 
            type="number" 
            v-model.number="store.loanState.amount" 
            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="e.g. 50000"
            @input="unhideResult = false"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Annual Interest Rate (%)</label>
          <input 
            type="number" 
            v-model.number="store.loanState.interestRate" 
            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="e.g. 5"
            @input="unhideResult = false"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-1">Duration (Months)</label>
          <input 
            type="number" 
            v-model.number="store.loanState.durationMonths" 
            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="e.g. 60"
            @input="unhideResult = false"
          />
        </div>
      </InputCard>
    </template>

    <template #results>
      <ResultCard title="Your Estimated Plan">
        <template #icon><PieChartIcon class="w-5 h-5 text-blue-200" /></template>
        
        <div v-if="!unhideResult">
          <div class="text-blue-100 text-sm mb-2">Estimated Output</div>
          <div class="h-10 bg-blue-700/50 rounded-lg animate-pulse mb-4"></div>
          <div class="h-10 bg-blue-700/50 rounded-lg animate-pulse w-2/3"></div>
          
          <DownloadGate 
            primary-text="Calculate your monthly obligations"
            primary-button-text="Calculate Loan"
            @finalize="unhideResult = true"
          >
            <template #primaryIcon><LandmarkIcon class="w-4 h-4" /></template>
          </DownloadGate>
        </div>

        <div v-else class="space-y-6">
          <div>
            <div class="text-blue-200 text-sm font-medium uppercase tracking-wider mb-1">Monthly Payment</div>
            <div class="text-4xl font-bold">${{ isNaN(monthlyPayment) || !isFinite(monthlyPayment) ? '0.00' : monthlyPayment.toFixed(2) }}</div>
          </div>
          <div class="h-px bg-blue-400/30"></div>
          <div>
            <div class="text-blue-200 text-sm font-medium uppercase tracking-wider mb-1">Total Loan Amount + Interest</div>
            <div class="text-4xl font-bold">${{ isNaN(totalPaid) || !isFinite(totalPaid) ? '0.00' : totalPaid.toFixed(2) }}</div>
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
import { Landmark as LandmarkIcon, PieChart as PieChartIcon } from 'lucide-vue-next';

const store = useToolsStore();
const unhideResult = ref(false);

const monthlyPayment = computed(() => {
  const p = store.loanState.amount || 0;
  const r = (store.loanState.interestRate || 0) / 100 / 12;
  const n = store.loanState.durationMonths || 0;
  
  if (r === 0) return p / n; // 0% interest case
  return p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
});

const totalPaid = computed(() => {
  return monthlyPayment.value * (store.loanState.durationMonths || 0);
});
</script>
