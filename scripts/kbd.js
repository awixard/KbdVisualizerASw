const asMusicEvent = require('./musicEvent.js').asMusicEvent
const g = require('./globals.js')

var asKeyboard = function(aMidiInDeviceName,aMidiSetup ){
	var that = this;
	this.nowPlayingCount = 0;
	this.midiInDeviceName = aMidiInDeviceName;
	this.midiSetup = aMidiSetup;
	this.midiInDevice = this.midiSetup.getInputNamed(this.midiInDeviceName);
	this.listeners = {};
  this.lastListenerNr = -1;
  
	this.addListener = function(aListener){
		let newKey = 'L'+(++this.lastListenerNr);
		this.listeners[ newKey ] = aListener;
		return newKey;
	};
	this.dropListener = function( aListenerId ){
		delete this.listeners[aListenerId]
	};
 	this.parseMidiMsg = function(aMidiMsg){
		var midiEvent = asMusicEvent.call({});
		midiEvent.fromKbd = true;
		midiEvent.sysTime = Math.round( performance.now() );  //Millisekunti riittää, tallentuu  siistimmin
		midiEvent.rawMidi = aMidiMsg;

		var cmd = aMidiMsg.data[0] >> 4;
		midiEvent.channelNr = aMidiMsg.data[0] & 0xf;
		if (cmd === 9 || cmd === 8){
			midiEvent.note = aMidiMsg.data[1];
			midiEvent.velocity = aMidiMsg.data[2];
		}
		if ((cmd === 9) && (midiEvent.velocity !== 0)){
			midiEvent.type = 'on';
			g.kbdState.nowPlayingCount = ++this.nowPlayingCount; 
			return midiEvent;
		}
		if ((cmd === 8) || ((cmd ===9) && (midiEvent.velocity === 0))){
			midiEvent.type = 'off';
			g.kbdState.nowPlayingCount = --this.nowPlayingCount; 
			return midiEvent;
		}
		if (cmd == 11 ) {
			midiEvent.playingCount = that.playingCount;
			var eventType = 'cc';
			var cc = aMidiMsg.data[1];
			var ccValue =  aMidiMsg.data[2];
			if (cc === 67){ //left pedal
				midiEvent.type = 'cc';
				midiEvent.ccNr = 67;
				midiEvent.ccType = ccValue === 0?'lpOff': 'lpOn';
				midiEvent.value = ccValue;
				return midiEvent;
			}
			if (cc === 64){ //right pedal
				midiEvent.type = 'cc';
				midiEvent.ccNr = 64;
				midiEvent.ccType = ccValue === 0?'rpOff': 'rpOn';
				midiEvent.value = ccValue;
				return midiEvent;
			}
			throw "Tuntematon midi-viestityyppi";
 		}
	};
	this.handleMidiMsg = ( aMidiMsg ) =>{
		if ((aMidiMsg.data[0] & 0xf0)===240) return;  //Ignore Kbd sensor msg 

		var midiEvent = this.parseMidiMsg(aMidiMsg);
		Object.keys(this.listeners).forEach( aListenerKey =>{  this.listeners[ aListenerKey] (midiEvent) ; } );
	};
	this.midiInDevice.onmidimessage = this.handleMidiMsg;

	return this;
};
module.exports = {'asKeyboard': asKeyboard}
