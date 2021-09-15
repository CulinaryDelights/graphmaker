var context = document.querySelector('#graphCanvas').getContext('2d');
var canvas = document.querySelector('#graphCanvas')
context.canvas.width = 500;
context.canvas.height = 500;

graphTitleInput = document.getElementById("graphTitleInput");
graphLabelsInput = document.getElementById("graphLabelsInput");
graphValuesInput = document.getElementById("graphValuesInput");

graphColorInput = document.getElementById("graphColorInput");
graphLineColorInput = document.getElementById("graphLineColorInput");
graphTitleColorInput = document.getElementById("graphTitleColorInput");

class Entity {
    constructor(position, size, color, tag, type) {
        this.position = position;
        this.size = size;
        this.color = color;
        this.tag = tag;
        this.type = type;
    }

    Start() {

    }

    Update() {

    }
}

const entity_types = {
    RECTANGLE: "rectangle",
    HIDDEN: "hidden",
    ELLIPSE: "ellipse",
    TEXT: "text",
    LINE: "line",
    IMAGE: "image",
};

function CollisionDetection(x, y, w, h, x2, y2, w2, h2) {
    if (x - w2 < x2 && x + w > x2 && y - h2 < y2 && y + h > y2) {
        return true;
    }
    return false;
}

//Checks where in an array a given entity is
function CheckArrayEntity(array, entity) {
    for (var i = 0; i < array.length; i++) {
        entityOn = array[i];
        if (entityOn == entity) {
            return i;
        }
    }
}

function RemoveEntity(entity) {
    entities.forEach(element => {
        if (element == entity) {
            entities.splice(CheckArrayEntity(entities, entity), 1);
        }
    });
}

function AddEntity(entity, arrayPosition) {
    entity.Start();
    arrayPosition = arrayPosition || 0;
    entities.splice(arrayPosition, 0, entity);
}

entities = [];

function GameUpdate(progress) {
    entities.forEach(element => {
        element.Update()
    });
}

function GameRender() {
    context.fillStyle = graphColorInput.value;
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    entities.forEach(element => {
        if (element.type == entity_types.RECTANGLE) {
            context.fillStyle = element.color;
            context.fillRect(element.position.x, element.position.y, element.size.x, element.size.y);
        }
        else if (element.type == entity_types.HIDDEN) {

        }
        else if (element.type == entity_types.ELLIPSE) {
            element.rotation = element.rotation | 0;
            context.fillStyle = element.color;

            context.beginPath();
            context.ellipse(element.position.x, element.position.y, element.size.x, element.size.y, element.rotation, 0, Math.PI * 2);
            context.fill();
        }
        else if (element.type == entity_types.LINE) {
            context.strokeStyle = element.color;
            context.lineWidth = element.lineWidth;

            context.beginPath();
            context.moveTo(element.position.x,element.position.y);
            context.lineTo(element.endPosition.x,element.endPosition.y);
            context.stroke();
        }
        else if (element.type == entity_types.TEXT) {
            context.font = String(element.fontSize) + " " + element.font;
            context.fillStyle = element.textColor
            context.textAlign = element.textAlign;
            context.fillText(element.text, element.position.x, element.position.y);
        }
        else if (element.type == entity_types.IMAGE) {
            context.drawImage(element.image, element.position.x, element.position.y, element.size.x, element.size.y);
        }
        else {
            console.error("Give " + element.constructor.name + " a type")
        }
    });
}

//Checks an array for 1 thing with a specific tag and returns it
function CheckArrayTag(array, tag) {
    for (var i = 0; i < array.length; i++) {
        entity = array[i];
        if (entity.tag == tag) {
            return entity;
        }
    }
}

//Checks an array for things with a specific tag and returns them in an array
function CheckArrayTags(array, tag) {
    entityList = [];

    for (var i = 0; i < array.length; i++) {
        entity = array[i];
        if (entity.tag == tag) {
            entityList.push(entity);
        }
    }
    return entityList;
}

class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Circle extends Entity {
    constructor(position, size, color, rotation) {
        super(position);
        this.type = entity_types.ELLIPSE;
        this.position = position;
        this.size = size;
        this.color = color;
        this.rotation = rotation;
        this.tag = "circle";
    }
}

class Line extends Entity {
    constructor(position, endPosition, color, lineWidth, tag) {
        super(position);
        this.type = entity_types.LINE;
        this.position = position;
        this.endPosition = endPosition;
        this.color = color;
        this.lineWidth = lineWidth;
        this.tag = tag;
    }
}

class Text extends Entity {
    constructor(text, fontSize, textColor, font, textAlign, position, tag) {
        super(position);
        this.type = entity_types.TEXT;
        this.fontSize = fontSize;
        this.tag = tag;
        this.text = text;
        this.textColor = textColor;
        this.textAlign = textAlign;
        this.font = font;
    }

    Update() {

    }
}


DrawGraph();
function DrawGraph() {
    
    var labelAmount = (graphLabelsInput.value.split(" ").length);
    var graphValues = graphValuesInput.value.split(' '); 
    var graphLabels = graphLabelsInput.value.split(' '); 
    
    while(CheckArrayTags(entities,"circle").length > 0) {
        var i = 0; 
        RemoveEntity(CheckArrayTags(entities,"graphLines")[i]);
        RemoveEntity(CheckArrayTags(entities,"circle")[i]);
        RemoveEntity(CheckArrayTags(entities,"graphLabelText")[i]);
        RemoveEntity(CheckArrayTags(entities,"graphTitle")[i]);
        i += 1;
    }
    
    while(CheckArrayTags(entities,"graphNumberText").length > 0) {
        var i = 0; 
        RemoveEntity(CheckArrayTags(entities,"graphNumberText")[i]);
        RemoveEntity(CheckArrayTags(entities,"graphNumberLines")[i]);
        i += 1;
    }
    
    AddEntity(new Text("","24px",graphTitleColorInput.value,"Arial","center",new Vector2(context.canvas.width / 2,50),"graphTitle"));
    CheckArrayTag(entities,"graphTitle").text = graphTitleInput.value;
    CheckArrayTag(entities,"graphTitle").color = graphTitleColorInput.value;

    var highestPoint = Math.max.apply(Math,graphValues);
    var graphPoint = highestPoint / (context.canvas.height - 200);

    var lineAmount = 10;
    var closestCompositeNum;

    for(var i = highestPoint; i < highestPoint + 10; i++) {
        for(var l = 6; l < 10; l++) {
            if(i % l == 0) {
                lineAmount = l;
                closestCompositeNum = i;
                break;
            }
        }

        if(closestCompositeNum != null) {
            break;
        }
    }


    if(CheckArrayTags(entities,"circle").length == 0) {
        for(var i = 0; i < labelAmount; i++) {
            if(graphValues[i] == highestPoint || graphValues[i] > closestCompositeNum / lineAmount * (lineAmount - 1)) {
                AddEntity(new Circle(new Vector2(i * ((context.canvas.width - 150) / (labelAmount - 1)) + 100,(context.canvas.height - (100 - (closestCompositeNum - highestPoint) * 5)) - graphValues[i] / graphPoint),new Vector2(7,7),graphLineColorInput.value));
                console.log("hi")
            }
            else {
                AddEntity(new Circle(new Vector2(i * ((context.canvas.width - 150) / (labelAmount - 1)) + 100,(context.canvas.height - (100 - (closestCompositeNum - highestPoint) * 2)) - graphValues[i] / graphPoint),new Vector2(7,7),graphLineColorInput.value));
            }
            AddEntity(new Text(graphLabels[i],"16px","black","Arial","center",new Vector2(i * ((context.canvas.width - 150) / (labelAmount - 1)) + 100,context.canvas.height - 50),"graphLabelText"));
        }
    }

    if(CheckArrayTags(entities,"circle").length == labelAmount && CheckArrayTags(entities,"line") == 0) {
        for(var i = 1; i < labelAmount; i++) {
            AddEntity(new Line(new Vector2(CheckArrayTags(entities,"circle")[i - 1].position.x,CheckArrayTags(entities,"circle")[i - 1].position.y),new Vector2(CheckArrayTags(entities,"circle")[i].position.x,CheckArrayTags(entities,"circle")[i].position.y),graphLineColorInput.value,5,"graphLines"));
        }
    }

    console.log(closestCompositeNum / lineAmount * (lineAmount - 1))
    var whereToPutLines = 6;
    if(lineAmount == 7) {
        whereToPutLines = 14;
    }
    else if(lineAmount == 8) {
        whereToPutLines = 14;
    }
    else if(lineAmount == 9) {
        whereToPutLines = 26
    }
    console.log(whereToPutLines)

    for(var i = 1; i <= lineAmount + 1; i++) {
        AddEntity(new Text(closestCompositeNum / lineAmount * (i - 1),"16px","black","arial","center",new Vector2(30, (context.canvas.height - 47 + (lineAmount - whereToPutLines)) - 300 / lineAmount * i),"graphNumberText"))
        AddEntity(new Line(new Vector2(70,(context.canvas.height - 50 + (lineAmount - whereToPutLines)) - 300 / lineAmount * i),new Vector2(context.canvas.width,(context.canvas.height - 50 + (lineAmount - whereToPutLines)) - 300 / lineAmount * i),"black",0.5,"graphNumberLines"))
    }
}

function loop(timestamp) {
    var progress = timestamp - lastRender;

    GameUpdate(progress);
    GameRender();

    lastRender = timestamp;
    window.requestAnimationFrame(loop);
}
var lastRender = 0;
window.requestAnimationFrame(loop);

function DownloadGraph() {
    var image = canvas.toDataURL();  
   
    var tmpLink = document.createElement('a');  
    tmpLink.download = document.getElementById("graphTitleInput").value + ' graph.png';
    tmpLink.href = image;  
  
    document.body.appendChild(tmpLink);  
    tmpLink.click();  
    document.body.removeChild(tmpLink);  
}