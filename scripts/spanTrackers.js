const timerState = require('./globals.js').timerState

const asNoteSpanTracker = function(aNoteSpanArray){
  this.noteSpans = aNoteSpanArray
  this.ix = -1
  this.getSpecFor = function( aTime ){
    if ( this.ix < 0){
      this.ix = this.noteSpans.findIndex( aSpec=> aTime >=aSpec.ms && aTime < aSpec.usedUntilMs)
      return this.noteSpans[this.ix].presentlyPlaying
    }
    if ( aTime < this.noteSpans[this.ix].ms) this.ix = 0
    let len = this.noteSpans.length
    while( this.ix < len && !(aTime >= this.noteSpans[this.ix].ms && aTime < this.noteSpans[this.ix].usedUntilMs) ) this.ix++
    
    return this.noteSpans[this.ix].presentlyPlaying
  }
  this.playsNoteOnTime = function(aNote, aTime){
    return !!this.getSpecFor(aTime)['N'+aNote]
  }
  return this
}

const asCCSpanTracker = function( aCCSpanArray, aControllerNr ){
  this.ccSpans = aCCSpanArray
  this.controllerNr = aControllerNr
  this.ix = -1
  this.getSpecFor = function(aTime){
    if ( this.ix < 0 ){
      this.ix = this.ccSpans.findIndex( aSpec=> aTime >= aSpec.ms && aTime < aSpec.usedUntilMs)
      let value = this.ix > -1? this.ccSpans[this.ix] : 0
      return { cc: this.controllerNr, 'value':value }
    }
    if ( aTime < this.ccSpans[this.ix].ms) this.ix = 0
    var  len = this.ccSpans.length; 
    while( this.ix < len && !(aTime >= this.ccSpans[this.ix].ms && aTime < this.ccSpans[this.ix].usedUntilMs) ) this.ix++
    return { cc: this.controllerNr, value:this.ccSpans[this.ix].value }
  }
  return this
}

const asProgramSpanTracker = function( aProgramSpanArray ){
  this.programs = aProgramSpanArray
  this.ix = -1
  this.getSpecFor = function(aTime){
    //QaD
    //if (!aTime) aTime = 0
    if (this.programs.length === 0) return -1 // same as inital value in ensemble state
    if ( this.ix < 0 ){
      this.ix = this.programs.findIndex( aSpec=> aTime >= aSpec.ms && aTime < aSpec.usedUntilMs)
      return this.programs[this.ix].program
    }
    if ( aTime < this.programs[this.ix].ms) this.ix = 0
    let len = this.programs.length
    while( this.ix < len && !(aTime >= this.programs[this.ix].ms && aTime < this.programs[this.ix].usedUntilMs) )
      this.ix++
    return this.programs[this.ix].program
  }
  return this
}
const asInstrumentTracker= function( anInstrumentTrack ){
  let ccNrFor = aKey=>parseInt(aKey.slice(1))
  this.spanTracks = {
    noteSpans: asNoteSpanTracker.call({}, anInstrumentTrack.noteSpans),
    programSpans: asProgramSpanTracker.call({}, anInstrumentTrack.programs),
    ccSpanTracks:[]
  }
  for ( var aCCTrackKey in anInstrumentTrack.ccTracks)
    this.spanTracks.ccSpanTracks.push(asCCSpanTracker.call({}, anInstrumentTrack.ccTracks[aCCTrackKey], ccNrFor(aCCTrackKey)))
  
  this.getSpecFor = function(aTime){
    let getCCSpecs = ()=>{
      let result = []
      this.spanTracks.ccSpanTracks.forEach( aTracker=>result.push( aTracker.getSpecFor(aTime) ))
      return result
    }
    let noteSpec = !(g.timerState.playState === ':stopped')? this.spanTracks.noteSpans.getSpecFor( aTime ): {}
    return {
      noteSpec: noteSpec,
      programSpec: this.spanTracks.programSpans.getSpecFor( aTime ),
      ccSpecs: getCCSpecs()
    }
  }
  return this
}

const asEnsembleTrackers = function( performanceDataArray ){
  this.instrumentTrackers = []

  this.durationMs = performanceDataArray.metaInfo.durationMs
  console.log('Duration Ms: '+this.durationMs)
  this.ticksPerBeat = performanceDataArray.metaInfo.ticksPerBeat
  this.tempoTrack = performanceDataArray.tempoTrack
  this.durationTicks = performanceDataArray.metaInfo.durationTicks

  performanceDataArray.noteTracks.forEach( anInstrumentTrack=>{
    this.instrumentTrackers.push( asInstrumentTracker.call({}, anInstrumentTrack))
  })
  this.getSpecFor = function( aTime ){
    if (aTime > this.durationMs+100) return false  //end of performance: return falsy
    let result = []
    this.instrumentTrackers.forEach((anInstrument, ix)=>{
      let spec = anInstrument.getSpecFor(aTime)
      //if (spec.programSpec !== -1) console.log(ix)
      result.push(spec)
    } )
    return result
  }
  this.getMapOfInstrumentsNowPlayingNote  = function(aNote, aTime){
    let result = []
    this.instrumentTrackers.forEach( anInstrumentTrack =>{
      result.push(anInstrumentTrack.noteSpans.playsNoteOnTime( aNote, aTime ))
    })
    return result
  }
  this.getIndicesOfTracksPlayingThisNote = function( aNote, aTime){
    let result = []
    this.instrumentTrackers.forEach( (anInstrumentTrack, ix)=>{
      if (anInstrumentTrack.spanTracks.noteSpans.playsNoteOnTime( aNote, aTime ))
      result.push(ix)
    })
    return result
  }
  this.msInTick = function(bpm){
    let ticksInMinute = bpm *this.ticksPerBeat
    return 60000/ticksInMinute
  }
  var _lastSpan = null
  this.msToTicks = function(ms){
    let getSpan = ()=>{
      if(_lastSpan && (ms >= lastSpan.ms && ms < _lastSpan.usedUntilMs)){
        return _lastSpan
      }
      let len = this.tempoTrack.length
      if( len === 1 ) return this.tempoTrack[0]
      let ix = this.tempoTrack.findIndex(aSpan=>aSpan.ms > ms )
      if (ix ===-1) return this.tempoTrack[len-1] 
      else return this.tempoTrack[ix-1]       
    }
    let theSpan = getSpan()
    let diffMs = ms - theSpan.ms
    let diffTicks = diffMs / this.msInTick(theSpan.bpm)
    return theSpan.ticks + diffTicks
  }
  this.ticksToMs = function(ticks){
    let ev = this.tempoTrack.find( anItem => ticks >= anItem.ticks && ticks < anItem.untilTicks )
    return ev.ms + (ticks - ev.ticks) * this.msInTick(ev.bpm)
  }
  this.newTimeByDeltaBeats = function( aTimeMs, beats, roundToBeat ){
    let whereTicks = this.msToTicks(aTimeMs) + beats*this.ticksPerBeat
    if (whereTicks < 0 ) whereTicks = 0
    if (whereTicks > this.durationTicks) whereTicks = this.durationTicks 
    if (!roundToBeat ) return this.ticksToMs(whereTicks)
    if (roundToBeat  === ':up')
      return this.ticksToMs( (Math.trunc( whereTicks/this.ticksPerBeat )+1) * this.ticksPerBeat )
    return this.ticksToMs( (Math.trunc( whereTicks/this.ticksPerBeat )) * this.ticksPerBeat )
  }
  return this
}

module.exports = asEnsembleTrackers
