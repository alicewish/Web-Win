/*************************************************************************
 *
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2013 Adobe Systems Incorporated
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 **************************************************************************/

/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50, sloppy: true, continue: true */
/*global $, app, ColorSpace, ColorModel, StrokeFillProxyOptions, UndoModes, StrokeFillTargetOptions, TEXT */

var COLOR = {};

//input is native color
COLOR.isColorSupported = function (color) {
    // TODO: revisit if we can handle tints (using alpha)
    if (color.name === 'None' || color.name === 'Registration') {
        return false;
    }
    var colorClass = color.__class__;
    return colorClass !== 'Gradient' &&
            colorClass !== 'Tint' &&
            colorClass !== 'MixedInk';
};

//input is a single DL color representation
COLOR.isModeSupported = function (colorData) {
    // InDesign does not support grayscale and HSB. Will use alternative representation.
    return colorData && (colorData.mode === 'RGB' || colorData.mode === 'CMYK' || colorData.mode === 'Lab');
};

//input is intermediate color value
COLOR.colorToRGB = function (srcColorValue) {
    var rgbColorValue = {};

    if (srcColorValue.space === ColorSpace.RGB) {
        rgbColorValue = srcColorValue;
    } else {
        var srcVals = [];
        if (srcColorValue.space === ColorSpace.CMYK) {
            srcVals[0] = srcColorValue.vals[0] / 100.0;
            srcVals[1] = srcColorValue.vals[1] / 100.0;
            srcVals[2] = srcColorValue.vals[2] / 100.0;
            srcVals[3] = srcColorValue.vals[3] / 100.0;
        } else if (srcColorValue.space === ColorSpace.LAB) {
            srcVals[0] = srcColorValue.vals[0];
            srcVals[1] = srcColorValue.vals[1];
            srcVals[2] = srcColorValue.vals[2];
        }

        var colorsOwner = app;
        try {
            if (app.documents.length !== 0) {
                //app.activeDocument throws if the only documents that are open, are opened in background.
                colorsOwner = app.activeDocument;
            }
        } catch (ignore) {}

        var dstVals = [];
        dstVals = colorsOwner.colorTransform(srcVals, srcColorValue.space, ColorSpace.RGB);
        if (dstVals.length === 3) {
            dstVals[0] = dstVals[0] * 255.0;
            dstVals[1] = dstVals[1] * 255.0;
            dstVals[2] = dstVals[2] * 255.0;
        }

        rgbColorValue = {
            name: srcColorValue.name,
            space: ColorSpace.RGB,
            model: srcColorValue.model,
            vals: dstVals
        };
    }

    return rgbColorValue;
};

//input is intermediate color value
COLOR.colorToCMYK = function (srcColorValue) {
    var cmykColorValue = {};

    if (srcColorValue.space === ColorSpace.CMYK) {
        cmykColorValue = srcColorValue;
    } else {
        var srcVals = [];
        if (srcColorValue.space === ColorSpace.RGB) {
            srcVals[0] = srcColorValue.vals[0] / 255.0;
            srcVals[1] = srcColorValue.vals[1] / 255.0;
            srcVals[2] = srcColorValue.vals[2] / 255.0;
        } else if (srcColorValue.space === ColorSpace.LAB) {
            srcVals[0] = srcColorValue.vals[0];
            srcVals[1] = srcColorValue.vals[1];
            srcVals[2] = srcColorValue.vals[2];
        }

        var colorsOwner = app;
        try {
            if (app.documents.length !== 0) {
                //app.activeDocument throws if the only documents that are open, are opened in background.
                colorsOwner = app.activeDocument;
            }
        } catch (ignore) {}

        var dstVals = [];
        dstVals = colorsOwner.colorTransform(srcVals, srcColorValue.space, ColorSpace.CMYK);
        if (dstVals.length === 4) {
            dstVals[0] = dstVals[0] * 100.0;
            dstVals[1] = dstVals[1] * 100.0;
            dstVals[2] = dstVals[2] * 100.0;
            dstVals[3] = dstVals[3] * 100.0;
        }

        cmykColorValue = {
            name: srcColorValue.name,
            space: ColorSpace.CMYK,
            model: srcColorValue.model,
            vals: dstVals
        };
    }

    return cmykColorValue;
};

//input is DL color representations, and the mode we are looking for
COLOR.findRepWithMode = function (reps, mode) {
    var filteredReps = reps.filter(function (item) {
        return item.mode === mode;
    });
    if (filteredReps.length > 0) {
        return filteredReps[0];
    }
};

//input is DL color representations
COLOR.getBestColorRepresentation = function (data) {
    var colorData = data[0];

    if (COLOR.isModeSupported(colorData)) {
        return colorData;
    }
    //Default to RGB if the primary color is not supported
    return COLOR.findRepWithMode(data, 'RGB');
};

//input is DL color representations, converts to native color
COLOR.dataToSolidColor = function (data) {
    if (app.documents.length === 0) {
        return null;
    }

    if (Array.isArray(data)) {
        data = COLOR.getBestColorRepresentation(data);
    }

    return COLOR._getDocumentColorFromData(data);
};

//input is a single DL color representation
COLOR._getDocumentColorFromData = function (colorData) {
    var newColorValue = COLOR.dataToColorValue(colorData);
    var origSwatchName = newColorValue.name;

    if (!origSwatchName) {
        if (newColorValue.space === ColorSpace.RGB) {
            origSwatchName =  'R=' + Math.floor(newColorValue.vals[0] + 0.5) +
                             ' G=' + Math.floor(newColorValue.vals[1] + 0.5) +
                             ' B=' + Math.floor(newColorValue.vals[2] + 0.5);
        } else if (newColorValue.space === ColorSpace.CMYK) {
            origSwatchName =  'C=' + Math.floor(newColorValue.vals[0] + 0.5) +
                             ' M=' + Math.floor(newColorValue.vals[1] + 0.5) +
                             ' Y=' + Math.floor(newColorValue.vals[2] + 0.5) +
                             ' K=' + Math.floor(newColorValue.vals[3] + 0.5);
        } else if (newColorValue.space === ColorSpace.LAB) {
            origSwatchName =  'L=' + Math.floor(newColorValue.vals[0] + 0.5) +
                             ' a=' + Math.floor(newColorValue.vals[1] + 0.5) +
                             ' b=' + Math.floor(newColorValue.vals[2] + 0.5);
        }
    }

    var colorsOwner = app;
    try {
        if (app.documents.length !== 0) {
            //app.activeDocument throws if the only documents that are open, are opened in background.
            colorsOwner = app.activeDocument;
        }
    } catch (ignore) {}

    var colorToAdd = colorsOwner.colors.item(origSwatchName);

    var swatchName = origSwatchName;
    var iCount = 0;
    var found = false;
    while (!found && ('undefined' !== typeof colorToAdd) && (null !== colorToAdd)) {

        var diffColors = (newColorValue.space !== colorToAdd.space || newColorValue.model !== colorToAdd.model);
        if (!diffColors) {
            diffColors = !COLOR.areColorValsEqual(newColorValue.vals, colorToAdd.colorValue);
        }

        if (!diffColors) {
            found = true;
        }

        if (!found) {
            ++iCount;
            swatchName = origSwatchName + ' ' + iCount;
            colorToAdd = colorsOwner.colors.item(swatchName);
        }
    }

    if (found) {
        return colorToAdd;
    }

    return colorsOwner.colors.add({
        name: swatchName,
        model: newColorValue.model,
        space: newColorValue.space,
        colorValue: newColorValue.vals
    });
};

//input is DL color representations, converts to intermediate color value
COLOR.dataToColorValue = function (data) {

    if (Array.isArray(data)) {
        data = COLOR.getBestColorRepresentation(data);
    }

    var colorValue = {};
    if (data) {
        switch (data.mode) {
        case 'RGB':
            colorValue.space = ColorSpace.RGB;
            colorValue.vals = [data.value.r, data.value.g, data.value.b];
            break;
        case 'CMYK':
            colorValue.space = ColorSpace.CMYK;
            colorValue.vals = [data.value.c, data.value.m, data.value.y, data.value.k];
            break;
        case 'Lab':
            colorValue.space = ColorSpace.LAB;
            colorValue.vals = [data.value.l, data.value.a, data.value.b];
            break;
        }

        colorValue.model = ColorModel.PROCESS;
        if (data.hasOwnProperty('type')) {
            if (data.type === 'spot') {
                colorValue.model = ColorModel.SPOT;
                colorValue.name = data.spotColorName;
            }
        }

        //Get the color name from the asset, if specified.
        //For spot colors, this overrides the spotColorName value.
        if (data.name) {
            colorValue.name = data.name;
        }
    }

    return colorValue;
};

//input is native color, converts to intermediate color value
COLOR.colorToColorValue = function (color) {
    try {
        if (color && COLOR.isColorSupported(color)) {
            var colorValue = {};
            colorValue.space = color.space;
            colorValue.vals = color.colorValue;
            colorValue.name = color.name;
            colorValue.model = color.model;
            return colorValue;
        }
    } catch (ex) {
        //alert(ex);
    }
};

//input is intermediate color value, converts to DL color representations
COLOR.colorValueToData = function (colorValue) {
    var rgbProfileName = '',
        cmykProfileName = '',
        representations = [];

    try {
        rgbProfileName = app.activeDocument.rgbProfile;
        cmykProfileName = app.activeDocument.cmykProfile;
    } catch (ignore) {}

    var rgbColorValue = {};

    rgbColorValue = COLOR.colorToRGB(colorValue);
    representations.push({
        mode: 'RGB',
        value: {
            r: rgbColorValue.vals[0],
            g: rgbColorValue.vals[1],
            b: rgbColorValue.vals[2]
        },
        type: 'process',
        profileName: rgbProfileName
    });

    if (colorValue.space === ColorSpace.CMYK) {
        representations.unshift({
            mode: 'CMYK',
            value: {
                c: colorValue.vals[0],
                m: colorValue.vals[1],
                y: colorValue.vals[2],
                k: colorValue.vals[3]
            },
            type: 'process',
            profileName: cmykProfileName
        });
    }

    if (colorValue.space === ColorSpace.LAB) {
        representations.unshift({
            mode: 'Lab',
            value: {
                l: colorValue.vals[0],
                a: colorValue.vals[1],
                b: colorValue.vals[2]
            },
            type: 'process'
        });
    }

    // Handle spot color case
    if (colorValue.model === ColorModel.SPOT) {
        return representations.map(function (colorItem) {
            colorItem.type = 'spot';
            colorItem.spotColorName = colorValue.name;
            return colorItem;
        });
    }

    return representations;
};

COLOR.solidColorToData = function (color) {
    try {
        return COLOR.colorValueToData(COLOR.colorToColorValue(color));
    } catch (ignore) {
        var representations = [];
        return representations;
    }
};

//compares intermediate color vals arrays
COLOR.areColorValsEqual = function (colorVals1, colorVals2) {
    var len1 = colorVals1.length;
    var len2 = colorVals2.length;
    if (len1 !== len2) {
        return false;
    }

    var i;
    for (i = 0; i < len1; ++i) {
        if (Math.abs(colorVals1[i] - colorVals2[i]) > 0.005) {
            return false;
        }
    }

    return true;
};

//input is DL color representations
COLOR.setColor = function (colorData) {
    try {
        if (app.documents.length === 0) {
            return;
        }

        var selection = app.selection;
        var i;
        for (i = 0; i < selection.length; ++i) {
            if (selection[i].hasOwnProperty('characters')) {
                var text;
                if (selection[i].__class__ === 'TextFrame') {
                    if (app.strokeFillProxySettings.target === StrokeFillTargetOptions.formattingAffectsText) {
                        text = selection[i].texts[0];
                    }
                } else {
                    text = selection[i].texts[0];
                }

                if (text && TEXT.isLockedStory(text)) {
                    return;
                }
            }
        }

        if (app.strokeFillProxySettings.active === StrokeFillProxyOptions.FILL) {
            COLOR.setFillColor(colorData);
        }

        if (app.strokeFillProxySettings.active === StrokeFillProxyOptions.STROKE) {
            COLOR.setStrokeColor(colorData);
        }

        return colorData + ";Fill Color-setFillColor;Stroke Color-setStrokeColor";

    } catch (ex) {
        $._ext_CORE.writeToLog('IDSN.jsx-setColor()', ex);
    }
};

//input is DL color representations
COLOR.setFillColor = function (colorData) {
    try {
        app.doScript(
            'app.strokeFillProxySettings.fillColor = COLOR.dataToSolidColor(colorData);',
            undefined,
            undefined,
            UndoModes.entireScript,
            '$ID/Swatch'
        );
    } catch (ex) {
        $._ext_CORE.writeToLog('IDSN.jsx-setFillColor()', ex);
    }
};

//input is DL color representations
COLOR.setStrokeColor = function (colorData) {
    try {
        app.doScript(
            'app.strokeFillProxySettings.strokeColor = COLOR.dataToSolidColor(colorData);',
            undefined,
            undefined,
            UndoModes.entireScript,
            '$ID/Swatch'
        );
    } catch (ex) {
        $._ext_CORE.writeToLog('IDSN.jsx-setStrokeColor()', ex);
    }
};
