var menuState={
    create:function(){
        var bg = game.add.tileSprite(0,0,game.width,game.height,'background');
        bg.autoScroll(-10,0);
        var ground = game.add.tileSprite(0,game.height-112,game.width,112,'ground');
        ground.autoScroll(-100,0);
        var titlegroup = game.add.group();
        titlegroup.create(0,0,'title'); // 添加title的元素到组里面
        var bird = titlegroup.create(190,10,'bird');
        bird.animations.add('fly');
        bird.animations.play('fly',12,true);
        titlegroup.x=30;
        titlegroup.y=100;
        var tweentitle=game.add.tween(titlegroup);
        tweentitle.to({y:120},1000,null,true,0,Number.MAX_VALUE,true);
        var btn = game.add.button(game.width/2,game.height/2,'btn',function(){
            game.state.start('play');
        });
        btn.anchor.setTo(0.5,0.5);
    }
};