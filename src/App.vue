<template>
  <div :style="liveRenderStyle">
    <div :style="contentLayerStyle" class="content-layer html-layer">
      <div class='html-junction' v-for="(d, i) in journeyData" v-if="d.type == JourneyElements.HTML && d.state == JourneyElementStates.OPEN" :key="'html_'+i.toString()" :style="'left:'+d.position.x+'px;top:'+d.position.y+'px;'" v-html="d.content" v-on:click="onJourneyMapElementClicked(d)"></div>
      <div class='video-junction' v-for="(d, i) in journeyData" v-if="d.type == JourneyElements.YOUTUBE && d.state == JourneyElementStates.OPEN" :key="'video_'+i.toString()" :style="'left:'+d.position.x+'px;top:'+d.position.y+'px;'">
        <iframe width="280" height="160" :src="d.content" frameborder="0" allow="encrypted-media" allowfullscreen></iframe>
      </div>
    </div>
    <div :style="contentLayerStyle" class="content-layer canvas-layer" :id="canvasID"></div>
  </div>
</template>

<script>
import {PixiManager} from './components/utils/pixi/PixiHelper.js'
import {Snake} from './components/utils/Snake.js'
// import {Unfolder} from './components/utils/pixi/Unfolder.js'
import {JourneyElements, JourneyElementStates} from './components/utils/JourneyStates.js'
export default {
  name: 'app',
  data () {
    return {
      pixiManager: {},
      canvasID: 'stage_' + Math.random().toString().split('.').join('') + Math.random().toString().split('.').join('') + Math.random().toString().split('.').join(''),
      windowProps: {scale: 1, standardHeight: 938, width: 1600, height: 1000},
      JourneyElements: JourneyElements,
      JourneyElementStates: JourneyElementStates,
      snake: {},
      journeyData: [
        {
          id: 'j000x',
          type: JourneyElements.HTML,
          state: JourneyElementStates.OPEN,
          position: {x: 50, y: 140},
          content: '<a>Start</a>',
          path: [],
          children: ['j0000']
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
    drawLine: function (points, props, graphics) {
      var self = this
      var weight = props.weight !== undefined && props.weight !== null ? props.weight : 1
      var color = props.color !== undefined && props.colr !== null ? props.color : 0x000000
      var g = graphics === undefined || graphics === null ? self.graphics() : graphics
      g.clear()
      g.lineStyle(weight, color, 1)
      g.moveTo(points[0].x, points[0].y)
      for (var i = 1; i < points.length; i++) {
        g.lineTo(points[i].x, points[i].y)
      }
      self.$data.pixiManager.app.stage.addChild(g)
    },
    graphics: function () {
      var self = this
      return new self.$data.pixiManager.PIXI.Graphics()
    },
    getJunctionByID: function (id) {
      var self = this
      var junction = {}
      for (var i = 0; i < self.$data.journeyData.length; i++) {
        if (self.$data.journeyData[i].id === id) {
          junction = self.$data.journeyData[i]
        }
      }
      console.log(junction)
      return junction
    },
    executeJunction: function (id, snake) {
      var self = this
      var junction = self.getJunctionByID(id)
      snake.drawPath(junction.path, function () {
        junction.state = JourneyElementStates.OPEN
        switch (junction.type) {
          case JourneyElements.SPLIT:
          {
            for (var i = 0; i < junction.children.length; i++) {
              self.executeJunction(junction.children[i], snake)
            }
            break
          }
          case JourneyElements.MESSAGE:
          {
            // var unfolder = new Unfolder(self.$data.pixiManager, junction.content, {width: 300, height: 200}).init()
            // self.$data.pixiManager.app.stage.addChild(unfolder.container)
            // unfolder.container.x = junction.position.x
            // unfolder.container.y = junction.position.y
            break
          }
          case JourneyElements.JUNCTION:
          {
            var img = self.$data.pixiManager.createImage(junction.content)
            self.$data.pixiManager.app.stage.addChild(img)
            img.x = junction.position.x
            img.y = junction.position.y
            break
          }
          case JourneyElements.YOUTUBE:
          case JourneyElements.VIMEO:
          {
            break
          }
          case JourneyElements.HTML:
          {
            break
          }
        }
      })
    },
    onJourneyMapElementClicked: function (junction) {
      var self = this
      for (var i = 0; i < junction.children.length; i++) {
        var subJunction = self.getJunctionByID(junction.children[i])
        if (subJunction.state !== JourneyElementStates.OPEN) {
          self.executeJunction(junction.children[i], self.$data.snake)
        }
      }
    },
    init: function () {
      var self = this
      self.$data.snake = new Snake(self.drawLine)
      self.$data.snake.setLineProperties({color: 0xff0000, weight: 2})
      // self.executeJunction('j0000', self.$data.snake)
      self.$data.pixiManager = new PixiManager().init(document.getElementById(self.$data.canvasID), self.$data.windowProps.width, self.$data.windowProps.height)
      window.addEventListener('resize', function (e) {
        self.$data.windowProps.scale = window.innerHeight / self.$data.windowProps.standardHeight
      })
      self.$data.windowProps.scale = window.innerHeight / self.$data.windowProps.standardHeight
    }
  },
  computed: {
    liveRenderStyle: function () {
      var self = this
      var size = {width: self.$data.windowProps.width, height: self.$data.windowProps.height}
      return 'position:fixed;height:' + size.height.toString() + 'px;width:' + size.width.toString() + 'px;transform: scale(' + self.$data.windowProps.scale + ');left:50%;top:50%;margin-top:-' + (size.height / 2).toString() + 'px;margin-left:-' + (size.width / 2).toString() + 'px;'
    },
    contentLayerStyle: function () {
      var self = this
      return 'height:' + self.$data.windowProps.height.toString() + 'px;width:' + self.$data.windowProps.width.toString() + 'px;'
    }
  },
  mounted: function () {
    var self = this
    self.init()
  }
}
</script>

<style lang="scss">
.content-layer{
  position:absolute;
  left:0;
  top:0;
  
}
.html-layer{
  > div{
    z-index: 200;
    position: absolute;
  }
  > div.video-junction{
    background-color:#000000;
  }
}
</style>
