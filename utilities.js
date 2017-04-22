var triggerRoomArea = 800;
var minRoomWidth = 4;
var minRoomHeight = 4;
var interiorWidth = minRoomWidth-2;
var interiorHeight = minRoomHeight-2;
var randomDither = 20;

function mapToCsv(map,width,height){
    var result = '';
    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            result += map[y][x].tile;

            if (x < width) {
                result += ',';
            }
        }

        if (y < width) {
            result += "\n";
        }
    }

    return result;
}

function genMap(map,x,y,width,height){
    var centerx = x+Math.floor(width/2);
    var centery = y+Math.floor(width/2);
    if((width<minRoomWidth)||(height<minRoomHeight)){
        return{x:centerx,y:centery};
    }
    if(width*height>triggerRoomArea){
        //sub divide
        var left = {};
        var right = {};
        if(width>height){
            var nw = Math.floor(width/2) + getRandomInt(-randomDither,randomDither);
            left = genMap(map,x,y,nw,height);
            right = genMap(map,x+nw,y,width-nw,height);
        }
        else {
            var nh = Math.floor(height/2) + getRandomInt(-randomDither,randomDither);
            left = genMap(map,x,y,width,nh);
            right = genMap(map,x,y+nh,width,height-nh);
        }
        drawpath(map,left,{x:centerx,y:centery});
        drawpath(map,right,{x:centerx,y:centery});
        return {x:centerx,y:centery};
    }
    var rw = getRoomWidth(Math.floor(width/2));
    var rh = getRoomHeight(Math.floor(height/2));
    var starty = centery - rh < y ? y : centery - rh;
    var startx = centerx - rw < x ? x : centerx - rw;
    var endy = centery + rh > y+height ? y+height : centery+rh;
    var endx = centerx + rw > x+width ? x+height : centerx+rw;
    for(var yc = starty; yc < endy;yc++){
        for(var xc = startx; xc < endx;xc++){
            try{
                map[yc][xc].tile = '1';
                map[yc][xc].navigable = false;
            } catch(err){}
        }
    }
    for(var yc = starty+1; yc < endy-1;yc++){
        for(var xc = startx+1; xc < endx-1;xc++){
            try{
                map[yc][xc].tile = '0';
                map[yc][xc].navigable = true;
            }catch(err){}
        }
    }
    return {x:centerx,y:centery};
}

function drawpath(map,point1,point2){
    var starty = point1.y > point2.y ? point2.y : point1.y;
    var endy = point1.y > point2.y ? point1.y : point2.y;
    for(var yc = starty; yc < endy;yc++){
        for(var xc = point1.x; xc <= point1.x;xc++){
            try{
                if(map[yc][xc].tile === '3'){
                    map[yc][xc].tile = '4';
                    map[yc][xc].navigable = true;
                }
                else if(map[yc][xc].tile === '1'){
                    map[yc][xc].tile = '2';
                    map[yc][xc].navigable = false;
                }
            }catch(err){}
        }
    }
    var startx = point1.x > point2.x ? point2.x : point1.x;
    var endx = point1.x > point2.x ? point1.x : point2.x;
    for(var yc = endy; yc <= endy;yc++){
        for(var xc = startx; xc <= endx;xc++){
            try{
                if(map[yc][xc].tile === '3'){
                    map[yc][xc].tile = '4';
                    map[yc][xc].navigable = true;
                }
                else if(map[yc][xc].tile === '1'){
                    map[yc][xc].tile = '2';
                    map[yc][xc].navigable = false;
                }
            }catch(err){}
        }
    }
}

function getRoomWidth(width){
    return getRandomInt(4,width-1);
}

function getRoomHeight(height){
    return getRandomInt(4,height-1);
}

function initMap(width,height){
    var map = [];
    for (var y = 0; y < height; y++) {
        map[y] = [];
        for (var x = 0; x < width; x++) {
            map[y][x] = {};
            map[y][x].tile = '3';
            map[y][x].navigable = false;
        }
    }
    return map;
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function determineRoomSquares(map,width,height){
    var squares = [];

    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            if(map[y][x].tile === '0'){
                squares.push({x:x,y:y});
            }
        }
    }
    return squares;
}

function determineConnectedSquares(map,startPoint){
    var squares = [];
    var toProcess = [startPoint];
    while(toProcess.length > 0){
        var curr = toProcess.pop();
        squares.push(curr);
        map[curr.y][curr.x].visited = true;

        try{
            if(!map[curr.y][curr.x-1].visited&&map[curr.y][curr.x-1].tile!='3'){
                toProcess.push({x:curr.x-1,y:curr.y});
            }
        }catch(err){}
        try{
            if(!map[curr.y][curr.x+1].visited&&map[curr.y][curr.x+1].tile!='3'){
                toProcess.push({x:curr.x+1,y:curr.y});
            }
        }catch(err){}
        try{
            if(!map[curr.y-1][curr.x].visited&&map[curr.y-1][curr.x].tile!='3'){
                toProcess.push({x:curr.x,y:curr.y-1});
            }
        }catch(err){}
        try{
            if(!map[curr.y+1][curr.x].visited&&map[curr.y+1][curr.x].tile!='3'){
                toProcess.push({x:curr.x,y:curr.y+1});
            }
        }catch(err){}
    }
    return squares;
}

function determineRoom(map,startPoint){
    if(map[startPoint.y][startPoint.x].tile !== '0'){
        return [];
    }
    var squares = [];
    var toProcess = [startPoint];
    while(toProcess.length > 0){
        var curr = toProcess.pop();
        squares.push(curr);
        map[curr.y][curr.x].visited = true;

        try{
            if(!map[curr.y][curr.x-1].visited&&map[curr.y][curr.x-1].tile==='0'){
                toProcess.push({x:curr.x-1,y:curr.y});
            }
        }catch(err){}
        try{
            if(!map[curr.y][curr.x+1].visited&&map[curr.y][curr.x+1].tile==='0'){
                toProcess.push({x:curr.x+1,y:curr.y});
            }
        }catch(err){}
        try{
            if(!map[curr.y-1][curr.x].visited&&map[curr.y-1][curr.x].tile==='0'){
                toProcess.push({x:curr.x,y:curr.y-1});
            }
        }catch(err){}
        try{
            if(!map[curr.y+1][curr.x].visited&&map[curr.y+1][curr.x].tile==='0'){
                toProcess.push({x:curr.x,y:curr.y+1});
            }
        }catch(err){}
    }
    return squares;
}

function getInDir(pos,dir){
    if(dir === 0){
        return {x:pos.x-1,y:pos.y};
    }
    if(dir === 1){
        return {x:pos.x,y:pos.y-1};
    }
    if(dir === 2){
        return {x:pos.x+1,y:pos.y};
    }
    if(dir === 3){
        return {x:pos.x,y:pos.y+1};
    }
}

function fixRooms(map,width,height){
    var roomSquares = determineRoomSquares(map,width,height);

    while(roomSquares.length > 0){
        var rs = roomSquares.pop();

        if(!getMapTileFromMap(map,rs).fixed){
            fixRoom(map,rs);
        }
    }
}

function fixRoom(map,pos){
    var roomInt = determineRoom(map,pos);
    var doors = [];
    var walls = [];
    var left = pos.x;
    var right = pos.x;
    var top = pos.y;
    var bottom = pos.y;

    while(roomInt.length > 0){
        var tile = roomInt.pop();
        getMapTileFromMap(map,tile).fixed = true;

        if(tile.x>right){right = tile.x;}
        if(tile.x<left){left = tile.x;}
        if(tile.y>bottom){bottom = tile.y;}
        if(tile.y<top){top = tile.y;}

        for(var i = 0;i<4;i++){
            var lt = getMapTileFromMap(map,getInDir(tile,i));
            if(lt.tile === '1'){
                walls.push(getInDir(tile,i));
            }
            if(lt.tile === '2'){
                doors.push(getInDir(tile,i));
            }
        }
    }

    while(walls.length > 0){
        var wall = walls.pop();

        var surrounders = surroundingTileTypes(map,wall);

        if(surrounders[4] > 0 && surrounders[0] > 0){
            getMapTileFromMap(map,wall).tile = '2';
        }
    }

    while(doors.length>0){
        var door = doors.pop();

        var surrounders = surroundingTileTypes(map,door);
        if(surrounders[4] === 0){
            getMapTileFromMap(map,door).tile = '1';
        }
    }

    var tls = surroundingTileTypes(map,{x:left-1,y:top-1});
    if(tls[4]>0){
        getMapTileFromMap(map,{x:left-1,y:top}).tile = '2';
        getMapTileFromMap(map,{x:left-1,y:top-1}).tile = '2';
    }
    tls = surroundingTileTypes(map,{x:right+1,y:top-1});
    if(tls[4]>0){
        getMapTileFromMap(map,{x:right+1,y:top}).tile = '2';
        getMapTileFromMap(map,{x:right+1,y:top-1}).tile = '2';
    }
    tls = surroundingTileTypes(map,{x:left-1,y:bottom+1});
    if(tls[4]>0){
        getMapTileFromMap(map,{x:left-1,y:bottom}).tile = '2';
        getMapTileFromMap(map,{x:left-1,y:bottom+1}).tile = '2';
    }
    tls = surroundingTileTypes(map,{x:right+1,y:bottom+1});
    if(tls[4]>0){
        getMapTileFromMap(map,{x:right+1,y:bottom}).tile = '2';
        getMapTileFromMap(map,{x:right+1,y:bottom+1}).tile = '2';
    }
}

function getMapTileFromMap(map,pos){
    return map[pos.y][pos.x];
}

function surroundingTileTypes(map,pos){
    var res = { '0':0,'1':0,'2':0,'3':0,'4':0};

    for(var i = 0;i<4;i++){
        res[getMapTileFromMap(map,getInDir(pos,i)).tile]++;
    }

    return res;
}
