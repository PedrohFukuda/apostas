(function ($) {
	'use strict';

	var app = (function () {
		var $numbersTable = $('[data-js="numbers-table-body"]').get();
		var $gamesButtonsDiv = $('[data-js="games-buttons-div"]').get();
		var $buttonCompleteGame = $('[data-js="button-complete-game"]');
		var $buttonClearGame = $('[data-js="button-clear-game"]');
		var $buttonAddCart = $('[data-js="button-add-cart"]');

		var $cart = $('[data-js="cart-body"]').get();
		var $totalPrice = $('[data-js="total-price"]').get();

		var numerOfSelectedNumbers = 0;
		var games = [];
		var currGame;
		var cart;
		return {
			init: function init() {
				this.cart = [];
				this.loadGames();
				this.setButtonTriggers();
			},

			loadGames: function loadGames() {
				var ajax = new XMLHttpRequest();
				ajax.open('GET', '/games.json', true);
				ajax.send();
				ajax.addEventListener('readystatechange', this.saveGamesInMemory, false);
			},

			saveGamesInMemory: function saveGamesInMemory() {
				if (!app.isReady.call(this)) {
					return;
				}

				app.games = JSON.parse(this.responseText).types;
				console.log(app.games);

				app.gamesReliantConfigurations()
			},

			gamesReliantConfigurations: function gamesReliantConfigurations() {
				app.setGamesButtons();
				app.changeGame(app.games[0].type);
				app.populateNumbersTable();
			},

			setGamesButtons: function setGamesButtons(e) {
				var $fragment = document.createDocumentFragment();

				Array.prototype.forEach.call(app.games, function (elem) {
					var $button = app.createGameButton(elem);

					$fragment.appendChild($button);
				});

				$gamesButtonsDiv.appendChild($fragment);
			},

			changeGame: function changeGame(gameName) {
				app.currGame = app.getGame(gameName);
				$('[data-js="game-name"]').get().textContent = app.currGame.type;
				$('[data-js="game-description"]').get().textContent = app.currGame.description;

				app.setActionButtonsColorsToGameColors()
				app.clearSelectedNumbers();
				app.populateNumbersTable();
			},

			clearSelectedNumbers: function clearSelectedNumbers() {
				$numbersTable.childNodes.forEach((elem) => {
					elem.childNodes.forEach((elem) => {
						if (elem.firstChild.clicked) {
							app.toggleNumber.call(elem.firstChild);
						};
					});
				});
				app.numerOfSelectedNumbers = 0;
			},

			setActionButtonsColorsToGameColors: function setActionButtonsColorsToGameColors() {
				$buttonCompleteGame.get().style.color = app.currGame.color;
				$buttonCompleteGame.get().style.borderColor = app.currGame.color;

				$buttonClearGame.get().style.color = app.currGame.color;
				$buttonClearGame.get().style.borderColor = app.currGame.color;

				$buttonAddCart.get().style["background-color"] = app.currGame.color;
				$buttonAddCart.get().style.borderColor = app.currGame.color;
			},

			setButtonTriggers: function setButtonTriggers() {
				$buttonCompleteGame.on('click', app.handleCompleteGameButtonClick);

				$buttonClearGame.on('click', app.clearSelectedNumbers);
				$buttonAddCart.on('click', app.handleAddCartButtonClick);
			},

			handleCompleteGameButtonClick: function handleCompleteGameButtonClick() {
				const myRnId = () => parseInt((Math.random()) * app.currGame.range);
				var numbersList = [];

				while (numbersList.length < app.currGame["max-number"]) {
					var n = myRnId();
					if (!numbersList.some((elem) => {
						return elem === n;
					})) {
						numbersList.push(n);
					}
				}

				app.selectThisNumbers(numbersList);
			},

			handleAddCartButtonClick: function handleAddCartButtonClick() {
				var numbers = app.getSelectedNumbers();
				if (numbers.length === 0)
					return;
				app.cart.push({
					numbers: numbers,
					game: app.currGame.type,
					price: app.currGame.price
				});

				var $fragment = document.createDocumentFragment();
				var $div = document.createElement('div');
				var $tr = document.createElement('tr');
				var $tdDelete = document.createElement('td');
				var $tdInfo = document.createElement('td');
				var $tdInfoDiv = document.createElement('td');
				var $trInfoNumbers = document.createElement('tr');
				var $trInfoGameDetails = document.createElement('tr');
				var $gameType = document.createElement('span');
				var $price = document.createElement('span');


				var $deleteButton = $('[data-js="trash"]').get().cloneNode(true);
				$deleteButton.addEventListener('click', app.handleDeleteBet);
				$tdDelete.appendChild($deleteButton);

				$trInfoNumbers.textContent = numbers.reduce((acc, elem, index) => {
					if (index === 0)
						return acc + elem;
					return acc + ', ' + elem;
				}, '');
				$trInfoNumbers.style.fontWeight = "650";
				$trInfoNumbers.style.fontStyle = "italic";

				$gameType.textContent = app.currGame.type;
				$gameType.style.color = app.currGame.color;
				$gameType.style.fontWeight = "900";
				$gameType.style.fontStyle = "italic";

				$price.textContent = ' R$ ' + app.currGame.price;

				$trInfoGameDetails.appendChild($gameType);
				$trInfoGameDetails.appendChild($price);

				$tdInfo.appendChild($trInfoNumbers);
				$tdInfo.appendChild($trInfoGameDetails);

				$tdInfo.style.borderLeft = "3px solid";
				$tdInfo.style.borderRadius = "3px";
				$tdInfo.style.borderColor = app.currGame.color;
				$tdInfo.style.padding = "10px";
				$div.appendChild($tdDelete);
				$div.appendChild($tdInfo);

				$div.style.marginTop = "10px";
				$tr.appendChild($div);
				$fragment.appendChild($tr);

				$cart.appendChild($fragment);
				$totalPrice.textContent = (Number($totalPrice.textContent.replace(',', '.')) + app.currGame.price).toFixed(2);
			},

			handleDeleteBet: function handleDeleteBet(e) {
				var gamePrice = this.parentNode.nextSibling.firstChild.nextSibling.firstChild.nextSibling.textContent.replace('R$', '');
				console.log(Number(gamePrice));
				$totalPrice.textContent = (Number($totalPrice.textContent.replace(',', '.')) - Number(gamePrice)).toFixed(2);
				this.parentNode.parentNode.textContent = '';
			},

			selectThisNumbers: function selectThisNumbers(numberList) {
				app.clearSelectedNumbers();

				$numbersTable.childNodes.forEach((elem) => {
					elem.childNodes.forEach((elem) => {
						if (numberList.some((number) => {
							return Number(elem.textContent) === number;
						})) {
							app.toggleNumber.call(elem.firstChild);
						}
					});
				});
			},

			isReady: function isReady() {
				return this.readyState === 4 && this.status === 200;
			},

			createGameButton: function createGameButton(game) {
				var $button = document.createElement('button');

				$button.className = 'btn btn-outline-primary rounded-pill';
				$button.style.color = game.color;
				$button.style.borderColor = game.color;
				$button.style.margin = "10px"
				$button.textContent = game.type;

				$button.addEventListener('click', app.handleGameButtonClicked);

				return $button;
			},

			handleGameButtonClicked: function handleGameButtonClicked() {
				app.changeGame(this.textContent);
			},

			getGame: function getGame(gameName) {
				return Array.prototype.find.call(app.games, (elem) => {
					return elem.type === gameName;
				});;
			},

			populateNumbersTable: function populateNumbersTable() {
				if ($numbersTable.hasChildNodes()) {
					$numbersTable.textContent = '';
				}
				var $fragment = document.createDocumentFragment();
				var numberCount = 1;
				while (numberCount < app.currGame.range) {
					var $tr = document.createElement('tr');
					for (var j = 0; j < 10; j++) {
						var buttonText = numberCount;
						if (numberCount < 10)
							buttonText = '0' + numberCount;

						var $td = document.createElement('td');

						var $button = document.createElement('button');
						$button.textContent = buttonText;
						$button.id = "button-numbers-table-" + numberCount;
						$button.className = 'btn btn-outline-secondary rounded-circle rounded-sm'
						$button.clicked = false;
						$button.addEventListener('click', app.handleNumberClick);

						$td.appendChild($button);
						numberCount++
						$tr.appendChild($td);
					}
					$fragment.appendChild($tr);
				}

				$numbersTable.appendChild($fragment);
			},

			handleNumberClick: function handleNumberClick(e) {
				if (app.numerOfSelectedNumbers >= app.currGame["max-number"] && !this.clicked) {
					alert("Já selecionou o máximo de números para esse jogo");
					return;
				}
				app.toggleNumber.call(this);
			},

			toggleNumber: function toggleNumber() {
				this.clicked = !this.clicked;
				if (this.clicked) {
					this.setAttribute("style", "background-color: " + app.currGame.color + ";" +
						"color: white;");
					app.numerOfSelectedNumbers++;
					return;
				}
				this.setAttribute("style", "background-color: white;");
				app.numerOfSelectedNumbers--;
			},

			getSelectedNumbers: function getSelectedNumbers() {
				var numbers = [];
				$numbersTable.childNodes.forEach((elem) => {
					elem.childNodes.forEach((elem) => {
						if (elem.firstChild.clicked) {
							numbers.push(Number(elem.firstChild.textContent));
						};
					});
				});

				return numbers;
			}
		}
	})();

	app.init();
})(window.DOM);