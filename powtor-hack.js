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
		for (var i = 0; i < questionData.length; i++) {
			const contains = questionClassNames.some(element => {
				if (questionData[i].className.indexOf(element) !== -1) {
					return true;
				}
				return false;
			});
			if (!contains) {
				continue;
			}
			for (var i2 = 0; i2 < apiResponse.length; i2++) {
				var questionInfo = ""
				//console.log("instruction" in resp[i2])
				if ("instruction" in apiResponse[i2])
					questionInfo = apiResponse[i2].instruction;
				if ("question" in apiResponse[i2])
					questionInfo = apiResponse[i2].question;

				var parsedQuestionData = new DOMParser().parseFromString(questionInfo, "text/html").documentElement;

				var question = questionData[i].childNodes[0];
				if (question.textContent == parsedQuestionData.textContent) {
					console.log("Odnaleziono odpowiedź. ");
					console.log(apiResponse[i2].items);
					return;
					break;
				}
			}
		}
		console.log("UWAGA! Nie odnaleziono odpowiedzi. Możesz spróbować odnaleźć je ręcznie. ");
		console.log(apiResponse);
	}
};
apiRequest.send();