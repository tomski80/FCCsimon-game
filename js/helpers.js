
var app = app || {};

app.const = {};

app.const.TIME_LIMIT = 5000;
app.const.END_GAME_SCORE = 20;

app.helper = {};

app.helper.lightOn = function(colorId){
    app.sound.play(colorId);
    app.viewModel.switchLight(colorId,true);
};

app.helper.lightOff = function(colorId){
    app.viewModel.switchLight(colorId,false);
};

app.helper.allLightsOff = function(){
    app.viewModel.switchLight('red',false);
    app.viewModel.switchLight('blue',false);
    app.viewModel.switchLight('green',false);
    app.viewModel.switchLight('yellow',false);
};

app.helper.randomColor = function(){
    var color = ['red', 'blue', 'yellow', 'green'],
        index;
    index = Math.round(Math.random()*3);     
    return color[index];
};

app.helper.clearAllTimeOut = function(arr){
    arr.forEach( function(timeout){
        window.clearTimeout(timeout);
    });
};
