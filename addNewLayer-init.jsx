// (c) Copyright 2014 Adobe Systems, Inc. All rights reserved.

var addNewLayer = function (layerName, locked) {
    var newLayer = activeDoc.artLayers.add();
    newLayer.name = layerName;
    newLayer.allLocked = locked;
};
