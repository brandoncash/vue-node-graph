<script>
export default {
  name: 'marker-arrow',

  props: {
    color: String,
    colorName: String,
  },
};
</script>

<template>
  <marker
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
</template>
