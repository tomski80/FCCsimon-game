/* global ko app */

var app = app || {};

app.game = {
    compSequence : [],
    playerSequence : [],
    gameTimeouts : [],
    prevTime : Date.now(),
    interval : undefined,
    correctSeqTimeout : undefined,

    addGameColor : function(){
        this.compSequence.push(app.helper.randomColor());
    },

    storePlayerColor : function(color){
        if(app.viewModel.playerTurn){
            this.playerSequence.push(color);
        }
    },

    colorButtonPressed : function(color){
        switch(color){
        case 'green':
            this.storePlayerColor('green');
            app.sound.play('green');
            break;
        case 'red':
            this.storePlayerColor('red');
            app.sound.play('red');
            break;
        case 'blue':
            this.storePlayerColor('blue');
            app.sound.play('blue');
            break;
        case 'yellow':
            this.storePlayerColor('yellow');
            app.sound.play('yellow');
            break;
        default:
            break;
        }
        this.resetTimer();
    },

    // play sequence stored in compSequence array 
    // for each element we set timout function to switch lights ON 
    // invoked in intervals (timeout = interval * index)
    // then we set timeout function to switch light OFF (timeout = interval * index + ligthOnTime)
    playSequence : function(){
        var lightOnTime,
            breakTime,
            intervals,
            timeout,
            that = this;

        lightOnTime = 1000;
        breakTime = 250;
        intervals = (lightOnTime+breakTime);

        //play color sequence 
        this.compSequence.forEach( function(colorId,index){
            timeout = window.setTimeout( function(colorId){
                app.helper.lightOn(colorId);
                that.resetTimer();
            },intervals*index,colorId);
            that.gameTimeouts.push(timeout);

            timeout = window.setTimeout( function(colorId){
                app.helper.lightOff(colorId);
                that.resetTimer();
            },intervals*index+lightOnTime,colorId);
            that.gameTimeouts.push(timeout);
        });

        //wait for computer to finish playing sequence 
        //and change turn to player
        window.setTimeout(function(){
            that.playerSequence = [];
            app.viewModel.playerTurn(true);
            that.resetTimer();
        },intervals*this.compSequence.length);
    },

    stopSequence : function(){
        app.helper.clearAllTimeOut(this.gameTimeouts);
        app.helper.allLightsOff();
    },

    resetTimer : function(){
        this.prevTime = Date.now();
    },

    playerTimeOut : function(){
        var currTime = Date.now();
        if( (currTime - this.prevTime) > app.const.TIME_LIMIT){
            this.playerFailed();
        }else{
            //do nothing
            return;
        }
    },

    sequenceCorrect: function(){
        var sameSeq = true,
            i;
        for( i = 0; i < this.playerSequence.length; i++){
            if(this.playerSequence[i] === this.compSequence[i]){
                sameSeq = true; 
            }else{
                sameSeq = false;
                break;
            }
        }
        if(sameSeq){
            return true;
        }else{
            return false;
        }
    },

    testGameConditions: function(){
        var that = this;
        if(!this.sequenceCorrect()){
            window.clearTimeout(this.correctSeqTimeout);
            this.playerFailed();
        }
        if((this.playerSequence.length === this.compSequence.length)
        && (this.sequenceCorrect())){
            //sequence are the same 
            //wait 1 second before start playing 
            //next sequence
            this.correctSeqTimeout = window.setTimeout( function(){
                app.viewModel.playerTurn(false);
                app.viewModel.incrementCounter();
                that.gameStep();
            },1000);
        }
    },

    playerFailed : function(){
        var tempCounter,
            that = this;

        if(app.viewModel.playerTurn()){
            if(app.viewModel.strict()){
                //strict
            }else{
                tempCounter = +app.viewModel.counter();
                app.viewModel.counter('!!!!');
                app.viewModel.playerTurn(false);
                this.resetTimer();
                window.setTimeout( function(){
                    app.viewModel.counter(tempCounter);
                    that.playSequence();
                },1500);
            }
        }
    },

    gameStep : function(){
        this.addGameColor();
        this.playSequence();
    },

    reset : function(){
        this.compSequence = [];
        this.playerSequence = [];
        this.stopSequence();
        this.resetTimer();
        window.clearInterval(this.interval);
    },

    start : function(){
        this.reset();
        this.gameStep();
        var playerTimeOut = this.playerTimeOut.bind(this);
        this.interval = window.setInterval( playerTimeOut, 200 );
    },
};

$(function(){

    ko.applyBindings(app.viewModel);

});
