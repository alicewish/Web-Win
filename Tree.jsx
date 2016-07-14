//////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//      Tree v2.0.0
//      Deco Script for Photoshop
//      Daichi Ito, User Experience Designer
//
//      (c) Adobe Systems Inc.  2014
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////

modelParameters = {
    mTreeType : 0,
    lightDirection : 0,
    tilt : 0,
    leavesAmount : 70,
    leavesSize : 100,
    leavesHeight : 100,
    trunkWidth : 100,
    defaultLeaves: true,
    leavesType: 0,
    leavesColor : false,
    stemsColor : false,
    flatLeaves : false,
    noiseLeaves : false,
    flatStems : false,
    leavesLock : false,
    randShape : false,
    arrange : 1,
    stemColor : [0.54,0.5,0.39],
    leafColor : [0.42,0.51,0.23],
}



if (!ModelAPI.chooseModel("Tree"))
    Engine.error ("$$$/DecoScripts/ModelNotFound=Model not found")

function run (api, parameters, scale)
{
        ModelAPI.run (api, parameters, scale, parameters == previewParameters /* is preview */) // calls the C++ model
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Menu start
// If you want to create a menu in which you change some of the script parameters, include the following code:
// For shipped scripts we can include localized strings, prefixed with $$$/ - call method localize(string) on the prefixed string
// For your own strings, you can query app.locale and select several language versions (for example, your native language and english). Try alert ("Language is: " + app.locale)

var sBasic = localize("$$$/DecoScripts/Tree/tab1=Basic")
var sAdvanced = localize("$$$/DecoScripts/Tree/tab2=Advanced")

var decoMenu = {    //  an object that defines the menu
   menuTitle : localize("$$$/DecoScripts/Tree/Tree=Tree"),
   //menuBackground : [0.8593, 0.8593, 0.8593, 1],
   previewBackground : [ 1, 1, 1, 1],
    panels : [
    { panelName : sBasic,
       panelWidth : 500,
       leftColumnWidth : 200,
       panelMenu : [
         { itemName : localize("$$$/DecoScripts/Tree/TreeType=Base Tree Type:"),  
            itemUnit : '', 
            itemType : 'dropdownlist', itemList :
            [
            { item: localize("$$$/DecoScripts/Tree/Tree1= 1: Oak Tree"),  image : "Tree/t1.png" },
            { item: localize("$$$/DecoScripts/Tree/Tree2= 2: Redwood"),  image : "Tree/t2.png" },
            { item: localize("$$$/DecoScripts/Tree/Tree3= 3: Ginko Tree"),  image : "Tree/t3.png" },
            { item: localize("$$$/DecoScripts/Tree/Tree4= 4: Maple Tree"),  image : "Tree/t4.png" },
            { item: localize("$$$/DecoScripts/Tree/Tree5= 5: Young Maple Tree"),  image : "Tree/t5.png" },
            { item: localize("$$$/DecoScripts/Tree/Tree6= 6: Spruce Tree"),  image : "Tree/t6.png" },
            { item: localize("$$$/DecoScripts/Tree/Tree7= 7: Aspen Tree"),  image : "Tree/t7.png" },
            { item: localize("$$$/DecoScripts/Tree/Tree8= 8: Pine Tree 1"),  image : "Tree/t8.png" },
            { item: localize("$$$/DecoScripts/Tree/Tree9= 9: Pine Tree 2"),  image : "Tree/t9.png" },            
            { item: localize("$$$/DecoScripts/Tree/Tree10=10: Populus Nigra"),  image : "Tree/t10.png" },
            { item: localize("$$$/DecoScripts/Tree/Tree11=11: Pepper Tree"),  image : "Tree/t11.png" },
            { item: localize("$$$/DecoScripts/Tree/Tree12=12: Ash Tree"),  image : "Tree/t12.png" },
            { item: localize("$$$/DecoScripts/Tree/Tree13=13: Young Ash Tree"),  image : "Tree/t13.png" },
            { item: localize("$$$/DecoScripts/Tree/Tree14=14: Willow Tree"),  image : "Tree/t14.png" },
            { item: localize("$$$/DecoScripts/Tree/Tree15=15: Robinia"),  image : "Tree/t15.png" },
            { item: localize("$$$/DecoScripts/Tree/Tree16=16: Young Robinia"),  image : "Tree/t16.png" },
            { item: localize("$$$/DecoScripts/Tree/Tree17=17: Sakura Cherry Blossom"),  image : "Tree/t17.png" },
            { item: localize("$$$/DecoScripts/Tree/Tree18=18: Ficus Microcarpa"),  image : "Tree/t18.png" },
            { item: localize("$$$/DecoScripts/Tree/Tree19=19: Fraxinus Griffithii"),  image : "Tree/t19.png" },
            { item: localize("$$$/DecoScripts/Tree/Tree20=20: Acer Maximowiczianum"),  image : "Tree/t20.png" },
            { item: localize("$$$/DecoScripts/Tree/Tree21=21: Shrub"),  image : "Tree/t21.png" },
            { item: localize("$$$/DecoScripts/Tree/Tree22=22: Palm Tree"),  image : "Tree/t22.png" },
            { item: localize("$$$/DecoScripts/Tree/Tree23=23: Chilean Cedar"),  image : "Tree/t23.png" },
            { item: localize("$$$/DecoScripts/Tree/Tree24=24: Bamboo"),  image : "Tree/t24.png" },
            { item: localize("$$$/DecoScripts/Tree/Tree25=25: Cypress 1"),  image : "Tree/t25.png" },
            { item: localize("$$$/DecoScripts/Tree/Tree26=26: Cypress 2"),  image : "Tree/t26.png" },
            { item: localize("$$$/DecoScripts/Tree/Tree27=27: Cypress 3"),  image : "Tree/t27.png" },
            { item: localize("$$$/DecoScripts/Tree/Tree28=28: Elm Tree"),  image : "Tree/t28.png" },
            { item: localize("$$$/DecoScripts/Tree/Tree29=29: Foliage Plant"),  image : "Tree/t29.png" },             
            { item: localize("$$$/DecoScripts/Tree/Tree30=30: Zelkova Serrata"),  image : "Tree/t30.png" },   
            { item: localize("$$$/DecoScripts/Tree/Tree31=31: Stylized Tree 1"),  image : "Tree/t31.png" },
            { item: localize("$$$/DecoScripts/Tree/Tree32=32: Stylized Tree 2"),  image : "Tree/t32.png" },  
            { item: localize("$$$/DecoScripts/Tree/Tree33=33: Stylized Tree 3"),  image : "Tree/t33.png" },
            { item: localize("$$$/DecoScripts/Tree/Tree34=34: Stylized Tree 4"),  image : "Tree/t34.png" },
            ] , 
            itemValue : modelParameters.treeType, itemMin : 0, itemMax : 33, varName : "mTreeType" ,
                         disableItems : [ // optionally, you could specify which items in the current panel will be disabled (grayed out) for a specific selection.
                                    // when selection 1 is chosed (index 0), it grays out menu item Item3 and Item4 (index 2, and 3 - indexed in order items are specified in the panelMenu array - from 0)
                                    // when selection 2 is chosed (index 1), it grays out menu item Item4 (index 3)
             [21, [3,4,5]],     
             [23, [sAdvanced,0]],  
             [32, [sAdvanced,0]],  
             ]  },

         { itemName : localize("$$$/DecoScripts/Tree/Light=Light Direction:"),  
             itemUnit : "",  itemType : 'slider', itemValue : modelParameters.lightDirection, itemMin : 0, itemMax : 180, itemStep : 1, varName : 'lightDirection'  }, 

         { itemName : localize("$$$/DecoScripts/Tree/LeavesAmount=Leaves Amount:"),  
             itemUnit : localize("$$$/DecoScripts/Units/percent=%"), 
             itemUnit : "",  itemType : 'slider', itemValue : modelParameters.leavesAmount, itemMin : 0, itemMax : 100, itemStep : 1, varName : 'leavesAmount'  }, 

         { itemName : localize("$$$/DecoScripts/Tree/LeavesSize=Leaves Size:"),  
             itemUnit : localize("$$$/DecoScripts/Units/percent=%"), 
             itemUnit : "",  itemType : 'slider', itemValue : modelParameters.leavesSize, itemMin : 0, itemMax : 200, itemStep : 1, varName : 'leavesSize'  }, 

         { itemName : localize("$$$/DecoScripts/Tree/LeavesHeight=Branches Height:"),  
             itemUnit : localize("$$$/DecoScripts/Units/percent=%"), 
             itemUnit : "",  itemType : 'slider', itemValue : modelParameters.leavesHeight, itemMin : 70, itemMax : 300, itemStep : 1, varName : 'leavesHeight'  }, 

         { itemName : localize("$$$/DecoScripts/Tree/trunkWidth=Branches Thickness:"),  
             itemUnit : localize("$$$/DecoScripts/Units/percent=%"), 
             itemUnit : "",  itemType : 'slider', itemValue : modelParameters.trunkWidth, itemMin : 0, itemMax : 200, itemStep : 1, varName : 'trunkWidth'  }, 

         { itemName : localize("$$$/DecoScripts/Tree/defaultLeaves=Default Leaves"),
             itemUnit : "",  itemType : 'checkbox', itemValue : modelParameters.defaultLeaves, itemMin : 0, itemMax : 0, varName : 'defaultLeaves' ,
             disableItems : [ [true, [7]] ]  }, 

         { itemName : localize("$$$/DecoScripts/Tree/LeavesType=Leaves Type:"),  
            itemUnit : '', 
            itemType : 'dropdownlist', itemList :
            [
            { item: localize("$$$/DecoScripts/Tree/Leaves1= 1: Leaves 1"),  image : "Tree/l1.png" },
            { item: localize("$$$/DecoScripts/Tree/Leaves2= 2: Leaves 2"),  image : "Tree/l2.png" },
            { item: localize("$$$/DecoScripts/Tree/Leaves3= 3: Leaves 3"),  image : "Tree/l3.png" },
            { item: localize("$$$/DecoScripts/Tree/Leaves4= 4: Leaves 4"),  image : "Tree/l4.png" },
            { item: localize("$$$/DecoScripts/Tree/Leaves5= 5: Leaves 5"),  image : "Tree/l5.png" },
            { item: localize("$$$/DecoScripts/Tree/Leaves6= 6: Leaves 6"),  image : "Tree/l6.png" },
            { item: localize("$$$/DecoScripts/Tree/Leaves7= 7: Leaves 7"),  image : "Tree/l7.png" },
            { item: localize("$$$/DecoScripts/Tree/Leaves8= 8: Leaves 8"),  image : "Tree/l8.png" },
            { item: localize("$$$/DecoScripts/Tree/Leaves9= 9: Leaves 9"),  image : "Tree/l9.png" },
            { item: localize("$$$/DecoScripts/Tree/Leaves10=10: Leaves 10"),  image : "Tree/l10.png" },
            { item: localize("$$$/DecoScripts/Tree/Leaves11=11: Leaves 11"),  image : "Tree/l11.png" },
            { item: localize("$$$/DecoScripts/Tree/Leaves12=12: Leaves 12"),  image : "Tree/l12.png" },
            { item: localize("$$$/DecoScripts/Tree/Leaves13=13: Leaves 13"),  image : "Tree/l13.png" },
            { item: localize("$$$/DecoScripts/Tree/Leaves14=14: Leaves 14"),  image : "Tree/l14.png" },
            { item: localize("$$$/DecoScripts/Tree/Leaves15=15: Leaves 15"),  image : "Tree/l15.png" },
            { item: localize("$$$/DecoScripts/Tree/Leaves16=16: Leaves 16"),  image : "Tree/l16.png" },
            ] , 
            itemValue : modelParameters.leavesType, itemMin : 0, itemMax : 25, varName : "leavesType" 
            },
         
         { itemName : localize("$$$/DecoScripts/Tree/RandShape=Randomize Shapes"),
             itemUnit : "",  itemType : 'checkbox', itemValue : modelParameters.randShape, itemMin : 0, itemMax : 0, varName : 'randShape',
             disableItems : [ [true, [9]] ] },
         
          { itemName : localize("$$$/DecoScripts/Frame/Arrange=Arrangement:"),  
             itemUnit : "",  itemType : 'slider', itemValue : modelParameters.arrange, itemMin : 1, itemMax : 100, itemStep : 0.1, varName : 'arrange'  }, 



       ] }
,
    { panelName : sAdvanced,
       panelWidth : 500,
       leftColumnWidth : 200,
       panelMenu : [
         


         { itemName : localize("$$$/DecoScripts/Tree/Tilt=Camera Tilt:"),  
             itemUnit : localize("$$$/DecoScripts/Units/degree=degree"), 
             itemUnit : "",  itemType : 'slider', itemValue : modelParameters.tilt, itemMin : 0, itemMax : 24, itemStep : 1, varName : 'tilt'  }, 





         { itemName : localize("$$$/DecoScripts/Tree/LeavesColor=Use Custom Color for Leaves"),
             itemUnit : "",  itemType : 'checkbox', itemValue : modelParameters.leavesColor, itemMin : 0, itemMax : 0, varName : 'leavesColor' ,
             disableItems : [ [false, [2]] ]  }, 

         { itemName : localize("$$$/DecoScripts/Tree/LeafColor=Custom Color for Leaves:"),
             itemUnit : "",  itemType : 'colorpicker', itemValue : modelParameters.leafColor, varName : 'leafColor'  },


         { itemName : localize("$$$/DecoScripts/Tree/StemsColor=Use Custom Color for Branches"),
             itemUnit : "",  itemType : 'checkbox', itemValue : modelParameters.stemsColor, itemMin : 0, itemMax : 0, varName : 'stemsColor' ,
             disableItems : [ [false, [4]] ]  }, 

         { itemName : localize("$$$/DecoScripts/Tree/StemColor=Custom Color for Branches:"),
             itemUnit : "",  itemType : 'colorpicker', itemValue : modelParameters.stemColor, varName : 'stemColor'  },


         { itemName : localize("$$$/DecoScripts/Tree/FlatLeaves=Flat Shading - Leaves"),
             itemUnit : "",  itemType : 'checkbox', itemValue : modelParameters.flatLeaves, itemMin : 0, itemMax : 0, varName : 'flatLeaves'  },

         { itemName : localize("$$$/DecoScripts/Tree/NoiseLeaves=Enhance Contrast - Leaves"),
             itemUnit : "",  itemType : 'checkbox', itemValue : modelParameters.noiseLeaves, itemMin : 0, itemMax : 0, varName : 'noiseLeaves'  },

         { itemName : localize("$$$/DecoScripts/Tree/FlatStems=Flat Shading - Branches"),
             itemUnit : "",  itemType : 'checkbox', itemValue : modelParameters.flatStems, itemMin : 0, itemMax : 0, varName : 'flatStems'  },

         { itemName : localize("$$$/DecoScripts/Tree/RotationLock=Leaves Rotation Lock"),
             itemUnit : "",  itemType : 'checkbox', itemValue : modelParameters.leavesLock, itemMin : 0, itemMax : 0, varName : 'leavesLock'  },
         



       ] }



    ]  // end of panels
 } // end of menu

// Set  the menu definition into an environment variable 

livePreview = 0 // recommended value is 0

// Call Photoshop Script that creates the menu
Engine.evalFile ("_Deco Menu.jsx")  //XXX send menuScriptText as a parameter and search for zstrings


if (typeof skipRun == 'undefined' || !skipRun)  // run unles we exited the preview window without pressing a button
    run(RenderAPI, modelParameters, 1)
