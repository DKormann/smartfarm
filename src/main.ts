
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
let deposit = 100;

const scoredisplay = createElement("div", "deposit: " + deposit)
body.appendChild(scoredisplay)


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




const animaltypes = ["🐭","🐹","🐱","🐶","🐻","🐯","🦁","🐼","🐸","🐲",]

class animal{

  type : number
  element: HTMLElement
  alive: boolean = true

  constructor(t = 0){
    this.type = t
    this.element = createElement("div", animaltypes[t])
    this.element.className = "animal"
    setTimeout(() => {
      this.element.className = "animal active"
    }, 1);
  }

  remove(){
    this.element.className = "dead"
    setTimeout(()=>this.element.remove(), 1000)
    this.alive = false

  }

  worth() {
    return 2 ** this.type
  }


  evolve(p:number): void {
    let rand = Math.random()
    console.log(rand)
    
    if (rand < p) return this.remove()

    if (rand > 1 - p){ 
      if ((Math.random() > 0.5) && (this.type + 1 < animaltypes.length)) {
        this.type = Math.min(animals.length-1, this.type + 1)
        this.element.textContent = animaltypes[this.type]
        return
      }
      let n = new animal(this.type)
      this.element.insertAdjacentElement("afterend", n.element)
      animals.push(n)
    }
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
  
  animals.forEach(a =>a.evolve(p))
  animals = animals.filter(a => a.alive)

  if (animals.length==0){
    feedbutton.textContent= "neustart"
    feedbutton2.style.display = "none"
    deposit -= 1;
    scoredisplay.textContent = "score: " + deposit;
  }
    
}


stopbutton.addEventListener("click", () => {
  let score = animals.reduce((acc, a) => acc + a.worth(), 0);
  if (score > highscore){

    highscore = Math.max(highscore, score);
    highscoreelement.textContent = "highscore: " + animals.reduce((acc, a) => acc + animaltypes[a.type], "");
    alert("new highscore: " + highscore);

  }
  deposit += score - 1;
  scoredisplay.textContent = "deposit: " + deposit;
  for (let a of animals) {
    a.remove();
  }
  animals = [];
  step();
})

step()
feedbutton.addEventListener("click", ()=>{step(0.5)})
feedbutton2.addEventListener("click",()=> step(0.1))


