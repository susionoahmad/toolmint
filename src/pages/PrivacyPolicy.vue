<template>
  <div class="max-w-4xl mx-auto px-4 py-16">
    <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12">
      <h1 class="text-3xl font-extrabold text-slate-900 mb-8 pb-4 border-b">Privacy Policy</h1>
      
      <div class="space-y-6 text-slate-600 leading-relaxed">
        <section>
          <h2 class="text-xl font-bold text-slate-800 mb-3">1. Information Collection</h2>
          <p>
            At ToolMint, we prioritize your privacy. Our tools (Invoice Generator, Margin Calculator, etc.) operate primarily on the <strong>client-side</strong>. This means that the data you input into our calculators and generators is processed in your own browser and is not stored or transmitted to our servers.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-800 mb-3">2. Cookies and Tracking</h2>
          <p>
            We use standard web technologies like cookies to enhance your experience and analyze how our site is used. This includes:
          </p>
          <ul class="list-disc ml-6 mt-2 space-y-1">
            <li>Session cookies to maintain your application state.</li>
            <li>Third-party analytics to understand traffic patterns.</li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-800 mb-3">3. Third-Party Advertising</h2>
          <p>
            We use third-party advertising companies, such as Adsterra, to serve ads when you visit our website. These companies may use information about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-800 mb-3">4. Final Output</h2>
          <p>
            Any documents generated (such as PDF Invoices) are generated locally on your device. We do not keep copies of your generated documents.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-800 mb-3">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us through our official channels.
          </p>
        </section>

        <div class="mt-12 pt-8 border-t text-sm text-slate-400">
          Last updated: {{ new Date().toLocaleDateString() }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { setSEO } from '../utils/seo';

onMounted(() => {
  setSEO('Privacy Policy - ToolMint', 'Our commitment to protecting your privacy and data security.');
});
</script>
