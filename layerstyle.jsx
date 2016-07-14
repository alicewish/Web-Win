/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50, sloppy: true, continue: true */
/*global $, Folder, app, DocumentFill, ActionDescriptor, ActionReference, DialogModes, File,
         TypeUnits, ActionList, SolidColor, executeAction, executeActionGet, PhotoshopSaveOptions, SaveOptions, PNGSaveOptions,
         LayerKind, cssToClip, svg, ColorModel, JSXGlobals, PSKey, PSClass, PSString, PSType, PSEnum, PSEvent */

var LAYERSTYLE = {};

LAYERSTYLE.hasLayerStyles = function () {
    var ref = new ActionReference();
    ref.putProperty(PSClass.Property, PSClass.LayerEffects);
    ref.putEnumerated(PSClass.Layer, PSType.Ordinal, PSEnum.Target);

    var layerDesc = executeActionGet(ref);
    return layerDesc.hasKey(PSClass.LayerEffects);
};

LAYERSTYLE.saveLayerStyle = function () {
    var strLayerName = $._ext_PHXS.getLayerName();
    var fileData = {
        'layerName': strLayerName,
        files: []
    };

    if (LAYERSTYLE.hasLayerStyles()) {
        try {
            var randomNum = $.hiresTimer;
            var aslPath = Folder.temp.fsName + "/LayerStyle" + randomNum + ".asl";
            var aslFile = new File(aslPath);
            app.activeDocument.activeLayer.saveStyleFile(aslFile);
            fileData.files.push(aslPath);

            var pngPath = Folder.temp.fsName + "/LayerStyle" + randomNum + ".png";
            app.thumbnailStyleFile(aslFile, new File(pngPath));
            fileData.rendition = pngPath;
        } catch (ex) {}
    }

    return JSON.stringify(fileData);
};

LAYERSTYLE.applyLayerStyle = function (filePath) {
    app.activeDocument.activeLayer.applyStyleFile(new File(filePath));
};

LAYERSTYLE.clearLayerStyle = function () {
    var eventClearStyle         = app.stringIDToTypeID("clearStyle");
    var classLayer            = app.charIDToTypeID('Lyr ');
    var typeOrdinal            = app.charIDToTypeID('Ordn');
    var enumTarget            = app.charIDToTypeID('Trgt');
    var keyTarget                = app.charIDToTypeID('null');

    var desc = new ActionDescriptor();
    var descTarget = new ActionReference();
    descTarget.putEnumerated(classLayer, typeOrdinal, enumTarget);
    desc.putReference(keyTarget, descTarget);
    executeAction(eventClearStyle, desc, DialogModes.NO);
};
