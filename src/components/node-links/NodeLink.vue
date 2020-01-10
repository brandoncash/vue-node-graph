<script>
export default {
  name: 'node-link',

  props: {
    link: Object,
  },
};
</script>

<template>
  <div
    class="node-link"
    :class="{
      [link.type]: true,
      [link.color]: true,
    }"
  >
    <div class="node-title">
      {{ link.title }}
    </div>

    <div
      v-if="link.type == 'input'"
      class="input-attachment"
      :class="{
        [link.color]: true,
        connected: link.incomingConnection,
      }"
    ></div>

    <div
      v-if="link.type == 'output'"
      class="output-attachment"
      :class="{
        [link.color]: true,
        connected: link.connection,
      }"
    ></div>
  </div>
</template>

<style lang="scss">
  .node-link {
    position: relative;
    display: flex;
    align-items: center;
    font-size: 1.2rem;
    white-space: nowrap;
    color: #efefef;
    cursor: default;
    background-image: linear-gradient(0deg, transparent,
      hsla(0, 0%, 0%, 0.2) 50%,
      hsla(0, 0%, 0%, 0) 51%),
      radial-gradient(80% 100% at 50% 0, var(--background), transparent);
    text-shadow: 0 0.1rem 0.1rem hsla(0, 0%, 0%, 0.7);
    box-shadow: inset 0rem 0rem 0rem 0.1rem hsla(0, 0%, 0%, 0.3);

    .active &:hover {
      background-color: hsla(0, 0%, 100%, 0.3);
    }

    &.input {
      background-image: linear-gradient(0deg, transparent,
        hsla(0, 0%, 0%, 0.2) 50%,
        hsla(0, 0%, 0%, 0) 51%),
        radial-gradient(80% 100% at 0% 0%, var(--background), transparent);
    }

    &.output {
      justify-content: flex-end;
      background-image: linear-gradient(0deg, transparent,
        hsla(0, 0%, 0%, 0.2) 50%,
        hsla(0, 0%, 0%, 0) 51%),
        radial-gradient(80% 100% at 100% 0%, var(--background), transparent);
    }
  }

  .input-attachment,
  .output-attachment {
    position: absolute;
    box-shadow: 0rem 0.1rem 0.1rem hsla(0, 0%, 0%, 0.5);
    border: 0.4rem solid var(--background);
    border-radius: 100%;
    width: 1.8rem;
    height: 1.8rem;
    --background: hsla(0, 0%, 100%, 0.5);
    transform: scale(0.8);
    opacity: 0.6;

    &:after {
      content: '';
      display: block;
      position: absolute;
      top: 0.3rem;
      width: 0.6rem;
      height: 0.4rem;
      background-color: var(--background);
    }

    &.connected {
      background-color: var(--background);

      &:after {
        display: none;
      }
    }

    &.connected,
    .active &:hover {
      transform: scale(1);
      opacity: 1;
      cursor: grab;
    }
  }

  .input-attachment {
    left: -0.9rem;

    &:after {
      left: -0.8rem;
    }
  }

  .output-attachment {
    right: -0.9rem;

    &:after {
      left: 1.2rem;
    }
  }
</style>
