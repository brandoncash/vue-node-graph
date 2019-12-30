<script>
import VueDraggableResizable from 'vue-draggable-resizable';

export default {
  props: ['node'],

  components: {
    VueDraggableResizable,
  },

  methods: {
    onResize(x, y, width, height) {
      const event = {
        nodeName: this.node.title,
        x,
        y,
        width,
        height,
      };
      this.$emit('resizeNode', event);
    },

    onDrag(x, y) {
      const event = {
        nodeName: this.node.title,
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

    mouseoverEvent(nodeEvent) {
      const event = {
        fromNode: `${this.node.title}/${nodeEvent.title}`,
        toNode: nodeEvent.connection.toNode,
      };
      this.$emit('mouseoverEvent', event);
    },

    mouseoutEvent(nodeEvent) {
      const event = {
        fromNode: `${this.node.title}/${nodeEvent.title}`,
        toNode: nodeEvent.connection.toNode,
      };
      this.$emit('mouseoutEvent', event);
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
    class="draggable"
    :active="true"
    :draggable="true"
    :grid="[30,30]"
    :w="node.dimensions.width * 30"
    :minw="6 * 30"
    :h="120"
    :x="node.dimensions.x * 30"
    :y="node.dimensions.y * 30"
    :handles="['ml', 'mr']"
    @resizing="onResize"
    @dragging="onDrag"
    @activated="onActivate"
    @deactivated="onDeactivate"
  >
    <header
      :class="`node-header ${node.color || ''}`"
    >
      <div v-if="node.icon">{{ node.icon }}</div>
      {{ node.title }}
    </header>

    <div class="node-description">
      {{ node.description }}
    </div>

    <template v-for="event in node.events">
      <div
        :key="event.title"
        class="node-event"
        @mouseover="mouseoverEvent(event)"
        @mouseout="mouseoutEvent(event)"
      >
        <div class="node-title">{{ event.title }}</div>

        <!-- Inline bool -->
        <template v-if="event.type === 'inline-bool'">
          <div class="variable variable-left bool false">F</div>
          <div class="variable variable-right bool true">T</div>
        </template>
        <!-- End inline bool -->

        <!-- Flash message -->
        <template v-if="event.type === 'flash-message'">
          <div class="variable variable-left flash-message">
            <div>message</div>
          </div>
        </template>
        <!-- End flash message -->

        <!-- Go back -->
        <template v-if="event.type === 'go-back'">
          <div class="variable variable-left go-back">
            <div>history</div>
          </div>
        </template>
        <!-- End go back -->
      </div>
    </template>
  </vue-draggable-resizable>
</template>

<style lang="scss" scoped>
  .draggable {
    overflow: hidden;
    border-radius: 0.3rem;
    box-shadow: 0rem 0rem 0rem 0.2rem rgba(0, 0, 0, 0.4);

    &.active {
      box-shadow: 0rem 0rem 0rem 0.1rem rgba(0, 0, 0, 0.4),
        0rem 0rem 0rem 0.3rem #4caf50;
    }
  }

  .node-header,
  .node-description,
  .node-event {
    height: 3rem;
    padding: 0.8rem;

    .icon {
      font-size: 1.8rem;
      vertical-align: top;
    }
  }

  .node-header {
    display: flex;
    align-items: center;
    overflow: hidden;
    background-color: #29b6f6;
  }

  .node-description {
    height: 6rem;
    overflow: scroll;
    background-color: #b3e5fc;
  }

  .node-event {
    position: relative;
    display: flex;
    align-items: center;
    background-color: #b0bec5;
    box-shadow: inset 0 -0.1rem 0 rgba(0, 0, 0, 0.2);

    &:hover {
      background-color: #78909c;
    }
  }

  .node-handle {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
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
</style>
