const path = require('path');
const url = require('url');
const {app, BrowserWindow, ipcMain} = require('electron');
const ipc = ipcMain;

var sqlite3 = require('sqlite3').verbose();




let win;


function createWindow(){
	win = new BrowserWindow({
		width: 1100, 
		height: 700,
		icon: __dirname + "/img/icon.jpg",
		backgroundCoolor: '#2e2c29',
		frame: false,
		webPreferences: {
			contextIsolation: false,
			nodeIntegration: true
		}
	})
	

	win.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file',
		slashes: true
	}));

	//win.webContents.openDevTools();

	win.on('closed', () => {
		win = null
	})

	win.setMenu(null);

	win.maximize()
	//win.webContents.on("devtools-opened", () => { win.webContents.closeDevTools(); });
	



	ipc.on('rollDownApp', () => {
		win.minimize();
	})

	ipc.on('fullScreenApp', () => {
		if (win.isMaximized()){
			win.restore()
		} else {
			win.maximize()
		}
	})

	ipc.on('closeApp', () => {
		win.close();
	})

	setTimeout(() => {
		win.webContents.send('upd');
	}, 1000)
	

	ipc.on('update', () => { // обновление списка портфелей
		win.webContents.send('upd');
	})

	ipc.on('updateMenu', () => { // обновление листенеров у списка портфелей
		win.webContents.send('updM');
	})

	ipc.on('updatePage', () => { // обновление page1
		win.webContents.send('updP');
	})

	ipc.on('updateTable', (event, message, broker) => { // обновление таблицы в бд при обновлении портфеля
		win.webContents.send('updateTables', message, broker);
	})

	ipc.on('updatePage2', (event, message, table) => {
		win.webContents.send('updP2', message, table); // обновление page2
	})

	ipc.on('updatePage3', (event, message, table) => {
		win.webContents.send('updP3', message, table); // обновление page3
	})

}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	app.quit();
})
