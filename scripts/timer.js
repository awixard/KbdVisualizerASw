const g = require('./globals')

const asTicker = function(aClient){
	this.client = aClient;
	this.savedTime = null;
	this.cancelHandle = null
	this.isStoping = false
	this.start = function(){
		this.savedTime = performance.now();
		this.cancelHandle = window.requestAnimationFrame(this.onTick);
	};
	this.onTick = ()=>{
		let now = performance.now();
		this.client.onTick(now - this.savedTime);
    if (this.isStoping) return
		this.savedTime = now;
		this.cancelHandle = window.requestAnimationFrame(this.onTick);
	};
	this.stop = function(){
		this.client = null
		this.isStoping = true
		window.cancelAnimationFrame(this.cancelHandle);  //Ei tunnu toimivan, mutta hoidetaan onTicks'ssä
	};
	return this;
};

const asTimer = function(){
	this.timeScale = 1;
	this.time = 0
	this.nextStopType = ':stop'
	this.playToTimeMs = g.consts.hugeTimeMs
	g.timerState.playState = ':stopped'


	this.setTimeScale = function( aVal ){
		this.timeScale = aVal;
		return this;
	};
	this.onTick = delta =>{
		delta = delta * this.timeScale;
		let newTime = this.time + delta;
		if (newTime > this.playToTimeMs){
			if (this.nextStopType === ':suspend') this.suspend()
			else this.stop()
			g.timerState.recalc(); 
			return 
		}
		this.time = newTime;
		g.timerState.time = this.time
		g.timerState.recalc()
	};
	this.setTimeScale = function( aValue){
		this.timeScale = aValue
	}
	this.setTimeToStart = function( aTimeMs ){
		this.time = aTimeMs
		g.timerState.time = this.time
		g.timerState.recalc()
		return this
	}
	this.setTimeToStop = function( aTimeMs ){
		this.playToTimeMs = aTimeMs
		this.nextStopType = ':stop'
		return this
	}
	this.setTimeToSuspend = function(aTimeMs){
		this.playToTimeMs = aTimeMs
		this.nextStopType = ':suspend'
		return this
	}
	this.go = function(){
    this.ticker = asTicker.call({},this)
		this.ticker.start();
		g.timerState.time = this.time
		g.timerState.playState = ':playing'
		g.timerState.recalc()
	}
	this.suspend = function(){
		this.ticker.stop(); this.ticker = null
		g.timerState.playState = ':suspended'
		g.timerState.recalc()
	}
	this.stop = function(){
		if (this.ticker) this.ticker.stop(); else console.log('No ticker here!') 
		this.ticker = null
		g.timerState.playState = ':stopped'
		g.timerState.recalc()
	}
	return this
};

timer = asTimer.call({}) 
module.exports = timer
