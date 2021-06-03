

const path = require('path');
const url = require('url');
const fs = require('fs');
const XLSX = require('xlsx');

// const {app, BrowserWindow, ipcMain} = require('electron');
// const { ipcRenderer } = require('electron');
const ipc2 = require('electron').ipcRenderer;


var sqlite3 = require('sqlite3').verbose();



function excelCheck(fileName) {
	arr = [];
	for (let i = fileName.length; i > 0; i--){
		arr.push(fileName[i]);
	}

	if ((arr[1] == 'x' && arr[2] == 's' && arr[3] == 'l' && arr[4] == 'x') || (arr[1] == 's' && arr[2] == 'l' && arr[3] == 'x')){
		return true
	} else {
		return false
	}
}

function toDateTime(date, time) {
	if (date.length == 10 && time.length == 8){
		d = date.split('.').join('-');
		t = time.split(':').join('-');
		return d + '-' + t
	} else {
		return 'err';
	}
}

function toFlot(x){
	return x.split(',').join('.');
}
/*
var db = new sqlite3.Database('db.sqlite3', (err) => {
	if (err){
		return console.error(err.message);
	}

	console.log('connected to db')
});



db.close();*/
function repeatCheck(name, table){
	for (let i = 0; i < table.length; i++){
		if (table[i].name == name){
			return false;
		}
	}

	return true;
}



let fileName = document.querySelector('.file-name');

let fileUpload = document.querySelector('.file-uploader');

let addPath = '';


fileUpload.addEventListener('change', (e) => {
	files = e.target.files;
	let name = '';
	let type = '';
	let path = '';
	for (let i of files){
		name = i.name;
		type = i.type;
		path = i.path;
	}

	addPath = path;
	
	if (!excelCheck(name)){
		fileName.style.color = '#963c3c'
		fileName.innerHTML = `Файл не формата xls/xlsx`
	} else {
		fileName.style.color = 'silver'
		fileName.innerHTML = `${name}`
	}

})


let addBtn = document.querySelector('.add-portfolii-button');
let textArea = document.querySelector('.add-portfolio-text-area');
let select = document.querySelector('.broker-select');

addBtn.addEventListener('click', () => {
	if (!excelCheck(addPath)){

	}
	if (!textArea.value){
		textArea.style.borderColor = '#963c3c';
	}
	if ((fileName.innerHTML == 'Файл не выбран')){
		fileName.style.color = '#963c3c';
	}
		
	if (excelCheck(addPath) && textArea.value && !(fileName.innerHTML == 'Файл не выбран')){
		textArea.style.borderColor = 'silver';

		var db = new sqlite3.Database('db.sqlite3', (err) => {
			if (err){
				return console.error(err.message);
			}	
		})
	
		let namese;
		let query4 = `SELECT name FROM sqlite_master WHERE type="table"`;

		db.serialize(function() {
			db.all(query4, (err, table) => {
				console.log(table)
				namese = table;
				let wb = XLSX.readFile(`${addPath}`)

				let fsn = wb.SheetNames[0];
				let ws = wb.Sheets[fsn];

				console.log(namese)
				if (repeatCheck(select.value + textArea.value, namese)){
					if (select.value == 'TIN' && (ws['A2'].v.indexOf('Тинькофф') != -1)){
						select.style.borderColor = 'silver';

						
						let query = `CREATE TABLE "${select.value + textArea.value}" (
							"id"	INTEGER,
							"datetime"	TEXT,
							"type"	INTEGER,
							"ticker"	TEXT,
							"price"	INTEGER,
							"currency"	TEXT,
							"number"	INTEGER,
							"NKD"	INTEGER,
							"summ"	INTEGER,
							"commission1"	INTEGER,
							"commission2"	INTEGER,
							"commission3"	INTEGER,
							"TT"  TEXT,
							"TP"  TEXT,
							PRIMARY KEY("id" AUTOINCREMENT)
						);`;

						db.serialize(function() {
							
						
							db.run(query, (err) => {
								if (err) {
									console.log(err)
								}		
								console.log('run')
							});	
							row = 9;
							let error;

							while (ws[`A${row}`].v.indexOf('1.2') == -1){
								let tpe;
								if (ws[`AB${row}`].v == 'Покупка'){
									tpe = 1;
								} else if (ws[`AB${row}`].v == 'Продажа'){
									tpe = 0;
								} else {
									tpe = 'err'
								}

								let DT = toDateTime(ws[`H${row}`].v, ws[`L${row}`].v);

								//console.log(`${toDateTime(ws[`H${row}`].v, ws[`L${row}`].v)}`)
								console.log(typeof ws[`H${row}`].v)
								console.log(ws[`H${row}`].v.length)
								if (ws[`A${row}`].v.length == 10){
									console.log(ws[`X${row}`].v);
									console.log(ws[`R${row}`].v);
									q2 = `INSERT INTO ${select.value + textArea.value} (datetime, type, ticker, price, currency, number, NKD, summ, commission1, commission2, commission3, TT, TP)
									VALUES ("${DT}", ${tpe}, "${ws[`AN${row}`].v}", ${toFlot(ws[`AS${row}`].v)}, "${ws[`AW${row}`].v}", ${ws[`BB${row}`].v}, ${ws[`BJ${row}`].v}, ${toFlot(ws[`BQ${row}`].v)}, ${toFlot(ws[`CC${row}`].v)}, ${ws[`CL${row}`].v}, ${ws[`CW${row}`].v}, "${ws[`X${row}`].v}", "${ws[`R${row}`].v}")`
									// console.log(q2)
									if (tpe != 'err'){
										db.run(q2, (e) => {
											error = e;
											
										});
									}
								}
								
								

								row++;
							}
							

							if (error) {
								console.log('ошибка создания')
							}

							let popupPopup = document.querySelector('.add-portfolio-popup-popup');
							let popup = document.querySelector('.add-portfolio-popup');

							popupPopup.style.opacity = '0';
							popupPopup.classList.remove('add-portfolio-popup-popup_active');
							popup.style.visibility = 'hidden';
							popup.style.backgroundColor = 'rgba(0, 0, 0, 0)';
							
							
						});
						setTimeout(() => {
							ipc2.send('update');
						}, 3000)
						

						db.close();

						let error;
						// type: 0 - продажа, 1 - покупка 
						

					} else {
						select.style.borderColor = '#963c3c';
					}
				}else {
					textArea.style.borderColor = '#963c3c';
				}
			})
				
		});

		

	}

})


