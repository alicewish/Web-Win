/*global params, stringIDToTypeID, charIDToTypeID,
    ActionDescriptor, ActionList, executeAction, DialogModes */

// Required params:
//   - documentId: The ID of the document requested
//   - layerSpec: Either the layer ID of the desired layer as a number, or an object of the form
//         {firstLayerIndex: number, lastLayerIndex: number, hidden: Array.<number>=} specifying the
//         desired index range, inclusive, and (optionally) an array of indices to hide.
//         Note that the number form takes a layer ID, *not* a layer index.
//   - boundsOnly: Whether to only request the bounds fo the pixmap
//   Either use absolute scaling by specifying which part of the doc should be transformed into what shape:
//   - inputRect:  { left: ..., top: ..., right: ..., bottom: ... }
//   - outputRect: { left: ..., top: ..., right: ..., bottom: ... }
//   Or use relative scaling by specifying horizontal and vertical factors:
//   - scaleX:     The x-dimension scale factor (e.g. 0.5 for half size) for the output pixmap
//   - scaleY:     The y-dimension scale factor (e.g. 0.5 for half size) for the output pixmap
//
// Optional params:
//   - useSmartScaling: setting to "true" causes shapes to be scaled in the "smart" way, which (confusingly)
//         means that stroke effects (e.g. rounded rect corners) are *not* scaled. (Default: false)
//   - includeAncestorMasks: setting to "true" causes exported layer to be clipped by any ancestor
//         masks that are visible (Default: false)
//   - convertToWorkingRGBProfile: If true, performs a color conversion on the pixels
//         before they are sent to generator. The color is converted to the working RGB profile (specified for
//         the document in PS). By default (when this setting is false), the "raw" RGB data is sent, which is
//         what is usually desired. (Default: false)
//   - allowDither: controls whether any dithering could possibly happen in the color conversion
//         to 8-bit RGB. If false, then dithering will definitely not occur, regardless of either
//         the value of useColorSettingsDither and the color settings in Photoshop. (Default: false)
//   - useColorSettingsDither: If allowDither is true, then this controls whether to (if true) defer to
//         the user's color settings in PS, or (if false) to force dither in any case where a
//         conversion to 8-bit RGB would otherwise be lossy. If allowDither is false, then the
//         value of this parameter is ignored. (Default: false)
//   - interpolationType: Force pixmap scaling to use the given interpolation method.
//         If defined, the value should be one of the Generator.prototype.INTERPOLATION constants. Otherwise,
//         Photoshop's default interpolation type (as specified in Preferences > Image Interpolation) is used.
//         (Default: undefined)
//   - forceSmartPSDPixelScaling: If true, forces PSD Smart objects to be scaled completely in pixel space
//         (as opposed to scaling vectors, text, etc. in a smoother fashion.) In PS 15.0 and earlier
//         pixel space scaling was the only option. So, setting this to "true" will replicate older behavior
//         (Default: false)
//   - clipToDocumentBounds: If true, crops returned pixels to the document bounds.
//         By default, all pixels for the specified layers are returned, even if they lie outside the document
//         bounds (e.g. if the document was cropped without "Delete Cropped Pixels" checked).
//         Note that this option *cannot* be used with an inputRect/outputRect scaling. If inputRect/outputRect
//         is set, this setting will be ignored and the pixels will not be cropped to document bounds.
//         (Default: false)
//   - compId: number, layer comp ID (optionally and exclusive of compIndex)
//   - compIndex: number, layer comp index (optionally and exclusive of compId) 
//   - maxDimension: number, maximal dimension of pixmap in pixels

var DEFAULT_MAX_DIMENSION = 10000;

var actionDescriptor = new ActionDescriptor(),
    transform;

// Add a transform if necessary
if (params.inputRect && params.outputRect) {
    transform = new ActionDescriptor();

    // The part of the document to use
    var inputRect   = params.inputRect,
        psInputRect = new ActionList();

    psInputRect.putUnitDouble(charIDToTypeID("#Pxl"), inputRect.left);
    psInputRect.putUnitDouble(charIDToTypeID("#Pxl"), inputRect.top);
    
    psInputRect.putUnitDouble(charIDToTypeID("#Pxl"), inputRect.right);
    psInputRect.putUnitDouble(charIDToTypeID("#Pxl"), inputRect.bottom);

    transform.putList(stringIDToTypeID("rectangle"), psInputRect);

    // Where to move the four corners
    var outputRect      = params.outputRect,
        psOutputCorners = new ActionList();

    psOutputCorners.putUnitDouble(charIDToTypeID("#Pxl"), outputRect.left);
    psOutputCorners.putUnitDouble(charIDToTypeID("#Pxl"), outputRect.top);
    
    psOutputCorners.putUnitDouble(charIDToTypeID("#Pxl"), outputRect.right);
    psOutputCorners.putUnitDouble(charIDToTypeID("#Pxl"), outputRect.top);
    
    psOutputCorners.putUnitDouble(charIDToTypeID("#Pxl"), outputRect.right);
    psOutputCorners.putUnitDouble(charIDToTypeID("#Pxl"), outputRect.bottom);
    
    psOutputCorners.putUnitDouble(charIDToTypeID("#Pxl"), outputRect.left);
    psOutputCorners.putUnitDouble(charIDToTypeID("#Pxl"), outputRect.bottom);

    transform.putList(stringIDToTypeID("quadrilateral"), psOutputCorners);

    // Absolute scaling may not keep the aspect ratio intact, in which case effects
    // cannot be scaled. To be consistent, turn it off for all of absolute scaling
    // transform.putBoolean(stringIDToTypeID("scaleStyles"), false);

} else if (params.scaleX && params.scaleY && (params.scaleX !== 1 || params.scaleY !== 1)) {
    transform = new ActionDescriptor();

    if (!params.useSmartScaling) {
        transform.putBoolean(stringIDToTypeID("forceDumbScaling"), true);
    }

    transform.putDouble(stringIDToTypeID("width"), params.scaleX * 100);
    transform.putDouble(stringIDToTypeID("height"), params.scaleY * 100);
}

if (transform) {
    // interpolation and scaling options are only relevant in cases where a transform
    // is going to happen. So, we only bother to set them if we're actually going
    // to add a transform descriptor

    if (!params.useSmartScaling) {
        transform.putBoolean(stringIDToTypeID("forceDumbScaling"), true);
    }

    if (params.hasOwnProperty("interpolationType")) {
        transform.putEnumerated(stringIDToTypeID("interpolation"),
                                stringIDToTypeID("interpolationType"),
                                stringIDToTypeID(params.interpolationType));

        actionDescriptor.putEnumerated(stringIDToTypeID("interpolation"),
                                stringIDToTypeID("interpolationType"),
                                stringIDToTypeID(params.interpolationType));
    }

    if (params.hasOwnProperty("forceSmartPSDPixelScaling")) {
        transform.putBoolean(stringIDToTypeID("forceSmartPSDPixelScaling"), !!params.forceSmartPSDPixelScaling);
    }

    // actually add the transform descriptor to the main descriptor
    actionDescriptor.putObject(stringIDToTypeID("transform"), stringIDToTypeID("transform"), transform);
}

actionDescriptor.putInteger(stringIDToTypeID("documentID"), params.documentId);
actionDescriptor.putInteger(stringIDToTypeID("width"), params.maxDimension || DEFAULT_MAX_DIMENSION);
actionDescriptor.putInteger(stringIDToTypeID("height"), params.maxDimension || DEFAULT_MAX_DIMENSION);
actionDescriptor.putInteger(stringIDToTypeID("format"), 2);

if (typeof(params.layerSpec) === "object") {
    actionDescriptor.putInteger(stringIDToTypeID("firstLayer"), params.layerSpec.firstLayerIndex);
    actionDescriptor.putInteger(stringIDToTypeID("lastLayer"), params.layerSpec.lastLayerIndex);
    if (params.layerSpec.hasOwnProperty("hidden") && params.layerSpec.hidden.length > 0) {
        var i,
            hiddenIndiciesMap = {},
            settingsList = new ActionList(),
            hiddenLayerDesc = new ActionDescriptor(),
            visibleLayerDesc = new ActionDescriptor(),
            hiddenLayerSettings = new ActionDescriptor(),
            lsID = stringIDToTypeID("layerSettings");

        hiddenLayerSettings.putBoolean(stringIDToTypeID("enabled"), false);
        hiddenLayerDesc.putObject(lsID, lsID, hiddenLayerSettings);

        // We have to add a descriptor for every layer in order, so first
        // build a map to make it easier to do this.
        for (i = 0; i < params.layerSpec.hidden.length; ++i) {
            hiddenIndiciesMap[params.layerSpec.hidden[i]] = true;
        }

        // Loop over every layer, and add either a hidden or visible descriptor
        // based on the map we built.
        for (i = params.layerSpec.firstLayerIndex; i <= params.layerSpec.lastLayerIndex; ++i) {
            if (hiddenIndiciesMap[i]) {
                settingsList.putObject(lsID, hiddenLayerDesc);
            } else {
                settingsList.putObject(lsID, visibleLayerDesc);
            }
        }

        actionDescriptor.putList(stringIDToTypeID("layerSettings"), settingsList);
    }

} else {
    actionDescriptor.putInteger(stringIDToTypeID("layerID"), params.layerSpec);
}

if (params.hasOwnProperty("compId")) {
    actionDescriptor.putInteger(stringIDToTypeID("compID"), params.compId);
} else if (params.hasOwnProperty("compIndex")) {
    actionDescriptor.putInteger(stringIDToTypeID("compIndex"), params.compIndex);
}

if (!params.includeAncestorMasks) {
    actionDescriptor.putEnumerated(
        stringIDToTypeID("includeAncestors"),
        stringIDToTypeID("includeLayers"),
        stringIDToTypeID("includeNone")
    );
} else {
    actionDescriptor.putEnumerated(
        stringIDToTypeID("includeAncestors"),
        stringIDToTypeID("includeLayers"),
        stringIDToTypeID("includeVisible")
    );
}

actionDescriptor.putEnumerated(
    stringIDToTypeID("includeAdjustors"),
    stringIDToTypeID("includeLayers"),
    stringIDToTypeID("includeVisible")
);

if (params.hasOwnProperty("convertToWorkingRGBProfile")) {
    actionDescriptor.putBoolean(stringIDToTypeID("convertToWorkingRGBProfile"), !!params.convertToWorkingRGBProfile);
}

// NOTE: on the PS side, allowDither and useColorSettingsDither default to "true" if they are
// not set at all. However, in Generator, the common case will be that we do NOT want to dither,
// regardless of the settings in PS. So, on the Generator side, we default to false (hence the !! on
// the params properties).
actionDescriptor.putBoolean(stringIDToTypeID("allowDither"), !!params.allowDither);
actionDescriptor.putBoolean(stringIDToTypeID("useColorSettingsDither"), !!params.useColorSettingsDither);

if (params.hasOwnProperty("clipToDocumentBounds")) {
    actionDescriptor.putBoolean(stringIDToTypeID("clipToDocumentBounds"), !!params.clipToDocumentBounds);
}

if (params.boundsOnly) {
    actionDescriptor.putBoolean(stringIDToTypeID("boundsOnly"), params.boundsOnly);
}
actionDescriptor.putBoolean(stringIDToTypeID("bounds"), params.bounds);

executeAction(stringIDToTypeID("sendLayerThumbnailToNetworkClient"), actionDescriptor, DialogModes.NO);
