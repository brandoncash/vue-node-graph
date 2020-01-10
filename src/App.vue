<script>
import FlowGrid from './components/FlowGrid.vue';
import exampleStateMachine from './examples/state-machine.json';
import exampleShader from './examples/shader.json';
import exampleLineTest from './examples/line-test.json';

export default {
  name: 'vue-node-graph',

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
      exampleGraphs: {
        'State machine': exampleStateMachine,
        'Graphics Shader': exampleShader,
        'Line test': exampleLineTest,
      },
      currentGraph: 'Graphics Shader',
    };
  },
};
</script>

<template>
  <div id="app">
    <select
      v-model="currentGraph"
      id="graph-selector"
    >
      <option
        v-for="(exampleGraph, graphName) in exampleGraphs"
        :key="graphName"
        :value="graphName"
      >{{ graphName }}</option>
    </select>

    <flow-grid
      :nodeData="exampleGraphs[currentGraph].nodes"
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

  .icon {
    font-family: 'Material Icons';
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

  #graph-selector {
    position: fixed;
    top: 3vw;
    left: 3vw;
    z-index: 100;
  }

  .red {
    --background: #ef5350;
  }
  .pink {
    --background: #EC407A;
  }
  .purple {
    --background: #AB47BC;
  }
  .deep-purple {
    --background: #7E57C2;
  }
  .indigo {
    --background: #5C6BC0;
  }
  .blue {
    --background: #42A5F5;
  }
  .light-blue {
    --background: #29B6F6;
  }
  .cyan {
    --background: #26C6DA;
  }
  .teal {
    --background: #26A69A;
  }
  .green {
    --background: #66BB6A;
  }
  .light-green {
    --background: #9CCC65;
  }
  .lime {
    --background: #D4E157;
  }
  .yellow {
    --background: #FFEE58;
  }
  .amber {
    --background: #FFCA28;
  }
  .orange {
    --background: #FFA726;
  }
  .deep-orange {
    --background: #FF7043;
  }
  .brown {
    --background: #8D6E63;
  }
  .grey {
    --background: #BDBDBD;
  }
  .blue-grey {
    --background: #78909C;
  }
</style>
