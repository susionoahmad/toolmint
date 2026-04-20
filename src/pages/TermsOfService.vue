<template>
  <div class="max-w-4xl mx-auto px-4 py-16">
    <div class="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12">
      <h1 class="text-3xl font-extrabold text-slate-900 mb-8 pb-4 border-b">Terms of Service</h1>
      
      <div class="space-y-6 text-slate-600 leading-relaxed">
        <section>
          <h2 class="text-xl font-bold text-slate-800 mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing and using ToolMint, you agree to comply with and be bound by these Terms of Service. If you do not agree, please refrain from using our tools.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-800 mb-3">2. Use of Tools</h2>
          <p>
            Our tools are provided for <strong>informational and estimation purposes only</strong>. While we strive for accuracy, calculations may contain errors or be based on simplified formulas. You are responsible for verifying all results.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-800 mb-3">3. Disclaimer of Professional Advice</h2>
          <p>
            The content on ToolMint does not constitute financial, legal, or professional advice. Always consult with a qualified professional before making significant business or financial decisions based on calculations from this site.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-800 mb-3">4. Limitation of Liability</h2>
          <p>
            ToolMint and its operators shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our tools, or from any errors in the generated results.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-800 mb-3">5. Advertising and Third-Party Links</h2>
          <p>
            Our site features advertisements and may contain links to third-party websites. We are not responsible for the content, privacy practices, or reliability of any third-party services.
          </p>
        </section>

        <section>
          <h2 class="text-xl font-bold text-slate-800 mb-3">6. Modifications</h2>
          <p>
            We reserve the right to modify or discontinue any part of the service at any time without prior notice.
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
  setSEO('Terms of Service - ToolMint', 'Our terms and conditions for using the ToolMint platform.');
});
</script>
