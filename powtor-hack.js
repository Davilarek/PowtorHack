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

xhr.onreadystatechange = function() {
	if (xhr.readyState === 4) {
		let resp = JSON.parse(xhr.responseText).pool
		var myspans = document.getElementsByTagName("app-exercise-loader")[0].getElementsByClassName("ng-star-inserted");
		for (var i = 0; i < myspans.length; i++) {
			const contains = arr.some(element => {
				if (myspans[i].className.indexOf(element) !== -1) {
					return true;
				}

				return false;
			});
			if (!contains) {
				continue;
			}
			for (var i2 = 0; i2 < resp.length; i2++) {
				var instr = ""
				if (resp[i2]["instruction"])
					instr = resp[i2].instruction;
				if (resp[i2]["question"])
					instr = resp[i2].question;
				
				var doc = new DOMParser().parseFromString(instr, "text/html").documentElement;

				var myspan = myspans[i].childNodes[0];
				if (myspan.textContent == doc.textContent) {
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