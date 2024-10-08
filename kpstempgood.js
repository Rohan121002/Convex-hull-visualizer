// Sparsh Khandelwal 2021A7PS1320H
// Rohan Chavan 2021A7PS2739H
// Mihir Kulkarni 2021A7PS2689H
// Anmol Agarwal 2021A7PS0136H
// Rohit Das 2021A7PS2860H

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
    drawPoint(x,y, "blue");
}, { signal });

function drawLine(start, end) {
    let svg = document.getElementById('lineSVG');
    let newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    newLine.setAttribute('stroke-width', 3)
    newLine.setAttribute('x1', start.x + 2.5);
    newLine.setAttribute('y1', -start.y + 2.5);
    newLine.setAttribute('x2', end.x + 2.5);
    newLine.setAttribute('y2', -end.y + 2.5);
    newLine.setAttribute('stroke', 'black');
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
    
function drawPoint(x, y, color){
    let pointElement = document.createElement('div');
    pointElement.classList.add('vertex');
    pointElement.style.left = `${x - 5}px`;
    pointElement.style.top = `${y - 5}px`;
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
    let Upper = [];
    let Lower = [];
    Upper.push(pumax);
    Lower.push({x:plmax.x, y:-plmax.y});
    Upper.push(pumin);
    Lower.push({x:plmin.x, y:-plmin.y});
    let upperAngle = Math.atan2(pumax.y-pumin.y, pumax.x - pumin.x);
    let lowerAngle = Math.atan2(plmax.y-plmin.y, plmax.x -plmin.x);
    for(let i =0;i<points.length;i++){
    let UpperTempAngle = Math.atan2(points[i].y-pumin.y, points[i].x - pumin.x);
    let LowerTempAngle = Math.atan2(points[i].y-plmin.y, points[i].x - plmin.x);
    if(UpperTempAngle >= upperAngle){
        Upper.push(points[i]);
    }
    if(LowerTempAngle <= lowerAngle){
        Lower.push({x :points[i].x, y:-points[i].y});
    }
    }
    Upper = keepUniqueElements(Upper);
    Lower = keepUniqueElements(Lower);
    // console.log("lower points" , Lower);
    // let UpperPoints = [];
    // console.log("abc",UpperHull(pumin , pumax,Upper))
    return UpperHull(pumin,pumax,Upper);
    // for(let i =0;i<UpperPoints.length ;i++){
    //     drawPoint(UpperPoints[i].x, -UpperPoints[i].y, "green");
    // }
}

function UpperHull(pumin, pumax,Upper){
    if(pumin.x === pumax.x && pumin.y===pumax.y){
        return [pumin];
    }
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
    for(let i =0;i<Upper.length;i++){
        if(Math.atan2(Upper[i].y - pumin.y,Upper[i].x - pumin.x) > leftSlope){
            Left.push(Upper[i]);
        }
        if(Math.atan2(Upper[i].y - pumax.y,Upper[i].x - pumax.x) < RightSlope){
            if(Upper[i] != pumin && Upper[i] != pumax){
                Right.push(Upper[i]);
            }
        }
    }
    Left = keepUniqueElements(Left);
    Right = keepUniqueElements(Right);
    // console.log("union ans" ,UpperHull(pumin , pk , Left ).concat(UpperHull(pm, pumax, Right)));
    console.log("uleft",UpperHull(pumin , pk , Left ));
    console.log("uright",UpperHull(pm, pumax, Right))
    return UpperHull(pumin , pk , Left ).concat(UpperHull(pm, pumax, Right));
}

function LowerHull(plmin, plmax,Lower){
    if(plmin.x === plmax.x && plmin.y===plmax.y){
        return [plmin];
    }
    let medianX;
    if (points.length % 2 === 0) {
        medianX = (points[Math.floor(points.length / 2)].x + points[Math.floor(points.length / 2) + 1].x)/2;
    } else {
        medianX = points[Math.floor(points.length / 2)].x;
    }
    let temp = upperBridge(Lower, medianX);
    let pk = temp[0], pm = temp[1];
    drawPoint(pk.x, -pk.y, "red");
    drawPoint(pm.x, -pm.y, "red");
    // console.log(pk, pm);
    // UpperPoints.push(pk);
    // UpperPoints.push(pm);
    let Left = [];
    let Right = [];
    let leftSlope = Math.atan2(pk.y-plmin.y,pk.x - plmin.x);
    let RightSlope = Math.atan2(pm.y - plmax.y, pm.x - plmax.x);
    Left.push(plmin, pk);
    Right.push(pm, plmax);
    for(let i =0;i<Lower.length;i++){
        if(Math.atan2(Lower[i].y - plmin.y,Lower[i].x - plmin.x) > leftSlope){
            Left.push(Lower[i]);
        }
        if(Math.atan2(Lower[i].y - plmax.y,Lower[i].x - plmax.x) < RightSlope){
            if(Lower[i] != plmin && Lower[i] != plmax){
                Right.push(Lower[i]);
            }
        }
    }
    for(let i =0;i<Left.length;i++){
        drawPoint(Left[i].x, -Left[i].y,"red");
    }
    for(let i =0;i<Right.length;i++){
        drawPoint(Right[i].x, -Right[i].y,"yellow");
    }
    Left = keepUniqueElements(Left);
    Right = keepUniqueElements(Right);
    // console.log("union ans" ,UpperHull(pumin , pk , Left ).concat(UpperHull(pm, pumax, Right)));
    console.log("uleft",UpperHull(plmin , pk , Left ));
    console.log("uright",UpperHull(pm, plmax, Right))
    return UpperHull(plmin , pk , Left ).concat(UpperHull(pm, plmax, Right));
}

function upperBridge(S, a) {
    S.sort((a,b)=> a.x-b.x||a.y-b.y);
    console.log("input to ubrige", S, a);
    let pairs = [];
    let candidates = [];

    if (S.length === 2) {
        if (S[0].x < S[1].x) {
            return [ S[0],  S[1] ];
        } else {
            return [ S[1], S[0] ];
        }
    }
    // if(S.length === 3){
    //     if(S[0].y < S[1].y && S[0].y < S[1].y){
    //         if(Math.abs((S[0].y - S[1].y)(S[0].x-S[1].x)) < Math.abs((S[0].y - S[2].y)(S[0].x-S[2].x))){
    //             return [S[0], S[1]];
    //         }
    //     }
    // }

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

    // if(pairs.length === 1){
    //     console.log(pairs);
    //     return [pairs[0], pairs[1]];
    // }

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
              // console.log("hey123");
            //   drawLine(pi, pj);
              k.push(t);
          }
        // Draw line between pi and pj
        // drawLine(pi, pj);

        // let sl = (pi.y - pj.y) / (pi.x - pj.x);
        // let t = { slope: sl, pi: pi, pj: pj };
        // k.push(t);
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
    // let list = document.getElementsByClassName('vertex');
    // console.log("thsi is all points"+list);
    // let Upper_points = [];
    let UpperHullPoints = ConvexHull(points);
    console.log("sparsh",UpperHullPoints)
    for(let i =0;i<UpperHullPoints.length ;i++){
        drawPoint(UpperHullPoints[i].x, -UpperHullPoints[i].y, "green");
    }
    // upperHull(points, Upper_points);
    // console.log(Upper_points);
});
