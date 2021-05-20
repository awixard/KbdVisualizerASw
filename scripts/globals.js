module.exports = {
  appState:{ midiReady: false },
  timerState:{ isRunning:false},
  kbdState:{
    nowPlayingCount:0,
    mode:':command'
  },
  consts:{hugeTimeMs:24*3600000},
  lastUsedStartTimeMs:0
}