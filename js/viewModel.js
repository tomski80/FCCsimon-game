/* global ko */

var app = app || {};

app.viewModel = {
    btnRed : ko.observable(false),
    btnGreen : ko.observable(false),
    btnBlue : ko.observable(false),
    btnYellow : ko.observable(false),
    deviceOn : ko.observable(false),
    start : ko.observable(false),
    counter : ko.observable('OFF'),
    soundOn : ko.observable(true),
    playerTurn : ko.observable(false),
    strict : ko.observable(false),

    restart : function(){
        if(this.deviceOn()){
            this.start(true);
            this.counter('1');
            app.game.start();
        }
    },

    resetCounter : function(){
        this.counter('1');
    },

    toggleOnOff : function(){
        this.deviceOn(!this.deviceOn());
    },

    colorBtnPressed : function(color){
        if(this.playerTurn()){
            app.game.colorButtonPressed(color);
            app.game.testGameConditions();
        }
    },

    switchLight : function(colorId,lightOn){
        switch(colorId){
        case 'green':
            this.btnGreen(lightOn);
            break;
        case 'red':
            this.btnRed(lightOn);
            break;
        case 'blue':
            this.btnBlue(lightOn);
            break;
        case 'yellow':
            this.btnYellow(lightOn);
            break;
        default:
            break;
        }
    },

    incrementCounter : function(){
        var counter;
        this.playerSequence = [];
        counter = +app.viewModel.counter();
        counter++;
        app.viewModel.counter(counter);
        app.game.speedUp();
    }
};

