<script setup lang="ts">
import { RouterView } from 'vue-router';
//
</script>

<template>
  <div class="h-screen flex flex-col">
    <div class="navbar bg-base-300">
      <div class="navbar-start">
        <div class="dropdown">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </div>
          <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-52">
            <li><RouterLink to="/">Homepage</RouterLink></li>
            <li><RouterLink to="/playground">Playground</RouterLink></li>
          </ul>
        </div>
      </div>
      <div class="navbar-center">
        <RouterLink to="/" class="btn btn-ghost text-xl">daisyUI</RouterLink>
      </div>
      <div class="navbar-end">
        <!-- // -->
      </div>
    </div>

    <div class="h-full my-6 container mx-auto">
      <div class="card bg-base-200 shadow-xl p-6">
        <RouterView />
      </div>
    </div>
  </div>
</template>