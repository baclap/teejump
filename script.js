// Global variable that holds values of the selected tee
var selectedTee;

/****************************************
 Initialize Application On Page Load
****************************************/
	document.addEventListener('DOMContentLoaded', initialize, false);
	function initialize()
	{
		var restartButton = getId("restartButton");
		detectEventClickOrTouch(restartButton, startGame);
		var aboutButton = getId("aboutButton");
		detectEventClickOrTouch(aboutButton, showAbout);
		var aboutShade = getId("aboutShade");
		detectEventClickOrTouch(aboutShade, hideAbout);
		var closeBanner = getId("closeBanner");
		detectEventClickOrTouch(closeBanner, hideGamemixBanner);
		startGame();
	}

/****************************************
 About Popout Functions
****************************************/
	function showAbout()
	{
		var aboutContent = getId("aboutContent");
		var aboutShade = getId("aboutShade");
		aboutShade.className = "show";
		aboutContent.className = "show";
	}

	function hideAbout()
	{
		var aboutContent = getId("aboutContent");
		var aboutShade = getId("aboutShade");
		aboutShade.className = "";
		aboutContent.className = "";
	}
	
/****************************************
 Hide Gamemix Banner
****************************************/
	function hideGamemixBanner()
	{
		var gamemixBanner = getId("gamemixBanner");
		gamemixBanner.className = "hide";
	}

/****************************************
 Utility Functions
****************************************/
	function detectEventClickOrTouch(element, functionToCall)
	{
		if(isTouchDevice())
			element.addEventListener("touchend", functionToCall, false);
		else
			element.addEventListener("click", functionToCall, false);
	}

	function isTouchDevice()
	{
		return 'ontouchstart' in window // works on most browsers 
		|| 'onmsgesturechange' in window; // works on ie10
	}

	function getId(id)
	{
		return document.getElementById(id);
	}





/*
##################################################################################
##################################################################################
################################# Tee Jump #######################################
##################################################################################
##################################################################################
*/

/****************************************
 Start/Restart
****************************************/
	function startGame()
	{
		// Add colored tees to each hole and select them (for animation)
		var holes = getHoles();
		for (var i = 0; i < holes.length ; i++)
		{
			var color;
			switch (Math.floor((Math.random()*3)+1))
			{
				case 1:
					color = "blue";
					break;
				case 2:
					color = "orange";
					break;
				case 3:
					color = "yellow";
					break;
			}
			placeTee(holes[i], color);
			selectTee(holes[i]);
			detectEventClickOrTouch(holes[i], firstTouch);
		}
	
		// Commence animation
		setTimeout(function()
		{
			for (i = 1; i <= 5; i++)
			{
				var row = new Array();
				for (j = 1; j <= i; j++)
					row.push(getId("hole-" + i + "-" + j));
				for (x = 0; x < row.length; x++)
				{
					deselectTee(row[x]);
				}
			}
		}, 400);
	}

/****************************************
 On Touch/Click Functions
****************************************/
	function firstTouch(event)
	{
		var firstRemoved = this;
		event.preventDefault();
		selectTee(firstRemoved);
		setTimeout(function(){
			makeEmpty(firstRemoved);
		}, 200);
		var holes = getHoles();
		for (var i = 0; i < holes.length ; i++)
		{
			holes[i].removeEventListener("click", firstTouch, false);
			holes[i].removeEventListener("touchend", firstTouch, false);
		}
		var tees = getTees();
		for (var i = 0; i < tees.length ; i++)
		{
			detectEventClickOrTouch(tees[i], touchTee);
		}
	}

	function touchTee(event)
	{
		event.preventDefault();
		removeOptions();
		if (!isSelected(this))
		{
			var tees = getTees();
			for (var i = 0; i < tees.length ; i++)
				deselectTee(tees[i]);
			selectTee(this);
			var options = getMoveOptions(this);
			for (var i = 0; i < options.length ; i++)
			{
				highlightOption(options[i]);
				detectEventClickOrTouch(options[i], touchOption);
			}
		}
		else
			deselectTee(this);
	}

	function touchOption(event)
	{
		removeOptions();
	
		var nowEmpty = getId("hole-" + selectedTee.y + "-" + selectedTee.x);
		makeEmpty(nowEmpty);
	
		var middleTee = getMiddleTee(this);
		makeEmpty(middleTee);
	
		placeTee(this, selectedTee.color);
	
		detectEventClickOrTouch(this, touchTee);
	}

/****************************************
 Action Functions
****************************************/
	function removeOptions()
	{
		var holes = getHoles();
		for (var i = 0; i < holes.length; i++)
		{
			holes[i].className = holes[i].className.replace("option", "");
			holes[i].removeEventListener("click", touchOption, false);
			holes[i].removeEventListener("touchend", touchOption, false);
		}
	}

	function highlightOption(element)
	{
		element.className = "hole option";
	}

	function placeTee(element, color)
	{
		element.className = "hole tee " + color;
	}

	function makeEmpty(element)
	{
		element.className = "hole";
		element.removeEventListener("click", touchTee, false);
		element.removeEventListener("click", touchOption, false);
		element.removeEventListener("touchend", touchTee, false);
		element.removeEventListener("touchend", touchOption, false);
	}

	function deselectTee(element)
	{
		element.className = element.className.replace("selected", "");
	}

	function selectTee(element)
	{
		element.className = element.className + " selected";
	
		// Get tee coordinates and color
		var temp = element.id.split("-");
		var y = parseInt(temp[1]);
		var x = parseInt(temp[2]);
		var color = getColor(element);
	
		// Update selectedTee variable
		selectedTee = {
			x:x,
			y:y,
			color:color
		};
	}

/****************************************
 Is/Has Functions
****************************************/
	function isSelected(element)
	{
		if (element.className.indexOf("selected") == -1)
			return false
		else
			return true
	}

	function hasTee(element)
	{
		if (element.className.indexOf("tee") == -1)
			return false
		else
			return true
	}

/****************************************
 Get Functions
****************************************/
	function getHoles()
	{
		return document.getElementsByClassName("hole");
	}

	function getTees()
	{
		return document.getElementsByClassName("tee");
	}

	function getOptions()
	{
		return document.getElementsByClassName("option");
	}

	function getColor(element)
	{
		if (element.className.indexOf("blue") != -1)
			return "blue";
		else if (element.className.indexOf("orange") != -1)
			return "orange";
		else if (element.className.indexOf("yellow") != -1)
			return "yellow";
		else
			return false;
	}
	
	function getMiddleTee(element)
	{
		var oldX = selectedTee.x;
		var oldY = selectedTee.y;
		var temp = element.id.split("-");
		var newY = parseInt(temp[1]);
		var newX = parseInt(temp[2]);

		var middleY;
		var middleX;
	
		if (oldY > newY) // tee going up
		{
			middleY = newY + 1;
			if (oldX == newX) // right
				middleX = newX;
			else // left
				middleX = newX+1;
		}
		else if (oldY < newY) // tee going down
		{
			middleY = newY - 1;
			if (oldX == newX) // left
				middleX = newX;
			else // right
				middleX = newX - 1;
		}
		else // tee staying in same row
		{
			middleY = oldY;
			if (oldX > newX) // going left
				middleX = newX + 1;
			else // going right
				middleX = newX - 1;
		}
	
		var middleTee = getId("hole-" + middleY + "-" + middleX);
		return middleTee;
	}

	function getMoveOptions()
	{
		var x = selectedTee.x;
		var y = selectedTee.y;
		var color = selectedTee.color;
	
		var up = y-2;
		var down = y+2;
		var left = x-2;
		var right = x+2;

		var options = new Array();

		if (up > 0 && (x-2) <= up) // maybe options up
		{

			// up, right
			if (x <= up)
			{
				var middleHole = getId("hole-" + (y-1) + "-" + x);
				if (hasTee(middleHole))
				{
					var potentialOption = getId("hole-" + up + "-" + x);
					if (!hasTee(potentialOption))
						options.push(potentialOption);
				}
			}

			// up, left
			if ((x-2) > 0 && (x-2) <= up)
			{
				var middleHole = getId("hole-" + (y-1) + "-" + (x-1));
				if (hasTee(middleHole))
				{
					var potentialOption = getId("hole-" + up + "-" + (x-2));
					if (!hasTee(potentialOption))
						options.push(potentialOption);
				}
			}
		}

		if (down <= 5) // maybe options down
		{
			// down, left
			var middleHole = getId("hole-" + (y+1) + "-" + x);
			if (hasTee(middleHole))
			{
				var potentialOption = getId("hole-" + down + "-" + x);
				if (!hasTee(potentialOption))
					options.push(potentialOption);
			}
		
			// down, right
			var middleHole = getId("hole-" + (y+1) + "-" + (x+1));
			if (hasTee(middleHole))
			{
				var potentialOption = getId("hole-" + down + "-" + (x+2));
				if (!hasTee(potentialOption))
					options.push(potentialOption);
			}
		}

		if (left > 0) // maybe option left
		{
			var middleHole = getId("hole-" + y + "-" + (x-1));
			if (hasTee(middleHole))
			{
				var potentialOption = getId("hole-" + y + "-" + left);
				if (!hasTee(potentialOption))
					options.push(potentialOption);
			}
		}

		if (right <= y) // maybe option right
		{
			var middleHole = getId("hole-" + y + "-" + (x+1));
			if (hasTee(middleHole))
			{
				var potentialOption = getId("hole-" + y + "-" + right);
				if (!hasTee(potentialOption))
					options.push(potentialOption);
			}
		}
	
		return options;
	}

