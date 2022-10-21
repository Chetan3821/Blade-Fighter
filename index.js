const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0,0,canvas.width,canvas.height)

const gravity = 0.7

const background = new Sprite({
    position :{
        x : 0 ,
        y : 0
    },
    imageSrc : './Assests/background.png'

})

const shop = new Sprite({
    position :{
        x : 600 ,
        y : 128
    },
    imageSrc : './Assests/shop.png' ,
    scale : 2.75 ,
    framesMax : 6

})

const  player = new Fighter({
    position : {
    x : 300,
    y : 0
    },
    velocity : {
        x : 0,
        y : 0
    },
    offset : {
        x : 0,
        y : 0
    },
    imageSrc : './Assests/samuraiMack-20220915T164232Z-001/samuraiMack/Idle.png' ,
    framesMax : 8,
    scale : 2.5,
    offset: {
        x : 215,
        y : 157
    },
    sprites : {
        idle :{
            imageSrc : './Assests/samuraiMack-20220915T164232Z-001/samuraiMack/Idle.png' ,
            framesMax : 8
        },
        run :{
            imageSrc : './Assests/samuraiMack-20220915T164232Z-001/samuraiMack/Run.png' ,
            framesMax : 8 
        },
        jump :{
            imageSrc : './Assests/samuraiMack-20220915T164232Z-001/samuraiMack/Jump.png' ,
            framesMax : 2            
        },
        fall : {
            imageSrc : './Assests/samuraiMack-20220915T164232Z-001/samuraiMack/Fall.png' ,
            framesMax : 2  
        },
        attack1 : {
            imageSrc : './Assests/samuraiMack-20220915T164232Z-001/samuraiMack/Attack1.png' ,
            framesMax : 6  
        },
        takeHit : {
            imageSrc : './Assests/samuraiMack-20220915T164232Z-001/samuraiMack/Take Hit 2.png' ,
            framesMax : 4
        },
        death : {
            imageSrc : './Assests/samuraiMack-20220915T164232Z-001/samuraiMack/Death.png' ,
            framesMax : 6
        }
    },
    attackBox : {
        offset : {
            x : 100 ,
            y : 50
        },
        width : 160,
        height : 50
    }
})


const  enemy = new Fighter({
    position : {
    x : 600,
    y : 100
    },
    velocity : {
        x : 0,
        y : 0
    },
    color : 'blue',
    offset : {
        x : -50,
        y : 0
    },
    imageSrc : './Assests/kenji-20220915T164227Z-001/kenji/Idle.png' ,
    framesMax : 4,
    scale : 2.5,
    offset: {
        x : 215,
        y : 167
    },
    sprites : {
        idle :{
            imageSrc : './Assests/kenji-20220915T164227Z-001/kenji/Idle.png' ,
            framesMax : 4
        },
        run :{
            imageSrc : './Assests/kenji-20220915T164227Z-001/kenji/Run.png' ,
            framesMax : 8 
        },
        jump :{
            imageSrc : './Assests/kenji-20220915T164227Z-001/kenji/Jump.png' ,
            framesMax : 2            
        },
        fall : {
            imageSrc : './Assests/kenji-20220915T164227Z-001/kenji/Fall.png' ,
            framesMax : 2  
        },
        attack1 : {
            imageSrc : './Assests/kenji-20220915T164227Z-001/kenji/Attack1.png' ,
            framesMax : 4  
        },
        takeHit : {
            imageSrc : './Assests/kenji-20220915T164227Z-001/kenji/Take hit.png',
            framesMax : 3 
        },
        death : {
            imageSrc : './Assests/kenji-20220915T164227Z-001/kenji/Death.png' ,
            framesMax : 7  
        }
    },
    attackBox : {
        offset : {
            x : -170 ,
            y : 50
        },
        width : 170,
        height : 50
    }
})

console.log(player)

const keys = {
    a : {
        pressed:false
    },
    d : {
        pressed:false
    },
    w : {
        pressed:false
    },
    ArrowRight : {
        pressed:false
    },
    ArrowLeft : {
        pressed:false
    }
}

decreaseTimer()

function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0,0,canvas.width,canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255,255,255,0.15)'
    c.fillRect(0,0,canvas.width,canvas.height)
    player.update()
    enemy.update()

    // to stop the player and enemy from moving continous 
    player.velocity.x = 0
    enemy.velocity.x = 0

    //player movement

    if(keys.a.pressed  &&  player.lastkey === 'a' ){
        player.velocity.x= -5
        player.switchSprite('run')
    }else if(keys.d.pressed &&  player.lastkey === 'd'){
        player.velocity.x= 5
        player.switchSprite('run')
    }
    else{
        player.switchSprite('idle')
    }

    // jumping
    if (player.velocity.y < 0){
        player.switchSprite('jump')
    }
    else if (player.velocity.y>0){
        player.switchSprite('fall')
    }

    //enemy movement
    if(keys.ArrowLeft.pressed  && enemy.lastkey === 'ArrowLeft' ){
        enemy.velocity.x= -5
        enemy.switchSprite('run')
    }else if(keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight'){
        enemy.velocity.x= 5
        enemy.switchSprite('run')
    }
    else{
        enemy.switchSprite('idle')
    }

     // jumping
     if (enemy.velocity.y < 0){
        enemy.switchSprite('jump')
    }
    else if (enemy.velocity.y>0){
        enemy.switchSprite('fall')
    }

    // detect for collision & enemy gets hit

    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking && player.framesCurrent === 4
    ){
        enemy.takeHit()
        player.isAttacking = false
        gsap.to('#enemyhealth',{
            width:enemy.health + '%'
        }) 
        
    }

    //  if player misses 
    if(player.isAttacking && player.framesCurrent === 4 ) {
        player.isAttacking = false
    }

    // this is where our player gets hit

    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking && enemy.framesCurrent === 2
    ){
        player.takeHit()
        enemy.isAttacking = false
         gsap.to('#playerhealth',{
            width:player.health + '%'
        }) 
    }
    //  if enemy misses 
    if(enemy.isAttacking && enemy.framesCurrent === 2 ) {
        enemy.isAttacking = false
    }

    // end the game based on health

    if(enemy.health <= 0 || player.health <= 0 ){
        determineWinner({player,enemy,timerId})
    }

}

animate()

window.addEventListener('keydown',(event) => {
    if (!player.dead){
        switch(event.key){
            case 'd' :
                keys.d.pressed = true
                player.lastkey = 'd'
                break
            case 'a' :
                keys.a.pressed = true
                player.lastkey = 'a'
                break
            case 'w' :
                player.velocity.y =-20
                break 
            case ' ' :
                player.attack()
                break  
        }
    } 
    if (!enemy.dead){
        switch(event.key){
            case 'ArrowRight' :
            keys.ArrowRight.pressed = true
            enemy.lastkey = 'ArrowRight'
            break
        case 'ArrowLeft' :
            keys.ArrowLeft.pressed = true
            enemy.lastkey = 'ArrowLeft'
            break
        case 'ArrowUp' :
            enemy.velocity.y =-20
            break      
        case 'ArrowDown' :
            enemy.attack()
            break    
        }
    }
})

window.addEventListener('keyup',(event) => {
    switch(event.key){
        case 'd' :
            keys.d.pressed = false
            break
        case 'a' :
            keys.a.pressed = false
            break   
        case 'w' :
            keys.w.pressed = false
            break 
    }   
    // enemy keys
    switch(event.key){
        case 'ArrowRight' :
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft' :
            keys.ArrowLeft.pressed = false
            break    
    }
})


//  FOR LIGHT SWITCH

document.addEventListener("DOMContentLoaded",function(){
	let slider = this.getElementById("brightness");
	slider.addEventListener("input",adjustSlider);
	adjustSlider(slider);
});
function adjustSlider(e) {
	let body = document.body,
		switchLightMin = 40,
		switchLightMax = 100,
		tar = e.target || e,
		pct = +tar.value / +tar.max,
		L1 = pct * (switchLightMax - switchLightMin) + switchLightMin,
		L2 = L1 - 10,
		L3 = L1  - 37,
		L = [L1,L2,L3],
		thumbHueMin = 0,
		thumbHueMax = 120,
		thumbHue = pct * (thumbHueMax - thumbHueMin) + thumbHueMin,
		thumbSat = 90.4,
		thumbLight = 44.9,
		thumbHSL = `${thumbHue},${thumbSat}%,${thumbLight}%`;

	// update the slider shade
	L.forEach((light,i) => {
		if (light < 0)
			light = 0;
		body.style.setProperty(`--l${i + 1}`,`hsl(228,9.8%,${light}%)`);
	});
	// update the thumb icon hue
	body.style.setProperty(`--p`,`hsl(${thumbHSL})`);
	body.style.setProperty(`--pT`,`hsla(${thumbHSL},0)`);
}
