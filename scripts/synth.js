var asSynth = function(aDeviceName, aMidiSetup ){
	var that = this; 
	this.channels = [];
	this.deviceName = aDeviceName;
	this.midiSetup = aMidiSetup;
	this.midiOutDevice = this.midiSetup.getOutputNamed(this.deviceName);
	this.midiOutDevice.open()

	this.addChannel= function( aChannelNr ){
		let newChannel = asSynthChannel.call({}, this, aChannelNr);
		this.channels[aChannelNr] = newChannel;
		return newChannel;
	};
	this.getChannel = function(aChannelNr){
		if( !this.channels[aChannelNr] )	
			this.addChannel(aChannelNr);
		return this.channels[aChannelNr];
	};
	this.stopAll = function(){
		for(let aChannelId in that.channels) that.channels[aChannelId].stopPlaying();
	};
	this.handleEvent = function(anEvent){
		if( !this.channels[anEvent.channelNr] )
			this.addChannel(anEvent.channelNr);
		this.channels[anEvent.channelNr].handleEvent(anEvent);
	};
	this.reset = function(){
		var msg = new Uint8Array(3);
		msg[1] = 123; msg[2] = 0;
		for (var ch = 0;ch < 16;ch++) {
			msg[0] = 0xb0 + ch;
			this.midiOutDevice.send( msg );
		}
	};
	return this;
};
var asSynthChannel = function(aSynth, aChannelNr){
	var that = this;

	this.midiOutDevice = aSynth.midiOutDevice;
	this.channelNr = aChannelNr;
	this.nowPlaying = {};

	this.noteOn = function(aNote, aVelocity){
		let msg = Uint8Array.from([0x90+this.channelNr, aNote,aVelocity])
		that.midiOutDevice.send( msg )
		this.nowPlaying['N'+aNote] = true
	};
	this.noteOff = function(aNote){
		let key = 'N'+aNote
		if (!that.nowPlaying[key]) return;
		that.midiOutDevice.send( Uint8Array.from([0x80+this.channelNr, aNote, 0]) );
		delete this.nowPlaying['N'+aNote];
	};
	this.stopPlaying = function(){
		for (let aKey in this.nowPlaying){
			let note = parseInt(aKey.slice(1));
			this.noteOff(note);
		}
	};
	this.setCC = function(anEvent){
		that.midiOutDevice.send(Uint8Array.from([0xb0+that.channelNr, anEvent.ccNr, anEvent.value]));			
	};
	this.setProgram = function(anEvent){
			that.midiOutDevice.send(Uint8Array.from([0xc0+that.channelNr, anEvent.program]));			
	};
	this.handleEvent = (anEvent)=>{
		if (anEvent.type === 'allOff'){
			this.stopPlaying();
			return;
		}
		if(anEvent.type === 'on'){
			that.noteOn(anEvent.note, anEvent.velocity);
			return;
		}
		if(anEvent.type === 'off'){
			that.noteOff(anEvent.note);
			return;
		}
		if(anEvent.type === 'cc'){
			this.setCC(anEvent);
			return;
		}
		if (anEvent.type === 'program'){
			that.setProgram(anEvent); return
		}
	};
	return this;
};
var asSynthRack = function(aMidiSetup){
	this.x = true
	this.synths = {};
	this.midiSetup = aMidiSetup;
	this.addSynth = function(aName, aMidiPortName){
		this.synths[aName] = asSynth.call({}, aMidiPortName, aMidiSetup);
	};
	this.handleEvent = aMusicEvent =>{
		this.synths[aMusicEvent.synthId].handleEvent(aMusicEvent);
	};
	this.exec = events=>{
		//if (this.x) {console.log(events); this.x = false }
		events = [].concat(events)
		events.forEach( anEvent=>this.handleEvent(anEvent) )
	}
	this.stopAll = function(){
		for(var synthName in this.synths) this.synths[synthName].stopAll();
	};
	return this;
};
module.exports.asSynthRack = asSynthRack