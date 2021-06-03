// const { ipcRenderer } = require('electron');
// const ipc4 = ipcRenderer;
let tableName;
let broker;

////CONTEXT MENU
let menu = document.querySelector('.main-nav-context-menu');
ipc.on('updM', function() {
	let nav = document.querySelectorAll('.main-nav-block-item');

	for (let i = 0; i < nav.length; i++){
		nav[i].addEventListener('click', function() {
			for (let j = 0; j < nav.length; j++){
				nav[j].classList.remove('main-nav-block-item_active');
			}

			nav[i].classList.add('main-nav-block-item_active');
			ipc3.send('updatePage');
		}); 

		nav[i].addEventListener('contextmenu', function(event) {
			
			let portName = nav[i].querySelector('span');
			//console.log(portName);
			tableName = portName;
			broker = nav[i].getAttribute('broker');


			// let c = nav[i].getBoundingClientRect();
			
			// console.log(c.y);
			menu.style.visibility = 'visible';
			menu.style.top = `${event.clientY}px`;
			menu.style.left = `${event.clientX}px`;
		})
	}

	ipc3.send('updatePage');
})
////CONTEXT MENU


///UPADTE
let upd = document.querySelector('.update-popup');
let updPop = document.querySelector('.update-popup-popup');
let updateBtnnn = document.querySelector('.up-btn-block-btn');


updateBtnnn.addEventListener('click', (e) => {
	ipc.send('updateTable', tableName.innerHTML, broker);
})


upd.addEventListener('click', (e) => {
	if (e.target.classList.contains('update-popup')){
		updPop.style.opacity = '0';
		updPop.classList.remove('update-popup-popup_active');
		upd.style.visibility = 'hidden';
		upd.style.backgroundColor = 'rgba(0, 0, 0, 0)';
	}
})

document.addEventListener('click', (e) => {
	if (e.target.classList.contains('openUpdatePopup')){
		updPop.classList.add('update-popup-popup_active');
		updPop.style.opacity = '1';
		upd.style.visibility = 'visible';
		upd.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
	}
	menu.style.visibility = 'hidden';
})

///UPDATE

//////DELETE
let odp = document.querySelector('.delete-popup');
let odpp = document.querySelector('.delete-popup-popup');
let cancelODP = document.querySelector('.dp-btn-block-cancel');
let deleteODP = document.querySelector('.dp-btn-block-delete');

deleteODP.addEventListener('click', (e) => {
	odpp.style.opacity = '0';
	odpp.classList.remove('delete-popup-popup_active');
	odp.style.visibility = 'hidden';
	odp.style.backgroundColor = 'rgba(0, 0, 0, 0)';

	var db = new sqlite3.Database('db.sqlite3', (err) => {
		if (err){
			return console.error(err.message);
		}
		//console.log(tableName.innerHTML);
		if (tableName.innerHTML){
			console.log(broker + tableName.innerHTML);
			let query = `DROP TABLE ${broker + tableName.innerHTML}`;

			db.serialize(function() {
				db.run(query, (err, table) => {
					ipc.send('update')
					
				});
			})
		}
			
	})
})

cancelODP.addEventListener('click', (e) => {
	odpp.style.opacity = '0';
	odpp.classList.remove('delete-popup-popup_active');
	odp.style.visibility = 'hidden';
	odp.style.backgroundColor = 'rgba(0, 0, 0, 0)';
})

odp.addEventListener('click', (e) => {
	if (e.target.classList.contains('delete-popup')){
		odpp.style.opacity = '0';
		odpp.classList.remove('delete-popup-popup_active');
		odp.style.visibility = 'hidden';
		odp.style.backgroundColor = 'rgba(0, 0, 0, 0)';
	}
})

document.addEventListener('click', (e) => {
	if (e.target.classList.contains('openDeletePopup')){
		
		let deleteq = document.querySelector('.delete-q');
		deleteq.innerHTML = `&#160;${broker + tableName.innerHTML}`;

		odpp.classList.add('delete-popup-popup_active');
		odpp.style.opacity = '1';
		odp.style.visibility = 'visible';
		odp.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
	}
	menu.style.visibility = 'hidden';
})
//////DELETE


/////ADD
let popup = document.querySelector('.add-portfolio-popup');
let addPortfolioBtn = document.querySelector('.bi-plus-circle');
let popupPopup = document.querySelector('.add-portfolio-popup-popup');
let updateBtn = document.querySelector('.update-btn');

updateBtn.addEventListener('click', () => {
	ipc.send('update')
})


addPortfolioBtn.addEventListener('click', () => {
	let textArea = document.querySelector('.add-portfolio-text-area');
	textArea.value = ``;

	popupPopup.classList.add('add-portfolio-popup-popup_active');
	popupPopup.style.opacity = '1';
	popup.style.visibility = 'visible';
	popup.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
})

popup.addEventListener('click', (e) => {
	if (e.target.classList.contains('add-portfolio-popup')){
		popupPopup.style.opacity = '0';
		popupPopup.classList.remove('add-portfolio-popup-popup_active');
		popup.style.visibility = 'hidden';
		popup.style.backgroundColor = 'rgba(0, 0, 0, 0)';
	}
})
/////ADD

