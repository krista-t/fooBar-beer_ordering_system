// images, search bar

// remove loading screen once data is set - maria
export function loadingScreen() {
  document.querySelector(".loader-box").style.display = "none";
}

// switch user on the navigation - maria
export function switchUser() {
  const button = document.querySelector(".log_in button");

  button.addEventListener("click", activateDropdown);

  function activateDropdown() {
    const boxClicked = document.querySelector(".log_in");
    const extraUser = document.querySelector(".slide_out");

    window.onclick = function (e) {
      if (boxClicked.contains(e.target)) {
        extraUser.classList.add("activated");
      } else {
        console.log("outside");
        extraUser.classList.remove("activated");
      }
    };
  }
}