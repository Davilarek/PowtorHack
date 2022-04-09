console.log("Cheat uruchamia się...");
console.log("Informacje i zgłaszanie błędów: https://github.com/Davilarek/PowtorHack");

var open = window.XMLHttpRequest.prototype.open;

var questionApiUrl = "";

function openReplacement(method, url, async, user, password) {
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

				var parsedQuestionData = new DOMParser().parseFromString(questionInfo, "text/html").documentElement;

				var question = questionData[questionElements].childNodes[0];
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