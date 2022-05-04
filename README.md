# PowtorHack

Cheat do PowtórkoMatu 8.

Uwaga. Nie wszystkie typy pytań są wspierane. Mimo to i tak otrzymasz odpowiedzi.
Np. zadania, które nie zmieniają swojego pytania nie działają prawidłowo, między innymi prawda/fałsz. 

# Użycie

Otwórz zadanie  ~~(Ćwiczenia powtórzeniowe, Testy nie są aktualnie wspierane)~~ (Dla Ćwiczeń powtórzeniowych np Powtórka 1, zadanie 2; dla testów wystarczy wkleić w menu głównym Testów Sprawdzających) > Ctrl + Shift + I > Konsola > Wklej kod znajdujący się poniżej \\/ > Enter > Powtórz na każdym pytaniu

```
fetch("https://raw.githubusercontent.com/Davilarek/PowtorHack/main/powtor-hack.js")
.then((res) => res.text()
.then((t) => eval(t)))
```
Uwaga. Zbyt częste wysyłanie prośby do serwera o listę odpowiedzi może opóźnić połączenie lub nawet je zablokować. Używasz na własną odpowiedzialność.
