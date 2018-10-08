<template>
  <div :style="liveRenderStyle">
    <div class="html-layer"></div>
    <div class="canvas-layer" :id="canvasID"></div>
  </div>
</template>

<script>
import {PixiManager} from './components/utils/pixi/PixiHelper.js'
import {Snake} from './components/utils/Snake.js'
import {Unfolder} from './components/utils/pixi/Unfolder.js'
import {JourneyElements, JourneyElementStates} from './components/utils/JourneyStates.js'
export default {
  name: 'app',
  data () {
    return {
      pixiManager: {},
      canvasID: 'stage_' + Math.random().toString().split('.').join('') + Math.random().toString().split('.').join('') + Math.random().toString().split('.').join(''),
      windowProps: {scale: 1, standardHeight: 938, width: 1600, height: 1000},
      journeyData: [
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
          type: JourneyElements.MESSAGE,
          state: JourneyElementStates.NONE,
          position: {x: 680, y: 160},
          content: 'src/assets/sampleSign.jpg',
          path: [{x: 450, y: 300}, {x: 500, y: 300}, {x: 500, y: 160}, {x: 650, y: 160}],
          children: []
        },
        {
          id: 'j0002',
          type: JourneyElements.JUNCTION,
          state: JourneyElementStates.NONE,
          position: {x: 690, y: 420},
          content: 'src/assets/logo.png',
          path: [{x: 450, y: 300}, {x: 500, y: 300}, {x: 500, y: 420}, {x: 650, y: 420}],
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
            var unfolder = new Unfolder(self.$data.pixiManager, junction.content, {width: 300, height: 200}).init()
            self.$data.pixiManager.app.stage.addChild(unfolder.container)
            unfolder.container.x = junction.position.x
            unfolder.container.y = junction.position.y
            break
          }
          case JourneyElements.JUNCTION:
          {
            break
          }
          case JourneyElements.VIDEO:
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
    exampleLine: function () {
      var self = this
      var snake = new Snake(self.drawLine)
      snake.setLineProperties({color: 0xff0000, weight: 2})
      self.executeJunction('j0000', snake)
      // snake.setLineProperties({color: 0xff0000, weight: 2})
      // snake.drawPath([{x: 50, y: 140}, {x: 200, y: 140}, {x: 260, y: 300}, {x: 450, y: 300}], function () {
      //   console.log('done with line')
      //   snake.drawPath([{x: 450, y: 300}, {x: 500, y: 300}, {x: 500, y: 160}, {x: 650, y: 160}], function () {
      //     var unfolder = new Unfolder(self.$data.pixiManager, 'src/assets/sampleSign.jpg', {width: 300, height: 200}).init()
      //     self.$data.pixiManager.app.stage.addChild(unfolder.container)
      //     unfolder.container.x = 680
      //     unfolder.container.y = 160
      //   })
      //   snake.drawPath([{x: 450, y: 300}, {x: 500, y: 300}, {x: 500, y: 420}, {x: 650, y: 420}], function () {
      //   })
      // })
    }
  },
  computed: {
    liveRenderStyle: function () {
      var self = this
      var size = {width: self.$data.windowProps.width, height: self.$data.windowProps.height}
      return 'position:fixed;height:' + size.height.toString() + 'px;width:' + size.width.toString() + 'px;transform: scale(' + self.$data.windowProps.scale + ');left:50%;top:50%;margin-top:-' + (size.height / 2).toString() + 'px;margin-left:-' + (size.width / 2).toString() + 'px;'
    }
  },
  mounted: function () {
    var self = this
    self.$data.pixiManager = new PixiManager().init(document.getElementById(self.$data.canvasID), self.$data.windowProps.width, self.$data.windowProps.height)
    self.exampleLine()
    window.addEventListener('resize', function (e) {
      console.log(window.innerWidth)
      self.$data.windowProps.scale = window.innerHeight / self.$data.windowProps.standardHeight
    })
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
