//classes
class Player{
    constructor(x,y,radius,color,canvas) {
        this.x=x;
        this.y=y;
        this.color=color;
        this.radius=radius;
        this.canvas=canvas;
    }
    draw(){
        this.canvas.beginPath();
        this.canvas.arc(this.x,this.y,this.radius, 0,Math.PI *2,false);
        this.canvas.fillStyle=this.color;
        this.canvas.fill();
    }
    update(){
        this.x= this.canvas.width/2;
        this.y= this.canvas.width/2;
    }
}
class Projectile{
    constructor(x,y,radius,color,velocity,canvas){
        this.x = x;
        this.y=y;
        this.radius=radius;
        this.color=color;
        this.velocity=velocity;
        this.canvas=canvas;
    }
    draw(){
        this.canvas.beginPath();
        this.canvas.arc(this.x,this.y,this.radius, 0,Math.PI *2,false);
        this.canvas.fillStyle=this.color;
        this.canvas.fill();
    }
    update(){
        this.x=this.x+this.velocity.x;
        this.y=this.y+this.velocity.y;
        this.draw();
    }

}
class Enemy{
    constructor(x,y,radius,color,velocity,canvas){
        this.x = x;
        this.y=y;
        this.radius=radius;
        this.color=color;
        this.velocity=velocity;
        this.canvas=canvas;
    }
    draw(){
        this.canvas.beginPath();
        this.canvas.arc(this.x,this.y,this.radius, 0,Math.PI *2,false);
        this.canvas.fillStyle=this.color;
        this.canvas.fill();
    }
    update(){
        this.x=this.x+this.velocity.x;
        this.y=this.y+this.velocity.y;
        this.draw();
    }
}
class Upgrade{
    constructor(jsonData) {
        this.id         = jsonData.id;
        this.name       = jsonData.name;
        this.cost       = jsonData.cost;
        this.maxLevel   = jsonData.maxLevel;
        this.baseValue  = jsonData.baseValue;
        this.upPerLevel = jsonData.upPerLevel;
    }
}
class UpgradeContainer{
    constructor(upgrade,list) {
        this.id         = upgrade.id;
        this.name       = upgrade.name;
        this.cost       = upgrade.cost;
        this.value      = upgrade.baseValue;
        this.box         = document.createElement("DIV");
        let button      = document.createElement("BUTTON");
        button.setAttribute("id","upgButt"+this.id);
        let buttonText = document.createTextNode(this.cost);
        let boxName = document.createTextNode(this.cost);
        let boxValue = document.createTextNode(this.value);
        button.appendChild(buttonText);
        this.box.appendChild(boxName);
        this.box.appendChild(boxValue);
        this.box.appendChild(button);
        this.addElemet(list);
    }
    addElemet(list){
        list.insertBefore(this.box,list.childNodes[0])
    }
}
//interface menu
function openNav() {
    if(document.getElementById("mySidebar").style.width === "250px"){
        document.getElementById("mySidebar").style.width = "0";
        document.getElementById("main").style.marginRight="0px";
    }
    else{
        document.getElementById("mySidebar").style.width = "250px";
        document.getElementById("main").style.marginRight="250px";
    }
}
function changeStop() {
    if(stop === true)
        stop=false;
    else{
        stop=true;
        animate();
    }
}

//listeners
window.addEventListener('click',(event)=>{

    let angle = Math.atan2(event.clientY-y,event.clientX-x);
    let velocity={
        x:Math.cos(angle),
        y:Math.sin(angle)
    }
    projectiles.push(new Projectile(x,y,5,'red',velocity,c))

})
window.addEventListener('resize',()=>{
    canvas.width = innerWidth;
    canvas.height= innerHeight;
    x = canvas.width/2;
    y = canvas.height/2;
    player.update();
})

//variable
let canvas      = document.querySelector('canvas');
canvas.width    = innerWidth;
canvas.height   = innerHeight;
let c           = canvas.getContext('2d');
let upgrades    = document.querySelector(".upgrades");
const allUpgrades = [];

let stop        = true;
let x           = canvas.width/2;
let y           = canvas.height/2;
// objects
const player        = new Player(canvas.width/2,canvas.height/2,50,"#676767FF",c)
const projectiles   = [];
const enemies       = [];

//function of game
function spawnEnemies(){
    setInterval(()=>{
        // Jesli wcisnelismy stop
        // maksymalna ilosc wrogów na ekranie && enemies.length<5
        if(stop )
        {
            let xE;
            let yE;
            let radius=Math.random()*(30-10)+10;
            if(Math.random()<0.5){
                xE=Math.random()<0.5? 0-radius:radius+canvas.width;
                yE=Math.random()*canvas.height;
            }
            else{
                xE=Math.random()*canvas.width;
                yE=Math.random()<0.5? 0-radius:radius+canvas.height;
            }

            const angle = Math.atan2(y-yE,x-xE);

            let color='green'
            let velocity={
                x:Math.cos(angle)*2,
                y:Math.sin(angle)*2
            }
            enemies.push(new Enemy(xE,yE,radius,color,velocity,c))
        }
 /* tutaj pojawianie przeciwników*/
    },1000)
}
function animate(){
    if(stop){
        requestAnimationFrame(animate)
        c.clearRect(0,0,canvas.width,canvas.height)
        player.draw();
        projectiles.forEach((projectile, projectileId)=>{
            projectile.update()
            if(projectile.x> canvas.width ||projectile.x< 0 ||
                projectile.y> canvas.height ||projectile.y< 0){
                projectiles.splice(projectileId,1);
            }

        })
        enemies.forEach((enemy, enemyId)=>{
            enemy.update();
            projectiles.forEach((projectile, projectileId)=>{
                const dist= Math.hypot(projectile.x-enemy.x,projectile.y-enemy.y)
                if (dist<=projectile.radius+enemy.radius){
                    projectiles.splice(projectileId,1);
                    enemies.splice(enemyId,1);
                }
            })
        }
        )
    }
}
function loadUpgrades(){
    fetch("./listOfUpgrades.json")
        .then(response => {
            return response.json();
        })
        .then(jsonData => {
            //  CREATE AND SAVE UPGRADES IN upgradeList
            for(let i = 0; i<jsonData.upgrades.length; i++){
                allUpgrades.push(new Upgrade(jsonData.upgrades[i]));
                let box         = document.createElement("UL");
                let button      = document.createElement("BUTTON");
                let boxName     = document.createTextNode(allUpgrades[i].name);
                let boxValue    = document.createTextNode(allUpgrades[i].value);
                button.setAttribute("id","upgButt");
                button.setAttribute("value", allUpgrades[i].id);
                button.setAttribute("onClick","funkcja(this.value)");
                button.textContent= allUpgrades[i].cost;
                box.innerHTML="<tr>cena: </tr><tr>nazwa </tr>"
                box.setAttribute("class","upgrade")
                box.appendChild(boxName);
                box.appendChild(boxValue);
                box.appendChild(button);
                upgrades.appendChild(box);
            }
        });
}
function funkcja(value){
    console.log(value);
}
function loadlist(){
   // console.log(allUpgrades.length)
}
//main
loadUpgrades()
loadlist();
spawnEnemies();
animate();
