evHlp = require('./musicEvent.js').helpers

var allProgramMappings = 
{jupiterI:[
  { P73: ['s1',0]}, //flute
  { P68: ['s1',1]}, //oboe
  { P70: ['s1',2]}, //bassoon
  { P60: ['s1',3]}, //fhorn
  { P56: ['s1',4]}, //trumpet

  { P47: ['s1',5]}, //timpani
  { P48: ['s1',6]}, //violins I
  { P48: ['s1',7]}, //violins II
  { P48: ['s1',8]}, //violas
  { P48: ['s1',9]}, //celli

  { P43: ['s1',10]},  //basses
  { P45: ['s1',11]},  //pizzicato strs 1
  { P45: ['s1',12]}   //pizzicato strs 2
],
jupiterII:[
  { P73: ['s1',0]}, //flute
  { P68: ['s1',1]}, //oboe
  { P70: ['s1',2]}, //bassoon
  { P60: ['s1',3]}, //fhorn
  //{ P56: ['s1',4]}, //trumpet
  //{ P47: ['s1',5]}, //timpani
  { P48: ['s1',6]}, //violins I

  { P48: ['s1',7]}, //violins II 6
  { P48: ['s1',8]}, //violas
  { P48: ['s1',9]}, //celli
  { P43: ['s1',10]}  //basses 9
  //{ P45: ['s1',11]},  //pizzicato strs 1
  //{ P45: ['s1',12]}   //pizzicato strs 2
],

morning: [
  { P73: ['s1',0]}, //flute 0
  { P68: ['s1',1]}, //oboe
  { P71: ['s1',2]},//Klarinetti 
  { P70: ['s1',3]}, //bassoon
  { P60: ['s1',4]}, //fhorn

  { P60: ['s1',5]}, //fhorn 5
  { P56: ['s1',6]}, //trumpet
  //{ def: ['s1',7]}, //timpani  //TÄSDÄ onko ??
  { P47: ['s1',7]}, //timpani  //TÄSDÄ onko ??
  { P48: ['s1',8], P49:['s1',8] }, //violins I
  { P48: ['s1',9], P49: ['s1',9] }, //violins II

  { P48: ['s1',10], P49: ['s1',10] }, //violas 10
  { P48: ['s1',11], P45:['s1',13], P49: ['s1',11] }, //celli
  { P49: ['s1',12], P45:['s1',14], P49:['s1',12] }  //basses 12
],
millersDance: [
  { P73: ['s1',0]}, //flute 0
  { P68: ['s1',1]}, //oboe
  { P69: ['s1',2 ]},//engl horn
  { P71: ['s1',3]},//Klarinetti 
  { P70: ['s1',4]}, //bassoon

  { P60: ['s1',5]}, //fhorn
  { P56: ['s1',6]}, //trumpet
  { P59: ['s1',7]}, //trumpet
  { P47: ['s2',0]}, //timpani
  { P127: ['s1',9]}, //percussion 

  { P127: ['s1',9]}, 
  { P0:['s1', 8]}, //piano
  { P46: ['s1',10]},//harppu
  { P48: ['s1',11], P49:['s1',11],P45:['s2',11] }, //violins I
  { P48: ['s1',12], P49:['s1',12],P45:['s2',12] }, //violins II

  { P48: ['s1',13], P49:['s1',13],P45:['s2',13] }, //violas
  { P48: ['s1',14], P49:['s1',14],P45:['s2',14] }, //celli
  { P48: ['s1',15], P49:['s1',15],P45:['s2',15] }  //basses
],

seine: [
  {def:['s1',0]},
  {def:['s1',1]},
  {def:['s1',2]},

  {def:['s1',3]},
  {def:['s1',4]},
  {def:['s1',5]},

  {def:['s2',0]},
  {def:['s1',7]},
  {def:['s1',8]},

  {def:['s1',12]}
],
faune: [
  {def:['s1', 0]},
  {def:['s1', 1]},
  {def:['s1', 2]},
  {def:['s1', 3]},
  {def:['s1', 4]},

  {def:['s1', 5]},
  {def:['s1', 6]},
  {def:['s1', 7]},
  {def:['s1', 8]},
  {def:['s1', 9]},

  {def:['s1', 10]},
  {def:['s1', 11]},
  {def:['s1', 12]},
  {def:['s1', 13]}, //TÄSDÄ FH player 2 cc 1 pomppaa tappiin 
  {def:['s1', 14]},

  {def:['s1', 15]},

  {def:['s2', 14]},  //17,1 ancienty cymb
  {def:['s2', 0]},  //harp 1
  {def:['s2', 1]},  //harp 2
  {def:['s2', 2]},  //solo vln
  {def:['s2', 3]},  //vln I

  {def:['s2', 4]},  //22,5 vln II
  {def:['s2', 5]},  //solo cello
  {def:['s2', 6]},  //celli
  {def:['s2', 7]},
  {def:['s2', 8]},
],

sirenes: [
    // s1 winds s2 chorus s3 strs s4 gtan
  {def:['s1', 0]},  //flutes 1
  {def:['s1', 1]},  //flutes 2
  {def:['s1', 2]},  //oboes 3
  {def:['s1', 3]},  //englishHorns 4
  {def:['s1', 4]},  //clarinets 5

  {def:['s1', 5]},  //bassoons 6
  {def:['s1', 6]},  //bassoons 7
  {def:['s1', 7]},  //horns 8
  {def:['s1', 8]},  //horns 9
  {def:['s1', 9]},  //trumpettes 10

  {def:['s4', 0]}, //harp 11
  {def:['s4', 1]}, //harp 12
  {def:['s2', 0]}, //vox 13
  {def:['s2', 1]}, //vox 14
  {def:['s2', 2]}, //vox 15

  {def:['s3', 3]}, //vox 16
  {def:['s3', 0]},  //vln I d1 17
  {def:['s3', 15]}, //vln I d1 pizz 18
  {def:['s3', 1]},  //vln I d2 19
  {def:['s3', 2]},  //Vln II d1 20

  {def:['s3', 15]}, //vln II d1 pizz 21
  {def:['s3', 2]},  //Vln II d2 22 
  {def:['s3', 15]}, //vln II d2 pizz 23 
  {def:['s3', 3]},  //vla d1 24
  {def:['s3', 15]}, //vla d1 pizz 25

  {def:['s3', 4 ]}, //vla d2 26
  {def:['s3', 15]}, //vla d2 pizz 27
  {def:['s3', 5]}, //cel d1 28
  {def:['s3', 15]}, //cel d1 pizz 29
  {def:['s3', 6]}, //cel d2 30

  {def:['s3', 15]}, //cel d2 pizz 31
  {def:['s3', 7]}, //bass d1 32
  {def:['s3', 15]}, //bass d1 pizz 33
  {def:['s3', 8]}, //bass d2 34
  {def:['s3', 15]}, //bass d2 pizz 35
],

gtanTest: [
  {def:['s1',0]},
  {def:['s1',1]},
  {def:['s1',2]},
],
}

//var programMappings = morning//seine
// tulee parametrina to asEnsemble: var programMappings = allProgramMappings.faune
var asInstrument = function(aSynthRack, instrumentSpecFor0){
  this.synthRack = aSynthRack
  if (this.programMap.def){
    this.synthId = this.programMap.def[0]; this.channelNr = this.programMap.def[1]
  } else {
    this.synthId = ''; this.channelNr = -1
  }
  this.playBackState ={
    notes:{},
    program:-1,
    ccs: {}
  }
  instrumentSpecFor0.ccSpecs.forEach( aCCSpec=>
    this.playBackState.ccs['C'+aCCSpec.cc] = 0
  )
  this.isStopping = false
  this.stopPlaying = function(){
    let spec = {noteSpec:{}}
    this.stopping = true
    this.recalc(spec)
  }
  this.recalc = function(aSpec){ //aSpec is instrument/track spec
    let batch = []
    //if( aSpec.programSpec && aSpec.programSpec !== this.playBackState.program){
    if( typeof(aSpec.programSpec)!=="undefined" && aSpec.programSpec !== this.playBackState.program){
      this.playBackState.program = aSpec.programSpec;
      let pMapKey = 'P'+this.playBackState.program;
      if(!this.synthId){
        this.synthId = this.programMap[ pMapKey ][ 0 ]
        this.channelNr = this.programMap[ pMapKey ][ 1 ]
      } else setTimeout(()=>{
        if (!this.programMap[ pMapKey ]) debugger
        this.synthId = this.programMap[ pMapKey ][ 0 ]
        this.channelNr = this.programMap[ pMapKey ][ 1 ]
      }, 0)
    }
    if(!!aSpec.noteSpec){
      let diff = hlp.compareDicts(aSpec.noteSpec, this.playBackState.notes)
      diff.added.forEach( aNoteKey =>{
        let aNote = aSpec.noteSpec[aNoteKey]
        batch.push(evHlp.newNoteOn(aNote[0], aNote[1]).setPlayer(this.synthId, this.channelNr))
        this.playBackState.notes[ 'N'+aNote[0] ] = aNote[0] 
      })
      diff.removed.forEach( aNoteKey=>{
        let aNote = this.playBackState.notes[aNoteKey]
        batch.push( evHlp.newNoteOff(aNote).setPlayer(this.synthId, this.channelNr) )
        delete this.playBackState.notes[ aNoteKey ]
      })
    }
    !!aSpec.ccSpecs && aSpec.ccSpecs.forEach( aCCSpec=>{
      let aKey = 'C'+aCCSpec.cc
      if( aCCSpec.value ===  this.playBackState.ccs[aKey] ) return
      batch.push( evHlp.newCC(aCCSpec.cc, aCCSpec.value).setPlayer(this.synthId, this.channelNr) )
      this.playBackState.ccs[aKey] = aCCSpec.value
    })
    g.synthRack.exec(batch)
  }
  return this
}
var asEnsemble = function(aMappingsName,specFor0){
  var programMappings = allProgramMappings[aMappingsName]
  if( !programMappings ) debugger
  this.playing = false
  this.instruments = []
  programMappings.forEach( (aMap, ix)=>{
    this.instruments.push(
      asInstrument.call({ programMap: aMap },g.synthRack, specFor0[ix])
    )
  })
  this.recalc = (aSpec)=>{
    if (g.timerState.playState === ':stopped' && this.playing) 
      this.stopPlaying()
    else {
      this.instruments.forEach( (anInstrument, ix)=>{ anInstrument.recalc(aSpec[ix]) } )
      this.playing = true
    }
  }
  this.stopPlaying = function(){
    console.log('Ensemble stopping to play!')
    this.playing = false
    this.instruments.forEach(anInstrument=>anInstrument.stopPlaying())
  }
  return this
}
module.exports=asEnsemble