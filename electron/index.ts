require("dotenv").config();
import { app, BrowserWindow } from "electron";
import path from "path";
import url from "url";

let mainWindow: BrowserWindow | null;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Allow access to Node.js APIs
    },
  });

  const devHost = process.env.FRONTEND_HOST || "localhost";
  const devPort = process.env.FRONTEND_PORT || "5173";

  // Load the correct frontend based on environment
  const frontendURL =
    process.env.NODE_ENV === "development"
      ? `http://${devHost}:${devPort}`
      : url.format({
          pathname: path.join(app.getAppPath(), "../frontend/dist/index.html"),
          protocol: "file:",
          slashes: true,
        });

  console.log("Loading frontend from:", frontendURL);

  mainWindow
    .loadURL(frontendURL)
    .catch((err) => console.error("Failed to load frontend:", err));

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
