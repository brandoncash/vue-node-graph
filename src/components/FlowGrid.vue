<script>
import FlowGridLine from './FlowGridLine.vue';
import FlowGridNode from './FlowGridNode.vue';

export default {
  components: {
    FlowGridLine,
    FlowGridNode,
  },

  props: {
    nodeData: Object,
    backgroundColor: String,
  },

  data() {
    return {
      nodes: {},
      lines: {},
      lineColors: { // FIXME: import these; shared in FlowGridLine
        default: '#4caf50',
        green: '#4caf50',
        red: '#e53935',
        orange: '#ffb300',
        deepOrange: '#FF7043',
        amber: '#FFCA28',
      },
      timeSinceLastRejigger: 0,
      activeNode: '',
    };
  },

  computed: {
    nodeKeys() {
      return Object.keys(this.nodeData);
    },
  },

  mounted() {
    Object.keys(this.nodeData).forEach((nodeKey) => {
      this.nodes[nodeKey] = {
        ...this.nodeData[nodeKey],
        key: nodeKey,
      };
    });

    this.rejiggerNodes();
  },

  methods: {
    rejiggerNodes() {
      const rightNow = new Date();
      if (this.timeSinceLastRejigger > rightNow - 25) {
        return;
      }
      this.timeSinceLastRejigger = rightNow;

      // FIXME: resetting lines is necessary to refresh; poor update pattern
      this.lines = {};

      this.nodeKeys.forEach((nodeKey) => {
        const currentNode = this.nodes[nodeKey];

        currentNode.events.forEach((event, eventIndex) => {
          const { connection } = event;

          // No connection available
          if (typeof (connection) === 'undefined') {
            return;
          }
          // This is an incoming connection
          if (connection === true) {
            return;
          }

          const newLine = {
            strokeColor: 'default',
            startMarkerType: connection.startMarkerType,
            endMarkerType: connection.endMarkerType,
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
          const toNodeY = (
            (toNode.dimensions.y * 30)
            + (connection.toNodeIndex * 30) // + node index offset
            + 15 // + half of a unit offset to center it
          );

          // Set connection on the receiving node's end
          // FIXME: this requires moving the node to refresh; set a better way
          if (connection.toNodeIndex) {
            toNode.events[connection.toNodeIndex - 1].connection = true;
          }

          // The beginning point
          if (connection.direction === 'left') {
            newLine.points[0].direction = 'left';
            newLine.points[0].x = fromNodeX + 15; // half a unit offset
            newLine.points[0].y = (
              (currentNode.dimensions.y * 30)
              + (currentNode.description != null ? 60 : 0) // 2 units tall for description
              + ((eventIndex + 1) * 30) // + event index offset
              + 15 // + half of a unit offset to center it
            );
          } else {
            newLine.points[0].direction = 'right';
            newLine.points[0].x = (
              (fromNodeX - 15)
              + (currentNode.dimensions.width * 30)
            );
            newLine.points[0].y = (
              (currentNode.dimensions.y * 30)
              + (currentNode.description != null ? 60 : 0) // 2 units tall for description
              + ((eventIndex + 1) * 30) // + event index offset
              + 15 // + half of a unit offset to center it
            );
          }
          // / Beginning point

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

          newLine.points[1].y = toNodeY;

          newLine.strokeColor = event.lineStrokeColor || 'default';
          newLine.ref = `Line:${fromNodeName}->${toNodeName}`;
          const toNodeIndex = event.connection.toNodeIndex || 0;
          newLine.id = `Line--${fromNodeName}--${toNodeName}-${toNodeIndex}`;
          newLine.text = toNodeName;
          newLine.text = newLine.id;
          newLine.active = false;

          this.lines[newLine.id] = newLine;
        });
        // / End point
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
      this.nodes[event.nodeName].dimensions.width = event.width / 30;
      this.nodes[event.nodeName].dimensions.height = event.height / 30;
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
      console.log('mouseover', event);
      // const lineName = `Line--${event.fromNode}--${event.toNode}`;
      // this.lines[lineName].active = true;
      // console.log('activated', this.lines[lineName]);
      // this.lines[lineName].strokeColor = 'red';
    },

    mouseoutEvent(event) {
      console.log('mouseout', event);
      // const lineName = `Line--${event.fromNode}--${event.toNode}`;
      // this.lines[lineName].active = false;
    },
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
        height="1000"
        ref="flowchart-lines"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <template v-for="(color, colorName) in lineColors">
            <!-- Dot marker -->
            <marker
              :key="`marker-dot-${colorName}`"
              :id="`marker-dot-${colorName}`"
              markerWidth="6"
              markerHeight="6"
              refX="3"
              refY="3"
              orient="auto-start-reverse"
            >
              <circle
                cx="3"
                cy="3"
                r="3"
                :style="`fill: ${color};`"
              />
            </marker>
            <!-- / Dot marker -->

            <!-- Arrow marker -->
            <marker
              :key="`marker-arrow-${colorName}`"
              :id="`marker-arrow-${colorName}`"
              markerWidth="6"
              markerHeight="6"
              refX="6"
              refY="3"
              orient="auto-start-reverse"
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
            <!-- / Arrow marker -->

            <!-- Small arrow marker -->
            <marker
              :key="`marker-small-arrow-${colorName}`"
              :id="`marker-small-arrow-${colorName}`"
              markerWidth="3"
              markerHeight="3"
              refX="3"
              refY="1.5"
              orient="auto-start-reverse"
            >
              <path
                d="
                  M 0, 0
                  L 0, 3
                  L 3, 1.5
                  L 0, 0
                "
                :style="`fill: ${color};`"
              />
            </marker>
            <!-- / Arrow marker -->
          </template>

          <!-- Dropshadow for text and lines -->
          <filter id="dropshadow"
            x="-40%" y="-40%"
            width="180%" height="180%"
            filterUnits="userSpaceOnUse"
          >
            <feOffset result="offOut" in="SourceAlpha" dx="0" dy="1" />
            <feGaussianBlur result="blurOut" in="offOut" stdDeviation="1" />
            <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
          </filter>
          <!-- / Dropshadow -->
        </defs>

        <template v-for="(line, lineName) in lines">
          <flow-grid-line
            :key="lineName"
            :line="line"
          >
          </flow-grid-line>
        </template>
      </svg>

      <template v-for="(node, nodeKey) in nodes">
        <flow-grid-node
          :key="nodeKey"
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
    cursor: grab;

    &:active {
      cursor: grabbing;
    }
  }

  .flowchart {
    position: relative;
    width: 200rem;
    height: 100rem;
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
