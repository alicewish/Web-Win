// (c) Copyright 2014 Adobe Systems, Inc. All rights reserved.

var renameLayerComp = function (idx, compName) {
    var comp,
        i,
        comps = activeDoc.layerComps;

    for (i = 0; i < comps.length; i++) {
        comp = comps[i];
        if (i === idx) {
            comp.name = compName;
            break;
        }
    }
};
