require("./global");
const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow (options = {}) {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: options.x, y: options.y,
    width: 1024, height: 800,
    backgroundColor: options.backgroundColor,
    webPreferences: {affinity: "window"}
  })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

function getWidevineCdmPluginPath() {
  let basePath = path.resolve(__dirname, "./node_modules/electron-widevinecdm/widevine");
  if (global.PLATFORM_DARWIN) {
    return path.join(basePath, "/darwin_x64/_platform_specific/mac_x64/widevinecdmadapter.plugin");
  } else if (global.PLATFORM_WIN32 && global.ARCH_64) {
    return path.join(basePath, "\\win32_x64\\_platform_specific\\win_x64\\widevinecdmadapter.dll");
  } else if (global.PLATFORM_WIN32 && global.ARCH_32) {
    return path.join(basePath, "\\win32_ia32\\_platform_specific\\win_x86\\widevinecdmadapter.dll");
  } else if (global.PLATFORM_LINUX) {
    return path.join(basePath, "/linux_x64/libwidevinecdmadapter.so");
  }
}

let widevineCdmPluginPath = getWidevineCdmPluginPath();
console.log(`widevine-cdm-path: ${widevineCdmPluginPath}\n`);

app.commandLine.appendSwitch("widevine-cdm-path", widevineCdmPluginPath);
app.commandLine.appendSwitch("widevine-cdm-version", "1.4.8.970");

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  // window with white backround
  createWindow({x: 0, y: 0, backgroundColor: "#fff"});
})

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
