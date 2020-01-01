<script>
import FlowGrid from './components/FlowGrid.vue';
import sampleNodes from './node-links.json';

export default {
  name: 'logic-view',

  components: {
    FlowGrid,
  },

  methods: {
    nodeActivated(event) {
      this.activeNode = event.nodeName;
    },

    nodeDeactivated(event) {
      if (this.activeNode === event.nodeName) {
        this.activeNode = '';
      }
    },
  },

  data() {
    return {
      nodeData: sampleNodes,
    };
  },
};
</script>

<template>
  <div id="app">
    <flow-grid
      :nodeData="nodeData"
      backgroundColor="#3e8cdc"
      @nodeActivated="nodeActivated"
      @nodeDeactivated="nodeDeactivated"
    ></flow-grid>
  </div>
</template>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css?family=Roboto&display=swap');

  * {
    box-sizing: border-box;
  }

  html {
    font-size: 62.5%;
  }

  body {
    margin: 0;
    font-family: 'Roboto', Helvetica, Arial, sans-serif;
    user-select: none;
  }

  #app {
    width: 100vw;
    height: 100vh;
  }

  .split-pane {
    width: 100%;
    height: 100%;
  }
</style>
