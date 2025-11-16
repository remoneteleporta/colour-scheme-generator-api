const colourPick = document.getElementById("colour-picker")
const seedhexInput = document.getElementById("seed-colour-hex")

fetch("https://www.thecolorapi.com/scheme?hex=24B1E0&mode=triad&count=6")
.then(resp => resp.json())
.then(data => console.log(data))