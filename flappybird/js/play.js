var playState = {
    create:function(){
        var self = this;
        this.background = game.add.tileSprite(0,0,game.width,game.height,'background');
        this.ground = game.add.tileSprite(0,game.height-112,game.width,112,'ground');
        this.pipeGroup = game.add.group(); // 添加管道组
        this.pipeGroup.enableBody=true;
        this.bird = game.add.sprite(50,150,'bird');
        this.bird.animations.add('fly');
        this.bird.animations.play('fly',12,true);
        this.bird.anchor={x:0.5,y:0.5};
        game.physics.enable(this.bird,Phaser.Physics.ARCADE); //开启鸟的物理系统
        this.bird.body.gravity.y = 0; //给鸟设一个重力,开始为0
        game.physics.enable(this.ground,Phaser.Physics.ARCADE); //开启鸟的物理系统
        this.ground.body.immovable = true; //让地面在物理环境中固定不动
        this.readyText = game.add.image(game.width/2,40,'ready_text');
        this.readyText.anchor={x:0.5,y:0};
        this.playTip = game.add.image(game.width/2,350,'play_tip');
        this.playTip.anchor={x:0.5,y:0};
        this.hasgamestart=false;

        this.soundFly = game.add.sound('fly_sound');//加载点击页面声音
        this.soundHitGround = game.add.sound('hit_ground_sound'); // 加载与地面撞击的声音
        this.soundHitPipeGroup = game.add.sound('hit_pipe_sound'); // 加载与管道撞击的声音
        this.scoreSound = game.add.sound('score_sound');
        game.time.events.loop(900,this.generatePipes,this);
        game.time.events.stop(false);
        game.input.onDown.addOnce(this.startGame,this);
    },
    startGame:function(){
        this.gameSpeed = 200;//移动速度
        this.score = 0;//得分
        this.hasHitGround=false;//是否撞击地板
        this.gameIsOver=false;
        this.scoreText = game.add.bitmapText(game.world.centerX-20, 30, 'flappy_font', '0', 36);
        this.background.autoScroll(-(this.gameSpeed/10),0);
        this.ground.autoScroll(-this.gameSpeed,0);
        this.bird.body.gravity.y=1150;
        this.readyText.destroy();
        this.playTip.destroy();
        this.hasgamestart=true;
        game.input.onDown.add(this.fly,this);
        game.time.events.start(); //启动时钟事件，开始制造管道
    },
    fly:function(){
        this.bird.body.velocity.y=-350;
        game.add.tween(this.bird).to({angle:-30},100,null,true,0,0,false);
        this.soundFly.play();
    },
    generatePipes:function(gap){
        //产生管道
        gap = gap || 100;
        var position = (505 - 320 - gap) + Math.floor((505 - 112 - 30 - gap - 505 + 320 + gap) * Math.random());//计算出一个上下管道之间的间隙的随机位置
        var topPipeY = position-360; // 上方位置
        var bottomPipeY = position+gap;// 下方位置
        if(this.resetPipe(topPipeY,bottomPipeY)) return; //如果有出了边界的管道，则重置他们，不再制造新的管道了,达到循环利用的目的
        game.add.sprite(game.width,topPipeY,'pipe',0,this.pipeGroup);
        game.add.sprite(game.width,bottomPipeY,'pipe',1,this.pipeGroup);
        this.pipeGroup.setAll('checkWorldBounds',true); //边界检测
        this.pipeGroup.setAll('outOfBoundsKill',true); //出边界后自动kill
        this.pipeGroup.setAll('body.velocity.x', -this.gameSpeed); //设置管道运动的速度
    },
    update:function(){
        if(!this.hasgamestart) return; //游戏未开始,先不执行任何东西
        game.physics.arcade.collide(this.bird,this.ground,this.hitGround,null,this);//撞击地面
        game.physics.arcade.overlap(this.bird,this.pipeGroup,this.hitPipe,null,this);//撞击管道
        if(this.bird.angle < 90) this.bird.angle += 2.5; //下降时鸟的头朝下的动画
        this.pipeGroup.forEachExists(this.checkScore,this); // 根据过了管道来增加分数
    },
    resetPipe : function(topPipeY,bottomPipeY){//重置出了边界的管道，做到回收利用
        var i = 0;
        this.pipeGroup.forEachDead(function(pipe){ //对组调用forEachDead方法来获取那些已经出了边界，也就是“死亡”了的对象
            if(pipe.y<=0){ //是上方的管道
                pipe.reset(game.width, topPipeY); //重置到初始位置
                pipe.hasScored = false; //重置为未得分
            }else{//是下方的管道
                pipe.reset(game.width, bottomPipeY); //重置到初始位置
            }
            pipe.body.velocity.x = -this.gameSpeed; //设置管道速度
            i++;
        }, this);
        return i >=2; //如果 i==2 代表有一组管道已经出了边界，可以回收这组管道了
    },
    hitGround:function(){
        if(this.hasHitGround){
            return;
        }
        //已经撞击过地面
        this.hasHitGround=true;
        this.soundHitGround.play();
        this.gameOver(true);
    },
    hitPipe:function(){
        if(this.gameIsOver){
            return;
        }
        //如果已经over就不用判断了
        this.soundHitPipeGroup.play();
        this.gameOver();
    },
    gameOver:function(show_text){

        this.gameIsOver=true;
        this.stopGame();
        if(show_text){
            this.showGameOverText();
        }
    },
    stopGame:function(){
        this.background.stopScroll();
        this.ground.stopScroll();
        this.pipeGroup.forEachExists(function(pipe){
            pipe.body.velocity.x=0;
        });
        this.bird.animations.stop('fly',0);
        game.input.onDown.remove(this.fly,this);
        game.time.events.stop(true);

    },
    checkScore:function(pipe){
        if(!pipe.hasScored && pipe.y<=0 && pipe.x<=this.bird.x-17-54){ // 检测鸟是否已经飞过管道
            pipe.hasScored=true;
            this.scoreText.text = ++this.score;//分数加1
            this.scoreSound.play();//播放得分声音
            return true;
        }
        return false;
    },
    showGameOverText:function(){
        this.scoreText.destroy();
        game.bestScore = game.bestScore || 0;
        if(this.score > game.bestScore) game.bestScore = this.score; //最好分数
        this.gameOverGroup = game.add.group(); //添加一个组
        var gameOverText = this.gameOverGroup.create(game.width/2,0,'game_over'); //game over 文字图片
        var scoreboard = this.gameOverGroup.create(game.width/2,70,'score_board');
        var currentScoreText = game.add.bitmapText(game.width/2+60,105,'flappy_font',this.score+'',20,this.gameOverGroup);
        var bestScoreText = game.add.bitmapText(game.width/2+60,153,'flappy_font',game.bestScore+'',20,this.gameOverGroup);
        var replayBtn = game.add.button(game.width/2,210,'btn',function(){
            game.state.start('play');
        },this, null, null, null, null, this.gameOverGroup);
        gameOverText.anchor={x:0.5,y:0};
        scoreboard.anchor.setTo(0.5, 0);
        replayBtn.anchor.setTo(0.5,0);
        this.gameOverGroup.y = 30;
    }

};