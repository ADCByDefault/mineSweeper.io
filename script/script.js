const boardSizeInput = document.getElementById("boardSize");
const mineCountInput = document.getElementById("mineCount");
const button = document.getElementById("vai");
const errore = document.getElementById("error");
const board = document.getElementById("board");

var boardSize = "";
var mineCount = "";
var minePositions = [];
let sconfitta = false;
let vittoria = false;
let vuoti;

button.addEventListener("click", inizioPartita);

function inizioPartita() {
	boardSize = boardSizeInput.value;
	mineCount = mineCountInput.value;

	if (boardSize < 7 || boardSize > 20 || mineCount < 5 || mineCount > 15) {
		errore.style.display = "block";
	} else {
		errore.style.display = "none";
		pulisciCampo();
		generaCampo();
	}
}

function pulisciCampo() {
	board.innerHTML = "";
	minePositions = [];
	sconfitta = false;
	vittoria = false;
	vuoti = boardSize * boardSize - mineCount;
}

function generaCampo() {
	let rows = "";
	let cella = "";

	for (let row = 1; row <= boardSize; row++) {
		rows = document.createElement("div");
		rows.classList.add("row");
		for (let col = 1; col <= boardSize; col++) {
			cella = document.createElement("div");
			cella.classList.add("cella", "nascosto");
			cella.setAttribute("id", `${row}-${col}`);
			cella.setAttribute("data-nearmines", 0);
			rows.append(cella);
			cella.addEventListener("click", (e) => {
				clickCella(e.target);
			});
		}
		board.append(rows);
	}
	placeMines();
}

function placeMines() {
	let temp;
	let temp2;
	let posCella;
	for (let index = 0; index < mineCount; index++) {
		temp = Math.floor(Math.random() * (boardSize - 1)) + 1;
		temp2 = Math.floor(Math.random() * (boardSize - 1)) + 1;
		posCella = `${temp}-${temp2}`;
		if (minePositions.includes(posCella)) {
			index--;
		} else {
			minePositions.push(`${posCella}`);
			setMine(posCella);
			setNumbers(temp, temp2);
		}
	}
}

function setMine(pos) {
	let cella = document.getElementById(pos);
	cella.classList.add("mine");
	cella.setAttribute("data-nearmines", 0);
	cella.innerText = "";
}

function setNumbers(temp, temp2) {
	setNumber(temp - 1, temp2 - 1);
	setNumber(temp - 1, temp2);
	setNumber(temp - 1, temp2 + 1);
	setNumber(temp, temp2 - 1);
	setNumber(temp, temp2 + 1);
	setNumber(temp + 1, temp2 - 1);
	setNumber(temp + 1, temp2);
	setNumber(temp + 1, temp2 + 1);
}

function setNumber(temp, temp2) {
	if (temp > 0 && temp <= boardSize && temp2 > 0 && temp2 <= boardSize) {
		let tempcella = document.getElementById(`${temp}-${temp2}`);
		if (!tempcella.classList.contains("mine")) {
			let nearmines = tempcella.getAttribute("data-nearmines");
			parseInt(nearmines);
			nearmines++;
			tempcella.setAttribute("data-nearmines", nearmines);
		}
	} else {
		return;
	}
}

function clickCella(cella) {
	if (sconfitta || vittoria) {
		return;
	}
	if (cella.classList.contains("mine")) {
		gameOver();
		return;
	}
	if (cella.getAttribute("data-nearmines") != 0) {
		cella.innerText = cella.getAttribute("data-nearmines");
		cella.classList.remove("nascosto");
		cella.classList.add("visibile");
		vuoti--;
	}
	if (cella.getAttribute("data-nearmines") == 0) {
		cella.classList.remove("nascosto");
		cella.classList.add("visibile");
		vuoti--;
		let coords = [];
		let temp;
		temp = cella.getAttribute("id");
		coords = temp.split("-");
		clickVuoto(coords[0], coords[1]);
	}
	checkVittoria();
}

function gameOver() {
	rivelaBombe();
	sconfitta = true;
	alert("Hai perso. Riprova");
}

function rivelaBombe() {
	for (let index = 0; index < minePositions.length; index++) {
		let cella = document.getElementById(minePositions[index]);
		cella.innerText = "💣";
		cella.classList.remove("nascosto");
		cella.classList.add("visibile");
	}
}

function clickVuoto(temp, temp2) {
	temp = parseInt(temp);
	temp2 = parseInt(temp2);
	console.log(document.getElementById(`${temp}-${temp2}`));
	let cella;
	if (temp - 1 > 0 && temp2 - 1 > 0) {
		cella = document.getElementById(`${temp - 1}-${temp2 - 1}`);
		if (cella.classList.contains("nascosto")) {
			clickCella(cella);
		}
		if (vittoria || sconfitta) {
			return;
		}
	}
	if (temp - 1 > 0) {
		cella = document.getElementById(`${temp - 1}-${temp2}`);
		if (cella.classList.contains("nascosto")) {
			clickCella(cella);
		}
		if (vittoria || sconfitta) {
			return;
		}
	}
	if (temp - 1 > 0 && temp2 + 1 <= boardSize) {
		cella = document.getElementById(`${temp - 1}-${temp2 + 1}`);
		if (cella.classList.contains("nascosto")) {
			clickCella(cella);
		}
		if (vittoria || sconfitta) {
			return;
		}
	}
	if (temp2 - 1 > 0) {
		cella = document.getElementById(`${temp}-${temp2 - 1}`);
		if (cella.classList.contains("nascosto")) {
			clickCella(cella);
		}
		if (vittoria || sconfitta) {
			return;
		}
	}
	if (temp2 + 1 <= boardSize) {
		cella = document.getElementById(`${temp}-${temp2 + 1}`);
		if (cella.classList.contains("nascosto")) {
			clickCella(cella);
		}
		if (vittoria || sconfitta) {
			return;
		}
	}
	if (temp + 1 <= boardSize && temp2 - 1 > 0) {
		cella = document.getElementById(`${temp + 1}-${temp2 - 1}`);
		if (cella.classList.contains("nascosto")) {
			clickCella(cella);
		}
		if (vittoria || sconfitta) {
			return;
		}
	}
	if (temp + 1 <= boardSize) {
		cella = document.getElementById(`${temp + 1}-${temp2}`);
		if (cella.classList.contains("nascosto")) {
			clickCella(cella);
		}
		if (vittoria || sconfitta) {
			return;
		}
	}
	if (temp + 1 <= boardSize && temp2 + 1 <= boardSize) {
		cella = document.getElementById(`${temp + 1}-${temp2 + 1}`);
		if (cella.classList.contains("nascosto")) {
			clickCella(cella);
		}
		if (vittoria || sconfitta) {
			return;
		}
	}
	return;
}

function checkVittoria() {
	if (vuoti <= 0) {
		rivelaBombe();
		vittoria = true;
		alert("Hai vinto. Congratulazioni");
		return;
	}
}
