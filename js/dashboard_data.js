window.addEventListener("DOMContentLoaded", startLiveUpdate);

import { loadingScreen, switchUser } from "./common.js";
import { currentTime, nameId, maxAmount } from "./utils.js";
import { chart } from "./chart.js";

import { automaticDarkMode } from "./dark_mode.js";

//fetch data every 3sec
function startLiveUpdate() {
	setInterval(async () => {
		const response = await fetch(
			"https://foo-bar-beer-ordering-system-55098f197131.herokuapp.com/"
		);
		const jsonData = await response.json();
		prepareData(jsonData);
	}, 3000);
}

//prepare data and call all the functions from here
function prepareData(dashboardData) {
	//clear cards
	document.querySelector(".serving-box").innerHTML = "";
	document.querySelector(".order-box").innerHTML = "";
	//clear chart canvas
	chart.data.labels = [];
	let maxBeers = maxAmount(dashboardData.storage);
	const beerArr = chart.data.datasets[0].data.length;
	if (beerArr > 100) {
		console.log("update beer data");
		chart.data.datasets[0].data = [];
	}

	isLowOnStock(dashboardData.storage);
	dashboardData.storage.forEach((beer) => {
		const label = beer.name;
		//calculate reverse, so lowers is highest nr
		const data = maxBeers / beer.amount;
		addData(chart, label, data);
	});
	dashboardData.serving.forEach((serving) => {
		displayUpcomingServings(serving);
	});

	dashboardData.queue.forEach((order) => {
		displayUpcomingOrders(order);
	});

	const queue = dashboardData.queue;
	showQueueLength(queue);

	const time = dashboardData.timestamp;
	showCurrentTime(time);
}

//update chart data
function addData(chart, label, data) {
	chart.data.labels.push(label);
	chart.data.datasets.forEach((dataset) => {
		dataset.data.push(data);
	});
	chart.update();
}

// queue size and bar
function showQueueLength(q) {
	const queueNumber = document.querySelector(".queue-number span");
	queueNumber.textContent = q.length;

	const bar = document.querySelector(".inner_bar");
	bar.style.width = q.length + "0px";
}

// showint timestamp as time
function showCurrentTime(time) {
	document.querySelector(".time p").textContent = currentTime(time);
}

//populate template create missing elements and display servings
function displayUpcomingServings(serving) {
	//this is data for serving list
	const servingId = serving.id;
	const servingTime = serving.startTime;
	const beerServing = serving.order;

	//clone template
	const template = document.querySelector("#templ-serving").content;
	const copy = template.cloneNode(true);
	//update elements with data
	const orderId = copy.querySelector(".serving-id");
	orderId.textContent = `Order Nr - ${servingId}`;
	const time = copy.querySelector(".serving-time");
	time.textContent = currentTime(servingTime);
	const tableNr = copy.querySelector(".table .number");
	const lastDigit = serving.id.toString().slice(-1);
	tableNr.textContent = Number(lastDigit) + 1;

	//create beer list
	const beerUl = document.createElement("ul");
	beerUl.setAttribute("class", "beer");
	copy.querySelector(".beer-type").appendChild(beerUl);

	//count beer name and display it as a number
	let count = 1;
	for (let i = 0; i < beerServing.length; i++) {
		if (beerServing[i] !== beerServing[i + 1]) {
			// console.log(beerServing[i + 1]);
			let beerNameValue = `${beerServing[i]}`;
			let beerCount = `${count}`;
			if (beerNameValue === undefined) {
				console.log("beer is pouring");
			} else {
				//create beer list
				const beerNamesLi = document.createElement("li");
				//create span tag to fit in list
				const liSpan = document.createElement("h2");
				//create img element
				const img = document.createElement("img");
				img.setAttribute("class", "beers");
				//uses  fixname function to pass in specific val as param
				img.src = nameId(beerServing[i].toLowerCase()) + ".png";
				//this div now displays number of beers ordered-maria
				const imageBox = document.createElement("div");
				imageBox.setAttribute("class", "image_box");
				const beerInfo = document.createElement("div");
				beerInfo.setAttribute("class", "beer_info");
				const beerAmount = document.createElement("span");
				beerAmount.setAttribute("class", "amount");
				beerAmount.innerHTML = `${beerCount}X`;
				imageBox.append(img);
				imageBox.append(beerAmount);
				liSpan.textContent = `${beerNameValue}`;
				// add categories to beers
				const beerType = document.createElement("h3");
				if (
					beerNameValue === "Fairy Tale Ale" ||
					beerNameValue === "GitHop" ||
					beerNameValue === "Hoppile Ever After"
				) {
					beerType.textContent = "IPA";
				} else if (beerNameValue === "El Hefe") {
					beerType.textContent = "Hefewizen";
				} else if (beerNameValue === "Hollaback Lager") {
					beerType.textContent = "Oktoberfest";
				} else if (beerNameValue === "Mowintime") {
					beerType.textContent = "European Lager";
				} else if (beerNameValue === "Row 26") {
					beerType.textContent = "Stout";
				} else if (
					beerNameValue === "Ruined Childhood" ||
					beerNameValue === "Sleighride"
				) {
					beerType.textContent = "Belgian Specialty Ale";
				} else if (beerNameValue === "Steampunk") {
					beerType.textContent = "California Common";
				} else {
					return false;
				}
				beerInfo.append(liSpan);
				beerInfo.append(beerType);
				beerNamesLi.append(imageBox);
				beerNamesLi.append(beerInfo);
				beerUl.append(beerNamesLi);
			}
		} else {
			count++;
		}
	}

	document.querySelector(".serving-box").appendChild(copy);

	functionalExtras();
	automaticDarkMode();
}

function displayUpcomingOrders(order) {
	let orderId = order.id;
	let orderTime = order.startTime;
	let beerOrder = order.order;
	//clone template
	const template = document.querySelector("#templ-orders").content;
	const copy = template.cloneNode(true);
	//update elements with data
	const orderNrId = copy.querySelector(".order-id");
	orderNrId.textContent = `Order Nr: ${orderId}`;
	const time = copy.querySelector(".order-time");
	time.textContent = currentTime(orderTime);
	const tableNr = copy.querySelector(".table .number");
	const lastDigit = order.id.toString().slice(-1);
	tableNr.textContent = Number(lastDigit) + 1;
	// create list
	const beerUl = document.createElement("ul");
	beerUl.setAttribute("class", "beer");
	copy.querySelector(".beer-type").appendChild(beerUl);
	//count beer name and display it as a number
	let count = 1;
	for (let i = 0; i < beerOrder.length; i++) {
		if (beerOrder[i] !== beerOrder[i + 1]) {
			let beerNameValue = `${beerOrder[i]}`;
			let beerCount = `${count}`;
			if (beerNameValue === undefined) {
				console.log("waiting for orders");
			} else {
				//create beer list
				const beerNamesLi = document.createElement("li");
				//create span tag to fit in list
				const liSpan = document.createElement("h2");
				//create img element
				const img = document.createElement("img");
				img.setAttribute("class", "beers");
				img.src = nameId(beerOrder[i].toLowerCase()) + ".png";
				//this div now displays number of beers ordered
				const imageBox = document.createElement("div");
				imageBox.setAttribute("class", "image_box");
				const beerInfo = document.createElement("div");
				beerInfo.setAttribute("class", "beer_info");
				const beerAmount = document.createElement("span");
				beerAmount.setAttribute("class", "amount");
				beerAmount.innerHTML = `${beerCount}X`;
				imageBox.append(img);
				imageBox.append(beerAmount);
				liSpan.textContent = `${beerNameValue}`;
				// add categories to beers
				const beerType = document.createElement("h3");
				if (
					beerNameValue === "Fairy Tale Ale" ||
					beerNameValue === "GitHop" ||
					beerNameValue === "Hoppile Ever After"
				) {
					beerType.textContent = "IPA";
				} else if (beerNameValue === "El Hefe") {
					beerType.textContent = "Hefewizen";
				} else if (beerNameValue === "Hollaback Lager") {
					beerType.textContent = "Oktoberfest";
				} else if (beerNameValue === "Mowintime") {
					beerType.textContent = "European Lager";
				} else if (beerNameValue === "Row 26") {
					beerType.textContent = "Stout";
				} else if (
					beerNameValue === "Ruined Childhood" ||
					beerNameValue === "Sleighride"
				) {
					beerType.textContent = "Belgian Specialty Ale";
				} else if (beerNameValue === "Steampunk") {
					beerType.textContent = "California Common";
				} else {
					return false;
				}
				beerInfo.append(liSpan);
				beerInfo.append(beerType);
				beerNamesLi.append(imageBox);
				beerNamesLi.append(beerInfo);
				beerUl.append(beerNamesLi);
			}
		} else {
			count++;
		}
	}
	document.querySelector(".order-box").appendChild(copy);
}

// if stock is almost empty, insert reminder
function isLowOnStock(stock) {
	const lowOnStock = document.querySelector(".low_stock");
	lowOnStock.innerHTML = "";

	stock.forEach((beer) => {
		if (beer.amount < 2) {
			const beerElement = document.createElement("p");
			beerElement.textContent = beer.name + " is low on stock.";
			beerElement.classList.add("warning");
			document.querySelector(".low_stock").appendChild(beerElement);
		}
	});
}

function functionalExtras() {
	loadingScreen();
	switchUser();
}
