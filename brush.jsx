/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50, sloppy: true, continue: true */
/*global $, Folder, app, DocumentFill, ActionDescriptor, ActionReference, DialogModes, File,
         TypeUnits, ActionList, SolidColor, executeAction, executeActionGet, PhotoshopSaveOptions, SaveOptions, PNGSaveOptions,
         LayerKind, cssToClip, svg, ColorModel, JSXGlobals, PSKey, PSClass, PSString, PSType, PSEnum, PSEvent */

var BRUSH = {};
BRUSH.loadBrushFromFile = function (filePath) {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putProperty(PSClass.Property, PSClass.Brush);
    ref1.putEnumerated(PSClass.Application, PSType.Ordinal, PSEnum.Target);
    desc1.putReference(PSString.Null, ref1);
    desc1.putPath(PSKey.To, new File(filePath));
    desc1.putBoolean(PSKey.Append, true);
    executeAction(PSEvent.Set, desc1, DialogModes.NO);
};
BRUSH.selectBrush = function (brushName) {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putName(PSClass.Brush, brushName);
    desc1.putReference(PSString.Null, ref1);
    executeAction(PSEvent.Select, desc1, DialogModes.NO);
};
BRUSH.activateTool = function () {
    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putClass(PSClass.PaintbrushTool);
    desc1.putReference(PSString.Null, ref1);
    executeAction(PSEvent.Select, desc1, DialogModes.NO);
};
BRUSH.loadAndSelectBrush = function (filePath, brushName) {
    try {
        var tool_name = app.currentTool;
        // if tool_name is not undefined that means that
        // current version of Photoshop supports new Brush API
        if (tool_name) {
            if (!app.toolSupportsBrushes(tool_name)) {
                app.currentTool = "paintbrushTool";
            }
            app.applyToolBrushFromFile(new File(filePath));
        } else {
            BRUSH.activateTool();
            BRUSH.loadBrushFromFile(filePath);
            // TODO: Brushes iOS app always exports ABR file with brush name as "SampledBrush"
            // So, change this once the issue gets fixed
            BRUSH.selectBrush("SampledBrush"); //brushName
        }

    } catch (ex) {
        $._ext_CORE.writeToLog('PHXS.jsx-loadAndSelectBrush()', ex);
    }
};
