<script>
import FlowGrid from './components/FlowGrid.vue';
import sampleNodes from './sample-nodes.json';

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
      nodes: sampleNodes,
      activeNode: '',
      initializeItems: [
        { title: 'Load state from storage', subtitle: "Get <span class='blue--text'>localStorage</span> as <span class='green--text'>state</span>" },
        { divider: true, inset: true },
        { title: 'Set home route', subtitle: "Set <span class='blue--text'>path.route</span> to <span class='green--text'>'/'</span>" },
      ],
    };
  },
};
</script>

<template>
  <div id="app">
    <flow-grid
      :nodes="nodes"
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
    user-select: none;
    font-family: 'Roboto', Helvetica, Arial, sans-serif;
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
