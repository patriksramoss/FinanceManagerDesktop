import path from "path";
require("dotenv").config({
  path: path.join(__dirname, "../../backend/.env"),
  override: true,
});

import { app, BrowserWindow, ipcMain } from "electron";
import url from "url";
import store from "./storage";
import fs from "fs";

let mainWindow: BrowserWindow | null;

const isDev = !app.isPackaged;
const devHost = process.env.FRONTEND_HOST || "localhost";
const devPort = process.env.FRONTEND_PORT || "5173";

const createWindow = () => {
  const iconPath = path.join(__dirname, "../assets", "logo.ico");
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      // for secure ipc
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: iconPath,
  });

  const frontendURL = isDev
    ? `http://${devHost}:${devPort}`
    : url.format({
        pathname: path.join(__dirname, "../../frontend/dist/index.html"),
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
};

app.whenReady().then(() => {
  ipcMain.handle("get-access-token", () => {
    return store.get("plaidAccessToken");
  });

  ipcMain.handle("save-access-token", (_event, token: string) => {
    store.set("plaidAccessToken", token);
  });

  ipcMain.handle("clear-access-token", async () => {
    store.delete("plaidAccessToken");
  });

  // packaged app has no separate backend process, run it in-process
  if (app.isPackaged) require("../../backend/dist/index.js");

  // dev runs the stock Electron.app, so override its Dock icon
  if (isDev) app.dock?.setIcon(path.join(__dirname, "../assets", "logo.png"));
  createWindow();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
