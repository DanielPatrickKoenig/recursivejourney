<template>
  <div class="joureny-wireframe-component">
    <svg>
      <path v-for="(v, i) in jitems" :key="'path_'+i.toString()" :d="getPathEncoding(v.path)"></path>
    </svg>
    <div v-if="jitems.length > 0">
      <junction :junction="d" ignorestate="true" v-for="(d, i) in jitems" :key="'junction_'+i.toString()"></junction>
    </div>
    <div>
      <dragger v-for="(t, i) in jitems" :key="'itemdragger_'+i.toString()" :activatorstring="'item'+i.toString()" :coords="{left: t.position.x, top: t.position.y}" :size="{width: t.size.width, height: t.size.height}" :dragid="t.id" :activez="z.active" :inactivez="z.inactive-1" bg="transparent" :disabled="false" :signature="signatures.itemMover">
        <div slot="content" class="item-dragger-bounds"></div>
      </dragger>
      <dragger v-if="i == selctedindex && t.type != JourneyElements.SPLIT" v-for="(t, i) in jitems" :key="'itemSizedragger_'+i.toString()" :activatorstring="'item'+i.toString()" :coords="{left: Number(t.position.x) - Number(pointSize.width / 2) + Number(t.size.width), top: Number(t.position.y) - Number(pointSize.height / 2) + Number(t.size.height)}" :size="{width: pointSize.width, height: pointSize.height}" :dragid="t.id" :activez="z.active" :inactivez="z.inactive-1" bg="transparent" :disabled="false" :signature="signatures.itemSizer">
        <div slot="content" class="item-size-dragger-bounds"></div>
      </dragger>
      <span v-for="(g, j) in jitems" :key="g+'_'+j.toString()">
        <dragger v-if="j == selctedindex" v-for="(p, i) in jitems[j].path" :key="'selectepathmarker_'+j.toString()+'.'+i.toString()" :activatorstring="'point'+i.toString()" :coords="{left: p.x - (pointSize.width / 2), top: p.y - (pointSize.height / 2)}" :size="{width: pointSize.width, height: pointSize.height}" :dragid="j.toString()+'_'+i.toString()" :activez="z.active" :inactivez="z.inactive-1" bg="transparent" :disabled="false" :signature="signatures.pointMover">
          <div slot="content" class="point-dragger-bounds"></div>
        </dragger>
      </span>
    </div>
  </div>
</template>
<script>
import {EventBus} from './utils/EventBus.js'
import DraggableElement from './DraggableElement.vue'
import Junction from './Junction.vue'
import {JourneyElements} from './utils/JourneyStates.js'
export default {
  props: ['items', 'selctedindex'],
  components: {
    dragger: DraggableElement,
    junction: Junction
  },
  data () {
    return {
      jitems: this.items,
      pointSize: {
        width: 10,
        height: 10
      },
      z: {
        active: 2000,
        inactive: 1
      },
      signatures: {
        pointMover: 'pointmoversignaturestring',
        itemMover: 'itemmoversignaturestring',
        itemSizer: 'itemsizersignaturestring'
      },
      itemMoveOffset: {x: 0, y: 0, origins: []},
      JourneyElements: JourneyElements
    }
  },
  methods: {
    getPathEncoding: function (path) {
      var pathString = 'M '
      for (var i = 0; i < path.length; i++) {
        if (i > 0) {
          pathString += ' L '
        }
        pathString += path[i].x.toString() + ' ' + path[i].y.toString()
      }
      return pathString
    },
    getJunctionIndexByID: function (id) {
      var self = this
      var index = -1
      for (var i = 0; i < self.$data.jitems.length; i++) {
        if (self.$data.jitems[i].id === id) {
          index = i
          // junction = self.$data.journeyData[i]
        }
      }
      return index
    }
  },
  computed: {
    shouldShowPath: function () {
      var self = this
      return self.$data.jitems.length > 0 && self.$data.selctedindex >= 0 && self.$data.jitems[self.$data.selctedindex].path.length > 0
    },
    getSelectedPath: function () {
      var self = this
      return self.$data.jitems.length > 0 && self.$data.selctedindex >= 0 ? self.$data.jitems[self.$data.selctedindex].path : []
    }
  },
  mounted: function () {
    var self = this
    EventBus.$on('draggable-element-move' + self.$data.signatures.pointMover, (n) => {
      // console.log(self.$data.jitems[self.$data.selectedItemIndex].path[Number(n.dragid)])
      var itemIndex = Number(n.dragid.split('_')[0])
      var pointIndex = Number(n.dragid.split('_')[1])
      self.$data.jitems[itemIndex].path[pointIndex].x = n.position.left + (self.$data.pointSize.width / 2)
      self.$data.jitems[itemIndex].path[pointIndex].y = n.position.top + (self.$data.pointSize.height / 2)
      console.log(n)
    })
    EventBus.$on('draggable-element-move' + self.$data.signatures.itemMover, (n) => {
      // console.log(self.$data.jitems[self.$data.selectedItemIndex].path[Number(n.dragid)])
      var index = self.getJunctionIndexByID(n.dragid)
      console.log(n.dragid)
      console.log(index)
      if (index >= 0) {
        self.$data.jitems[index].position.x = n.position.left
        self.$data.jitems[index].position.y = n.position.top
        var moveShift = {x: self.$data.jitems[index].position.x - self.$data.itemMoveOffset.x, y: self.$data.jitems[index].position.y - self.$data.itemMoveOffset.y}
        for (var i = 0; i < self.$data.jitems[index].path.length; i++) {
          if (self.$data.jitems[index].path[i].lock) {
            self.$data.jitems[index].path[i].x = Number(self.$data.itemMoveOffset.origins[i].x) + Number(moveShift.x)
            self.$data.jitems[index].path[i].y = Number(self.$data.itemMoveOffset.origins[i].y) + Number(moveShift.y)
          }
        }
      }
      console.log(n)
    })
    EventBus.$on('draggable-element-down' + self.$data.signatures.itemMover, (n) => {
      // console.log(self.$data.jitems[self.$data.selectedItemIndex].path[Number(n.dragid)])
      // var index = self.getJunctionIndexByID(n.dragid)
      console.log('went down')
      var index = self.getJunctionIndexByID(n.dragid)
      self.$data.itemMoveOffset.x = self.$data.jitems[index].position.x
      self.$data.itemMoveOffset.y = self.$data.jitems[index].position.y
      self.$data.itemMoveOffset.origins = []
      for (var i = 0; i < self.$data.jitems[index].path.length; i++) {
        self.$data.itemMoveOffset.origins.push({x: self.$data.jitems[index].path[i].x, y: self.$data.jitems[index].path[i].y})
      }
      EventBus.$emit('update-selection-index', self.getJunctionIndexByID(n.dragid))
      // self.selctedindex = self.getJunctionIndexByID(n.dragid)
    })
    EventBus.$on('draggable-element-move' + self.$data.signatures.itemSizer, (n) => {
      // console.log(self.$data.jitems[self.$data.selectedItemIndex].path[Number(n.dragid)])
      var index = self.getJunctionIndexByID(n.dragid)
      // console.log(n.dragid)
      // console.log(index)
      self.$data.jitems[index].size.width = n.position.left - self.$data.jitems[index].position.x
      self.$data.jitems[index].size.height = n.position.top - self.$data.jitems[index].position.y
      // console.log(n)
    })
  }
}
</script>

<style lang="scss" scoped>
div.joureny-wireframe-component{
  position: fixed;
  left:0;
  top:0;
  right:0;
  bottom: 0;
  > svg{
    position: fixed;
    z-index: 224;
    left:0;
    top:0;
    right:0;
    bottom: 0;
    width:100%;
    height: 100%;
    path{
      fill: transparent;
      stroke:#000000;
    }
  }
  > div{
    position: fixed;
    z-index: 225;
    left:0;
    top:0;
    right:0;
    bottom: 0;
  }
}
div.point-dragger-bounds{
  width:10px;
  height: 10px;
  background-color: #cc0000;
}
div.item-dragger-bounds{
  width:100%;
  height: 100%;
  background-color: rgba(0,0,0,.2);
}
div.item-size-dragger-bounds{
  width:10px;
  height: 10px;
  background-color: #00cc00;
}
</style>
