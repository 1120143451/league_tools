// Modules to control application life and create native browser window
const { app, BrowserWindow ,Menu } = require("electron");
const path = require("node:path");

app.disableHardwareAcceleration();
app.commandLine.appendSwitch("disable-site-isolation-trials");
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      webSecurity: false, // 禁用web安全性
    },
  });

  // and load the index.html of the app.
  // mainWindow.loadFile('index.html')
  // mainWindow.loadFile('./dist/index.html')

  const currentSession = mainWindow.webContents.session;
  currentSession.webRequest.onHeadersReceived((details, callback) => {
    const headers = details.responseHeaders;
    headers['Content-Security-Policy'] = ["*"];
    headers['content-security-policy'] = ["*"];
    headers['content-security-policy-report-only'] = ["*"];
    callback({ cancel: false, responseHeaders: headers });
  })


  // mainWindow.loadFile('./dist/index.html')


  // mainWindow.loadURL("http://121.40.175.13:8088/#/main/index");

  // mainWindow.loadURL("http://202.79.173.199:6999/#/main/index");
  mainWindow.loadURL("http://8.138.17.106:8989/");

  // mainWindow.loadURL("http://localhost:8088/#/main/index");


  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.on('ready-to-show', () => {
    mainWindow.maximize();
    mainWindow.show();
  });

}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // 菜单模板
  createWindow();

  const template = [
    {
      label: '操作',
      submenu: [
        {
          label: '刷新',
          role: 'reload'
        },
        {
          label: '关闭',
          role: 'close'
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);


});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
