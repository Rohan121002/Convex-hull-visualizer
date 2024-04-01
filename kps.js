let points = [];
let count = 0;
let currentPointIndex = 0;
let hull = [];
let lines = [];
let actions = [];
let medianLines = [];

const controller = new AbortController();
const signal = controller.signal;

let rect_details = [];

document.getElementById('pointsDiv').addEventListener('click', function(event) {
 let rect = event.target.getBoundingClientRect();
 rect_details.push(rect.x,rect.width, rect.y, rect.height);
 console.log(rect_details);
 let x = event.clientX;
 let y = event.clientY;
 points.push({ x: x, y: -y});
 drawPoint(x,y, "white","9","0");
}, { signal });

function drawLine(start, end, color,ptColor) {
    let svg = document.getElementById('lineSVG');
    let newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    newLine.classList.add('line');
    newLine.setAttribute('stroke-width', 3)
    newLine.setAttribute('x1', start.x + 2.5);
    newLine.setAttribute('y1', -start.y + 2.5);
    newLine.setAttribute('x2', end.x + 2.5);
    newLine.setAttribute('y2', -end.y + 2.5);
    newLine.setAttribute('stroke', `${color}`);
    svg.appendChild(newLine);
    lines.push(newLine);
    if(`${ptColor}`==="green"){
        let pts = document.getElementsByClassName('vertex');
        console.log(start, end);
        console.log(pts);
        for(let i =0;i<pts.length;i++){
            if(pts[i].offsetLeft === start.x && pts[i].offsetTop === -start.y){
                console.log("hey12");
                document.getElementById('pointsDiv').removeChild(pts[i]);
                drawPoint(start.x , -start.y, "green", "15","3.5");
                console.log("hey again12");
            }
            if(pts[i].offsetLeft === end.x && pts[i].offsetTop === -end.y){
                console.log("hey12");
                document.getElementById('pointsDiv').removeChild(pts[i]);
                drawPoint(end.x , -end.y, "green", "15","3.5");
                console.log("hey again12");
            }
        }
    }
    console.log("hey again");
}

function medianDrawLine(start, end) {
    let svg = document.getElementById('lineSVG');
    let newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    newLine.classList.add('line');
    newLine.setAttribute('stroke-width', 3)
    newLine.setAttribute('x1', start.x + 2.5);
    newLine.setAttribute('y1', -start.y + 2.5);
    newLine.setAttribute('x2', end.x + 2.5);
    newLine.setAttribute('y2', -end.y + 2.5);
    newLine.setAttribute('stroke', 'black');
    svg.appendChild(newLine);
    console.log("addline",newLine);
    medianLines.push(newLine);
    console.log(medianLines);
}

function drawPoint(x, y, color,radius,dis){
    let pointElement = document.createElement('div');
    pointElement.classList.add('vertex');
    pointElement.style.width = `${radius}px`;
    pointElement.style.height = `${radius}px`;
    pointElement.style.left = `${x - dis}px`;
    pointElement.style.top = `${y - dis}px`;
    pointElement.style.backgroundColor = `${color}`;
    document.getElementById('pointsDiv').appendChild(pointElement);
}

function removeMedianLine(){
    console.log("median",medianLines[medianLines.length-1]);
    document.getElementById('lineSVG').removeChild(medianLines[medianLines.length-1]);
    medianLines.pop();
}

function removeLine(start,end){
    let lines = document.getElementsByClassName('line');
    for(let i =0;i<lines.length;i++){
        if(Number(lines[i].attributes.x1.value)===start.x + 2.5 && Number(lines[i].attributes.y1.value)===-start.y + 2.5 &&
            Number(lines[i].attributes.x2.value)===end.x + 2.5 && Number(lines[i].attributes.y2.value)===-end.y + 2.5){
            // console.log("i am inside");
            let svg = document.getElementById('lineSVG');
            svg.removeChild(lines[i]);
            break;
        }
    }
}

function keepUniqueElements(array) {
 const uniquePairs = {};
 const uniqueArray = array.filter(pair => {
 const key = JSON.stringify(pair);
 const isUnique = !uniquePairs[key];
 uniquePairs[key] = true;
 return isUnique;
 });
 return uniqueArray;
}

function findminmax(points){
    let xmax = -Infinity;
    let xmin = Infinity;
    let pumin;
    let pumax;
    let plmax;
    let plmin;
    for (let i = 0; i < points.length; i++) {
        console.log('Point added at position x=' + points[i].x + ' y=' + points[i].y);
        if (points[i].x > xmax) {
            pumax = points[i];
            plmax = points[i];
            xmax = points[i].x;
        }else if(
            points[i].x===xmax && points[i].y>pumax.y){
            pumax = points[i];
        }else if(
            points[i].x===xmax && points[i].y<plmax.y){
            plmax = points[i];
        }
    }
    for(let i =0;i<points.length;i++){
        if(points[i].x<xmin){
            pumin = points[i];
            plmin = points[i];
            xmin = points[i].x;
        }else if(points[i].x===xmin && points[i].y>pumin.y)
        {
            pumin = points[i];
        }else if(points[i].x===xmin && points[i].y<plmin.y)
        {
            plmin = points[i];
        }
    }
    return {pumax, pumin, plmax, plmin};
}

function removeLowerPoints(Lower, plmin, plmax){
    let pts = document.getElementsByClassName('vertex');
    let rem=[];
    for(let i =0;i<pts.length;i++){
        for(let j =0;j<Lower.length;j++){
            // console.log(pts[i].offsetLeft,Lower[j].x,pts[i].offsetTop,Lower[j].y);
            if(pts[i].offsetLeft === Lower[j].x && pts[i].offsetTop === Lower[j].y){
                if(!((pts[i].offsetLeft === plmin.x && pts[i].offsetTop === plmin.y)||(pts[i].offsetLeft === plmax.x && pts[i].offsetTop === plmax.y)))
                    rem.push(pts[i]);
            }
        }
    }
    for(let i =0;i<rem.length;i++){
        document.getElementById('pointsDiv').removeChild(rem[i]);
    }
}

function removePoints(ptsToRemove){
    console.log("Problem",ptsToRemove);
    let pts = document.getElementsByClassName('vertex');
    let rem=[];
    for(let i =0;i<pts.length;i++){
        for(let j =0;j<ptsToRemove.length;j++){
            if(pts[i].offsetLeft === ptsToRemove[j].x && pts[i].offsetTop === -ptsToRemove[j].y){
                rem.push(pts[i]);
            }
        }
    }
    // console.log("removePpoints", rem);
    for(let i =0;i<rem.length;i++){
        document.getElementById('pointsDiv').removeChild(rem[i]);
    }
}

function getLowerAgain(Lower){
    for(let i=0;i<Lower.length;i++){
        drawPoint(Lower[i].x,Lower[i].y, "white","9","0");
    }
}

function ConvexHull(points){
    points.sort((a,b)=> a.x-b.x || a.y - b.y);
    console.log("sorted", points);
    let {pumax, pumin, plmax, plmin} = findminmax(points);
    actions.push({func: drawLine, params: [pumin, pumax, "red","green"]});
    plmin = {x:plmin.x , y:-plmin.y};
    plmax = {x:plmax.x , y:-plmax.y};
    let Upper = [];
    let Lower = [];
    Upper.push(pumax);
    Lower.push(plmax);
    Upper.push(pumin);
    Lower.push(plmin);
    let upperAngle = Math.atan2(pumax.y-pumin.y, pumax.x - pumin.x);
    let lowerAngle = Math.atan2(-plmax.y+plmin.y, plmax.x -plmin.x);
    for(let i =0;i<points.length;i++){
        let UpperTempAngle = Math.atan2(points[i].y-pumin.y, points[i].x - pumin.x);
        let LowerTempAngle = Math.atan2(points[i].y+plmin.y, points[i].x - plmin.x);
        if(UpperTempAngle >= upperAngle){
            Upper.push(points[i]);
        }
        if(LowerTempAngle <= lowerAngle){
            Lower.push({x :points[i].x, y:-points[i].y});
        }
    }
    Upper = keepUniqueElements(Upper);
    Lower = keepUniqueElements(Lower);
    if(Lower.length != 2){
        actions.push({func: removeLowerPoints, params:[Lower, plmin, plmax]});
    }
    console.log("lower points" , Lower,plmin, plmax);
    console.log("Upper Points", Upper, pumin , pumax);
    let UpperAns = UpperHull(pumin,pumax,Upper);
    if(!(pumin.x === pumax.x && pumin.y === pumax.y)){
        actions.push({func:removeLine, params:[pumin , pumax]});
    }
    if(Lower.length != 2){
        actions.push({func:getLowerAgain , params:[Lower]});
    }
    let LowerAns = LowerHull(plmin,plmax,Lower);
    if(!(plmin.x===pumin.x && plmin.y === -pumin.y)){
        actions.push({func:drawLine, params:[pumin , plmin,"green","green"]});
    }
    if(!(plmax.x===pumax.x && plmax.y === -pumax.y)){
        actions.push({func:drawLine, params:[pumax , plmax, "green","green"]});
    }
}


function UpperHull(pumin, pumax,Upper){
    if(pumin.x === pumax.x && pumin.y===pumax.y){
        return [pumin];
    }
    Upper.sort((a,b)=> a.x-b.x || a.y - b.y);
    let medianX;
    if (Upper.length % 2 === 0) {
        medianX = Upper[Math.ceil(Upper.length / 2)].x;
    } else {
        medianX = Upper[Math.floor(Upper.length / 2)].x;
    }
    let medianXtoShow;
    if (Upper.length % 2 === 0) {
        medianXtoShow = (Upper[Math.floor(Upper.length / 2)].x+Upper[Math.floor(Upper.length / 2)-1].x)/2;
    } else {
        medianXtoShow = Upper[Math.floor(Upper.length / 2)].x;
    }
    if(Upper.length >2){
        actions.push({func:medianDrawLine, params:[{x:medianXtoShow, y: -60}, {x:medianXtoShow, y: -700}]});
        actions.push({func:removeMedianLine, params:[]});
    }
    let temp = upperBridge(Upper, medianX);
    let pk = temp[0], pm = temp[1];
    if(!(pumin.x === pk.x && pumin.y === pk.y)){
        let lines = document.getElementsByClassName('line');
        let flag = true;
        for(let i =0;i<lines.length;i++){
            if(Number(lines[i].attributes.x1.value)===pumin.x+2.5 && Number(lines[i].attributes.y1.value)===-pumin.y+2.5
            && Number(lines[i].attributes.x2.value)===pk.x+2.5 && Number(lines[i].attributes.y2.value)===-pk.y+2.5){
                flag = false;
                break;
            }
        }
        if(flag===true){
            actions.push({func:drawLine, params:[pumin,pk, "red","white"]});
        }
    }
    if(!(pumax.x === pm.x && pumax.y === pm.y)){
        let lines = document.getElementsByClassName('line');
        let flag = true;

        for(let i =0;i<lines.length;i++){
            if(Number(lines[i].attributes.x1.value)===pumax.x+2.5 && Number(lines[i].attributes.y1.value)===-pumax.y+2.5
            && Number(lines[i].attributes.x2.value)===pm.x+2.5 && Number(lines[i].attributes.y2.value)===-pm.y+2.5){
                flag = false;
                break;
            }
        }
        if(flag === true){
            actions.push({func:drawLine, params:[pumax , pm,"red","white"]});
        }
    }
    let Left = [];
    let Right = [];
    let leftSlope = Math.atan2(pk.y-pumin.y,pk.x - pumin.x);
    let RightSlope = Math.atan2(pm.y - pumax.y, pm.x - pumax.x);
    Left.push(pumin, pk);
    Right.push(pm, pumax);
    if(pk.x === pumin.x){
        slope = Infinity;
    for(let i =0;i<Upper.length;i++){
        if(Upper[i].x<pk.x){
            Left.push(Upper[i]);
        }   
    }
    }
    else{
        let leftS = (pk.y-pumin.y)/(pk.x - pumin.x);
        let cons = pk.y - leftS*pk.x;
        for(let i =0;i<Upper.length;i++){
            if(Upper[i].y - leftS*Upper[i].x>cons){
                Left.push(Upper[i]);
            }
        }
    }
    if(pm.x === pumax.x){
        slope = Infinity;
        for(let i =0;i<Upper.length;i++){
            if(Upper[i].x>pm.x){
                Right.push(Upper[i]);
            }
        }
    }
    else {
        let RightS = (pm.y-pumax.y)/(pm.x - pumax.x);
        let cons = pm.y - RightS*pm.x;
        for(let i =0;i<Upper.length;i++){
            if(Upper[i].y - RightS*Upper[i].x>cons){
                Right.push(Upper[i]);
            }
        }
    }
    Left = keepUniqueElements(Left);
    Right = keepUniqueElements(Right);
    let ptsToRemove = [];
    for(let i =0;i<Upper.length;i++){
        let flag = true;
        for(let j =0;j<Left.length ;j++){
            if(Left[j].x===Upper[i].x && Left[j].y===Upper[i].y){
                flag = false;
                break;
            }
        }
        for(let j =0;j<Right.length ;j++){
            if(Right[j].x===Upper[i].x && Right[j].y===Upper[i].y){
                flag = false;
                break;
            }
        }
        if(flag===true){
            ptsToRemove.push(Upper[i]);
        }
    }
    if(ptsToRemove.length != 0){
        actions.push({func:removePoints, params:[ptsToRemove]});
    }
    if(Left.length >2 && !(pumin.x === pk.x && pumin.y ===pk.y)){
        actions.push({func:removeLine, params:[pumin, pk]});
    }
    if(Right.length >2 && !(pumax.x === pm.x && pumax.y ===pm.y)){
        actions.push({func:removeLine, params:[pumax , pm]});
    }
    let LeftU = UpperHull(pumin , pk , Left );
    let RightU = UpperHull(pm, pumax, Right);
    return LeftU.concat(RightU);

}

function LowerHull(plmin, plmax,Lower){
    if(plmin.x === plmax.x && plmin.y===plmax.y){
        return [plmin];
    }
    Lower.sort((a,b)=> a.x-b.x || a.y - b.y);
    let medianX;

    if (Lower.length % 2 === 0) {
        medianX = Lower[Math.ceil(Lower.length / 2)].x;
    } else {
        medianX = Lower[Math.floor(Lower.length / 2)].x;
    }
    let medianXtoShow;
    if (Lower.length % 2 === 0) {
        medianXtoShow = (Lower[Math.floor(Lower.length / 2)].x+Lower[Math.floor(Lower.length / 2)-1].x)/2;
    } else {
        medianXtoShow = Lower[Math.floor(Lower.length / 2)].x;
    }
    if(Lower.length >2){
        actions.push({func:medianDrawLine, params:[{x:medianXtoShow, y: -60}, {x:medianXtoShow, y: -700}]});
        actions.push({func:removeMedianLine, params:[]});
    }
    let temp = upperBridge(Lower, medianX);
    let pk = temp[0], pm = temp[1];
    if(!(plmin.x === pk.x && plmin.y === pk.y)){
        let lines = document.getElementsByClassName('line');
        let flag = true;
        for(let i =0;i<lines.length;i++){
            if(Number(lines[i].attributes.x1.value)===plmin.x+2.5 && Number(lines[i].attributes.y1.value)===-plmin.y+2.5
            && Number(lines[i].attributes.x2.value)===pk.x+2.5 && Number(lines[i].attributes.y2.value)===-pk.y+2.5){
                flag = false;
                break;
            }
        }
        if(flag===true){
            actions.push({func:drawLine, params:[{x:plmin.x, y: -plmin.y}, {x:pk.x, y:-pk.y}, "red","white"]});
        }
    }
    if(!(plmax.x === pm.x && plmax.y === pm.y)){
        let lines = document.getElementsByClassName('line');
        let flag = true;

        for(let i =0;i<lines.length;i++){
            if(Number(lines[i].attributes.x1.value)===plmax.x+2.5 && Number(lines[i].attributes.y1.value)===-plmax.y+2.5
            && Number(lines[i].attributes.x2.value)===pm.x+2.5 && Number(lines[i].attributes.y2.value)===-pm.y+2.5){
                flag = false;
                break;
            }
        }
        if(flag === true){
            actions.push({func:drawLine, params:[{x:plmax.x, y: -plmax.y}, {x:pm.x, y:-pm.y},"red","white"]});
        }
    }
    let Left = [];
    let Right = [];
    Left.push(plmin, pk);
    Right.push(pm, plmax);
    if(pk.x === plmin.x){
        slope = Infinity;
        for(let i =0;i<Lower.length;i++){
            if(Lower[i].x<pk.x){
                Left.push(Lower[i]);
            }
        }
    }
    else{
        let leftS = (-pk.y+plmin.y)/(pk.x - plmin.x);
        let cons = -pk.y - leftS*pk.x;
        console.log("leftc",cons,"lslope",leftS);
        for(let i =0;i<Lower.length;i++){
            if((-Lower[i].y - leftS*Lower[i].x)<cons){
                Left.push(Lower[i]);
            }
        }
    }

    if(pm.x === plmax.x){
        slope = Infinity;
        for(let i =0;i<Lower.length;i++){
            if(Lower[i].x>pm.x){
                Right.push(Lower[i]);
            }
        }
    }
    else {
        let RightS = (-pm.y+plmax.y)/(pm.x - plmax.x);
        let cons = -pm.y - RightS*pm.x;
        console.log("rightc",cons,"rslope",RightS);
        for(let i =0;i<Lower.length;i++){
            if((-Lower[i].y - RightS*Lower[i].x)<cons){
                Right.push(Lower[i]);
            }
        }
    }
    Left = keepUniqueElements(Left);
    Right = keepUniqueElements(Right);
    Left.sort((a,b)=> a.x-b.x || a.y - b.y);
    Right.sort((a,b)=> a.x-b.x || a.y - b.y);

    let ptsToRemove = [];
        for(let i =0;i<Lower.length;i++){
            let flag = true;
            for(let j =0;j<Left.length ;j++){
                if(Left[j].x===Lower[i].x && Left[j].y===Lower[i].y){
                    flag = false;
                    break;
                }
            }
            for(let j =0;j<Right.length ;j++){
                if(Right[j].x===Lower[i].x && Right[j].y===Lower[i].y){
                    flag = false;
                    break;
                }
            }
            if(flag===true){
                ptsToRemove.push({x:Lower[i].x , y:-Lower[i].y});
            }
        }
        if(ptsToRemove.length != 0){
            actions.push({func:removePoints, params:[ptsToRemove]});
        }
        if(Left.length >2 && !(plmin.x === pk.x && plmin.y ===pk.y)){
            actions.push({func:removeLine, params:[{x:plmin.x, y: -plmin.y}, {x:pk.x, y:-pk.y}]});
        }
        if(Right.length >2 && !(plmax.x === pm.x && plmax.y ===pm.y)){
            actions.push({func:removeLine, params:[{x:plmax.x, y: -plmax.y}, {x:pm.x, y:-pm.y}]});
        }
    //  console.log("Left Lower", Left,"plmin", plmin,"pk", pk);
    //  console.log("Right Lower", Right,"pm",pm,"plmax", plmax);
    let LowerHullL = LowerHull(plmin , pk , Left );
    let LowerHullR = LowerHull(pm, plmax, Right);
    return LowerHullL.concat(LowerHullR);
}

function upperBridge(S, a) {
    S.sort((a,b)=> a.x-b.x||a.y-b.y);
    console.log("input to ubrige", S, a, S.length);
    let pairs = [];
    let candidates = [];

    if (S.length === 2) {
        if (S[0].x < S[1].x) {
            if(S[0].y<0){
                actions.push({func:drawLine, params:[S[0],S[1], "green","green"]});
            }else{
                actions.push({func:drawLine, params:[{x:S[0].x, y: -S[0].y}, {x:S[1].x, y:-S[1].y},"green","green"]});
            }
            return [ S[0], S[1] ];
        } else {
            if(S[0].y<0){
                actions.push({func:drawLine, params:[S[0],S[1],"green","green"]});
            }else{
                actions.push({func:drawLine, params:[{x:S[0].x, y: -S[0].y}, {x:S[1].x, y:-S[1].y},"green","green"]});
            }
            return [ S[1], S[0] ];
        }
    }
    for (let i = 0; i < S.length; i += 2) {
        if (i + 1 < S.length) {
        if(S[i].x === S[i + 1].x){
        if(S[i].y > S[i+1].y)
            candidates.push(S[i]);
        else
            candidates.push(S[i+1]);
        }
        else if (S[i].x < S[i + 1].x)
            pairs.push([S[i], S[i + 1]]);
        else
            pairs.push([S[i + 1], S[i]]);
        } else {
            candidates.push(S[i]);
        }
    }

    let k = [];
    for (let i = 0; i < pairs.length; i++) {
    let pi = pairs[i][0];
    let pj = pairs[i][1];

    if (pi.x === pj.x) {
        const halfBeforeTheUnwantedElement = pairs.slice(0, i)
        const halfAfterTheUnwantedElement = pairs(i+1);
        const copyWithoutThirdElement = halfBeforeTheUnwantedElement.concat(halfAfterTheUnwantedElement);
        pairs = copyWithoutThirdElement;
        if (pi.y > pj.y) {
            candidates.push(pi);
        } else {
            candidates.push(pj);
        }
    } else {
        let sl= (pi.y - pj.y) / (pi.x - pj.x);
        let t = {slope:sl,pi:pi,pj:pj};
        k.push(t);
        }
    }

    k.sort((a, b) => a.slope - b.slope);
    let K = k[Math.floor(k.length / 2)].slope;

    let SMALL = [];
    let EQUAL = [];
    let LARGE = [];
    for (let i = 0; i < k.length; i++) {
    if (k[i].slope < K) {
    SMALL.push(k[i]);
    } else if (k[i].slope > K) {
    LARGE.push(k[i]);
    } else {
    EQUAL.push(k[i]);
    }
 }

 let MAX = -Infinity;
 let pm;
 let pk;

 for (let i = 0; i < S.length; i++) {
    let t = S[i].y - K * S[i].x;
    if (t > MAX) {
        MAX = t;
        pk = S[i];
        pm = S[i];
    }
 }

 for (let i = 0; i < S.length; i++) {
    let t = S[i].y - K * S[i].x;
    if (t === MAX) {
        if (pk.x > S[i].x) {
            pk = S[i];
        }
        if (pm.x < S[i].x) {
            pm = S[i];
        }
    }
 }

 if (pk.x < a && pm.x >= a) {
    if(pk.y<0){
        actions.push({func:drawLine, params:[pk,pm,"green","green"]});
    }else{
        actions.push({func:drawLine, params:[{x:pk.x, y:-pk.y},{x:pm.x, y:-pm.y},"green","green"]});
    }
    return [ pk, pm ];
 }

 if (pm.x < a) {
    for (let j = 0; j < LARGE.length; j++) {
        candidates.push(LARGE[j].pj);
    }
    for (let j = 0; j < EQUAL.length; j++) {
        candidates.push(EQUAL[j].pj);
    }
    for (let j = 0; j < SMALL.length; j++) {
        candidates.push(SMALL[j].pj);
        candidates.push(SMALL[j].pi);
    }
 } else {
    for (let j = 0; j < LARGE.length; j++) {
        candidates.push(LARGE[j].pi);
        candidates.push(LARGE[j].pj);
    }
    for (let j = 0; j < EQUAL.length; j++) {
        candidates.push(EQUAL[j].pi);
    }
    for (let j = 0; j < SMALL.length; j++) {
        candidates.push(SMALL[j].pi);
    }
 }


 candidates = keepUniqueElements(candidates);
 console.log("ubridge again", candidates, a);
 return upperBridge(candidates, a);
}

document.getElementById('clear-btn').addEventListener('click',function(event){
location.reload();
});

// document.getElementById('go-jarvis-btn').addEventListener('click',function(event){
//  window.location.href = "/convexhullvisualiser-master/convexhull.html"
// });

document.getElementById('start-btn').addEventListener('click', function(event) {
    controller.abort();
    let UpperHullPoints = ConvexHull(points);
    for(let i =0;i<UpperHullPoints.length ;i++){
        if(UpperHullPoints[i].y>0){
            drawPoint(UpperHullPoints[i].x, UpperHullPoints[i].y, "green","15","5");
        }else{
            drawPoint(UpperHullPoints[i].x, -UpperHullPoints[i].y, "green","15","5");
        }
    }    
});

document.getElementById('next').addEventListener('click',function(event){
    console.log(actions[count]);
    actions[count].func(...actions[count].params);
    count++;
});

document.getElementById('go-jarvis-btn').addEventListener('click',function(event){
  
});

async function loadFile() {
    controller.abort();
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.onchange = e => {
        return new Promise((resolve, reject) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            let maxX= -Infinity,maxY=-Infinity;
            let minX = Infinity,minY = Infinity;
            reader.onload = function(event) {
                const lines = event.target.result.split('\n');
                for(let line of lines) {
                    const [x, y] = line.split(' ');
                    maxX = Math.max(x,maxX);
                    maxY = Math.max(y,maxY);
                    minX = Math.min(x,minX);
                    minY = Math.min(y,minY);
                    points.push({x: parseFloat(x), y: parseFloat(y)});
                }
                console.log("jhsa")
                console.log(rect_details);
                console.log("hey");
                for(let i=0;i<points.length;i++){
                    points[i].x= (points[i].x - minX)/(maxX-minX);
                    points[i].x = points[i].x*600 + 600;
                    points[i].y= (points[i].y - minY)/(maxY-minY);
                    points[i].y = points[i].y*500+ 80;
                    drawPoint(points[i].x,points[i].y, "white","9","0")
                }
                console.log(points);
                resolve();
            };

            reader.onerror = reject;

            reader.readAsText(file);
        });
    }
    fileInput.click();
    await fileInput.onchange();
    let UpperHullPoints = ConvexHull(points);

    console.log("sparsh",UpperHullPoints);
    for(let i =0;i<UpperHullPoints.length ;i++){
        if(UpperHullPoints[i].y>0){
            drawPoint(UpperHullPoints[i].x, UpperHullPoints[i].y, "green","15","5");
        }else{
            drawPoint(UpperHullPoints[i].x, -UpperHullPoints[i].y, "green","15","5");
        }
    }
}



