<template>
  <div>
    <div class="preview-toggle">
      <label><input type="checkbox" v-model="preview" v-on:change="previewToggle" />Preview</label>
    </div>
    <journey v-if="preview" :jdata="journeyData"></journey>
    <journeybuilder v-else></journeybuilder>
  </div>
</template>

<script>
import {JourneyElements, JourneyElementStates} from './components/utils/JourneyStates.js'
import JourneyPlayer from './components/JourneyPlayer.vue'
import JourneyBuilder from './components/JourneyBuilder.vue'
export default {
  name: 'app',
  components: {
    journey: JourneyPlayer,
    journeybuilder: JourneyBuilder
  },
  data () {
    return {
      preview: true,
      journeyData: [
        {
          id: 'j000x',
          type: JourneyElements.HTML,
          state: JourneyElementStates.OPEN,
          position: {x: 50, y: 140},
          content: '<a>Start</a>',
          path: [],
          children: ['j0000'],
          startingPoint: true
        },
        {
          id: 'j0000',
          type: JourneyElements.SPLIT,
          state: JourneyElementStates.NONE,
          position: {x: 50, y: 140},
          content: '',
          path: [{x: 50, y: 140}, {x: 200, y: 140}, {x: 260, y: 300}, {x: 450, y: 300}],
          children: ['j0001', 'j0002']
        },
        {
          id: 'j0001',
          type: JourneyElements.HTML,
          state: JourneyElementStates.NONE,
          position: {x: 680, y: 160},
          content: '<img src="src/assets/sampleSign.jpg" style="width:auto;height:100px;" />',
          path: [{x: 450, y: 300}, {x: 500, y: 300}, {x: 500, y: 160}, {x: 650, y: 160}],
          children: []
        },
        {
          id: 'j0002',
          type: JourneyElements.HTML,
          state: JourneyElementStates.NONE,
          position: {x: 610, y: 380},
          content: '<img src="src/assets/logo.png" />',
          path: [{x: 450, y: 300}, {x: 500, y: 300}, {x: 500, y: 420}, {x: 650, y: 420}],
          children: ['j0003', 'j0004', 'j0005']
        },
        {
          id: 'j0003',
          type: JourneyElements.JUNCTION,
          state: JourneyElementStates.NONE,
          position: {x: 475, y: 525},
          content: 'src/assets/facebook.png',
          path: [{x: 700, y: 550}, {x: 700, y: 650}, {x: 600, y: 650}, {x: 550, y: 550}, {x: 500, y: 550}],
          children: []
        },
        {
          id: 'j0004',
          type: JourneyElements.HTML,
          state: JourneyElementStates.NONE,
          position: {x: 500, y: 750},
          content: '<img src="src/assets/gplus-32.png" />',
          path: [{x: 700, y: 550}, {x: 700, y: 650}, {x: 600, y: 650}, {x: 550, y: 750}, {x: 500, y: 750}],
          children: ['j0006', 'j0007']
        },
        {
          id: 'j0005',
          type: JourneyElements.YOUTUBE,
          state: JourneyElementStates.NONE,
          position: {x: 780, y: 640},
          content: 'https://www.youtube.com/embed/AvFl6UBZLv4',
          path: [{x: 700, y: 550}, {x: 700, y: 700}, {x: 780, y: 700}],
          children: []
        },
        {
          id: 'j0006',
          type: JourneyElements.HTML,
          state: JourneyElementStates.NONE,
          position: {x: 225, y: 755},
          content: '<img src="src/assets/gplus-32.png" />',
          path: [{x: 500, y: 750}, {x: 400, y: 750}, {x: 350, y: 780}, {x: 250, y: 780}],
          children: []
        },
        {
          id: 'j0007',
          type: JourneyElements.YOUTUBE,
          state: JourneyElementStates.NONE,
          position: {x: 10, y: 390},
          content: 'https://www.youtube.com/embed/opi8X9hQ7q8',
          path: [{x: 500, y: 750}, {x: 380, y: 750}, {x: 380, y: 660}, {x: 150, y: 660}, {x: 150, y: 550}],
          children: []
        }
      ]
    }
  },
  methods: {
    previewToggle: function (e) {
      var self = this
      if (!self.$data.preview) {
        self.resetData()
      }
    },
    resetData: function () {
      var self = this
      for (var i = 0; i < self.$data.journeyData.length; i++) {
        if (!self.$data.journeyData[i].startingPoint) {
          self.$data.journeyData[i].state = JourneyElementStates.NONE
        }
      }
    }
  }
}
</script>

<style lang="scss">

div.hidden-content{
  display: none;
}
div.preview-toggle{
  position: relative;
  z-index: 300;
}
</style>
