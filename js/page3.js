


ipc3.on('updP3', (event, message, table) => {
	table = JSON.parse(table);
	let allActives = JSON.parse(message);

	let transTable = document.querySelector('.trans-table');

	transTable.innerHTML = `<tr class="trans-table-main-row">
								<td>Название</td>
								<td>Тикер</td>
								<td>Дата</td>
								<td>Количиство</td>
								<td>Цена</td>
								<td>Комиссия</td>
								<td>Сумма</td>
							</tr>`


	for (let i = 0; i < table.length; i++){
		let cer = '₽';

		if (table[i].currency == 'USD'){
			cer = '$'
		}

		if (table[i].currency == 'EUR'){
			cer = '€'
		}
		for (let j = 0; j < allActives.length; j++){
			if (table[i].ticker == allActives[j].ticker){
				table[i].name = allActives[j].name
			}
		}

		transTable.innerHTML = transTable.innerHTML + `<tr class="trans-table-main-row">
															<td>${table[i].name}</td>
															<td>${table[i].ticker}</td>
															<td>${table[i].datetime.slice(0, 10)}</td>
															<td>${table[i].number}</td>
															<td>${table[i].price + ' ' + cer} </td>
															<td>${(table[i].commission1 + table[i].commission2 + table[i].commission3).toFixed(2)} ${cer}</td>
															<td>${(table[i].price * table[i].number).toFixed(2)} ${cer}</td>
														</tr>`
	}

});
