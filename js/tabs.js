
let tab1 = document.querySelector('.main-tab1');
let tab2 = document.querySelector('.main-tab2');
let tab3 = document.querySelector('.main-tab3');

let page1 = document.querySelector('.page1');
let page2 = document.querySelector('.page2');
let page3 = document.querySelector('.page3');


tab1.addEventListener('click', function(){
	tab1.classList.add('main-page-nav-block-item_active');
	tab2.classList.remove('main-page-nav-block-item_active');
	tab3.classList.remove('main-page-nav-block-item_active');

	page1.classList.add('actve-page');
	page2.classList.remove('actve-page');
	page3.classList.remove('actve-page');
});

tab2.addEventListener('click', function(){
	tab2.classList.add('main-page-nav-block-item_active');
	tab1.classList.remove('main-page-nav-block-item_active');
	tab3.classList.remove('main-page-nav-block-item_active');

	page2.classList.add('actve-page');
	page1.classList.remove('actve-page');
	page3.classList.remove('actve-page');
});

tab3.addEventListener('click', function(){
	tab3.classList.add('main-page-nav-block-item_active');
	tab2.classList.remove('main-page-nav-block-item_active');
	tab1.classList.remove('main-page-nav-block-item_active');

	page3.classList.add('actve-page');
	page2.classList.remove('actve-page');
	page1.classList.remove('actve-page');
});


let page0 = document.querySelector('.page0');

setInterval(() => {
	let heights = []

	heights.push(page3.offsetHeight);
	heights.push(page2.offsetHeight);
	heights.push(page1.offsetHeight);

	let maxH = 0;
	for (let i = 0; i < heights.length; i++){
		if (heights[i] > maxH){
			maxH = heights[i];
		}
	}
	page0.style.height = `${maxH}px`


}, 3000)








