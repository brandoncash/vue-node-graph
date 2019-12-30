<script>
import FlowGridLine from './FlowGridLine.vue';
import FlowGridNode from './FlowGridNode.vue';

export default {
  props: [
    'nodes',
    'backgroundColor',
  ],

  components: {
    FlowGridLine,
    FlowGridNode,
  },

  mounted() {
    this.rejiggerNodes();
  },

  methods: {
    rejiggerNodes() {
      const rightNow = new Date();
      if (this.timeSinceLastRejigger > rightNow - 50) {
        return;
      }
      this.timeSinceLastRejigger = rightNow;

      // FIXME: debugging only
      this.lines = {};

      const nodes = Object.keys(this.nodes);
      nodes.forEach((nodeKey) => {
        const currentNode = this.nodes[nodeKey];

        currentNode.events.forEach((event, eventIndex) => {
          const { connection } = event;

          if (typeof (connection) === 'undefined') {
            return;
          }

          const newLine = {
            strokeColor: 'default',
            points: [
              { x: 0, y: 0, direction: 'left' },
              { x: 0, y: 0, direction: 'right' },
            ],
          };

          const fromNodeName = `${currentNode.title}/${event.title}`;
          const fromNodeX = currentNode.dimensions.x * 30;

          const toNodeName = connection.toNode;
          const toNode = this.nodes[toNodeName];
          const toNodeX = toNode.dimensions.x * 30;

          // The beginning point
          if (connection.direction === 'left') {
            newLine.points[0].direction = 'left';
            newLine.points[0].x = fromNodeX;
            newLine.points[0].y = (
              (currentNode.dimensions.y * 30)
              + ((eventIndex + 1) * 30)
              + 60 // 2 units tall for description
              + 15 // half of a unit offset to center it
            );
          } else {
            newLine.points[0].direction = 'right';
            newLine.points[0].x = (
              (fromNodeX)
              + (currentNode.dimensions.width * 30)
            );
            newLine.points[0].y = (
              (currentNode.dimensions.y * 30)
              + ((eventIndex + 1) * 30)
              + 60 // 2 units tall for description
              + 15 // half of a unit offset to center it
            );
          }
          // End beginning point

          // The end point
          // Automatically detect attach direction
          if (toNodeX < fromNodeX) {
            // Attach to the right side
            newLine.points[1].direction = 'right';
            newLine.points[1].x = (
              toNodeX
              + (toNode.dimensions.width * 30)
            );
          } else {
            // Attach to the left side
            newLine.points[1].direction = 'left';
            newLine.points[1].x = toNodeX - 15;
          }

          newLine.points[1].y = (
            (toNode.dimensions.y * 30)
            + 15
          );

          newLine.strokeColor = event.lineStrokeColor || 'default';
          newLine.ref = `Line:${fromNodeName}->${toNodeName}`;
          newLine.id = `Line--${fromNodeName}--${toNodeName}`;
          // newLine.text = toNodeName;
          newLine.text = newLine.id;
          newLine.active = false;

          this.lines[newLine.id] = newLine;
        });
        // End end point ;)
      });
    },

    dragNode(event) {
      this.nodes[event.nodeName].dimensions.x = event.x / 30;
      this.nodes[event.nodeName].dimensions.y = event.y / 30;
      this.rejiggerNodes();
    },

    resizeNode(event) {
      this.nodes[event.nodeName].dimensions.x = event.x / 30;
      this.nodes[event.nodeName].dimensions.y = event.y / 30;
      this.nodes[event.nodeName].width = event.width / 30;
      this.nodes[event.nodeName].height = event.height / 30;
      this.rejiggerNodes();
    },

    nodeActivated(event) {
      this.activeNode = event.nodeName;
      this.$emit('nodeActivated', event);
    },

    nodeDeactivated(event) {
      this.activeNode = event.nodeName;
      this.$emit('nodeDeactivated', event);
    },

    mouseoverEvent(event) {
      const lineName = `Line--${event.fromNode}--${event.toNode}`;
      this.lines[lineName].active = true;
      console.log('activated', this.lines[lineName]);
      this.lines[lineName].strokeColor = 'red';
    },

    mouseoutEvent(event) {
      const lineName = `Line--${event.fromNode}--${event.toNode}`;
      this.lines[lineName].active = false;
    },
  },

  data() {
    return {
      lines: {},
      lineColors: {
        default: '#4caf50',
        red: '#e53935',
        orange: '#ffb300',
      },
      timeSinceLastRejigger: 0,
      activeNode: '',
    };
  },
};
</script>

<template>
  <div
    class="draggable-area"
  >
    <div
      class="flowchart"
      ref="flowchart"
      :style="`background-color: ${backgroundColor};`"
    >
      <svg
        width="2000"
        height="2000"
        ref="flowchart-lines"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <template v-for="(color, colorName) in lineColors">
            <marker
              :key="`start-dot-${colorName}`"
              :id="`start-dot-${colorName}`"
              markerWidth="6"
              markerHeight="6"
              refX="3"
              refY="3"
              orient="auto"
            >
              <circle
                cx="3"
                cy="3"
                r="3"
                :style="`fill: ${color};`"
              />
            </marker>

            <marker
              :key="`end-arrow-${colorName}`"
              :id="`end-arrow-${colorName}`"
              markerWidth="6"
              markerHeight="6"
              refX="0"
              refY="3"
              orient="auto"
            >
              <path
                d="
                  M 0, 0
                  L 0, 6
                  L 6, 3
                  L 0, 0
                "
                :style="`fill: ${color};`"
              />
            </marker>
          </template>

          <filter id="dropshadow"
            x="-40%" y="-40%"
            width="180%" height="180%"
            filterUnits="userSpaceOnUse"
          >
            <feOffset result="offOut" in="SourceAlpha" dx="0" dy="1" />
            <feGaussianBlur result="blurOut" in="offOut" stdDeviation="1" />
            <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
          </filter>
        </defs>

        <template v-for="(line, lineName) in lines">
          <flow-grid-line
            :key="lineName"
            :line="line"
          >
          </flow-grid-line>
          {{ lineName }}
          {{ line }}
        </template>
      </svg>

      <template v-for="node in nodes">
        <flow-grid-node
          :key="node.title"
          :node="node"
          @resizeNode="resizeNode"
          @dragNode="dragNode"
          @activated="nodeActivated"
          @deactivated="nodeDeactivated"
          @mouseoverEvent="mouseoverEvent"
          @mouseoutEvent="mouseoutEvent"
        ></flow-grid-node>
      </template>

    </div>
  </div>
</template>

<style lang="scss" scoped>
  .draggable-area {
    width: 100%;
    height: 100%;
    overflow: scroll;
    cursor: -webkit-grab;

    &:active {
      cursor: -webkit-grabbing;
    }
  }

  .flowchart {
    position: relative;
    width: 200rem;
    height: 200rem;
    background-size: 3rem 3rem;
    background-repeat: repeat;
    background-image: linear-gradient(0deg,
        rgba(255, 255, 255, 0.3) 0rem,
        transparent 0.1rem
      ),
      linear-gradient(0deg,
        transparent 1.4rem,
        rgba(255, 255, 255, 0.1) 1.4rem,
        transparent 1.5rem
      ),
      linear-gradient(90deg,
        transparent 0rem,
        transparent 1.4rem,
        rgba(255, 255, 255, 0.1) 1.4rem,
        transparent 1.5rem,
        transparent 3rem
      ),
      linear-gradient(90deg,
        rgba(255, 255, 255, 0.3) 0rem,
        transparent 0.11rem,
        transparent 3rem
      );
  }
</style>
