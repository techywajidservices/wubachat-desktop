const { app, BrowserWindow, Menu, globalShortcut } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 900,
        minHeight: 600,
        title: 'Wubachat Console',
        icon: path.join(__dirname, 'icon.ico'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            partition: 'persist:wubachat_session' // Session & local storage persistent
        }
    });

    // Default top browser bar hide karein
    Menu.setApplicationMenu(null);

    // Direct Login / Registration screen se start hoga
    mainWindow.loadURL('https://wubachat.com/login.php');

    // UI Zoom In / Zoom Out Shortcut Controls (Ctrl +, Ctrl -, Ctrl 0)
    mainWindow.webContents.on('before-input-event', (event, input) => {
        if (input.control) {
            if (input.key === '=' || input.key === '+') {
                const currentZoom = mainWindow.webContents.getZoomFactor();
                mainWindow.webContents.setZoomFactor(Math.min(currentZoom + 0.1, 2.0));
                event.preventDefault();
            } else if (input.key === '-') {
                const currentZoom = mainWindow.webContents.getZoomFactor();
                mainWindow.webContents.setZoomFactor(Math.max(currentZoom - 0.1, 0.6));
                event.preventDefault();
            } else if (input.key === '0') {
                mainWindow.webContents.setZoomFactor(1.0);
                event.preventDefault();
            }
        }
    });

    mainWindow.on('page-title-updated', (e) => e.preventDefault());
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
