
export {}



const body = document.body

body.innerHTML = "<h1>smartfarm</h1>"

let highscore = 0;


function createElement(tag: string, text: string): HTMLElement {
  const element = document.createElement(tag);
  element.textContent = text;
  return element;
}

let highscoreelement = createElement("span", "highscore: 0")
body.appendChild(highscoreelement)


body.appendChild(createElement("p", "Feed your animals:"))

const feedtext = "Futtr🍖"
const feedtext2 = "Futta🥦"

const feedbutton = createElement("button", feedtext)
const feedbutton2 = createElement("button", feedtext2)

feedbutton.id = "feedbutton"
feedbutton2.id = "feedbutton2"

const animalelement = createElement("div", "")
animalelement.id = "animals"
body.appendChild(animalelement)
body.appendChild(feedbutton)
body.appendChild(feedbutton2)

const highscoredisplay = createElement("div", "")
body.appendChild(highscoredisplay)

const stopbutton = createElement("button", "verkaufen")
stopbutton.id = "feedbutton"
stopbutton.style.background = "grey"
body.appendChild(stopbutton)


// animals go from mouse to hamster to bigger and bigger animals
// represented by emojis. the biggest animal is the green snake dragon
const animaltypes = [
  "🐭",
  "🐹",
  "🐱",
  "🐶",
  "🐻",
  "🐯",
  "🦁",
  "🐼",
  "🐸",
  "🐲",
]

class animal{

  type : number
  element: HTMLElement

  constructor(t = 0){
    this.type = t
    this.element = createElement("div", animaltypes[t])
    this.element.className = "animal"
    animalelement.appendChild(this.element)
    setTimeout(() => {
      this.element.className = "animal active"
    }, 1);
  }

  remove(){
    this.element.className = "dead"
    setTimeout(()=>this.element.remove(), 1000)
    return []
  }

  worth() {
    return 2 ** this.type
  }


  evolve(p:number): animal[] {
    let rand = Math.random()
    
    if (rand < p) return this.remove()

    if (rand > 1 - p) {
      if (Math.random() > 0.5) if (this.type + 1 < animaltypes.length){
        this.remove()
        return [new animal(this.type + 1)]
      }
      return [this, new animal(this.type)]
    }

    return [this]
  }
  
}

let animals : animal[] = []

function step(p = 0.2){
  if (animals.length == 0){
    animals = [new animal()]
    animalelement.appendChild(animals[0].element)
    feedbutton.textContent = feedtext;
    feedbutton2.style.display = "inline"
    return
  }
  
  animals = animals.flatMap(a => a.evolve(p))
  console.log(animals);
  

  if (animals.length==0){
    feedbutton.textContent= "neustart"
    feedbutton2.style.display = "none"
  }

  let score = animals.reduce((acc, a) => acc + a.worth(), 0);
  stopbutton.style.display = "none"
  if (score>highscore){
    stopbutton.style.display = "inline"
  }
    
}


stopbutton.addEventListener("click", () => {
  let score = animals.reduce((acc, a) => acc + a.worth(), 0);
  highscore = Math.max(highscore, score);
  highscoreelement.textContent = "highscore: " + animals.reduce((acc, a) => acc + animaltypes[a.type], "");
  alert("new highscore: " + highscore);
  stopbutton.style.display = "none";
  for (let a of animals) {
    a.remove();
  }
  animals = [];
  step();
})

step()

feedbutton.addEventListener("click", ()=>{
  step(0.2)
})

feedbutton2.addEventListener("click",()=> step(0.1))
// show()


