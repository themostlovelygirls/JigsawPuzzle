// gameScene的逻辑处理代码

// 判断地图是否存活
export function isAlive(map) {
    var lineNum = map.length;

    var list = [];
    
    for(let i = 0; i < lineNum ; i++) {
        list = list.concat(map[i]);
    }

    let x = 0, y = 0;
    for(let i = 0; i < lineNum ; i++) {
        for(let j = 0; j < lineNum ; j++) {
            if(map[i][j] == lineNum*lineNum) {
                x = i;
                y = j;
                break;
            }
        }
    }

    var count = x+y;
    for(let i = 0; i < list.length; i++) {
        for(let j = i+1; j < list.length; j++) {
            if(list[j] < list[i]) {
                count++;
            }
        }
    }

    return count % 2 == 0;
}

// 生成初始地图
export function initMap(lineNum) {
    let map = [];
    for(let i = 0; i < lineNum; i++) {
        let line = [];
        for(let j = 0; j < lineNum; j++) {
            line.push(i*lineNum+j+1);
        }
        map.push(line);
    }
    let size = lineNum*lineNum;
    for(let count = 0; count < size/2; count++) {
        randomSwapPos(map);

        //console.log("map: "+map);
    }

    while(!isAlive(map)) {
        randomSwapPos(map);
    }
    
    return map;
}
function randomSwapPos(map) {
    //console.log("length: "+map.length);
    let pos1 = randomPos(map.length);
    let pos2 = randomPos(map.length);
    let tmp = map[pos1[0]][pos1[1]];
    map[pos1[0]][pos1[1]] = map[pos2[0]][pos2[1]];
    map[pos2[0]][pos2[1]] = tmp;
}
function randomPos(lineNum) {
    let x = Math.floor(Math.random()*lineNum);
    let y = Math.floor(Math.random()*lineNum);
    if(x == lineNum-1 && y == lineNum-1) {
        return randomPos(lineNum);
    }
    return [x, y];
}