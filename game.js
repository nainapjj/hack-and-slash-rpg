var MOVE_TYPE = {ATTACK: 0, HEAL: 1};

var CREATURES = [{name: "Bulbasaur", 
	hp: 60, moves: [{name: 'Vine Whip', damage: 30, accuracy: .9},
					 {name: 'Solar Beam', damage: 70, accuracy: .3}]}, 
				{name: "The Boss", 
					 hp: 50, moves: [{name: 'Slash', damage: 100, accuracy: .2},
					 {name: 'Destroy', damage: 120, accuracy: .1}]}];

var YOUR_MOVES = [{name: 'Hack', damage: 30, accuracy: .9, type: MOVE_TYPE.ATTACK}, 
				  {name: 'Slash', damage: 50, accuracy: .5, type: MOVE_TYPE.ATTACK}, 
				  {name: 'Rest', recovery: 20, accuracy: 1, type: MOVE_TYPE.HEAL}];

var currentCreature;
var yourHp = 200;
var creaturesKilled = 0;

var sleepTime = 0;

var outputText = function (text) {
	var outputText = "<p>&gt; &nbsp;" + text + "</p>";
	sleepTime += 1000;
	setTimeout(function() {
		$(".game-content").append(outputText);
		// Scroll to bottom of the div.
		$('.game-content').scrollTop($('.game-content')[0].scrollHeight);
	}, sleepTime);
}

var pickRandomCreature = function () {
	// Pick a random number in the array of creatures
	var creatureIndex = Math.floor(Math.random() * CREATURES.length);

	// Return a copy of the object, not the pointer to the object
	return JSON.parse(JSON.stringify(CREATURES[creatureIndex]));
}

var pickRandomMove = function (moveList) {
	// Pick a random number in the array of creatures
	var moveIndex = Math.floor(Math.random() * moveList.length);
	return moveList[moveIndex];
}

var showCreatureSummary = function (creature) {
	outputText("Name: " + creature.name + "  HP: " + creature.hp);
}

var movesToText = function(moves) {
	retString = "";
	for (var i = 0; i < YOUR_MOVES.length; i++) {
		if (YOUR_MOVES[i].type === MOVE_TYPE.ATTACK) {
			retString += "<br/>&nbsp; Name: " + YOUR_MOVES[i].name + " Damage: " + 
			 	+ YOUR_MOVES[i].damage + " Accuracy: " + YOUR_MOVES[i].accuracy; 
		} else {
			retString += "<br/>&nbsp; Name: " + YOUR_MOVES[i].name + " Recovery: " + 
			 	+ YOUR_MOVES[i].recovery + " Accuracy: " + YOUR_MOVES[i].accuracy; 
		}
	}

	return retString;
}



var showYourStats = function() {
	outputText("Your current HP: " + yourHp + "<br/>Your available moves: " + movesToText(YOUR_MOVES) + 
		"<br/>Enter a move name to attack!");
}

var initializeGame = function () {
	// Output the intro text
	outputText("You're in a dark, dark field. And you're surrounded by monsters! Hack and slash your way out!");

	// Pick a creature at random and copy it to current creature
	currentCreature = pickRandomCreature();
	outputText("A wild " + currentCreature.name + " appeared!");

	// Output the creature stats
	showCreatureSummary(currentCreature);

	// Output your current stats
	showYourStats();
}

var executeMove = function(move) {
	// Check which move you entered
	var yourMove = -1;
	for (var i = 0; i < YOUR_MOVES.length; i++) {
		if (move.toUpperCase() === YOUR_MOVES[i].name.toUpperCase()) {
			yourMove = YOUR_MOVES[i];
		}
	}

	// Couldn't find move...
	if (yourMove === -1) {
		outputText("<strong>Invalid move. Try again!</strong>");
		return;
	}


	if (Math.random() < yourMove.accuracy) {
		if (yourMove.type === MOVE_TYPE.ATTACK) {
			outputText("<strong>" + yourMove.name + "! You took " + yourMove.damage + " from " + currentCreature.name + 
				"</strong>");
			currentCreature.hp -= yourMove.damage;
		} else {
			outputText("<strong>" + yourMove.name + "! Your health has increased.");
			yourHp += yourMove.recovery;
		}
	} else {
		outputText("<strong>Oh no, your move missed!</strong>");
	}

	// If you killed the creature, bring up another creature and show stats.
	if (currentCreature.hp <= 0) {
		outputText("Congratulations! It's dead.  Unfortunately, there's even more creatures to kill." + 
			" Try to get through as many as possible.");

		outputText("You have killed: " + ++creaturesKilled);

		currentCreature = pickRandomCreature();
		outputText("A wild " + currentCreature.name + " appeared!");

	} else {
		// It's the creature's turn to move!
		var move = pickRandomMove(currentCreature.moves);
		if (Math.random() > move.accuracy) {
			outputText("<strong>" + currentCreature.name +  "'s " + move.name + " missed!</strong>");
		} else {
			outputText("<strong>" + move.name + "! " + currentCreature.name + " took " + move.damage + " from you </strong>");
			yourHp -= move.damage;
		}
	}

	if (yourHp <= 0) {
		outputText("<strong>Oh no, you died!</strong>");
		outputText("<strong>You have killed: " + creaturesKilled + "<strong>");
		$(".game-command-input").prop("disabled", true);
		return;
	}

	// Output the creature stats
	showCreatureSummary(currentCreature);
	showYourStats();
}

var showGame = function () {
	$(".game").height("550px");
	$(".play").hide(); 

	setTimeout(initializeGame, 1000);

}

var enterCommand = function() {
	// First, look at what the user entered.
	var value = $(".game-command-input").val();
	$(".game-command-input").val("");

	// Based on that value enact next move
	executeMove(value);
}

$(document).ready(function() {
	$('.game-command-input').keyup(function(e){
    	if(e.keyCode == 13)
    	{
    		sleepTime = 0;
        	enterCommand();
    	}
	});
});