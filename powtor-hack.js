console.log("Cheat uruchamia się...");
console.log("Informacje i zgłaszanie błędów: https://github.com/Davilarek/PowtorHack");

var open = window.XMLHttpRequest.prototype.open;

var exeUrl = "";

function openReplacement(method, url, async, user, password) {
	this._url = url;
	exeUrl = arguments[1];
	return open.apply(this, arguments);
}
window.XMLHttpRequest.prototype.open = openReplacement;

document.getElementsByClassName("indicator exercise-mode ng-star-inserted")[0].parentElement.childNodes[0].click()

var xhr = new XMLHttpRequest();
xhr.open("GET", exeUrl);
var header1 = document.getElementsByClassName("content screen-exercises")[0].ownerDocument.cookie.split("; ")[0].split("=")
var header2 = document.getElementsByClassName("content screen-exercises")[0].ownerDocument.cookie.split("; ")[1].split("=")

window.XMLHttpRequest.prototype.open = open;

xhr.setRequestHeader("X-Authorization", header1[1]);
xhr.setRequestHeader("japa_phpsessid", header2[1]);

var arr = ['instruction', 'question'];

xhr.onreadystatechange = function () {
	if (xhr.readyState === 4) {
		let resp = JSON.parse(xhr.responseText).pool
		var questionData = document.getElementsByTagName("app-exercise-loader")[0].getElementsByClassName("ng-star-inserted");
		for (var i = 0; i < questionData.length; i++) {
			const contains = arr.some(element => {
				if (questionData[i].className.indexOf(element) !== -1) {
					return true;
				}

				return false;
			});
			if (!contains) {
				continue;
			}
			for (var i2 = 0; i2 < resp.length; i2++) {
				var instr = ""
				//console.log("instruction" in resp[i2])
				if ("instruction" in resp[i2])
					instr = resp[i2].instruction;
				if ("question" in resp[i2])
					instr = resp[i2].question;

				var doc = new DOMParser().parseFromString(instr, "text/html").documentElement;

				var question = questionData[i].childNodes[0];
				if (question.textContent == doc.textContent) {
					console.log("Odnaleziono odpowiedź. ");
					console.log(resp[i2].items);
					return;
					break;
				}
			}
		}
		console.log("UWAGA! Nie odnaleziono odpowiedzi. Możesz spróbować odnaleźć je ręcznie. ");
		console.log(resp);
	}
};
xhr.send();