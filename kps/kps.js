let points = [];
let count = 0;
let currentPointIndex = 0;
let hull = [];
let lines = [];

const controller = new AbortController();
const signal = controller.signal;

document.getElementById('pointsDiv').addEventListener('click', function(event) {
 let rect = event.target.getBoundingClientRect();
 let x = event.clientX;
 let y = event.clientY;
 points.push({ x: x, y: -y});
 drawPoint(x,y, "white","9","0");
}, { signal });

function drawLine(start, end) {
 let svg = document.getElementById('lineSVG');
 let newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
 newLine.setAttribute('stroke-width', 3)
 newLine.setAttribute('x1', start.x + 2.5);
 newLine.setAttribute('y1', -start.y + 2.5);
 newLine.setAttribute('x2', end.x + 2.5);
 newLine.setAttribute('y2', -end.y + 2.5);
 newLine.setAttribute('stroke', 'green');
 svg.appendChild(newLine);
 lines.push(newLine);
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
}else if(points[i].x===xmax && points[i].y>pumax.y){
 pumax = points[i];
}else if(points[i].x===xmax && points[i].y<plmax.y){
 plmax = points[i];
}
}
for(let i =0;i<points.length;i++){
if(points[i].x<xmin){
 pumin = points[i];
 plmin = points[i];
 xmin = points[i].x;
}else if(points[i].x===xmin && points[i].y>pumin.y){
 pumin = points[i];
}else if(points[i].x===xmin && points[i].y<plmin.y){
 plmin = points[i];
}
}
// console.log(pumax, pumin, plmax, plmin);
return {pumax, pumin, plmax, plmin};
}

function ConvexHull(points){
 points.sort((a,b)=> a.x-b.x || a.y - b.y);
 console.log("sorted", points);
 let {pumax, pumin, plmax, plmin} = findminmax(points);
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
 console.log("lower points" , Lower,plmin, plmax);
 console.log("Upper Points", Upper, pumin , pumax);
 let LowerAns = LowerHull(plmin,plmax,Lower);
 let UpperAns = UpperHull(pumin,pumax,Upper);
 return UpperAns.concat(LowerAns);
 // for(let i =0;i<UpperPoints.length ;i++){
 // drawPoint(UpperPoints[i].x, -UpperPoints[i].y, "green");
 // }
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
 let temp = upperBridge(Upper, medianX);
 let pk = temp[0], pm = temp[1];
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
 
 
 // for(let i =0;i<Upper.length;i++){
 // if(Math.atan2(Upper[i].y - pumin.y,Upper[i].x - pumin.x) > leftSlope){
 // Left.push(Upper[i]);
 // }
 // if(Math.atan2(Upper[i].y - pumax.y,Upper[i].x - pumax.x) < RightSlope){
 // if(Upper[i] != pumin && Upper[i] != pumax){
 // Right.push(Upper[i]);
 // }
 // }
 // }
 Left = keepUniqueElements(Left);

 Right = keepUniqueElements(Right);
 console.log("uleft",UpperHull(pumin , pk , Left ));
 console.log("uright",UpperHull(pm, pumax, Right));
 let LeftU = UpperHull(pumin , pk , Left );
 let RightU = UpperHull(pm, pumax, Right);
 console.log("uleft and uright calculated");
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
 console.log("new ubridge");
 let temp = upperBridge(Lower, medianX);
 let pk = temp[0], pm = temp[1];
 console.log("abc","plmin",plmin,"plmax", plmax, "pk",pk ,"pm",pm);
 let Left = [];
 let Right = [];
 // let leftSlope = Math.atan2(pk.y-plmin.y,pk.x - plmin.x);
 // let RightSlope = Math.atan2(pm.y - plmax.y, pm.x - plmax.x);
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
 // for(let i =0;i<Lower.length;i++){
 // if(Math.atan2(Lower[i].y - plmin.y,Lower[i].x - plmin.x) > leftSlope){
 // Left.push(Lower[i]);
 // }
 // if(Math.atan2(Lower[i].y - plmax.y,Lower[i].x - plmax.x) < RightSlope){
 // if(Lower[i] != plmin && Lower[i] != plmax){
 // Right.push(Lower[i]);
 // }
 // }
 // }
 Left = keepUniqueElements(Left);
 Right = keepUniqueElements(Right);
 Left.sort((a,b)=> a.x-b.x || a.y - b.y);
 Right.sort((a,b)=> a.x-b.x || a.y - b.y);
 console.log("Left Lower", Left,"plmin", plmin,"pk", pk);
 console.log("Right Lower", Right,"pm",pm,"plmax", plmax);
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
//  console.log("return from ubrige");
// console.log("drawLine")
//  console.log(S[0], S[1])
if(S[0].y<0){
    drawLine(S[0], S[1]);
}else{
    drawLine({x:S[0].x, y: -S[0].y}, {x:S[1].x, y:-S[1].y})
}
 return [ S[0], S[1] ];
 } else {
//  console.log("return from ubrige");
// console.log("drawLine")
// console.log(S[1], S[0]);
if(S[0].y<0){
    drawLine(S[0], S[1]);
}else{
    drawLine({x:S[0].x, y: -S[0].y}, {x:S[1].x, y:-S[1].y})
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
    // console.log("drawLine")
    // console.log("pk", pk, "pm", pm);
    if(pk.y<0){
        drawLine(pk,pm);
    }else{
        drawLine({x:pk.x, y:-pk.y},{x:pm.x, y:-pm.y});
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

document.getElementById('go-jarvis-btn').addEventListener('click',function(event){
 window.location.href = "/convexhullvisualiser-master/convexhull.html"
});

document.getElementById('start-btn').addEventListener('click', function(event) {
 controller.abort();
 console.log("input", points);
 // points = []
 let UpperHullPoints = ConvexHull(points);

 console.log("sparsh",UpperHullPoints);
 for(let i =0;i<UpperHullPoints.length ;i++){
 if(UpperHullPoints[i].y>0){
 drawPoint(UpperHullPoints[i].x, UpperHullPoints[i].y, "green","15","5");
 }else{
 drawPoint(UpperHullPoints[i].x, -UpperHullPoints[i].y, "green","15","5");
 }
 }
});
