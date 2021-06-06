let request = require('request');
var sqlite3 = require('sqlite3').verbose();


let eurCourse = 1;
let usdCourse = 1;

request({url: `https://www.cbr-xml-daily.ru/daily_json.js`, json: true}, function(err, res, json) {
	if (json.Valute){
		usdCourse = json.Valute.USD.Value;
		eurCourse = json.Valute.EUR.Value;
	}
})


function sortTable(table, index){
	if (index == 0){
		let sortedRows = Array.from(table.rows)
		  .slice(1, table.rows.length - 1)
		  .sort((rowA, rowB) => rowA.cells[index].innerHTML > rowB.cells[index].innerHTML ? 1 : -1);

		for (let i of (sortedRows)){
			i.classList.add('share-table-main-row');
		}
		table.tBodies[0].append(...sortedRows);
	} else if (index == 1){
		let sortedRows = Array.from(table.rows)
		  .slice(1, table.rows.length - 1)
		  .sort((rowA, rowB) => parseInt(rowA.cells[index].innerHTML) < parseInt(rowB.cells[index].innerHTML) ? 1 : -1);

		for (let i of (sortedRows)){
			i.classList.add('share-table-main-row');
		}
		table.tBodies[0].append(...sortedRows);
	}else if (index == 2){
		let sortedRows = Array.from(table.rows)
		  .slice(1, table.rows.length - 1)
		  .sort((rowA, rowB) => parseInt(rowA.cells[index].innerHTML.slice(0, -2)) < parseInt(rowB.cells[index].innerHTML.slice(0, -2)) ? 1 : -1);

		for (let i of (sortedRows)){
			i.classList.add('share-table-main-row');
		}
		table.tBodies[0].append(...sortedRows);
	}else if (index == 3){
		let sortedRows = Array.from(table.rows)
		  .slice(1, table.rows.length - 1)
		  .sort((rowA, rowB) => parseInt(rowA.cells[index].innerHTML.slice(0, -2)) < parseInt(rowB.cells[index].innerHTML.slice(0, -2)) ? 1 : -1);

		for (let i of (sortedRows)){
			i.classList.add('share-table-main-row');
		}
		table.tBodies[0].append(...sortedRows);
	}else if (index == 4){
		let sortedRows = Array.from(table.rows)
		  .slice(1, table.rows.length - 1)
		  .sort((rowA, rowB) => parseInt(rowA.cells[index].innerHTML.slice(0, -2)) < parseInt(rowB.cells[index].innerHTML.slice(0, -2)) ? 1 : -1);

		for (let i of (sortedRows)){
			i.classList.add('share-table-main-row');
		}
		table.tBodies[0].append(...sortedRows);
	}else if (index == 5){
		let sortedRows = Array.from(table.rows)
		  .slice(1, table.rows.length - 1)
		  .sort((rowA, rowB) => parseInt(rowA.cells[index].innerHTML.slice(0, -1)) < parseInt(rowB.cells[index].innerHTML.slice(0, -1)) ? 1 : -1);

		for (let i of (sortedRows)){
			i.classList.add('share-table-main-row');
		}
		table.tBodies[0].append(...sortedRows);
	}
	

}	



async function getTickersWithYahoo(htmlShares, table) {
	for (let i = 0; i < table.length; i++){
		let run = true;
		for (let j = 0; j < htmlShares.length; j++){
			if (table[i].ticker == htmlShares[j].ticker){
				run = false;			
			}
		}	

		if (run){

			let reqPromise = new Promise ((resolve, reject) => {
				request({url: `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${table[i].ticker}?modules=price`, json: true}, function(err, res, json) {
					let secType;
					if (json.quoteSummary.result[0].price.quoteType == 'EQUITY'){
						secType = 'share';
					}else if (json.quoteSummary.result[0].price.quoteType == 'ETF'){
						secType = 'etf';
					}else{
						secType = 'bond';
					}

					
					if (json.quoteSummary.result && json.quoteSummary.result[0].price.shortName && json.quoteSummary.result[0].price.regularMarketPrice.raw){
						htmlShares.push({
							ticker: table[i].ticker,
							name: json.quoteSummary.result[0].price.shortName,
							price: json.quoteSummary.result[0].price.regularMarketPrice.raw,
							type: secType,
						});
					}
					resolve(htmlShares);
				})
			}); 	
			let requestPromise = await reqPromise;
		}
	}	
	return (htmlShares);
}


async function getTickersWithMMVB(moexTT, allSecurities, table) {
	for (let i = 0; i < moexTT.length; i++){
		let nowTT = [];
		for (let j = 0; j < table.length; j++){
			if (table[j].TT == moexTT[i] && nowTT.indexOf(table[j].ticker) == -1){
				nowTT.push(table[j].ticker);
			}
		}
		let reqPromise = new Promise ((resolve, reject) => {
			request({url: `https://iss.moex.com/iss/engines/stock/markets/shares/boards/${moexTT[i]}/securities.json`, json: true}, function(err, res, json) {
				if (json.securities.data){
					//console.log(json.securities.data)
					let currientShares = json.securities.data;
					for (let k = 0; k < currientShares.length; k++){
						for (let l = 0; l < nowTT.length; l++){
							if (nowTT[l] == currientShares[k][0]){
								let secType;
								if (currientShares[k][7].indexOf('ETF') != -1){
									secType = 'etf';
								}else if (currientShares[k][7].indexOf('Акции') != -1){
									secType = 'share';
								}else{
									secType = 'bond';
								}
								allSecurities.push({
									ticker: nowTT[l],
									name: currientShares[k][2],
									price: currientShares[k][3],
									type: secType,
								})
							}
						}
					}
				}
				resolve(allSecurities);
			})
		}); 	
		let requestPromise = await reqPromise;
	}
	return (allSecurities);
}


ipc3.on('updP', () => {
	var db = new sqlite3.Database('db.sqlite3', (err) => {
		if (err){
			return console.error(err.message);
		}	
	})

	let nameBlock = document.querySelector('.main-nav-block-item_active');
	let portName = nameBlock.querySelector('p').querySelector('span');
	let portfolioName = portName.innerHTML;

	let shareTable = document.querySelector('.share');
	let etfTable = document.querySelector('.etf');
	let bondTable = document.querySelector('.bond');

	request({url: `https://www.cbr-xml-daily.ru/daily_json.js`, json: true}, function(err, res, json) {
		if (json.Valute){
			usdCourse = json.Valute.USD.Value;
			eurCourse = json.Valute.EUR.Value;
		}
		
		let quer = `SELECT * FROM ${nameBlock.getAttribute('broker') + portfolioName}`
		db.serialize(function() {
			db.all(quer, (err, table) => {
				let allSecurities = [];
				let moexTT = [];

				for (let i = 0; i < table.length; i++){
					if (table[i].TP == 'ММВБ'){
						if (moexTT.indexOf(table[i].TT) == -1){
							moexTT.push(table[i].TT);
						}
					}
				}
				
				allSecurities = getTickersWithMMVB(moexTT, allSecurities, table);
				allSecurities.then((v) => {
					let htmlShares = getTickersWithYahoo(v, table);
					htmlShares.then((value) => {
						let shareTotal = {
							name: 'Итого',
							summ: 0,
							profit: 0,
							percent: 0,
							currency: '₽'
						}

						let etfTotal = {
							name: 'Итого',
							summ: 0,
							profit: 0,
							percent: 0,
							currency: '₽'
						}

						let bondTotal = {
							name: 'Итого',
							summ: 0,
							profit: 0,
							percent: 0,
							currency: '₽'
						}
						for (let i = 0; i < value.length; i++){
							value[i].number = 0;
							value[i].summ = 0;
							value[i].profit = 0;
							value[i].currency = '';
							for (let j = 0; j < table.length; j++){
								if (value[i].ticker == table[j].ticker){

									if (table[j].currency == 'USD'){
										value[i].currency = '$';
										value[i].RUBPrice = value[i].price * usdCourse;
									}
									if (table[j].currency == 'RUB'){
										value[i].currency = '₽';
										value[i].RUBPrice = value[i].price;
									}
									if (table[j].currency == 'EUR'){
										value[i].currency = '€';
										value[i].RUBPrice = value[i].price * eurCourse;
									}
									if (table[j].type == 1){
										value[i].number = value[i].number + table[j].number;
										value[i].profit = value[i].profit - table[j].number * table[j].price;
									}else{
										value[i].number = value[i].number - table[j].number;
										value[i].profit = value[i].profit + table[j].number * table[j].price;
										if (value[i].number == 0){
											value[i].profit = 0;
										}
									}
									
								}
							}
							value[i].summ = value[i].number * value[i].price;

							value[i].profit = value[i].profit + value[i].summ;

							value[i].percent = (100 * (value[i].profit)/(value[i].summ - value[i].profit))

						}


						

						shareTable.innerHTML = `<tr class="share-table-main-row share">
													<td>Компания</td>
													<td>Количиство</td>
													<td>Текущая цена</td>
													<td>Стоимость бумаг в портфеле</td>
													<td>Прибыль</td>
													<td>Курс. прибыль</td>
												</tr>`;

						etfTable.innerHTML = `<tr class="share-table-main-row etf">
													<td>Компания</td>
													<td>Количиство</td>
													<td>Текущая цена</td>
													<td>Стоимость бумаг в портфеле</td>
													<td>Прибыль</td>
													<td>Курс. прибыль</td>
												</tr>`;

						bondTable.innerHTML = `<tr class="share-table-main-row bond">
													<td>Компания</td>
													<td>Количиство</td>
													<td>Текущая цена</td>
													<td>Стоимость бумаг в портфеле</td>
													<td>Прибыль</td>
													<td>Курс. прибыль</td>
												</tr>`;


						for (let i = 0; i < value.length; i++){
							if (v[i].number == 0){
								continue
							}
							if (v[i].type == 'share'){
								if (value[i].currency == '$'){
									shareTotal.summ = shareTotal.summ + value[i].summ * usdCourse;
								} else if (value[i].currency == '€') {
									shareTotal.summ = shareTotal.summ + value[i].summ * eurCourse;
								} else {
									shareTotal.summ = shareTotal.summ + value[i].summ;
								}
								
								if (value[i].currency == '$'){
									shareTotal.profit = shareTotal.profit + value[i].profit * usdCourse;
								} else if (value[i].currency == '€') {
									shareTotal.profit = shareTotal.profit + value[i].profit * eurCourse;
								} else {
									shareTotal.profit = shareTotal.profit + value[i].profit;
								}

								shareTotal.percent = shareTotal.percent + value[i].percent;

								shareTable.innerHTML = shareTable.innerHTML +  `<tr class="share-table-main-row">
																					<td>${v[i].name}</td>
																					<td>${v[i].number}</td>
																					<td>${v[i].price.toFixed(2) + ' ' + v[i].currency}</td>
																					<td>${(v[i].number * v[i].price).toFixed(2) +' ' + v[i].currency}</td>
																					<td>${(v[i].profit).toFixed(2) + ' ' + v[i].currency}</td>
																					<td>${v[i].percent.toFixed(2) + '%'}</td>
																				</tr>`;
							} else if (v[i].type == 'etf'){

								if (value[i].currency == '$'){
									etfTotal.summ = etfTotal.summ + value[i].summ * usdCourse;
								} else if (value[i].currency == '€') {
									etfTotal.summ = etfTotal.summ + value[i].summ * eurCourse;
								} else {
									etfTotal.summ = etfTotal.summ + value[i].summ;
								}
								
								if (value[i].currency == '$'){
									etfTotal.profit = etfTotal.profit + value[i].profit * usdCourse;
								} else if (value[i].currency == '€') {
									etfTotal.profit = etfTotal.profit + value[i].profit * eurCourse;
								} else {
									etfTotal.profit = etfTotal.profit + value[i].profit;
								}


								etfTotal.percent = etfTotal.percent + value[i].percent;

								etfTable.innerHTML = etfTable.innerHTML +  `<tr class="share-table-main-row">
																				<td>${v[i].name}</td>
																				<td>${v[i].number}</td>
																				<td>${v[i].price.toFixed(2) + ' ' + v[i].currency}</td>
																				<td>${(v[i].number * v[i].price).toFixed(2) +' ' + v[i].currency}</td>
																				<td>${(v[i].profit).toFixed(2) + ' ' + v[i].currency}</td>
																				<td>${v[i].percent.toFixed(2) + '%'}</td>
																			</tr>`;
							} else {

								if (value[i].currency == '$'){
									bondTotal.summ = bondTotal.summ + value[i].summ * usdCourse;
								} else if (value[i].currency == '€') {
									bondTotal.summ = bondTotal.summ + value[i].summ * eurCourse;
								} else {
									bondTotal.summ = bondTotal.summ + value[i].summ;
								}
								
								if (value[i].currency == '$'){
									bondTotal.profit = bondTotal.profit + value[i].profit * usdCourse;
								} else if (value[i].currency == '€') {
									bondTotal.profit = bondTotal.profit + value[i].profit * eurCourse;
								} else {
									bondTotal.profit = bondTotal.profit + value[i].profit;
								}

								bondTotal.percent = bondTotal.percent + value[i].percent;
								bondTable.innerHTML = bondTable.innerHTML +  `<tr class="share-table-main-row">
																				<td>${v[i].name}</td>
																				<td>${v[i].number}</td>
																				<td>${v[i].price.toFixed(2) + ' ' + v[i].currency}</td>
																				<td>${(v[i].number * v[i].price).toFixed(2) +' ' + v[i].currency}</td>
																				<td>${(v[i].profit).toFixed(2) + ' ' + v[i].currency}</td>
																				<td>${v[i].percent.toFixed(2) + '%'}</td>
																			</tr>`;
							}


						}

						shareTable.innerHTML = shareTable.innerHTML +  `<tr class="share-table-main-row">
																				<td>${shareTotal.name}</td>
																				<td></td>
																				<td></td>
																				<td>${shareTotal.summ.toFixed(2)}</td>
																				<td>${(shareTotal.profit).toFixed(2) + ' ' + shareTotal.currency}</td>
																				<td>${(100 * shareTotal.profit/(shareTotal.summ - shareTotal.profit)).toFixed(2) + '%'}</td>
																			</tr>`;
						etfTable.innerHTML = etfTable.innerHTML +  `<tr class="share-table-main-row">
																				<td>${etfTotal.name}</td>
																				<td></td>
																				<td></td>
																				<td>${etfTotal.summ.toFixed(2)}</td>
																				<td>${(etfTotal.profit).toFixed(2) + ' ' + etfTotal.currency}</td>
																				<td>${(100 * etfTotal.profit/(etfTotal.summ - etfTotal.profit)).toFixed(2) + '%'}</td>
																			</tr>`;
						bondTable.innerHTML = bondTable.innerHTML +  `<tr class="share-table-main-row">
																				<td>${bondTotal.name}</td>
																				<td></td>
																				<td></td>
																				<td>${bondTotal.summ.toFixed(2)}</td>
																				<td>${(bondTotal.profit).toFixed(2) + ' ' + bondTotal.currency}</td>
																				<td>${(100 * bondTotal.profit/(bondTotal.summ - bondTotal.profit + 0.000000000001)).toFixed(2) + '%'}</td>
																			</tr>`;

							

						shareTable.addEventListener('click', (event) => {
							console.log(event.target);
							if (event.target.innerHTML == 'Компания'){
								sortTable(shareTable, 0);	
							} else if (event.target.innerHTML == 'Количиство'){
								sortTable(shareTable, 1);
							}else if (event.target.innerHTML == 'Текущая цена'){
								sortTable(shareTable, 2);
							}else if (event.target.innerHTML == 'Стоимость бумаг в портфеле'){
								sortTable(shareTable, 3);
							}else if (event.target.innerHTML == 'Прибыль'){
								sortTable(shareTable, 4);
							}else if (event.target.innerHTML == 'Курс. прибыль'){
								sortTable(shareTable, 5);
							}
						})		

						etfTable.addEventListener('click', (event) => {
							console.log(event.target);
							if (event.target.innerHTML == 'Компания'){
								sortTable(etfTable, 0);	
							} else if (event.target.innerHTML == 'Количиство'){
								sortTable(etfTable, 1);
							}else if (event.target.innerHTML == 'Текущая цена'){
								sortTable(etfTable, 2);
							}else if (event.target.innerHTML == 'Стоимость бумаг в портфеле'){
								sortTable(etfTable, 3);
							}else if (event.target.innerHTML == 'Прибыль'){
								sortTable(etfTable, 4);
							}else if (event.target.innerHTML == 'Курс. прибыль'){
								sortTable(etfTable, 5);
							}
						})	

						bondTable.addEventListener('click', (event) => {
							console.log(event.target);
							if (event.target.innerHTML == 'Название'){
								sortTable(bondTable, 0);	
							} else if (event.target.innerHTML == 'Количиство'){
								sortTable(bondTable, 1);
							}else if (event.target.innerHTML == 'Текущая цена'){
								sortTable(bondTable, 2);
							}else if (event.target.innerHTML == 'Стоимость бумаг в портфеле'){
								sortTable(bondTable, 3);
							}else if (event.target.innerHTML == 'Прибыль'){
								sortTable(bondTable, 4);
							}else if (event.target.innerHTML == 'Курс. прибыль'){
								sortTable(bondTable, 5);
							}
						})		

						ipc3.send('updatePage2', JSON.stringify(v), JSON.stringify(table));
						ipc3.send('updatePage3', JSON.stringify(v), JSON.stringify(table));
					})
				});
			})
		});
	})
	
});
