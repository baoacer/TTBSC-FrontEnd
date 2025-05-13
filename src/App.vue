<script setup>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <body>
    <Header />
    <main class="min-h-screen w-full h-fit">
      <router-view />
    </main>
    <Footer />
  </body>
</template>

<style scoped></style>
