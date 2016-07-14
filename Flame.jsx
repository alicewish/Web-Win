//////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//      Flame v1.1.0
//      Deco Script for Photoshop
//      Daichi Ito, User Experience Designer
//
//      (c) Adobe Systems Inc.  2014
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////

modelParameters = {
    mFlameType : 2,
    lines : 10,
    quality : 2,
    randShape : false,
    arrange : 0,
    fLength1 : 100,
    width : 70,
    interval : 30,
    adjustInterval : true,
    angle : 0,
    shape : 0,
    turbulent : 15,
    customFlameColor : false,
    jag : 0,
    opacity : 25,
    alignment : 30,
    style : 0,
    randHeight : false,
    flameColor : [255/255, 110/255, 28/255],
}



if (!ModelAPI.chooseModel("Flame"))
    Engine.error ("$$$/DecoScripts/ModelNotFound=Model not found")

function run (api, parameters, scale)
{
        ModelAPI.run (api, parameters, scale, parameters == previewParameters) // calls the C++ model
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Menu start
// If you want to create a menu in which you change some of the script parameters, include the following code:
// For shipped scripts we can include localized strings, prefixed with $$$/ - call method localize(string) on the prefixed string
// For your own strings, you can query app.locale and select several language versions (for example, your native language and english). Try alert ("Language is: " + app.locale)

var sBasic = localize("$$$/DecoScripts/Flame/tab1=Basic")
var sAdvanced = localize("$$$/DecoScripts/Flame/tab2=Advanced")

var decoMenu = {    //  an object that defines the menu
   menuTitle : localize("$$$/DecoScripts/Flame/Flame=Flame"),
   //menuBackground : [0.8593, 0.8593, 0.8593, 1],
   previewBackground : [ 0, 0, 0, 1],
    panels : [
    { panelName : sBasic,
       panelWidth : 500,
       leftColumnWidth : 220,
       panelMenu : [
       
         { itemName : localize("$$$/DecoScripts/Flame/flameType=Flame Type:"),  
             itemUnit : "", 
             itemType : 'dropdownlist',  itemList  : 
            [
            { item: localize("$$$/DecoScripts/Flame/flameType0= 1. One Flame Along Path"),  image : "Flame/flame_type_1.png"},
            { item: localize("$$$/DecoScripts/Flame/flameType1= 2. Multiple Flames Along Path"),  image : "Flame/flame_type_2.png"},
            { item: localize("$$$/DecoScripts/Flame/flameType2= 3. Multiple Flames One Direction"),  image : "Flame/flame_type_3.png"},
            { item: localize("$$$/DecoScripts/Flame/flameType3= 4. Multiple Flames Path Directed"),  image : "Flame/flame_type_4.png"},
            { item: localize("$$$/DecoScripts/Flame/flameType4= 5. Multiple Flames Various Angle"),  image : "Flame/flame_type_5.png"},
            { item: localize("$$$/DecoScripts/Flame/flameType5= 6. Candle Light"),  image : "Flame/flame_type_6.png"},
            ],
             itemValue : modelParameters.mFlameType, itemMin : 0, itemMax : 5, varName : 'mFlameType',
             disableItems : [ // optionally, you could specify which items in the current panel will be disabled (grayed out) for a specific selection.
                                    // when selection 1 is chosed (index 0), it grays out menu item Item3 and Item4 (index 2, and 3 - indexed in order items are specified in the panelMenu array - from 0)
                                    // when selection 2 is chosed (index 1), it grays out menu item Item4 (index 3)
             [0, [1, 2,4,5,6]], 
             [1, [4]],  
             [5, [1, 2,4,5,6],[sAdvanced, 3, 4, 6]], 
             ] },

          { itemName : localize("$$$/DecoScripts/Flame/fLength1=Length:"),  
             itemUnit : "",  itemType : 'slider', itemValue : modelParameters.fLength1, itemMin : 20, itemMax : 1000, itemStep : 1, varName : 'fLength1'  },

         { itemName : localize("$$$/DecoScripts/Flame/RandHeight=Randomize Length"),
             itemUnit : "",  itemType : 'checkbox', itemValue : modelParameters.randHeight, itemMin : 0, itemMax : 0, varName : 'randHeight'
            },

          { itemName : localize("$$$/DecoScripts/Flame/width=Width:"),  
             itemUnit : "",  itemType : 'slider', itemValue : modelParameters.width, itemMin : 5, itemMax : 1000, itemStep : 1, varName : 'width'  },

          { itemName : localize("$$$/DecoScripts/Flame/angle=Angle:"),  
             itemUnit : "",  itemType : 'slider', itemValue : modelParameters.angle, itemMin : 0, itemMax : 360, itemStep : 1, varName : 'angle'  },
         
          { itemName : localize("$$$/DecoScripts/Flame/interval=Interval:"),  
             itemUnit : "",  itemType : 'slider', itemValue : modelParameters.interval, itemMin : 10, itemMax : 200, itemStep : 1, varName : 'interval'  },

         { itemName : localize("$$$/DecoScripts/Flame/adjustInterval=Adjust Interval for Loops"),
             itemUnit : "",  itemType : 'checkbox', itemValue : modelParameters.adjustInterval, itemMin : 0, itemMax : 0, varName : 'adjustInterval' }, 
         



         { itemName : localize("$$$/DecoScripts/Flame/CustomFlameColor=Use Custom Color for Flames"),
             itemUnit : "",  itemType : 'checkbox', itemValue : modelParameters.customFlameColor, itemMin : 0, itemMax : 0, varName : 'customFlameColor' 
             ,disableItems : [ [false, [8]] ] }, 

         { itemName : localize("$$$/DecoScripts/Flame/FlameColor=Custom Color for Flames:"),
             itemUnit : "",  itemType : 'colorpicker', itemValue : modelParameters.flameColor, varName : 'flameColor'  },


         { itemName : localize("$$$/DecoScripts/Flame/Quality=Quality:"),  
             itemUnit : "", 
             itemType : 'dropdownlist',  itemList  : 
            [
            { item: localize("$$$/DecoScripts/Flame/Quality0= Draft (Fast)")},
            { item: localize("$$$/DecoScripts/Flame/Quality1= Low")},
            { item: localize("$$$/DecoScripts/Flame/Quality2= Medium")},
            { item: localize("$$$/DecoScripts/Flame/Quality3= High (Slow)")},
            { item: localize("$$$/DecoScripts/Flame/Quality4= Fine (Very Slow)")},
//            { item: localize("$$$/DecoScripts/Flame/Quality5= Final (Caution! Very Slow)")}
            ],
             itemValue : modelParameters.quality, itemMin : 0, itemMax : 5, varName : 'quality' },

         

       ] },
   
    { panelName : sAdvanced,
       panelWidth : 500,
       leftColumnWidth : 200,
       panelMenu : [
       
         


          { itemName : localize("$$$/DecoScripts/Flame/turbulent=Turbulent:"),  
             itemUnit : "",  itemType : 'slider', itemValue : modelParameters.turbulent, itemMin : 0, itemMax : 100, itemStep : 1, varName : 'turbulent'  }, 

          { itemName : localize("$$$/DecoScripts/Flame/jag=Jag:"),  
             itemUnit : "",  itemType : 'slider', itemValue : modelParameters.jag, itemMin : 0, itemMax : 100, itemStep : 1, varName : 'jag'  }, 

          { itemName : localize("$$$/DecoScripts/Flame/opacity=Opacity:"),  
             itemUnit : "",  itemType : 'slider', itemValue : modelParameters.opacity, itemMin : 0, itemMax : 100, itemStep : 1, varName : 'opacity'  }, 


          { itemName : localize("$$$/DecoScripts/Flame/Lines=Flame Lines (Complexity):"),  
             itemUnit : "",  itemType : 'slider', itemValue : modelParameters.lines, itemMin : 2, itemMax : 30, itemStep : 1, varName : 'lines'  }, 
         
          { itemName : localize("$$$/DecoScripts/Flame/alignment=Flame Bottom Alignment:"),  
             itemUnit : "",  itemType : 'slider', itemValue : modelParameters.alignment, itemMin : 0, itemMax : 100, itemStep : 1, varName : 'alignment'  }, 



         { itemName : localize("$$$/DecoScripts/Flame/flameStyle=Flame Style:"),  
             itemUnit : "", 
             itemType : 'dropdownlist',  itemList  : 
            [
            { item: localize("$$$/DecoScripts/Flame/flameStyle0= 1. Normal"),  image : "Flame/flame_style_1.png"},
            { item: localize("$$$/DecoScripts/Flame/flameStyle1= 2. Violent"),  image : "Flame/flame_style_2.png"},
            { item: localize("$$$/DecoScripts/Flame/flameStyle2= 3. Flat"),  image : "Flame/flame_style_3.png"},

            ],
             itemValue : modelParameters.style, itemMin : 0, itemMax : 4, varName : 'style' },



         { itemName : localize("$$$/DecoScripts/Flame/flameShape=Flame Shape:"),  
             itemUnit : "", 
             itemType : 'dropdownlist',  itemList  : 
            [
            { item: localize("$$$/DecoScripts/Flame/flameShape0= 1. Parallel"),  image : "Flame/flame_shape_1.png"},
            { item: localize("$$$/DecoScripts/Flame/flameShape1= 2. To The Center"),  image : "Flame/flame_shape_2.png"},
            { item: localize("$$$/DecoScripts/Flame/flameShape2= 3. Spread"),  image : "Flame/flame_shape_3.png"},
            { item: localize("$$$/DecoScripts/Flame/flameShape3= 4. Oval"),  image : "Flame/flame_shape_4.png"},
            { item: localize("$$$/DecoScripts/Flame/flameShape4= 5. Pointing"),  image : "Flame/flame_shape_5.png"},
            ],
             itemValue : modelParameters.shape, itemMin : 0, itemMax : 4, varName : 'shape' },






         { itemName : localize("$$$/DecoScripts/Flame/RandShape=Randomize Shapes"),
             itemUnit : "",  itemType : 'checkbox', itemValue : modelParameters.randShape, itemMin : 0, itemMax : 0, varName : 'randShape'
             ,disableItems : [ [true, [8]] ] },
         
          { itemName : localize("$$$/DecoScripts/Flame/Arrange=Arrangement:"),  
             itemUnit : "",  itemType : 'slider', itemValue : modelParameters.arrange, itemMin : 1, itemMax : 100, itemStep : 0.1, varName : 'arrange'  }, 


       ] }
   ]  // end of panels
   
 } // end of menu

// Set  the menu definition into an environment variable 

livePreview = 0 // recommended value is 0

// Call Photoshop Script that creates the menu
Engine.evalFile ("_Deco Menu.jsx")  


if (typeof skipRun == 'undefined' || !skipRun)  // run unles we exited the preview window without pressing a button
    run(RenderAPI, modelParameters, 1)