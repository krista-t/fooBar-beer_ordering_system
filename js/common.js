// images, search bar

// remove loading screen once data is set
export function loadingScreen() {
	document.querySelector(".loader-box").style.display = "none";
}

// switch user on the navigation
export function switchUser() {
	const button = document.querySelector(".log_in button");

	button.addEventListener("click", activateDropdown);

	function activateDropdown() {
		const boxClicked = document.querySelector(".log_in");
		const extraUser = document.querySelector(".slide_out");
	}
}
