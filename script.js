const size = document.getElementById("rows");
const gridContainer = document.getElementById("gridContainer");
var pixels = document.getElementsByClassName("pixel");
undoStack = [];
redoStack = [];

//disable undo and redo buttons
document.getElementById("undoButton").disabled = true;
document.getElementById("redoButton").disabled = true;

function generateGrid(){
    //clear gridContainer
    gridContainer.innerHTML = "";

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
            //button width and height
            if(size.value == 5){
                button.style.width = "100px";
                button.style.height = "100px";
            }
            else if(size.value == 10){
                button.style.width = "50px";
                button.style.height = "50px";
            }
            else if(size.value == 20){
                button.style.width = "25px";
                button.style.height = "25px";
            }
            else if(size.value == 25){
                button.style.width = "20px";
                button.style.height = "20px";
            }
            else if(size.value == 50){
                button.style.width = "10px";
                button.style.height = "10px";
            }
            button.className = "pixel";
            button.addEventListener("click",function(){
                if(button.style.backgroundColor == "black")
                    button.style.backgroundColor = "white";
                else
                button.style.backgroundColor = "black";
            });
            row.appendChild(button);
        }
        gridContainer.appendChild(row);


    }

}

//when pixel button is clicked, add it to undoStack

document.addEventListener("click",function(e){
    const target = e.target;
    if(target.className == "pixel"){
        var dict = {};
        dict["id"] = target.id;
        dict["color"] = target.style.backgroundColor;
        undoStack.push(dict);
        console.log(undoStack);
    }

    if(undoStack.length > 0)
        document.getElementById("undoButton").disabled = false;
    else
        document.getElementById("undoButton").disabled = true;

    if(redoStack.length > 0)
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
    if(undoStack.length == 0)
        return;

    //pop last element from undoStack
    let lastPixel = undoStack.pop();
    console.log(lastPixel.id + " " + lastPixel.color);
    //add it to redoStack
    redoStack.push(lastPixel);
    //change color of pixel
    document.getElementById(lastPixel.id).style.backgroundColor = lastPixel.color == "black" ? "white" : "black";
}

function redoColor(){
    if(redoStack.length == 0)
        return;

    //pop last element from redoStack
    let lastPixel = redoStack.pop();
    //add it to undoStack
    undoStack.push(lastPixel);
    //change color of pixel
    document.getElementById(lastPixel.id).style.backgroundColor = lastPixel.color == "black" ? "white" : "black";
}

function ClearBoard(){
    let buttons = document.getElementsByClassName("pixel");
    for(let i=0;i<buttons.length;i++){
        buttons[i].style.backgroundColor = "white";
    }
    undoStack = [];
}

function SaveBoard(){
    console.log("save");
    //convert gridContainer to canvas
    html2canvas(gridContainer,{
        onrendered: function(canvas){
            //add canvas to body
            document.body.appendChild(canvas);
            //save canvas as png
            Canvas2Image.saveAsPNG(canvas);
        }
    });
}