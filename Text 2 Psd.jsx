var originalUnit = preferences.rulerUnits;
preferences.rulerUnits = Units.PIXELS;
var originalTypeUnit = preferences.typeUnits;
preferences.typeUnits = TypeUnits.POINTS;

var myLineArray = new Array();
var myTextFile = File.openDialog("Textfile to Open...");
var isopen_r = myTextFile.open("r");


while(!myTextFile.eof)
{
   myLineArray.push(myTextFile.readln());
}

myTextFile.close();


var emptrow = new Array();
var i=0;

for(var lineIndex=0;lineIndex < myLineArray.length;lineIndex++)
{
    if(myLineArray[lineIndex] == "")
	{
	emptrow[i] = lineIndex;
	i++;
		}
}
emptrow[i] = myLineArray.length;
    


var docRef = app.activeDocument;
var fontName =  "MicrosoftYaHei";

var width = docRef.width;
var height = docRef.height;

var n=0;
var row = 0;
for(n = 0;n < i;n++)
{
   row = emptrow[n+1] - emptrow[n]-1;
   
   var artLayerRef = docRef.artLayers.add();
   artLayerRef.kind = LayerKind.TEXT;
   var textItemRef = artLayerRef.textItem;   
   textItemRef.font = fontName;
   textItemRef.size = 18;
   textItemRef.justification = Justification.CENTER;
   textItemRef.position = Array(width*0.2+n*(width/(i+1)),height*0.1+n*(height/(i+1)));
   
   switch(row)
{
case 0:
    break;
  
case 1:
  textItemRef.contents = myLineArray[emptrow[n]+1];
  break;
  
case 2:
  textItemRef.contents = myLineArray[emptrow[n]+1]+'\r'+myLineArray[emptrow[n]+2];
  break;
  
case 3:
  textItemRef.contents = myLineArray[emptrow[n]+1]+'\r'+myLineArray[emptrow[n]+2]+'\r'+myLineArray[emptrow[n]+3];
  break;
  
case 4:
  textItemRef.contents = myLineArray[emptrow[n]+1]+'\r'+myLineArray[emptrow[n]+2]+'\r'+myLineArray[emptrow[n]+3]+'\r'+myLineArray[emptrow[n]+4];
  break;
  
case 5:
  textItemRef.contents = myLineArray[emptrow[n]+1]+'\r'+myLineArray[emptrow[n]+2]+'\r'+myLineArray[emptrow[n]+3]+'\r'+myLineArray[emptrow[n]+4]+'\r'+myLineArray[emptrow[n]+5];
  break;
  
case 6:
  textItemRef.contents = myLineArray[emptrow[n]+1]+'\r'+myLineArray[emptrow[n]+2]+'\r'+myLineArray[emptrow[n]+3]+'\r'+myLineArray[emptrow[n]+4]+'\r'+myLineArray[emptrow[n]+5]+'\r'+myLineArray[emptrow[n]+6];
  break;
  
case 7:
  textItemRef.contents = myLineArray[emptrow[n]+1]+'\r'+myLineArray[emptrow[n]+2]+'\r'+myLineArray[emptrow[n]+3]+'\r'+myLineArray[emptrow[n]+4]+'\r'+myLineArray[emptrow[n]+5]+'\r'+myLineArray[emptrow[n]+6]+'\r'+myLineArray[emptrow[n]+7];
  break;
  
default:
;

}
   
}

myLineArray=null;
i=null;
n=null;
row=null;
emptrow=null;
docRef = null;
textColor = null;
newTextLayer = null;