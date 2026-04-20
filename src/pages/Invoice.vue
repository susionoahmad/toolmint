<template>
  <ToolLayout 
    title="Invoice Generator" 
    description="Create professional, ready-to-send PDF invoices instantly."
  >
    <template #inputs>
      <div class="space-y-6">
        <InputCard title="Invoice Details">
          <template #icon><ReceiptIcon class="w-5 h-5 text-slate-400" /></template>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Client Name</label>
              <input 
                type="text" 
                v-model="store.invoiceState.clientName" 
                :class="[
                  'w-full px-4 py-3 rounded-xl border transition-colors',
                  errors.clientName ? 'border-red-400 focus:ring-2 focus:ring-red-400 focus:border-red-400' : 'border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                ]"
                placeholder="e.g. Acme Corp"
                @input="handleInput('clientName')"
              />
              <p v-if="errors.clientName" class="text-xs text-red-500 mt-1.5">{{ errors.clientName }}</p>
            </div>
            
            <!-- Items List -->
            <div class="mt-6">
              <h3 class="text-sm font-semibold text-slate-800 mb-3 border-b pb-2">Line Items</h3>
              
              <div 
                v-for="(item, index) in store.invoiceState.items" 
                :key="item.id"
                class="grid grid-cols-12 gap-3 mb-3 items-end"
              >
                <div class="col-span-12 sm:col-span-5">
                  <label v-if="index === 0" class="block text-xs text-slate-500 mb-1">Description</label>
                  <input 
                    type="text" 
                    v-model="item.name" 
                    class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="Service..."
                    @input="handleInput('items')"
                  />
                </div>
                <div class="col-span-6 sm:col-span-3">
                  <label v-if="index === 0" class="block text-xs text-slate-500 mb-1">Price</label>
                  <input 
                    type="number" 
                    v-model.number="item.price" 
                    class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="0.00"
                    @input="handleInput('items')"
                  />
                </div>
                <div class="col-span-4 sm:col-span-2">
                  <label v-if="index === 0" class="block text-xs text-slate-500 mb-1">Qty</label>
                  <input 
                    type="number" 
                    v-model.number="item.qty" 
                    class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder="1"
                  />
                </div>
                <div class="col-span-2 sm:col-span-2">
                  <button 
                    v-if="store.invoiceState.items.length > 1"
                    @click="removeItem(index)" 
                    class="w-full h-[38px] flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="Remove Item"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p v-if="errors.items" class="text-xs text-red-500 mb-2">{{ errors.items }}</p>

              <button 
                @click="addItem" 
                class="mt-2 text-sm text-blue-600 font-medium flex items-center gap-1 hover:text-blue-800 transition"
              >
                <PlusIcon class="w-4 h-4" /> Add Item
              </button>
            </div>
          </div>

          <div class="mt-8 border-t border-slate-100 pt-6">
            <button 
              @click="handleGenerate" 
              :disabled="!isValid" 
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Invoice (Instant Result)
            </button>
          </div>
        </InputCard>
      </div>
    </template>

    <template #results>
      <ResultCard title="Invoice Summary">
        <template #icon><FileTextIcon class="w-5 h-5 text-blue-200" /></template>
        
        <div v-if="!showResult">
          <div class="text-blue-100 text-sm mb-2">Estimated Output</div>
          <div class="h-10 bg-blue-700/50 rounded-lg animate-pulse mb-4"></div>
          <div class="h-10 bg-blue-700/50 rounded-lg animate-pulse w-2/3"></div>
        </div>

        <div v-else class="space-y-6">
          <div class="bg-blue-800/40 p-6 rounded-2xl border border-blue-500/20 relative overflow-hidden transition-all duration-500">
            <div :class="[showGate ? 'blur-sm opacity-60 select-none pointer-events-none' : 'opacity-100', 'transition-all duration-[600ms]']">
              <div class="font-semibold text-white mb-3 pb-3 border-b border-blue-500/30 text-lg">
                Billed To: <span class="font-normal text-blue-100">{{ store.invoiceState.clientName || '...' }}</span>
              </div>
              
              <div class="max-h-[180px] overflow-y-auto custom-scrollbar mb-4">
                <div v-for="item in store.invoiceState.items" :key="item.id" class="flex justify-between py-1 text-blue-100 text-sm">
                  <span class="truncate pr-2">{{ item.name || 'Item' }} <span class="text-blue-300 text-xs">(x{{ item.qty }})</span></span>
                  <span>{{ formatUSD(((item.price || 0) * (item.qty || 0))) }}</span>
                </div>
              </div>

              <div class="flex justify-between items-center text-2xl font-bold border-t border-blue-500/30 pt-4 text-white">
                <span>Total Due</span>
                <span class="text-emerald-300">{{ formatUSD(total) }}</span>
              </div>
            </div>

            <div v-if="showGate" class="absolute inset-0 flex flex-col items-center justify-center z-10 pointers-events-none text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-400 mb-2 drop-shadow-md"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <span class="text-white font-bold drop-shadow-lg text-sm bg-blue-900/60 px-3 py-1 rounded-lg backdrop-blur-sm">Download Gate <br/> <p class="text-xs font-normal">Action Required to Download PDF</p></span>
            </div>
          </div>
          
          <DownloadGate 
            v-if="showGate"
            action-text="Complete downloading to view PDF"
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
import { formatUSD } from '../utils/formatters';
import ToolLayout from '../components/ToolLayout.vue';
import InputCard from '../components/InputCard.vue';
import ResultCard from '../components/ResultCard.vue';
import DownloadGate from '../components/DownloadGate.vue';
import { Receipt as ReceiptIcon, FileText as FileTextIcon, Trash2 as TrashIcon, Plus as PlusIcon } from 'lucide-vue-next';
import jsPDF from 'jspdf';

onMounted(() => {
  setSEO('Free Invoice Generator - Create PDF Instantly', 'Create professional, ready-to-send PDF invoices instantly.');
});

const store = useToolsStore();
const showResult = ref(false);
const showGate = ref(false);

const errors = reactive<Record<string, string>>({});

const isValid = computed(() => {
  return !!store.invoiceState.clientName && store.invoiceState.items.some(i => i.name && i.price);
});

const handleInput = (field: string) => {
  if (errors[field]) delete errors[field];
  
  if (field === 'clientName' && !store.invoiceState.clientName) {
    errors.clientName = "Client name cannot be empty.";
  }
  if (field === 'items' && !store.invoiceState.items.some(i => i.name && i.price)) {
    errors.items = "You need at least one valid item.";
  }

  showResult.value = false;
  showGate.value = false;
};

const total = computed(() => {
  return store.invoiceState.items.reduce((sum, item) => {
    return sum + ((item.price || 0) * (item.qty || 0));
  }, 0);
});

const addItem = () => {
  store.invoiceState.items.push({
    id: Date.now().toString(),
    name: '',
    price: 0,
    qty: 1
  });
};

const removeItem = (index: number) => {
  store.invoiceState.items.splice(index, 1);
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
  generatePDF();
};

const resetFlow = () => {
  showResult.value = false;
  showGate.value = false;
};

const generatePDF = () => {
  const doc = new jsPDF();
  let y = 20;
  
  doc.setFontSize(22);
  doc.setTextColor(33, 37, 41);
  doc.text('INVOICE', 14, y);
  
  y += 15;
  doc.setFontSize(12);
  doc.text(`Client: ${store.invoiceState.clientName || 'N/A'}`, 14, y);
  
  y += 10;
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, y);
  
  y += 15;
  
  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y - 6, 182, 10, 'F');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Item Description', 16, y);
  doc.text('Price', 120, y);
  doc.text('Qty', 150, y);
  doc.text('Total', 170, y);
  
  y += 10;
  doc.setFont('helvetica', 'normal');
  
  store.invoiceState.items.forEach(item => {
    const itemTotal = ((item.price || 0) * (item.qty || 0)).toFixed(2);
    doc.text(item.name || 'Item', 16, y);
    doc.text(`$${(item.price || 0).toFixed(2)}`, 120, y);
    doc.text(`${item.qty || 0}`, 150, y);
    doc.text(`$${itemTotal}`, 170, y);
    y += 10;
  });
  
  y += 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Due: $${total.value.toFixed(2)}`, 140, y);
  
  doc.save(`invoice_${Date.now()}.pdf`);
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 8px;
}

.fade-in {
  animation: fadeIn 0.4s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
