const { app, BrowserWindow } = require('electron')

let win

function createWindow () {
  win = new BrowserWindow({ width: 1500, height: 960 })

  //win.loadFile('./conversion.html')
  win.loadFile('./play.html')
  win.webContents.openDevTools()
  win.maximize()
  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)
