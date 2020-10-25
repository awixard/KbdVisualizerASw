var asMusicEvent = function(){
	this.asCopy = function(){
		let theCopy = asMusicEvent.call({});
		return copyValues(this, theCopy); 
	};
	var isNote = ()=>this.type === 'on' || this.type === 'off';

	this.asNoteOff = function( aNote ){ this.type = 'off'; this.note = aNote; return this }

	this.asNoteOn = function( aNote, aVelocity ){ this.type = 'on'; this.note = aNote; this.velocity = aVelocity; return this }
	
	this.asCC = function( aCCNr, aValue){ this.type = 'cc'; this.ccNr = aCCNr, this.value = aValue; return this }

	this.asProgram = function(aProgramNr){ this.type='program'; this.program = aProgramNr; return this }
	
	this.inRange = function(lo,hi){
		if(!this.note) return false;
		return this.note >= lo && this.note <= hi;
	};
	this.up = function(octaves ){
		if (!isNote()) return this;
		this.note += octaves*12;
		return this;
	} ;
	this.down = function(octaves ){
		if (!isNote()) return this;
		this.note -= octaves*12;
		return this;
	};
	this.mapVelocity = aFunc =>{
		if( this.type !== 'on' ) return this;
		aFunc(this); 
		return this; 
	};
	this.play = function(synthRack, synthId,channelNr){
		if (this.type === 'nop') return this;
		this.synthId = synthId; this.channelNr = channelNr;
		synthRack.handleEvent(this);		
		return this;
	};
	this.setPlayer = function( aSynthId, aChannelNr ){ 
		this.synthId = aSynthId; this.channelNr = aChannelNr
		return this
	}
  return this;
};
var newNoteOff = function( aNote ){ return asMusicEvent.call({}).asNoteOff( aNote )}

module.exports ={
	'asMusicEvent': asMusicEvent,
	helpers:{
		newNoteOff: function( aNote ){ return asMusicEvent.call({}).asNoteOff( aNote )},
		newNoteOn: function( aNote, aVelocity){ return asMusicEvent.call({}).asNoteOn( aNote, aVelocity)},
		newCC: function( aCCNr, aValue ){ return asMusicEvent.call({}).asCC(aCCNr, aValue) },
		newProgram: function( aProgramNr ){ return asMusicEvent.call({}).asProgram(aProgramNr) }
	}
}
