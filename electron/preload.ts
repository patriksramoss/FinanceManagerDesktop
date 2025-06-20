import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  getAccessToken: () => ipcRenderer.invoke("get-access-token"),
  saveAccessToken: (token: string) =>
    ipcRenderer.invoke("save-access-token", token),
  clearAccessToken: () => ipcRenderer.invoke("clear-access-token"),
});
