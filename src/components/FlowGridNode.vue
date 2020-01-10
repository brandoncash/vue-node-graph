<script>
import VueDraggableResizable from 'vue-draggable-resizable';
import NodeLink from '@/components/node-links/NodeLink.vue';

export default {
  props: ['node'],

  components: {
    VueDraggableResizable,
    NodeLink,
  },

  methods: {
    onResize(x, y, width, height) {
      const event = {
        nodeName: this.node.key,
        x,
        y,
        width,
        height,
      };
      this.$emit('resizeNode', event);
    },

    onDrag(x, y) {
      // Don't proceed if we haven't dragged it far enough to snap
      if ((x / 30) === this.node.dimensions.x && (y / 30) === this.node.dimensions.y) {
        return;
      }

      const event = {
        nodeName: this.node.key,
        x,
        y,
      };
      this.$emit('dragNode', event);
    },

    onActivate() {
      const event = { nodeName: this.node.title };
      this.$emit('activated', event);
    },

    onDeactivate() {
      const event = { nodeName: this.node.title };
      this.$emit('deactivated', event);
    },

    mouseoverLink(nodeLink) {
      // console.log('mouseover', nodeLink);
      // TODO: allow activating incoming connections
      if (!nodeLink.connection) {
        return;
      }
      const link = {
        originNode: `${this.node.title}/${nodeLink.title}`,
        receivingNode: nodeLink.connection.receivingNode,
        receivingNodeIndex: nodeLink.connection.receivingNodeIndex || 0,
      };
      this.$emit('mouseoverLink', link);
    },

    mouseoutLink(nodeLink) {
      // console.log('mouseOut', nodeLink);
      // TODO: allow activating incoming connections
      if (!nodeLink.connection) {
        return;
      }
      const link = {
        originNode: `${this.node.title}/${nodeLink.title}`,
        receivingNode: nodeLink.connection.receivingNode,
        receivingNodeIndex: nodeLink.connection.receivingNodeIndex || 0,
      };
      this.$emit('mouseoutLink', link);
    },
  },

  data() {
    return {
    };
  },
};
</script>

<template>
  <vue-draggable-resizable
    class="flow-grid-node"
    :draggable="true"
    :grid="[30,30]"
    :w="node.dimensions.width * 30"
    :minWidth="4 * 30"
    :maxWidth="12 * 30"
    :h="30 + (node.description != null ? 60 : 0) + (node.links.length * 30)"
    :x="node.dimensions.x * 30"
    :y="node.dimensions.y * 30"
    :handles="['ml', 'mr']"
    dragHandle=".node-header"
    @resizing="onResize"
    @dragging="onDrag"
    @activated="onActivate"
    @deactivated="onDeactivate"
  >
    <!-- Header -->
    <header
      class="node-header"
      :class="{
        [node.color]: true,
      }"
    >
      <div
        v-if="node.icon"
        class="icon"
      >
        {{ node.icon }}
      </div>

      {{ node.title }}
    </header>

    <!-- Description -->
    <div
      v-if="node.description != null"
      class="node-description"
    >
      {{ node.description }}
    </div>

    <!-- A list of all links -->
    <node-link
      v-for="link in node.links"
      :key="link.title"
      :link="link"
      @mouseover="mouseoverLink(link)"
      @mouseout="mouseoutLink(link)"
    />
  </vue-draggable-resizable>
</template>

<style lang="scss">
  .flow-grid-node {
    border-radius: 0.4rem;
    $border: 0rem 0rem 0rem 0.2rem hsla(0, 0%, 0%, 0.5);

    box-shadow: $border;
    background-color: hsla(0, 0%, 10%, 0.65);

    &:hover {
      background-color: hsla(0, 0%, 10%, 0.7);
    }

    &.active {
      $border: 0rem 0rem 0rem 0.2rem hsla(0, 0%, 100%, 0.7);
      $dropshadow: 0rem 0.1rem 0.3rem 0.1rem hsl(0, 0%, 0%);

      box-shadow: $border, $dropshadow;
      background-color: hsla(0, 0%, 0%, 0.7);
    }
  }

  .node-header,
  .node-description,
  .node-link {
    height: 3rem;
    padding: 0.8rem 1.4rem;

    .icon {
      margin-right: 0.6rem;
      font-size: 1.8rem;
      vertical-align: top;
    }
  }

  .node-header {
    --background: #29B6F6;
    display: flex;
    height: 2.8rem;
    margin: 0.1rem;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 0.3rem;
    font-size: 1.2rem;
    white-space: nowrap;
    text-shadow: 0 0.1rem 0.1rem hsla(0, 0%, 0%, 0.7);
    box-shadow: inset 0rem 0.1rem 0rem 0rem hsla(0, 0%, 100%, 0.3),
      0rem 0rem 0rem 0.1rem hsla(0, 0%, 0%, 0.5);
    color: #efefef;
    background-image: linear-gradient(0deg, transparent,
      hsla(0, 0%, 0%, 0.2) 50%,
      hsla(0, 0%, 0%, 0) 51%),
      radial-gradient(80% 100% at 50% 0, var(--background), transparent);
  }

  .node-description {
    height: 6rem;
    overflow: hidden;
    font-size: 1.2rem;
    color: #efefef;
    cursor: default;
  }

  .variable {
    position: absolute;
    top: 0.5rem;
    width: 2rem;
    height: 2rem;
    overflow: hidden;
    text-align: center;

    &.bool {
      font-family: monospace;
      font-weight: bold;

      &.true {
        background-color: #69F0AE;
        color: #616161;
      }

      &.false {
        background-color: #FF6E40;
      }
    }

    &.flash-message {
      background-color: #616161;

      .icon {
        font-size: 1.8rem;
        color: #69F0AE;
      }
    }

    &.go-back {
      background-color: #616161;

      .icon {
        font-size: 1.8rem;
        color: #69F0AE;
      }
    }
  }

  .variable-left {
    left: -2.5rem;
  }
  .variable-right {
    right: -2.5rem;
  }

  .handle {
    position: absolute;
    top: 1.7rem;
    width: 1rem;
    height: 2.6rem;
    margin-top: -1.5rem;
    overflow: hidden;
    background-color: hsla(0, 0%, 100%, 0.6);

    &:hover {
      background-color: hsla(0, 0%, 100%, 0.9);
    }

    &.handle-ml {
      left: -1.2rem;
      border-radius: 0.2rem 0 0 0.2rem;
      box-shadow: -0.1rem 0.1rem 0rem hsla(0, 0%, 0%, 0.2);
      cursor: w-resize;
    }
    &.handle-mr {
      right: -1.2rem;
      border-radius: 0 0.2rem 0.2rem 0;
      box-shadow: 0.1rem 0.1rem 0rem hsla(0, 0%, 0%, 0.2);
      cursor: e-resize;
    }
  }

  input[type="text"],
  input[type="number"] {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-width: 0;
    padding: 0 1.3rem;
    font-size: 1.2rem;

    .active & {
      display: block;
    }
  }
</style>
