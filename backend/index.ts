const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // allow access to Node.js APIs
    },
  });

  // Get the absolute path to the frontend's dist folder
  const frontendPath = path.join(__dirname, "../../frontend/dist/index.html");

  // Log to verify the path
  console.log("Frontend path:", frontendPath);

  // Load the frontend using the correct path
  mainWindow.loadURL(`file://${frontendPath}`);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
