import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

type IpcCallback<T> = (event: IpcRendererEvent, ...args: T[]) => void;

contextBridge.exposeInMainWorld("electron", {
  sendMessage: (channel: string, data: unknown) =>
    ipcRenderer.send(channel, data),
  onMessage: <T>(channel: string, callback: IpcCallback<T>) => {
    ipcRenderer.on(channel, (event, ...args: T[]) => {
      callback(event, ...args);
    });
  },
});
