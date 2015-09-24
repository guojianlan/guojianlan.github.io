/**
 * Created by guojian on 15/9/24.
 */
var bootState={
    preload:function(){
        game.load.image('loading','assets/preloader.gif');
    },
    create:function(){
        game.state.start('loader')
    }
}