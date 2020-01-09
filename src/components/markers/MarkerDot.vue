<script>
export default {
  name: 'marker-dot',

  props: {
    color: String,
    colorName: String,
  },
};
</script>

<template>
    <marker
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
</template>
