// Script author: Radomir Mech. 
// Parts of this script are based on a script written by Chuck Uebele

#target photoshop

/////////////////////////
// SETUP
/////////////////////////

// Can be used to output messages to Extendscript Toolkit. This can be useful for debugging
function ESTKMessage(inMessage) 
{
     if ( ! BridgeTalk.isRunning( "estoolkit" ) )
         BridgeTalk.launch( "estoolkit" );
    
     if ( BridgeTalk.isRunning( "estoolkit" ) )
     {
        var bt = new BridgeTalk;
        bt.body = "$.writeln('" + inMessage + "');";
        bt.target = "estoolkit";
        bt.send();
     }
}


// all the strings that need to be localized
strDropdownListSelectionIcorrect = localize( "$$$/DecoScripts/DecoMenu/Alert1=You dropdown list selection is incorrect for menu item" );
strEntryCannotBeBlank = localize( "$$$/DecoScripts/DecoMenu/Alert2=The entry cannot be blank for menu item" );

// use this template to construct your own menu
var decoMenuTemplate = { 
    menuTitle : 'Test Menu',
    menuBackground : [0.94, 0.94, 0.94, 1],
    previewBackground : [1, 1, 1, 1],
    presetsDrowpdownlistWidth : 200,
    panels : [
     { panelName : 'Panel 1', 
        leftColumnWidth : 180,
        editTextWidth : 35,
        unitsWidth : 65,
        dropdownlistWidth : 160,
        panelMenu : [
         { itemName : 'Item 1 (range 1, 10)',  itemUnit : 'pixels', itemType : 'edittext', itemValue : 5, itemMin : 1, itemMax : 10, enabled: true/false, varName : 'var1' }, 
         { itemName : 'Item 2',  itemUnit : '', itemType : 'dropdownlist', itemList : ['selection 1', 'selection 2', { item : 'selection3', image : 'filename' }], itemValue : 2, itemMin : 0, itemMax : 0, varName : 'var2',
            disableItems : [ // optionally, you could specify which items in the current panel will be disabled (grayed out) for a specific selection.
             [0, [2,3], ["panel name", 0, 3]], // when selection 1 is chosed (index 0), it grays out menu item Item3 and Item4 (index 2, and 3 - indexed in order items are specified in the panelMenu array - from 0)
             [1, [3]]     // when selection 2 is chosed (index 1), it grays out menu item Item4 (index 3)
             ]  }, 
         { itemName : 'Item 3',  itemUnit : '', itemType : 'checkbox', itemValue : true, itemMin : 0, itemMax : 0, varName : 'var3' ,
             disableItems : [ // optionally, you could specify which items in the current panel will be disabled (grayed out) for a true or false
             [true, [2,3]],  // when the checkbox is checked, it grays out menu item Item3 and Item4 (index 2, and 3 - indexed in order items are specified in the panelMenu array - from 0)
             [false, [3]]     // when the checkbox is not set, it grays out menu item Item4 (index 3)
             ]  }, 
        { itemName : 'Item4', itemUnit  : '',  itemType : 'colorpicker', itemValue : [1, 1, 1], varName : 'color1'  },
         { itemName : 'Item5', itemUnit  : 'degrees',  itemType : 'slider', itemValue : 0, itemMin : -45, itemMax : 45, itemStep : 1, enabled: true/false, varName : 'angle1'  }
          // you can link two sliders together by using itemLEQitem : item_index (less or equal to value in item item_index) 
          // and itemGEQitem: item_index (). This can be used when the two slides control min and max range for some random parameter.
      ] }
   ] // end of panels
 } // end of menu

var skipRun = true // will be set to false if the user closes the window by pressing one of the two buttons

// the menu is set in decoMenu variable
var menu = decoMenu
var scriptMenuName = removeSpaces(menu.menuTitle) 

//=======================
var isPreview = typeof preview != 'undefined' ? preview : true
var isLivePreview =  1 //typeof livePreview != 'undefined' && livePreview != 0

var kSwatchBorderWidth = 2;

var cleanUpPath = function (path)
{
   if (path[0] == '/' && path[2] == '/')
  {
        path = path[1] + ':' + path.slice(2, path.length)
  }

    var newString = ""
    var lastIndex = 0
    for (var i = 0; i < path.length-2; i++)
    {
         if (path[i] == '%')
            if (path[i+1] == '2' && path[i+2] == '0')
            {
                newString += path.slice(lastIndex, i) + "\ "
                lastIndex = i+3
             }
     }

    if (lastIndex < path.length)
    {
        newString += path.slice (lastIndex, path.length)
        appPath = newString
    }
        
    path = newString
    if (path[0] == '~' && path[1] == '/')
    {
        if ($.getenv("HOMEPATH") != null)
        {
            if ($.getenv("HOMEDRIVE") != null)
                path = $.getenv("HOMEDRIVE") + '/' + $.getenv("HOMEPATH") + path.slice(1, path.length)
            else
                path = $.getenv("HOMEPATH") + path.slice(1, path.length)
        }
        else if ($.getenv("HOME") != null)
        {
            path = $.getenv("HOME") + path.slice(1, path.length)
        }
    }
    return path
}

//=====================================================
// set up paths
var scriptPathLocal = File.decode(app.path.fsName) + "/Presets/Deco";

scriptPath = cleanUpPath (scriptPathLocal)

//var decoPresetsFolder = app.preferencesFolder
var decoPresetsFolder = RenderAPI.getParameter(kpsUserPresetsFolder)

//alert("Deco presets folder: " + decoPresetsFolder)

var file = new Folder(decoPresetsFolder)
if (!file.exists)
    file.create()

//decoPresetsFolder += "/Presets"
//var file = new Folder(decoPresetsFolder)
//if (!file.exists)
//    file.create()

decoPresetsFolder += "/Deco"
file = new Folder(decoPresetsFolder)
if (!file.exists)
    file.create()

// Each script has its own subdirectory
decoPresetsFolder += "/" + scriptMenuName
file = new Folder(decoPresetsFolder)
if (!file.exists)
    file.create()


var previewImagePath = File.decode(decoPresetsFolder) + "/decoPreview.png"

if (isPreview)
{
    uiPreviewImage = new File(previewImagePath) //app.path +  "/presets/deco/decoPreview.jpg" )
    //previewImagePath = uiPreviewImage.absoluteURI
    //previewImagePath = cleanUpPath (previewImagePath)
}

//alert (previewImagePath)

if (typeof previewZoom == 'undefined')
    previewZoom = false // default - can be overriden by the user script

if (previewZoom)
{
    if (typeof modelParameters.previewScaleFactor == 'undefined')
        modelParameters.previewScaleFactor = 1
}

//var uiDecoPref = new File(decoPresetsFolder +  "/decoUserPref.xml" ) //XXX make user specific
var uiPreviewImage
if (isPreview)
    uiPreviewImage = new File(previewImagePath) //app.path +  "/presets/deco/decoPreview.jpg" )

var startNodes

var presetList = [ ]

var presetsXML = 0
var defaultXML = 0
var customXML = 0
var lastUsedXML = 0
var allPresetsXML = 0
var dvar = new Object()

var win // needs to be defined outside main

//alert (app.locale);sav
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Preview
var clone = function(obj)
{
    if (typeof obj == "xml")
        return new XML(obj.toString())
        
   if (obj == null || typeof obj != "object")
        return obj
        
    if (obj.constructor != Object && obj.constructor != Array) 
        return obj
    
    if (obj.constructor == Date || obj.constructor == RegExp || 
        obj.constructor == Function || obj.constructor == String ||
        obj.constructor == Number || obj.constructor == Boolean)
        return new obj.constructor(obj)

    var res = new obj.constructor()

    for (var name in obj)
    {
        res[name] = typeof res[name] == "undefined" ? clone(obj[name]) : obj[name]
    }

    return res
}


previewParameters = clone (modelParameters)


restart = false
previewRunning = false


var screenSize = RenderAPI.getParameter(kpsScreenSize)
//alert("screen height = " + screenSize.y)
var maxHeight = screenSize.y

var previewSize = (typeof previewSize == 'undefined') ? 400 : previewSize; // can be overided by the main script
if (previewSize + 85 > maxHeight)
    previewSize = maxHeight - 85

previewAPI = RenderAPI.getParameter (kpsPreviewRenderer, previewSize, previewSize)
//if (!previewAPI.getParameter (kpsUseOpenGL))
//    isPreview = false

previewAPI.command (kpsFreezeProgress)  // freeze the progress bar
    
var _patternSize = typeof pattern != 'undefined' ? pattern.getParameter(kpsSize) : {x: 256/4, y: 256/4 };
var _maxPatternSize = Math.max ( _patternSize.x, _patternSize.y)
var inSetUIvar = false

function update (parameters)
{
    if (inSetUIvar) // don't call preview if update methods are triggered by setting values (e.g. on start or when presets are loaded)
        return
        
     var previewScale = 1
    
    if (_maxPatternSize < 256 / 5)       // Script could overwrite this
       previewScale = Math.ceil (256 / 5 / _maxPatternSize)
    else if (_maxPatternSize > 256 / 3)
        previewScale = 256 / 3 / _maxPatternSize
     
     if (previewZoom)
        previewScale *= parameters.previewScaleFactor
     
    //var useOpenGLinRegularRender = 0
    
    //if (typeof pattern != 'undefined')
    //{
    //    useOpenGLinRegularRender = pattern.getParameter (kpsUseOpenGL) 
    //    pattern.setParameter (kpsUseOpenGL, 1) // we use OpenGL in preview
    //}
    if (previewRunning)
    {
        return; // preview is not reentrant
    }
    
    previewAPI.command (kpsStartWatchCursor)
    previewRunning = true
    do {
        restart = false
        run (previewAPI, parameters, previewScale)
        if (restart)
        {
            previewAPI.command(kpsClear)
            Engine.clearModules()
        }
   } while (restart)
   if (typeof previewImagePath != 'undefined' && (typeof updatePreview == 'undefined' || updatePreview))
    {
        //alert('saving file ' + previewImagePath)
        previewAPI.command (kpsSaveToFile, previewImagePath)
    }
    previewAPI.command(kpsClear)
    Engine.clearModules()
    
    previewAPI.command (kpsStopWatchCursor)
    previewAPI.loadIdentity(); // set for the possible next run
         
    previewRunning = false
     
    //alert ("File saved")
    //previewAPI.popMatrix();
    //if (typeof pattern != 'undefined')
    //    pattern.setParameter (kpsUseOpenGL, useOpenGLinRegularRender) // restore original value
    //win.notify("onDraw")
}

var decimalPt = $.decimalPoint // decimal point for the current locale
    
function replaceDecimalPt(str, dp1, dp2)
{
    //return str // do not replace the decimal point yet - Photoshop doesn't seem to do that either so let's be consistent
    
    //if (dp2 != ".")
    //    numberTable[dp1] = dp2
        
    // we allow only one non-digit character - a decimal point
    var newStr =  ""
    str = str.toString()
   
    var dpPresent = false;
    for (var i = 0; i < str.length; i++)
    {
        var c = str[i] == dp1 ? dp2 : str[i]
        var cc = c.charCodeAt(0)
        
        // replace hindi and arabic numerals
        if (cc >= 1632 && cc <= 1641)
            cc = 48 + cc - 1632
        if (cc >= 1776 && cc <= 1785)
            cc = 48 + cc - 1776
         
        newStr += String.fromCharCode(cc)
         
         // we allow '-' (minus) at the beginning, decimalPoint and a number
         if (newStr[i] == dp2 /*|| newStr[i] == '.' */)
         {
             if (dpPresent)
                return str // we cannot have more than one decimal point
             dpPresent = true;
             continue;
         }
         if (isNaN(Number(newStr[i])) && (newStr[i] != '-' || i > 0))
         {
             return str
         }
    }
    return newStr
 }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var forceUsingModelParameters = false

// check if we are playing an action
var actionParameters = RenderAPI.getParameter (kpsParameterString)
var newModelParameters
var modelParametersBackup

if (actionParameters)
{
       modelParametersBackup = clone (modelParameters) 
       
       if (actionParameters != " " && actionParameters != "multiple")
        {
            
            newModelParameters = eval (actionParameters)
            // Merge the parameters and test them
            for (var pI = 0; pI < menu.panels.length; pI++)
            {
                for (var mI = 0; mI < menu.panels[pI].panelMenu.length; mI++)
                {
                    var currMenuItem = menu.panels[pI].panelMenu[mI]
                    var varName = currMenuItem.varName;
                    if (typeof modelParameters[varName] == 'undefined' && typeof newModelParameters[varName] == 'undefined')
                        continue; // This parameter is not defined in either of the parameter sets
                    if (typeof newModelParameters[varName] != 'undefined')
                    {
                        //alert("setting modelParameters[" + varName + "] = " + newModelParameters[varName])
                        modelParameters[varName] = newModelParameters[varName]
                    }
 
                    // test validity of the value
                    switch (currMenuItem.itemType)
                    {
                        case 'edittext':
                            // anything goes
                            break;
                            
                        case 'slider':
                            if (isNaN(modelParameters[varName]))
                                modelParameters[varName] = currMenuItem.itemValue
                            else
                            {
 
                                if (modelParameters[varName] < currMenuItem.itemMin)
                                    modelParameters[varName] = currMenuItem.itemMin
                                if (modelParameters[varName] > currMenuItem.itemMax)
                                    modelParameters[varName] = currMenuItem.itemMax
                            }
                            break;
                            
                        case 'colorpicker':
                            if (modelParameters[varName].constructor != Array)
                                modelParameters[varName] = currMenuItem.itemValue
                            else
                                for (var i = 0; i < 3; i++)
                                    if (modelParameters[varName][i] < 0 )
                                        modelParameters[varName][i] = 0
                                    else if (modelParameters[varName][i] > 1 )
                                        modelParameters[varName][i] = 1
                            break;
                            
                        case 'dropdownlist':
                            if (isNaN(modelParameters[varName]))
                                modelParameters[varName] = currMenuItem.itemValue
                            if (modelParameters[varName]  < 0)
                                modelParameters[varName] = 0
                            else if (modelParameters[varName]  >= currMenuItem.itemList.length)
                                modelParameters[varName] = currMenuItem.itemList.length - 1
                            break;

                        case 'checkbox':
                            if (modelParameters[varName] != false && modelParameters[varName] != true)
                                modelParameters[varName] = currMenuItem.itemValue
                            break;
                    }                  
                }
            }
        }
        skipRun = (typeof Window == 'undefined') ? true: false // skip the run if the window cannot be open (it may be a sign that graphics has limited capabilities)
        
        if ( RenderAPI.getParameter (kpsShowDialog))
        {
            app.bringToFront();
            forceUsingModelParameters = true
            newModelParameters = modelParameters
            modelParameters = modelParametersBackup // in case the user selects default
            main();
        }
}
else
{
    // check if we can create a window - extendscript fails to define a window in 32 bit version on some integrated graphics cards
    if (typeof Window == 'undefined')
    {
        alert(localize( "$$$/DecoScripts/DecoMenu/CannotOpenWindow=Cannot open scripted pattern dialog. Default values will be used."));
        skipRun = false
    }
    else
    {
        app.bringToFront();
        main();
    }
}


function outputResult (prefix)
{
    // output the variables 
    var outputText = "";
    var problem = false;
    for (var pI = 0; pI < menu.panels.length; pI++)
    {
        var currPanel = menu.panels[pI]
        for (var mI = 0; mI < currPanel.panelMenu.length; mI++)
        {
            var currMenu = menu.panels[pI].panelMenu[mI]
            var var1 = win.panels[pI].menu[mI].var1
            if (currMenu.itemType == 'dropdownlist')
            {
                    if (var1.selection < 0 || var1.selection >= currMenu.itemList.length)
                    {
                        alert(strDropdownListSelectionIcorrect + ": " + currMenu.itemName) //the alert strings is localized above
                        problem = true
                    }
                    else
                        outputText += prefix + currMenu.varName + "=" + var1.selection + ";\n"
            }
            else if (currMenu.itemType == 'checkbox')
            {
                outputText += prefix + currMenu.varName + "=" + var1.value + ";\n"
            }
            else if (currMenu.itemType == 'edittext')
            {
                if (typeof currMenu.itemMin != undefined && currMenu.itemMin != undefined)
                {
                    // edit text will contanin a number
                    var num = replaceDecimalPt(var1.text, decimalPt, '.')
                    if(var1.text == '')
                    {
                       alert (strEntryCannotBeBlank + " : " + currMenu.itemName);
                        problem = true;
                    }
                    else if(isNaN(num ))
                    {
                        alert(localize( "$$$/DecoScripts/DecoMenu/NotAnNumber=Your entry is not a number for menu item: ") + currMenu.itemName);
                        problem = true;
                    } 
                    else if (num < currMenu.itemMin)
                    {
                        alert(localize( "$$$/DecoScripts/DecoMenu/YourValueOf=Your value of ") +var1.text + 
                                localize( "$$$/DecoScripts/DecoMenu/CannotBeSmaller= cannot be smaller than ") + currMenu.itemMin + 
                                localize( "$$$/DecoScripts/DecoMenu/ForMenuItem= for menu item: ") + currMenu.itemName);
                        problem = true;
                    }                         
                    else if (num > currMenu.itemMax)
                    {
                        alert(localize( "$$$/DecoScripts/DecoMenu/YourValueOf=Your value of ") + var1.text + 
                                localize( "$$$/DecoScripts/DecoMenu/CannotBeLarger= cannot be larger than ") + currMenu.itemMax + 
                                localize( "$$$/DecoScripts/DecoMenu/ForMenuItem= for menu item: ") + currMenu.itemName);
                        problem = true;
                    }         
                    else
                        outputText += prefix + currMenu.varName + "=" + num+ ";\n"
                }
                else
                        ouputText += prefix + currMenu.varName + "=" + var1.text + ";\n"
            }
            else if (currMenu.itemType == 'slider')
            {
                  outputText += prefix + currMenu.varName + "=" + Math.round (var1.value / var1.valStep) * var1.valStep + ";\n"
            }
            else if (currMenu.itemType == 'colorpicker')
            {
                var number = parseInt(var1.value, 16) // convert hex string to int
                var red = Math.floor(number / 0x10000)
                number -= red * 0x10000
                var green = Math.floor( number / 0x100)
                var blue = number - green * 0x100
                
                outputText += prefix + currMenu.varName + "= [" + red / 255+ ", " + green / 255 + ", " + blue / 255+ "];\n"
            }
        }
     }
 
    if (!problem)
    {
        //alert (outputText)
        eval (outputText)
    }
    if (problem)
        alert (localize( "$$$/DecoScripts/DecoMenu/ProblemInOutputResult=Problem in outputResult"))
    
    return problem ? 0 : 1;
 }

function doPreview (parent)
{
    outputResult('previewParameters.') // update previewParameters
    update(previewParameters)
    //alert('after update')
    if (typeof win != undefined && typeof win.previewImage != "undefined" && (typeof updatePreview == 'undefined' || updatePreview))
    {
        win.previewImage.image = previewImagePath // updates the image
        win.previewImage.enabled = true
    }
    //win.previewPanel.updateBtn.enabled = false
    //if (typeof parent != 'undefined')
    //alert ("doPreview old " + parent.var1.oldValue + " new " + parent.var1.value)
    parent.var1.oldValue = parent.var1.value
 
return;
   
    if (isLivePreview)
    {
        //eval ('previewParameters.' + parent.var1.decoVarName + "=" + parent.var1.value)
        if (previewRunning)
        {
            restart = true
            //alert("restart");
        }
        else
        {
            update(previewParameters)
            win.previewImage.image = previewImagePath; // updates the image
            win.previewImage.enabled = true
        }
    }
    else
    {
        win.previewImage.enabled = false
        if (typeof win.previewPanel.updateBtn != "undefined")
            win.previewPanel.updateBtn.enabled = true 
    }
    //if (typeof parent != 'undefined')
        parent.var1.oldValue = parent.var1.value
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getTextWidth(parent, text)
{
    var group = parent.add ('group', undefined)
    var test = group.add('statictext', undefined, text)
    test.preferredSize = [-1, -1]
    group.layout.layout(true)
    //alert (test.preferredSize[0] + ", " + test.preferredSize[1])
    var width = test.preferredSize[0]
    parent.remove (group)
    return width
}


function enableMenuItem(pI, mI, enable, depth)
{
    //alert ('called enableMenu(' + pI + ", " + mI + ", " + enable + ", " + depth + ")")
    if (win.panels[pI].menu[ mI ].var1.enabled == enable)
        // no change
        return;
    
    win.panels[pI].menu[ mI ].var1.enabled = enable
    if (typeof win.panels[pI].menu[ mI ].st1 != 'undefined')
        win.panels[pI].menu[ mI ].st1.enabled = enable 
    if (typeof win.panels[pI].menu[ mI ].ut != 'undefined')
        win.panels[pI].menu[ mI ].ut.enabled = enable 
    if (typeof win.panels[pI].menu[ mI ].valt != 'undefined')
        win.panels[pI].menu[ mI ].valt.enabled = enable 
    if (typeof win.panels[pI].menu[ mI ].var1.backgroundColor != 'undefined') // for colorpicker
         setSwatchColor (win.panels[pI].menu[ mI ].var1, enable ? win.panels[pI].menu[ mI ].var1.value : '0xe0e0e0')

    if (depth < 4) // to prevent infinite loop
        updateDisableElements (win.panels[pI].menu[ mI ].var1, depth+1, enable)
}
 
 
 function updateDisableElements (var1, depth, enable)
{
    var disabledElements = new Array(0)
    // first enable, then disable (below)
    {
        // enable all items if there were some disabled last time - or store the values???
        for (var n = 0; n < var1.disabledElements.length; n+=2)
        {
            // We still need to skip the first element if the disabled elements araey contains a string
            var j = isNaN(parseFloat(var1.disabledElements[n+1][0])) ? 1 : 0
             for (; j < var1.disabledElements[n+1].length; j++)
            {
                enableMenuItem(var1.disabledElements[n], var1.disabledElements[n+1][j], true, depth)
            }
        }
        var1.disabledElements = new Array(0)
    }
    if (enable && var1.disableItems)
    {
        // gray out some menu items, if requested
       for (var i = 0; i < var1.disableItems.length; i++)
            if (var1.disableItems[i][0] == var1.value)
            {
                //alert ('gray out elements ' + this.disableItems[i][1])
                // there could be more than one array
                for (var n = 1; n < var1.disableItems[i].length; n++)
                {
                    var panelI = var1.pI
                    var firstItem = 0
                     // check whether the first item is a string (panel name) or not (current panel)
                    if (isNaN(parseFloat(var1.disableItems[i][n][0])))
                    {
                        // find the panel
                        var fp
                        for (fp = 0; fp < win.panels.length; fp ++)
                        {
                           if (win.panels[fp].name == var1.disableItems[i][n][0])
                           {
                               panelI = fp
                                break
                            }
                        }
                        if (fp == win.panels.length)
                        {
                           // panel name not found
                           continue; // go to the next array of disableItems (for(n ... above)
                         }
                         firstItem = 1
                     }
                     for (var j = firstItem; j < var1.disableItems[i][n].length; j++)
                     {
                        //alert("calling enableMenuItem(" + panelI + ", " + var1.disableItems[i][n][j] + ", false, 0)")
                        enableMenuItem(panelI, var1.disableItems[i][n][j], false, depth)
                     }
                    disabledElements.push(panelI)  // store the panel index
                    disabledElements.push(var1.disableItems[i][n]) // and the array of disable items for that panel
               }
            }
    }
    var1.disabledElements = disabledElements
}


function GetPanelSelection()
{
    return win.tabbedPanel.selection.text
}

function main()
{
    var updated=false;
    if(!documents.length || !menu || menu.panels.length == 0) return;

    // Define the menu window
    win = new Window( 'dialog', menu.menuTitle );
    win.margins = [10,10,10,10] // left top right bottom
    win.paramsOK = true

    //alert ("size = " + win.maximumSize)
    //win.preferredSize =  [4000, 4000]
    //win.layout.layout(false)
    //alert ("size2 = " + win.preferredSize);
    
    g = win.graphics;    
    var myBrush = g.newBrush(g.BrushType.THEME_COLOR, "appDialogBackground");
    g.backgroundColor = myBrush;
	g.disabledBackgroundColor = myBrush;
    
     win.g0 = win.add('group');
    win.g0.orientation = "column";
    //win.title = win.g0.add('statictext',undefined,menu.menuTitle);
    //win.title.alignment="center";
    //var g = win.title.graphics;
    //g.font = ScriptUI.newFont("Georgia","BOLDITALIC",18);
    
    win.p0 = win.g0.add('panel', undefined, '', {borderStyle:"none"});
    win.p0.margins = [0,0,0,0]
    win.p0.orientation = "row"; 
    win.p0.alignChildren = ['left','top']
   
    if (isPreview /*&& uiPreviewImage.exists */)
    {
        //win.previewPanel = win.p0.add('panel', undefined, 'Preview', {borderStyle:"black", backgrounColor : "white"});
        win.previewPanelBase = win.p0.add('panel', undefined, '', {borderStyle:"none"});
        win.previewPanel = win.previewPanelBase.add('panel', [0,0,previewSize+4,previewSize+4], '', {borderStyle:"sunken"});
        g = win.previewPanel.graphics;
        myBrush = g.newBrush(g.BrushType.SOLID_COLOR, (typeof menu.previewBackground != 'undefined' ) ? menu.previewBackground : [0.94, 0.94, 0.94, 1]);
        g.backgroundColor = myBrush;
   }
       
    win.g1 = win.p0.add('panel', undefined, '', {borderStyle:"none"});
    win.g1.margins = [0,0,0,0]
    win.g1.orientation = "column"; 
    win.g1.alignChildren = ['left','top']
     
       win.presetPn = win.g1.add('panel',undefined,'',{borderStyle:"none"})
       win.presetPn.margins = [0,0,0,0]
       win.presetPn.orientation = 'row';
       win.presetPn.alignChildren = ['left','middle'];
        
        //win.presetPn.st1 = win.presetPn.add('statictext', undefined, localize( "$$$/DecoScripts/DecoMenu/Preset=Preset:"));
        //win.presetPn.st1.margins = [0,0,0,0]
        dvar.presetsDbx = win.presetPn.add('dropdownlist',undefined,presetList)
        g = dvar.presetsDbx.graphics;
        myBrush = g.newBrush(g.BrushType.SOLID_COLOR, [1, 1, 1, 1]);
        g.backgroundColor = myBrush;
        dvar.presetsDbx.margins = [0,0,0,0]
        dvar.presetsDbx.selection=0
        var presetsWidth = typeof menu.presetsDrowpdownlistWidth != 'undefined' ? menu.presetsDrowpdownlistWidth :  200
        var width = getTextWidth (win.g1, localize("$$$/DecoScripts/ScriptMenu/Preset=Preset: ") + localize("$$$/DecoScripts/ScriptMenu/Default=Default"))
        if (width + 30 > presetsWidth)
            presetsWidth = width + 30
        width = getTextWidth (win.g1, localize("$$$/DecoScripts/ScriptMenu/Preset=Preset: ") + localize("$$$/DecoScripts/ScriptMenu/Custom=Custom"))
        if (width + 30 > presetsWidth)
            presetsWidth = width + 30
       dvar.presetsDbx.size = [presetsWidth, 20]
        
        dvar.presetsDbx.onActivate = function()
        {
            //alert("onActivate")
            this.insideActivate = true
            this.selection =  0
           
           // if (this.selection2 == 0) // Default
           //     this.selection = 1
           // else if (this.selection2 == 1) // Custom
           ///     this.selection = 3 + (presetsXML.length > 0 ? presetsXML.length + 1 : 0) + 4
           // else if (this.selection2 >= 2)
            //    this.selection = 1 + this.selection2
            this.insideActivate = false
        }  
        dvar.presetsDbx.insideActivate = false
        
        dvar.presetsDbx.onChange = function()
        {
            if (this.insideActivate || this.insideSetPresetList) // don't make any changes if we are in onActivate method or in setPresetList method
                return
            //alert('onChange called ' + this.selection)
            var sel = this.selection
            var posMenu = 3 + (presetsXML.length > 0 ? presetsXML.length + 1 : 0)
            //alert(posMenu + ", " + presetsXML.length)
            if (sel == posMenu + 4)
            {
                    if (dvar.presetsDbx .selection2 != 1)
                    {
                        menuApplyPreset(customXML)
                        setPresetList(1)
                    }
                    else
                        this.selection = 0
            }
            else if (sel == 1)
            {
                    if (dvar.presetsDbx .selection2 != 0)
                     {
                        //alert ('calling setPresetList(0)')
                        menuApplyPreset(defaultXML)
                        setPresetList(0)
                     }
                    else
                        this.selection = 0
           }
            else if (presetsXML.length > 0 && sel - 3 >= 0 && sel - 3 < presetsXML.length)
            {
                 if (dvar.presetsDbx .selection2 != sel - 1)
                 {
                    sel --
                    menuApplyPreset(presetsXML[sel - 2])
                    setPresetList(sel)
                }
                else
                    this.selection = 0
            }
            else if (sel == posMenu)
            {
                // load preset
                setPresetList (menuLoadPreset())
          }
            else if (sel == posMenu + 1)
            {
                    // save preset
                     setPresetList (menuSavePreset())
            }
            else if (sel == posMenu + 2)
            {
                   // delete preset
                   setPresetList (menuDeletePresets())
             }
            //alert ('on change, selection ' + this.selection)
        }  
    
        menuApplyPreset = function(xml)
        {
            //alert ('setting values to ' + xml)
            var storePreview = isPreview
            isPreview = false  // so that on changing methods are not triggering update
            setUIvar(xml,win)

             // call onClick for all checkboxes (to update disabledItems, if there are any)
            for (var pI = 0; pI < win.panels.length; pI++)
            {
                var currPanel = win.panels[pI]
                for (var mI = 0; mI < currPanel.menu.length; mI++)
                     if (currPanel.menu[mI].itemType == 'checkbox')
                            win.panels[pI].menu[mI].var1.onClick() 
             }
            isPreview = storePreview

            if (1 || !isLivePreview)
            {
                outputResult('previewParameters.') // update previewParameters
                update(previewParameters)
                win.previewImage.image = previewImagePath; // updates the image
                win.previewImage.enabled = true
                if (typeof win.previewPanel.updateBtn != "undefined")
                    win.previewPanel.updateBtn.enabled = false
            }
        }

        menuSavePreset = function()
        {
            var fileD = new File(decoPresetsFolder)
            var file = fileD.saveDlg ( localize( "$$$/DecoScripts/DecoMenu/SavePresetAs=Save preset as an xml file"), "*.xml")
            var xml
            if (file == null)
            {
                // saving was cancelled
                return dvar.presetsDbx .selection2
            }
            if (dvar.presetsDbx .selection2 == 0) // Default
                xml = clone(defaultXML)
            else if (dvar.presetsDbx .selection2 == 1) // Custom
            {
                // update the xml with current values
                setXML (customXML, win, 0)
                 xml = clone(customXML)
            }
            else if (dvar.presetsDbx .selection2 >= 2)
               xml = clone(presetsXML[dvar.presetsDbx .selection2-2])
           
           xml.preset.@presetName = File.decode (file.name)
           var dotInName = file.name.lastIndexOf('.')
           if (dotInName > 0)
                xml.preset.@presetName = File.decode (file.name.substr(0, dotInName));
           else 
                xml.preset.@presetName = File.decode (file.name);
           
           if (xml.preset.@presetName == 'Custom' /* && file.fsName == fileD.fsName */)
           {
                alert (localize( "$$$/DecoScripts/DecoMenu/CannotOverwriteCustom=You cannot use the Custom preset name. Choose a different name."))
                return dvar.presetsDbx .selection2
           }
           if (xml.preset.@presetName == 'Default' /* && file.fsName == fileD.fsName */)
           {
                alert (localize( "$$$/DecoScripts/DecoMenu/CannotOverwriteDefault=You cannot use the Default preset name. Choose a different name."))
                return dvar.presetsDbx .selection2
           }
 
           return addNewXML (xml, false /* don't test overwrite */) // write also to presets - so that it shows up the next time we use this script
        }
        
        menuLoadPreset = function()
        {
            //var fileD = new File(decoPresetsFolder)
            var file = File.openDialog ( localize( "$$$/DecoScripts/DecoMenu/LoadPresetFrom=Choose a preset file"), File.fs == 'Macintosh' ? function(f) { return f.name.slice(-4) == '.xml' } : "*.xml")
            if (file == null)
            {
                // loading was cancelled
                return dvar.presetsDbx .selection2
                }
                
            var xml = readFile(file)
            if (xml.preset.@presetName == 'Custom' /* && file.fsName == fileD.fsName */)
           {
                //alert (localize( "$$$/DecoScripts/DecoMenu/CannotLoadCustom=You cannot load a preset with name 'Custom'."))
                return 1 //dvar.presetsDbx .selection2
           }
           if (xml.preset.@presetName == 'Default' /* && file.fsName == fileD.fsName */)
           {
                //alert (localize( "$$$/DecoScripts/DecoMenu/CannotLoadDefault=You cannot load a preset with name 'Default'."))
                return 0 //dvar.presetsDbx .selection2
           }
          menuApplyPreset(xml)
          return addNewXML(xml, true /* test overwrite */)
        }
    
        addNewXML = function(xml, testOverwrite)
        {
            // check if preet name already exists - in fact find the highest number in case we have already added (n) to the name
            //alert (xml)
            var highestNumber = -1
            var highestIndex = -1
            var lowestIndex = -1
            for (var i = 0; i < presetsXML.length; i++)
            {
                var storedName = presetsXML[i].preset.@presetName.toString()
                var index = storedName.lastIndexOf('-')
                 if (index > 1 && storedName.slice(0, index) == xml.preset.@presetName)
                 {
                    // get the index after the name
                    var num = Number(storedName.slice(index+1,storedName.length))
                     //alert('num = ' + num)
                     if (num > highestNumber)
                     {
                         highestNumber = num
                         highestIndex = i
                     }
                }
                else if (storedName == xml.preset.@presetName)
                {
                    lowestIndex = i
                    if (highestNumber < 0)
                    {
                        highestNumber = 0
                        highestIndex = i
                    }
                }
           }
            
            if (highestIndex >= 0)
            {
                var overwritePre = true
                if (testOverwrite)
                    overwritePre = confirm (localize( "$$$/DecoScripts/DecoMenu/PresetOverwriteQuestion=Adding preset to menu - preset already exists. Do you want to overwrite the preset ") + ' "' + 
                                                        removePercent20 (xml.preset.@presetName) + '"' +
                                                        localize("$$$/DecoScripts/DecoMenu/QuestionMark=?"), true)

                if (overwritePre)
                {
                    presetsXML[lowestIndex] = xml
                    return 2+lowestIndex
                 }
                 else
                 {
                    xml.preset.@presetName =  xml.preset.@presetName + (-(Number(highestNumber) +1)) 
                 }
            }

            presetsXML.push(xml)
            writeXMLFile (xml)
            return 2 + presetsXML.length - 1
        }
        
        menuDeletePresets = function()
        {
            if(dvar.presetsDbx.selection2 == 0) 
            { 
                alert (localize( "$$$/DecoScripts/DecoMenu/CannotDeleteDefault=You cannot delete the Default preset"))
            }
            else if(parseInt(dvar.presetsDbx.selection2) == 1)
            { 
                 alert (localize( "$$$/DecoScripts/DecoMenu/CannotDeleteCustom=You cannot delete the Custom preset"))
            }
            else
            {
                var delPre = confirm (localize( "$$$/DecoScripts/DecoMenu/DoYouWantToDelete=Do you want to delete the preset ") + '"' + 
                                                 removePercent20 (presetsXML[parseInt(dvar.presetsDbx.selection2) - 2].preset.@presetName) + '"?', 
                                                 localize( "$$$/DecoScripts/DecoMenu/=Yes"), localize( "$$$/DecoScripts/DecoMenu/DeletePreset=Delete Preset"))
                if(delPre)
                {
                    var index = parseInt(dvar.presetsDbx.selection2) - 2
                    deleteXMLFile (presetsXML[index])
                    presetsXML.splice(index,1) 
                    return 1 // set to custom  //XXX although if we save the custom preset before changuing anything - it may have the original custom values
                }
            }
            return dvar.presetsDbx.selection2
        }


     win.panels = new Array()
     win.tabs = new Array()
     
     if (menu.panels.length > 1)
     {
         // make tabbed panels
         win.g1.spacing = 5
         win.tabbedPanel = win.g1.add ('tabbedpanel')
         win.tabbedPanel.margins = [0,0,0,25]
         for (var pI = 0; pI < menu.panels.length; pI++)
         {
            win.tabs[pI] = win.tabbedPanel.add('tab', undefined, menu.panels[pI].panelName, {borderStyle:"none"})
            win.tabs[pI].margins = [0,0,0,0]
            win.tabs[pI].spacing = 5
            win.tabs[pI].orientation = "column"; 
            win.tabs[pI].alignChildren = ['left','top'] 
         }
		 win.tabbedPanel.selection = win.tabs[0];
    }
    else
        win.tabs[0] = win.g1
        
    for (var pI = 0; pI < menu.panels.length; pI++)
    {
        var currPanel = menu.panels[pI]
        currPanel.leftColumnWidth = typeof currPanel.leftColumnWidth != 'undefined' ? currPanel.leftColumnWidth : 180
        currPanel.editTextWidth = typeof currPanel.editTextWidth != 'undefined' ? currPanel.editTextWidth : 46
        currPanel.unitsWidth = typeof currPanel.unitsWidth != 'undefined' ? currPanel.unitsWidth :  65
        currPanel.dropdownlistWidth = typeof currPanel.dropdownlistWidth != 'undefined' ? currPanel.dropdownlistWidth :  160
        
        var height1 = 44 // slider
        var height2 = 32
        var height3 = 30
        var height4 = 25 // checkbox
        var height5 = 22
        if (0)
        {
            height1 = 32
            height2 = 20
            height3 = 19
            height4 = 18
            height5 = 17
         }
       
        // check if  the widths are sufficient
        // also computes the height of the menu
        var textMargin = 5
        var height = 140
        var num3 = 0;
        var maxDropdownWidth = 0
        for (var mI = 0; mI < currPanel.panelMenu.length; mI++)
        {
            var textWidth = getTextWidth (win.tabs[pI], currPanel.panelMenu[mI].itemName)
            if (textWidth + textMargin > currPanel.leftColumnWidth)
                currPanel.leftColumnWidth = textWidth + textMargin
            
            if (typeof currPanel.panelMenu[mI].itemUnit != undefined)
            {
                var itemWidth = getTextWidth (win.tabs[pI], currPanel.panelMenu[mI].itemUnit)
                if (itemWidth + textMargin > currPanel.unitsWidth)
                    currPanel.unitsWidth = itemWidth + textMargin
             }
         
            var currMenu = currPanel.panelMenu[mI];
             if (currMenu.itemType == 'dropdownlist')
             {
                    var itemWidth = currPanel.dropdownlistWidth  // default or user specified
                    currMenu.dropdownlistWidth = currPanel.dropdownlistWidth  // it would be ugly to have all dropdown lists long because one has long items, store it per menu item
                    
                    // go over all dropdownlist items and determine the maximum string length
                    for (var ii = 0; ii < currMenu.itemList.length; ii++)
                    {
                        if (typeof currMenu.itemList[ii] == 'object')
                        {
                            // some items store both the item name and path to a item icon
                            if (typeof currMenu.itemList[ii].item == 'string')
                               itemWidth = getTextWidth (win.tabs[pI], currMenu.itemList[ii].item)
                        }
                        else
                        {
                            itemWidth = getTextWidth (win.tabs[pI], currMenu.itemList[ii])
                        }
                       // we have to add width of the selection arrow
                       itemWidth += 25
                       if (currMenu.dropdownlistWidth < itemWidth)
                            currMenu.dropdownlistWidth = itemWidth
                       if (itemWidth + textWidth + textMargin + 5 > maxDropdownWidth) // width of the whole line
                            maxDropdownWidth = itemWidth + textWidth + textMargin + 45;
                    }
            }
         
             if (currMenu.itemType == 'slider')
                height += height1 //+ height3+2
           else if (currMenu.itemType == 'checkbox')
                height += height4 + 2
           else
           {
                height += height3 + 2
                num3 ++
            }
     }
  
      //alert("height before is " + height)
      
      if (height > maxHeight)
      {
          var diff = Math.ceil((height - maxHeight) / currPanel.panelMenu.length) 
          //alert("diff = " + diff + " num3 = " + num3)
          height1 -= diff;
          height2 -= diff;
          if (height3 - diff < 20)
          {
              var h2 = num3 * (20 - (height3 - diff)) // we have to distribute this amount
              var diff2 = Math.ceil(h2 / (currPanel.panelMenu.length - num3)) 
              height1 -= diff2;
              height2 -= diff2;
              height3 = 20;
          }
          else
             height3 -= diff;
             
          height4 = Math.max(height4 - diff, 18);
          height5 = Math.max(height5 - diff, 18);
        }  
    
        currPanel.panelWidth = currPanel.leftColumnWidth + currPanel.editTextWidth + 7 + currPanel.unitsWidth + 17;
        if (currPanel.panelWidth < maxDropdownWidth)
            currPanel.panelWidth = maxDropdownWidth
   
        if (menu.panels.length == 1)
            win.panels[pI] = win.g1.add('panel', undefined, currPanel.panelName, {borderStyle:"etched"});
        else
        {
              win.panels[pI] = win.tabs[pI].add('panel', undefined, '', {borderStyle:"none"})
              //alert("num panels " + win.panels.length)
        }
        win.panels[pI].margins = [0,3,0,0]
        win.panels[pI].spacing = 5
        win.panels[pI].name = currPanel.panelName
        //win.panels[pI].orientation = 'stack'
        win.panels[pI].alignChildren = ['left','top'];  

        // create menu items in a panel
        win.panels[pI] .menu = new Array()
        for (var mI = 0; mI < currPanel.panelMenu.length; mI++)
        {
            var currMenu = currPanel.panelMenu[mI]
           
            win.panels[pI].menu[mI]  = win.panels[pI].add('group', undefined) // '', {borderStyle:"none"})
            win.panels[pI].menu[mI].margins = [0,0,2,0]
            if (currMenu.itemType == 'slider')
                win.panels[pI].menu[mI].size = [currPanel.panelWidth, height1]
           else if (currMenu.itemType == 'checkbox')
                 win.panels[pI].menu[mI].size = [currPanel.panelWidth, height4]
           else if (currMenu.itemType == 'dropdownlist')
                 win.panels[pI].menu[mI].size = [currPanel.panelWidth, 32]
           else
                win.panels[pI].menu[mI].size = [currPanel.panelWidth, height3]
            win.panels[pI].menu[mI].orientation = 'stack'
            win.panels[pI].alignChildren = ['left','top'];  
            win.panels[pI].menu[mI].alignment='top';
            win.panels[pI].menu[mI].spacing=0;
            
            // display the menu item
			if (currMenu.itemType != 'checkbox')
			{
				// Use an extra 2 groups so that we can have it right aligned (I didn't figure out a better method for doing this)
				win.panels[pI].menu[mI].gr1 = win.panels[pI].menu[mI].add('group', undefined, '') 
				win.panels[pI].menu[mI].gr1.margins = [0,0,0,0]
				win.panels[pI].menu[mI].gr1.alignment = ['left','top'];
				if (currMenu.itemType == 'dropdownlist')
					win.panels[pI].menu[mI].gr1.size=[currPanel.panelWidth - currMenu.dropdownlistWidth - 35, 22];
				else
					win.panels[pI].menu[mI].gr1.size=[currPanel.leftColumnWidth, 22];
				win.panels[pI].menu[mI].gr1.alignChildren = ['left','top'];  
            
				win.panels[pI].menu[mI].gr1b = win.panels[pI].menu[mI].gr1.add('group', undefined) 
				if (currMenu.itemType == 'dropdownlist')
				{
					win.panels[pI].menu[mI].gr1b.size=[currPanel.panelWidth - currMenu.dropdownlistWidth - 35, height3];
					win.panels[pI].menu[mI].gr1b.alignment = ['left','top'];
				}
				else if (currMenu.itemType == 'slider')
				{
					win.panels[pI].menu[mI].gr1b.size=[currPanel.leftColumnWidth, 22];
				}
				else
					win.panels[pI].menu[mI].gr1b.size=[currPanel.leftColumnWidth, height5];
				win.panels[pI].menu[mI].gr1b.alignChildren = ['right','center'];  
				
				if (currMenu.itemType == 'slider')
					win.panels[pI].menu[mI].gr1b.margins = [0,5,0,0]
			}
            win.panels[pI].menu[mI].itemType = currMenu.itemType
            if (currMenu.itemType != 'checkbox')
                win.panels[pI].menu[mI].st1 = win.panels[pI].menu[mI].gr1b.add('statictext', undefined, currMenu.itemName); 
            //win.panels[pI].menu[mI].st1.alignment =  currMenu.itemType == 'dropdownlist' ? 'left' : 'right'
      
            col2width = 30
            
             if (currMenu.itemType == 'checkbox')
            {
                win.panels[pI].menu[mI].var1 = win.panels[pI].menu[mI].add(currMenu.itemType, [10, 0, currPanel.leftColumnWidth + 40, height4], '  ' + currMenu.itemName);
                win.panels[pI].menu[mI].var1.value = currMenu.itemValue
                win.panels[pI].menu[mI].var1.oldValue=win.panels[pI].menu[mI].var1.value
                win.panels[pI].menu[mI].var1.align = 'left'
                win.panels[pI].menu[mI].var1.disableItems = (typeof currMenu.disableItems != 'undefined') ? currMenu.disableItems : 0
                win.panels[pI].menu[mI].var1.onClick = function()
                {
                    if (!this.enabled)
                        return;
                     updateDisableElements (this, 0, true /* item itself is enabled */)
                     if (isPreview)
                    {
                        if (this.value != this.oldValue)
                        {
                            setPresetList (1)
                            doPreview (this.parent)
                         }
                   }
                 }
           }
            else if (currMenu.itemType == 'slider')
            {               
                //win.panels[pI].menu[mI].gr2.alignChildren = ['center','middle'];  
                //col2width = 0
                //win.panels[pI].menu[mI].var1 = win.panels[pI].menu[mI].add(currMenu.itemType, undefined, currMenu.itemValue) //[10,20,currPanel.panelWidth-20, 5]
                //win.panels[pI].menu[mI].var1.margins = [0,0,0,0]
                //win.panels[pI].menu[mI].var1.alignment = 'bottom'
                //win.panels[pI].menu[mI].var1.size = [currPanel.panelWidth-20, 32] // higher Y size will move the slider closer to the edt text above it 
                //win.panels[pI].menu[mI].var1.preferredSize=[currPanel.panelWidth-10, 19];
             }
            else if (currMenu.itemType == 'edittext')
            {
                 // edit text
                win.panels[pI].menu[mI].valtgr = win.panels[pI].menu[mI].add('group', undefined)
                win.panels[pI].menu[mI].valtgr.size = [currPanel.panelWidth - (currPanel.leftColumnWidth) - 7 , height1+2]
                win.panels[pI].menu[mI].valtgr.alignChildren = ['left','top'];  
                win.panels[pI].menu[mI].valtgr.alignment = 'right' 
                
                win.panels[pI].menu[mI].var1 = win.panels[pI].menu[mI].valtgr.add('edittext', undefined, currMenu.itemValue);
                var textWidth = typeof currMenu.editTextWidth != undefined ? currMenu.editTextWidth : currPanel.editTextWidth
                win.panels[pI].menu[mI].var1.size = [textWidth , height5]
                win.panels[pI].menu[mI].var1.alignment = 'top'
                win.panels[pI].menu[mI].var1.oldValue=win.panels[pI].menu[mI].var1.value
 
                //win.panels[pI].menu[mI].var1 = win.panels[pI].menu[mI].add(currMenu.itemType, [currPanel.leftColumnWidth, 5, currPanel.leftColumnWidth + currPanel.editTextWidth, 25], currMenu.itemValue);
                win.panels[pI].menu[mI].var1.onChange = function()
                {
                    this.value= this.text
                    if (isPreview)
                        if (this.value != this.oldValue)
                        {
                            setPresetList (1)
                            doPreview (this.parent)
                        }
                }
            }
            else if (currMenu.itemType == 'colorpicker')
            {
                 // color picker
                win.panels[pI].menu[mI].valtgr = win.panels[pI].menu[mI].add('group', undefined)
                win.panels[pI].menu[mI].valtgr.size = [currPanel.panelWidth - (currPanel.leftColumnWidth) - 7 , height1+2]
                win.panels[pI].menu[mI].valtgr.alignChildren = ['left','top'];  
                win.panels[pI].menu[mI].valtgr.alignment = 'right' 
                
                win.panels[pI].menu[mI].valtgr2 = win.panels[pI].menu[mI].valtgr.add('group', undefined)  //, '', {borderStyle:"etched"})
                win.panels[pI].menu[mI].valtgr2.size = [34 , height4+1]
                win.panels[pI].menu[mI].valtgr2.alignment = 'top' 

                win.panels[pI].menu[mI].var1 = win.panels[pI].menu[mI].valtgr2.add('button', undefined, '', {borderStyle:"none"});
                win.panels[pI].menu[mI].valtgr2.var1 = win.panels[pI].menu[mI].var1 // because doPreview uses parent.var1
                win.panels[pI].menu[mI].var1.size = [30 , height5]
                win.panels[pI].menu[mI].var1.alignment = 'top'
                
                for (var j = 0 ; j < 3; j++)
                    if (currMenu.itemValue[j] < 0 )
                        currMenu.itemValue[j] = 0;
                    else if (currMenu.itemValue[j] > 1)
                        currMenu.itemValue[j] = 1;
                var hex = Number(Math.floor(currMenu.itemValue[0] * 255 + 0.5) * 0x10000 + 
                                             Math.floor(currMenu.itemValue[1] * 255 + 0.5) * 0x100 + 
                                             Math.floor(currMenu.itemValue[2] * 255 + 0.5) ).toString(16)
                hex = "0x000000".substr(0, 8 - hex.length) + hex
                win.panels[pI].menu[mI].var1.value = hex
                win.panels[pI].menu[mI].var1.oldValue=hex
 
                win.panels[pI].menu[mI].var1.onDraw = drawRGBSwatch;
                win.panels[pI].menu[mI].var1.onClick = clickRGBSwatch;
              
                initializeDrawingState (win.panels[pI].menu[mI].var1, currMenu.itemValue)
                
             }
            else if (currMenu.itemType == 'dropdownlist')
            {
                // dropdownlist
                col2width = currPanel.panelWidth -  currPanel.leftColumnWidth - 20;
				win.panels[pI].menu[mI].margins = [0,0,15,0];
                win.panels[pI].menu[mI].var1 = win.panels[pI].menu[mI].add(currMenu.itemType, undefined) //, currMenu.itemList);
                for (var ii = 0; ii < currMenu.itemList.length; ii++)
                {
                    if (typeof currMenu.itemList[ii] == 'object')
                    {
                        if (typeof currMenu.itemList[ii].item == 'string')
                        {
                            var item = win.panels[pI].menu[mI].var1.add ('item', currMenu.itemList[ii].item)
                            if (typeof currMenu.itemList[ii].image == 'string')
                                item.image = scriptPathLocal + '/' + currMenu.itemList[ii].image    // add icon image to the menu item
                        }
                    }
                    else
                    {
                        win.panels[pI].menu[mI].var1.add ('item', currMenu.itemList[ii])
                    }
                 }
                    
                win.panels[pI].menu[mI].var1.size = [currMenu.dropdownlistWidth + 15, height5]
                win.panels[pI].menu[mI].var1.alignment = 'right'
                win.panels[pI].menu[mI].var1.disableItems = (typeof currMenu.disableItems != 'undefined') ? currMenu.disableItems : 0
                    
           }
           else
                alert (localize( "$$$/DecoScripts/DecoMenu/UnregognizedType=Unrecognized menu item type ") + currMenu.itemType)
           // else print some error
           
            if (currMenu.itemType == 'dropdownlist')
            {
                win.panels[pI].menu[mI].var1.oldValue=currMenu.itemValue
                win.panels[pI].menu[mI].var1.selection=currMenu.itemValue
                win.panels[pI].menu[mI].var1.onChange = function()
                {
                     this.value= this.selection
                  
                    if (!this.enabled) // disable other elements only if this element is enable
                        return;
 
                    updateDisableElements (this, 0, true /* item itself is enabled */)
 
                    if (isPreview)
                    {
                        if (this.value != this.oldValue)
                        {
                            setPresetList (1)
                             doPreview (this.parent)
                         }
                    }
                }
             } 
 
             if (currMenu.itemUnit)
             {
                    win.panels[pI].menu[mI].utgr = win.panels[pI].menu[mI].add('group', undefined)
                    win.panels[pI].menu[mI].utgr.size = [currPanel.panelWidth - (currPanel.leftColumnWidth + currPanel.editTextWidth + 12) , 22]
                    win.panels[pI].menu[mI].utgr.alignChildren = ['left','top'];  
					win.panels[pI].menu[mI].utgr.margins = [0,3,0,0]; 
                    win.panels[pI].menu[mI].utgr.alignment = ['right','top'];  
                    //win.panels[pI].menu[mI].gr1b.orientation = 'stack' 
                    
                    win.panels[pI].menu[mI].ut = win.panels[pI].menu[mI].utgr.add('statictext', undefined, currMenu.itemUnit);
                    //win.panels[pI].menu[mI].ut.bounds = [currPanel.leftColumnWidth + col2width, 7, currPanel.leftColumnWidth + col2width + 55, 27]
                    win.panels[pI].menu[mI].ut.alignment = 'right'
					win.panels[pI].menu[mI].ut.size = [currPanel.panelWidth - (currPanel.leftColumnWidth + currPanel.editTextWidth + 12) , 20]
              }

             if (currMenu.itemType == 'slider')
             {
                    //win.panels[pI].menu[mI].st2 = win.panels[pI].menu[mI].add('statictext', [currPanel.leftColumnWidth, 15, currPanel.leftColumnWidth + 40, 35] , currMenu.itemMin);
                    //win.panels[pI].menu[mI].st2.alignment='center';
                    //win.panels[pI].menu[mI].st3 = win.panels[pI].menu[mI].add('statictext', [currPanel.leftColumnWidth + col2width - 10, 15, currPanel.leftColumnWidth + col2width + 30, 35], currMenu.itemMax);
                   
                    //col2width += 30
                   
                    // edit text
                    win.panels[pI].menu[mI].valtgr = win.panels[pI].menu[mI].add('group', undefined)
                    win.panels[pI].menu[mI].valtgr.size = [currPanel.panelWidth - (currPanel.leftColumnWidth) - 7 , 26]
                    win.panels[pI].menu[mI].valtgr.alignChildren = ['left', 'bottom'];  
                    win.panels[pI].menu[mI].valtgr.alignment = ['right', 'top']; 
					win.panels[pI].menu[mI].valtgr.margins = [0,0,0,0];
                    win.panels[pI].menu[mI].valt = win.panels[pI].menu[mI].valtgr.add('edittext', undefined, replaceDecimalPt(currMenu.itemValue, '.', decimalPt));
                    win.panels[pI].menu[mI].valt.size = [currPanel.editTextWidth , 22]
                    //win.panels[pI].menu[mI].valt.alignment = 'top';
                   
                    win.panels[pI].menu[mI].slidergr = win.panels[pI].menu[mI].add('group', undefined)
                    win.panels[pI].menu[mI].slidergr.size = [currPanel.panelWidth - 20 , 14]
                    win.panels[pI].menu[mI].slidergr.alignChildren = ['center','bottom'];  
                    win.panels[pI].menu[mI].slidergr.alignment = 'bottom';
					win.panels[pI].menu[mI].slidergr.margins = [0,0,0,10];
                    win.panels[pI].menu[mI].var1 = win.panels[pI].menu[mI].slidergr.add(currMenu.itemType, undefined, replaceDecimalPt(currMenu.itemValue, '.', '.')) // don't replace the decimal point for value in the slider
                    win.panels[pI].menu[mI].var1.margins = [0,0,0,0];
                    win.panels[pI].menu[mI].var1.size = [currPanel.panelWidth-20, 12]; // higher Y size will move the slider closer to the edt text above it 
                    win.panels[pI].menu[mI].var1.valt = win.panels[pI].menu[mI].valt;
                    
                    win.panels[pI].menu[mI].var1.minvalue = currMenu.itemMin;
                    win.panels[pI].menu[mI].var1.maxvalue = currMenu.itemMax;
                    win.panels[pI].menu[mI].var1.valStep = currMenu.itemStep ? currMenu.itemStep : 1;
                    win.panels[pI].menu[mI].var1.oldValue=win.panels[pI].menu[mI].var1.value;
               
                    win.panels[pI].menu[mI].valt.onChange = function()
                    {
                        var var1 = this.parent.parent.var1
                        win.paramsOK = true
                       if (isNaN(replaceDecimalPt(this.text, decimalPt, '.')))
                        {
                            alert (localize("$$$/DecoScripts/DecoMenu/InvalidValue1=Invalid value, a value between ") + 
                                      replaceDecimalPt(var1.minvalue, '.', decimalPt) + localize("$$$/DecoScripts/DecoMenu/InvalidValue2= and ") + 
                                      replaceDecimalPt(var1.maxvalue, '.', decimalPt) + localize("$$$/DecoScripts/DecoMenu/InvalidValue3= is required."))
                            this.text = Math.round (var1.value / var1.valStep) *var1.valStep // set back to the original value
                            win.paramsOK = false
                            return
                        }
 
                        var value = replaceDecimalPt(this.text, decimalPt, '.') // assign to value first becuase if you assign to var1.value it will get clamped automatically
                         // no need to test min max, that happens automatically when var1.value is assigned a number out of range
                        if (value < var1.minvalue)
                        {
                            alert (localize("$$$/DecoScripts/DecoMenu/InvalidValue1=Invalid value, a value between ") + 
                                      replaceDecimalPt(var1.minvalue, '.', decimalPt) + localize("$$$/DecoScripts/DecoMenu/InvalidValue2= and ") + 
                                      replaceDecimalPt(var1.maxvalue, '.', decimalPt) + localize("$$$/DecoScripts/DecoMenu/InvalidValue3= is required."))
                            value = var1.minvalue
                            win.paramsOK = false
                        }
                        if (value > var1.maxvalue)
                        {
                            alert (localize("$$$/DecoScripts/DecoMenu/InvalidValue1=Invalid value, a value between ") + 
                                      replaceDecimalPt(var1.minvalue, '.', decimalPt) + localize("$$$/DecoScripts/DecoMenu/InvalidValue2= and ") + 
                                      replaceDecimalPt(var1.maxvalue, '.', decimalPt) + localize("$$$/DecoScripts/DecoMenu/InvalidValue3= is required."))
                            value = var1.maxvalue
                            win.paramsOK = false
                         }
                        var1.value = value
                        var1.value = Math.round (var1.value / var1.valStep) *var1.valStep;
                        this.text =  replaceDecimalPt(var1.value, '.', decimalPt) // update in the text edit box if the value changed - use original decimal point
 
                        // If our item should be less or equal to a linked item (if there is one), and the linked value is in fact lower, change it
                        if (var1.itemLEQitem >= 0 && var1.parent.parent.menu [var1.itemLEQitem].var1.value < var1.value)
                        {
                            var1.parent.parent.menu [var1.itemLEQitem].var1.value = var1.value
                            var1.parent.parent.menu [var1.itemLEQitem].var1.valt.text = replaceDecimalPt(var1.value, '.', decimalPt)
                        }
                        // If our item should be greater or equal to a linked item (if there is one), and the linked value is in fact greater, change it
                        if (var1.itemGEQitem >= 0 && var1.parent.parent.menu [var1.itemGEQitem].var1.value > var1.value)
                        {
                            var1.parent.parent.menu [var1.itemGEQitem].var1.value = var1.value
                            var1.parent.parent.menu [var1.itemGEQitem].var1.valt.text = replaceDecimalPt(var1.value, '.', decimalPt)
                        }
                       
                        if (var1.value != var1.oldValue)
                        {
                           setPresetList (1)
                            doPreview (this.parent.parent)
                        }
                    }

                   //col2width += 40
                   win.panels[pI].menu[mI].var1.onChanging = function()
                   {
                        this.value = Math.round (this.value / this.valStep) * this.valStep;
                        this.valt.text = replaceDecimalPt(this.value, '.', decimalPt)
                        if (dvar.presetsDbx.selection2 != 1)
                        {
                           setPresetList (1)
                        }
                    
                        //return;
                        // If our item should be less or equal to a linked item (if there is one), and the linked value is in fact lower, change it
                        if (this.parent.var1.itemLEQitem >= 0 && this.parent.parent.menu [this.parent.var1.itemLEQitem].var1.value < this.parent.var1.value)
                        {
                            this.parent.parent.menu [this.parent.var1.itemLEQitem].var1.value = this.parent.var1.value
                            this.parent.parent.menu [this.parent.var1.itemLEQitem].var1.valt.text =replaceDecimalPt(this.parent.var1.value, '.', decimalPt)
                        }
                        // If our item should be greater or equal to a linked item (if there is one), and the linked value is in fact greater, change it
                        if (this.parent.var1.itemGEQitem >= 0 && this.parent.parent.menu [this.parent.var1.itemGEQitem].var1.value > this.parent.var1.value)
                        {
                            this.parent.parent.menu [this.parent.var1.itemGEQitem].var1.value = this.parent.var1.value
                            this.parent.parent.menu [this.parent.var1.itemGEQitem].var1.valt.text = replaceDecimalPt(this.parent.var1.value, '.', decimalPt)
                        }
                        //alert ("slider changed, old = " + this.parent.var1.oldValue + ", new = " + this.parent.var1.value)
                        // Extendscript is not fast enough for true live preview while the slider is being modified
                        //if (isPreview)
                        //    if (typeof this.parent.var1.oldValue == 'undefined' || Math.abs(this.parent.var1.value - this.parent.var1.oldValue) >= this.parent.var1.valStep)
                        //    {
                                //alert('Slider changed, new value is ' + this.parent.var1.value)
                                //win.g100.bu1.onClick();  // this sets output text
                        //        doPreview (this.parent)
                        //    }
                        //alert ("done")
                        // update the mage
                    }
                   win.panels[pI].menu[mI].var1.onChange = function()
                   {
                        this.value = Math.round (this.value / this.valStep) * this.valStep;
                        this.valt.text = replaceDecimalPt(this.value, '.', decimalPt)
                        
                        var key = ScriptUI.environment.keyboardState.keyName;
                        if (key == "Right" || key == "Left")
                        {
                            // If we call onChanging() here, we don't know which is the last onChange call with a key press and when  to call doPreview
                            // Besically, we need to get key up event somehow
                            //this.onChanging()
                            this.value = this.oldValue // for now arrows cannot move slider left or right
                        }
                        else
                            if (isPreview && this.value != this.oldValue)
                                doPreview (this.parent.parent)
                   }
               
                    // set linked items if there are any
                    win.panels[pI].menu[mI].var1.itemLEQitem = typeof currMenu.itemLEQitem != 'undefined' ? currMenu.itemLEQitem : -1;
                    win.panels[pI].menu[mI].var1.itemGEQitem = typeof currMenu.itemGEQitem != 'undefined' ? currMenu.itemGEQitem : -1;                      
            }
        
             // name the variable so that it gets picked up by the xml parser
             win.panels[pI].menu[mI].var1.name = 'var' + mI
             win.panels[pI].menu[mI].var1.fullname = currMenu.itemName
             
             win.panels[pI].menu[mI].var1.decoVarName = currMenu.varName
             //win.panels[pI].menu[mI].var1.oldValue = currMenu.itemValue
            win.panels[pI].menu[mI].var1.pI = pI      
            win.panels[pI].menu[mI].var1.mI = mI  
            win.panels[pI].menu[mI].var1.disabledElements = new Array(0) 
            
            if ((typeof currMenu.enabled != 'undefined') && !currMenu.enabled)
                enableMenuItem(pI, mI, false, 0)
        
           }
            
            if (0)
            {
                // get the real height
                var group = win.tabs[pI];
                group.layout.layout(false)
                var height = 60 + group.preferredSize[1]
                alert("height2 = " + height)
            }
   }
  

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
              
        //win.presetPn.setBtn = win.presetPn.add('button',undefined, localize( "$$$/DecoScripts/DecoMenu/ApplyPreset=Apply Preset"));
        //win.presetPn.saveBtn = win.presetPn.add('button',undefined,localize( "$$$/DecoScripts/DecoMenu/SavePreset=Save Preset"));
        //win.presetPn.deleteBtn = win.presetPn.add('button',undefined,localize( "$$$/DecoScripts/DecoMenu/DeletePreset=Delete Preset"));
        
 
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    presetsXML = new Array()
    
    allPresetsXML = readXMLFiles()  // see if any preset file(s) exists and load it/them.
    
    // Find presets for our menu
    for (var i = 0; i < allPresetsXML.length; i++)
       try{
            // compare the script name as a sanity check
            var xml = allPresetsXML[i] 
            if (xml != 'null' && xml != '') 
            {
                // check if there is a preset present
                var preset = xml.child ('preset')
                if (preset != 'null' && preset != '')
                {
                    if (preset.@presetName == 'Default') //XXX should we localize the strings inside the preset file?
                        defaultXML = xml
                    else if (preset.@presetName == 'Custom')
                        customXML = xml
                    else
                        presetsXML.push(xml) // all non-default and non-current presets
                }
            }
  
         }
        //catch assigns 'no_good' to current XMLVal so that if there is no value in the XML file, it will not try to assign a bad value to the UI controls.
        catch(e) { } //end catch
    
    if (!defaultXML)
    {
        // First time using this menu 
         defaultXML = new XML('<script><preset presetName ="Default"/></script>')
        // Store the default values
       setXML (defaultXML, win, 0)
    }
     if (!customXML)
    {
        // we store selected preset here as well
        customXML = new XML('<script><presets selection="1"/><preset presetName ="Custom"/></script>')
        // Store the default values
       setXML (customXML, win, 0)
    }
    lastUsedXML = clone(customXML)

    var selection = customXML.presets.@selection ? Number(customXML.presets.@selection) : 1
    if (selection < 0 || selection >= 2 + presetsXML.length)
        selection = 0;

    if (forceUsingModelParameters)
        selection = 1
        
    setPresetList (selection) 

    if (!forceUsingModelParameters)
        setUIvar(selection == 0 ? defaultXML : (selection == 1 ? customXML : presetsXML[selection-2]), win)
    else
        setUIVarString(newModelParameters, win)
        
    if (previewZoom)
    {
       previewParameters.previewScaleFactor = customXML.presets.@previewscale ? Number(customXML.presets.@previewscale) : 1
        if (previewParameters.previewScaleFactor < 0.25)
            previewParameters.previewScaleFactor = 0.25
    }

    if (isPreview)
    {
        if (forceUsingModelParameters)
            previewParameters = newModelParameters
        else
            outputResult('previewParameters.') // update previewParameters
        update(previewParameters)
    }

    // see if the file was created, if not, disable preview
    var file = new File(previewImagePath)
    if (!file.exists)
        isPreview = false;

    if (isPreview)
    {
        //var file = new File(previewImagePath)
        win.previewImage = win.previewPanel.add ('image', [0, 0, previewSize, previewSize], previewImagePath); // it will not scale down the image but crop it
        var myBrush = g.newBrush(g.BrushType.SOLID_COLOR, [1, 1, 1, 1]);
        win.previewImage.backgroundColor = myBrush;
        win.previewImage.enabled = true
        
        if (previewZoom)
        {
            win.previewPanel.var1 = win.previewPanelBase.add('slider',undefined, 1) // name it var1 becuase that is what we expect in doPreview
            //win.previewPanel.var1.name = 'zoom' 
            //win.previewPanel.var1.fullname = 'preview scale factor'
            
            win.previewPanel.var1.enabled = true
            win.previewPanel.var1.margins = [0,0,0,0]
            win.previewPanel.var1.alignment = 'bottom'
            win.previewPanel.var1.size = [200, 17] 
            
            win.previewPanel.var1.minvalue = 0.25
            win.previewPanel.var1.maxvalue = 2
            win.previewPanel.var1.valStep = 0.01
            win.previewPanel.var1.oldValue=win.previewPanel.var1.value

           win.previewPanel.var1.onChanging = function()
           {
                this.value = Math.round (this.value / this.valStep) * this.valStep;
           }
           win.previewPanel.var1.onChange = function()
           {
                var key = ScriptUI.environment.keyboardState.keyName;
                if (key == "Right" || key == "Left")
                {
                    // If we call onChanging() here, we don't know which is the last onChange call with a key press and when  to call doPreview
                    // Besically, we need to get key up event somehow
                    //this.onChanging()
                    this.value = this.oldValue // for now arrows cannot move slider left or right
                }
                else
                   if (isPreview)
                   {
                        if (this.value != this.oldValue)
                        {
                            //alert("zoom set to " + this.value)
                            previewParameters.previewScaleFactor = this.value
                            this.oldValue=this.value
                            doPreview (this.parent)
                       }
                   }
           }
     }
 
       if (!isLivePreview)
        {
            win.previewPanel.updateBtn = win.previewPanelBase.add('button',undefined, localize( "$$$/DecoScripts/DecoMenu/UpdatePreview=Update Preview"))
            win.previewPanel.updateBtn.enabled = false
            win.previewPanel.updateBtn.onClick = function() 
            {
                outputResult('previewParameters.') // update previewParameters
                update(previewParameters)
                win.previewImage.image = previewImagePath; // updates the image
                win.previewImage.enabled = true
                win.previewPanel.updateBtn.enabled = false
            }
        }
     }

    if (previewZoom)
    {
       previewParameters.previewScaleFactor = customXML.presets.@previewscale ? Number(customXML.presets.@previewscale) : 1
        if (previewParameters.previewScaleFactor < 0.25)
            previewParameters.previewScaleFactor = 0.25
        win.previewPanel.var1.value = previewParameters.previewScaleFactor
        win.previewPanel.var1.oldValue=win.previewPanel.var1.value
     }
   
    // call onClick for all checkboxes (to update disableItems, if there are any)
    for (var pI = 0; pI < menu.panels.length; pI++)
    {
        var currPanel = menu.panels[pI]
        for (var mI = 0; mI < currPanel.panelMenu.length; mI++)
             if (currPanel.panelMenu[mI].itemType == 'checkbox')
                    win.panels[pI].menu[mI].var1.onClick() 
            else if (currPanel.panelMenu[mI].itemType == 'dropdownlist')
                    win.panels[pI].menu[mI].var1.onChange() 
     }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////// Buttons
    win.g100 =win.p0.add('group');
    win.g100.orientation = "column";
    win.g100.alignment='top';
    
    var button3_width = 70;
    var textMargin = 5;
    var width = Math.max(  getTextWidth (win.g100,localize( "$$$/DecoScripts/DecoMenu/OK=OK")),
                           getTextWidth (win.g100,localize( "$$$/DecoScripts/DecoMenu/Reset=Reset")));
    width = Math.max(width,getTextWidth (win.g100,localize( "$$$/DecoScripts/DecoMenu/Cancel=Cancel")));
    
    if (width + textMargin > button3_width)
    {
        button3_width = width + textMargin
    }
    
    win.g100.bu1 = win.g100.add('button',undefined,localize( "$$$/DecoScripts/DecoMenu/OK=OK"));
    win.g100.bu1.preferredSize=[button3_width,22];
    
    //win.g100.bu2 = win.g100.add('button',undefined, localize( "$$$/DecoScripts/DecoMenu/Default=Default"));
    //win.g100.bu2.preferredSize=[70,30];
    
    win.g100.bu4 = win.g100.add('button',undefined, localize( "$$$/DecoScripts/DecoMenu/Reset=Reset"));
    win.g100.bu4.preferredSize=[button3_width,22];
 
    win.g100.bu3 = win.g100.add('button',undefined, localize( "$$$/DecoScripts/DecoMenu/Cancel=Cancel"));
    win.g100.bu3.preferredSize=[button3_width,22];
    
    //Control goes here if the pattern was chosen by name and the button to do it was clicked
    win.g100.bu1.onClick=function() 
    {                
        // output the variables 
        if (!win.paramsOK || !outputResult ('modelParameters.'))
        {
            win.paramsOK = true
            return;
        }
 
        setXML (customXML, win, 0)
        //alert ('writing xml' + customXML)
        writeXMLFile (customXML);
        
        skipRun = false
        win.close(0);
        
        RenderAPI.setParameter (kpsParameterString, modelParameters.toSource());
        //app.refresh()
    }       //end of onClick function

    //win.g100.bu2.onClick=function()
    //{
       ///setXML(prefXML,win,0);
       //skipRun = false
       //win.close(0);
    //}

    win.g100.bu4.onClick=function()
    {
        // Reset
        // Load default preset
        customXML = clone(lastUsedXML)

        setPresetList(1)
        menuApplyPreset(customXML)
    }

    win.g100.bu3.onClick=function()
    {
        // Cancel
        //setXML (customXML, win, 0)
        //writeXMLFile (customXML);
        
        skipRun = true
        win.close(0)
        Engine.setParameter(kCancelled, 1)
    }

     function onKeyDown (event)
    {
        //alert('onKeyDown')
    }
    //win.addEventListener('mouseover', onKeyDown)
    //win.addEventListener('mousedown', onKeyDown, false)
    win.addEventListener('enterKey', onKeyDown, false)

   win.center();
    win.show();
}


	/*
		The RGB swatch is implemented as a Group element with a Button that completely fills it. We use
		a Group because a Group's graphics.backgroundColor can be set, so we set it to the currently
		selected RGB color. We put a Button inside this Group to demonstrate making the swatch 'active',
		and to show a technique for making the Button be essentially transparent, by defining an onDraw
		handler for it that does not draw the 'background' of the button, but only its borders.
		We initialize the 'static' drawing state of the "rgb swatch" button as follows:
		<ul>
		<li>the 'border' paths are constant, so create them now rather than each time we draw the swatch
		<li>likewise, the pens for the borders are constant colors, so create them only once
		</ul>
	*/
    
	function initializeDrawingState (swatchBtn, color)
	{
		var gfx = swatchBtn.graphics;
		var btnW = swatchBtn.size.width;
		var btnH = swatchBtn.size.height;
 
		//	Define the top-left and bottom-right border paths
		var halfBorderW = kSwatchBorderWidth / 2;   
        
         gfx.newPath();
		gfx.rectPath(halfBorderW, halfBorderW, btnW - kSwatchBorderWidth, btnH - kSwatchBorderWidth);
         swatchBtn.brRectPath = gfx.currentPath;
               
         gfx.new
		//	Define the border pens: use semi-transparent pens so the background color shows through
		swatchBtn.shadowPen = gfx.newPen (gfx.PenType.SOLID_COLOR, [.25, .25, .25, .4], kSwatchBorderWidth);
         if (swatchBtn.enabled)
            swatchBtn.backgroundColor = gfx.newBrush (gfx.PenType.SOLID_COLOR, [color[0], color[1], color[2], 1]);
         else
            swatchBtn.backgroundColor = gfx.newBrush (gfx.PenType.SOLID_COLOR, [0xe0 / 255, 0xe0 / 255, 0xe0 / 255, 1]);
 	}

	/*
		This is the "onDraw" event handler function for the rgb swatch Button. Because this function is
		called each time this Button is drawn, we want it to execute as fast as possible, so as
		much of the drawing state as possible is derived 'outside' this function.
	*/
	function drawRGBSwatch (drawingStateObj)
	{
		var gfx = this.graphics;
		try {
			//Don't draw button background - let our container's BG color show through. Just draw the border,
			//based on mouse state: first draw 'under' the border with the solid BG color from our container,
			//then draw over top of this using the semi-transparent border highlight and shadow.
			//gfx.strokePath (this.bgPen, this.tlBorderPath);
			//gfx.strokePath (this.bgPen, this.brBorderPath);
			gfx.strokePath (this.shadowPen, this.brRectPath);
             //alert ('draw swatch ' + this.backgroundColor.color);
			gfx.fillPath (this.backgroundColor, this.brRectPath);
			//if (drawingStateObj.leftButtonPressed) {
			//	gfx.strokePath (this.shadowPen, this.tlBorderPath);
			//	gfx.strokePath (this.highlightPen, this.brBorderPath);
			//}
			//else {
			//	gfx.strokePath (this.highlightPen, this.tlBorderPath);
			//	gfx.strokePath (this.shadowPen, this.brBorderPath);
			//}
		}
		catch (e) {
			//	On any error, undefine the onDraw handler, so we don't get here again
			this.onDraw = undefined;
			//alert ("drawRGBSwatch handler failed.\n" + e);
		}
	}
  
	//	This is the "onClick" event handler for the rgb swatch button
	function clickRGBSwatch ()
	{
        var hex = Number(this.value).toString(16)
        hex = "0x000000".substr(0, 8 - hex.length) + hex
        var rgb = $.colorPicker(hex)
        if (rgb < 0)
            return;
        hex = Number(rgb).toString(16)
        hex = "0x000000".substr(0, 8 - hex.length) + hex
        this.value = hex
        
        setSwatchColor(this, hex)
        //alert ("Selected RGB color:  " + hex);
        
        //alert('old ' + this.oldValue + " new " + this.value)
        if (isPreview)
            if (this.value != this.oldValue)
            {
               setPresetList (1)
                doPreview (this.parent)
            }
 	}
    
      function setSwatchColor(button, hex)
      {
        var number = parseInt(hex, 16) // convert hex string to int
        var red = Math.floor(number / 0x10000)
        number -= red * 0x10000 
        var green = Math.floor( number / 0x100) 
        var blue = (number - green * 0x100 )
                
        var swatchGfx = button.graphics;
        //alert(this.backgroundColor.color)
        button.backgroundColor =
            swatchGfx.newBrush (swatchGfx.BrushType.SOLID_COLOR, [red/ 255, green/ 255, blue/ 255]);
        button.notify("onDraw")
      }


function removeSpaces(inputStr)
{
        var outputStr = ''
        for (var i = 0; i < inputStr.length; i++)
            if (inputStr[i] == ' ')
                outputStr += '_'
            else
                outputStr += inputStr[i]
        return outputStr
}

/////////////////////////////////////////////////////////////////////////
// The following code has been originaly written by Chuck Uebele
/////////////////////////////////////////////////////////////////////////
//functions for saving prefs



function removePercent20 (name)
{
    // remove %20 from the name
    var newName = ""
    var lastIndex = 0
    name = name.toString()
    for (var i = 0; i < name.length-2; i++)
    {
         if (name[i] == '%')
            if (name[i+1] == '2' && name[i+2] == '0')
            {
                newName += name.slice(lastIndex, i) + " "
                lastIndex = i+3
             }
     }

    if (lastIndex < name.length)
        newName += name.slice (lastIndex, name.length)
    return newName
}


function setPresetList(selection)
{
    // selection is 0 for default, 1 for custom, and 2 - 1+presets.length for user presets
        dvar.presetsDbx.insideSetPresetList = true
        presetList = new Array();
        dvar.presetsDbx.removeAll();
        
        // the first item always stores the active preset
        if (selection == 0) // Default
        {
            dvar.presetsDbx.add('item', localize("$$$/DecoScripts/ScriptMenu/Preset=Preset: ") + localize("$$$/DecoScripts/ScriptMenu/Default=Default"))
        }
        else if (selection == 1) // Custom
        {
            dvar.presetsDbx.add('item', localize("$$$/DecoScripts/ScriptMenu/Preset=Preset: ") + localize("$$$/DecoScripts/ScriptMenu/Custom=Custom"))
        }
        else if (selection >= 2 && selection < 2 + presetsXML.length)
        {
             dvar.presetsDbx.add('item', localize("$$$/DecoScripts/ScriptMenu/Preset=Preset: ") + File.decode (presetsXML[selection-2].preset.@presetName))
        }
        dvar.presetsDbx.add('item', localize("$$$/DecoScripts/ScriptMenu/Default=Default"))
        dvar.presetsDbx.add('separator', "-")
        if (presetsXML.length > 0)
        {
           for(var i=0; i<presetsXML.length; i++) { dvar.presetsDbx.add('item', File.decode (presetsXML[i].preset.@presetName)) }
           dvar.presetsDbx.add('separator', "-")
        }
        dvar.presetsDbx.add('item', localize("$$$/DecoScripts/ScriptMenu/LoadPreset=Load Preset..."))
        dvar.presetsDbx.add('item', localize("$$$/DecoScripts/ScriptMenu/SavePreset=Save Preset..."))
        dvar.presetsDbx.add('item', localize("$$$/DecoScripts/ScriptMenu/DeletePreset=Delete Preset..."))
        dvar.presetsDbx.items[dvar.presetsDbx.items.length - 1].enabled = selection >= 2;
        dvar.presetsDbx.add('separator', "-")
        dvar.presetsDbx.add('item', localize("$$$/DecoScripts/ScriptMenu/Custom=Custom"))
        
        dvar.presetsDbx.selection = 0 //selection == 1 ? 3 + presetsXML.length + 5 :  selection == 0 ? 0 : 2 + selection; // will call onChanging for selection
        dvar.presetsDbx.selection2 = selection
        dvar.presetsDbx.insideSetPresetList = false
} //end function setPresetList


 function setXML(x,d,level)
 {//x = xml file, d = dialog.
     //alert ("setXML called, d.children.length = " + d.children.length);
    //if (x.presets.child(n))
    //   x.presets.child(n).setChildren('')
    
    // Delete the preset
    if (level == 0 && x.preset.children().length() > 0)
    {
        //var children =  x.presets.children();
        //var tempXML = new XML('<preset presetName ="' + saveName + '"/>');
        for (var i = x.preset.children().length() - 1; i >= 0; i--)
            delete x.preset.children()[0];
    }
        
    for (var i = 0; i<d.children.length; i++)
    {
       if(d.children[i].type == 'panel' || d.children[i].type == 'group' || d.children[i].type == 'tabbedpanel' || d.children[i].type == 'tab')
       {
           //loops though UI and restarts function if it comes to a container that might have more children
           setXML(x,d.children[i],level+1)
        }
        else{
            if(d.children[i].name){//check to make sure the control has a name assigned so that it only records those with name.
                switch(d.children[i].type){
                    case 'radiobutton':
                        x.preset.appendChild(XML('<' + d.children[i].name + ' name="' + d.children[i].fullname + '" type="' + d.children[i].type + '">' + d.children[i].value + '</' + d.children[i].name + '>'));                        
                        break;
                    case 'checkbox':
                        x.preset.appendChild(XML('<' + d.children[i].name +' name="' + d.children[i].fullname + '" type="' + d.children[i].type + '">' + d.children[i].value + '</' + d.children[i].name + '>'));                        
                        break;
                    case 'slider':
                        x.preset.appendChild(XML('<' + d.children[i].name +' name="' + d.children[i].fullname + '" type="' + d.children[i].type + '">' + Math.round (d.children[i].value / d.children[i].valStep) * d.children[i].valStep + '</' + d.children[i].name + '>'));                        
                        break;
                    case 'edittext':
                        x.preset.appendChild(XML('<' + d.children[i].name +' name="' + d.children[i].fullname + '" type="' + d.children[i].type + '"><![CDATA[' + d.children[i].text + ']]\></' + d.children[i].name + '>'));                        
                        break;
                    case 'button':
                        x.preset.appendChild(XML('<' + d.children[i].name +' name="' + d.children[i].fullname + '" type="colorpicker"><![CDATA[' + d.children[i].value + ']]\></' + d.children[i].name + '>'));                        
                        break;
                   case 'dropdownlist':
                        if(d.children[i].selection){varHold = d.children[i].selection.text}
                        else{varHold = 'null'};
                        x.preset.appendChild(XML('<' + d.children[i].name +' name="' + d.children[i].fullname + '" selecIndex="' + d.children[i].selection + '" type="' + d.children[i].type + '"><![CDATA[' + varHold + ']]\></' + d.children[i].name + '>'));                        
                        break;
                  }//end switch
               }//end if for child having name
            }//end else
        }//end for loop
}//end function setXML


function setUIVarString (x, d)
{
    //x=object with parameters; d = UI dialog
    var currentVal;//used to store values from XML file.  When this value is assigned, it checks to see if value from XML exist
    var noMatch = false
    
    if (d == win)
        inSetUIvar = true
    
    //if (d == win)
    //    alert('Setting values to ' + x)

    for(var i = 0; i<d.children.length; i++)
    {
        noMatch = false;
        if(d.children[i].type == 'panel' || d.children[i].type == 'group' || d.children[i].type == 'tab' || d.children[i].type == 'tabbedpanel') { setUIVarString(x,d.children[i]) };//reruns function if child is container and not control item.	
        else
        {
            if(d.children[i].decoVarName)
            {
                currentVal = x[d.children[i].decoVarName]
                
                switch(d.children[i].type)
                {
                    case 'radiobutton':
                    case 'checkbox':
                        d.children[i].value = currentVal
                        d.children[i].oldValue = d.children[i].value
                        break;
                    case 'edittext':
                        d.children[i].text = currentVal
                        break;
                        
                    case 'button':
                        if (d.children[i].text == 'colorpicker') // colorpicker
                        {
                            var hex = Number(Math.floor(currentVal[0] * 255 + 0.5) * 0x10000 + 
                                                         Math.floor(currentVal[1] * 255 + 0.5) * 0x100 + 
                                                         Math.floor(currentVal[2] * 255 + 0.5) ).toString(16)
                            hex = "0x000000".substr(0, 8 - hex.length) + hex
                            d.children[i].value = hex
                            d.children[i].oldValue = d.children[i].value
                            var number = parseInt(d.children[i].value, 16) // convert hex string to int
                            var red = Math.floor(number / 0x10000)
                            number -= red * 0x10000 
                            var green = Math.floor( number / 0x100) 
                            var blue = (number - green * 0x100 )
                                    
                            var swatchGfx = d.children[i].graphics;
                            if (d.children[i].enabled)
                                d.children[i].backgroundColor = swatchGfx.newBrush (swatchGfx.PenType.SOLID_COLOR,  [red/ 255, green/ 255, blue/ 255]);
                             else
                                d.children[i].backgroundColor = swatchGfx.newBrush (swatchGfx.PenType.SOLID_COLOR, [0xe0 / 255, 0xe0 / 255, 0xe0 / 255]);
                            d.children[i].notify("onDraw")
                    }
                    break;
                    
               case 'slider':
                    d.children[i].value = currentVal
                    if (typeof d.children[i].valt != 'undefined')
                        d.children[i].valt.text = replaceDecimalPt(d.children[i].value, '.', decimalPt);
                    d.children[i].oldValue = d.children[i].value
                   break;
                   
                case 'dropdownlist':
                    d.children[i].selection = currentVal
                    d.children[i].oldValue = d.children[i].selection
                    break;
                  };//end switch else             
                };//end if for UI control having name
            };//end else for if child is container or control
        };//end for loop
    
    if (d == win)
        inSetUIvar = false
}


function setUIvar(x,d)
{  //x= xml file; d = UI dialog

    var currentXMLVal;//used to store values from XML file.  When this value is assigned, it checks to see if value from XML exist
    var noMatch = false
    
    if (d == win)
        inSetUIvar = true
    
    //if (d == win)
    //    alert('Setting values to ' + x)

    for(var i = 0; i<d.children.length; i++)
    {
        noMatch = false;
        if(d.children[i].type == 'panel' || d.children[i].type == 'group' || d.children[i].type == 'tab' || d.children[i].type == 'tabbedpanel') { setUIvar(x,d.children[i]) };//reruns function if child is container and not control item.	
        else
        {
            if(d.children[i].name)
            {
                //Checks to see if child has a name assigned so only will reset those control items that have a name will be stored.
                var goodXML = false;
                try
                {
                        currentXMLVal = x.preset.child(d.children[i].name);
                        if (currentXMLVal.@name != d.children[i].fullname)
                        {
                            // find among other children
                            for (var j = 0; j < x.preset.children().length(); j++)
                            {
                                //alert('child['+ j + '] = ' + x.preset.children()[j].@name)
                                if (x.preset.children()[j].@name == d.children[i].fullname)
                                    currentXMLVal = x.preset.children()[j]
                             }
                        }
                        if (currentXMLVal.@name == d.children[i].fullname) // test again in case we searched for it in the loop above
                        {
                            //alert('value for ' + d.children[i].name + ' is:' + currentXMLVal)
                            goodXML = true
                         }
                     }//end try
                //catch assigns 'no_good' to current XMLVal so that if there is no value in the XML file, it will not try to assign a bad value to the UI controls.
                catch(e) {}; //end catch
                //switch makes sure proper type of value is reassigned back to UI controls.
                if (goodXML && (currentXMLVal.length() > 0 || d.children[i].type == 'button' ))
                {
                    switch(d.children[i].type)
                    {
                        case 'radiobutton':
                            d.children[i].value = returnBoolean(currentXMLVal);
                            d.children[i].oldValue = d.children[i].value
                            break;
                         case 'checkbox':
                            d.children[i].value = returnBoolean(currentXMLVal);
                            d.children[i].oldValue = d.children[i].value
                            break;
                        case 'edittext':
                            d.children[i].text = new String(currentXMLVal); // clone the string since we are deleting the xml in setUIvars
                            break;
                        case 'button':
                            if (d.children[i].text == 'colorpicker') // colorpicker
                            {
                                //alert('xml value:' + currentXMLVal)
                                d.children[i].value = currentXMLVal != '' ? new String(currentXMLVal) : '0x000000'; // clone the string since we are deleting the xml in setUIvars
                                d.children[i].oldValue = d.children[i].value
                                var number = parseInt(d.children[i].value, 16) // convert hex string to int
                                var red = Math.floor(number / 0x10000)
                                number -= red * 0x10000 
                                var green = Math.floor( number / 0x100) 
                                var blue = (number - green * 0x100 )
                                        
                                var swatchGfx = d.children[i].graphics;
                                if (d.children[i].enabled)
                                    d.children[i].backgroundColor = swatchGfx.newBrush (swatchGfx.PenType.SOLID_COLOR,  [red/ 255, green/ 255, blue/ 255]);
                                 else
                                    d.children[i].backgroundColor = swatchGfx.newBrush (swatchGfx.PenType.SOLID_COLOR, [0xe0 / 255, 0xe0 / 255, 0xe0 / 255]);
                                d.children[i].notify("onDraw")
                        }
                            break;
                       case 'slider':
                            d.children[i].value = parseFloat(currentXMLVal);
                            if (typeof d.children[i].valt != 'undefined')
                                d.children[i].valt.text = replaceDecimalPt(d.children[i].value, '.', decimalPt);
                            d.children[i].oldValue = d.children[i].value
                           break;
                        case 'dropdownlist':
                            varHold = false;
 
                            if(currentXMLVal.@selecIndex.toString() == 'null'){d.children[i].selection = null}
                            else{d.children[i].selection = parseInt(currentXMLVal.@selecIndex)};
                            d.children[i].oldValue = d.children[i].selection
                            break;
                          };//end switch else

                   };//end if to see if there is a good value from the XML
               
                };//end if for UI control having name
            };//end else for if child is container or control
        };//end for loop
    
    if (d == win)
        inSetUIvar = false

 };//end function setUIvar
 
 //function returns a boolean value
function returnBoolean(b){
	if(b == 'true'){return true}
	else{return false}
	};

//===============READ/WRITE XML functions========================================
//=========================================================================
 function readXMLFiles() 
 {
     // read all xml files in the decoPresetsFolder directory into one string
     folder = new Folder (decoPresetsFolder)
     xmlFiles = folder.getFiles('*.xml')
     
     var parsedXMLs = new Array(0)
     for (var i = 0; i < xmlFiles.length; i++)
     {
         //alert('Opening file: ' + xmlFiles[i])
         file = new File(xmlFiles[i] )
         parsedXMLs.push (readFile(file))
    }

    return parsedXMLs
}


function readFile(file)
{
    if (!file.exists)
    {
        alert( localize("$$$/DecoScripts/ScriptMenu/CannotFindFile=Cannot find file: ") + decodeURI(file.absoluteURI));
    }
    else
    {
        file.encoding = "UTF8";
        file.lineFeed = "unix";
        file.open("r", "TEXT", "????");
        var str = file.read();
        file.close();
        return new XML(str)
    }
}

function writeXMLFile (xml)
{
	if (!(xml instanceof XML))
    {
		alert( localize("$$$/DecoScripts/ScriptMenu/BadXMLonWrite=Cannot save preset file - bad XML"))
	}
	else
    {
         // add selection
         if (xml == customXML)
         {
            xml.presets.@selection = "" + dvar.presetsDbx.selection2
         
            // add preview scale
            if (previewZoom)
                xml.presets.@previewscale = "" + previewParameters.previewScaleFactor
        }
         
         var fileName = decoPresetsFolder + '/' + xml.preset.@presetName + '.xml'
         var file = new File(fileName)
         //alert ('Saving file ' + fileName);
         
         writeFile(file,xml)
         
         // workaround for mac, remove file without extension
         var extraFile = decoPresetsFolder + '/' + xml.preset.@presetName
         file = new File(extraFile)
         if (file.exists)
            file.remove()
	}
}

function deleteXMLFile (xml)
{
	if (!(xml instanceof XML))
    {
		alert( localize("$$$/DecoScripts/ScriptMenu/BadXMLonDelete=Cannot delete preset file - bad XML"))
	}
	else
    {         
         var fileName = decoPresetsFolder + '/' + xml.preset.@presetName + '.xml'
         var file = new File(fileName)
         //alert ('Deleting file ' + fileName);
         file.remove()
	}
}

function writeFile(file, xml)
{
    file.encoding = "UTF8";
    file.open("w", "????TEXT", "MPS_");  // MPS_ is for XML on Mac, ignored on windows
    //unicode signature, this is UTF16 but will convert to UTF8 "EF BB BF"
    file.write("\uFEFF");
    file.lineFeed = "unix";
    file.write(xml.toXMLString());
    file.close();
}


previewAPI.command (kpsThawProgress) // thaw the progress bar

if (typeof skipRun == 'undefined' || !skipRun)  // satrt watch cursor unles we exited the preview window without pressing a button
    previewAPI.command (kpsStartWatchCursor)

 
