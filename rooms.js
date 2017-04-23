function roomGetter(){
    return function getRoom(lvl){
        if(lvl === 1){
            var r = getRandomInt(0,6);
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
            if(r===3){
                return {
                    'zombie' : getRandomInt(2,4),
                    'zombie2' : getRandomInt(2,4)
                }
            }
            if(r===4){
                return {
                    'zombie' : getRandomInt(1,4),
                    'skellyton' : 1
                }
            }
            if(r===5){
                return {
                    'zombie2' : getRandomInt(1,4),
                    'skellyton' : 1
                }
            }
            if(r===6){
                return {
                    'zombie' : getRandomInt(1,3),
                    'zombie2' : getRandomInt(1,3),
                    'skellyton' : 1
                }
            }
        }



        return {
            'zombie' : 1
        }
    }
}
