const {
	app,
	BrowserWindow
} = require('electron');

let win;

app.on('ready', () => {
	win = new BrowserWindow({
		width: 600,
		height: 800
	});

	win.setMenu(null);
	win.loadURL(`file://${__dirname}/src/index.html`);
	win.on('closed', () => {
		win = null;
	});

	win.webContents.on('devtools-opened', () => {
		win.webContents.closeDevTools();
	});

}).on('all-window-closed', () => {
	app.quit();

});
