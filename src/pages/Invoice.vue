<template>
  <ToolLayout 
    title="Invoice Generator" 
    description="Create professional, ready-to-send PDF invoices instantly."
  >
    <template #inputs>
      <div class="space-y-6">
        <InputCard title="Invoice Details">
          <template #icon><ReceiptIcon class="w-5 h-5 text-slate-400" /></template>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Client Name</label>
            <input 
              type="text" 
              v-model="store.invoiceState.clientName" 
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g. Acme Corp"
            />
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
                />
              </div>
              <div class="col-span-6 sm:col-span-3">
                <label v-if="index === 0" class="block text-xs text-slate-500 mb-1">Price</label>
                <input 
                  type="number" 
                  v-model.number="item.price" 
                  class="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="0.00"
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

            <button 
              @click="addItem" 
              class="mt-2 text-sm text-blue-600 font-medium flex items-center gap-1 hover:text-blue-800 transition"
            >
              <PlusIcon class="w-4 h-4" /> Add Item
            </button>
          </div>
        </InputCard>
      </div>
    </template>

    <template #results>
      <ResultCard title="Invoice Summary">
        <template #icon><FileTextIcon class="w-5 h-5 text-blue-200" /></template>
        
        <div class="space-y-4">
          <div class="bg-blue-800/30 rounded-xl p-4 text-sm max-h-[250px] overflow-y-auto custom-scrollbar">
            <div class="font-semibold text-white mb-2 pb-2 border-b border-blue-500/30">
              Billed To: <span class="font-normal text-blue-100">{{ store.invoiceState.clientName || '...' }}</span>
            </div>
            
            <div v-for="item in store.invoiceState.items" :key="item.id" class="flex justify-between py-1 text-blue-100">
              <span class="truncate pr-2">{{ item.name || 'Item' }} <span class="text-blue-300 text-xs">(x{{ item.qty }})</span></span>
              <span>${{ ((item.price || 0) * (item.qty || 0)).toFixed(2) }}</span>
            </div>
          </div>
          
          <div class="flex justify-between items-center text-xl font-bold border-t border-blue-500/30 pt-4">
            <span>Total Due</span>
            <span>${{ total.toFixed(2) }}</span>
          </div>

          <DownloadGate 
            primary-text="Ready to download your PDF?"
            primary-button-text="Generate PDF"
            :can-proceed="true"
            @finalize="generatePDF"
          >
            <template #primaryIcon><DownloadIcon class="w-4 h-4" /></template>
          </DownloadGate>
        </div>
      </ResultCard>
    </template>
  </ToolLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useToolsStore } from '../stores/tools';
import ToolLayout from '../components/ToolLayout.vue';
import InputCard from '../components/InputCard.vue';
import ResultCard from '../components/ResultCard.vue';
import DownloadGate from '../components/DownloadGate.vue';
import { Receipt as ReceiptIcon, FileText as FileTextIcon, Trash2 as TrashIcon, Plus as PlusIcon, Download as DownloadIcon } from 'lucide-vue-next';
import jsPDF from 'jspdf';

const store = useToolsStore();

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
</style>
