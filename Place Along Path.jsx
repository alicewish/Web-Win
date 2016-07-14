//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Here are a few parameters that you can change to modify the behavior of the patterm
// Feel free to modify the values, don't change the variable names

modelParameters = {
    // scaling of the input pattern
    patternScale : 1,
    
    // Add spacing in pixels between subsequent patterns. 
    spacing : 0,   // in pixels, use a value between -10 to 50 (depending on the pattern size). The default is 0.
    
    // Add extra spacing to place the last symbol at the end of the path
    addSpaceToFit : false,  // false by default

    // Angle of the pattern from the direction of the path
    angleFromPath : 0,

    // If set to true the direction of the rotation specified by angleFromPath will alternate
    alternate : true, // true or false

    // Distance of the center of the pattern from the path
    distanceFromPath : 0, // in pixels

    // Scale factor in percent
    scaleAlong : 100, // value around 100, in fact, very close to 100.
    
    // Skip Rotation
    skipRotation : false,  // true of false
    
    // Variation of color of the pattern. 
    // For example, value of 0.2 means that each of the red, green, and blue color components
    // will be multiplied by a DIFFERENT random value from interval 0.8 and 1.2. 
    // Set to 0 if you do not want to modify the pattern color.
    colorRandomness : 0.05,    // use a value between 0 and 1. The default is 0.05.

    // Variation of pattern brightness. 
    // For example, value of 0.6 means that each of the red, green, and blue color components
    // will be multiplied by THE SAME random value from interval 0.4 and 1.6. 
    // Set to 0 if you do not want to modify the pattern brightness.
    brightnessRandomness : 0.1,   // use a value between 0 and 1. The default is 0.1.
}

///////////////////////////////////////////////////////////////////////////

// Get pattern  and its size
var pattern = RenderAPI.getParameter(kpsPattern)
var patternSize = pattern.getParameter(kpsSize)
var patternSizeForDialog = Math.max (patternSize.x, patternSize.y) 

//pattern.setParameter(kpsMaxPatternCacheSize, patternSize.x * patternSize.y * 7 * 8 * 180)

var inputPaths = RenderAPI.getParameter (kpsSelectedPaths)

if (inputPaths.length == 0)
{
    Engine.error ("$$$/DecoScripts/PlaceAlongPath/NoPath=No path selected. Please select at least one path") // no need to call localize since the string is localized inside the Engine
}
//alert (paths.length + " path(s)")

function run (api, parameters, scale)
{
     // get size of the output area
    var outputSize = api.getParameter(kpsSize)
    var outputOrigin = api.getParameter(kpsOrigin)
 
    var patternSize = pattern.getParameter(kpsSize)
    var maxPatternSize = patternSize.x  // we use only x in this case
    patternSize *= parameters.patternScale
   
    if (parameters == previewParameters)
    {
        // set scale so that we show about 10-15 patterns
        if (maxPatternSize < previewSize / 15) 
            scale = previewSize / (15 * maxPatternSize)
        else if (maxPatternSize > previewSize / 10)
            scale = previewSize / (10 * maxPatternSize)
    }

   //alert ("origin = " + outputOrigin.x + ", " + outputOrigin.y)
   //alert ("size = " + outputSize.x + ", " + outputSize.y)
   
  // scale up if the patternsize is 1 to avoid long loop
   if (patternSize.x == 1 && patternSize.y == 1)
    {
        if (scale == 1)
            scale = 20
        patternSize *= scale
        parameters.skipRotation = true    // 1x1 patterns that are scaled up do not rotate gracefully
    }

   var paths = inputPaths
    if (parameters == previewParameters)
    {
        paths = new Array(0)
        paths.push (new DecoGeometry)
        //paths[0].addLineStrip(new Vector3(0,0,0) + outputOrigin, new Vector3(255, 255, 0) + outputOrigin)
        paths[0].addBezier (new Vector3(10, (previewSize-10), 0) + outputOrigin, 
                                      new Vector3(10, 115,0 ) + outputOrigin, 
                                      new Vector3( (previewSize-10), 140, 0) + outputOrigin, 
                                      new Vector3( (previewSize-10), 10, 0) + outputOrigin)
    }
    
    var step = scale * (patternSize.y  + parameters.spacing) // pattern scale doesn't affect the step
    if (step < 1)
        step = 1 // smallest step is 1 pixel

    for (var p = 0; p < paths.length; p++)
    {
        var geometry = paths[p]
        
        var glength = geometry.getValue(kGetGeometryLength)
        
        var d = 0 //scale*patternSize.y/2   // no spacing involved
        
        var pt1 = geometry.getValue(kGetPointAlongGeometry, 0)
        var pt2 = geometry.getValue(kGetPointAlongGeometry, glength - 0.1)
        var isClosed = (pt1 - pt2).length() < 1.5 // 1.5 pixel
        //alert(isClosed)
        
        if (parameters.addSpaceToFit)
        {
                if (parameters.scaleAlong == 100)
                {
                    // easier case
                    // step is fixed so after n steps we will reach the distance of n* step
                    // Just divide glength by step, take floor and adjust step
                    var n = Math.floor(glength / step)
                    step = glength / n
                }
                else
                {
                    // more complicated
                    // After n step we will reach the distance of  step * (scale^(n+1) - 1) / (scale - 1)
                    var sc = parameters.scaleAlong * 0.01;
                    if (sc < 1 && step / (1 - sc) < glength)
                    {
                        // we won't reach the end, adjust the step so we do
                        step = glength * (1 - sc)
                    }
                    else
                    {
                        // we take the expression above, make it equal to length and solve for n
                        n = Math.floor(Math.log(glength * (sc - 1) / step + 1) / Math.log(sc) - 1)
                        // now we have a new n and we need to adjust step
                        step = glength / ( (Math.pow(sc, n+1) - 1) / (sc  - 1) )
                    }
                }
        }
 
        var index = 0
        
        var seed =  Math.floor(p * 2531011) % 0x7fffffff   //7327)
        Engine.rand(seed)
        
        if (parameters == previewParameters)
        {
            api.Color (kStrokeColor, 0.4,0.4,0.4, 1)
            api.pushMatrix()
            api.lineWidth(0.5)
            api.translate(-outputOrigin)   // path points are in screen coordinates, not in coordinates of the bounding box of the selection
            geometry.render(api)
            api.popMatrix()
        }
        
        while (d <= glength +1.5)
        {
                if (isClosed && d >= glength - 0.5)
                    // skip the last one - already drawn at the beginning of teh closed path
                    break;
                    
                var pt = geometry.getValue(kGetPointAlongGeometry, d > glength-0.1 ? glength-0.1 : d)
                var normal = geometry.getValue(kGetNormalAlongGeometry, d > glength-0.1 ? glength-0.1 : d)
                
                var angle = Math.atan2( normal.y, normal.x) * 180 / Math.PI
                
                api.pushMatrix()
          
                api.translate(pt - outputOrigin)   // path points are in screen coordinates, not in coordinates of the bounding box of the selection
                api.scale (scale, scale)
        
                var dir = 1
                if (parameters.alternate && (index % 2) == 0)
                    dir = -1;
                        
               // adjust to normal
                api.rotate(90 + angle)
                api.translateRel(0, -dir * parameters.distanceFromPath)
                
                if (!parameters.skipRotation)
                {
                    
                     if (dir == 1)
                        api.rotate(parameters.angleFromPath)
                     else
                        api.rotate(- parameters.angleFromPath)
                        
                }
                else
                    // adjust back
                    api.rotate(-(90 + angle))
       
                // Set the seed based on the current row and column - this assures that the color will be modified
                // in the same way for the pattern in the neighboring selected area
                var seed =  Math.floor(d  *17 + p * 2531011) % 0x7fffffff   //7327)
 
                var rc = parameters.colorRandomness  // color randomness
                var br = 1 - parameters.brightnessRandomness + Engine.rand() * parameters.brightnessRandomness*2  // brightness
                api.Color (kFillColor, br *(1 - rc + Engine.rand()*rc*2), br*(1 - rc + Engine.rand()*rc*2), br*(1 - rc + Engine.rand()*rc*2))
 
                
                if (dir == -1)
                    api.scale (1, -1)
                api.scale(parameters.patternScale)
                pattern.render(api)
        
                api.popMatrix()
                
                d += step
                step *= parameters.scaleAlong * 0.01
                scale *= parameters.scaleAlong * 0.01
                
                if (step < 1)
                    break;
                
                index++
        }
        
       
    }

    if (parameters == previewParameters)
         Engine.render (api)
 }


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Menu start
// If you want to create a menu in which you change some of the script parameters, include the following code:
// For shipped scripts we can include localized strings, prefixed with $$$/ - call method localize(string) on the prefixed string
// For your own strings, you can query app.locale and select several language versions (for example, your native language and english). Try alert ("Language is: " + app.locale)

var decoMenu = {    //  an object that defines the menu
   menuTitle : localize("$$$/DecoScripts/PlaceAlongPath/PlaceAlongPath=Place Along Path"),
   menuBackground : [0.93, 0.93, 0.93, 1],
   previewBackground : [1, 1, 1, 1],
   panels : [
    { panelName : "", 
       leftColumnWidth : 180,
       unitsWidth : 65,
       panelMenu : [
         { itemName : localize("$$$/DecoScripts/PatternScale=Pattern Scale:") ,  itemUnit :  "", itemType : 'slider', itemValue : modelParameters.patternScale, itemMin : 0.1, itemMax : 1.25, itemStep : 0.01, varName : 'patternScale'  }, 
         { itemName : localize("$$$/DecoScripts/PlaceAlongPath/Spacing=Spacing:") ,  itemUnit :  localize("$$$/DecoScripts/Units/pixels=pixels"), itemType : 'slider', itemValue : modelParameters.spacing, itemMin : Math.min(-50, -1 * patternSizeForDialog), itemMax : Math.max(150, 3 * patternSizeForDialog), itemStep : 1, varName : 'spacing'  }, 
         { itemName : localize("$$$/DecoScripts/PlaceAlongPath/AdjustSpacingToFit=Adjust spacing to fit:") ,  itemType : 'checkbox', itemValue : modelParameters.addSpaceToFit, varName : 'addSpaceToFit'  }, 
         { itemName : localize("$$$/DecoScripts/PlaceAlongPath/angleFromPath=Angle from path:"),  itemUnit : localize("$$$/DecoScripts/Units/degrees=degrees"),  itemType : 'slider', itemValue : modelParameters.angleFromPath , itemMin : -90, itemMax : 90, itemStep : 1, varName : 'angleFromPath'  }, 
         { itemName : localize("$$$/DecoScripts/PlaceAlongPath/distanceFromPath=Distance from path:"),  
             itemUnit : localize("$$$/DecoScripts/Units/pixels=pixels"),
             itemType : 'slider', itemValue : modelParameters.distanceFromPath, itemMin : 0, itemMax : Math.max(200, 4 * patternSizeForDialog), itemStep : 1, varName : 'distanceFromPath'  }, 
         { itemName : localize("$$$/DecoScripts/PlaceAlongPath/aleternatePatterns=Alternate patterns:"),  itemType : 'checkbox', itemValue : modelParameters.alternate, itemMin : 0, itemMax : 0, varName : 'alternate'  },
         { itemName : localize("$$$/DecoScripts/PlaceAlongPath/scaleProgression=Scale progression:"),  itemType : 'slider', itemUnit : localize("$$$/DecoScripts/Units/percent=%"),
             itemValue : modelParameters.scaleAlong, itemMin : 90, itemMax : 110, itemStep : 0.1, varName : 'scaleAlong'  } ,
         { itemName : localize("$$$/DecoScripts/PlaceAlongPath/skipSymbolRotation=Skip symbol rotation:"),  itemType : 'checkbox', 
            itemValue : modelParameters.skipRotation, itemMin : 0, itemMax : 0, varName : 'skipRotation',
            disableItems : [ [true, [1,3]] ]  } ,
          { itemName : localize("$$$/DecoScripts/ColorRandomness=Color randomness:"),  
             itemUnit : "",  itemType : 'slider', itemValue : modelParameters.colorRandomness, itemMin : 0, itemMax : 1, itemStep : 0.01, varName : 'colorRandomness'  }, 
         
          { itemName : localize("$$$/DecoScripts/BrightnessRandomness=Brightness randomness:"),  
             itemUnit : "",  itemType : 'slider', itemValue : modelParameters.brightnessRandomness, itemMin : 0, itemMax : 1, itemStep : 0.01, varName : 'brightnessRandomness'  }, 
         
       ] }
   ]  // end of panels
 }  // end of menu

// If livePreview is set to 1, the preview image is updated live. Note that due to limitations of scripted menus the update is slow and the flickering may be disturbing. 
livePreview = 0 // recommended value is 0

// Call Photoshop Script that creates the menu
Engine.evalFile ("_Deco Menu.jsx") 


// Menu finished
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if (typeof skipRun == 'undefined' || !skipRun)  // run unles we exited the preview window without pressing a button
    run(RenderAPI, modelParameters, 1)


