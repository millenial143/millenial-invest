var Chart = require('chart.js');


let myChart;
let myChart2;
let myChart3;
let myChart4;

let myGraph1;
let myGraph2;

console.log('awdawd')



let colors = [
'#9700cc',
'#7400cc',
'#5c00cc',
'#4b00cc',
'#3a00cc',
'#2500cc',
'#0070cc',
'#008ee0',
'#00ace0',
'#00cae0'
]


function toTimestamp(strDate){
	var datum = Date.parse(strDate);
	return datum/1000;
}

async function getPricesWithYahoo(securities, dates) {


	for (let i = 0; i < dates.length; i++ ){
		for (let j = 0; j < securities[i].length; j++){
			if (securities[i][j].number != 0){
			
				let year = dates[i].split(',')[1];
				let mounth = dates[i].split(',')[0];
				let day = 30;
				if (mounth == 2){
					day = 28;
				}
				
				let timeStap1 = toTimestamp(`${year} ${mounth} ${day - 1} 16:00:00`);
				let timeStap2 = 9999999999;

				let req2Promise;
				let reqPromise = new Promise ((resolve, reject) => {
					request({url: `https://query1.finance.yahoo.com/v8/finance/chart/${securities[i][j].ticker}?&period1=${timeStap1}&period2=${timeStap2}&interval=1d&`, json: true}, function(err, res, json) {
						
						if (json.chart.result == null || json.chart.result[0].meta.currency == null){
							req2Promise = new Promise ((resolve, reject) => {
								request({url: `https://query1.finance.yahoo.com/v8/finance/chart/${securities[i][j].ticker}.ME?&period1=${timeStap1}&period2=${timeStap2}&interval=1d&`, json: true}, function(err, res, json2) {
									
									if (err) {
										console.log(err)
									}
									if (json2.chart.result == null){
									} else {
										if (json2.chart.result[0].meta.currency == null){

										} else {
											let arra = json2.chart.result[0].indicators.quote[0].open;
											let index1 = 0;
											let index2 = arra.length - 1;

											if (arra.length >= 2){
												index2 = index2 - 1;
											}

											while (arra[index1] == null){
												index1 = index1 + 1;

											}

											while (arra[index2] == null){
												index2 = index2 - 1;
											
											}
										
											securities[i][j].price = json2.chart.result[0].meta.regularMarketPrice * arra[index1]/arra[index2];
											if (json2.chart.result[0].meta.currency == 'USD'){
												securities[i][j].price = securities[i][j].price * usdCourse;
											}

											if (json2.chart.result[0].meta.currency == 'EUR'){
												securities[i][j].price = securities[i][j].price * eurCourse;
											}

										}
										
									}
									
								});
							})	
						} else {
							let arra = json.chart.result[0].indicators.quote[0].open;
							let index1 = 0;
							let index2 = arra.length - 1;

							if (arra.length >= 2){
								index2 = index2 - 1;
							}

							while (arra[index1] == null){
								index1 = index1 + 1;
							}

							while (arra[index2] == null){
								index2 = index2 - 1;
							}

					
							
							securities[i][j].price = json.chart.result[0].meta.regularMarketPrice * arra[index1]/arra[index2] ;

							if (json.chart.result[0].meta.currency == 'USD'){
								securities[i][j].price = securities[i][j].price * usdCourse;
							}

							if (json.chart.result[0].meta.currency == 'EUR'){
								securities[i][j].price = securities[i][j].price * eurCourse;
							}

						}
						resolve(securities);
					})
				})
				let request2Promise = await req2Promise;
				let requestPromise = await reqPromise;	
			}	
		}
	}
	return securities;	
}

async function getPricesWithYahooByM(securities, dates) {

	for (let i = 0; i < dates.length; i++ ){
		for (let j = 0; j < securities[i].length; j++){
			if (securities[i][j].number != 0){

				let timeStap1 = dates[i];
				let timeStap2 = 9999999999;

				let req2Promise;
				let reqPromise = new Promise ((resolve, reject) => {
					request({url: `https://query1.finance.yahoo.com/v8/finance/chart/${securities[i][j].ticker}?&period1=${timeStap1}&period2=${timeStap2}&interval=10m&`, json: true}, function(err, res, json) {
						if (json.chart.result == null || json.chart.result[0].meta.currency == null){
							req2Promise = new Promise ((resolve, reject) => {
								request({url: `https://query1.finance.yahoo.com/v8/finance/chart/${securities[i][j].ticker}.ME?&period1=${timeStap1}&period2=${timeStap2}&interval=10m&`, json: true}, function(err, res, json2) {
									
									if (err) {
										console.log(err)
									}
									if (json2.chart.result == null){
									} else {
										if (json2.chart.result[0].meta.currency == null){

										} else {
											let arra = json2.chart.result[0].indicators.quote[0].open;
											let index1 = 0;
											let index2 = arra.length - 1;

											if (arra.length >= 2){
												index2 = index2 - 1;
											}

											while (arra[index1] == null){
												index1 = index1 + 1;

											}

											while (arra[index2] == null){
												index2 = index2 - 1;
											}
										
											securities[i][j].price = json2.chart.result[0].meta.regularMarketPrice * arra[index1]/arra[index2];
											if (json2.chart.result[0].meta.currency == 'USD'){
												securities[i][j].price = securities[i][j].price * usdCourse;
											}

											if (json2.chart.result[0].meta.currency == 'EUR'){
												securities[i][j].price = securities[i][j].price * eurCourse;
											}

										}
										
									}
									
								});
							})	
						} else {
							let arra = json.chart.result[0].indicators.quote[0].open;
							let index1 = 0;
							let index2 = arra.length - 1;

							if (arra.length >= 2){
								index2 = index2 - 1;
							}

							while (arra[index1] == null){
								index1 = index1 + 1;
							}

							while (arra[index2] == null){
								index2 = index2 - 1;
							}

					
							
							securities[i][j].price = json.chart.result[0].meta.regularMarketPrice * arra[index1]/arra[index2] ;

							if (json.chart.result[0].meta.currency == 'USD'){
								securities[i][j].price = securities[i][j].price * usdCourse;
							}

							if (json.chart.result[0].meta.currency == 'EUR'){
								securities[i][j].price = securities[i][j].price * eurCourse;
							}

						}
						resolve(securities);
					})
				})
				let request2Promise = await req2Promise;
				let requestPromise = await reqPromise;	
			}	
		}
	}
	return securities;	
}
async function getSectorsAndCountriesWithYahoo(message) {
	htmlShares = JSON.parse(message);
	for (let i = 0; i < htmlShares.length; i++){
		if (htmlShares[i].type == 'share'){
			let req2Promise;
			let reqPromise = new Promise ((resolve, reject) => {
				request({url: `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${htmlShares[i].ticker}?modules=assetProfile`, json: true}, function(err, res, json) {
					if (json.quoteSummary.result == null){
						req2Promise = new Promise ((resolve, reject) => {
							request({url: `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${htmlShares[i].ticker}.ME?modules=assetProfile`, json: true}, function(err, res, json2) {
								if (err) {
									console.log(err)
								}

								htmlShares[i].country = json2.quoteSummary.result[0].assetProfile.country;
								htmlShares[i].sector = json2.quoteSummary.result[0].assetProfile.sector;
							});
						})		
					} else {
						htmlShares[i].country = json.quoteSummary.result[0].assetProfile.country;
						htmlShares[i].sector = json.quoteSummary.result[0].assetProfile.sector;
					}
					resolve(htmlShares);
				})
			}); 	

			let request2Promise = await req2Promise;
			let requestPromise = await reqPromise;		
		}
	}	
	return (htmlShares);
}

function createTypesDiagramm(message) {
	let types = ['Акции', 'ПИФы и ETF', 'Облигации'];
	let summs = [0, 0, 0];
	
	allActives = JSON.parse(message);
	for (let i = 0; i < allActives.length; i++){
		let secType = ''
		if (allActives[i].type == 'share'){
			secType = 'Акции';
			summs[0] = summs[0] + allActives[i].RUBPrice * allActives[i].number;
		}else if (allActives[i].type == 'etf'){
			secType = 'ПИФы и ETF';
			summs[1] = summs[1] + allActives[i].RUBPrice * allActives[i].number;
		}else{
			secType = 'Облигации';
			summs[2] = summs[2] + allActives[i].RUBPrice * allActives[i].number;
		}

		
	}
	var fst = document.getElementById('first-dia');
	if (myChart){
		myChart.destroy()
	}
	
	
	myChart = new Chart(fst, {
		type: 'pie',
		data:{
		    labels: types,
		    datasets: [
		        {
		            data: summs,
		            backgroundColor: colors,
		            borderColor: "#101630",
		            borderWidth: 1
		        }]
		},
		options: {
			maintainAspectRatio: false,
			layout: {
	            padding: {
	                left: 10,
	                top: 0,
	            }
	        },
			plugins: {
				title: {
					display: true,
					text: 'Состав портфеля по категориям',
					color: 'silver',
					align: 'left',
					font: {
		                size: 18,
		                family: 'sans-serif',
		                weight: 'bold',
		            },
		            padding: {
	                    top: 10,
	                    bottom:10 ,
	                }

				},
				legend: {  	
				    position: 'right',
				    title: {
				    	color: 'silver',
				    },
				    labels: {
				    	color: 'silver',
			            font: {
			                size: 16,
			                family: 'sans-serif',
			                weight: 'bold',
			            }
			        }
				  }
				},
		 
		  animation: {
		    animateRotate: false,
		  }
		}
	});
}

function createSecuritiesDiagramm(message) {
	let types = [];
	let summs = [];
	allActives = JSON.parse(message);
	for (let i = 0; i < allActives.length; i++){
		if (allActives[i].number != 0){
			if (allActives[i].name.length > 19){
				types.push(allActives[i].name.slice(0, 17) + '...');
			} else {
				types.push(allActives[i].name);
			}
			
			summs.push(allActives[i].RUBPrice * allActives[i].number);	
		}
	}
	var sec = document.getElementById('second-dia');
	if (myChart2){
		myChart2.destroy()
	}
	for (let i = 0; i < summs.length - 1; i++){
		for (let j = 0; j < summs.length - 1; j++){
			if (summs[j] < summs[j + 1]){
				[summs[j], summs[j + 1]] = [summs[j + 1], summs[j]];
				[types[j], types[j + 1]] = [types[j + 1], types[j]];
			}
		}
	}
	
	myChart2 = new Chart(sec, {
		type: 'pie',
		data:{
		    labels: types,
		    datasets: [{
		    			label: types,
			            data: summs,
			            backgroundColor: colors,
			            borderColor: "#101630",
			            borderWidth: 1
			        }]
		},
		options: {
			maintainAspectRatio: false,
			layout: {
	            padding: {
	                left: 10,
	                top: 0,
	            }
	        },
			plugins: {
				title: {
					display: true,
					text: 'Состав портфеля по активам',
					color: 'silver',
					align: 'left',
					font: {
		                size: 18,
		                family: 'sans-serif',
		                weight: 'bold',
		            },
		            padding: {
	                    top: 10,
	                    bottom:10 ,
	                }

				},
				legend: {  
					maxHeight: 200,	
				    position: 'right',
				    title: {
				    	color: 'silver',
				    },
				    labels: {
				    	color: 'silver',
			            font: {
			                size: 12,
			                family: 'sans-serif',
			                weight: 'bold',
			            }
			        }
				  }
				},
		 
		  animation: {
		    animateRotate: false,
		  }
		}
	});
}

function createSectorsDiagramm(message) {
	let types = [
	'Информационные технологии',
	'Здравоохранение',
	'Финансовый сектор',
 	'Коммуникационные услуги',
 	'Товары второй необходимости',
 	'Промышленный сектор',
 	'Товары первой необходимости',
	'Коммунальные услуги',
 	'Недвижимость',
 	'Энергетика',
 	'Сырьевой сектор',
 	'Другое'
	];
	let summs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	
	allActives = (message);
	for (let i = 0; i < allActives.length; i++){
		if (allActives[i].number != 0 ){
			if (allActives[i].sector){
				let sector = allActives[i].sector;
				if (sector == 'Technology'){
					summs[0] = summs[0] + allActives[i].RUBPrice * allActives[i].number;
				} else if (sector == 'Healthcare'){
					summs[1] = summs[1] + allActives[i].RUBPrice * allActives[i].number;
				} else if (sector == 'Financial Services'){
					summs[2] = summs[2] + allActives[i].RUBPrice * allActives[i].number;
				} else if (sector == 'Communication Services'){
					summs[3] = summs[3] + allActives[i].RUBPrice * allActives[i].number;
				}else if (sector == 'Consumer Cyclical'){
					summs[4] = summs[4] + allActives[i].RUBPrice * allActives[i].number;
				}else if (sector == 'Industrials'){
					summs[5] = summs[5] + allActives[i].RUBPrice * allActives[i].number;
				}else if (sector == 'Consumer Defensive'){
					summs[6] = summs[6] + allActives[i].RUBPrice * allActives[i].number;
				}else if (sector == 'Utilities'){
					summs[7] = summs[7] + allActives[i].RUBPrice * allActives[i].number;
				}else if (sector == 'Real Estate'){
					summs[8] = summs[8] + allActives[i].RUBPrice * allActives[i].number;
				}else if (sector == 'Energy'){
					summs[9] = summs[9] + allActives[i].RUBPrice * allActives[i].number;
				}else if (sector == 'Basic Materials'){
					summs[10] = summs[10] + allActives[i].RUBPrice * allActives[i].number;
				}
			}else{
				summs[11] = summs[11] + allActives[i].RUBPrice * allActives[i].number;
			}
			
			
		} 
	}
	var thd = document.getElementById('third-dia');
	if (myChart3){
		myChart3.destroy()
	}
	for (let i = 0; i < summs.length - 1; i++){
		for (let j = 0; j < summs.length - 1; j++){
			if (summs[j] < summs[j + 1]){
				[summs[j], summs[j + 1]] = [summs[j + 1], summs[j]];
				[types[j], types[j + 1]] = [types[j + 1], types[j]];
			}
		}
	}
	
	myChart3 = new Chart(thd, {
		type: 'pie',
		data:{
		    labels: types,
		    datasets: [{
		    			label: types,
			            data: summs,
			            backgroundColor: colors,
			            borderColor: "#101630",
			            borderWidth: 1
			        }]
		},
		options: {
			maintainAspectRatio: false,
			layout: {
	            padding: {
	                left: 10,
	                top: 0,
	            }
	        },
			plugins: {
				title: {
					display: true,
					text: 'Состав портфеля по секторам',
					color: 'silver',
					align: 'left',
					font: {
		                size: 18,
		                family: 'sans-serif',
		                weight: 'bold',
		            },
		            padding: {
	                    top: 10,
	                    bottom:10 ,
	                }

				},
				legend: {  
					maxHeight: 200,	
				    position: 'right',
				    title: {
				    	color: 'silver',
				    },
				    labels: {
				    	padding: 15,
				    	color: 'silver',
			            font: {
			                size: 8,
			                family: 'sans-serif',
			                weight: 'bold',
			                lineHeight: 1.3,
			            }
			        }
				  }
				},
		 
		  animation: {
		    animateRotate: false,
		  }
		}
	});
}

function createCountresDiagramm(message) {
	let types = [];
	let summs = [];
	allActives = (message);
	for (let i = 0; i < allActives.length; i++){
		if (allActives[i].number != 0 && allActives[i].country && types.indexOf(allActives[i].country) == -1){
			if (allActives[i].country.length > 19){
				types.push(allActives[i].country.slice(0, 17) + '...');
				summs.push(0);
			} else {
				types.push(allActives[i].country);
				summs.push(0);
			}
		}
	}

	for (let i = 0; i < allActives.length; i++){
		if (types.indexOf(allActives[i].country) != -1){
			let index = types.indexOf(allActives[i].country);
			summs[index] = summs[index] +  allActives[i].number * allActives[i].RUBPrice;
		}
	} 

	var four = document.getElementById('four-dia');
	if (myChart4){
		myChart4.destroy()
	}
	for (let i = 0; i < summs.length - 1; i++){
		for (let j = 0; j < summs.length - 1; j++){
			if (summs[j] < summs[j + 1]){
				[summs[j], summs[j + 1]] = [summs[j + 1], summs[j]];
				[types[j], types[j + 1]] = [types[j + 1], types[j]];
			}
		}
	}
	
	myChart4 = new Chart(four, {
		type: 'pie',
		data:{
		    labels: types,
		    datasets: [{
		    			label: types,
			            data: summs,
			            backgroundColor: colors,
			            borderColor: "#101630",
			            borderWidth: 1
			        }]
		},
		options: {
			maintainAspectRatio: false,
			layout: {
	            padding: {
	                left: 10,
	                top: 0,
	            }
	        },
			plugins: {
				title: {
					display: true,
					text: 'Состав портфеля акций по странам',
					color: 'silver',
					align: 'left',
					font: {
		                size: 18,
		                family: 'sans-serif',
		                weight: 'bold',
		            },
		            padding: {
	                    top: 10,
	                    bottom:10 ,
	                }

				},
				legend: {  
					maxHeight: 200,	
				    position: 'right',
				    title: {
				    	color: 'silver',
				    },
				    labels: {
				    	color: 'silver',
			            font: {
			                size: 12,
			                family: 'sans-serif',
			                weight: 'bold',
			            }
			        }
				  }
				},
		 
		  animation: {
		    animateRotate: false,
		  }
		}
	});
}

function createSummGraphic(message, table){
	//console.log(JSON.parse(table))
	table = JSON.parse(table);
	let allActives = JSON.parse(message);
	var mounthArray = [
	   'Январь',
	   'Февраль',
	   'Март',
	   'Апрель',
	   'Май',
	   'Июнь',
	   'Июль',
	   'Август',
	   'Сентябрь',
	   'Октябрь',
	   'Ноябрь',
	   'Декабрь',
	];

	let today = new Date;
	let currientMounth = today.getMonth()
	let currientYear = today.getFullYear()

	let mounthAxis = []
	let dateForMounthsTrans = []


	for (let i = currientMounth; i > 5 - 12; i--){
		let j;
		let year = currientYear;
		if (i < 0){
			j = 12 + i;
			year = currientYear - 1;
		} else {
			j = i
		}
		dateForMounthsTrans.push((j + 1) + ',' + year);
		mounthAxis.push(mounthArray[j] + ', ' + year);

	}


	let transForPeriod = [];

	for (let j = 0; j < dateForMounthsTrans.length; j++){

		let y = parseInt(dateForMounthsTrans[j].split(',')[1]);
		let m = parseInt(dateForMounthsTrans[j].split(',')[0]);
		arr = [];
		for (let i = 0; i < table.length; i++){
			let tm = parseInt(table[i].datetime.slice(3, 5));
			let ty = parseInt(table[i].datetime.slice(6, 10));
			if (y > ty){
				arr.push(table[i]);
			} else if (y == ty && m >= tm){
				arr.push(table[i]);
			}
		}

		transForPeriod.push(arr);
	}

	
	let summs = []

	let securitiesForMounth = []
	
	let arrOfTickers = [];
	for (let i = 0; i < allActives.length; i++){
		arrOfTickers.push(allActives[i].ticker);
	}

	let numbresOfTickers = []

	for (let i = 0; i < transForPeriod.length; i++){
		arr = [];
		for (let j = 0; j < arrOfTickers.length; j++){
			let number = 0;
			for (let k = 0; k < transForPeriod[i].length; k++){
				if (arrOfTickers[j] == transForPeriod[i][k].ticker){
					if (transForPeriod[i][k].type == 1){
						number = number + transForPeriod[i][k].number
					} else {
						number = number - transForPeriod[i][k].number
					}	
				}
			}
			arr.push({
				ticker: arrOfTickers[j],
				number: number, 
			})
		}
		numbresOfTickers.push(arr)
	}


	let sum = getPricesWithYahoo(numbresOfTickers, dateForMounthsTrans).then((v) => {
		for (let i = 0; i < v.length; i++){
			let sumr = 0;
			for (let j = 0; j < v[i].length; j++){
				if (v[i][j].price){

					sumr = sumr + v[i][j].price * v[i][j].number;
				}
			}
			summs.push(sumr);
		};

		var lineChart1 = document.getElementById('first-graph').getContext('2d');
		if (myGraph1){
			myGraph1.destroy()
		}
		
		let newSumms = [];

		for (let i = summs.length - 1; i > 0; i--){
			newSumms.push(summs[i])
		}

		let mewmounthAxis = []

		for (let i = mounthAxis.length - 1; i > 0; i--){
			mewmounthAxis.push(mounthAxis[i])
		}

		var gradient = lineChart1.createLinearGradient(20,0, 220,0);

		gradient.addColorStop(0, '#9700cc');
		gradient.addColorStop(0.5 , '#9700cc');
		gradient.addColorStop(1, '#00cae0');

		myGraph1 = new Chart(lineChart1, {
			type: 'line',
			data:{
			    labels: mewmounthAxis,
			    datasets: [
			        {
			        	label: ' ',
			            data: newSumms,
			            backgroundColor: '#9700cc',
			            borderColor: "#101630",
			            borderWidth: 1,
			            borderColor: gradient,
			            tension: 0.2,
			            pointBorderWidth: 0,
			            pointRadius: 4,
			            pointHitRadius: 10

			        }]
			},
			options: {
				//maintainAspectRatio: false,
				layout: {
		            padding: {
		                left: 10,
		                top: 0,
		            }
		        },
		        scales: {
				    x: {
				        grid: {
				        	color: 'rgba(192,192,192,0.1)',
				          	borderColor: 'silver'
				        },
				        ticks: {
				          color: 'silver',
				        }
				    },
				    y: {
				        grid: {
				        	color: 'rgba(192,192,192,0.1)',
				          	borderColor: 'silver'
				        },
				        ticks: {
				          color: 'silver',
				        }
				    }

				  },
				},
				plugins: {
					title: {
						display: false,
						text: 'Стоимость портфеля',
						color: 'silver',
						align: 'left',
						font: {
			                size: 18,
			                family: 'sans-serif',
			                weight: 'bold',
			            },
			            padding: {
		                    top: 10,
		                    bottom:10 ,
		                }

					},
					legend: {  	
						display:false,
					    position: 'right',
					    title: {
					    	color: 'silver',
					    },
					    labels: {
					    	color: 'silver',
				            font: {
				                size: 16,
				                family: 'sans-serif',
				                weight: 'bold',
				            }
				        }
					  },
					
			 
			  animation: {
			    animateRotate: false,
			  }
			}
		});
		return mewmounthAxis;
	}).then((mewmounthAxis) => {
		transForPeriod = [];

		for (let j = 0; j < dateForMounthsTrans.length; j++){

			let y = parseInt(dateForMounthsTrans[j].split(',')[1]);
			let m = parseInt(dateForMounthsTrans[j].split(',')[0]);
			arr = [];
			for (let i = 0; i < table.length; i++){
				let tm = parseInt(table[i].datetime.slice(3, 5));
				let ty = parseInt(table[i].datetime.slice(6, 10));
			
				if (y == ty && m == tm){
					arr.push(table[i]);
				}
			}

			transForPeriod.push(arr);
		}

		for (let j = 0; j < transForPeriod.length; j++){

			summs[j] = summs[j] - summs[j + 1];

			for (let k = 0; k < transForPeriod[j].length; k++){
				let koef = 1;
				if (transForPeriod[j][k].currency == 'USD'){
					koef = usdCourse;
				} else if (transForPeriod[j][k].currency == 'EUR'){
					koef = eurCourse;
				}
				if (transForPeriod[j][k].type == 1){	
					summs[j] = summs[j] - transForPeriod[j][k].price * transForPeriod[j][k].number * koef
				} else {
					summs[j] = summs[j] + transForPeriod[j][k].price * transForPeriod[j][k].number * koef
				}
			}
		}
		


		var lineChart2 = document.getElementById('second-graph').getContext('2d');
		if (myGraph2){
			myGraph2.destroy()
		}
		
		let newSumms2 = [];

		for (let i = summs.length - 1; i > 0; i--){
			newSumms2.push(summs[i])
		}

		myGraph2 = new Chart(lineChart2, {
			type: 'bar',
			data:{
			    labels: mewmounthAxis,
			    datasets: [
			        {
			        	label: ' ',
			            data: newSumms2,
			            backgroundColor: '#9700cc',
			            borderColor: "#101630",


			        }]
			},
			options: {
				//maintainAspectRatio: false,
				layout: {
		            padding: {
		                left: 10,
		                top: 0,
		            }
		        },
		        scales: {
				    x: {
				        grid: {
				        	color: 'rgba(192,192,192,0.1)',
				          	borderColor: 'silver'
				        },
				        ticks: {
				          color: 'silver',
				        }
				    },
				    y: {
				        grid: {
				        	color: 'rgba(192,192,192,0.1)',
				          	borderColor: 'silver'
				        },
				        ticks: {
				          color: 'silver',
				        }
				    }

				  },
				},
				plugins: {
					title: {
						display: false,
						text: 'Стоимость портфеля',
						color: 'silver',
						align: 'left',
						font: {
			                size: 18,
			                family: 'sans-serif',
			                weight: 'bold',
			            },
			            padding: {
		                    top: 10,
		                    bottom:10 ,
		                }

					},
					legend: {  	
						display:false,
					    position: 'right',
					    title: {
					    	color: 'silver',
					    },
					    labels: {
					    	color: 'silver',
				            font: {
				                size: 16,
				                family: 'sans-serif',
				                weight: 'bold',
				            }
				        }
					  },
					
			 
			  animation: {
			    animateRotate: false,
			  }
			}
		});
	})

}



ipc3.on('updP2', (event, message, table) => {
	createTypesDiagramm(message);
	createSecuritiesDiagramm(message);

	let CaS = getSectorsAndCountriesWithYahoo(message);
	CaS.then((v) => {

		createSectorsDiagramm(v);
		createCountresDiagramm(v);
	})

	createSummGraphic(message, table);

});


