var asMidiSetup = function(){
	var that = this;
	this.callOnSuccess = [];
	this.addListener = function( aListener ){
		this.callOnSuccess.push(aListener);
		return this;
	};
	this.outputs =[]; this.inputs = [];
	if(!navigator.requestMIDIAccess) throw 'MIDI not supported!';
	this.success = (interface)=>{
    var iter = interface.outputs.values();
	  for (var i = iter.next(); i && !i.done; i = iter.next()) {
	    this.outputs.push(i.value);
	  }

		iter = interface.inputs.values();
	  for ( i = iter.next(); i && !i.done; i = iter.next()) {
	    this.inputs.push(i.value);
	  }
	  //console.log(this.inputs );
	  //console.log(this.outputs);
	  this.callOnSuccess.forEach( aListener => aListener(this) );
	};
	this.failure = (error) => console.log(error);

	this.commence = function(){
		navigator.requestMIDIAccess().then(this.success, this.failure);
		return this;
	};
	this.getInputNamed = function(aName){
		var i = this.inputs.findIndex(item => (item.name.indexOf(aName)!==-1) );
		if (i ===-1) throw "Midi in device "+ aName+" not found!";
		return(this.inputs[i]);
	};
	this.getOutputNamed = function(aName){
		var i = this.outputs.findIndex(item => (item.name.indexOf(aName)!==-1) );
		if (i ===-1) throw "Midi in device "+ aName+" not found!";
		return(this.outputs[i]);
	};
	return this;
};
module.exports = asMidiSetup.call({})
