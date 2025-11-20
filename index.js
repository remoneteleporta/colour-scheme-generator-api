const seedColourInput = document.getElementById("seed-colour-input")
const seedHexInput = document.getElementById("seed-colour-hex")
const getSchemeBtn = document.getElementById("get-scheme-btn")
const schemeType = document.getElementById("scheme-type")
const colourRender = document.getElementById("colour-palette-display")

window.addEventListener("load", ()=>{
    let storedInput = JSON.parse(localStorage.getItem("colourInput")).toUpperCase()
    seedHexInput.value = storedInput
    seedColourInput.value = storedInput
})

/* Getting Seed Colour Input as Hex Code */

seedHexInput.addEventListener("input", function(){
     if (/^#([0-9A-F]{6})$/i.test(seedHexInput.value)) {
        seedColourInput.value = DOMPurify.sanitize(seedHexInput.value)
    }
})

seedColourInput.addEventListener("input", function(){
    seedHexInput.value = DOMPurify.sanitize(seedColourInput.value.toUpperCase())
})

/* Parameter Input & API fetch & Input Local Store */

getSchemeBtn.addEventListener("click", () => {

localStorage.setItem("colourInput", JSON.stringify(seedColourInput.value))

let hashlessHex = DOMPurify.sanitize(seedColourInput.value.replace('#',''))
let apiParameter = `hex=${hashlessHex}&mode=${schemeType.value}&count=5`

fetch(`https://www.thecolorapi.com/scheme?${apiParameter}`)
.then(resp => resp.json())
.then(data => {
    if(data.seed.hex.clean === hashlessHex.toUpperCase())
    {
    getColour(data)
    }
    })
})

/* Get Scheme Colours from API and store in Array */

function getColour(coloursObject){
    let paletteArray = []
    for(let i=0; i < coloursObject.count; i++)
    {
        paletteArray.push(coloursObject.colors[i].hex.value)
    }
    renderScheme(paletteArray)
}

/* Render Palette */

function renderScheme(colourPalette){

colourRender.innerHTML = colourPalette.map(function(colours){
    return `<div class="colour-column">
           <div class="colour-bar" id="${colours.replace('#','')}"></div>
           <p class="colour-hex-code" id="${colours.replace('#','')}">${colours}</p>
       </div>`
    }).join("")

document.querySelectorAll('.colour-bar').forEach(bar => {
  const hexCode = bar.id; 
  bar.style.background = `#${hexCode}`;
  
})
}

/* Copying Colour Hexcode to Clipboard */
colourRender.addEventListener('click', e =>
    copyClipboardText(e.target.id)
)

async function copyClipboardText(text) {
  try {
    await navigator.clipboard.writeText(text);
    let copyStatus = document.getElementById("status-msg")
    
    copyStatus.style.display = "block";

    setTimeout(() => {
        copyStatus.style.display = "none";
    }, 2000);
  } 
  catch (error) {
    console.error(error.message);
  }
}