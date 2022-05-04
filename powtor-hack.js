// uwaga. niektóre komentarze są po angielsku ze względu na pomoc od Github Copilot :) 

console.log("Cheat uruchamia się...");
console.log("Informacje i zgłaszanie błędów: https://github.com/Davilarek/PowtorHack");
var cheatStartTime;
var answersGetTime;
/**
 * Pobiera ilość commitów z API GitHuba (właściwie opcjonalne), 
 * następnie sprawdza, czy bieżąca strona jest powtórką, 
 * następnie pobiera adres URL API pytania, 
 * następnie pobiera dane pytania z API pytania, 
 * następnie porównuje dane pytania z pytaniem na stronie, 
 * a następnie wyświetla odpowiedzi do konsoli.
 */

function startCheat() {
	cheatStartTime = performance.now();
	var githubApiUrl = "https://api.github.com/repos/Davilarek/PowtorHack/commits?sha=main&per_page=1&page=1";
	var githubApiRequest = new XMLHttpRequest();
	githubApiRequest.open("GET", githubApiUrl);
	githubApiRequest.setRequestHeader("User-Agent", "request");
	githubApiRequest.onreadystatechange = function () {
		if (githubApiRequest.readyState === 4) {
			let githubApiResponse = githubApiRequest.getResponseHeader("link").split("https://api.github.com")[2].split("&")[2].split("=")[1].split(">")[0];
			console.log("%cPowtor Hack " + "%cv1." + githubApiResponse + "%c by Davilarek", "color: red", "color: white", "color: red");

			answersGetTime = performance.now();

			// // check if url contains "https://powtorkomat8.apps.gwo.pl/practice-exercises/" and if it doesn't show console.log "Nie znaleziono powtórki"
			// if (!window.location.href.includes("https://powtorkomat8.apps.gwo.pl/practice-exercises/")) {
			// 	console.log("%cNie znaleziono powtorki!", "color: red");
			// 	return;
			// }

			if (window.location.href.includes("https://powtorkomat8.apps.gwo.pl/practice-exercises/")) {
				practicesHack();
			}
			else if (window.location.href.includes("https://powtorkomat8.apps.gwo.pl/sections/exams")) {
				examsHack();
			}
			else {
				console.log("%cNie znaleziono powtórki!", "color: red");
				return;
			}

		}
	};
	githubApiRequest.send();
}

function practicesHack() {
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

	// manualne odświeżenie strony z zadaniem, aby wystąpiło ponowne żądanie do API
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
			let apiResponse = JSON.parse(apiRequest.responseText).pool;
			// apiResponseRaw na ten moment jest potrzebne tylko do debugowania
			let apiResponseRaw = JSON.parse(apiRequest.responseText);
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

					// rozwiązanie w komentarzu poniżej \/ jest bezpieczniejsze, ale nie zawsze działa
					//var question = questionData[questionElements].childNodes[0];
					var question = questionData[questionElements];
					if (window.powtorHackDebug) console.log("parsedQuestionData: " + parsedQuestionData.textContent + "\nquestion: " + question.textContent);
					parsedQuestionData.textContent = parsedQuestionData.textContent.replace(/\\\\frac{/g, "").replace(/}{/g, "").replace(/}/g, "");
					question.textContent = question.textContent.replace(/\\\\frac{/g, "").replace(/}{/g, "").replace(/}/g, "");
					parsedQuestionData.textContent = parsedQuestionData.textContent.replace(/\\frac{/g, "").replace(/}{/g, "").replace(/}/g, "");
					question.textContent = question.textContent.replace(/\\frac{/g, "").replace(/}{/g, "").replace(/}/g, "");

					// FIXME: uwaga. /\ niebezpieczne rozwiązanie.

					if (window.powtorHackDebug) console.log("parsedQuestionData: " + parsedQuestionData.textContent + "\nquestion: " + question.textContent);
					// remove all newlines and carriage return from question.textContent and parsedQuestionData.textContent
					question.textContent = question.textContent.replace(/\n/g, "").replace(/\r/g, "");
					parsedQuestionData.textContent = parsedQuestionData.textContent.replace(/\n/g, "").replace(/\r/g, "");

					// FIXME: uwaga. /\ (potencjalnie) niebezpieczne rozwiązanie.

					if (window.powtorHackDebug) console.log("parsedQuestionData: " + parsedQuestionData.textContent + "\nquestion: " + question.textContent);
					// replace ' ' with '' globally in question.textContent and parsedQuestionData.textContent
					question.textContent = question.textContent.replace(/\s+/gm, '');
					parsedQuestionData.textContent = parsedQuestionData.textContent.replace(/\s+/gm, '');

					// FIXME: uwaga. /\ (potencjalnie) niebezpieczne rozwiązanie.

					if (window.powtorHackDebug) console.log("parsedQuestionData: " + parsedQuestionData.textContent + "\nquestion: " + question.textContent);

					// ostatnia część kodu. zamienia wszystkie znaki specjalne na ich odpowiedniki, upraszcza pytania do maksimum, a następnie porównuje dane z API z danymi ze strony. nie jest to dokładne rozwiązanie, ale czasem działa.
					if (question.textContent.replace(/\n*$/, "").normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/(\u2212)/gim, "-").localeCompare(parsedQuestionData.textContent.replace(/\n*$/, "").normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/(\u2212)/gim, "-")) === 0) {
						console.log("Odnaleziono odpowiedź. ");
						console.log(apiResponse[questionIndex].items);
						for (let subQuestionIndex = 0; subQuestionIndex < apiResponse[questionIndex].items.length; subQuestionIndex++) {
							const element = apiResponse[questionIndex].items[subQuestionIndex];
							if (element.answer && element.values) {
								var parsedSubQuestionData = new DOMParser().parseFromString(element.values[element.answer], "text/html").documentElement;
								console.log(`Sugestia odpowiedzi w pod-zadaniu ${subQuestionIndex + 1}: ` + parsedSubQuestionData.textContent);
							}
						}
						if (window.powtorHackDebug) console.log(apiResponseRaw);
						console.log("Operacja ukończona w " + (performance.now() - cheatStartTime) + "ms.");
						console.log("Uzyskano odpowiedzi w " + (performance.now() - answersGetTime) + "ms.");
						return;
					}
				}
			}

			// jeżeli wszystko zawiedzie, wyświetla surową odpowiedź API
			// uwaga. należy zwrócić uwagę na to, że apiResponseRaw nie jest tym samym co apiResponse. apiResponseRaw zawiera też informacje o typie zadania, ilości punktów, itp. nie koniecznie musi to interesować użytkownika.
			console.log("UWAGA! Nie odnaleziono odpowiedzi. Możesz nadal spróbować odnaleźć je ręcznie. ");
			console.log(apiResponse);
			console.log("Operacja ukończona w " + (performance.now() - cheatStartTime) + "ms.");
			console.log("Uzyskano odpowiedzi w " + (performance.now() - answersGetTime) + "ms.");
		}
	};
	apiRequest.send();
}

function examsHack() {

	function examsHackStart() {
		var open = window.XMLHttpRequest.prototype.open;

		var xhrIndex = 0;

		var allQuestions = [];

		//var questionApiUrl = "";
		/**	
		 * podmiana XMLHttpRequest.prototype.open() na funkcję, która zapisuje url pierwszego żądania do questionApiUrl
		 * @param {string} method - metoda HTTP użyta do żądania
		 * @param {string} url - adres URL użyty do żądania
		 */
		function openReplacement(method, url, aaa, aaa2, aa3) {
			this._url = url;
			// uwaga. wypadałoby sprawdzić czy url na pewno jest odpowiedzią api zawierającą jsona
			//questionApiUrl = arguments[1];
			//console.log(arguments)
			//window.powtorHackDebug1 = {}
			//window.powtorHackDebug1.questionApiUrl = arguments;
			if (url == "")
				return open.apply(this, arguments);
			else
				xhrIndex = xhrIndex + 1;
			allQuestions.push(url);

			return open.apply(this, arguments);
		}

		window.XMLHttpRequest.prototype.open = openReplacement;
		setInterval(
			function () {
				if (xhrIndex == document.getElementsByClassName("exam-exercise").length) {
					//console.log("test");
					//console.log(allQuestions);
					// aby przerwać pętlę, nie miałem lepszego pomysłu ¯\_(ツ)_/¯
					xhrIndex = xhrIndex + 1;
					getAnswers(allQuestions);
					//clearInterval(interval);
				}
			},
			50
		)

		setInterval(
			function () {
				if (window.location.href == "https://powtorkomat8.apps.gwo.pl/sections/exams") {
					window.location.reload();
				}
			},
			50
		)

		function getAnswers(_questionApiUrls) {
			window.XMLHttpRequest.prototype.open = open;

			//for loop document.getElementsByClassName("exam-exercise")
			for (let examIndex = 0; examIndex < document.getElementsByClassName("exam-exercise").length; examIndex++) {
				document.getElementsByClassName("exam-exercise")[examIndex].addEventListener("click", function () {
					const questionApiUrl = _questionApiUrls[examIndex];

					//console.log("questionApiUrl: " + questionApiUrl);

					// manualne odświeżenie strony z zadaniem, aby wystąpiło ponowne żądanie do API
					// document.getElementsByClassName("indicator exercise-mode ng-star-inserted")[0].parentElement.childNodes[0].click()

					var apiRequest = new XMLHttpRequest();
					apiRequest.open("GET", questionApiUrl);

					// nagłówki znajdują się w ciasteczkach dokumentu
					// uwaga. prawdopodobnie można uzyskać te ciasteczka w samym dokumencie
					// var header1 = document.getElementsByClassName("content screen-exercises")[0].ownerDocument.cookie.split("; ")[0].split("=")
					// var header2 = document.getElementsByClassName("content screen-exercises")[0].ownerDocument.cookie.split("; ")[1].split("=")
					// uwaga. /\ powyższy komentarz jest nieaktualny, okazuje się że można.
					var headers = document.cookie.split("; ");

					// przywracanie domyślnego XMLHttpRequest.prototype.open(), prawdopodobnie nie jest to potrzebne
					//window.XMLHttpRequest.prototype.open = open;

					// ustawienie nagłówka zapytania
					apiRequest.setRequestHeader("X-Authorization", headers[0].split("=")[1]);
					apiRequest.setRequestHeader("japa_phpsessid", headers[1].split("=")[1]);

					var questionClassNames = ['instruction', 'question', 'question-abcd', 'instruction-tf'];

					apiRequest.onreadystatechange = function () {
						if (apiRequest.readyState === 4) {
							// przetwarzanie danych z odpowiedzi API pytania
							// uwaga. można dodać sprawdzanie czy dane są poprawne
							let apiResponse = JSON.parse(apiRequest.responseText).pool;
							// apiResponseRaw na ten moment jest potrzebne tylko do debugowania
							let apiResponseRaw = JSON.parse(apiRequest.responseText);
							var questionData = document.getElementsByTagName("app-exercise-loader")[examIndex].getElementsByClassName("ng-star-inserted");
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

									// rozwiązanie w komentarzu poniżej \/ jest bezpieczniejsze, ale nie zawsze działa
									//var question = questionData[questionElements].childNodes[0];
									var question = questionData[questionElements];
									if (window.powtorHackDebug) console.log("parsedQuestionData: " + parsedQuestionData.textContent + "\nquestion: " + question.textContent);
									parsedQuestionData.textContent = parsedQuestionData.textContent.replace(/\\\\frac{/g, "").replace(/}{/g, "").replace(/}/g, "");
									question.textContent = question.textContent.replace(/\\\\frac{/g, "").replace(/}{/g, "").replace(/}/g, "");
									parsedQuestionData.textContent = parsedQuestionData.textContent.replace(/\\frac{/g, "").replace(/}{/g, "").replace(/}/g, "");
									question.textContent = question.textContent.replace(/\\frac{/g, "").replace(/}{/g, "").replace(/}/g, "");

									// FIXME: uwaga. /\ niebezpieczne rozwiązanie.

									if (window.powtorHackDebug) console.log("parsedQuestionData: " + parsedQuestionData.textContent + "\nquestion: " + question.textContent);
									// remove all newlines and carriage return from question.textContent and parsedQuestionData.textContent
									question.textContent = question.textContent.replace(/\n/g, "").replace(/\r/g, "");
									parsedQuestionData.textContent = parsedQuestionData.textContent.replace(/\n/g, "").replace(/\r/g, "");

									// FIXME: uwaga. /\ (potencjalnie) niebezpieczne rozwiązanie.

									if (window.powtorHackDebug) console.log("parsedQuestionData: " + parsedQuestionData.textContent + "\nquestion: " + question.textContent);
									// replace ' ' with '' globally in question.textContent and parsedQuestionData.textContent
									question.textContent = question.textContent.replace(/\s+/gm, '');
									parsedQuestionData.textContent = parsedQuestionData.textContent.replace(/\s+/gm, '');

									// FIXME: uwaga. /\ (potencjalnie) niebezpieczne rozwiązanie.

									if (window.powtorHackDebug) console.log("parsedQuestionData: " + parsedQuestionData.textContent + "\nquestion: " + question.textContent);

									// ostatnia część kodu. zamienia wszystkie znaki specjalne na ich odpowiedniki, upraszcza pytania do maksimum, a następnie porównuje dane z API z danymi ze strony. nie jest to dokładne rozwiązanie, ale czasem działa.
									if (question.textContent.replace(/\n*$/, "").normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/(\u2212)/gim, "-").localeCompare(parsedQuestionData.textContent.replace(/\n*$/, "").normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/(\u2212)/gim, "-")) === 0) {
										console.log("Odnaleziono odpowiedź. ");
										console.log(apiResponse[questionIndex].items);
										for (let subQuestionIndex = 0; subQuestionIndex < apiResponse[questionIndex].items.length; subQuestionIndex++) {
											const element = apiResponse[questionIndex].items[subQuestionIndex];
											if (element.answer && element.values) {
												var parsedSubQuestionData = new DOMParser().parseFromString(element.values[element.answer], "text/html").documentElement;
												console.log(`Sugestia odpowiedzi w pod-zadaniu ${subQuestionIndex + 1}: ` + parsedSubQuestionData.textContent);
											}
										}
										if (window.powtorHackDebug) console.log(apiResponseRaw);
										console.log("Operacja ukończona w " + (performance.now() - cheatStartTime) + "ms.");
										console.log("Uzyskano odpowiedzi w " + (performance.now() - answersGetTime) + "ms.");
										return;
									}
								}
							}

							// jeżeli wszystko zawiedzie, wyświetla surową odpowiedź API
							// uwaga. należy zwrócić uwagę na to, że apiResponseRaw nie jest tym samym co apiResponse. apiResponseRaw zawiera też informacje o typie zadania, ilości punktów, itp. nie koniecznie musi to interesować użytkownika.
							console.log("UWAGA! Nie odnaleziono odpowiedzi. Możesz nadal spróbować odnaleźć je ręcznie. ");
							console.log(apiResponse);
							console.log("Operacja ukończona w " + (performance.now() - cheatStartTime) + "ms.");
							console.log("Uzyskano odpowiedzi w " + (performance.now() - answersGetTime) + "ms.");
						}
					};
					apiRequest.send();
				});

			}
			document.getElementsByClassName("exam-exercise")[0].click();

		}
	}

	for (let index = 0; index < document.getElementsByClassName("new-exam").length; index++) {
		const element = document.getElementsByClassName("new-exam")[index];
		try {
			const element2 = document.getElementsByClassName("retry-exam")[index];
			element2.addEventListener("click", function () {
				examsHackStart();
			});
		} catch (e) {

		}
		element.addEventListener("click", function () {
			examsHackStart();
		});

	}
}

startCheat();