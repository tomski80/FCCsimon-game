
var app = app || {};

app.sound = {
    soundOne : new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
    soundTwo : new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
    soundThree : new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
    soundFour : new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'),

    play : function(id){
        switch(id){
        case 'red':
            this.soundOne.play();
            break;
        case 'green':
            this.soundTwo.play();
            break;
        case 'blue':
            this.soundThree.play();
            break;
        case 'yellow':
            this.soundFour.play();
            break;
        default:
            break;
        }
    }
};
