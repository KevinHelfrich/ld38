function roomGetter(){
    return function getRoom(lvl){
        if(lvl === 1){
            var r = getRandomInt(0,2);
            if(r===0){
                return {
                    'zombie': getRandomInt(2,6)
                }
            }
            if(r===1){
                return {
                    'zombie2': getRandomInt(2,6)
                }
            }
            if(r===2){
                return {
                    'skellyton': getRandomInt(1,2)
                }
            }
        }



        return {
            'zombie' : 1
        }
    }
}
