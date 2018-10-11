const JourneyElements = {
  SPLIT: 0,
  MESSAGE: 1,
  JUNCTION: 2,
  YOUTUBE: 3,
  VIMEO: 4,
  HTML: 5
}
const JourneyElementStates = {
  NONE: -1,
  OPEN: 0,
  BYBASSED: 1
}
const BaseJourneyItem = {
  id: '',
  type: JourneyElements.SPLIT,
  state: JourneyElementStates.NONE,
  position: {x: 0, y: 0},
  content: '',
  path: [],
  children: [],
  startingPoint: false
}
export {JourneyElements, JourneyElementStates, BaseJourneyItem}
