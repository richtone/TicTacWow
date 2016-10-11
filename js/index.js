var states = ["START", "RETURN", "RESTART", "CONTINUE"];
var state = 0; // 0 start/reseted, 1 choose player, 2 started, 2 continue
var field = [
	["", "", ""],
	["", "", ""],
	["", "", ""]
];
var my, comp, steamRoller, weights = [];
var myWins = 0;
var compWins = 0;
var diffs = ["easy", "medium", "hard"];
var diff = 1;
var char1 = "W";
var char2 = "O";
var modes = ["1 vs Doge", "1 vs 1"];
var mode = 0;
var turn = "my";

function pvp() {
	countWeights();
	if (gameEval() > 0) return;
	//switchPlayers();
}

function doge() {
	var a, b, i, j, k, tempField;
	countWeights();
	console.log(diff, field, weights);
	if (gameEval() > 0) return; // vyhodnotiť stav pred comp ťahom

	// -- Herný postup --
	switch (diff) {
		case 0:
			easy();
			break;
		case 1:
			medium();
			break;
		case 2:
			hard();
			break;
	}

	countWeights();
	gameEval(); // vyhodnotiť stav po comp ťahu

}

function easy() {
	var a, b, i, j, k, tempField;

	if (weights.indexOf(-2) > -1) { // ak sú niekde 2 počítačove v čiare
		thirdInRow(weights.indexOf(-2));
	} else if (weights.indexOf(2) > -1) { // ak sú niekde 2 hráčove v čiare
		thirdInRow(weights.indexOf(2));
	} else {
		tempField = [];
		for (i = 0; i < 3; i++) {
			for (j = 0; j < 3; j++) {
				if (field[i][j] === "") tempField.push([i, j]); // vyrobíme pole z prázdnych políčok
			}
		}
		k = Math.floor(Math.random() * tempField.length); // vyberieme náhodný prvok pola
		a = tempField[k][0];
		b = tempField[k][1];
		field[a][b] = comp;
		$("#" + a + b).html(comp);
	}
}


function medium() {
	var a, b, i, j, k, tempField;

	if (field[1][1] === "") { // ak je stred prázdny
		field[1][1] = comp;
		$("#11").html(comp);
	} else if (weights.indexOf(-2) > -1) { // ak sú niekde 2 počítačove v čiare
		thirdInRow(weights.indexOf(-2));
	} else if (weights.indexOf(2) > -1) { // ak sú niekde 2 hráčove v čiare
		thirdInRow(weights.indexOf(2));
	} else {
		tempField = [];
		for (i = 0; i < 3; i++) {
			for (j = 0; j < 3; j++) {
				if (field[i][j] === "") tempField.push([i, j]); // vyrobíme pole z prázdnych políčok
			}
		}
		k = Math.floor(Math.random() * tempField.length); // vyberieme náhodný prvok pola
		a = tempField[k][0];
		b = tempField[k][1];
		field[a][b] = comp;
		$("#" + a + b).html(comp);
	}
}


function hard() {
	var a, b, i, j, k, tempField;

	if (weights.indexOf(-2) > -1) { // ak sú niekde 2 počítačove v čiare
		thirdInRow(weights.indexOf(-2));
	} else if (weights.indexOf(2) > -1) { // ak sú niekde 2 hráčove v čiare
		thirdInRow(weights.indexOf(2));
	} else if (field[1][1] === "") { // ak je stred prázdny
		field[1][1] = comp;
		$("#11").html(comp);
	} else if (field[0][0] == "" || field[0][2] == "" || field[2][0] == "" || field[2][2] == "") {

		do {
			if (Math.random() < 0.5) a = 0;
			else a = 2;
			if (Math.random() < 0.5) b = 0;
			else b = 2;
			console.log(a, b);
		} while (field[a][b] !== "")

		field[a][b] = comp;
		$("#" + a + b).html(comp);
	} else {
		tempField = [];
		for (i = 0; i < 3; i++) {
			for (j = 0; j < 3; j++) {
				if (field[i][j] === "") tempField.push([i, j]); // vyrobíme pole z prázdnych políčok
			}
		}
		k = Math.floor(Math.random() * tempField.length); // vyberieme náhodný prvok pola
		a = tempField[k][0];
		b = tempField[k][1];
		field[a][b] = comp;
		$("#" + a + b).html(comp);
	}
}

function gameEval() { // vyhodnotiť stav hry
	var resultTextTie, resultTextWin, resultTextLose;

	if (mode === 0) {
		resultTextTie = "Many tie";
		resultTextWin = "Much win. Doge sad. Next time!";
		resultTextLose = "Very lose! Doge win, wow!";
	} else {
		resultTextTie = "Many tie";
		resultTextWin = "Wow. Player 1 very win!";
		resultTextLose = "Wow. Player 2 much win!";
	}

	try {
		if (weights.indexOf(3) > -1) { // ak hráč spojí 3
			$("#result").html(resultTextWin);
			$("#myScore").html(++myWins);
			gameOver();
			return 1;
		} else if (weights.indexOf(-3) > -1) { // ak počítač vyhrá
			$("#result").html(resultTextLose);
			$("#compScore").html(++compWins);
			gameOver();
			return 2;
		} else if (!steamRoller.includes("")) { // ak je hracie pole plné
			$("#result").html(resultTextTie);
			gameOver();
			return 3;
		} else {
			return 0;
		}
	} catch (e) {
		$("#result").html(e);
	}
}


function gameOver() {
	state = 3;
	$("#2").html(states[state]);
	$(".result").removeClass("hidden");
}


function steamRoll() {
	return field.reduce(function(a, b) { // jednorozmerné pole field
		return a.concat(b);
	}, []);
}


function thirdInRow(i) { // funkcia na zabránenie 3 znaku v čiare
	try {
		var fieldT = field[0].map(function(col, i) { // transponované pole pre lenivcov
			return field.map(function(row) {
				return row[i];
			});
		});

		if (i < 3) { // riadky

			k = field[i].indexOf(""); // index prázdneho políčka
			field[i][k] = comp;
			$("#" + i + k).html(comp);

		} else if (i < 6) { // stĺpce

			k = fieldT[i - 3].indexOf(""); // index prázdneho políčka
			field[k][i - 3] = comp;
			$("#" + k + (i - 3)).html(comp);

		} else if (i == 6) { // diagonála "\"

			for (a = 0, b = 0; a < 3; a++, b++) {
				if (field[a][b] === "") {
					field[a][b] = comp;
					$("#" + a + b).html(comp);
				}
			}
		} else { // diagonála "/"
			for (a = 0, b = 2; a < 3; a++, b--) {
				if (field[a][b] === "") {
					field[a][b] = comp;
					$("#" + a + b).html(comp);
				}
			}
		}
	} catch (e) {
		$("#result").html(e);
	}

}


function countWeights() { // funkcia na vyhodnotneie hracieho pola
	try {
		var i, j;
		weights = [0, 0, 0, 0, 0, 0, 0, 0];

		for (i = 0; i < 3; i++) {
			for (j = 0; j < 3; j++) {
				field[i][j] = $("#" + i + j).html();
			}
		}

		for (i = 0; i < 3; i++) { // riadky
			for (j = 0; j < 3; j++) {
				if (field[i][j] == my) weights[i]++;
				if (field[i][j] == comp) weights[i]--;
			}
		}

		for (i = 0; i < 3; i++) { // stĺpce
			for (j = 0; j < 3; j++) {
				if (field[j][i] == my) weights[i + 3]++;
				if (field[j][i] == comp) weights[i + 3]--;
			}
		}

		for (i = 0, j = 0; i < 3; i++, j++) { // diagonála "\"
			if (field[i][j] == my) weights[6]++;
			if (field[i][j] == comp) weights[6]--;
		}

		for (i = 0, j = 2; i < 3; i++, j--) { // diagonála "/"
			if (field[i][j] == my) weights[7]++;
			if (field[i][j] == comp) weights[7]--;
		}
		steamRoller = steamRoll();
	} catch (e) {
		$("#result").html(e);
	}
}


function setField(newField) {
	field = newField;
}


function startGame() {
	state = 1;
	setField([
		["", "", ""],
		["", "", ""],
		["", "", ""]
	]);
	$(".cell").html("");
	$("#1").html("W");
	$("#2").html(states[state]);
	$("#3").html("O");
	$(".side").removeClass("hidden");
	$(".result").addClass("hidden");
	$(".score").removeClass("hidden");
}


function resetGame() {
	state = 0;
	my = null;
	comp = null;
	$(".cell").html("");
	$("#1").html(diffs[diff]);
	$("#2").html(states[state]);
	$("#3").html(modes[mode]);
	$("#result").html("");
	$(".side").removeClass("hidden");
	$(".score").addClass("hidden");
	$("#myScore").html(myWins = 0);
	$("#compScore").html(compWins = 0);
}

function continueGame() {
	state = 2;
	setField([
		["", "", ""],
		["", "", ""],
		["", "", ""]
	]);
	$("#2").html(states[state]);
	$(".cell").html("");
	$(".result").addClass("hidden");
	if (mode === 0) switchPlayers();
	if (my == char1) {
		if (mode === 0) {
			doge();
		} else pvp();
	}
}

function switchPlayers() {
	if (my == char1) {
		my = char2;
		comp = char1;
	} else {
		my = char1;
		comp = char2;
	}
}

function switchDiff() {
	switch (diff) {
		case 0:
			diff = 1;
			break;
		case 1:
			diff = 2;
			break;
		case 2:
			diff = 0;
			break;
	}
	$("#1").html(diffs[diff]);
}


$("#1").click(function() {
	switch (state) {
		case 0:
			switchDiff();
			break;
		case 1:
			setSide(char1, char2);
			break;
	}
});


$("#2").click(function(event) {
	switch (state) {
		case 0: // reseted
			startGame();
			break;
		case 1:
		case 2: // started
			resetGame();
			break;
		case 3: // continue
			continueGame();
			break;
	}
});


$("#3").click(function() {
	switch (state) {
		case 0: // reseted
			switchMode();
			break;
		case 1: // started
			setSide(char2, char1);
			break;
	}
});


function setSide(p1Char, p2Char) {
	my = p1Char;
	comp = p2Char;
	state = 2;
	$(".side").addClass("hidden");
	if (mode === 0 && my == char1) doge();
}


function switchMode() {
	if (mode === 0) {
		mode = 1;
		$("#p1name").html("Doge 1");
		$("#p2name").html("Doge 2");
	} else {
		mode = 0;
		$("#p1name").html("You");
		$("#p2name").html("Doge");
	}
	$("#3").html(modes[mode]);
}


$(".cell").click(function(event) {
	console.log(turn, field, weights, state, mode);
	if (state == 2 && $(this).html() === "") {
		if (mode === 0) { // vs Doge
			$(this).html(my);
			doge();
		} else { // 1 vs 1
			if (turn == "my") {
				$(this).html(my);
				turn = "comp";
			} else {
				$(this).html(comp);
				turn = "my";
			}
			pvp();
		}
	}
});


function refresh() {
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			$("#" + i + j).html(field[i][j]);
		}
	}
}


$("document").ready(function() {
	$("#1").html(diffs[diff]);
	$("#2").html(states[state]);
	$("#3").html(modes[mode]);
});
