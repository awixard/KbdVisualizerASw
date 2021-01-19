const hlp = require('./helpers.js')
const vd = require('virtual-dom')
const g = require('./globals.js')
const defs = require('./defs.js')

const el = function(elemName, attribs, children){
  return vd.h(elemName, {attributes:attribs}, children)
}
const svg = function(attribs, children){
  return vd.h('svg', {namespace: "http://www.w3.org/2000/svg", attributes: attribs }, children);
}
const svgEl = function(elemName, attribs, children){
  return vd.h(elemName, {namespace: "http://www.w3.org/2000/svg", attributes: attribs }, children);
}

const kbdWidth = 600, kbdHeight = 280, keyWidth = kbdWidth/12
const nrOfOctaves = 8, firstOctave = 1
const octaveHeight = kbdHeight/nrOfOctaves 
const loNote = firstOctave*12, hiNote = firstOctave + nrOfOctaves * 12 -1 
const cr = keyWidth/4

const getOffsetsForGroup = aNoteNr=>{
  return { 
    x:aNoteNr % 12 * keyWidth + keyWidth/2,
    y: (nrOfOctaves-Math.floor(aNoteNr/12))*octaveHeight+octaveHeight/2
  }
}
/*
const trackNameTableJupiterII = [ //Jupiter II
  'flutes','oboes', 'bassoons', 'frenchHorns', 'violins', 'violins', 'violas', 'cellos','basses'
]
*/
const trackNameTableMorning =[
  'flutes', 'oboes', 'clarinets', 'bassoons','frenchHorns',
  'frenchHorns', 'trumpets','timpanis', 'violinsI', 'violinsII', 
  'violas','cellos', 'basses'
]

var trackNameTable
const createTrackNameTable = function(){
  g.trackNameTable = g.performance.noteTracks.map(aTrack => aTrack.trackTitle.split(' ')[0])
  trackNameTable = g.trackNameTable
}
//const testtrackNameTable = ['flute', 'oboe'] 
//var trackNameTable = trackNameTableJupiterII
//var trackNameTable = trackNameTableMorning  //TÄSDÄ Mitä virkaa tällä? miksi huilu kummittelee s2-syntikassa. Kts myös ensemble.js
//var trackNameTable = createTrackNameTable() only when loaded

const getInstrumentNamesForTracksPlayingThisNote = function( aNote, aTime, anEnsembleTracker){
  return anEnsembleTracker
    .getIndicesOfTracksPlayingThisNote(aNote, aTime)
    .map(anItem=>trackNameTable[anItem])
}
const createMarkerVNode = function(offsetX, offsetY, aTrackName){
  const strokeWidthPx = 2
  let iDef = defs.instrumentDefs[aTrackName]
  if (!iDef) debugger
  return vd.h('circle',{
    namespace:"http://www.w3.org/2000/svg",
    attributes:{ 
      cx:offsetX, cy:offsetY, r:cr, fill: iDef.fill, stroke:iDef.borderStroke, strokeWidth: strokeWidthPx
    }
  },[] ) 
}
const createMarkerGroup = function(offsets, trackNames){
  let offsetUnit = 1.2*cr
  let x = offsets.x -(trackNames.length/2)*offsetUnit+ offsetUnit/2
  let result = []
  trackNames.forEach( aTrackName=>{
    result.push(createMarkerVNode(x, offsets.y, aTrackName))
    x += offsetUnit
  })
  return result
}
const createAllMarkerGroups = function(aTime, anEnsembleTracker){
  let result = []
  for(var note = loNote; note <= hiNote; note++ ){
    trackNames = getInstrumentNamesForTracksPlayingThisNote(note, aTime, anEnsembleTracker)
    if(trackNames.length)
      result = result.concat( createMarkerGroup( getOffsetsForGroup(note), trackNames.reverse() ) )
  }
  return result
}
const createKbdImage = function(){

  let getKey = function (aKeyClassNr){
    let bgColor = [1, 3, 6, 8, 10].includes(aKeyClassNr)?"#111111" : "#f0f0f0"
    return vd.h('rect', 
      { namespace:"http://www.w3.org/2000/svg",
        attributes:{
          x: aKeyClassNr * keyWidth, y:0,
          fill:bgColor,
          height:kbdHeight, width:keyWidth,
          'stroke-width':2, stroke:'#222222'
      }}, [] )
  }
  let result = []
  for( var i = 0; i<12; i++) result.push(getKey(i))
  result.push(svgEl( "line",{x1:"0", y1:kbdHeight/2,x2:kbdWidth,y2:kbdHeight/2,
    style:"stroke:rgb(160,160,160);stroke-width:1px"}, [ ] ))
  return result
}
const renderSvg = function( aTime, anEnsembleTracker){
  return svg({height:kbdHeight, width:kbdWidth},
    createKbdImage().concat(createAllMarkerGroups(aTime, anEnsembleTracker)) 
  );
}
module.exports = {'renderSvg': renderSvg,'createTrackNameTable': createTrackNameTable}
  
