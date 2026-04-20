<template>
  <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
    <h2 v-if="title" class="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
      <slot name="icon"></slot>
      {{ title }}
    </h2>
    <div class="space-y-5">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>
