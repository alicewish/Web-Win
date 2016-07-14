//read in preferences from CSS export options
var UnitPref = app.preferences.getIntegerPreference("plugin/CSSExportPreference/CSSExtract/CSSExport/ExportUnit");
var exportFill = app.preferences.getBooleanPreference("plugin/CSSExportPreference/CSSExtract/CSSExport/ExportFill");
var exportStroke = app.preferences.getBooleanPreference("plugin/CSSExportPreference/CSSExtract/CSSExport/ExportStroke");
var exportOpacity = app.preferences.getBooleanPreference("plugin/CSSExportPreference/CSSExtract/CSSExport/ExportOpacity");
var exportPosition = app.preferences.getBooleanPreference("plugin/CSSExportPreference/CSSExtract/CSSExport/ExportPosition");
var exportDimension = app.preferences.getBooleanPreference("plugin/CSSExportPreference/CSSExtract/CSSExport/ExportDimension");
var exportUnnamed = app.preferences.getBooleanPreference("plugin/CSSExportPreference/CSSExtract/CSSExport/ExportUnnamedObjPref");
var exportVendorPref = app.preferences.getBooleanPreference("plugin/CSSExportPreference/CSSExtract/CSSExport/VendorPref");

var isWebKit,isFirefox,isIExplorer,isOpera;

if( exportVendorPref )
{
var isWebKit = app.preferences.getBooleanPreference("plugin/CSSExportPreference/CSSExtract/CSSExport/Webkit");
var isFirefox = app.preferences.getBooleanPreference("plugin/CSSExportPreference/CSSExtract/CSSExport/FireFox");
var isIExplorer = app.preferences.getBooleanPreference("plugin/CSSExportPreference/CSSExtract/CSSExport/IExplorer");
var isOpera = app.preferences.getBooleanPreference("plugin/CSSExportPreference/CSSExtract/CSSExport/Opera");
}
else
{
   isWebKit = isFirefox = isIExplorer = isOpera = false;
}


//CSS tags all defined in one place
var backgroundStr = "background : ";
var borderStyleStr = "border-style : ";
var borderColorStr = "border-color : ";
var borderWidthStr = "border-width : ";
var borderRadiusStr = "border-radius : ";
var backgroundImageStr = "background-image : ";
var backgroundRepeatStr = "background-repeat : ";
var opacityStr = "opacity : ";
var opacityForIEStr = "opacity";
var positionStr = "position : ";
var leftStr = "left : ";
var topStr = "top : ";
var widthStr = "width : ";
var heightStr = "height : ";
var boxShadowStr = "box-shadow : ";
var fontFamilyStr = "font-family : ";
var fontWeightStr = "font-weight : ";
var fontStyleStr = "font-style : ";
var fontSizeStr = "font-size : "; 
var lineHeightStr = "line-height : ";
var letterSpacingStr = "letter-spacing : ";
var fontVariantStr = "font-variant : ";
var textTransformStr = "text-transform : ";
var verticalAlignStr = "vertical-align : ";
var textColorStr = "color : ";
var textOutlineStr = "text-outline : ";
var textDecorationStr = "text-decoration : ";
var textShadowStr = "text-shadow : ";

var startColorStr = "startColorstr";
var endColorStr = "endColorstr";
var gradientStyleStr = "Stlye";
var noRepeatStr = "no-repeat";
var absoluteStr = "absolute ";
var alphaStr = "alpha";
var boldStr = "bold";
var italicStr = "italic";
var lineThroughStr = "line-through";
var underlineStr = "underline";
var newLineStr = "\r\n\t";
var newLineNoTabStr = "\r\n";
var rgbaStr = "rgba";
var coloStopStr = "color-stop";

//vendor prefixes
var filterStr = "filter: ";
var msFilterStr = "-ms-filter: ";
var mozLinearGradientStr = "-moz-linear-gradient";
var webkitLinearGradientStr = "-webkit-linear-gradient";
var webkitGradientStr = "-webkit-gradient";
var operaLinearGradientStr = "-o-linear-gradient";
var msLinearGradientStr = "-ms-linear-gradient";
var linearGradientStr = "linear-gradient";
var mozRadialGradientStr = "-moz-radial-gradient";
var webkitRadialGradientStr = "-webkit-radial-gradient";
var operaRadialGradientStr = "-o-radial-gradient";
var msRadialGradientStr = "-ms-radial-gradient";
var mozBorderRadiusStr = "-moz-border-radius : ";
var webkitBorderRadiusStr = "-webkit-border-radius : ";
var radialGradientStr = "radial-gradient";

var msAlphaStr = "progid:DXImageTransform.Microsoft.Alpha";
var msGradientStr = "progid:DXImageTransform.Microsoft.gradient";
var msDropShadowStr = "progid:DXImageTransform.Microsoft.dropshadow";
var msOffXStr = "OffX=";
var msOffYStr = "OffY=";
var msColorStr = "Color=";

//charset
var charsetStr = "@charset \"utf-8\"\;";

//global var
var num = 0;
var unitConversionFactor = 12;

//vendor prefix
var mozPrefixStr = isFirefox;
var webkitPrefixStr = isWebKit;
var operaPrefixStr = isOpera;
var msPrefixStr = isIExplorer;

var htmlElements = ["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","command","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","map","mark","menu","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","param","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strong","style","sub","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","title","tr","track","u","ul","var","video","wbr"];

var mode = app.preferences.getIntegerPreference("plugin/CSSExportPreference/CSSExtract/CSSExport/ExportMode");
if (mode == 1)
        exportMode = "Export All Objects";
else if (mode == 2)
        exportMode = "Export Selected Objects";
else
        exportMode = "Generate CSS for Panel";

var JSONString = app.sendScriptMessage("CSSExtract", exportMode, "test");

parseJSON(JSONString);

function parseJSON(str)
{
    //alert(str);
    try
    {
        myParentObj = eval(str);
        if(myParentObj != undefined)
        {
            var cssString = "";
                
            for ( var i in myParentObj)
            {
                currentObj = myParentObj[i];
                for (var j in currentObj)
                {
                    var unitString = GetUnitString();
                    if( currentObj[j].Name != undefined)
                    {
                         if ( exportUnnamed==true && currentObj[j].Name == "")
                         {
                            currentObj[j].Name += "st" + num;
                            num++;
                            }
                         if(currentObj[j].Name != "")
                         { 
                             if(!checkIfNameIsAnHTMLElement(currentObj[j].Name))
                                cssString += ".";
                            cssString += currentObj[j].Name;
                            cssString += newLineNoTabStr +"{";
                            if(exportFill == true && currentObj[j].Fill != undefined)
                            {
                                currentFill = currentObj[j].Fill;
                                if(currentFill.FillType == "solid" && currentFill.Color != undefined)
                                {
                                        cssString += newLineStr + backgroundStr + "#" + rgbToHex(currentFill.Color.Red,currentFill.Color.Green,currentFill.Color.Blue) +";";
                                        cssString += newLineStr + backgroundStr + rgbaStr +"(" + roundNumber(currentFill.Color.Red,2) + ", "  + roundNumber(currentFill.Color.Green, 2) + ", " + roundNumber(currentFill.Color.Blue, 2) + ", " + roundNumber(currentFill.Color.FillOpacity,2) + ");";
                                } 
                            
                                else if(currentFill.FillType == "gradient")
                                {
                                    currentGradient = currentObj[j].Fill.Gradient;
                                    cssString += writeGradient(currentGradient);
                                }
                                
                                else if(currentFill.FillType == "pattern" && currentFill.Pattern != undefined)
                                {
                                    currentPattern = currentObj[j].Fill.Pattern;
                                    cssString += newLineStr + backgroundStr + "url(" + currentPattern.url + ");";
                                    if(exportMode == "Generate CSS for Panel")
                                        cssString += imageCommentString ();
                                 }
                            }
                           
                            if(exportStroke == true && currentObj[j].Stroke != undefined)
                            {
                                currentStroke = currentObj[j].Stroke;
                                if(currentStroke.Type != undefined)
                                    cssString += newLineStr + borderStyleStr + currentStroke.Type + ";";
                                    
                                if (currentStroke.Color != undefined)
                                {
                                    cssString += newLineStr + borderColorStr +"#" + rgbToHex(currentStroke.Color.Red,currentStroke.Color.Green,currentStroke.Color.Blue) + ";";
                                    cssString += newLineStr + borderColorStr + rgbaStr + "(" + roundNumber(currentStroke.Color.Red,2) + ", "  + roundNumber(currentStroke.Color.Green,2) + ", " + roundNumber(currentStroke.Color.Blue, 2) + ", " + roundNumber(currentStroke.Color.StrokeOpacity, 2) + ");";
                                    }
                            
                                if (currentStroke.Width != undefined)
                                        cssString += newLineStr + borderWidthStr + roundNumber(currentStroke.Width, 2) + unitString + ";";
                             }
                         
                            if(currentObj[j].ObjectType != undefined && currentObj[j].ObjectType == "raster")
                            {
                                cssString += newLineStr + backgroundImageStr +"url(" + currentObj[j].url + ");";
                                if(exportMode == "Generate CSS for Panel")
                                        cssString += imageCommentString ();
                                cssString += newLineStr + backgroundRepeatStr + noRepeatStr + ";";
                             }
                         
                            if(exportOpacity == true && currentObj[j].Opacity != undefined)
                                cssString += newLineStr+ opacityStr +  roundNumber(currentObj[j].Opacity, 2)+ ";";
                         
                            if (currentObj[j].Shape != undefined)
                            {
                                currentObjShape = currentObj[j].Shape;
                                if(exportPosition == true)
                                {
                                     cssString += newLineStr + positionStr + absoluteStr + ";";
                                     cssString += newLineStr + leftStr  + currentObjShape.x + unitString +";";
                                     cssString += newLineStr + topStr  + currentObjShape.y + unitString +";";
                                 }
                                 if(exportDimension == true)
                                 {
                                     cssString += newLineStr + widthStr + currentObjShape.w + unitString +";";
                                     cssString += newLineStr + heightStr + currentObjShape.h + unitString +";";
                                  }
                              }
							
                            if (currentObj[j].RoundedCorner != undefined)
								cssString += GetRoundedCorners (currentObj[j].RoundedCorner);                                     
                               
                            if(currentObj[j].boxShadow != undefined)
                            {
                                currObjBoxShadow = currentObj[j].boxShadow;
                                cssString += newLineStr + boxShadowStr+ roundNumber(currObjBoxShadow.HOffset, 2)  + unitString +" " + roundNumber(currObjBoxShadow.VOffset, 2) + unitString +  " " +roundNumber(currObjBoxShadow.Blur, 2) + unitString + " ";
                                cssString += rgbaStr + "(" + roundNumber(currObjBoxShadow.BoxColor.Red, 2) + ", "  + roundNumber(currObjBoxShadow.BoxColor.Green, 2) + ", " + roundNumber(currObjBoxShadow.BoxColor.Blue, 2) + ", " + roundNumber(currObjBoxShadow.BoxColor.Opacity, 2) + ");";
                            }
                        
                            if((exportVendorPref == true) && msPrefixStr)
                            {
                                    cssString += msFilterString(currentObj[j]);
                            }
                        
                            cssString += newLineNoTabStr +"}" + newLineNoTabStr;
                        }
                    }
                        else if(currentObj[j].CharStlyeName!= undefined)
                                cssString += writeCharStyle(currentObj[j]);
                } 
            
            if (((exportMode == "Export Selected Objects") || (exportMode == "Export All Objects")) && cssString.length != 0)
                var cssStringExport = charsetStr + newLineStr;
            else
                var cssStringExport = "";
            
            return cssStringExport += cssString;
            }
        }
    }
	catch(e) {
            return "undefined"
        }
}

function writeGradient(currGradient)
{	
	var cssString = "";
    var currGradientStopArray = currGradient.GradientStopArray;
	if(currGradient.GradientType != undefined)
    {
        if(currGradient.GradientType == "linear")
        {
            if(exportVendorPref == true)
            {
                var n = currGradientStopArray.length;
                
                if(mozPrefixStr)
                {
                    cssString = newLineStr + backgroundStr + mozLinearGradientStr + "(" + roundNumber(currGradient.StartXPos, 2) + "% " + roundNumber(currGradient.StartYPos, 2) + "% " + roundNumber(currGradient.GradientAngle,2) + "deg" ;
                    for ( var k in currGradientStopArray) 
                    {
                        if(currGradientStopArray[k].ColorStop != undefined && currGradientStopArray[k].StopPosition != undefined)
                            cssString += "," + rgbaStr + "(" + roundNumber(currGradientStopArray[k].ColorStop .Red,2) + ", "  + roundNumber(currGradientStopArray[k].ColorStop .Green, 2) + ", " + roundNumber(currGradientStopArray[k].ColorStop .Blue,2) + ", " + roundNumber(currGradientStopArray[k].ColorStop .Opacity,2) + ") " + roundNumber(currGradientStopArray[k].StopPosition, 2) + "%";
                         }
                    cssString += ");"; 
                }
                
                if(webkitPrefixStr)
                {
                    cssString += newLineStr + backgroundStr + webkitLinearGradientStr + "(" + roundNumber(currGradient.GradientAngle, 2) + "deg";
                    for ( var k in currGradientStopArray) 
                    {
                         if(currGradientStopArray[k].ColorStop != undefined && currGradientStopArray[k].StopPosition != undefined)
                         cssString += ", " + rgbaStr + "(" + roundNumber(currGradientStopArray[k].ColorStop .Red,2) + ", "  + roundNumber(currGradientStopArray[k].ColorStop .Green, 2) + ", " + roundNumber(currGradientStopArray[k].ColorStop .Blue,2) + ", " + roundNumber(currGradientStopArray[k].ColorStop .Opacity,2) + ") " + roundNumber(currGradientStopArray[k].StopPosition, 2) + "%";
                         }
                    cssString += ");";
                
                    cssString += newLineStr + backgroundStr + webkitGradientStr + "(" + currGradient.GradientType + "," + roundNumber(currGradient.StartXPos, 2) + "% " + roundNumber(currGradient.StartYPos, 2) + "% ," + roundNumber(currGradient.EndXPos, 2) + "% " + roundNumber(currGradient.EndYPos, 2) + "% ";
                    for ( var k in currGradientStopArray) 
                    {
                        if(currGradientStopArray[k].ColorStop != undefined && currGradientStopArray[k].StopPosition != undefined)
                        cssString += ",color-stop(" + roundNumber(currGradientStopArray[k].StopPosition, 2)/100 + "," + rgbaStr + "(" + roundNumber(currGradientStopArray[k].ColorStop .Red,2) + ", "  + roundNumber(currGradientStopArray[k].ColorStop .Green, 2) + ", " + roundNumber(currGradientStopArray[k].ColorStop .Blue,2) + ", " + roundNumber(currGradientStopArray[k].ColorStop .Opacity,2) + ") )" ;
                         }
                    cssString += ");";
                }
                
                if(operaPrefixStr)
                {
                    cssString += newLineStr + backgroundStr + operaLinearGradientStr + "(" + roundNumber(currGradient.GradientAngle, 2) + "deg";
                    for ( var k in currGradientStopArray) 
                    {
                        if(currGradientStopArray[k].ColorStop != undefined && currGradientStopArray[k].StopPosition != undefined)
                            cssString += ", " + rgbaStr + "(" + roundNumber(currGradientStopArray[k].ColorStop .Red,2) + ", "  + roundNumber(currGradientStopArray[k].ColorStop .Green, 2) + ", " + roundNumber(currGradientStopArray[k].ColorStop .Blue,2) + ", " + roundNumber(currGradientStopArray[k].ColorStop .Opacity,2) + ") " + roundNumber(currGradientStopArray[k].StopPosition, 2) + "%";
                         }
                    cssString += ");";
                }
                
                if(msPrefixStr)
                {
                    cssString += newLineStr + backgroundStr + msLinearGradientStr + "(" + roundNumber(currGradient.GradientAngle, 2) + "deg";
                    for ( var k in currGradientStopArray) 
                    {
                        if(currGradientStopArray[k].ColorStop != undefined && currGradientStopArray[k].StopPosition != undefined)
                        cssString += ", " + rgbaStr + "(" + roundNumber(currGradientStopArray[k].ColorStop .Red,2) + ", "  + roundNumber(currGradientStopArray[k].ColorStop .Green, 2) + ", " + roundNumber(currGradientStopArray[k].ColorStop .Blue,2) + ", " + roundNumber(currGradientStopArray[k].ColorStop .Opacity,2) + ") " + roundNumber(currGradientStopArray[k].StopPosition, 2) + "%";
                    }
                    cssString += ");";
                    
                    if(currGradientStopArray[0].ColorStop != undefined && currGradientStopArray[0].StopPosition != undefined && currGradientStopArray[n-1].ColorStop != undefined && currGradientStopArray[n-1].StopPosition != undefined)
                    {
                       cssString += newLineStr + msFilterStr + "\"" + msGradientStr + "(" + startColorStr + "=\'#" + rgbToHex(currGradientStopArray[0].ColorStop.Red,currGradientStopArray[0].ColorStop.Green,currGradientStopArray[0].ColorStop.Blue) + "\'"; 
                       cssString += ", " + endColorStr + "=\'#" + rgbToHex(currGradientStopArray[n-1].ColorStop.Red,currGradientStopArray[n-1].ColorStop.Green,currGradientStopArray[n-1].ColorStop.Blue) + "\' ,GradientType=0)\";";
                    }
                 }
            }
            currGradientStopArray = currGradient.GradientStopArray;
            cssString += newLineStr + backgroundStr + linearGradientStr + "(" + (90 - roundNumber(currGradient.GradientAngle, 2) )+ "deg";
            for ( var k in currGradientStopArray) 
            {
                if(currGradientStopArray[k].ColorStop != undefined && currGradientStopArray[k].StopPosition != undefined)
                    cssString += ", " + rgbaStr + "(" + roundNumber(currGradientStopArray[k].ColorStop .Red,2) + ", "  + roundNumber(currGradientStopArray[k].ColorStop .Green, 2) + ", " + roundNumber(currGradientStopArray[k].ColorStop .Blue,2) + ", " + roundNumber(currGradientStopArray[k].ColorStop .Opacity,2) + ") " + roundNumber(currGradientStopArray[k].StopPosition, 2) + "%";
                 }
            cssString += ");";   
        }
        else
        {
            if(exportVendorPref == true)
            {
                if(mozPrefixStr)
                {
                    cssString = newLineStr + backgroundStr + mozRadialGradientStr + "(" + roundNumber(currGradient.StartXPos, 2) + "% " + roundNumber(currGradient.StartYPos, 2) + "%, " + currGradient.RadialGradientType + " " +  currGradient.sizeconst  ;
                    for (var k in currGradientStopArray) 
                    {
                        if(currGradientStopArray[k].ColorStop != undefined && currGradientStopArray[k].StopPosition != undefined)
                        cssString += ", " + rgbaStr + "(" + roundNumber(currGradientStopArray[k].ColorStop .Red,2) + ", "  + roundNumber(currGradientStopArray[k].ColorStop .Green, 2) + ", " + roundNumber(currGradientStopArray[k].ColorStop .Blue,2) + ", " + roundNumber(currGradientStopArray[k].ColorStop .Opacity,2) + ") " + roundNumber(currGradientStopArray[k].StopPosition, 2) + "%";
                         }
                    cssString += ");";
                 }
                
                if(webkitPrefixStr)
                {
                    cssString += newLineStr + backgroundStr + webkitRadialGradientStr + "(" + roundNumber(currGradient.StartXPos, 2) + "% " + roundNumber(currGradient.StartYPos, 2) + "%, " + currGradient.RadialGradientType + " " +  currGradient.sizeconst;
                    for ( var k in currGradientStopArray) 
                    {
                        if(currGradientStopArray[k].ColorStop != undefined && currGradientStopArray[k].StopPosition != undefined)
                        cssString += ", " + rgbaStr + "(" + roundNumber(currGradientStopArray[k].ColorStop .Red,2) + ", "  + roundNumber(currGradientStopArray[k].ColorStop .Green, 2) + ", " + roundNumber(currGradientStopArray[k].ColorStop .Blue,2) + ", " + roundNumber(currGradientStopArray[k].ColorStop .Opacity,2) + ") " + roundNumber(currGradientStopArray[k].StopPosition, 2) + "%";
                         }
                    cssString += ");";
                
                    cssString += newLineStr + backgroundStr + webkitGradientStr + "(" + currGradient.GradientType + "," + roundNumber(currGradient.StartXPos, 2) + "% " + roundNumber(currGradient.StartYPos, 2) + "% ,"  + roundNumber(currGradient.InnerRadius, 2) + " , "+ roundNumber(currGradient.StartXPos, 2) + "% " + roundNumber(currGradient.StartYPos, 2) + "%, " + roundNumber(currGradient.OuterRadius, 2) + " ";
                    for ( var k in currGradientStopArray) 
                    {
                        if(currGradientStopArray[k].ColorStop != undefined && currGradientStopArray[k].StopPosition != undefined)
                        cssString += ",color-stop(" + roundNumber(currGradientStopArray[k].StopPosition, 2)/100 + "," + rgbaStr + "(" + roundNumber(currGradientStopArray[k].ColorStop .Red,2) + ", "  + roundNumber(currGradientStopArray[k].ColorStop .Green, 2) + ", " + roundNumber(currGradientStopArray[k].ColorStop .Blue,2) + ", " + roundNumber(currGradientStopArray[k].ColorStop .Opacity,2) + ") )" ;
                    }
                    cssString += ");";
                }
                
                if(operaPrefixStr)
                {
                    cssString += newLineStr + backgroundStr + operaRadialGradientStr +"(" + roundNumber(currGradient.StartXPos, 2) + "% " + roundNumber(currGradient.StartYPos, 2) + "%, " + currGradient.RadialGradientType + " " +  currGradient.sizeconst;
                    for ( var k in currGradientStopArray) 
                    {
                        if(currGradientStopArray[k].ColorStop != undefined && currGradientStopArray[k].StopPosition != undefined)
                        cssString += ", " + rgbaStr + "(" + roundNumber(currGradientStopArray[k].ColorStop .Red,2) + ", "  + roundNumber(currGradientStopArray[k].ColorStop .Green, 2) + ", " + roundNumber(currGradientStopArray[k].ColorStop .Blue,2) + ", " + roundNumber(currGradientStopArray[k].ColorStop .Opacity,2) + ") " + roundNumber(currGradientStopArray[k].StopPosition, 2) + "%";
                         }
                    cssString += ");";
                 }
                
                if(msPrefixStr)
                {
                    cssString += newLineStr + backgroundStr + msRadialGradientStr + "(" +roundNumber( currGradient.StartXPos, 2) + "% " + roundNumber(currGradient.StartYPos, 2) + "%, " + currGradient.RadialGradientType + " " +  currGradient.sizeconst;
                    for ( var k in currGradientStopArray) 
                    {
                        if(currGradientStopArray[k].ColorStop != undefined && currGradientStopArray[k].StopPosition != undefined)
                        cssString += ", " + rgbaStr + "(" + roundNumber(currGradientStopArray[k].ColorStop .Red,2) + ", "  + roundNumber(currGradientStopArray[k].ColorStop .Green, 2) + ", " + roundNumber(currGradientStopArray[k].ColorStop .Blue,2) + ", " + roundNumber(currGradientStopArray[k].ColorStop .Opacity,2) + ") " + roundNumber(currGradientStopArray[k].StopPosition, 2) + "%";
                         }
                    cssString += ");";
                    
                    cssString += newLineStr + msFilterStr + "\"" + msAlphaStr+ "(Stlye=2);\"";
                 }
             }
         
             currGradientStopArray = currGradient.GradientStopArray;
             cssString += newLineStr + backgroundStr + radialGradientStr + "(" +roundNumber(currGradient.StartXPos, 2) + "% " + roundNumber(currGradient.StartYPos, 2) + "%, " + currGradient.RadialGradientType + " " +  currGradient.sizeconst;
                for ( var k in currGradientStopArray) 
                {
                    if(currGradientStopArray[k].ColorStop != undefined && currGradientStopArray[k].StopPosition != undefined)
                    cssString += ", " + rgbaStr +"(" + roundNumber(currGradientStopArray[k].ColorStop .Red,2) + ", "  + roundNumber(currGradientStopArray[k].ColorStop .Green, 2) + ", " + roundNumber(currGradientStopArray[k].ColorStop .Blue,2) + ", " + roundNumber(currGradientStopArray[k].ColorStop .Opacity,2) + ") " + roundNumber(currGradientStopArray[k].StopPosition, 2) + "%";
                }
                cssString += ");";
         }
    }
    return cssString;
}
function rgbToHex(R,G,B) {return toHex(R)+toHex(G)+toHex(B)}
function toHex(N) {
 if (N==null) return "00";
 N=parseInt(N); if (N==0 || isNaN(N)) return "00";
 N=Math.max(0,N); N=Math.min(N,255); N=Math.round(N);
 return "0123456789ABCDEF".charAt((N-N%16)/16)
      + "0123456789ABCDEF".charAt(N%16);
}

function roundNumber(num, dec) 
{
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
}

function GetUnitString()
{
    var UnitStr;
    if(UnitPref ==true)
        unitStr = "pt";
    else
        unitStr = "px";
    return unitStr;
 }

function msFilterString(currObject)
{  
        var cssString = "";
        if((exportOpacity == true && currObject.Opacity != undefined) || (currObject.boxShadow != undefined) ||(exportFill == true && currObject.Fill != undefined && currObject.Fill.FillType == "gradient") || (currObject.textOpacity != undefined))
        {
             cssString += newLineStr + filterStr;
             
             if(exportOpacity == true && currObject.Opacity != undefined)
             cssString += alphaStr + "(" + opacityForIEStr + "=" + roundNumber(currObject.Opacity, 2)*100+ ") " +msAlphaStr + "(" + opacityForIEStr + "=" + roundNumber(currObject.Opacity, 2)*100+ ") ";
             
             if(exportOpacity == true && currObject.textOpacity != undefined)
             cssString += alphaStr + "(" + opacityForIEStr + "=" + roundNumber(currObject.textOpacity, 2)*100+ ") " + msAlphaStr + "(" + opacityForIEStr + "=" + roundNumber(currObject.textOpacity, 2)*100+ ") ";
            
             if(currObject.boxShadow != undefined)
             {
                    currObjBoxShadow = currObject.boxShadow;
                    cssString += msDropShadowStr+"("+ msOffXStr + roundNumber(currObjBoxShadow.HOffset, 2) +", " + msOffYStr + roundNumber(currObjBoxShadow.VOffset, 2) +  ", " + msColorStr + "\'#"+rgbToHex(currObjBoxShadow.BoxColor.Red,currObjBoxShadow.BoxColor.Green,currObjBoxShadow.BoxColor.Blue)  + "\') ";                                     
              }
          
            if(exportFill == true && currObject.Fill != undefined && currObject.Fill.FillType == "gradient")
            {
                currentGradient = currObject.Fill.Gradient;
                currGradientStopArray = currentGradient.GradientStopArray;
                var n = currGradientStopArray.length;
                if(currentGradient.GradientType != undefined && currentGradient.GradientType == "linear")
                {
                    if(currGradientStopArray[0].ColorStop != undefined && currGradientStopArray[0].StopPosition != undefined && currGradientStopArray[n-1].ColorStop != undefined && currGradientStopArray[n-1].StopPosition != undefined)
                        {
                            if(currentGradient.GradientAngle == -90)
                            {
                            cssString += msGradientStr + "(" + startColorStr + "=\'#" + rgbToHex(currGradientStopArray[0].ColorStop.Red,currGradientStopArray[0].ColorStop.Green,currGradientStopArray[0].ColorStop.Blue) + "\'";
                            cssString += "," + endColorStr + "=\'#" + rgbToHex(currGradientStopArray[n-1].ColorStop.Red,currGradientStopArray[n-1].ColorStop.Green,currGradientStopArray[n-1].ColorStop.Blue) + "\' , GradientType=0)";
                            }
                            else if(currentGradient.GradientAngle == 90)
                            {
                            cssString += msGradientStr + "(" + startColorStr + "=\'#" + rgbToHex(currGradientStopArray[n-1].ColorStop.Red,currGradientStopArray[n-1].ColorStop.Green,currGradientStopArray[n-1].ColorStop.Blue) + "\'";
                            cssString += "," + endColorStr + "=\'#" + rgbToHex(currGradientStopArray[0].ColorStop.Red,currGradientStopArray[0].ColorStop.Green,currGradientStopArray[0].ColorStop.Blue) + "\' , GradientType=0)";
                            }
                            else if(currentGradient.GradientAngle == 180)
                            {
                            cssString += msGradientStr + "(" + startColorStr + "=\'#" + rgbToHex(currGradientStopArray[n-1].ColorStop.Red,currGradientStopArray[n-1].ColorStop.Green,currGradientStopArray[n-1].ColorStop.Blue) + "\'";
                            cssString += "," + endColorStr + "=\'#" + rgbToHex(currGradientStopArray[0].ColorStop.Red,currGradientStopArray[0].ColorStop.Green,currGradientStopArray[0].ColorStop.Blue) + "\' , GradientType=1)";
                            }
                            else
                            {
                            cssString += msGradientStr + "(" + startColorStr + "=\'#" + rgbToHex(currGradientStopArray[0].ColorStop.Red,currGradientStopArray[0].ColorStop.Green,currGradientStopArray[0].ColorStop.Blue) + "\'";
                            cssString += "," + endColorStr + "=\'#" + rgbToHex(currGradientStopArray[n-1].ColorStop.Red,currGradientStopArray[n-1].ColorStop.Green,currGradientStopArray[n-1].ColorStop.Blue) + "\' , GradientType=1)";
                            }
                         }
                     }
                else if(currentGradient.GradientType != undefined && currentGradient.GradientType == "radial")
                    cssString += msAlphaStr +"(Stlye=2)";                                            
             }
            cssString += ";";
        }
    return cssString;
    }

function GetRoundedCorners(currentObjRoundedCorner)
{
    var cssString = "";
     
    if(currentObjRoundedCorner.TopLeft != undefined)
    {
		var radiusString = "";
	    var unitString = GetUnitString();

		if((currentObjRoundedCorner.TopLeft.radius1 == currentObjRoundedCorner.TopRight.radius1) && 
        (currentObjRoundedCorner.BottomRight.radius1 == currentObjRoundedCorner.BottomLeft.radius1) && 
        (currentObjRoundedCorner.TopLeft.radius1 == currentObjRoundedCorner.BottomLeft.radius1) && 
        (currentObjRoundedCorner.TopRight.radius1 == currentObjRoundedCorner.BottomRight.radius1))
        {
			radiusString += currentObjRoundedCorner.TopLeft.radius1 + unitString;
        }
        else if ((currentObjRoundedCorner.TopLeft.radius1 == currentObjRoundedCorner.BottomRight.radius1) && 
        (currentObjRoundedCorner.TopRight.radius1 == currentObjRoundedCorner.BottomLeft.radius1) && 
        (currentObjRoundedCorner.TopLeft.radius1 != currentObjRoundedCorner.TopRight.radius1) && 
        (currentObjRoundedCorner.BottomRight.radius1 != currentObjRoundedCorner.BottomLeft.radius1))
        {
			radiusString += currentObjRoundedCorner.TopLeft.radius1 + unitString + " " + currentObjRoundedCorner.TopRight.radius1 + unitString;
        }
        else
        {
			radiusString += currentObjRoundedCorner.TopLeft.radius1 + unitString + " " + currentObjRoundedCorner.TopRight.radius1 + unitString + " " + currentObjRoundedCorner.BottomRight.radius1 + unitString + " " + currentObjRoundedCorner.BottomLeft.radius1 + unitString;
        }

		if((currentObjRoundedCorner.TopLeft.radius1 != currentObjRoundedCorner.TopLeft.radius2) ||
        (currentObjRoundedCorner.TopRight.radius1 != currentObjRoundedCorner.TopRight.radius2) ||
        (currentObjRoundedCorner.BottomRight.radius1 != currentObjRoundedCorner.BottomRight.radius2) ||
        (currentObjRoundedCorner.BottomLeft.radius1 != currentObjRoundedCorner.BottomLeft.radius2))
        {
			if((currentObjRoundedCorner.TopLeft.radius2 == currentObjRoundedCorner.TopRight.radius2) && 
			(currentObjRoundedCorner.BottomRight.radius2 == currentObjRoundedCorner.BottomLeft.radius2) && 
			(currentObjRoundedCorner.TopLeft.radius2 == currentObjRoundedCorner.BottomLeft.radius2) && 
			(currentObjRoundedCorner.TopRight.radius2 == currentObjRoundedCorner.BottomRight.radius2))
			{
				radiusString += "  / " + currentObjRoundedCorner.TopLeft.radius2 + unitString;
			}
			else if ((currentObjRoundedCorner.TopLeft.radius2 == currentObjRoundedCorner.BottomRight.radius2) && 
			(currentObjRoundedCorner.TopRight.radius2 == currentObjRoundedCorner.BottomLeft.radius2) && 
			(currentObjRoundedCorner.TopLeft.radius2 != currentObjRoundedCorner.TopRight.radius2) && 
			(currentObjRoundedCorner.BottomRight.radius2 != currentObjRoundedCorner.BottomLeft.radius2))
			{
				radiusString += "  / " + currentObjRoundedCorner.TopLeft.radius2 + unitString + " " + currentObjRoundedCorner.TopRight.radius2 + unitString;
			}
			else
			{
				radiusString += "  / " + currentObjRoundedCorner.TopLeft.radius2 + unitString + " " + currentObjRoundedCorner.TopRight.radius2 + unitString + " " + currentObjRoundedCorner.BottomRight.radius2 + unitString + " " + currentObjRoundedCorner.BottomLeft.radius2 + unitString;
			}
		}

		radiusString += ";";

		cssString += newLineStr + borderRadiusStr + radiusString;
     
        if(exportVendorPref)
		{
            if(mozPrefixStr)
                cssString += newLineStr + mozBorderRadiusStr + radiusString;
                
            if(webkitPrefixStr)
                cssString += newLineStr + webkitBorderRadiusStr + radiusString;
		}
	}

	return cssString;                            
}

function writeCharStyle(currentObj)
{
        var cssString ="";
        var unitString = GetUnitString();
    
     if(!checkIfNameIsAnHTMLElement(currentObj.CharStlyeName))
        cssString += ".";
    cssString += currentObj.CharStlyeName;
    cssString += newLineNoTabStr +"{";
    
    if(currentObj.FontFamily != undefined && currentObj.FontFamily !="")
        cssString += newLineStr + fontFamilyStr + currentObj.FontFamily +";";
    
    if(currentObj.FontWeight != undefined && currentObj.FontWeight !="" )
    {
        var n=currentObj.FontWeight.indexOf("Bold");
        if(n != -1)
            cssString += newLineStr + fontWeightStr + boldStr +";";
        
        var k=currentObj.FontWeight.indexOf("Italic");
        if(k != -1)
            cssString += newLineStr + fontStyleStr + italicStr +";";
    }

    if(currentObj.FontSize != undefined && currentObj.FontSize !=0)
        cssString += newLineStr + fontSizeStr + currentObj.FontSize + unitString + ";";

    if(currentObj.Leading != undefined && currentObj.Leading !=0)
        cssString += newLineStr + lineHeightStr + roundNumber(currentObj.Leading,2) + unitString + ";";
        
    if(currentObj.Tracking != undefined && currentObj.Tracking !=0)
    {
        if(currentObj.FontSize!=undefined && currentObj.FontSize !=0)    
            unitConversionFactor = currentObj.FontSize;
        cssString += newLineStr + letterSpacingStr + roundNumber(currentObj.Tracking*unitConversionFactor, 2) + unitString +";";
        }

    
     if(currentObj.CapSetting != undefined && currentObj.CapSetting !="")
	{
								if( currentObj.CapSetting =="small-caps")
        cssString += newLineStr + fontVariantStr + currentObj.CapSetting +";";
        if( currentObj.CapSetting =="uppercase")
        cssString += newLineStr + textTransformStr + currentObj.CapSetting +";";
	}
            
    if(currentObj.VerticalAlign != undefined && currentObj.VerticalAlign !="")
    cssString += newLineStr + verticalAlignStr + currentObj.VerticalAlign +";";
    
     if(currentObj.BaseLineShiftPosition != undefined &&(currentObj.BaseLineShiftTop !=0) ||(currentObj.BaseLineShiftTop !=-0))
    cssString += newLineStr + positionStr + currentObj.BaseLineShiftPosition +";";

     if(currentObj.BaseLineShiftTop != undefined && (currentObj.BaseLineShiftTop !=0) ||(currentObj.BaseLineShiftTop !=-0))
    cssString += newLineStr + topStr + roundNumber(currentObj.BaseLineShiftTop, 2) +unitString +";";
    
     if(currentObj.FillColor != undefined && currentObj.FillColor.Red !=undefined)
     {
         cssString += newLineStr + textColorStr +"#" + rgbToHex(currentObj.FillColor.Red,currentObj.FillColor.Green,currentObj.FillColor.Blue) +";";
         cssString += newLineStr + textColorStr +"rgb(" + roundNumber(currentObj.FillColor.Red, 2) + ", "  + roundNumber(currentObj.FillColor.Green, 2) + ", " + roundNumber(currentObj.FillColor.Blue, 2)+ ");" ; 
     }
                         
     if(currentObj.StrokeColor != undefined && currentObj.StrokeColor.Red !=undefined)
     {
         cssString += newLineStr + textOutlineStr + "#" + rgbToHex(currentObj.StrokeColor.Red,currentObj.StrokeColor.Green,currentObj.StrokeColor.Blue) + ";";
         cssString += newLineStr + textOutlineStr +"rgb(" + roundNumber(currentObj.StrokeColor.Red, 2) + ", "  + roundNumber(currentObj.StrokeColor.Green, 2) + ", " + roundNumber(currentObj.StrokeColor.Blue, 2)+ ");" ;
     }
    
     if(currentObj.Underline != undefined && currentObj.Underline !="" && currentObj.Strike != undefined && currentObj.Strike !="")
     {
        if(currentObj.Underline =="1" && currentObj.Strike =="1")
            cssString += newLineStr + textDecorationStr + lineThroughStr + " " + underlineStr +";" ;
        else if (currentObj.Underline =="0" && currentObj.Strike =="1")
            cssString += newLineStr + textDecorationStr + lineThroughStr + ";" ;
        else if (currentObj.Underline =="1" && currentObj.Strike =="0")
            cssString += " " + newLineStr + textDecorationStr + underlineStr +";" ;
     }
     if(currentObj.textShadow != undefined)
     {
         currTextShadow = currentObj.textShadow;
         cssString += newLineStr + textShadowStr + roundNumber(currTextShadow.HOffset, 2)  + unitString +" " + roundNumber(currTextShadow.VOffset, 2) + unitString +  " " +roundNumber(currTextShadow.Blur, 2) + unitString + " ";
         cssString += rgbaStr + "(" + roundNumber(currTextShadow.BoxColor.Red, 2) + ", "  + roundNumber(currTextShadow.BoxColor.Green, 2) + ", " + roundNumber(currTextShadow.BoxColor.Blue, 2) + ", " + roundNumber(currTextShadow.BoxColor.Opacity, 2) + ");";
     }
    if(currentObj.textOpacity != undefined && exportOpacity==true)
    {
        cssString += newLineStr + opacityStr + roundNumber(currentObj.textOpacity,2) + ";";
        if((exportVendorPref == true) && msPrefixStr)
        {
                cssString += msFilterString(currentObj);
            }
        }
    cssString += newLineNoTabStr + "}" + newLineNoTabStr;

    return cssString;

}

function imageCommentString()
{
      return newLineStr + "/*imageComment*/";
    }

function checkIfNameIsAnHTMLElement(Name)
{
    for (i=0; i<htmlElements.length;i++)
    {
        if(Name == htmlElements[i])
            return true;
        }      
        return false;
    }
