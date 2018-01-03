// one global variable
var GAME = {},
    gameTimeout;

GAME.const = {};                //constants 
GAME.const.REFRESH_RATE = 100;  //interval time for main game loop handler
GAME.const.SEQ_PLAYED_EVENT = 'seqPlayed';
GAME.const.PLAYER_RESPONDED_EVENT = 'playerResponded';
GAME.const.RESPONSE_TIME_LIMIT = 5000;  

/*********************
 *  core game object *
 *********************/
GAME.core = (function(){
    'use strict';

    //private properties
    var isPlayerTurn,
        compSequence,
        points,
        strict,
        addToSeq,
        playerSequence;

    isPlayerTurn = false;
    compSequence = [];
    
    function checkStrict(){
        if($('#strict').prop('checked')){
            strict = true;
        }else{
            strict = false;
        }
    }

    function playSound(id){
        var snd1,snd2,snd3,snd4;

        switch(id){
        case 1:
            snd1 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3');
            snd1.play();
            break;
        case 2:
            snd2 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3');
            snd2.play();
            break;
        case 3:
            snd3 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3');
            snd3.play();
            break;
        case 4:
            snd4 = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3');
            snd4.play();
            break;
        default:
            break;
        }
    }

    function buildSequence(bool){
        var color;

        color = Math.round(Math.random()*3)+1;     //choose color 1, 2, 3 or 4
        if(bool) {
            compSequence.push(color);
        }
    }

    function clearSequences(){
        compSequence = [];
        playerSequence = [];
    }

    function playerFailed(){
        var tempPoints,
            ev;

        $('.game-btn').off('click');
        $('.game-btn').removeClass('light-up-1 light-up-2 light-up-3 light-up-4');
        //alert('Fail!');
        if(strict){
            points = '!!!!';
            $('.game-score').val(points);
            clearSequences();

            window.setTimeout(function(){
                points = 0;
                $('.game-score').val(points);
                ev = new Event(GAME.const.PLAYER_RESPONDED_EVENT);
                window.dispatchEvent(ev);
            },1500);
        }else{
            tempPoints = points;
            points = '!!!!';
            $('.game-score').val(points);

            window.setTimeout(function(){
                addToSeq = false;
                points = tempPoints;
                playerSequence = [];
                $('.game-score').val(points);
                ev = new Event(GAME.const.PLAYER_RESPONDED_EVENT);
                window.dispatchEvent(ev);
            },1000);    
        }
        console.log('fail');
    }

    function playSequence(){
        var ev,
            lightOnTime,
            intervals,
            seqFinished,
            breakTime;


        //update strict no strict mode 
        checkStrict();
        
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
                playSound(+colorId);
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

        addToSeq = true;
    }

    function playerTurn(){
        

        //time out after 5 sec
        //unless player press button
        //
        gameTimeout = window.setTimeout(function(){
            playerFailed();
        },GAME.const.RESPONSE_TIME_LIMIT);

        //make buttons light up when clicked
        $('.game-btn-1').addClass('light-up-1');
        $('.game-btn-2').addClass('light-up-2');
        $('.game-btn-3').addClass('light-up-3');
        $('.game-btn-4').addClass('light-up-4');

        //let player click buttons
        $('.game-btn').on('click', function(){
            var colorId,
                ev,
                seqElem,
                i,
                plSeqLen,
                compSeqLen,
                sameSeq;

            //remove fail timeout
            clearTimeout(gameTimeout);

            // add pushed button to player sequence 
            colorId = $(this).attr('data-val');
            playSound(+colorId); 
            playerSequence.push(+colorId);      //make sure it is a number
                           

            plSeqLen = playerSequence.length;
            compSeqLen = compSequence.length;

            //if too many in player response then instant fail
            if(playerSequence.length > compSequence.length){
                playerFailed();
            }else
            //check if sequence same so far....
            if(plSeqLen <= compSeqLen){
                for( i = 0; i < plSeqLen; i++){
                    if(playerSequence[i] === compSequence[i]){
                        sameSeq = true; 
                    }else{
                        sameSeq = false;
                        break;
                    }
                }
            }
            //...continue check if sequence same so far 
            if(!sameSeq){
                playerFailed();
            }else
            // set another timeout if player didn't finished sequence yet
            if(playerSequence.length < compSequence.length){
                gameTimeout = window.setTimeout(function(){
                    playerFailed();
                },GAME.const.RESPONSE_TIME_LIMIT);
            }else
            // if player sequence is the same lenght then wait 1sec 
            // and start new turn
            if(playerSequence.length === compSequence.length){
                ev = new Event(GAME.const.PLAYER_RESPONDED_EVENT);
                window.setTimeout(function(){
                    points++;
                    $('.game-score').val(points);
                    window.dispatchEvent(ev);
                },1000);
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
        buildSequence(addToSeq);
        playSequence();
    }

    //initialize and start first turn
    function start(){    

        addToSeq = true;
        //set point number
        points = 0;
        $('.game-score').val(points);

        if($('#strict').prop('checked')){
            strict = true;
        }else{
            strict = false;
        }

        window.addEventListener(GAME.const.SEQ_PLAYED_EVENT, function(){
            playerTurn();
        });

        window.addEventListener(GAME.const.PLAYER_RESPONDED_EVENT, function(){
            compTurn();
        });

        playerSequence = [];
        compSequence = [];

        buildSequence(addToSeq);
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
 
});

