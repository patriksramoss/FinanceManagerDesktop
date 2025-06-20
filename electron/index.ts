require("dotenv").config({ path: "../backend/.env", override: true });

import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import url from "url";
import store from "./storage"; // <- You’ll create this file
import fs from "fs";

let mainWindow: BrowserWindow | null;

const isDev = process.env.NODE_ENV === "development";
const devHost = process.env.FRONTEND_HOST || "localhost";
const devPort = process.env.FRONTEND_PORT || "5173";

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      // for secure ipc
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  ipcMain.handle("get-access-token", () => {
    return store.get("plaidAccessToken");
  });

  ipcMain.handle("save-access-token", (_event, token: string) => {
    store.set("plaidAccessToken", token);
  });

  ipcMain.handle("clear-access-token", async () => {
    store.delete("plaidAccessToken");
  });

  const frontendURL = isDev
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
