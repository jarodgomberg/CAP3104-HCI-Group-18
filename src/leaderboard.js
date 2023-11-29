//function to create and populate the leaderboard
function createLeaderboard() {
	const leaderboard = document.getElementById("score-list");

	if (!leaderboard) {
		console.error("Leaderboard element not found.");
		return;
	}

	//get entries from sessionstorage
	const usernames = JSON.parse(sessionStorage.getItem("usernames")) || [];

	console.log("Fetched usernames from sessionStorage:", usernames);

	// Clear existing leaderboard
	leaderboard.innerHTML = "";

	//add entries to leaderboard
	for (let i = 0; i < usernames.length; i++) {
		const listItem = document.createElement("li");
		const markElement = document.createElement("mark");
		markElement.textContent = usernames[i].username; // Update to get username from the data
		listItem.appendChild(markElement);
		const smallElement = document.createElement("small");
		smallElement.textContent = usernames[i].moves; // Update to get moves/score from the data
		listItem.appendChild(smallElement);
		leaderboard.appendChild(listItem);
	}
}

//call function when scores.html page is loaded
window.onload = function () {
	// Check if on the scores.html page
	if (window.location.pathname.includes("scores.html")) {
		//create leaderboard
		createLeaderboard();
	}
};
