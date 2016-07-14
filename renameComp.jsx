/*global app, charIDToTypeID, stringIDToTypeID, params */

// Required params:
//   -{0} compIndex: The index of the comp to rename
//   -{1} compName: The new name of the comp


var comp,
    i,
    comps = app.activeDocument.layerComps;

for (i = 0; i < comps.length; i++) {
    comp = comps[i];
    if (i == %1$s) {
        comp.name = "%2$s";
        break;
    }
}
