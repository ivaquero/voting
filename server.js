const votes = {};

const socket = new WebSocket("ws://localhost:8080"); // Adjust the URL as necessary

socket.onmessage = (event) => {
	const data = JSON.parse(event.data);
	if (!votes[data.option]) {
		votes[data.option] = 0;
	}
	votes[data.option]++;
	updateVoteDisplay(data.option);
};

function addOption(event) {
	event.preventDefault(); // Prevent the default form submission
	const newOption = document.getElementById("new-option").value.trim();
	if (newOption && !votes[newOption]) {
		votes[newOption] = 0; // Initialize the vote count for the new option
		const optionDiv = document.createElement("div");
		optionDiv.className = "option";
		optionDiv.innerHTML = `
            <span>${newOption}</span>
            <button onclick="vote('${newOption}')">Vote</button>
            <span id="${newOption}-count">0</span>
        `;
		document.getElementById("options").appendChild(optionDiv);
		document.getElementById("new-option").value = ""; // Clear the input field
	}
}

function vote(option) {
	votes[option]++;
	updateVoteDisplay(option);
	socket.send(JSON.stringify({ option: option }));
}

function updateVoteDisplay(option) {
	document.getElementById(`${option}-count`).innerText = votes[option];
}
