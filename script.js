const size = document.getElementById("rows");
const gridContainer = document.getElementById("gridContainer");
var pixels = document.getElementsByClassName("pixel");
var colorPicker = document.getElementById("colorPicker");
const gridWidth = 500

var undoStack = [];
var redoStack = [];
var undoOrder = [];
var redoOrder = [];

//disable undo and redo buttons
document.getElementById("undoButton").disabled = true;
document.getElementById("redoButton").disabled = true;

var isGeneratedOnload = true;

function generateGrid(){
    //clear gridContainer
    gridContainer.innerHTML = "";
    console.log(window.innerWidth)
    windowWidth = window.innerWidth;
    undoStack = [];
    redoStack = [];
    undoOrder = [];
    redoOrder = [];

    
    var gridSize = 500;
    var temp =2 ;
    if (windowWidth > 1000)
        temp = 4;

    else if(windowWidth > 500)
        temp = 2;
    
    else if(windowWidth > 400){
        gridSize = 400;
        temp = 2;
    }
    else if(windowWidth > 300){
        gridSize = 300;
        temp = 2;
    }

    gridContainer.style.width = (gridSize+4)+"px";
    gridContainer.style.height = (gridSize+4)+"px";

    var pixelSize =  Math.ceil(gridSize/size.value);
    
    //create size*size buttons and add them in gridContainer
    for(let i=0;i<size.value;i++){
        //create a div for each row
        let row = document.createElement("div");
        row.className = "pixelRow";
        
        //create buttons for each row
        for(let j=0;j<size.value;j++){
            let button = document.createElement("button");
            //button id = i*size+j
            button.id = i*size.value+j;

            //creating an entry in undoStack for each pixel with id and color array as key value pair

            //button width and height
            button.style.width = pixelSize+"px";
            button.style.height = pixelSize+"px";

            button.className = "pixel";
            
            //if(isGeneratedOnload){
                initUndoStack(button);
                button.style.backgroundColor = "white";
            //} 
            /*
            button.addEventListener("click",function(){
                if(button.style.backgroundColor == "black")
                    button.style.backgroundColor = "white";
                else
                button.style.backgroundColor = "black";
            });
            */
            row.appendChild(button);
        }
        gridContainer.appendChild(row);
    }
    isGeneratedOnload = false;
}

document.addEventListener("click",function(e){
    const target = e.target;
    
    if(target.className == "pixel"){
        target.style.backgroundColor = document.getElementById("colorPicker").value;
        var dict = {};
        dict["id"] = target.id;
        dict["color"] = target.style.backgroundColor;

        //if redoOrder is not empty, then clear it
        if(redoOrder.length > 0){
            redoOrder = [];
            for(let i=0;i<redoStack.length;i++){
                redoStack[i]["color"] = [];
            }
        }



        //if top element of undoStack is same as current pixel, then don't push it
        if(undoStack.length > 0){
            if(undoStack[undoStack.length-1]["id"] == dict["id"] && undoStack[undoStack.length-1]["color"] == dict["color"])
                return;
        }
        //undoStack.push(dict);
        //the find the button in undoStack and append its color
        for(let i=0;i<undoStack.length;i++){
            if(undoStack[i]["id"] == dict["id"]){
                undoStack[i]["color"].push(dict["color"]);
            }
        }
        undoOrder.push(target.id);
    }

    if(undoOrder.length > 0){
        document.getElementById("undoButton").disabled = false;
        document.getElementById("saveButton").disabled = false;
    }
        
    else{
        document.getElementById("saveButton").disabled = true;
        document.getElementById("undoButton").disabled = true;
    }
       
    if(redoOrder.length > 0)
        document.getElementById("redoButton").disabled = false;
    else
        document.getElementById("redoButton").disabled = true;
  
});

/*

for(let j=0;j<size.value;j++){
            let button = document.createElement("button");
            
            
            //button color and border
            //button.style.backgroundColor = "white";
            button.style.border = "1px solid black";

            button.classList.add("gridButton");
            button.addEventListener("click",function(){
                button.style.backgroundColor = document.getElementById("colorPicker").value;
            });
            gridContainer.appendChild(button);
        }
*/

function undoColor(){
    if(undoOrder.length == 0){
        return;
    }

    let lastPixel = undoOrder.pop();
    redoOrder.push(lastPixel);
    
    var lastPixelColor = "";
    var index = -1;
    //from undoStack, find the last color of this pixel
    for(let i=0;i<undoStack.length;i++){
        if(undoStack[i]["id"] == lastPixel){
            var temp = undoStack[i]["color"].pop();
            redoStack[i]["color"].push(temp);
            index = i;
            break;
        }
    }
    
    //find the last color of this pixel
    var findPos = undoStack[index]["color"].length-1;
    lastPixelColor = undoStack[index]["color"][findPos];

    document.getElementById(lastPixel).style.backgroundColor = lastPixelColor; //lastPixel.color;
   
}

function redoColor(){
    if(redoOrder.length == 0)
        return;

    let lastPixel = redoOrder.pop();
    undoOrder.push(lastPixel);

    var lastPixelColor = "";
    var index = -1;
    //from redoStack, find the last color of this pixel
    for(let i=0;i<redoStack.length;i++){
        if(redoStack[i]["id"] == lastPixel){
            var temp = redoStack[i]["color"].pop();
            undoStack[i]["color"].push(temp);
            index = i;
            break;
        }
    }

    var findPos = redoStack[index]["color"].length-1;
    lastPixelColor = redoStack[index]["color"][findPos];
   // console.log(lastPixelColor + " index: "+index);    
    document.getElementById(lastPixel).style.backgroundColor = temp; //lastPixelColor;
}

function ClearBoard(){
    let buttons = document.getElementsByClassName("pixel");
    for(let i=0;i<buttons.length;i++){
        buttons[i].style.backgroundColor = "white";
    }
    undoOrder = [];
    redoOrder = [];

    for(let i=0;i<undoStack.length;i++){
        undoStack[i]["color"] = ["rgb(255,255,255)"];
        redoStack[i]["color"] = [];
    }
}

function SaveBoard(){
    console.log("save");
    //convert gridContainer to canvas
    html2canvas(gridContainer,{
        onrendered: function(canvas){

            var image = canvas.toDataURL("image/jpg");
            var renderedImg = image.replace(/^data:image\/jpg/,"data:application/octet-stream");

            //download image
            var link = document.createElement("a");
            link.download = "pixelImage.jpg";
            link.href = renderedImg;
            link.click();
        }
    });
}

window.onresize = function(event) {
    generateGrid();
};

function colorChange(target){
    colorPicker.value = target;
}

//function to convert RGB to #hex
function rgbToHex(color){
    var hex = "#";
    for(let i=0;i<color.length;i++){
        var temp = parseInt(color[i]);
        hex += temp.toString(16);
    }
    return hex;
}


//initializing undoStack
function initUndoStack(target){

    var dict = {
        "id": target.id,
        "color": ["rgb(255,255,255)"]
    };
    undoStack.push(dict);
    initRedoStack(target);
}

function initRedoStack(target){
    var dict = {
        "id": target.id,
        "color": []
    };
    redoStack.push(dict);
}