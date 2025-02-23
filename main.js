const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow;
let store;

async function createWindow() {
  // Charger electron-store dynamiquement
  const Store = (await import("electron-store")).default;
  store = new Store();

  // Récupérer les dimensions et la position de la fenêtre sauvegardées
  const winBounds = store.get("windowBounds") || { width: 310, height: 280, x: null, y: null };

  mainWindow = new BrowserWindow({
    width: winBounds.width,
    height: winBounds.height,
    x: winBounds.x, // Position X de la fenêtre
    y: winBounds.y, // Position Y de la fenêtre
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true, // Active nodeIntegration pour pouvoir utiliser 'require'
      contextIsolation: false, // Désactive contextIsolation pour simplifier (ce n'est pas sécurisé mais fonctionne ici)
    },
  });

  mainWindow.loadFile("index.html");

  // Ouvre les outils de développement pour déboguer (si nécessaire)
  // mainWindow.webContents.openDevTools();

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // Sauvegarder la position et la taille de la fenêtre avant qu'elle ne soit fermée
  mainWindow.on("close", () => {
    store.set("windowBounds", mainWindow.getBounds());
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
