hlp = require('./helpers.js')

const hugeTicks = 240*180*60*8 // abt 8 hours
const hugeTimeMs = hugeTicks * 1000

var asPerformance = function(aMidiImport){
  this.midiImport = aMidiImport
  this.data = {
    metaInfo:{ticksPerBeat: aMidiImport.timeDivision},
    tempoTrack:[],
    keySignatureTrack:[],
    timeSignatureTrack:[],
    noteTracks:[],
  }
  this.setTickTimesForTrack = function(aTrack){
    ticks = 0;
    aTrack.event.forEach( anEvent=> {ticks += anEvent.deltaTime; anEvent.ticks = ticks })
  }
  this.setTickTimes = function(){ this.midiImport.track.forEach( aTrack =>this.setTickTimesForTrack(aTrack) )}

  this.tickDurationMsFor = bpm =>{
    let ticksInMinute = bpm *this.data.metaInfo.ticksPerBeat
    return 60000/ticksInMinute
  }
  this.handleTempoTrack = function(aTrack){
    let anEvent
    for (var ix = 0; ix < aTrack.event.length; ix++){
      anEvent = aTrack.event[ix]
      switch(anEvent.metaType){
        case 88: this.data.timeSignatureTrack.push([anEvent.ticks, anEvent.data]); break;
        case 89: this.data.keySignatureTrack.push([anEvent.ticks, anEvent.data]); break;
        case 81: this.data.tempoTrack.push({ticks:anEvent.ticks, bpm:(1000000/anEvent.data)*60}); break; //BPM
    } }
    let len = this.data.tempoTrack.length
    for (var ix = 0; ix < len-1; ix++){  //last not included in for-loop
      this.data.tempoTrack[ix].untilTicks = this.data.tempoTrack[ix+1].ticks
    }
    this.data.tempoTrack[len-1].untilTicks = hugeTicks;
    let ms = 0; let prevSpanMs = 0;
    this.data.tempoTrack.forEach(anEvent =>{
      anEvent.ms = ms+prevSpanMs; 
      prevSpanMs += (anEvent.untilTicks-anEvent.ticks) * this.tickDurationMsFor(anEvent.bpm)
    } )
  }
  this.ticksToMs = function(ticks){
    let ev = this.data.tempoTrack.find( anItem => ticks >= anItem.ticks && ticks < anItem.untilTicks )
    return ev.ms + (ticks - ev.ticks) * this.tickDurationMsFor(ev.bpm)
  }

  this.handleImportedNoteTrack = function( aTrack ){

    let createNoteSpanTrack = ()=>{  
      var resultTrack={noteSpans:[]}
      this.setTickTimesForTrack( aTrack )
      let noteMsgs = aTrack.event.filter( anEvent=>anEvent.type === 8 || anEvent.type === 9)
      var nowPlaying = {};
      noteMsgs.forEach( anEvent=>{
        let key = 'N'+anEvent.data[0]
        if( anEvent.type === 9 && anEvent.data[1] >0 ){
          nowPlaying[ key ] = [anEvent.data[0],anEvent.data[1] ]
          let newEvent = { 
            ticks:anEvent.ticks, 
            presentlyPlaying:hlp.deepCopy(nowPlaying), 
            ms:this.ticksToMs(anEvent.ticks) 
          }
          resultTrack.noteSpans.push(newEvent)
          return
        }
        if (!nowPlaying[ key ]) return
        delete nowPlaying[ key ]
        resultTrack.noteSpans.push({ 
          ticks: anEvent.ticks, 
          presentlyPlaying: hlp.deepCopy(nowPlaying),
          ms:this.ticksToMs(anEvent.ticks)
        })
      })
      if (Object.keys(nowPlaying).length > 0) {console.log("Orphan note on msgs"); console.log(nowPlaying)}
      if (resultTrack.noteSpans[0].ticks > 0)
        resultTrack.noteSpans.splice(0, 0, {
          ticks: 0, presentlyPlaying:{}, ms:0, 
        })
      let nextTicks = hugeTicks, nextMs = hugeTimeMs
      for (var i = resultTrack.noteSpans.length-1; i > -1; i-- ){
        resultTrack.noteSpans[i].usedUntilTicks = nextTicks
        nextTicks = resultTrack.noteSpans[i].ticks
        
        resultTrack.noteSpans[i].usedUntilMs = nextMs
        nextMs = resultTrack.noteSpans[i].ms
      }

      return resultTrack.noteSpans //sic 
    }
    let createNoteTrack = ()=>{
      let arr = aTrack.event
      let len = arr.length

      let isNoteOff = ix => arr[ix].type===8 || (arr[ix].type ===9 && arr[ix].data[1] === 0)

      let findNoteOff = (startFromIndex, aNote)=>{
        let ind = startFromIndex
        while ( ind < len &&  ( !isNoteOff( ind ) ) || (arr[ind].data[0] !== aNote) ) ind++
        return arr[ind]
      }

      let result = []
      arr.forEach(( anEvent, ix )=>{
        if ( !(anEvent.type===9 && anEvent.data[1]>0) ) return
        let noteOffEvent = findNoteOff( ix+1, anEvent.data[0])
        result.push( {
          note: anEvent.data[0], velocity: anEvent.data[1],
          ticks:anEvent.ticks, durationTicks: noteOffEvent.ticks - anEvent.ticks,
          ms: this.ticksToMs(anEvent.ticks),
          durationMs: this.ticksToMs(noteOffEvent.ticks) - this.ticksToMs(anEvent.ticks)
        })
      })
      return result
    }
    let createProgramTrack = ()=>{
      return aTrack.event
        .filter( anEvent=> anEvent.type === 12)
        .map( (anEvent, ix, arr)=>{
          return {
            ticks: anEvent.ticks, ms: this.ticksToMs(anEvent.ticks),
            program: anEvent.data,
            usedUntilTicks: ix === arr.length-1? hugeTicks : arr[ix+1].ticks,
            usedUntilMs: ix === arr.length-1? hugeTimeMs : this.ticksToMs(arr[ix+1].ticks)
          }
        })
    }
    let createCCTracks = ()=>{
      var ccTracks = {}
      let handleCCEvent = anEvent=>{
        let key = 'C'+anEvent.data[0]
        if (!ccTracks[key]) ccTracks[key] = []
        ccTracks[key].push( {ticks: anEvent.ticks, ms: this.ticksToMs(anEvent.ticks), value:anEvent.data[1]} )
      }
      aTrack.event.filter(anEvent=>anEvent.type === 11).forEach(handleCCEvent)
      Object.keys(ccTracks).forEach( aKey=>{
        ccTracks[aKey].forEach((anEvent,ix,arr)=>{
          anEvent.usedUntilTicks = ix === arr.length-1? hugeTicks: arr[ix+1].ticks
          //anEvent.usedUntilMs = ix === arr.length-1? hugeTimeMs : this.ticksToMs(arr[ix+1].ms) 
          anEvent.usedUntilMs = ix === arr.length-1? hugeTimeMs : arr[ix+1].ms 
        })
      })
      Object.keys(ccTracks).forEach( aKey=>{
        if (ccTracks[aKey].length === 0){
          ccTracks[aKey].push( {ticks: 0, ms: 0, value:0, usedUntilMs: hugeTimeMs, usedUntilTicks:hugeTicks} ); return
        }
        let firstMs = ccTracks[aKey][0].ms
        let firstTicks = ccTracks[aKey][0].ticks
        if ( firstMs !== 0){
          ccTracks[aKey].splice(0,0, {ticks: 0, ms: 0, value:0, usedUntilMs: firstMs, usedUntilTicks:firstTicks} )
        }
      })
      return ccTracks
    }
    let trackTitleEvent = aTrack.event.find( e => (e.type === 255) && (e.metaType === 3) )
    let trackTitle = trackTitleEvent? trackTitleEvent.data : 'undefined'
    let cct = createCCTracks()
    if (Object.keys(cct).length === 0) console.log(trackTitle+' has no CC-events')
    return {
      'trackTitle': trackTitle,
      noteSpans:createNoteSpanTrack(), notes: createNoteTrack(), programs: createProgramTrack(), ccTracks: cct
    }
  }
  this.setTickTimes()
  this.handleTempoTrack(this.midiImport.track[0]);
  this.midiImport.track.slice(1).forEach( aTrack=>{
    this.data.noteTracks.push( this.handleImportedNoteTrack( aTrack ) )
  })
  let lastEventTicks = 0
  this.midiImport.track.forEach( aTrack=>{
    let lastEvent = aTrack.event[ aTrack.event.length-1 ]
    if (lastEvent.ticks > lastEventTicks) lastEventTicks = lastEvent.ticks 
  })
  this.data.metaInfo.durationTicks = lastEventTicks
  this.data.metaInfo.durationMs = this.ticksToMs( lastEventTicks )

  var titleEvent = this.midiImport.track[0].event.find(anEvent=>!!anEvent.metaType && anEvent.metaType===3)
  this.data.metaInfo.title = !!titleEvent? titleEvent.data : 'Untitled'

  var fileNameEvent = this.midiImport.track[0].event.find(anEvent=>!!anEvent.metaType && anEvent.metaType===1)
  
  this.data.metaInfo.fileName = !!fileNameEvent? fileNameEvent.data.split('|')[0] : this.data.metaInfo.title

  return this
}

module.exports = asPerformance