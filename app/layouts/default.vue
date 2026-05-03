<template>
  <div class="layout-root">
    <AppHeader />
    <main class="page-container">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.layout-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.page-container {
  flex: 1;
  width: 100%;
}
</style>
