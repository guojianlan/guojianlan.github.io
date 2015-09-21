var loaderState={
    preload:function(){
        var preloadSprite = game.add.sprite(50,game.world.centerY,'loading');
        game.load.setPreloadSprite(preloadSprite);
        var preloadtext = game.add.text(game.world.centerX,game.world.centerY+30,'0%',{font:'bold 20pt Arial',fill:'#f00',fontSize:'16'});
        game.load.image('background','assets/background.png'); //游戏背景图
        game.load.image('ground','assets/ground.png'); //地面
        game.load.image('title','assets/title.png'); //游戏标题
        game.load.spritesheet('bird','assets/bird.png',34,24,3); //鸟
        game.load.image('btn','assets/start-button.png');  //按钮
        game.load.spritesheet('pipe','assets/pipes.png',54,320,2); //管道
        game.load.bitmapFont('flappy_font', 'assets/fonts/flappyfont/flappyfont.png', 'assets/fonts/flappyfont/flappyfont.fnt');//显示分数的字体
        game.load.audio('fly_sound', 'assets/flap.wav');//飞翔的音效
        game.load.audio('score_sound', 'assets/score.wav');//得分的音效
        game.load.audio('hit_pipe_sound', 'assets/pipe-hit.wav'); //撞击管道的音效
        game.load.audio('hit_ground_sound', 'assets/ouch.wav'); //撞击地面的音效
        game.load.image('ready_text','assets/get-ready.png'); //get ready图片
        game.load.image('play_tip','assets/instructions.png'); //玩法提示图片
        game.load.image('game_over','assets/gameover.png'); //gameover图片
        game.load.image('score_board','assets/scoreboard.png'); //得分板
        game.load.onFileComplete.add(function(progress){
            preloadtext.text=progress+'%';
        });
    },
    create:function(){
        game.state.start('menu');
    }
};