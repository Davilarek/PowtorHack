console.log("Cheat uruchamia się...");
console.log("Informacje i zgłaszanie błędów: https://github.com/Davilarek/PowtorHack");
function startCheat() {
	var githubApiUrl = "https://api.github.com/repos/Davilarek/PowtorHack/commits?sha=main&per_page=1&page=1";
	var githubApiRequest = new XMLHttpRequest();
	githubApiRequest.open("GET", githubApiUrl);
	githubApiRequest.setRequestHeader("User-Agent", "request");
	githubApiRequest.onreadystatechange = function () {
		if (githubApiRequest.readyState === 4) {
			let githubApiResponse = githubApiRequest.getResponseHeader("link");
			console.log("%cPowtor Hack " + "%cv1." + githubApiResponse.split("https://api.github.com")[2].split("&")[2].split("=")[1].split(">")[0] + "%c by Davilarek", "color: red", "color: white", "color: red");

			// check if url contains "https://powtorkomat8.apps.gwo.pl/practice-exercises/" and if it doesn't show console.log "Nie znaleziono powtorki"
			if (!window.location.href.includes("https://powtorkomat8.apps.gwo.pl/practice-exercises/")) {
				console.log("%cNie znaleziono powtorki!", "color: red");
				return;
			}

			var open = window.XMLHttpRequest.prototype.open;

			var questionApiUrl = "";

			function openReplacement(method, url) {
				this._url = url;
				questionApiUrl = arguments[1];
				return open.apply(this, arguments);
			}

			window.XMLHttpRequest.prototype.open = openReplacement;

			document.getElementsByClassName("indicator exercise-mode ng-star-inserted")[0].parentElement.childNodes[0].click()

			var apiRequest = new XMLHttpRequest();
			apiRequest.open("GET", questionApiUrl);
			var header1 = document.getElementsByClassName("content screen-exercises")[0].ownerDocument.cookie.split("; ")[0].split("=")
			var header2 = document.getElementsByClassName("content screen-exercises")[0].ownerDocument.cookie.split("; ")[1].split("=")

			window.XMLHttpRequest.prototype.open = open;

			apiRequest.setRequestHeader("X-Authorization", header1[1]);
			apiRequest.setRequestHeader("japa_phpsessid", header2[1]);

			var questionClassNames = ['instruction', 'question'];

			apiRequest.onreadystatechange = function () {
				if (apiRequest.readyState === 4) {
					let apiResponse = JSON.parse(apiRequest.responseText).pool
					var questionData = document.getElementsByTagName("app-exercise-loader")[0].getElementsByClassName("ng-star-inserted");
					for (var questionElements = 0; questionElements < questionData.length; questionElements++) {
						const questionDataContainsClass = questionClassNames.some(element => {
							if (questionData[questionElements].className.indexOf(element) !== -1) {
								return true;
							}
							return false;
						});
						if (!questionDataContainsClass) {
							continue;
						}
						for (var questionIndex = 0; questionIndex < apiResponse.length; questionIndex++) {
							var questionInfo = "";
							//console.log("instruction" in resp[i2])
							if ("instruction" in apiResponse[questionIndex])
								questionInfo = apiResponse[questionIndex].instruction;
							if ("question" in apiResponse[questionIndex])
								questionInfo = apiResponse[questionIndex].question;
							if ("question" in apiResponse[questionIndex].items[0])
								questionInfo = apiResponse[questionIndex].items[0].question;

							var parsedQuestionData = new DOMParser().parseFromString(questionInfo, "text/html").documentElement;

							var question = questionData[questionElements].childNodes[0];
							parsedQuestionData.textContent = parsedQuestionData.textContent.replace(/\\\\frac{/g, "").replace(/}{/g, "").replace(/}/g, "");

							// FIXME: uwaga. /\ niebezpieczne rozwiązanie.

							// remove all newlines and carriage return from question.textContent and parsedQuestionData.textContent
							question.textContent = question.textContent.replace(/\n/g, "").replace(/\r/g, "");
							parsedQuestionData.textContent = parsedQuestionData.textContent.replace(/\n/g, "").replace(/\r/g, "");

							// FIXME: uwaga. /\ niebezpieczne rozwiązanie.

							// replace ' ' with '' globally in question.textContent and parsedQuestionData.textContent
							question.textContent = question.textContent.replace(/\s+/gm, '');
							parsedQuestionData.textContent = parsedQuestionData.textContent.replace(/\s+/gm, '');

							// FIXME: uwaga. /\ niebezpieczne rozwiązanie.

							if (question.textContent.replace(/\n*$/, "").normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/(\u2212)/gim, "-").localeCompare(parsedQuestionData.textContent.replace(/\n*$/, "").normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/(\u2212)/gim, "-")) === 0) {
								console.log("Odnaleziono odpowiedź. ");
								console.log(apiResponse[questionIndex].items);
								return;
							}
						}
					}
					console.log("UWAGA! Nie odnaleziono odpowiedzi. Możesz spróbować odnaleźć je ręcznie. ");
					console.log(apiResponse);
				}
			};
			apiRequest.send();
		}
	};
	githubApiRequest.send();
}
startCheat();