const size = document.getElementById("rows");
const gridContainer = document.getElementById("gridContainer");

function generateGrid(){
    console.log(size.value);
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

function ClearBoard(){
    let buttons = document.getElementsByClassName("pixel");
    for(let i=0;i<buttons.length;i++){
        buttons[i].style.backgroundColor = "white";
    }
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