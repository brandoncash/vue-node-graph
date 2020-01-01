<script>
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
      let beginning = '';
      let middle = '';
      let end = '';

      if (line.points[0].direction === 'left') {
        beginning = `
          M ${line.points[0].x - 15} ${line.points[0].y}
          L ${line.points[0].x - 30} ${line.points[0].y}
        `;
      } else {
        beginning = `
          M ${line.points[0].x + 15} ${line.points[0].y}
          L ${line.points[0].x + 30} ${line.points[0].y}
        `;
      }

      if (line.points[0].direction === 'left') {
        if (line.points[1].direction === 'left') {
          middle = `
          C ${line.points[0].x - 60} ${line.points[0].y}
            ${line.points[1].x - 60} ${line.points[1].y}
            ${line.points[1].x - 15} ${line.points[1].y}
          `;
        } else {
          middle = `
          C ${line.points[0].x - 60} ${line.points[0].y}
            ${line.points[1].x + 60} ${line.points[1].y}
            ${line.points[1].x + 30} ${line.points[1].y}
          `;
        }
      } else {
        middle = '';
        if (line.points[1].direction === 'left') {
          middle = `
            C ${line.points[0].x + 60} ${line.points[0].y}
              ${line.points[1].x - 60} ${line.points[1].y}
              ${line.points[1].x - 15} ${line.points[1].y}
            `;
        } else {
          middle = `
            C ${line.points[0].x + 60} ${line.points[0].y}
              ${line.points[1].x + 60} ${line.points[1].y}
              ${line.points[1].x + 30} ${line.points[1].y}
            `;
        }
      }

      if (line.points[1].direction === 'left') {
        end = `
          L ${line.points[1].x + 15} ${line.points[1].y}
        `;
      } else {
        end = `
          L ${line.points[1].x + 22} ${line.points[1].y}
        `;
      }

      return `${beginning} ${middle} ${end}`;
    },

    highlight(node, event) {
      if (typeof (event.connection) === 'undefined') {
        return;
      }

      const lineName = `Line:${node.title}/${event.title}->${event.connection.toNode}`;
      if (this.$refs[lineName] && this.$refs[lineName].length > 0) {
        this.$refs[lineName][0].classList.add('highlighted');
      }
    },

    unHighlight(node, event) {
      if (typeof (event.connection) === 'undefined') {
        return;
      }

      const lineName = `Line:${node.title}/${event.title}->${event.connection.toNode}`;
      if (this.$refs[lineName] && this.$refs[lineName].length > 0) {
        this.$refs[lineName][0].classList.remove('highlighted');
      }
    },
  },

  data() {
    return {
      lineColors: { // FIXME: import these; shared in FlowGrid
        default: '#4caf50',
        green: '#4caf50',
        red: '#e53935',
        orange: '#ffb300',
        deepOrange: '#FF7043',
        amber: '#FFCA28',
      },
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
      :class="{ highlighted: line.active }"
    />

    <text x="30" dy="-4">
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

    &.highlighted {
      stroke: #fff;
    }
  }
</style>
