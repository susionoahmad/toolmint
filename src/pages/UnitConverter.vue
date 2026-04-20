<template>
  <ToolLayout 
    title="Unit Converter" 
    description="Swap between metric and imperial units for shipping, logistics, or general planning."
  >
    <template #inputs>
      <InputCard title="Conversion Details">
        <template #icon><ScaleIcon class="w-5 h-5 text-slate-400" /></template>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Value to Convert</label>
            <input 
              type="number" 
              v-model.number="store.unitState.value" 
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g. 10"
              @input="handleInput"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">From</label>
              <select 
                v-model="store.unitState.from"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                @change="handleInput"
              >
                <optgroup label="Weight">
                  <option value="kg">Kilograms (kg)</option>
                  <option value="lb">Pounds (lb)</option>
                  <option value="oz">Ounces (oz)</option>
                </optgroup>
                <optgroup label="Distance">
                  <option value="km">Kilometers (km)</option>
                  <option value="mi">Miles (mi)</option>
                  <option value="m">Meters (m)</option>
                  <option value="ft">Feet (ft)</option>
                </optgroup>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">To</label>
              <select 
                v-model="store.unitState.to"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
                @change="handleInput"
              >
                <optgroup label="Weight">
                  <option value="kg">Kilograms (kg)</option>
                  <option value="lb">Pounds (lb)</option>
                  <option value="oz">Ounces (oz)</option>
                </optgroup>
                <optgroup label="Distance">
                  <option value="km">Kilometers (km)</option>
                  <option value="mi">Miles (mi)</option>
                  <option value="m">Meters (m)</option>
                  <option value="ft">Feet (ft)</option>
                </optgroup>
              </select>
            </div>
          </div>
        </div>

        <div class="mt-8 border-t border-slate-100 pt-6">
          <button 
            @click="handleGenerate" 
            :disabled="!isValid" 
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Convert (Instant Result)
          </button>
        </div>
      </InputCard>
    </template>

    <template #results>
      <ResultCard title="Converted Value">
        <template #icon><ArrowRightIcon class="w-5 h-5 text-blue-200" /></template>
        
        <div v-if="!showResult">
          <div class="text-blue-100 text-sm mb-2">Estimated Output</div>
          <div class="h-10 bg-blue-700/50 rounded-lg animate-pulse mb-4"></div>
          <div class="h-10 bg-blue-700/50 rounded-lg animate-pulse w-2/3"></div>
        </div>

        <div v-else class="space-y-6">
          <div class="bg-blue-800/40 p-6 rounded-2xl border border-blue-500/20 relative overflow-hidden transition-all duration-500 text-center">
            <div :class="[showGate ? 'blur-sm opacity-60 select-none pointer-events-none' : 'opacity-100', 'transition-all duration-[600ms]']">
              <div class="text-blue-100 text-sm font-medium uppercase tracking-wider mb-1">Result</div>
              <div class="text-5xl font-extrabold text-white">
                {{ convertedValue.toFixed(4) }} <span class="text-2xl font-normal text-blue-300 ml-1">{{ store.unitState.to }}</span>
              </div>
              <div class="mt-4 text-blue-300 text-sm italic">
                {{ store.unitState.value }} {{ store.unitState.from }} = {{ convertedValue.toFixed(4) }} {{ store.unitState.to }}
              </div>
            </div>

            <!-- Lock Overlay -->
            <div v-if="showGate" class="absolute inset-0 flex flex-col items-center justify-center z-10 pointers-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-400 mb-2 drop-shadow-md"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <span class="text-white font-bold drop-shadow-lg text-sm bg-blue-900/60 px-3 py-1 rounded-lg backdrop-blur-sm">Unlock Conversion Data</span>
            </div>
          </div>
          
          <DownloadGate 
            v-if="showGate"
            action-text="Unlock Conversion Data"
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
import ToolLayout from '../components/ToolLayout.vue';
import InputCard from '../components/InputCard.vue';
import ResultCard from '../components/ResultCard.vue';
import DownloadGate from '../components/DownloadGate.vue';
import { Scale as ScaleIcon, ArrowRight as ArrowRightIcon } from 'lucide-vue-next';

onMounted(() => {
  setSEO('Unit Converter - Weight and Distance Converter', 'Easily convert between kg, lbs, meters, miles and more with our instant unit converter.');
});

const store = useToolsStore();
const showResult = ref(false);
const showGate = ref(false);

const isValid = computed(() => store.unitState.value !== undefined && store.unitState.from !== store.unitState.to);

const handleInput = () => {
  showResult.value = false;
  showGate.value = false;
};

const conversionRates: Record<string, number> = {
  // To KG
  kg: 1,
  lb: 0.453592,
  oz: 0.0283495,
  // To Meters
  m: 1,
  km: 1000,
  mi: 1609.34,
  ft: 0.3048,
};

const convertedValue = computed(() => {
  const val = store.unitState.value || 0;
  const from = store.unitState.from;
  const to = store.unitState.to;

  if (from === to) return val;

  // Basic conversion logic (needs group matching in real app but keeping for demo)
  const isWeight = ['kg', 'lb', 'oz'].includes(from);
  const isTargetWeight = ['kg', 'lb', 'oz'].includes(to);

  if (isWeight && isTargetWeight) {
    const inKg = val * conversionRates[from];
    return inKg / conversionRates[to];
  }

  if (!isWeight && !isTargetWeight) {
    const inMeters = val * conversionRates[from];
    return inMeters / conversionRates[to];
  }

  return 0; // Invalid across group conversion
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
