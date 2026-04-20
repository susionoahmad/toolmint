<template>
  <div class="max-w-5xl mx-auto px-4 py-12">
    <!-- Main Form Grid -->
    <div class="text-center mb-12">
      <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
        {{ title }}
      </h1>
      <p class="text-lg text-slate-600 max-w-2xl mx-auto">
        {{ description }}
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
      <div class="lg:col-span-7">
        <slot name="inputs"></slot>
      </div>
      <div class="lg:col-span-5 sticky top-6">
        <slot name="results"></slot>
      </div>
    </div>

    <!-- Internal Linking Component (Revenue Boost) -->
    <InternalLoop :currentPath="route.path" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import InternalLoop from './InternalLoop.vue';

defineProps<{
  title: string;
  description: string;
}>();

const route = useRoute();
</script>
