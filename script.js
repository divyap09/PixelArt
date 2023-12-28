const size = document.getElementById("rows");
const gridContainer = document.getElementById("gridContainer");
var pixels = document.getElementsByClassName("pixel");

const gridWidth = 500

undoStack = [];
redoStack = [];

//disable undo and redo buttons
document.getElementById("undoButton").disabled = true;
document.getElementById("redoButton").disabled = true;

function generateGrid(){
    //clear gridContainer
    gridContainer.innerHTML = "";
    var pixelSize = gridWidth/size.value;
    
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
            button.style.width = pixelSize+"px";
            button.style.height = pixelSize+"px";

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

    if(undoStack.length > 0)
        document.getElementById("saveButton").disabled = false;
    else
        document.getElementById("saveButton").disabled = true;

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
    document.getElementById(lastPixel.id).style.backgroundColor = lastPixel.color;
}

function ClearBoard(){
    let buttons = document.getElementsByClassName("pixel");
    for(let i=0;i<buttons.length;i++){
        buttons[i].style.backgroundColor = "white";
    }
    undoStack = [];
    redoStack = [];
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