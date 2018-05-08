module.exports = {

    //参数路径数组, 玩家当前位置x,y
    //返回玩家当前位置到所有路径的最短距离
    getMinDistance :function(path, x, y){
        if(path.length<2){
            return 0;
        }
        var distance = [];     //距离数组, 采用点到直线的距离公式

        for(var i=0; i<path.length-1; i++){
            if(path[i].x-path[i+1].x !== 0 ){         //斜率不为0时
                var k = (path[i].y-path[i+1].y)/(path[i].x-path[i+1].x);    //直线斜率
                //直线方程：y-y0 = k*(x-x0);
                distance.push(Math.abs( y-path[i].y - k*(x-path[i].x) )/Math.sqrt(k*k+1));
            }
            else{
                distance.push(Math.abs(x-path[i].x));
            }
        }
        console.assert(distance.length == path.length-1, "n个路径点应该有n-1条直线，因此有n-1个距离");

        var min = distance[0];
        for(i=0; i<distance.length; i++){
            if(min>distance[i]){
                min = distance[i];
            }
        }
        //cc.log("到所有直线的最短距离"+min);
        return min;
    },


    //function2
    //是否捡到卷轴，判断
    //参数：玩家当前位置，卷轴精灵数组
    //返回没有捡到则返回-1，捡到返回数组下标
    judgeGetScroll: function(scrolls,x,y){
        if(scrolls.length<=0){
            return -1;
        }

        var posx;
        var posy;
        var distance;
        var getItemDistance = 35;   //当距离小于getItemDistance时，判定捡到
        for(var i=0; i<scrolls.length; i++){
            posx = scrolls[i].x;
            posy = scrolls[i].y;

            distance = Math.sqrt((posx-x)*(posx-x)+(posy-y)*(posy-y));
            if(distance < getItemDistance){
                return i;
            }
        }
        return -1;
    },


    //function3
    //是否到达终点，判断
    //参数：玩家当前位置，终点位置
    //返回true or false
    judgeEndPos: function(x,y, endpos){
        var posx = endpos.x;
        var posy = endpos.y;
        var distance = Math.sqrt((posx-x)*(posx-x)+(posy-y)*(posy-y));
        var getItemDistance = 35;       //当距离小于getItemDistance时，判定到达终点
        if(distance < getItemDistance){
            return true;
        }
        return false;
    }
};