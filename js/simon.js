// one global variable
var GAME = {};

GAME.const = {};                //constants 
GAME.const.REFRESH_RATE = 100;  //interval time for main game loop handler
GAME.const.SEQ_PLAYED_EVENT = 'seqPlayed';
GAME.const.PLAYER_RESPONDED_EVENT = 'playerResponded';

/*********************
 *  core game object *
 *********************/
GAME.core = (function(){
    'use strict';

    //private properties
    var isPlayerTurn,
        compSequence,
        playerSequence;

    isPlayerTurn = false;
    compSequence = [];

    function buildSequence(){
        var color;

        color = Math.round(Math.random()*3)+1;     //choose color 1, 2, 3 or 4
        compSequence.push(color);
    }

    function clearSequence(){
        compSequence = [];
    }

    function playerFailed(){
        alert('Fail!');
    }

    function playSequence(){
        var ev,
            lightOnTime,
            intervals,
            seqFinished,
            breakTime;

        //time in miliseconds
        lightOnTime = 1000;
        breakTime = 250;
        intervals = (lightOnTime+breakTime);
        
        compSequence.forEach(function(color,index){
            window.setTimeout(function(colorId){
                var elemClass,
                    activeClass;

                elemClass = '.game-btn-'+colorId;
                activeClass = 'game-btn-'+colorId+'-active';
                $(elemClass).addClass(activeClass);
            },intervals*index,color);
            
            window.setTimeout(function(colorId){
                var elemClass,
                    activeClass;
                    
                elemClass = '.game-btn-'+colorId;
                activeClass = 'game-btn-'+colorId+'-active';
                $(elemClass).removeClass(activeClass);
            },intervals*index+lightOnTime,color);
        });    
           
        //wait for sequence to finish and then 
        //dispatch event
        seqFinished = intervals*compSequence.length; 
        ev = new Event(GAME.const.SEQ_PLAYED_EVENT);
        window.setTimeout(function(){
            window.dispatchEvent(ev);
        },seqFinished);
    }

    function playerTurn(){
        var gameTimeout;

        //time out after 5 sec
        //unless player press button
        //
        //gameTimeout = window.setTimeout(function(){
        //    playerFailed();
        //},5000);

        //make buttons light up when clicked
        $('.game-btn-1').addClass('light-up-1');
        $('.game-btn-2').addClass('light-up-2');
        $('.game-btn-3').addClass('light-up-3');
        $('.game-btn-4').addClass('light-up-4');

        //let player click buttons
        $('.game-btn').on('click', function(){
            var colorId,
                ev;

            clearTimeout(gameTimeout);
            colorId = $(this).attr('data-val');
            playerSequence.push(colorId);

            //if too many in player response then instant fail
            console.log('player seq:'+playerSequence);
            console.log('computer seq'+ compSequence);
            if(playerSequence.length > compSequence.length){
                playerFailed();
            }
            if(playerSequence.length === compSequence.length){
                ev = new Event(GAME.const.PLAYER_RESPONDED_EVENT);
                window.setTimeout(function(){
                    window.dispatchEvent(ev);
                },500);
            }
        });

    }

    function compTurn(){
        //clear player sequence
        playerSequence = [];
        //remove event handler from buttons so they cannot be clicked
        //during computer playback
        $('.game-btn').off('click');
        $('.game-btn').removeClass('light-up-1 light-up-2 light-up-3 light-up-4');
        buildSequence();
        playSequence();
    }

    //initialize and start first turn
    function start(){    
        
        window.addEventListener(GAME.const.SEQ_PLAYED_EVENT, function(){
            playerTurn();
        });

        window.addEventListener(GAME.const.PLAYER_RESPONDED_EVENT, function(){
            compTurn();
        });

        playerSequence = [];

        buildSequence();
        playSequence();
    }

    return {
        start : start
    };
})();

/*********************
 *  app starts here  *
 *  using jquery     *
 *********************/
$( function(){

    $('#start').on('click', function(){
        GAME.core.start();
    });

    $('#respond').on('click', function(){
        var ev;

        ev = new Event(GAME.const.PLAYER_RESPONDED_EVENT);
        window.dispatchEvent(ev);
    });
    
});

