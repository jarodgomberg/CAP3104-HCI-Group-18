//function to create and populate the leaderboard
function createLeaderboard() {
	const easyLeaderboard = document.getElementById("score-list");
	const mediumLeaderboard = document.getElementById("medium-list");
	const hardLeaderboard = document.getElementById("hard-list");

	if (!easyLeaderboard) {
		console.error("Leaderboard element not found.");
		return;
	}

	//get entries from sessionstorage
	const usernames = JSON.parse(sessionStorage.getItem("usernames")) || [];

	console.log("Fetched usernames from sessionStorage:", usernames);

	// Clear existing leaderboard
	easyLeaderboard.innerHTML = "";
	mediumLeaderboard.innerHTML = "";
	hardLeaderboard.innerHTML = "";

	//add entries to specific leaderboard depending on difficulty
	for (let i = 0; i < usernames.length; i++) {
		var user = usernames[i];
		var listItem = document.createElement("li");
		var markElement = document.createElement("mark");
		markElement.textContent = usernames[i].username;
		listItem.appendChild(markElement);
		var smallElement = document.createElement("small");
		smallElement.textContent = usernames[i].moves;
		listItem.appendChild(smallElement);
		console.log(user.difficulty);

		if (user.difficulty == 10) {
			easyLeaderboard.appendChild(listItem);
			console.log("added to easy");
		}
		if (user.difficulty == 15) {
			mediumLeaderboard.appendChild(listItem);
			console.log("added to medium");
		}
		if (user.difficulty == 25) {
			hardLeaderboard.appendChild(listItem);
		}
	}
}

const easyButton = document.getElementById("easy-button");
const medButton = document.getElementById("medium-button");
const hardButton = document.getElementById("hard-button");
const scoreTitle = document.getElementById("score-title");

easyButton.addEventListener("click", function () {
	document.getElementById("medium-list").style.display = "none";
	document.getElementById("score-list").style.display = "";
	document.getElementById("hard-list").style.display = "none";
	scoreTitle.textContent = "Easy Scores";
	document.getElementById("easy-button").style.background =
		"rgba(255, 255, 255, 0.2)";
	document.getElementById("medium-button").style.background = "";
	document.getElementById("hard-button").style.background = "";
});

medButton.addEventListener("click", function () {
	document.getElementById("medium-list").style.display = "";
	document.getElementById("score-list").style.display = "none";
	document.getElementById("hard-list").style.display = "none";
	scoreTitle.textContent = "Medium Scores";
	document.getElementById("medium-button").style.background =
		"rgba(255, 255, 255, 0.2)";
	document.getElementById("easy-button").style.background = "";
	document.getElementById("hard-button").style.background = "";
});

hardButton.addEventListener("click", function () {
	document.getElementById("medium-list").style.display = "none";
	document.getElementById("score-list").style.display = "none";
	document.getElementById("hard-list").style.display = "";
	scoreTitle.textContent = "Hard Scores";
	document.getElementById("hard-button").style.background =
		"rgba(255, 255, 255, 0.2)";
	document.getElementById("medium-button").style.background = "";
	document.getElementById("easy-button").style.background = "";
});

//call function when scores.html page is loaded
window.onload = function () {
	// Check if on the scores.html page
	if (window.location.pathname.includes("scores.html")) {
		//create leaderboard & default display easy scores
		easyButton.click();
		createLeaderboard();
	}
};
