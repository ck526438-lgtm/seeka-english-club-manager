const { app, BrowserWindow, Menu, shell, ipcMain, dialog } = require("electron");
const fs = require("fs");
const os = require("os");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 900,
    minHeight: 600,
    title: "Seeka English Club Manager",
    icon: path.join(__dirname, "build", "icon.png"),
    backgroundColor: "#0b1f3a",
    webPreferences: { contextIsolation: true, nodeIntegration: false, preload: path.join(__dirname, "preload.js") }
  });
  Menu.setApplicationMenu(null);
  win.loadFile(path.join(__dirname, "index.html"));
  win.webContents.setWindowOpenHandler(({ url }) => { shell.openExternal(url); return { action: "deny" }; });
}

ipcMain.handle("save-pdf", async (event, { html, filename }) => {
  const parent = BrowserWindow.fromWebContents(event.sender);
  const { canceled, filePath } = await dialog.showSaveDialog(parent, {
    title: "Enregistrer en PDF",
    defaultPath: path.join(app.getPath("documents"), filename || "compte-rendu.pdf"),
    filters: [{ name: "PDF", extensions: ["pdf"] }]
  });
  if (canceled || !filePath) return { ok: false };
  const tmp = path.join(os.tmpdir(), `seeka-report-${Date.now()}.html`);
  const win = new BrowserWindow({ show: false, webPreferences: { javascript: false } });
  try {
    fs.writeFileSync(tmp, html, "utf8");
    await win.loadFile(tmp);
    const data = await win.webContents.printToPDF({ pageSize: "A4", printBackground: true });
    fs.writeFileSync(filePath, data);
    shell.openPath(filePath);
    return { ok: true, path: filePath };
  } catch (e) {
    return { ok: false, error: e.message };
  } finally {
    win.destroy();
    fs.rm(tmp, () => {});
  }
});

if (!app.requestSingleInstanceLock()) app.quit();
app.whenReady().then(createWindow);
app.on("window-all-closed", () => app.quit());
