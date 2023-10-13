
// function to add usernames entered in game window to the leaderboard
function addUser() {
    const userInput = document.getElementById("user-input");
    const username = userInput.value;

    if (username.trim() === "") {
        alert("Please enter a username.");
        return;
    }

    // Get existing usernames 
    const usernames = JSON.parse(sessionStorage.getItem("usernames")) || [];

    // update username list (add new)
    usernames.unshift(username);

    // maintain 5 users on leaderboard
    if (usernames.length > 5) {
        usernames.pop();
    }

    // use json.stringify to store list of users per current session
    sessionStorage.setItem("usernames", JSON.stringify(usernames));
}

// function to add all users to leaderboard (in order of last entered)
function createLeaderboard() {
    const leaderboard = document.getElementById("score-list");
    const usernames = JSON.parse(sessionStorage.getItem("usernames")) || [];

    leaderboard.innerHTML = "";

    // remove oldest entry of leaderboard and add new one 
    for (let i = 0; i < usernames.length; i++) {
        const listItem = document.createElement("li");
        const markElement = document.createElement("mark");
        markElement.textContent = usernames[i];
        listItem.appendChild(markElement);
        const smallElement = document.createElement("small");
        smallElement.textContent = "0"; // You can set an initial score here
        listItem.appendChild(smallElement);
        leaderboard.appendChild(listItem);
    }
}
// create the leaderboard 
createLeaderboard();
