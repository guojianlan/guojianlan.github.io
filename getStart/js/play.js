/**
 * Created by guojian on 15/9/24.
 */
var playState = {
    create:function(){
        //开启物理系统
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.add.image(0,0,'sky');
        //创建地面组
        this.dimiangroup = game.add.group();
        //地面组使用物理环境
        this.dimiangroup.enableBody=true;
        this.zuixiamian = this.dimiangroup.create(0,game.height-64,'ground');
        this.zuixiamian.scale={x:2,y:2};
        //在物理环境中保持不动
        this.zuixiamian.body.immovable=true;
        this.leftmian =  this.dimiangroup.create(-150,250,'ground');
        this.leftmian.body.immovable=true;
        this.rightmian =  this.dimiangroup.create(400,400,'ground');
        this.rightmian.body.immovable=true;
        this.dude = game.add.sprite(32, game.world.height - 150,'dude');
        //对物体开启物理系统
        game.physics.arcade.enable(this.dude);
        //对物体给一个向下的重力gravity
        this.dude.body.gravity.y=300;
        //对物体给一个反弹速度
        this.dude.body.bounce.y=0.2;
        //设置物理的界限
        this.dude.body.collideWorldBounds = true;
        //加入人物的运动
        this.dude.animations.add('left',[0,1,2,3],10,true);
        this.dude.animations.add('right',[5,6,7,8],10,true);
        //按键
        this.course = game.input.keyboard.createCursorKeys()
        this.swipe = '';
        //生成星星组
        this.starts = game.add.group();
        this.starts.enableBody = true;
        this.score=0;
        this.textscope = game.add.text(game.world.centerX,100,'Score:'+this.score,{fontStyle:'bold Arial',fill:'#fff',fontSize:'48px'});
        this.textscope.anchor.setTo(0.5,0.5);
        this.looptime = game.time.events.loop(900,this.newStart,this);
    },
    update:function(){
        //设置物体的碰撞

        game.physics.arcade.collide(this.dude, this.dimiangroup);
        game.physics.arcade.collide(this.starts, this.dimiangroup);
        game.physics.arcade.overlap(this.dude,this.starts,this.collectStar,null,this);
       //设置人物的移动速度
       this.dude.body.velocity.x=0;
        if(this.course.left.isDown){
            this.dude.body.velocity.x=-150;
            this.dude.animations.play('left');
        }else if(this.course.right.isDown){
            this.dude.body.velocity.x=150;
            this.dude.animations.play('right');
        }else{
            this.dude.animations.stop();
            this.dude.frame=4;
        }
        if(this.course.up.isDown && this.dude.body.touching.down){
            this.dude.body.velocity.y=-320;
        }
        //if(this.swipe=='right'){
        //    this.dude.body.velocity.x=150;
        //    this.dude.animations.play('right');
        //}else if(this.swipe=='left'){
        //    this.dude.body.velocity.x=-150;
        //    this.dude.animations.play('left');
        //}else{
        //    this.dude.frame=4;
        //    this.dude.animations.stop();
        //}
        //if(this.course.left.isDown){
        //    this.swipe='left';
        //}
        //if(this.course.right.isDown){
        //    this.swipe='right';
        //}
    },
    newStart:function(){
       var star = this.starts.create(Math.random()*780,0,'start');
        star.body.gravity.y=300;
        star.body.bounce.y=0.4+Math.random()*0.2;
        setTimeout(function(){
            star.kill();
        },4000);
    },
    collectStar:function(dude,star){
        star.kill();
        this.score+=10;
        if(this.score==100){
            this.looptime.delay=700;
        }
        if(this.score==200){
            this.looptime.delay=500;
        }
        this.textscope.text='Score:'+this.score;
    }
};