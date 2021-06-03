
const ipc3 = require('electron').ipcRenderer;


var sqlite3 = require('sqlite3').verbose();

async function htmlUpd(table) {
	let mainNavBlock = document.querySelector('.main-nav-block');
				
	mainNavBlock.innerHTML = '';

	if (table){
		for (let i = 0; i < table.length; i++){
			if (table[i].name != 'sqlite_sequence'){
				if (i == 1) {
					mainNavBlock.innerHTML = mainNavBlock.innerHTML  + `<div class="main-nav-block-item main-nav-block-item_active" broker="${table[i].name.slice(0, 3)}">
																		<p class="main-nav-block-item__title">
																			<span>${table[i].name.replace(/^.{3}/, '')}</span>
																		</p>
																	</div>	`
				} else {
					mainNavBlock.innerHTML = mainNavBlock.innerHTML  + `<div class="main-nav-block-item" broker="${table[i].name.slice(0, 3)}">
																		<p class="main-nav-block-item__title">
																			<span>${table[i].name.replace(/^.{3}/, '')}</span>
																		</p>
																	</div>	`
				}				
			}	
		}
	}	
}


ipc3.on('upd', () => {
	console.log('upd');
	var db = new sqlite3.Database('db.sqlite3', (err) => {
		if (err){
			return console.error(err.message);
		}
		let query = `SELECT name FROM sqlite_master WHERE type="table"`;

		db.serialize(function() {
			db.all(query, (err, table) => {
				htmlUpd(table).then((v) => {
					ipc3.send('updateMenu');
				})
				
			});
		})
		
	})
});





