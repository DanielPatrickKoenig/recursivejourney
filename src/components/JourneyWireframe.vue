<template>
  <div class="joureny-wireframe-component">
    <svg>
      <path v-for="(v, i) in jitems" :key="'path_'+i.toString()" :d="getPathEncoding(v.path)"></path>
    </svg>
    <div v-if="jitems.length > 0 && selctedindex >= 0 && jitems[selctedindex].path.length > 0">
      <dragger v-for="(p, i) in jitems[selctedindex].path" :key="'selectepathmarker_'+i.toString()" :activatorstring="'point'+i.toString()" :coords="{left: p.x - (pointSize.width / 2), top: p.y - (pointSize.height / 2)}" :size="{width: pointSize.width, height: pointSize.height}" :dragid="i.toString()" :activez="z.active" :inactivez="z.inactive-1" bg="transparent" :disabled="false" :signature="pointMoverSignature">
        <div slot="content" class="dragger-bounds"></div>
      </dragger>
    </div>
  </div>
</template>
<script>
import DraggableElement from './DraggableElement.vue'
import {EventBus} from './utils/EventBus.js'
export default {
  props: ['items', 'selctedindex'],
  components: {
    dragger: DraggableElement
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
      pointMoverSignature: 'pointmoversignaturestring'
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
    }
  },
  mounted: function () {
    var self = this
    EventBus.$on('draggable-element-move' + self.$data.pointMoverSignature, (n) => {
      // console.log(self.$data.jitems[self.$data.selectedItemIndex].path[Number(n.dragid)])
      self.$data.jitems[self.selctedindex].path[Number(n.dragid)].x = n.position.left + (self.$data.pointSize.width / 2)
      self.$data.jitems[self.selctedindex].path[Number(n.dragid)].y = n.position.top + (self.$data.pointSize.height / 2)
      console.log(n)
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
div.dragger-bounds{
  width:10px;
  height: 10px;
  background-color: #cc0000;
}
</style>
