<script>
import FlowGridLine from './FlowGridLine.vue';
import FlowGridNode from './FlowGridNode.vue';
import MarkerDot from './markers/MarkerDot.vue';
import MarkerArrow from './markers/MarkerArrow.vue';
import MarkerSmallArrow from './markers/MarkerSmallArrow.vue';
import colors from '../colors';

export default {
  components: {
    FlowGridLine,
    FlowGridNode,
    MarkerDot,
    MarkerArrow,
    MarkerSmallArrow,
  },

  props: {
    nodeData: Object,
    backgroundColor: String,
  },

  data() {
    return {
      nodes: {},
      lines: {},
      lineColors: colors,
      timeSinceLastRejigger: 0,
      activeNode: '',
    };
  },

  computed: {
    nodeKeys() {
      return Object.keys(this.nodeData);
    },
  },

  watch: {
    nodeData() {
      this.resetNodes();
    },
  },

  mounted() {
    this.resetNodes();
  },

  methods: {
    resetNodes() {
      this.nodes = {};

      Object.keys(this.nodeData).forEach((nodeKey) => {
        this.nodes[nodeKey] = {
          ...this.nodeData[nodeKey],
          key: nodeKey,
        };
      });

      this.rejiggerNodes();
    },

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

        currentNode.links.forEach((link, linkIndex) => {
          // No connection available
          if (typeof (link.connection) === 'undefined') {
            return;
          }

          const receivingNodeIndex = link.connection.receivingNodeIndex || 0;
          const originNodeName = `${currentNode.title}/${link.title}`;
          const receivingNodeName = this.nodes[link.connection.receivingNode].title;

          // Start with some defaults
          const newLine = {
            ref: `Line:${originNodeName}->${link.connection.receivingNode}`,
            id: `Line--${originNodeName}--${link.connection.receivingNode}-${receivingNodeIndex}`,
            strokeColor: link.lineStrokeColor || 'default',
            startMarkerType: link.connection.startMarkerType,
            endMarkerType: link.connection.endMarkerType,
            points: [],
            text: receivingNodeName,
            active: false,
            showText: link.connection.showText || false,
          };

          // -- The origin point --
          const originNodeX = currentNode.dimensions.x * 30;
          const originPoint = { x: 0, y: 0, direction: 'left' };
          if (link.connection.direction === 'left') {
            originPoint.direction = 'left';
            originPoint.x = originNodeX + 15; // half a unit offset
            originPoint.y = (
              (currentNode.dimensions.y * 30)
              + (currentNode.description != null ? 60 : 0) // 2 units tall for description
              + ((linkIndex + 1) * 30) // + link index offset
              + 15 // + half of a unit offset to center it
            );
          } else {
            originPoint.direction = 'right';
            originPoint.x = (
              (originNodeX - 15)
              + (currentNode.dimensions.width * 30)
            );
            originPoint.y = (
              (currentNode.dimensions.y * 30)
              + (currentNode.description != null ? 60 : 0) // 2 units tall for description
              + ((linkIndex + 1) * 30) // + link index offset
              + 15 // + half of a unit offset to center it
            );
          }
          // -- End origin point --

          // -- The receiving point --
          const receivingPoint = { x: 0, y: 0, direction: 'left' };
          const receivingNode = this.nodes[link.connection.receivingNode];

          if (link.connection.receivingNodeIndex) {
            receivingNode.links[link.connection.receivingNodeIndex - 1].incomingConnection = {
              connected: true,
              connectionColor: link.lineStrokeColor || 'default',
            };
          }

          const receivingNodeX = receivingNode.dimensions.x * 30;
          const receivingNodeY = (
            (receivingNode.dimensions.y * 30)
            + (link.connection.receivingNodeIndex ? link.connection.receivingNodeIndex * 30 : 0)
            // + node index offset
            + 15 // + half of a unit offset to center it
          );

          // Automatically detect attach direction
          if (receivingNodeX < originNodeX) {
            // Attach to the right side
            receivingPoint.direction = 'right';
            receivingPoint.x = (
              receivingNodeX
              + (receivingNode.dimensions.width * 30)
            );
          } else {
            // Attach to the left side
            receivingPoint.direction = 'left';
            receivingPoint.x = receivingNodeX - 15;
          }

          receivingPoint.y = receivingNodeY;

          newLine.points[0] = originPoint;
          newLine.points[1] = receivingPoint;

          // Attach the line
          this.lines[newLine.id] = newLine;
        });
        // -- End target point --
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

    mouseoverLink(link) {
      // console.log('mouseover', link);
      const lineName = `Line--${link.originNode}--${link.receivingNode}-${link.receivingNodeIndex}`;
      this.lines[lineName].active = true;
      console.log('--', this.lines[lineName]);
    },

    mouseoutLink(link) {
      // console.log('mouseout', link);
      const lineName = `Line--${link.originNode}--${link.receivingNode}-${link.receivingNodeIndex}`;
      this.lines[lineName].active = false;
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
          <!-- Define markers -->
          <template v-for="(color, colorName) in lineColors">
            <marker-dot
              :key="`marker-dot-${colorName}`"
              :color="color"
              :colorName="colorName"
            />
            <marker-arrow
              :key="`marker-arrow-${colorName}`"
              :color="color"
              :colorName="colorName"
            />
            <marker-small-arrow
              :key="`marker-small-arrow-${colorName}`"
              :color="color"
              :colorName="colorName"
            />
          </template>
          <!-- / Markers -->

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

        <!-- Each of the lines -->
        <flow-grid-line
          v-for="(line, lineName) in lines"
          :key="lineName"
          :line="line"
        />
        <!-- / Lines -->
      </svg>

      <template v-for="(node, nodeKey) in nodes">
        <flow-grid-node
          :key="nodeKey"
          :node="node"
          @resizeNode="resizeNode"
          @dragNode="dragNode"
          @activated="nodeActivated"
          @deactivated="nodeDeactivated"
          @mouseoverLink="mouseoverLink"
          @mouseoutLink="mouseoutLink"
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
