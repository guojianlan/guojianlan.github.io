/**
 * Created by guojian on 15/9/24.
 */
var loaderState = {
    preload:function(){
        var loading = game.add.sprite(game.world.width/2,game.world.centerY,'loading');
        game.load.setPreloadSprite(loading);
        var loadext = game.add.text(game.world.centerX,game.world.centerY+50,'0%',{font:'bold 20pt Arial',fill:'#f00',fontSize:'16'})
        loading.anchor={x:0.5,y:0.5};
        loadext.anchor={x:0.5,y:0.5};
        game.load.image('sky','./assets/sky.png');
        game.load.image('start','./assets/star.png');
        game.load.image('ground','./assets/platform.png');
        game.load.spritesheet('dude','./assets/dude.png',32,48);
        game.load.onFileComplete.add(function(pogress){
            loadext.text = pogress+'%';
        });
    },
    create:function(){
        game.state.start('play');
    }
};