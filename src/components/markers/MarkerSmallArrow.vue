<script>
export default {
  name: 'marker-small-arrow',

  props: {
    color: String,
    colorName: String,
  },
};
</script>

<template>
  <marker
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
</template>
