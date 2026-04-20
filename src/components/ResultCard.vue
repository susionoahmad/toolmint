<template>
  <div class="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-lg p-6 sm:p-8 text-white">
    <h2 v-if="title" class="text-xl font-semibold text-blue-100 mb-6 flex items-center gap-2">
      <slot name="icon"></slot>
      {{ title }}
    </h2>
    <div class="space-y-6">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
}>();
</script>
