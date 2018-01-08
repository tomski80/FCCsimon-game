
var app = app || {};

app.sound = {
    play : function(id){
        switch(id){
        case 'red':
            var soundOne = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3');
            soundOne.play();
            break;
        case 'green':
            var soundTwo = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3');
            soundTwo.play();
            break;
        case 'blue':
            var soundThree = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3');
            soundThree.play();
            break;
        case 'yellow':
            var soundFour = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3');
            soundFour.play();
            break;
        default:
            break;
        }
    }
};
