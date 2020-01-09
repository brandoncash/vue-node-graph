<script>
import colors from '../colors';

export default {
  props: ['line'],

  components: {
  },

  computed: {
    startMarker() {
      return `url(#marker-${this.line.startMarkerType}-${this.line.strokeColor})`;
    },
    endMarker() {
      return `url(#marker-${this.line.endMarkerType}-${this.line.strokeColor})`;
    },
  },

  methods: {
    generateBezierLine(line) {
      const originPoint = line.points[0];
      const receivingPoint = line.points[1];
      let beginning = '';
      let middle = '';
      let end = '';

      // -- Beginning point --
      if (originPoint.direction === 'left') {
        beginning = `
          M ${originPoint.x - 15} ${originPoint.y}
          L ${originPoint.x - 30} ${originPoint.y}
        `;
      } else {
        beginning = `
          M ${originPoint.x + 15} ${originPoint.y}
          L ${originPoint.x + 30} ${originPoint.y}
        `;
      }
      // -- End beginning point --

      // -- Middle (control) points --
      // C <control point 1 x> <control 1 point y>
      //   <control point 2 x> <control 2 point y>
      //   <curve end point x> <curve end point y>
      if (originPoint.direction === 'left') {
        if (receivingPoint.direction === 'left') {
          middle = `
          C ${originPoint.x - 60} ${originPoint.y}
            ${receivingPoint.x - 30} ${receivingPoint.y}
            ${receivingPoint.x - 0} ${receivingPoint.y}
          `;
        } else {
          middle = `
          C ${originPoint.x - 60} ${originPoint.y}
            ${receivingPoint.x + 60} ${receivingPoint.y}
            ${receivingPoint.x + 30} ${receivingPoint.y}
          `;
        }
      } else {
        middle = '';
        if (receivingPoint.direction === 'left') {
          middle = `
            C ${originPoint.x + 60} ${originPoint.y}
              ${receivingPoint.x - 30} ${receivingPoint.y}
              ${receivingPoint.x - 0} ${receivingPoint.y}
            `;
        } else {
          middle = `
            C ${originPoint.x + 60} ${originPoint.y}
              ${receivingPoint.x + 30} ${receivingPoint.y}
              ${receivingPoint.x + 30} ${receivingPoint.y}
            `;
        }
      }
      // -- End middle points --

      // -- End points --
      if (receivingPoint.direction === 'left') {
        end = `
          L ${receivingPoint.x + 15} ${receivingPoint.y}
        `;
      } else {
        end = `
          L ${receivingPoint.x} ${receivingPoint.y}
        `;
      }
      // -- End end points --

      return `${beginning} ${middle} ${end}`;
    },

    highlight(node, event) {
      if (typeof (event.connection) === 'undefined') {
        return;
      }

      const lineName = `Line:${node.title}/${event.title}->${event.connection.toNode}`;
      if (this.$refs[lineName] && this.$refs[lineName].length > 0) {
        this.$refs[lineName][0].classList.add('active');
      }
    },

    unHighlight(node, event) {
      if (typeof (event.connection) === 'undefined') {
        return;
      }

      const lineName = `Line:${node.title}/${event.title}->${event.connection.toNode}`;
      if (this.$refs[lineName] && this.$refs[lineName].length > 0) {
        this.$refs[lineName][0].classList.remove('active');
      }
    },
  },

  data() {
    return {
      lineColors: colors,
    };
  },
};
</script>

<template>
  <g filter="url(#dropshadow)">
    <path
      :id="line.id"
      :ref="line.ref"
      :d="generateBezierLine(line)"
      :stroke="lineColors[line.strokeColor]"
      stroke-width="3"
      fill="transparent"
      :marker-start="startMarker"
      :marker-end="endMarker"
      :class="{ active: line.active }"
    />

    <text
      v-if="line.showText"
      x="30"
      dy="-4"
    >
      <textPath
        :xlink:href="`#${line.id}`"
        fill="#cfd8dc"
      >
        {{ line.text }}
      </textPath>
    </text>
  </g>
</template>

<style lang="scss" scoped>
  path {
    transition: stroke 0.1s ease-in-out;

    &.active {
      stroke: #fff;
    }
  }
</style>
