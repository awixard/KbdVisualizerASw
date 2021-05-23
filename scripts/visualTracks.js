const defs = require('./defs.js')
const g = require('./globals.js')
/* cTrack = compound track eg. all flute tracks combined into a single track*/ 

const canvasHeightPx = 800
const canvasDivWidth = 1200
const trackPaddingPx = 3
const leftPaddingPx = 0
const topPaddingPx = 0
const noteLineWidthPx = 1
var nrOfVisibleBeats = 16
var trackSeparatorColor = '#080646'
const scrollInterval = 50

var xScale  //pics Per Ticks
var canvasWidthPx
var trackHeightPx
var canvasNode
var pcCanvasNode
var scrollThresholdTicks

const doPerformanceSetup = function(){
  canvasDivNode = document.getElementById('tracksDiv') 
  canvasNode = document.getElementById('tracksCanvas')
  pcCanvasNode = document.getElementById('playCursorLayer')
  let tpb = g.performance.metaInfo.ticksPerBeat
  let nrOfBeats = g.performance.metaInfo.durationTicks / tpb
  xScale = canvasDivWidth/(nrOfVisibleBeats*tpb)  // px per tick
  canvasWidthPx =  xScale * g.performance.metaInfo.durationTicks
  canvasNode.width = canvasWidthPx
  pcCanvasNode.width = canvasWidthPx
  createCTracks();
  trackHeightPx = canvasHeightPx/cTrackOdrder.length
  scrollThresholdTicks = (nrOfVisibleBeats/2) * tpb
}
var tracksPerInstrumentName = {}
var cTrackOdrder = []

const createCTracks = function(){
  g.performance.noteTracks.forEach( aTrack=>{
    let instName = aTrack.trackTitle.split(' ')[0] 
    if (!tracksPerInstrumentName[instName]){
      tracksPerInstrumentName[instName] = []
      cTrackOdrder.push(instName)
    }
    tracksPerInstrumentName[instName].push(aTrack)
  })
}
const drawAllNoteLines = function(dCtx){
  dCtx.lineWidth = noteLineWidthPx
  cTrackOdrder.forEach( (anInstName,outerIx)=>{
    dCtx.strokeStyle = defs.instrumentDefs[anInstName].noteLineStroke
    let trackY = outerIx*trackHeightPx
    let noteScale = (trackHeightPx - 2*trackPaddingPx)/defs.instrumentDefs[anInstName].halfSteps

    tracksPerInstrumentName[anInstName].forEach (aSimpleTrack=>{
      dCtx.beginPath()
      aSimpleTrack.notes.forEach( aNoteRec=>{
        let x1 = leftPaddingPx + xScale * aNoteRec.ticks
        let y = (outerIx+1)*trackHeightPx-trackPaddingPx-( (aNoteRec.note-defs.instrumentDefs[anInstName].min) * noteScale )
        dCtx.moveTo(x1, y)
        let x2 = leftPaddingPx + xScale * (aNoteRec.ticks+aNoteRec.durationTicks)
        dCtx.lineTo(x2,y)
      })
      dCtx.stroke()
    })
  })
}

const drawCTrackBackgrounds = function(dCtx){
  let y = topPaddingPx; let x = leftPaddingPx
  cTrackOdrder.forEach(anInstName=>{
    dCtx.fillStyle = defs.instrumentDefs[anInstName].fill
    dCtx.fillRect(x,y, canvasWidthPx, trackHeightPx)
    y += trackHeightPx
    dCtx.beginPath(); dCtx.moveTo(x,y); dCtx.lineTo(x+canvasWidthPx, y);dCtx.stroke()
  })
}

function getClickedPosition(canvas, event) {
  let rect = canvas.getBoundingClientRect()
  let x = event.clientX - rect.left 
  let ticks = x/xScale 
  return {
    'x': x,
    y: event.clientY - rect.top,
    'ticks': ticks
  }
}
var _timeClickedListeners = []
const addClickListener = function(aListenerFunc){
  _timeClickedListeners.push(aListenerFunc)
}
const drawTracksCanvas = function(){
  const dCtx = canvasNode.getContext('2d')
  drawCTrackBackgrounds(dCtx)
  drawAllNoteLines(dCtx)
  pcCanvasNode.addEventListener( 'click',e=>{
    let rec = getClickedPosition(canvasNode, e)
    _timeClickedListeners.forEach( aListenerFunc => aListenerFunc(rec))
  })
  //canvasDivNode.addEventListener( 'click',e=>console.log(e))
}

var _lastScrollTime = -scrollInterval
var _lastScrollTicks = scrollThresholdTicks-1
var _lastPCPosPx = null

const drawPlayCursor = function(ticks){
  let playCursorPx = (ticks/g.performance.metaInfo.durationTicks)*canvasWidthPx 
  let x = leftPaddingPx + playCursorPx
  let c = pcCanvasNode.getContext('2d')
  c.clearRect(leftPaddingPx,topPaddingPx, canvasWidthPx, canvasHeightPx)
  c.beginPath(); c.moveTo( x,topPaddingPx);c.lineTo(x,topPaddingPx + canvasHeightPx); c.stroke()

  //canvasDivNode.scrollLeft += diff  //Toimii epäjohdunmukaisesti kun ei soiteta ja klikataan
  _lastPCPosPx = playCursorPx 
}
var scrollControl = function(){
  var tDiv = document.getElementById('tracksDiv') 
  this.tracksDiv =  tDiv
  this.visibleWidthPx=tDiv.offsetWidth,
  this.tracskWidthPx = canvasWidthPx

  this.tickTimeVisible = function(ticks){
    let timePx = xScale * ticks
    return timePx > this.tracksDiv.scrollLeft && timePx < this.tracksDiv.scrollLeft + this.visibleWidthPx 
  }
  
  this.scrollIt = function(){
    let visibleCenterPx = this.visibleWidthPx / 2
    if (!_lastPCPosPx) return
    if (_lastPCPosPx > this.tracksDiv.scrollLeft && _lastPCPosPx < (visibleCenterPx + this.tracksDiv.scrollLeft) ) return
    if (this.tracskWidthPx - _lastPCPosPx < visibleCenterPx) return
    this.tracksDiv.scrollLeft = _lastPCPosPx - visibleCenterPx
  }
  this.fromStart = function(){this.tracksDiv.scrollLeft = 0; return this }
  return this
}.call({})

const onStart = function(){ _lastPCPosPx = null }

module.exports = {
  'doPerformanceSetup': doPerformanceSetup,
  'drawTracksCanvas': drawTracksCanvas,
  'drawPlayCursor': drawPlayCursor,
  'onStart' : onStart,
  'addClickListener': addClickListener,
  'scrollControl': scrollControl
}
