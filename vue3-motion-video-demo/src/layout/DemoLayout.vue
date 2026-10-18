<template>
  <div class="layout-demo">
    <div class="sandbox">
      <slot />
    </div>
    <div class="status-bar">
      <span class="status-label">https://motion.dev/</span>
    </div>
  </div>
</template>

<style lang="less" scoped>
.layout-demo {
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  background-image:
    linear-gradient(#0b1012 60%, transparent 100%), radial-gradient(#83e6f71d 1px, transparent 1px),
    radial-gradient(#83e6f71d 1px, transparent 1px);
  background-position:
    0px 0px,
    0px 0px,
    10px 10px;
  background-size:
    100% 100%,
    20px 20px,
    20px 20px;

  .sandbox {
    min-height: 100svh;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}

.status-bar {
  position: fixed;
  z-index: 10;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  background-color: #0cdcf7;
  color: #fff;
  font-size: 11px;
  line-height: 1;
}

.status-label {
  white-space: nowrap;
}
</style>
