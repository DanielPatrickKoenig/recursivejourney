<template>
  <div v-if="shouldShow(JourneyElements.IMAGE)" :class="renderClasses('image-junction')" :style="'left:'+junction.position.x+'px;top:'+junction.position.y+'px;width:'+junction.size.width+'px;height:'+junction.size.height+'px;background-image:url('+junction.content+');'" v-on:click="onJunctionClicked()"></div>
  <div v-else-if="shouldShow(JourneyElements.HTML)" :class="renderClasses('html-junction')" :style="'left:'+junction.position.x+'px;top:'+junction.position.y+'px;width:'+junction.size.width+'px;height:'+junction.size.height+'px;'" v-html="junction.content" v-on:click="onJunctionClicked()"></div>
  <div v-else-if="shouldShow(JourneyElements.YOUTUBE)" :class="renderClasses('video-junction')" :style="'left:'+junction.position.x+'px;top:'+junction.position.y+'px;width:'+junction.size.width+'px;height:'+junction.size.height+'px;'">
    <iframe :width="junction.size.width" :height="junction.size.height" :src="junction.content" frameborder="0" allow="encrypted-media" allowfullscreen></iframe>
  </div>
</template>
<script>
import {EventBus} from './utils/EventBus.js'
import {JourneyElements, JourneyElementStates} from './utils/JourneyStates.js'
export default {
  props: ['junction', 'ignorestate'],
  data () {
    return {
      JourneyElements: JourneyElements
    }
  },
  methods: {
    onJunctionClicked: function () {
      var self = this
      EventBus.$emit('on-junction-clicked', self.junction)
    },
    shouldShow: function (t) {
      var self = this
      return self.junction.type === t && (self.junction.state === JourneyElementStates.OPEN || self.ignorestate)
    },
    renderClasses: function (extraClass) {
      var xtr = extraClass !== undefined && extraClass !== null ? extraClass + ' ' : ''
      return xtr + 'junction-element'
    }
  }
}
</script>
<style lang="scss" scoped>
div.junction-element{
  z-index: 200;
  position: absolute;
}
div.video-junction{
  background-color:#000000;
}
div.image-junction{
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
</style>

