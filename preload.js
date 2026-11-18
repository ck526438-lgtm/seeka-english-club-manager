const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("seekaDesktop", {
  savePDF: (html, filename) => ipcRenderer.invoke("save-pdf", { html, filename })
});
