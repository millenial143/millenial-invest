
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





let mainBlock = document.querySelector('.update-file-block');

let fileName2 = mainBlock.querySelector('.file-name');

let fileUpload2 = mainBlock.querySelector('.file-uploader');

let addPath2 = '';


fileUpload2.addEventListener('change', (e) => {
	files = e.target.files;
	let name = '';
	let type = '';
	let path = '';
	for (let i of files){
		name = i.name;
		type = i.type;
		path = i.path;
	}

	addPath2 = path;
	
	if (!excelCheck(name)){
		fileName2.style.color = '#963c3c'
		fileName2.innerHTML = `Файл не формата xls/xlsx`
	} else {
		fileName2.style.color = 'silver'
		fileName2.innerHTML = `${name}`
	}

})

let addBtn2 = document.querySelector('.up-btn-block-btn');

ipc.on('updateTables', (event, table, broker) => {

	if (!excelCheck(addPath2)){

	}
	if ((fileName2.innerHTML == 'Файл не выбран')){
		fileName2.style.color = '#963c3c';
	}
		
	if (excelCheck(addPath2) && !(fileName2.innerHTML == 'Файл не выбран')){

		console.log('clickupdate button')

		let wb = XLSX.readFile(`${addPath2}`)

		let fsn = wb.SheetNames[0];
		let ws = wb.Sheets[fsn];

		if ( broker == 'TIN' && (ws['A2'].v.indexOf('Тинькофф') != -1)){

			var db = new sqlite3.Database('db.sqlite3', (err) => {
				if (err){
					return console.error(err.message);
				}	
			})

			let query = `CREATE TABLE "${broker + table}" (
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

			let q3 = `DROP TABLE ${broker + table}`

			db.serialize(function() {
				db.run(q3, (err) => {
					if (err) {
						console.log(err)
					}
				})
				db.run(query, (err) => {
					if (err) {
						console.log(err)
					}		
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
						q2 = `INSERT INTO ${broker + table} (datetime, type, ticker, price, currency, number, NKD, summ, commission1, commission2, commission3)
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
					console.log('ошибка обновления')
				}

				let upd = document.querySelector('.update-popup');
				let updPop = document.querySelector('.update-popup-popup');

				updPop.style.opacity = '0';
				updPop.classList.remove('add-portfolio-popup-popup_active');
				upd.style.visibility = 'hidden';
				upd.style.backgroundColor = 'rgba(0, 0, 0, 0)';
				
			
			});

			setTimeout(() => {
				ipc2.send('update');
			}, 3000)

			db.close();

			let error;
			// type: 0 - продажа, 1 - покупка 
			

		} else {
			fileName2.style.color = '#963c3c'
			fileName2.innerHTML = `Неверный брокер / отчет не поддерживается`
		}

	}

})



