const { ipcRenderer } = require('electron');
const ipc = ipcRenderer;


rollDownBtn.addEventListener('click', () => {
	ipc.send('rollDownApp');
})


fullScreenBtn.addEventListener('click', () => {
	ipc.send('fullScreenApp');
})


closeBtn.addEventListener('click', () => {
	ipc.send('closeApp');
})