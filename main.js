//handle setupevents as quickly as possible
const setupEvents = require('./installers/setupEvents');
const {
  Worker, isMainThread, parentPort, workerData
} = require('worker_threads');
const cv = require('opencv4nodejs');
if (setupEvents.handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}

const electron = require('electron')
// Module to control application life.
const app = electron.app
const {ipcMain} = require('electron')
var path = require('path')
require('./dialog/dialog')

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
//Adds the main Menu to our app

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let secondWindow

function createWindow () {
  var myWorker = new Worker('./js/ambient.js');
  // Create the browser window.
  mainWindow = new BrowserWindow({titleBarStyle: 'hidden',
    width: 1281,
    height: 800,
    minWidth: 1281,
    minHeight: 800,
    backgroundColor: '#312450',
    show: false,
    icon: path.join(__dirname, 'assets/icons/win/icon.ico'),
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true
    }
  })
  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()
  const img = cv.imread('./data/husky.jpg');
  
  // single axis for 1D hist
  const getHistAxis = channel => ([
    {
      channel,
      bins: 256,
      ranges: [0, 256]
    }
  ]);
  
  // calc histogram for blue, green, red channel
  const bHist = cv.calcHist(img, getHistAxis(0));
  const gHist = cv.calcHist(img, getHistAxis(1));
  const rHist = cv.calcHist(img, getHistAxis(2));
  
  const blue = new cv.Vec(255, 0, 0);
  const green = new cv.Vec(0, 255, 0);
  const red = new cv.Vec(0, 0, 255);
  
  // plot channel histograms
  const plot = new cv.Mat(300, 600, cv.CV_8UC3, [255, 255, 255]);
  cv.plot1DHist(bHist, plot, blue, { thickness: 2 });
  cv.plot1DHist(gHist, plot, green, { thickness: 2 });
  cv.plot1DHist(rHist, plot, red, { thickness: 2 });
  
  cv.imshow('rgb image', img);
  cv.imshow('rgb histogram', plot);
  cv.waitKey();
  
  const grayImg = img.bgrToGray();
  const grayHist = cv.calcHist(grayImg, getHistAxis(0));
  const grayHistPlot = new cv.Mat(300, 600, cv.CV_8UC3, [255, 255, 255]);
  cv.plot1DHist(grayHist, grayHistPlot, new cv.Vec(0, 0, 0));
  
  cv.imshow('grayscale image', grayImg);
  cv.imshow('grayscale histogram', grayHistPlot);
  cv.waitKey();

  // Show the mainwindow when it is loaded and ready to show
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  secondWindow = new BrowserWindow({frame: false,
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#312450',
    show: false,
    icon: path.join(__dirname, 'assets/icons/win/icon.ico'),
    parent: mainWindow,
    webPreferences: {
      nodeIntegration: true
    }
  })

  secondWindow.loadURL(`file://${__dirname}/windows/ipcwindow.html`)

  require('./menu/mainmenu')
}

ipcMain.on('open-second-window', (event, arg)=> {
    secondWindow.show()
})

ipcMain.on('close-second-window', (event, arg)=> {
    secondWindow.hide()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
