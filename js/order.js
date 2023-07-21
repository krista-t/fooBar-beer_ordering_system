("use strict");

import "../sass/customer.scss";
import { loadingScreen, switchUser } from "./common.js";
import { addToBasket, removeFromBasket, postOrder } from "./basket";
import "./dark_mode.js";

// load on start
window.addEventListener("DOMContentLoaded", fetchData);

// fetch data from api
async function fetchData() {
	const beertypes =
		"https://foo-bar-beer-ordering-system-55098f197131.herokuapp.com/beertypes";
	const response = await fetch(beertypes);
	const data = await response.json();

	redirectData(data);
}

// handle what's required on load
function redirectData(beers) {
	beers.forEach(eachBeerCard);
	groupFilters(beers);
	filterClicked(beers);
	checkoutButton();
	searchCorrectBeers(beers);
}

// array of all beertypes
function groupFilters(allBeers) {
	let filterArr = [];
	let result;
	for (let i = 0; i < allBeers.length; i++) {
		result = filterArr.push("all", allBeers[i].category);
	}
	cleanFilters(filterArr);
}

// clean array from repetitive categories
function cleanFilters(categories) {
	function isUnique(a, b) {
		return categories.indexOf(a) == b;
	}
	const cleanRepetitiveFilters = categories.filter(isUnique);

	appendFilters(cleanRepetitiveFilters);
}

// create and append filters to dom
function appendFilters(filters) {
	filters.forEach((f) => {
		const filterOption = document.createElement("button");
		filterOption.setAttribute("class", "filter");
		filterOption.textContent = f;
		document.querySelector(".filters").appendChild(filterOption);
	});
	let allButton = document.querySelector(".filters").firstElementChild;
	allButton.setAttribute("class", "filter active_filter");
}

// filters in action
function filterClicked(allBeers) {
	const filterBtns = document.querySelectorAll(".filter");
	filterBtns.forEach((btn) =>
		btn.addEventListener("click", function (e) {
			sortItems(allBeers, e);
		})
	);
}

function sortItems(allBeers, e) {
	const filteredBeers = allBeers.filter(isBeertype);

	function isBeertype(beer) {
		if (e.target.textContent === beer.category || e.target.textContent === "all") {
			return true;
		} else {
			return false;
		}
	}

	// change active button upon click
	const activeFilter = document.querySelector(".active_filter");
	if (activeFilter !== null) {
		activeFilter.classList.remove("active_filter");
	}
	e.target.classList.add("active_filter");

	return rebuildList(filteredBeers);
}

// rebuild beer list options upon clicked filter
function rebuildList(newList) {
	document.querySelector(".beers").innerHTML = "";
	newList.forEach(eachBeerCard);
}

// insert data into the DOM
export function eachBeerCard(beer) {
	// create a box for each beer, with a class named card
	const beerCard = document.createElement("div");
	beerCard.setAttribute("class", "card");

	// create and insert the api data into the right elements
	const topLayer = document.createElement("div");
	topLayer.setAttribute("class", "top_layer");
	const topfirstLayer = document.createElement("div");
	topfirstLayer.setAttribute("class", "first_layer");
	const topSecondLayer = document.createElement("div");
	topSecondLayer.setAttribute("class", "second_layer");
	const beerName = document.createElement("h2");
	beerName.textContent = beer.name;
	const beerImage = document.createElement("img");
	beerImage.src = beer.label;
	beerImage.setAttribute("alt", beerName.textContent);

	const middleLayer = document.createElement("div");
	middleLayer.setAttribute("class", "middle_layer");
	const price = document.createElement("p");
	price.textContent = "DKK " + Math.floor(beer.alc * 10);
	const beerType = document.createElement("h3");
	beerType.textContent = beer.category;

	const bottomLayer = document.createElement("div");
	bottomLayer.setAttribute("class", "bottom_layer");
	const readMore = document.createElement("button");
	readMore.setAttribute("class", "read_more");
	readMore.textContent = "read more";
	readMore.addEventListener("click", () => {
		openDetailedModal(beer);
	});
	const clone = document.querySelector("#counter").content.cloneNode(true);
	clone.querySelector(".counter");
	const alcoholPercentage = document.createElement("h4");
	alcoholPercentage.textContent = beer.alc + " %";

	topLayer.append(topfirstLayer);
	topfirstLayer.append(beerImage, topSecondLayer);
	topSecondLayer.append(beerName, beerType, middleLayer);
	middleLayer.append(alcoholPercentage, price);
	bottomLayer.append(readMore, clone);

	beerCard.append(topLayer, bottomLayer);

	document.querySelector(".beers").appendChild(beerCard);

	//add&remove order and send to basket,
	const beerPlus = document.querySelectorAll(".plus");
	beerPlus.forEach((count) => {
		count.addEventListener("click", addToBasket);
	});
	const beerMinus = document.querySelectorAll(".minus");
	beerMinus.forEach((count) => {
		count.addEventListener("click", removeFromBasket);
	});

	functionalityExtras();
}

// modal with details for each beer
function openDetailedModal(beer) {
	const clone = document.querySelector("#b_modal").content.cloneNode(true);

	const beerImage = clone.querySelector(".modal_inner_readmore img");
	beerImage.src = beer.label;
	const beerName = clone.querySelector(".modal_inner_readmore h2");
	beerName.textContent = beer.name;
	const beerType = clone.querySelector(".modal_inner_readmore h3");
	beerType.textContent = beer.category;
	const beerDescription = clone.querySelector(".desc p");
	beerDescription.textContent = beer.description.flavor;
	const beerTaste = clone.querySelector(".headline p");
	beerTaste.textContent = beer.description.appearance;

	document.querySelector("#products").appendChild(clone);

	const modal = document.querySelector("#beer_modal");
	modal.style.display = "block";
	const body = document.querySelector("body");
	const modalContainer = document.querySelector("#beer_modal .modal_container");
	body.style.overflow = "hidden";
	window.onclick = function (e) {
		if (e.target == modalContainer) {
			body.style.overflow = "auto";
			modal.remove();
		}
	};
	const closeBtn = document.querySelector(".close");
	closeBtn.addEventListener("click", () => {
		body.style.overflow = "auto";
		modal.remove();
	});
}

// checkout modal creation
function checkoutButton() {
	const buttonClicked = document.querySelectorAll(".checkout");
	buttonClicked.forEach((btn) => btn.addEventListener("click", displayCheckout));
}

function displayCheckout() {
	const clone = document.querySelector("#checkout").content.cloneNode(true);

	const modalCheckout = document.querySelector("#order_modal");
	modalCheckout.style.display = "block";

	document.querySelector(".form-container").appendChild(clone);

	const body = document.querySelector("body");
	body.style.overflow = "hidden";

	// change active button
	const activeBtn = document.querySelector(".active");
	if (activeBtn !== null) {
		activeBtn.classList.remove("active");
	}
	document.querySelector(".checkout").classList.add("active");

	//post beers on submit
	document.querySelector("form").addEventListener("submit", postOrder);

	// credit card
	creditCardSpacing();
	phoneNumberCountries();

	// payment method switch or closing checkout modal
	switchPaymentMethod();
	closeCheckout(modalCheckout);
}

// close checkout page
function closeCheckout(modalCheckout) {
	const returnBtn = document.querySelector(".return");
	returnBtn.addEventListener("click", returnToProducts);

	function returnToProducts() {
		modalCheckout.style.display = "none";
		document.querySelector("body").style.overflow = "auto";
		document.querySelector(".form-container").innerHTML = "";
		//clear input values in products list, remove beercart activity
		document.querySelectorAll(".count").forEach((input) => {
			input.value = "0";
		});
		document.querySelector(".checkout_beer").classList.remove("shake");
		document.querySelector(".amount_beers").classList.add("hide");

		// change active button back
		const activeBtn = document.querySelector(".active");
		if (activeBtn !== null) {
			activeBtn.classList.remove("active");
		}
		document.querySelector(".products").classList.add("active");
	}
}

function functionalityExtras() {
	loadingScreen();
	switchUser();
}

// search bar
function searchCorrectBeers(beers) {
	const searchBar = document.getElementById("search-bar");

	searchBar.addEventListener("keyup", (e) => {
		const writtenKeyword = e.target.value.toLowerCase();

		function isBeer(beer) {
			return beer.name.toLowerCase().includes(writtenKeyword);
		}

		const searchedList = beers.filter(isBeer);
		return rebuildList(searchedList);
	});
}

// form - credit card automatic spacing
function creditCardSpacing() {
	const creditCardInput = document.querySelector("#creditcard");

	creditCardInput.addEventListener("input", function (e) {
		e.target.value = e.target.value
			.replace(/[^\dA-Z]/g, "")
			.replace(/(.{4})/g, "$1 ")
			.trim();
	});
}

// form - phone number
function phoneNumberCountries() {
	const phoneInputField = document.querySelector("#pnumber");

	const phoneInput = window.intlTelInput(phoneInputField, {
		preferredCountries: ["dk", "no", "pt", "de"],
	});

	phoneInputField.addEventListener("input", function (e) {
		e.target.value = e.target.value
			.replace(/[^\dA-Z]/g, "")
			.replace(/(.{2})/g, "$1 ")
			.trim();
	});
}

// switch payments method
function switchPaymentMethod() {
	const paymentButtons = document.querySelectorAll(".payment_options button");

	paymentButtons.forEach((btn) => {
		btn.addEventListener("click", switchMethod);
	});

	function switchMethod(e) {
		const creditCard = document.querySelector(".credit_card");
		const mobilePay = document.querySelector(".mobilepay");
		const formContainer = document.querySelector("form");
		if (e.target === creditCard) {
			mobilePay.classList.remove("active_filter");
			creditCard.classList.add("active_filter");
			formContainer.style.display = "block";
			document.querySelector(".official_mobilepay").remove();
		} else if (e.target === mobilePay) {
			creditCard.classList.remove("active_filter");
			mobilePay.classList.add("active_filter");
			formContainer.style.display = "none";
			mobilePayPayment();
		} else {
			return false;
		}
	}
}

function mobilePayPayment() {
	const mobilePayButton = document.createElement("button");
	mobilePayButton.setAttribute("class", "official_mobilepay");

	const image = document.createElement("img");
	image.src = "./mobilepay.jpg";
	const p = document.createElement("p");
	p.textContent = "Pay with MobilePay";

	mobilePayButton.append(image, p);

	document.querySelector(".form").appendChild(mobilePayButton);
}
