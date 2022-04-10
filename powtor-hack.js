// uwaga. niektóre komentarze są po angielsku ze względu na pomoc od Github Copilot :) 

console.log("Cheat uruchamia się...");
console.log("Informacje i zgłaszanie błędów: https://github.com/Davilarek/PowtorHack");
/**
 * Pobiera ilość commitów z API GitHuba (właściwie opcjonalne), 
 * następnie sprawdza, czy bieżąca strona jest powtórką, 
 * następnie pobiera adres URL API pytania, 
 * następnie pobiera dane pytania z API pytania, 
 * następnie porównuje dane pytania z pytaniem na stronie, 
 * a następnie wyświetla odpowiedzi do konsoli.
 */
function startCheat() {
	var githubApiUrl = "https://api.github.com/repos/Davilarek/PowtorHack/commits?sha=main&per_page=1&page=1";
	var githubApiRequest = new XMLHttpRequest();
	githubApiRequest.open("GET", githubApiUrl);
	githubApiRequest.setRequestHeader("User-Agent", "request");
	githubApiRequest.onreadystatechange = function () {
		if (githubApiRequest.readyState === 4) {
			let githubApiResponse = githubApiRequest.getResponseHeader("link");
			console.log("%cPowtor Hack " + "%cv1." + githubApiResponse.split("https://api.github.com")[2].split("&")[2].split("=")[1].split(">")[0] + "%c by Davilarek", "color: red", "color: white", "color: red");

			// check if url contains "https://powtorkomat8.apps.gwo.pl/practice-exercises/" and if it doesn't show console.log "Nie znaleziono powtórki"
			if (!window.location.href.includes("https://powtorkomat8.apps.gwo.pl/practice-exercises/")) {
				console.log("%cNie znaleziono powtorki!", "color: red");
				return;
			}


			var open = window.XMLHttpRequest.prototype.open;

			var questionApiUrl = "";
			/**	
			 * podmiana XMLHttpRequest.prototype.open() na funkcję, która zapisuje url pierwszego żądania do questionApiUrl
			 * @param {string} method - metoda HTTP użyta do żądania
			 * @param {string} url - adres URL użyty do żądania
			 */
			function openReplacement(method, url) {
				this._url = url;
				// uwaga. wypadałoby sprawdzić czy url na pewno jest odpowiedzią api zawierającą jsona
				questionApiUrl = arguments[1];
				return open.apply(this, arguments);
			}

			window.XMLHttpRequest.prototype.open = openReplacement;

			document.getElementsByClassName("indicator exercise-mode ng-star-inserted")[0].parentElement.childNodes[0].click()

			var apiRequest = new XMLHttpRequest();
			apiRequest.open("GET", questionApiUrl);

			// nagłówki znajdują się w ciasteczkach dokumentu
			// uwaga. prawdopodobnie można uzyskać te ciasteczka w samym dokumencie
			// var header1 = document.getElementsByClassName("content screen-exercises")[0].ownerDocument.cookie.split("; ")[0].split("=")
			// var header2 = document.getElementsByClassName("content screen-exercises")[0].ownerDocument.cookie.split("; ")[1].split("=")
			// uwaga. /\ powyższy komentarz jest nieaktualny, okazuje się że można.
			var headers = document.cookie.split("; ");

			// przywracanie domyślnego XMLHttpRequest.prototype.open(), prawdopodobnie nie jest to potrzebne
			window.XMLHttpRequest.prototype.open = open;

			// ustawienie nagłówka zapytania
			apiRequest.setRequestHeader("X-Authorization", headers[0].split("=")[1]);
			apiRequest.setRequestHeader("japa_phpsessid", headers[1].split("=")[1]);

			var questionClassNames = ['instruction', 'question'];

			apiRequest.onreadystatechange = function () {
				if (apiRequest.readyState === 4) {
					// przetwarzanie danych z odpowiedzi API pytania
					// uwaga. można dodać sprawdzanie czy dane są poprawne
					let apiResponse = JSON.parse(apiRequest.responseText).pool
					var questionData = document.getElementsByTagName("app-exercise-loader")[0].getElementsByClassName("ng-star-inserted");
					for (var questionElements = 0; questionElements < questionData.length; questionElements++) {

						// sprawdzanie czy questionData[questionElements].className zawiera którykolwiek element z questionClassNames
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

							// jest kilka typów zadań. te ify są potrzebne do znalezienia odpowiedniego typu zadania
							if ("instruction" in apiResponse[questionIndex])
								questionInfo = apiResponse[questionIndex].instruction;
							if ("question" in apiResponse[questionIndex])
								questionInfo = apiResponse[questionIndex].question;
							if ("question" in apiResponse[questionIndex].items[0])
								questionInfo = apiResponse[questionIndex].items[0].question;

							var parsedQuestionData = new DOMParser().parseFromString(questionInfo, "text/html").documentElement;

							var question = questionData[questionElements].childNodes[0];
							if (window.powtorHackDebug) console.log("parsedQuestionData: " + parsedQuestionData.textContent + " question: " + question.textContent);
							parsedQuestionData.textContent = parsedQuestionData.textContent.replace(/\\\\frac{/g, "").replace(/}{/g, "").replace(/}/g, "");
							question.textContent = question.textContent.replace(/\\\\frac{/g, "").replace(/}{/g, "").replace(/}/g, "");
							parsedQuestionData.textContent = parsedQuestionData.textContent.replace(/\\frac{/g, "").replace(/}{/g, "").replace(/}/g, "");
							question.textContent = question.textContent.replace(/\\frac{/g, "").replace(/}{/g, "").replace(/}/g, "");

							// FIXME: uwaga. /\ niebezpieczne rozwiązanie.

							if (window.powtorHackDebug) console.log("parsedQuestionData: " + parsedQuestionData.textContent + " question: " + question.textContent);
							// remove all newlines and carriage return from question.textContent and parsedQuestionData.textContent
							question.textContent = question.textContent.replace(/\n/g, "").replace(/\r/g, "");
							parsedQuestionData.textContent = parsedQuestionData.textContent.replace(/\n/g, "").replace(/\r/g, "");

							// FIXME: uwaga. /\ (potencjalnie) niebezpieczne rozwiązanie.

							if (window.powtorHackDebug) console.log("parsedQuestionData: " + parsedQuestionData.textContent + " question: " + question.textContent);
							// replace ' ' with '' globally in question.textContent and parsedQuestionData.textContent
							question.textContent = question.textContent.replace(/\s+/gm, '');
							parsedQuestionData.textContent = parsedQuestionData.textContent.replace(/\s+/gm, '');

							// FIXME: uwaga. /\ (potencjalnie) niebezpieczne rozwiązanie.
							if (window.powtorHackDebug) console.log("parsedQuestionData: " + parsedQuestionData.textContent + " question: " + question.textContent);
							// ostatnia część kodu. zamienia wszystkie znaki specjalne na ich odpowiedniki, upraszcza pytania do maksimum, a następnie porównuje dane z API z danymi ze strony. nie jest to dokładne rozwiązanie, ale czasem działa.
							if (question.textContent.replace(/\n*$/, "").normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/(\u2212)/gim, "-").localeCompare(parsedQuestionData.textContent.replace(/\n*$/, "").normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/(\u2212)/gim, "-")) === 0) {
								console.log("Odnaleziono odpowiedź. ");
								console.log(apiResponse[questionIndex].items);
								return;
							}
						}
					}

					// jeżeli wszystko zawiedzie, wyświetla surową odpowiedź API
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