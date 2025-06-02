export {}
const skins = ["🐭","🐹","🐱","🐶","🐻","🐯","🦁","🐼","🐸","🐲",]

class Writable<T> {
  private value: T;
  subscribers = new Set<(value: T) => void>();

  constructor(value: T) {
    this.value = value;
  }

  subscribe(callback: (value: T) => void): void {
    this.subscribers.add(callback);
    callback(this.value);
  }

  get(): T {
    return this.value;
  }
  
  set(value: T): void {
    this.value = value;
    this.subscribers.forEach(callback => callback(value));
  }

  update(updater: (value: T) => T): void {
    this.set(updater(this.value));
  }

}
const body = document.body;

function createHtmlElement<T extends keyof HTMLElementTagNameMap>(tag: T, append = false): HTMLElementTagNameMap[T] {
  const element = document.createElement(tag);
  if (append) body.appendChild(element);
  return element;
}

const h = createHtmlElement("h1", true);
h.textContent = "Smart Farm";

const balance = new Writable(100);

const balanceElement = createHtmlElement("p", true);
balance.subscribe(value => {
  balanceElement.textContent = `bank: ${value}$`;
});

const animals = new Writable<Animal[]>([]);
const animalsElement = createHtmlElement("div", true);
animalsElement.id= "animals";

const highscore = new Writable(0);
const highscoreElement = createHtmlElement("p", true);
highscore.subscribe(value => {
  navigator?.vibrate?.([100, 50, 100]);
  highscoreElement.textContent = `highscore: ${animals.get().reduce((sum, animal) => sum + animal.face(), "")}`;
});


class Animal{
  type: number;
  element: HTMLElement;
  alive = true;

  constructor(type:number){
    this.type = type;
    this.element = createHtmlElement("div", true);
    this.element.textContent = this.face();
    this.element.className = "animal";
    setTimeout(() => this.element.classList.add("active"), 1);
  }

  remove(){
    this.alive = false;
    this.element.classList.add("dead");
    setTimeout(() => {
      this.element.remove();
    },1000);
  }

  face(): string{
    return skins[this.type];
  }

  worth(): number {
    if (!this.alive) return 0;
    return Math.pow(2, this.type);
  }

  update(grow :Boolean): Animal[] {

    const random = Math.random();
    const p = 0.3;

    if (random < p){
      this.remove();
      return [];
    }

    this.element.classList.remove("wiggle")
    setTimeout(() => {
      this.element.classList.add("wiggle");
    }, 1);

    if (random < p*2){
      if (grow && this.type + 1 < skins.length) {
        navigator?.vibrate?.(20);
        this.type += 1;
        this.element.textContent = this.face();
      }else{
        const newone = new Animal(this.type);
        
  
        this.element.insertAdjacentElement("afterend", newone.element);
        newone.element.classList.add("wiggle");
        return [this,newone];
      }
    }

    return [this];
  }
}

const button1 = createHtmlElement("button", true);
const button2 = createHtmlElement("button", true);
button1.className = "bigbutton";
button2.className = "bigbutton";

button1.id = "button1";
button2.id = "button2";

button1.textContent = "Beef 🍖";
button2.textContent = "Broc 🥦";

function startGame(){
  if (animals.get().length > 0) return
  balance.set(balance.get() - 1);
  const fst = new Animal(0);
  animalsElement.appendChild(fst.element);
  animals.set([fst]);
  button2.style.display = "inline-block";

}

document.addEventListener("click", (e) => {
  if (e.target == sellbutton || e.target == button2) return;
  startGame();
})


button1.onclick = ()=>updateAnimals(true);
button2.onclick = ()=>updateAnimals(false);

function updateAnimals(grow = false) {
  animals.update(currentAnimals => {
    let res: Animal[] = [];
    currentAnimals.forEach(animal => {
      if (animal.alive) res.push(...animal.update(grow));
    })
    return res;
  })
}

createHtmlElement("p", true)
const sellbutton = createHtmlElement("button", true);
sellbutton.className = "bigbutton";
sellbutton.textContent = "Sell";
sellbutton.style.backgroundColor = "grey";

const starttag = createHtmlElement("p", true);
starttag.textContent = "Click to start the game";

sellbutton.onclick = () => {
  const value = animals.get().reduce((sum, animal) => sum + animal.worth(),0);
  balance.update(b => b + value);
  animals.get().forEach(animal => animal.remove());
  if (value > highscore.get()) highscore.set(value);
  animals.set([]);
};

animals.subscribe(currentAnimals => {
  if (currentAnimals.length > 0) {
    starttag.style.display = "none";
    sellbutton.style.display = "inline-block";
    button1.style.display = "inline-block";
    button2.style.display = "inline-block";
    const value = currentAnimals.reduce((sum, animal) => sum + animal.worth(),0);
    sellbutton.textContent = `Sell for ${value}$`;
  } else {
    sellbutton.style.display = "none";
    button1.style.display = "none";
    button2.style.display = "none";
    starttag.style.display = "block";
  }
})