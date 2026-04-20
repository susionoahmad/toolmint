<template>
  <div class="min-h-screen flex flex-col bg-slate-50 font-sans">
    
    <!-- Navbar -->
    <header class="bg-white border-b border-slate-200">
      <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <router-link to="/" class="flex items-center gap-2 group">
          <div class="bg-blue-600 text-white p-1.5 rounded-lg group-hover:bg-blue-700 transition">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          </div>
          <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">ToolMint</span>
        </router-link>
        <nav class="hidden sm:flex gap-6 text-sm font-medium text-slate-600">
          <router-link to="/" class="hover:text-blue-600 transition">All Tools</router-link>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-slate-200 mt-20">
      <div class="max-w-6xl mx-auto px-4 py-8">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="text-sm text-slate-500">
            &copy; {{ new Date().getFullYear() }} Free Business Tools. All rights reserved.
          </div>
          <div class="flex gap-4 text-sm text-slate-500 font-medium">
            <router-link to="/privacy" class="hover:text-blue-600 transition underline-offset-4 hover:underline">Privacy Policy</router-link>
            <router-link to="/terms" class="hover:text-blue-600 transition underline-offset-4 hover:underline">Terms of Service</router-link>
          </div>
        </div>
        <div class="mt-4 text-xs text-slate-400 text-center md:text-left max-w-2xl">
          Disclaimer: The tools provided on this site are for informational and estimation purposes only. Always consult a professional for your final financial and business decisions.
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
