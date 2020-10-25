var asRecalcMgr = function(){
	this.go = false;
	this.recalcSetStack = [];
	this.dbgMsg = '';
	this.rc = 0;
	this.recalcSet = [];


	this.schedule = function(aFunc){
		if(this.go) return;
		this.go = true;
		setTimeout(()=>{aFunc.call(this);}, 0);  //TONOTE
	};

	this.recalcAll = function(){
		this.rc++;
		this.go = false;
		if(this.dbgMsg) {console.log(this.dbgMsg); this.dbgMsg = '';}
		this.recalcSet.forEach((aFunc)=>aFunc() );
	};

	this.setRecalcSet = function(aRecalcSet){
		this.recalcSetStack.push( aRecalcSet );
		this.recalcSet = aRecalcSet;
	};

	this.popRecalcSet = function(){
		this.recalcSetStack.pop();
		this.recalcSet = this.recalcSetStack[this.recalcSetStack.length-1];
	};
	this.scheduleRecalc = aMsg=>{
		if(aMsg) aMsg = this.rc.toString()+': '+ aMsg;
		if(aMsg) this.dbgMsg = this.dbgMsg ?this.dbgMsg+'; '+aMsg: aMsg;
		this.schedule(this.recalcAll); //test
	};
	return this;
};

var rm = asRecalcMgr.call({});
module.exports ={
  'rm': rm,
  'recalc':rm.scheduleRecalc
}