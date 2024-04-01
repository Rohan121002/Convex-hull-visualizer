let points = [];
let count = 0;
let currentPointIndex = 0;
let hull = [];
let lines = [];
let actions = [];
let medianLines = [];
let toRemove = [];
let already = new Set();

const controller = new AbortController();
const signal = controller.signal;

let rect_details = [];

document.getElementById('pointsDiv').addEventListener('click', function(event) {
let rect = event.target.getBoundingClientRect();
let x = event.clientX;
let y = event.clientY;
console.log(rect, x, y);
 points.push({ x: x, y: -y});
//  console.log("this",x, y);
 drawPoint(x,y, "white","9","0");
}, { signal });

function drawLine(start, end, color) {
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
    // if(`${ptColor}`==="green"){
    //     let pts = document.getElementsByClassName('vertex');
    //     console.log(start, end);
    //     console.log(pts);
    //     for(let i =0;i<pts.length;i++){
    //         if(pts[i].offsetLeft === start.x && pts[i].offsetTop === -start.y){
    //             console.log("hey12");
    //             document.getElementById('pointsDiv').removeChild(pts[i]);
    //             drawPoint(start.x , -start.y, "green", "15","3.5");
    //             console.log("hey again12");
    //         }
    //         if(pts[i].offsetLeft === end.x && pts[i].offsetTop === -end.y){
    //             console.log("hey12");
    //             document.getElementById('pointsDiv').removeChild(pts[i]);
    //             drawPoint(end.x , -end.y, "green", "15","3.5");
    //             console.log("hey again12");
    //         }
    //     }
    // }
    // console.log("hey again");
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
    // console.log("Problem",ptsToRemove);
    
    let pts = document.getElementsByClassName('vertex');
    let rem=[];
    for(let i =0;i<pts.length;i++){
        for(let j =0;j<ptsToRemove.length;j++){
            if(pts[i].offsetLeft === ptsToRemove[j].x && pts[i].offsetTop === -ptsToRemove[j].y){
                rem.push(pts[i]);
            }
        }
    }
    console.log("hemlo",rem)
    for(let i =0;i<rem.length;i++){
        document.getElementById('pointsDiv').removeChild(rem[i]);
    }
}

function distance(p1, p2){
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  };


function ConvexHull(points){
    if (points.length < 3) return [];
    let hull = [];
    
    let leftMost = points.reduce((left, p) => (p.x < left.x ? p : left), points[0]);
    hull.push(leftMost);
    let currentPoint = leftMost;
    let nextPoint;
    already.add(leftMost);
    do {
      nextPoint = points[0];
      actions.push({func:drawPoint, params:[currentPoint.x, -currentPoint.y, "green","15","5"]});
      for (let i = 1; i < points.length; i++) {
        let crossProduct = (nextPoint.y - currentPoint.y) * (points[i].x - nextPoint.x) - (nextPoint.x - currentPoint.x) * (points[i].y - nextPoint.y);
        if(!already.has(points[i])){
            actions.push({func:drawLine, params:[currentPoint, points[i], "red"]});
            actions.push({func:removeLine, params:[currentPoint, points[i]]});
        }
        if (crossProduct < 0 || (crossProduct === 0 && distance(currentPoint, points[i]) > distance(currentPoint, nextPoint))) {
          nextPoint = points[i];
        }
      }
      actions.push({func:drawLine, params:[currentPoint, nextPoint, "green"]});
      currentPoint = nextPoint;
      hull.push(currentPoint);
      already.add(currentPoint);
    } while (nextPoint !== leftMost);
    // let arr = [...already];
    let brr = new Set(points);
    let difference = new Set();
    brr.forEach(function(element) {
        if (!already.has(element)) {
            difference.add(element);
        }
    });
    let arr = [...difference];
    actions.push({func:removePoints, params:[arr]});
    return hull;
}

document.getElementById('clear-btn').addEventListener('click',function(event){
location.reload();
});


document.getElementById('next').addEventListener('click',function(event){
    // console.log(actions[count]);
    console.log("inside next");
    console.log(actions[count]);
    actions[count].func(...actions[count].params);
    count++;
    console.log("outside next");
});

document.getElementById('skip-3-step-btn').addEventListener('click',function(event){
    // console.log(actions[count]);
    // console.log("inside next");
    // console.log(actions[count]);
    actions[count].func(...actions[count].params);
    count++;
    actions[count].func(...actions[count].params);
    count++;
    actions[count].func(...actions[count].params);
    count++;
    // console.log("outside next");
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
                    drawPoint(parseFloat(x),parseFloat(y), "white","9","0");
                    points.push({x: parseFloat(x), y: -parseFloat(y)});
                }
                resolve();
            };

            reader.onerror = reject;

            reader.readAsText(file);
        });
    }
    fileInput.click();
    await fileInput.onchange();
    let UpperHullPoints = ConvexHull(points);
}

document.getElementById('final-btn').addEventListener('click',function(event){
    
    let UpperHullPoints = ConvexHull(points);
    for(let i =0;i<actions.length;i++){
        console.log(actions[i]);
        actions[i].func(...actions[i].params);
    }
    
});


document.getElementById('random-btn').addEventListener('click', async function(event){
    let num = document.getElementById("numberInput").value;
    document.getElementById("numberInput").value = "";
    for(let i =0;i<num;i++){
        let x = Math.floor((Math.random() * 740) + 860);
        let y = Math.floor((Math.random() * 630) + 70);
        points.push({ x: x, y: -y});
        drawPoint(x,y, "white","9","0");
    }
    console.log(points);
});

document.getElementById('start-btn').addEventListener('click', function(event) {
    console.log("inside final");
    controller.abort();
    let UpperHullPoints = ConvexHull(points); 
    console.log("outside final");
});