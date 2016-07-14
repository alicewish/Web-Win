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
/*global $, app, ColorSpace, Folder, JSXGlobals, File, COLOR, CharacterAlignment, AlternateGlyphForms, OTFFigureStyle, Position, Capitalization, Leading, UnitValue, WarichuAlignment, NothingEnum, UndoModes, FitOptions, StrokeCornerAdjustement, TextStrokeAlign, EndCap, RubyKentenPosition, KentenAlignment, KentenCharacter, KentenCharacterSet, AdornmentOverprint, RubyTypes, RubyAlignments, RubyOverhang, RubyParentSpacing, EndJoin, PositionalForms, LockStateValues, MeasurementUnits, DigitsTypeOptions, KashidasOptions, CharacterDirectionOptions, DiacriticPositionOptions, FontStatus, Justification, KinsokuSet, KinsokuType, KinsokuHangTypes, SingleWordJustification, TabStopAlignment, SaveOptions, ImportFormat, GlobalClashResolutionStrategy, CcimportClashResolutionStrategy, StyleType*/
var TEXT = {};

TEXT.saveTextStylePreview = function () {
    if (app.selection.length === 0) {
        return;
    }

    var selection = app.selection[0];
    if (selection.__class__ === 'TextFrame' || selection.__class__ === 'Cell') {
        selection = selection.texts[0];
    }

    //Use RGB black for text color
    var textColorSpace = ColorSpace.RGB;
    var textColorValues = [0, 0, 0];

    var previewPath = Folder.temp.fsName + '/TextPreview' + $.hiresTimer + '.png';
    selection.createThumbnailWithProperties(JSXGlobals.textPreviewString, JSXGlobals.textPreviewFontSize, textColorSpace, textColorValues, new File(previewPath));

    return previewPath;
};

TEXT.isLockedStory = function (text) {
    var story = text.parentStory;
    if (story && (story.lockState === LockStateValues.LOCKED_STORY || story.lockState === LockStateValues.CHECKED_IN_STORY)) {
        return true;
    }
    return false;
};

TEXT.areArraysEqual = function (array1, array2) {
    var i;
    if (array1.length !== array2.length) {
        return false;
    }

    for (i = 0; i < array1.length; ++i) {
        if (array1[i] !== array2[i]) {
            return false;
        }
    }

    return true;
};

TEXT.getFontPostscriptName = function (font, fontStyle) {
    var postscriptName;
    var fontFamily;

    if (font.__class__ === 'Font') {
        postscriptName = font.postscriptName;
        fontFamily = font.fontFamily;
    } else {
        //We are given the font family
        postscriptName = '';
        fontFamily = font;
    }

    if (postscriptName === '' && app.documents.length !== 0) {
        var fontName = fontFamily;
        if (fontStyle !== '') {
            fontName += '\t' + fontStyle;
        }

        var docFont;
        try {
            docFont = app.activeDocument.fonts.itemByName(fontName);
        } catch (ex) {
            docFont = app.fonts.itemByName(fontName);
        }
        if (docFont && docFont.isValid && docFont.postscriptName !== '') {
            postscriptName = docFont.postscriptName;
        }
    }

    return postscriptName;
};

TEXT.dataToFont = function (fontData, fontFamily, createFake) {
    var font, i;

    if (fontData) {
        try {
            //In scripting, InDesign names its fonts as 'familyName <TAB> faceName'.
            //While picking, we set adbeFont.name to the font's postscript name for it to work across apps.
            //When applying, we use the family name and face name.
            var fontName = fontData.family;
            if (fontData.style !== '') {
                fontName += '\t' + fontData.style;
            }

            if (app.documents.length !== 0) {
                font = app.activeDocument.fonts.itemByName(fontName);
            }

            if (!font || !font.isValid || font.postscriptName === '') {
                font = app.fonts.itemByName(fontName);
            }

        } catch (ex) {
            //alert(ex);
        }
    } else if (fontFamily) {
        //If all we have is the font-family then try to use that
        for (i = 0; i < app.fonts.length; ++i) {
            font = app.fonts[i];
            if (font.fontFamily === fontFamily) {
                break;
            }
        }
    }

    if (font && font.isValid && font.postscriptName !== '') {
        return font;
    }

    if (createFake) {
        try {
            return app.activeDocument.createMissingFontObject(fontData.family, fontData.style, fontData.postScriptName);
        } catch (ignore) {}
    }

    return; //undefinded
};

TEXT.isFontAvailable = function (style) {
    var font = TEXT.dataToFont(style.adbeFont, style.fontFamily, false);
    if (font && font.status === FontStatus.INSTALLED) {
        return 'true';
    }
    return 'false';
};

TEXT.strokeStyleToData = function (strokeStyle) {
    var obj = {};

    var styleClass = strokeStyle.__class__;

    obj.type = styleClass;
    obj.name = strokeStyle.name;

    if (styleClass === 'StripedStrokeStyle') {
        obj.stripeArray = strokeStyle.stripeArray;
    } else if (styleClass === 'DottedStrokeStyle') {
        obj.dotArray = strokeStyle.dotArray;
        obj.cornerAdjustment = 'StrokeCornerAdjustement.' + strokeStyle.strokeCornerAdjustment.toString();
    } else if (styleClass === 'DashedStrokeStyle') {
        obj.dashArray = strokeStyle.dashArray;
        obj.cornerAdjustment = 'StrokeCornerAdjustement.' + strokeStyle.strokeCornerAdjustment.toString();
        obj.endCap = 'EndCap.' + strokeStyle.endCap.toString();
    }

    return obj;
};

TEXT.dataToStrokeStyle = function (styleData) {

    var stylesOwner = app;
    if (app.documents.length !== 0) {
        stylesOwner = app.activeDocument;
    }

    var stylesCollection = stylesOwner.strokeStyles;
    if (styleData.type === 'StripedStrokeStyle') {
        stylesCollection = stylesOwner.stripedStrokeStyles;
    } else if (styleData.type === 'DottedStrokeStyle') {
        stylesCollection = stylesOwner.dottedStrokeStyles;
    } else if (styleData.type === 'DashedStrokeStyle') {
        stylesCollection = stylesOwner.dashedStrokeStyles;
    }

    var styleName = styleData.name;
    var iCount = 0;
    var found = false;

    var styleToAdd = stylesCollection.itemByName(styleName);
    while (!found && styleToAdd !== 'undefined' && styleToAdd.isValid) {

        var diffStyles = false;

        if (styleData.type === 'StripedStrokeStyle') {
            diffStyles = !TEXT.areArraysEqual(styleData.stripeArray, styleToAdd.stripeArray);
        } else if (styleData.type === 'DottedStrokeStyle') {
            diffStyles = styleData.cornerAdjustment !== ('StrokeCornerAdjustement.' + styleToAdd.strokeCornerAdjustment.toString());

            if (!diffStyles) {
                diffStyles = !TEXT.areArraysEqual(styleData.dotArray, styleToAdd.dotArray);
            }
        } else if (styleData.type === 'DashedStrokeStyle') {
            diffStyles = styleData.cornerAdjustment !== ('StrokeCornerAdjustement.' + styleToAdd.strokeCornerAdjustment.toString());

            if (!diffStyles) {
                diffStyles = styleData.endCap !== ('EndCap.' + styleToAdd.endCap.toString());
            }

            if (!diffStyles) {
                diffStyles = !TEXT.areArraysEqual(styleData.dotArray, styleToAdd.dotArray);
            }
        }

        if (!diffStyles) {
            found = true;
        }

        if (!found) {
            ++iCount;
            styleName = styleData.name + ' ' + iCount;
            styleToAdd = stylesCollection.itemByName(styleName);
        }
    }

    if (found) {
        return styleToAdd;
    }

    if (styleData.type === 'StrokeStyle') {
        //Didn't find the factory style
        return; //undefined
    }

    var strokeStyle = stylesCollection.add();
    strokeStyle.name = styleName;

    if (styleData.type === 'StripedStrokeStyle') {
        strokeStyle.stripeArray = styleData.stripeArray;
    } else if (styleData.type === 'DottedStrokeStyle') {
        strokeStyle.dotArray = styleData.dotArray;

        switch (styleData.cornerAdjustment) {
        case 'StrokeCornerAdjustement.NONE':
            strokeStyle.strokeCornerAdjustment = StrokeCornerAdjustement.NONE;
            break;
        case 'StrokeCornerAdjustement.GAPS':
            strokeStyle.strokeCornerAdjustment = StrokeCornerAdjustement.GAPS;
            break;
        }
    } else if (styleData.type === 'DashedStrokeStyle') {
        strokeStyle.dashArray = styleData.dashArray;

        switch (styleData.cornerAdjustment) {
        case 'StrokeCornerAdjustement.NONE':
            strokeStyle.strokeCornerAdjustment = StrokeCornerAdjustement.NONE;
            break;
        case 'StrokeCornerAdjustement.GAPS':
            strokeStyle.strokeCornerAdjustment = StrokeCornerAdjustement.GAPS;
            break;
        case 'StrokeCornerAdjustement.DASHES':
            strokeStyle.strokeCornerAdjustment = StrokeCornerAdjustement.DASHES;
            break;
        case 'StrokeCornerAdjustement.DASHES_AND_GAPS':
            strokeStyle.strokeCornerAdjustment = StrokeCornerAdjustement.DASHES_AND_GAPS;
            break;
        }

        switch (styleData.endCap) {
        case 'EndCap.BUTT_END_CAP':
            strokeStyle.endCap = EndCap.BUTT_END_CAP;
            break;
        case 'EndCap.PROJECTING_END_CAP':
            strokeStyle.endCap = EndCap.PROJECTING_END_CAP;
            break;
        case 'EndCap.ROUND_END_CAP':
            strokeStyle.endCap = EndCap.ROUND_END_CAP;
            break;
        }
    }

    return strokeStyle;
};

TEXT.isColorSupported = function (color) {
    return color === 'Text Color' || COLOR.isColorSupported(color);
};

TEXT.colorToData = function (color) {
    if (color === 'Text Color') {
        return color;
    }
    return COLOR.solidColorToData(color);
};

TEXT.dataToColor = function (colorData) {
    if (colorData === 'Text Color') {
        return colorData;
    }
    return COLOR.dataToSolidColor(colorData);
};

TEXT.convertUnitsToPoints = function (unitType, unitValue) {
    if (unitType === MeasurementUnits.POINTS) {
        return unitValue;
    }

    var pointsValue = unitValue;
    switch (unitType) {
    case MeasurementUnits.Q:
        pointsValue = pointsValue * 0.7086614173228346;
        break;
    case MeasurementUnits.AMERICAN_POINTS:
        pointsValue = pointsValue * (0.3514 / 25.4 * 72);
        break;
    case MeasurementUnits.MILLIMETERS:
        pointsValue = (pointsValue * 72.0) / 25.4;
        break;
    case MeasurementUnits.HA:
        pointsValue = pointsValue * 0.7086614173228346;
        break;
    case MeasurementUnits.BAI:
        pointsValue = pointsValue * 6.336;
        break;
    case MeasurementUnits.U:
        pointsValue = (pointsValue * 72.0 * 11.0) / 1000.0;
        break;
    case MeasurementUnits.MILS:
        pointsValue = pointsValue * 0.072;
        break;
    case MeasurementUnits.PICAS:
        pointsValue = pointsValue * 12.0;
        break;
    case MeasurementUnits.INCHES:
    case MeasurementUnits.INCHES_DECIMAL:
        pointsValue = pointsValue * 72.0;
        break;
    case MeasurementUnits.CENTIMETERS:
        pointsValue = (pointsValue * 72.0) / 2.54;
        break;
    case MeasurementUnits.CICEROS:
        pointsValue = pointsValue * 12.7878751998;
        break;
    case MeasurementUnits.AGATES:
        pointsValue = (pointsValue * 72.0) / 14.0;
        break;
    case MeasurementUnits.PIXELS:
        //No conversion required
        break;
    default:
        //alert('convertUnitsToPoints: Unknown unitType');
        break;
    }
    return pointsValue;
};

TEXT.isEmptyObject = function (obj) {
    var key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            //has at-least one own property
            return false;
        }
    }
    return true;
};

// When we are exporting styles from No Document state, we use a headless document. In that case, documents.length is 1.
// But there is no active Document. So we use the try catch block to get the prefsOwner.   
TEXT.getPrefsOwner = function () {
    var prefsOwner = app;
    try {
        prefsOwner = app.activeDocument;
    } catch (ex) {
        prefsOwner = app;
    }
    return prefsOwner;
};

//Holds application translated strings
var AppStrings = {
    //Kerning method strings
    Metrics: app.translateKeyString('$ID/Metrics'),
    MetricsRomanOnly: app.translateKeyString('$ID/Metrics - Roman Only'),
    Optical: app.translateKeyString('$ID/Optical'),

    //Special type styles
    NoneCharacterStyle: app.translateKeyString('$ID/[No character style]'),
    NoParagraphStyle: app.translateKeyString('$ID/[No paragraph style]')
};

//With move to character styles and paragraph styles, TEXT.setTextAttributes and
//TEXT.getTextAttributes are not used now.
TEXT.setTextAttributes = function (text, style) {

    TEXT.applyBasicProperties(text, style);
    TEXT.applyAdvancedProperties(text, style);
    TEXT.applyCharacterColorProperties(text, style);
    TEXT.applyOpenTypeProperties(text, style);
    TEXT.applyTCYProperties(text, style);
    TEXT.applyWarichuProperties(text, style);
    TEXT.applyMENAProperties(text, style);

    TEXT.applyKentenProperties(text, style);
    TEXT.applyRubyProperties(text, style);
    TEXT.applyShataiProperties(text, style);
    TEXT.applyStrikeThroughProperties(text, style);
    TEXT.applyUnderlineProperties(text, style);
};

TEXT.getTextAttributesObject = function (text) {

    var obj = {};
    obj.fontFeatureSettings = [];
    obj.fontFeatureSettingsObject = {};

    //Attributes common with Ai/Ps
    TEXT.collectBasicProperties(obj, text);
    TEXT.collectAdvancedProperties(obj, text);
    TEXT.collectCharacterColorProperties(obj, text);
    TEXT.collectOpenTypeProperties(obj, text);
    TEXT.collectTCYProperties(obj, text);
    TEXT.collectWarichuProperties(obj, text);
    TEXT.collectMENAProperties(obj, text);

    //Id only attributes
    TEXT.collectKentenProperties(obj, text);
    TEXT.collectRubyProperties(obj, text);
    TEXT.collectShataiProperties(obj, text);
    TEXT.collectStrikeThroughProperties(obj, text);
    TEXT.collectUnderlineProperties(obj, text);

    //If we have no open type settings delete the empty array
    if (obj.fontFeatureSettings.length === 0) {
        delete obj.fontFeatureSettings;
    }

    //Delete the settings object unconditionally
    delete obj.fontFeatureSettingsObject;

    return obj;
};

TEXT.createCharacterStyle = function (style) {

    var stylesOwner = app;
    if (app.documents.length !== 0) {
        stylesOwner = app.activeDocument;
    }

    var target = stylesOwner.characterStyles.add();
    try {
        //Apply character style attributes from libraries style
        TEXT.applyBasicProperties(target, style);
        TEXT.applyAdvancedProperties(target, style);
        TEXT.applyCharacterColorProperties(target, style);
        TEXT.applyOpenTypeProperties(target, style);
        TEXT.applyTCYProperties(target, style);
        TEXT.applyWarichuProperties(target, style);
        TEXT.applyMENAProperties(target, style);

        //Apply legacy InDesign only character attributes (for text styles created in older versions of Id)
        TEXT.applyKentenProperties(target, style);
        TEXT.applyRubyProperties(target, style);
        TEXT.applyShataiProperties(target, style);
        TEXT.applyStrikeThroughProperties(target, style);
        TEXT.applyUnderlineProperties(target, style);

    } catch (err) {
        //alert(err);
    }

    return target;
};

TEXT.getCharacterStyleObject = function (source) {

    var obj = {};
    obj.fontFeatureSettings = [];
    obj.fontFeatureSettingsObject = {};

    if (source.__class__ !== 'CharacterStyle') {
        source = source.appliedCharacterStyle;
    }

    //Attributes common with Ai/Ps
    TEXT.collectBasicProperties(obj, source);
    TEXT.collectAdvancedProperties(obj, source);
    TEXT.collectCharacterColorProperties(obj, source);
    TEXT.collectOpenTypeProperties(obj, source);
    TEXT.collectTCYProperties(obj, source);
    TEXT.collectWarichuProperties(obj, source);
    TEXT.collectMENAProperties(obj, source);

    //If we have no open type settings delete the empty object and array
    if (obj.fontFeatureSettings.length === 0) {
        delete obj.fontFeatureSettings;
    }
    if (TEXT.isEmptyObject(obj.fontFeatureSettingsObject)) {
        delete obj.fontFeatureSettingsObject;
    }

    return obj;
};

TEXT.createParagraphStyle = function (style) {

    var stylesOwner = app;
    if (app.documents.length !== 0) {
        stylesOwner = app.activeDocument;
    }

    var target = stylesOwner.paragraphStyles.add();
    try {
        //Apply paragraph style attributes from libraries style
        TEXT.applyBasicProperties(target, style);
        TEXT.applyAdvancedProperties(target, style);
        TEXT.applyCharacterColorProperties(target, style);
        TEXT.applyOpenTypeProperties(target, style);
        TEXT.applyTCYProperties(target, style);
        TEXT.applyWarichuProperties(target, style);
        TEXT.applyMENAProperties(target, style);

        //And now the paragraph properties
        TEXT.applyIndentsAndSpacing(target, style);
        TEXT.applyTabs(target, style);
        TEXT.applyHyphenationProperties(target, style);
        TEXT.applyJustificationProperties(target, style);
        TEXT.applyJCompositionSettings(target, style);

    } catch (err) {
        //alert(err);
    }
    return target;
};

TEXT.getParagraphStyleObject = function (source) {

    if (source.__class__ !== 'ParagraphStyle') {
        source = source.appliedParagraphStyle;
    }

    var obj = TEXT.getParagraphStyleObjectInner(source, false);
    return obj;
};

TEXT.areValuesEqual = function (value1, value2) {
    var equal = true;
    if (value1.__class__ !== value2.__class__) {
        equal = false;
    } else if (value1.__class__ === 'Object') {
        var key;
        for (key in value1) {
            if (value1.hasOwnProperty(key)) {
                if (value2.hasOwnProperty(key)) {
                    if (!TEXT.areValuesEqual(value1[key], value2[key])) {
                        equal = false;
                        break;
                    }
                } else {
                    equal = false;
                    break;
                }
            }
        }
    } else if (value1.__class__ === 'Array') {
        if (value1.length === value2.length) {
            var i;
            for (i = 0; i < value1.length; ++i) {
                if (!TEXT.areValuesEqual(value1[i], value2[i])) {
                    equal = false;
                    break;
                }
            }
        }
    } else {
        if (value1 !== value2) {
            equal = false;
        }
    }
    return equal;
};

TEXT.removeCommonAttributes = function (obj1, obj2) {
    var key;
    for (key in obj1) {
        if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
            if (TEXT.areValuesEqual(obj1[key], obj2[key])) {
                delete obj1[key];
            }
        }
    }
};

TEXT.getParagraphStyleObjectInner = function (source, isRootStyle) {
    var obj = {};
    obj.fontFeatureSettings = [];
    obj.fontFeatureSettingsObject = {};

    //Attributes common with Ai/Ps
    TEXT.collectBasicProperties(obj, source);
    TEXT.collectAdvancedProperties(obj, source);
    TEXT.collectCharacterColorProperties(obj, source);
    TEXT.collectOpenTypeProperties(obj, source);
    TEXT.collectTCYProperties(obj, source);
    TEXT.collectWarichuProperties(obj, source);
    TEXT.collectMENAProperties(obj, source);

    TEXT.collectIndentsAndSpacing(obj, source);
    TEXT.collectTabs(obj, source);
    TEXT.collectHyphenationProperties(obj, source);
    TEXT.collectJustificationProperties(obj, source);
    TEXT.collectJCompositionSettings(obj, source);

    //If we have no open type settings delete the empty object and array
    if (obj.fontFeatureSettings.length === 0) {
        delete obj.fontFeatureSettings;
    }
    if (TEXT.isEmptyObject(obj.fontFeatureSettingsObject)) {
        delete obj.fontFeatureSettingsObject;
    }

    if (!isRootStyle) {
        //Need to remove properties contributed by the root paragraph style [No Paragraph Style].
        var rootSource = app.paragraphStyles.itemByName(AppStrings.NoParagraphStyle);
        var rootObj = TEXT.getParagraphStyleObjectInner(rootSource, true);

        TEXT.removeCommonAttributes(obj, rootObj);
        //The hyphenation switch, if ON in the paragraph style would get removed as a common attribute, as
        //it is ON in the root 'No Paragraph Style'. If the style contains other hyphenation properties which
        //are different from the root style, we put back the hyphenation switch back here.
        //We do not have to do this for underline and strikethrough switches, as these are OFF in the root style.
        TEXT.fixupParagraphHyphenationSwitch(obj);
    }

    return obj;
};

//If the source is a character style, the text properties return a NothingEnum.NOTHING value for the ignore state
//of the property. For properties which are enumerations, we don't need an explicit check for NothingEnum.NOTHING, if the
//cases for which we pick up the property are all listed. For other types, we do need and explict check.
TEXT.collectBasicProperties = function (obj, source) {
    var prefsOwner = TEXT.getPrefsOwner();

    var typographicUnits = prefsOwner.viewPreferences.typographicMeasurementUnits;
    var textSizeUnits = prefsOwner.viewPreferences.textSizeMeasurementUnits;

    var appliedFont = source.appliedFont;
    var fontStyle = source.fontStyle;

    if (appliedFont !== NothingEnum.NOTHING && appliedFont !== '') {
        if (fontStyle === NothingEnum.NOTHING) {
            fontStyle = 'Regular';
        }
        var postscriptName = TEXT.getFontPostscriptName(appliedFont, fontStyle); //Need not check fontStyle. Each font has atleast one style.
        obj.adbeFont = {
            family: appliedFont.__class__ === 'Font' ? appliedFont.fontFamily : appliedFont,
            name: postscriptName,
            postScriptName: postscriptName,
            style: fontStyle
        };
        obj.fontFamily = obj.adbeFont.family;
    }

    var pointSize = source.pointSize;
    if (pointSize !== NothingEnum.NOTHING) {
        var fontSize = TEXT.convertUnitsToPoints(textSizeUnits, pointSize);
        obj.fontSize = {type: 'pt', value : fontSize};
    }

    //Approximate font-style and font-weight for CSS
    //TODO: Handle all the following styles. See Minion Pro, Myriad Pro has many more.
    //Condensed, Condensed Italic, Semibold Condensed, Semibold Condensed Italic, Bold Condensed, Bold Condensed Italic,
    //Regular, Medium, Medium Italic, Semibold, Semibold Italic, Bold, Bold Italic
    if (fontStyle !== NothingEnum.NOTHING) {
        var style = fontStyle.toLowerCase();
        if (style.indexOf('italic') !== -1) {
            obj.fontStyle = 'italic';
        } else if (style.indexOf('oblique') !== -1) {
            obj.fontStyle = 'oblique';
        }

        if (style.indexOf('bold') !== -1) {
            obj.fontWeight = 'bold';
        }

        if (style.indexOf('light') !== -1 || style.indexOf('thin') !== -1) {
            obj.fontWeight = 'lighter';
        }
    }

    var kerningMethod = source.kerningMethod;
    if (kerningMethod !== NothingEnum.NOTHING) {
        if (kerningMethod === AppStrings.Metrics) {
            obj.adbeIlstKerningMethod = 'AutoKernType.AUTO';
        } else if (kerningMethod === AppStrings.MetricsRomanOnly) {
            obj.adbeIlstKerningMethod = 'AutoKernType.METRICSROMANONLY';
        } else if (kerningMethod === AppStrings.Optical) {
            obj.adbeIlstKerningMethod = 'AutoKernType.OPTICAL';
        } else {
            obj.adbeIlstKerningMethod = 'AutoKernType.NOAUTOKERN';
        }
    }

    var textLeading = source.leading;
    if (textLeading !== NothingEnum.NOTHING) {
        if (textLeading === Leading.AUTO) {
            obj.adbeAutoLeading = true;
        } else {
            var leading = TEXT.convertUnitsToPoints(typographicUnits, textLeading);
            obj.lineHeight = {type: 'pt', value: leading};
        }
    }

    var tracking = source.tracking;
    if (tracking !== NothingEnum.NOTHING) {
        obj.adbeTracking = tracking;
        if (obj.adbeTracking) {
            obj.letterSpacing = {type: 'em', value: (obj.adbeTracking / 1000.0).toFixed(2)};
        }
    }

    //text-decoration properties
    if (source.underline !== NothingEnum.NOTHING) {
        if (obj.textDecorationObject) {
            obj.textDecorationObject.adbeUnderline = source.underline;
        } else {
            obj.textDecorationObject = { adbeUnderline: source.underline };
        }
        //Populate the textDecoration legacy array as well, for cross-app compatibility
        if (source.underline) {
            if (obj.textDecoration) {
                obj.textDecoration.push('underline');
            } else {
                obj.textDecoration = ['underline'];
            }
        }
    }

    if (source.strikeThru !== NothingEnum.NOTHING) {
        if (obj.textDecorationObject) {
            obj.textDecorationObject.adbeStrikethrough = source.strikeThru;
        } else {
            obj.textDecorationObject = { adbeStrikethrough: source.strikeThru };
        }
        //Populate the textDecoration legacy array as well, for cross-app compatibility
        if (source.strikeThru) {
            if (obj.textDecoration) {
                obj.textDecoration.push('line-through');
            } else {
                obj.textDecoration = ['line-through'];
            }
        }
    }

    switch (source.capitalization) {
    case Capitalization.NORMAL:
        obj.fontFeatureSettingsObject.adbeCapitalization = 'FontCapsOption.NORMAL';
        break;
    case Capitalization.CAP_TO_SMALL_CAP:
        obj.fontFeatureSettingsObject.adbeCapitalization = 'FontCapsOption.ALLSMALLCAPS';
        obj.fontFeatureSettings.push('c2sc');
        break;
    case Capitalization.SMALL_CAPS:
        obj.fontFeatureSettingsObject.adbeCapitalization = 'FontCapsOption.SMALLCAPS';
        obj.fontFeatureSettings.push('smcp');
        break;
    case Capitalization.ALL_CAPS:
        obj.fontFeatureSettingsObject.adbeCapitalization = 'FontCapsOption.ALLCAPS';
        obj.textTransform = 'capitalize';
        break;
    }

    var isStyle = source.__class__ === 'CharacterStyle' || source.__class__ === 'ParagraphStyle';
    if (!isStyle) {
        if (source.noBreak) {
            obj.whiteSpace = 'nowrap';
        }
    } else {
        if (source.noBreak === true) {
            obj.whiteSpace = 'nowrap';
        } else if (source.noBreak === false) {
            obj.whiteSpace = 'wrap';
        }
    }

    switch (source.characterAlignment) {
    case CharacterAlignment.ALIGN_BASELINE:
        obj.adbeIlstAlignment = 'StyleRunAlignmentType.ROMANBASELINE';
        break;
    case CharacterAlignment.ALIGN_EM_BOTTOM:
        obj.adbeIlstAlignment = 'StyleRunAlignmentType.bottom';
        break;
    case CharacterAlignment.ALIGN_EM_CENTER:
        obj.adbeIlstAlignment = 'StyleRunAlignmentType.center';
        break;
    case CharacterAlignment.ALIGN_EM_TOP:
        obj.adbeIlstAlignment = 'StyleRunAlignmentType.top';
        break;
    case CharacterAlignment.ALIGN_ICF_BOTTOM:
        obj.adbeIlstAlignment = 'StyleRunAlignmentType.icfBottom';
        break;
    case CharacterAlignment.ALIGN_ICF_TOP:
        obj.adbeIlstAlignment = 'StyleRunAlignmentType.icfTop';
        break;
    }
};

TEXT.collectAdvancedProperties = function (obj, source) {
    var prefsOwner = TEXT.getPrefsOwner();
    var typographicUnits = prefsOwner.viewPreferences.typographicMeasurementUnits;

    var horizontalScale = source.horizontalScale;
    if (horizontalScale !== NothingEnum.NOTHING) {
        obj.adbeHorizontalScale = horizontalScale;
    }

    var verticalScale = source.verticalScale;
    if (verticalScale !== NothingEnum.NOTHING) {
        obj.adbeVerticalScale = verticalScale;
    }

    var textBaselineShift = source.baselineShift;
    if (textBaselineShift !== NothingEnum.NOTHING) {
        var baselineShift = TEXT.convertUnitsToPoints(typographicUnits, textBaselineShift);
        obj.baselineShift = {type: 'pt', value: baselineShift};
    }

    var skew = source.skew;
    if (skew !== NothingEnum.NOTHING) {
        obj.adbeIdsnSkew = skew;
    }

    var rotation = source.characterRotation;
    if (rotation !== NothingEnum.NOTHING) {
        obj.adbeIlstRotation = rotation;
    }

    var tsume = source.tsume;
    if (tsume !== NothingEnum.NOTHING) {
        obj.adbeIlstTsume = (tsume * 100).toFixed(2);
    }

    var leadingAki = source.leadingAki;
    if (leadingAki !== NothingEnum.NOTHING) {
        obj.adbeIlstAkiLeft = leadingAki;
    }

    var trailingAki = source.trailingAki;
    if (trailingAki !== NothingEnum.NOTHING) {
        obj.adbeIlstAkiRight = trailingAki;
    }

    switch (source.glyphForm) {
    case AlternateGlyphForms.EXPERT_FORM:
        obj.adbeIlstAlternateGlyphs = 'AlternateGlyphsForm.EXPERT';
        break;
    case AlternateGlyphForms.FULL_WIDTH_FORM:
        obj.adbeIlstAlternateGlyphs = 'AlternateGlyphsForm.FULLWIDTH';
        break;
    case AlternateGlyphForms.JIS04_FORM:
        obj.adbeIlstAlternateGlyphs = 'AlternateGlyphsForm.JIS04FORM';
        break;
    case AlternateGlyphForms.JIS78_FORM:
        obj.adbeIlstAlternateGlyphs = 'AlternateGlyphsForm.JIS78FORM';
        break;
    case AlternateGlyphForms.JIS83_FORM:
        obj.adbeIlstAlternateGlyphs = 'AlternateGlyphsForm.JIS83FORM';
        break;
    case AlternateGlyphForms.JIS90_FORM:
        obj.adbeIlstAlternateGlyphs = 'AlternateGlyphsForm.JIS90FORM';
        break;
    case AlternateGlyphForms.PROPORTIONAL_WIDTH_FORM:
        obj.adbeIlstAlternateGlyphs = 'AlternateGlyphsForm.PROPORTIONALWIDTH';
        break;
    case AlternateGlyphForms.QUARTER_WIDTH_FORM:
        obj.adbeIlstAlternateGlyphs = 'AlternateGlyphsForm.QUARTERWIDTH';
        break;
    case AlternateGlyphForms.THIRD_WIDTH_FORM:
        obj.adbeIlstAlternateGlyphs = 'AlternateGlyphsForm.THIRDWIDTH';
        break;
    case AlternateGlyphForms.TRADITIONAL_FORM:
        obj.adbeIlstAlternateGlyphs = 'AlternateGlyphsForm.TRADITIONAL';
        break;
    case AlternateGlyphForms.NONE:
        obj.adbeIlstAlternateGlyphs = 'AlternateGlyphsForm.DEFAULTFORM';
        break;
    case AlternateGlyphForms.MONOSPACED_HALF_WIDTH_FORM:
        obj.adbeIlstAlternateGlyphs = 'AlternateGlyphsForm.HALFWIDTH';
        break;
    case AlternateGlyphForms.NLC_FORM:
        //obj.adbeIlstAlternateGlyphs = 'AlternateGlyphsForm.DEFAULTFORM';
        break;
    }

    var appliedLanguage = source.appliedLanguage;
    if (appliedLanguage) {
        obj.adbeIdsnAppliedLanguageName = appliedLanguage.untranslatedName;
    }
};

TEXT.collectCharacterColorProperties = function (obj, source) {
    var prefsOwner = TEXT.getPrefsOwner();
    var strokeUnits = prefsOwner.viewPreferences.strokeMeasurementUnits;

    var fillColor = source.fillColor;
    if (fillColor && COLOR.isColorSupported(fillColor)) {
        obj.color = COLOR.solidColorToData(fillColor);
    }

    //Only add stroke color if we have one
    var strokeColor = source.strokeColor;
    if (strokeColor && COLOR.isColorSupported(strokeColor)) {
        obj.adbeIlstStrokeColor = COLOR.solidColorToData(strokeColor);
    }

    //Only gather the stroke weight if there is a color specified
    if (obj.adbeIlstStrokeColor) {
        if (source.strokeWeight !== NothingEnum.NOTHING) {
            var strokeWeight = TEXT.convertUnitsToPoints(strokeUnits, source.strokeWeight);
            obj.adbeIlstStrokeWeight = {type: 'pt', value: strokeWeight};
        }
    }

    var overprintFill = source.overprintFill;
    if (overprintFill !== NothingEnum.NOTHING) {
        obj.adbeIlstOverprintFill = overprintFill;
    }

    var overprintStroke = source.overprintStroke;
    if (overprintStroke !== NothingEnum.NOTHING) {
        obj.adbeIlstOverprintStroke = overprintStroke;
    }

    if (obj.color) {
        var fillTint = source.fillTint;
        if (fillTint !== NothingEnum.NOTHING) {
            obj.adbeIdsnFillTint = fillTint;
        }
    }

    if (obj.adbeIlstStrokeColor) {
        var strokeTint = source.strokeTint;
        if (strokeTint !== NothingEnum.NOTHING) {
            obj.adbeIdsnStrokeTint = strokeTint;
        }
    }

    var strokeAlignment = source.strokeAlignment;
    if (strokeAlignment !== NothingEnum.NOTHING) {
        obj.adbeIdsnStrokeAlignment = 'TextStrokeAlign.' + strokeAlignment.toString();
    }

    var endJoin = source.endJoin;
    if (endJoin !== NothingEnum.NOTHING) {
        obj.adbeIdsnEndJoin = 'EndJoin.' + endJoin.toString();
    }

    if (obj.adbeIdsnEndJoin === 'EndJoin.MITER_END_JOIN') {
        obj.adbeIdsnMiterLimit = source.miterLimit;
    }
};

TEXT.collectOpenTypeProperties = function (obj, source) {
    switch (source.otfFigureStyle) {
    case OTFFigureStyle.DEFAULT_VALUE:
        obj.adbeIlstFigureStyle = 'FigureStyleType.DEFAULTFIGURESTYLE';
        break;
    case OTFFigureStyle.PROPORTIONAL_LINING:
        obj.adbeIlstFigureStyle = 'FigureStyleType.PROPORTIONAL';
        break;
    case OTFFigureStyle.PROPORTIONAL_OLDSTYLE:
        obj.adbeIlstFigureStyle = 'FigureStyleType.PROPORTIONALOLDSTYLE';
        break;
    case OTFFigureStyle.TABULAR_LINING:
        obj.adbeIlstFigureStyle = 'FigureStyleType.TABULAR';
        break;
    case OTFFigureStyle.TABULAR_OLDSTYLE:
        obj.adbeIlstFigureStyle = 'FigureStyleType.TABULAROLDSTYLE';
        break;
    }

    switch (source.position) {
    case Position.NORMAL:
        obj.adbeIlstOpenTypePosition = 'FontOpenTypePositionOption.OPENTYPEDEFAULT';
        break;
    case Position.OT_DENOMINATOR:
        obj.adbeIlstOpenTypePosition = 'FontOpenTypePositionOption.DENOMINATOR';
        break;
    case Position.OT_NUMERATOR:
        obj.adbeIlstOpenTypePosition = 'FontOpenTypePositionOption.NUMERATOR';
        break;
    case Position.OT_SUBSCRIPT:
        obj.adbeIlstOpenTypePosition = 'FontOpenTypePositionOption.OPENTYPESUBSCRIPT';
        break;
    case Position.OT_SUPERSCRIPT:
        obj.adbeIlstOpenTypePosition = 'FontOpenTypePositionOption.OPENTYPESUPERSCRIPT';
        break;
    }

    //OpenType feature settings
    //Populate the fontFeatureSettings legacy array as well, for cross-app compatibility
    if (source.otfSwash !== NothingEnum.NOTHING) {
        obj.fontFeatureSettingsObject.adbeOTFSwash = source.otfSwash;
        if (source.otfSwash) {
            obj.fontFeatureSettings.push('swsh');
        }
    }
    if (source.otfOrdinal !== NothingEnum.NOTHING) {
        obj.fontFeatureSettingsObject.adbeOTFOrdinals = source.otfOrdinal;
        if (source.otfOrdinal) {
            obj.fontFeatureSettings.push('ordn');
        }
    }
    if (source.otfDiscretionaryLigature !== NothingEnum.NOTHING) {
        obj.fontFeatureSettingsObject.adbeOTFDiscretionaryLigatures = source.otfDiscretionaryLigature;
        if (source.otfDiscretionaryLigature) {
            obj.fontFeatureSettings.push('dlig');
        }
    }
    if (source.otfContextualAlternate !== NothingEnum.NOTHING) {
        obj.fontFeatureSettingsObject.adbeOTFContextualAlternates = source.otfContextualAlternate;
        if (source.otfContextualAlternate) {
            obj.fontFeatureSettings.push('clig');
        }
    }
    if (source.ligatures !== NothingEnum.NOTHING) {
        obj.fontFeatureSettingsObject.adbeLigatures = source.ligatures;
        if (source.ligatures) {
            obj.fontFeatureSettings.push('liga');
        }
    }
    if (source.otfFraction !== NothingEnum.NOTHING) {
        obj.fontFeatureSettingsObject.adbeOTFFractions = source.otfFraction;
        if (source.otfFraction) {
            obj.fontFeatureSettings.push('frac');
        }
    }
    if (source.otfTitling !== NothingEnum.NOTHING) {
        obj.fontFeatureSettingsObject.adbeOTFTitlingAlternates = source.otfTitling;
        if (source.otfTitling) {
            obj.fontFeatureSettings.push('titl');
        }
    }
    if (source.otfStylisticAlternate !== NothingEnum.NOTHING) {
        obj.fontFeatureSettingsObject.adbeOTFStylisticAlternates = source.otfStylisticAlternate;
        if (source.otfStylisticAlternate) {
            obj.fontFeatureSettings.push('salt');
        }
    }
    if (source.otfHVKana !== NothingEnum.NOTHING) {
        obj.fontFeatureSettingsObject.adbeOTFHVKana = source.otfHVKana;
        if (source.otfHVKana) {
            obj.fontFeatureSettings.push('hvkn');
        }
    }
    if (source.otfRomanItalics !== NothingEnum.NOTHING) {
        obj.fontFeatureSettingsObject.adbeOTFRomanItalics = source.otfRomanItalics;
        if (source.otfRomanItalics) {
            obj.fontFeatureSettings.push('rita');
        }
    }
    if (source.otfSlashedZero !== NothingEnum.NOTHING) {
        obj.fontFeatureSettingsObject.adbeOTFSlashedZero = source.otfSlashedZero;
        if (source.otfSlashedZero) {
            obj.fontFeatureSettings.push('szer');
        }
    }

    switch (source.position) {
    case Position.NORMAL:
    case Position.SUBSCRIPT:
    case Position.SUPERSCRIPT:
        obj.fontFeatureSettingsObject.adbePosition = 'Position.' + source.position.toString();
        break;
    }
    if (source.position === Position.SUBSCRIPT) {
        obj.fontFeatureSettings.push('subs');
    } else if (source.position === Position.SUPERSCRIPT) {
        obj.fontFeatureSettings.push('sups');
    }

    var proportionalMetrics = source.otfProportionalMetrics;
    if (proportionalMetrics !== NothingEnum.NOTHING) {
        obj.adbeIlstProportionalMetrics = proportionalMetrics;
    }

    var positionalForm = source.positionalForm;
    if (positionalForm !== NothingEnum.NOTHING) {
        obj.adbeIdsnPositionalForm = 'PositionalForm.' + positionalForm.toString();
    }

    var otfStylisticSets = source.otfStylisticSets;
    if (otfStylisticSets !== NothingEnum.NOTHING) {
        obj.adbeIdsnOtfStylisticSets = otfStylisticSets;
    }
};

TEXT.collectTCYProperties = function (obj, source) {
    var tatechuyoko = source.tatechuyoko;
    if (tatechuyoko !== NothingEnum.NOTHING) {
        obj.adbeIdsnTatechuyoko = tatechuyoko;
    }

    //Returns in pts.
    var tatechuyokoXOffset = source.tatechuyokoXOffset;
    if (tatechuyokoXOffset !== NothingEnum.NOTHING) {
        obj.adbeIlstTateChuYokoHorizontal = tatechuyokoXOffset;
    }
    var tatechuyokoYOffset = source.tatechuyokoYOffset;
    if (tatechuyokoYOffset !== NothingEnum.NOTHING) {
        obj.adbeIlstTateChuYokoVertical = tatechuyokoYOffset;
    }
};

TEXT.collectWarichuProperties = function (obj, source) {
    var warichu = source.warichu;
    if (warichu !== NothingEnum.NOTHING) {
        obj.adbeIlstWariChuEnabled = warichu;
    }

    if (obj.adbeIlstWariChuEnabled) {
        switch (source.warichuAlignment) {
        case WarichuAlignment.AUTO:
            obj.adbeIlstWariChuJustification = 'WariChuJustificationType.WARICHUAUTOJUSTIFY';
            break;
        case WarichuAlignment.CENTER_ALIGN:
            obj.adbeIlstWariChuJustification = 'WariChuJustificationType.Center';
            break;
        case WarichuAlignment.CENTER_JUSTIFIED:
            obj.adbeIlstWariChuJustification = 'WariChuJustificationType.WARICHUFULLJUSTIFYLASTLINECENTER';
            break;
        case WarichuAlignment.FULLY_JUSTIFIED:
            obj.adbeIlstWariChuJustification = 'WariChuJustificationType.WARICHUFULLJUSTIFY';
            break;
        case WarichuAlignment.LEFT_ALIGN:
            obj.adbeIlstWariChuJustification = 'WariChuJustificationType.Left';
            break;
        case WarichuAlignment.LEFT_JUSTIFIED:
            obj.adbeIlstWariChuJustification = 'WariChuJustificationType.WARICHUFULLJUSTIFYLASTLINELEFT';
            break;
        case WarichuAlignment.RIGHT_ALIGN:
            obj.adbeIlstWariChuJustification = 'WariChuJustificationType.Right';
            break;
        case WarichuAlignment.RIGHT_JUSTIFIED:
            obj.adbeIlstWariChuJustification = 'WariChuJustificationType.WARICHUFULLJUSTIFYLASTLINERIGHT';
            break;
        }

        var warichuCharsAfterBreak = source.warichuCharsAfterBreak;
        if (warichuCharsAfterBreak !== NothingEnum.NOTHING) {
            obj.adbeIlstWariChuCharactersAfterBreak = warichuCharsAfterBreak;
        }
        var warichuCharsBeforeBreak = source.warichuCharsBeforeBreak;
        if (warichuCharsBeforeBreak !== NothingEnum.NOTHING) {
            obj.adbeIlstWariChuCharactersBeforeBreak = warichuCharsBeforeBreak;
        }
        var warichuLineSpacing = source.warichuLineSpacing;
        if (warichuLineSpacing !== NothingEnum.NOTHING) {
            obj.adbeIlstWariChuLineGap = warichuLineSpacing; //Returns in pts.
        }
        var warichuLines = source.warichuLines;
        if (warichuLines !== NothingEnum.NOTHING) {
            obj.adbeIlstWariChuLines = warichuLines;
        }
        var warichuSize = source.warichuSize;
        if (warichuSize !== NothingEnum.NOTHING) {
            obj.adbeIlstWariChuScale = warichuSize;
        }
    }
};

TEXT.collectMENAProperties = function (obj, source) {
    var digitsType = source.digitsType;
    if (digitsType !== NothingEnum.NOTHING) {
        obj.adbeIdsnDigitsType = 'DigitsTypeOptions.' + digitsType.toString();
    }

    var kashidas = source.kashidas;
    if (kashidas !== NothingEnum.NOTHING) {
        obj.adbeIdsnKashidas = 'KashidasOptions.' + kashidas.toString();
    }

    var characterDirection = source.characterDirection;
    if (characterDirection !== NothingEnum.NOTHING) {
        obj.adbeIdsnCharacterDirection = 'CharacterDirectionOptions.' + characterDirection.toString();
    }

    var diacriticPosition = source.diacriticPosition;
    if (characterDirection !== NothingEnum.NOTHING) {
        obj.adbeIdsnDiacriticPosition = 'DiacriticPositionOptions.' + diacriticPosition.toString();
    }

    var xOffsetDiacritic = source.xOffsetDiacritic;
    if (xOffsetDiacritic !== NothingEnum.NOTHING) {
        obj.adbeIdsnXOffsetDiacritic = xOffsetDiacritic;
    }

    var yOffsetDiacritic = source.yOffsetDiacritic;
    if (yOffsetDiacritic !== NothingEnum.NOTHING) {
        obj.adbeIdsnYOffsetDiacritic = yOffsetDiacritic;
    }

    //MENA OpenType feature settings
    //Populate the fontFeatureSettings legacy array as well, for cross-app compatibility
    if (source.otfJustificationAlternate !== NothingEnum.NOTHING) {
        obj.fontFeatureSettingsObject.adbeOTFJustificationAlternates = source.otfJustificationAlternate;
        if (source.otfJustificationAlternate) {
            obj.fontFeatureSettings.push('jalt');
        }
    }
    if (source.otfStretchedAlternate !== NothingEnum.NOTHING) {
        obj.fontFeatureSettingsObject.adbeOTFStretchedAlternates = source.otfStretchedAlternate;
        if (source.otfStretchedAlternate) {
            obj.fontFeatureSettings.push('stal');
        }
    }
    if (source.otfOverlapSwash !== NothingEnum.NOTHING) {
        obj.fontFeatureSettingsObject.adbeOTFOverlapSwash = source.otfOverlapSwash;
        if (source.otfOverlapSwash) {
            obj.fontFeatureSettings.push('olsh');
        }
    }
};

// Id only properties - Kenten, Ruby, Shatai, Strikethrough attributes, Underline attributes
// Called only for text, these properties don't need the NOTHING checks

TEXT.collectKentenProperties = function (obj, text) {
    obj.adbeIdsnKentenKind = 'KentenKind.' + text.kentenKind.toString();
    if (obj.adbeIdsnKentenKind !== 'KentenKind.NONE') {

        obj.adbeIdsnKentenPlacement = text.kentenPlacement; //Returns in pts.
        obj.adbeIdsnKentenPosition = 'RubyKentenPosition.' + text.kentenPosition.toString();
        obj.adbeIdsnKentenFontSize = text.kentenFontSize; //Returns in pts.
        obj.adbeIdsnKentenAlignment = 'KentenAlignment.' + text.kentenAlignment.toString();
        obj.adbeIdsnKentenXScale = text.kentenXScale;
        obj.adbeIdsnKentenYScale = text.kentenYScale;

        if (obj.adbeIdsnKentenKind === 'KentenKind.CUSTOM') {
            if (text.kentenFont) {
                try {
                    var postscriptName = TEXT.getFontPostscriptName(text.kentenFont, text.kentenFontStyle);
                    obj.adbeIdsnKentenFont = {
                        family: text.kentenFont.fontFamily,
                        style: text.kentenFontStyle,
                        name: postscriptName,
                        postScriptName: postscriptName
                    };
                } catch (ex1) {
                    //alert(ex1);
                }
            }
            obj.adbeIdsnKentenCustomCharacter = text.kentenCustomCharacter;
            obj.adbeIdsnKentenCharacterSet = 'KentenCharacterSet.' + text.kentenCharacterSet.toString();
        }

        obj.adbeIdsnKentenTint = text.kentenTint === -1 ? 'KentenTint.AUTO' : text.kentenTint;
        obj.adbeIdsnKentenWeight = text.kentenWeight === -1 ? 'KentenWeight.AUTO' : text.kentenWeight; //Returns in pts.
        obj.adbeIdsnKentenOverprintFill = 'AdornmentOverprint.' + text.kentenOverprintFill.toString();
        obj.adbeIdsnKentenOverprintStroke = 'AdornmentOverprint.' + text.kentenOverprintStroke.toString();

        if (TEXT.isColorSupported(text.kentenFillColor)) {
            obj.adbeIdsnKentenFillColor = TEXT.colorToData(text.kentenFillColor);
        }
        if (TEXT.isColorSupported(text.kentenStrokeColor)) {
            obj.adbeIdsnKentenStrokeColor = TEXT.colorToData(text.kentenStrokeColor);
        }
    }
};

TEXT.collectRubyProperties = function (obj, text) {
    obj.adbeIdsnRubyFlag = text.rubyFlag;
    if (obj.adbeIdsnRubyFlag) {

        obj.adbeIdsnRubyType = 'RubyType.' + text.rubyType.toString();
        obj.adbeIdsnRubyAlignment = 'RubyAlignment.' + text.rubyAlignment.toString();
        obj.adbeIdsnRubyPosition = 'RubyKentenPosition.' + text.rubyPosition.toString();
        obj.adbeIdsnRubyXOffset = text.rubyXOffset; //Returns in pts.
        obj.adbeIdsnRubyYOffset = text.rubyYOffset; //Returns in pts.

        if (text.rubyFont) {
            try {
                var postscriptName = TEXT.getFontPostscriptName(text.rubyFont, text.rubyFontStyle);
                obj.adbeIdsnRubyFont = {
                    family: text.rubyFont.fontFamily,
                    style: text.rubyFontStyle,
                    name: postscriptName,
                    postScriptName: postscriptName
                };
            } catch (ex2) {
                //alert(ex2);
            }
        }

        obj.adbeIdsnRubyFontSize = text.rubyFontSize; //Returns in pts.
        obj.adbeIdsnRubyXScale = text.rubyXScale;
        obj.adbeIdsnRubyYScale = text.rubyYScale;
        obj.adbeIdsnRubyOpenTypePro = text.rubyOpenTypePro;
        obj.adbeIdsnRubyAutoTcyDigits = text.rubyAutoTcyDigits;
        obj.adbeIdsnRubyAutoTcyIncludeRoman = text.rubyAutoTcyIncludeRoman;
        obj.adbeIdsnRubyAutoTcyAutoScale = text.rubyAutoTcyAutoScale;

        obj.adbeIdsnRubyParentOverhangAmount = 'RubyOverhang.' + text.rubyParentOverhangAmount.toString();
        obj.adbeIdsnRubyParentSpacing = 'RubyParentSpacing.' + text.rubyParentSpacing.toString();
        obj.adbeIdsnRubyAutoScaling = text.rubyAutoScaling;
        if (obj.adbeIdsnRubyAutoScaling) {
            obj.adbeIdsnRubyParentScalingPercent = text.rubyParentScalingPercent;
        }
        obj.adbeIdsnRubyAutoAlign = text.rubyAutoAlign;

        if (TEXT.isColorSupported(text.rubyFill)) {
            obj.adbeIdsnRubyFillColor = TEXT.colorToData(text.rubyFill);
        }
        if (TEXT.isColorSupported(text.rubyStroke)) {
            obj.adbeIdsnRubyStrokeColor = TEXT.colorToData(text.rubyStroke);
        }

        obj.adbeIdsnRubyTint = text.rubyTint === -1 ? 'RubyTint.AUTO' : text.rubyTint;
        obj.adbeIdsnRubyWeight = text.rubyWeight === -1 ? 'RubyWeight.AUTO' : text.rubyWeight; //Returns in pts.
        obj.adbeIdsnRubyOverprintFill = 'AdornmentOverprint.' + text.rubyOverprintFill.toString();
        obj.adbeIdsnRubyOverprintStroke = 'AdornmentOverprint.' + text.rubyOverprintStroke.toString();
    }
};

TEXT.collectShataiProperties = function (obj, text) {
    obj.adbeIdsnShataiMagnification = text.shataiMagnification;
    obj.adbeIdsnShataiDegreeAngle = text.shataiDegreeAngle;
    obj.adbeIdsnShataiAdjustRotation = text.shataiAdjustRotation;
    obj.adbeIdsnShataiAdjustTsume = text.shataiAdjustTsume;
};

TEXT.collectStrikeThroughProperties = function (obj, text) {
    var prefsOwner = TEXT.getPrefsOwner();
    var strokeUnits = prefsOwner.viewPreferences.strokeMeasurementUnits;

    if (text.strikeThru) {
        var strikeThroughWeight = TEXT.convertUnitsToPoints(strokeUnits, text.strikeThroughWeight);
        obj.adbeIdsnStrikeThroughWeight = {type: 'pt', value: strikeThroughWeight};
        obj.adbeIdsnStrikeThroughType = TEXT.strokeStyleToData(text.strikeThroughType);
        var strikeThroughOffset = TEXT.convertUnitsToPoints(strokeUnits, text.strikeThroughOffset);
        obj.adbeIdsnStrikeThroughOffset = {type: 'pt', value: strikeThroughOffset};

        if (TEXT.isColorSupported(text.strikeThroughColor)) {
            obj.adbeIdsnStrikeThroughColor = TEXT.colorToData(text.strikeThroughColor);
            obj.adbeIdsnStrikeThroughTint = text.strikeThroughTint;
            obj.adbeIdsnStrikeThroughOverprint = text.strikeThroughOverprint;
        }

        if (TEXT.isColorSupported(text.strikeThroughGapColor)) {
            obj.adbeIdsnStrikeThroughGapColor = TEXT.colorToData(text.strikeThroughGapColor);
            obj.adbeIdsnStrikeThroughGapTint = text.strikeThroughGapTint;
            obj.adbeIdsnStrikeThroughGapOverprint = text.strikeThroughGapOverprint;
        }
    }
};

TEXT.collectUnderlineProperties = function (obj, text) {
    var prefsOwner = TEXT.getPrefsOwner();
    var strokeUnits = prefsOwner.viewPreferences.strokeMeasurementUnits;

    if (text.underline) {
        var underlineWeight = TEXT.convertUnitsToPoints(strokeUnits, text.underlineWeight);
        obj.adbeIdsnUnderlineWeight = {type: 'pt', value: underlineWeight};
        obj.adbeIdsnUnderlineType = TEXT.strokeStyleToData(text.underlineType);
        var underlineOffset = TEXT.convertUnitsToPoints(strokeUnits, text.underlineOffset);
        obj.adbeIdsnUnderlineOffset = {type: 'pt', value: underlineOffset};

        if (TEXT.isColorSupported(text.underlineColor)) {
            obj.adbeIdsnUnderlineColor = TEXT.colorToData(text.underlineColor);
            obj.adbeIdsnUnderlineTint = text.underlineTint;
            obj.adbeIdsnUnderlineOverprint = text.underlineOverprint;
        }

        if (TEXT.isColorSupported(text.underlineGapColor)) {
            obj.adbeIdsnUnderlineGapColor = TEXT.colorToData(text.underlineGapColor);
            obj.adbeIdsnUnderlineGapTint = text.underlineGapTint;
            obj.adbeIdsnUnderlineGapOverprint = text.underlineGapOverprint;
        }
    }
};

TEXT.applyBasicProperties = function (target, style) {
    var font = TEXT.dataToFont(style.adbeFont, style.fontFamily, true);
    if (font) {
        try {
            target.appliedFont = font;
            target.fontStyle = style.adbeFont.style;
        } catch (ex) {
            //alert(ex);
        }
    }

    var properties = {};

    if (style.fontSize) {
        var size = new UnitValue(style.fontSize.value, style.fontSize.type);
        properties.pointSize = size.as('pt') + ' pt';
    }

    if (style.adbeIlstKerningMethod === 'AutoKernType.AUTO') {
        properties.kerningMethod = AppStrings.Metrics;
    } else if (style.adbeIlstKerningMethod === 'AutoKernType.OPTICAL') {
        properties.kerningMethod = AppStrings.Optical;
    } else if (style.adbeIlstKerningMethod === 'AutoKernType.METRICSROMANONLY') {
        properties.kerningMethod = AppStrings.MetricsRomanOnly;
    } else if (style.adbeIlstKerningMethod === 'AutoKernType.NOAUTOKERN') {
        properties.kerningValue = 0;
    }

    if (style.adbeAutoLeading === true) {
        properties.leading = Leading.AUTO;
    } else if (style.lineHeight) {
        var leading = new UnitValue(style.lineHeight.value, style.lineHeight.type);
        properties.leading = leading.as('pt') + ' pt';
    }

    if (style.abdeTracking !== undefined) {
        properties.tracking = style.adbeTracking;
    } else if (style.letterSpacing) {
        properties.tracking = style.letterSpacing.value * 1000;
    }

    var textDecoration = style.textDecorationObject;
    if (!textDecoration) {
        textDecoration = style.textDecoration;
    }
    if (textDecoration) {
        if (textDecoration.__class__ === 'Array') {
            properties.underline = textDecoration.indexOf('underline') !== -1;
            properties.strikeThru = textDecoration.indexOf('line-through') !== -1;
        } else if (textDecoration.__class__ === 'Object') {
            if (textDecoration.adbeUnderline !== undefined) {
                properties.underline = textDecoration.adbeUnderline;
            }
            if (textDecoration.adbeStrikethrough !== undefined) {
                properties.strikeThru = textDecoration.adbeStrikethrough;
            }
        }
    }

    //Use the fontFeatureSettings object if it exists, otherwise see if we have the legacy settings array
    var fontFeatureSettings = style.fontFeatureSettingsObject;
    if (!fontFeatureSettings) {
        fontFeatureSettings = style.fontFeatureSettings;
    }
    if (fontFeatureSettings) {
        if (fontFeatureSettings.__class__ === 'Array' && fontFeatureSettings.length > 0) {
            if (fontFeatureSettings.indexOf('c2sc') !== -1) {
                properties.capitalization = Capitalization.CAP_TO_SMALL_CAP;
            } else if (fontFeatureSettings.indexOf('smcp') !== -1) {
                properties.capitalization = Capitalization.SMALL_CAPS;
            }
        } else if (fontFeatureSettings.__class__ === 'Object' && fontFeatureSettings.adbeCapitalization) {
            switch (fontFeatureSettings.adbeCapitalization) {
            case 'FontCapsOption.NORMAL':
                properties.capitalization = Capitalization.NORMAL;
                break;
            case 'FontCapsOption.ALLSMALLCAPS':
                properties.capitalization = Capitalization.CAP_TO_SMALL_CAP;
                break;
            case 'FontCapsOption.SMALLCAPS':
                properties.capitalization = Capitalization.SMALL_CAPS;
                break;
            case 'FontCapsOption.ALLCAPS':
                properties.capitalization = Capitalization.ALL_CAPS;
                break;
            }
        }
    }

    var isStyle = target.__class__ === 'CharacterStyle' || target.__class__ === 'ParagraphStyle';

    if (style.textTransform === 'capitalize') {
        properties.capitalization = Capitalization.ALL_CAPS;
    } else if (properties.capitalization === undefined) {
        if (!isStyle) {
            properties.capitalization = Capitalization.NORMAL;
        }
    }

    if (!isStyle) {
        properties.noBreak = style.whiteSpace === 'nowrap';
    } else {
        if (style.whiteSpace === 'nowrap') {
            properties.noBreak = true;
        } else if (style.whiteSpace === 'wrap') {
            properties.noBreak = false;
        }
    }

    if (style.adbeIlstAlignment) {
        switch (style.adbeIlstAlignment) {
        case 'StyleRunAlignmentType.ROMANBASELINE':
            properties.characterAlignment = CharacterAlignment.ALIGN_BASELINE;
            break;
        case 'StyleRunAlignmentType.bottom':
            properties.characterAlignment = CharacterAlignment.ALIGN_EM_BOTTOM;
            break;
        case 'StyleRunAlignmentType.center':
            properties.characterAlignment = CharacterAlignment.ALIGN_EM_CENTER;
            break;
        case 'StyleRunAlignmentType.top':
            properties.characterAlignment = CharacterAlignment.ALIGN_EM_TOP;
            break;
        case 'StyleRunAlignmentType.icfBottom':
            properties.characterAlignment = CharacterAlignment.ALIGN_ICF_BOTTOM;
            break;
        case 'StyleRunAlignmentType.icfTop':
            properties.characterAlignment = CharacterAlignment.ALIGN_ICF_TOP;
            break;
        }
    }

    target.properties = properties;
};

TEXT.applyAdvancedProperties = function (target, style) {
    var properties = {};

    if (style.adbeHorizontalScale !== undefined) {
        properties.horizontalScale = style.adbeHorizontalScale;
    }

    if (style.adbeVerticalScale !== undefined) {
        properties.verticalScale = style.adbeVerticalScale;
    }

    if (style.baselineShift) {
        var baselineShift = new UnitValue(style.baselineShift.value, style.baselineShift.type);
        properties.baselineShift = baselineShift.as('pt') + ' pt';
    }

    if (style.adbeIdsnSkew !== undefined) {
        properties.skew = style.adbeIdsnSkew;
    }

    if (style.adbeIlstRotation !== undefined) {
        properties.characterRotation = style.adbeIlstRotation;
    }

    if (style.adbeIlstTsume !== undefined) {
        properties.tsume = style.adbeIlstTsume / 100.0;
    }

    if (style.adbeIlstAkiLeft !== undefined) {
        properties.leadingAki = style.adbeIlstAkiLeft;
    }

    if (style.adbeIlstAkiRight !== undefined) {
        properties.trailingAki = style.adbeIlstAkiRight;
    }

    if (style.adbeIlstAlternateGlyphs) {
        switch (style.adbeIlstAlternateGlyphs) {
        case 'AlternateGlyphsForm.EXPERT':
            properties.glyphForm = AlternateGlyphForms.EXPERT_FORM;
            break;
        case 'AlternateGlyphsForm.FULLWIDTH':
            properties.glyphForm = AlternateGlyphForms.FULL_WIDTH_FORM;
            break;
        case 'AlternateGlyphsForm.JIS04FORM':
            properties.glyphForm = AlternateGlyphForms.JIS04_FORM;
            break;
        case 'AlternateGlyphsForm.JIS78FORM':
            properties.glyphForm = AlternateGlyphForms.JIS78_FORM;
            break;
        case 'AlternateGlyphsForm.JIS83FORM':
            properties.glyphForm = AlternateGlyphForms.JIS83_FORM;
            break;
        case 'AlternateGlyphsForm.JIS90FORM':
            properties.glyphForm = AlternateGlyphForms.JIS90_FORM;
            break;
        case 'AlternateGlyphsForm.PROPORTIONALWIDTH':
            properties.glyphForm = AlternateGlyphForms.PROPORTIONAL_WIDTH_FORM;
            break;
        case 'AlternateGlyphsForm.QUARTERWIDTH':
            properties.glyphForm = AlternateGlyphForms.QUARTER_WIDTH_FORM;
            break;
        case 'AlternateGlyphsForm.THIRDWIDTH':
            properties.glyphForm = AlternateGlyphForms.THIRD_WIDTH_FORM;
            break;
        case 'AlternateGlyphsForm.TRADITIONAL':
            properties.glyphForm = AlternateGlyphForms.TRADITIONAL_FORM;
            break;
        case 'AlternateGlyphsForm.DEFAULTFORM':
            properties.glyphForm = AlternateGlyphForms.NONE;
            break;
        case 'AlternateGlyphsForm.HALFWIDTH':
            properties.glyphForm = AlternateGlyphForms.MONOSPACED_HALF_WIDTH_FORM;
            break;
        }
    }

    if (style.adbeIdsnAppliedLanguageName && style.adbeIdsnAppliedLanguageName !== '[No Language]') {
        var language = app.languagesWithVendors.itemByName(style.adbeIdsnAppliedLanguageName);
        if (language && language.isValid) {
            properties.appliedLanguage = language;
        }
    }
    target.properties = properties;
};

TEXT.applyCharacterColorProperties = function (target, style) {
    var properties = {};

    if (style.color) {
        properties.fillColor = COLOR.dataToSolidColor(style.color);
    }

    if (style.adbeIlstStrokeColor) {
        properties.strokeColor = COLOR.dataToSolidColor(style.adbeIlstStrokeColor);
    }

    if (style.adbeIlstStrokeColor && style.adbeIlstStrokeWeight !== undefined) {
        properties.strokeWeight = style.adbeIlstStrokeWeight + ' pt';
    }

    if (style.adbeIlstOverprintFill !== undefined) {
        properties.overprintFill = style.adbeIlstOverprintFill;
    }

    if (style.adbeIlstOverprintStroke !== undefined) {
        properties.overprintStroke = style.adbeIlstOverprintStroke;
    }

    if (style.color && style.adbeIdsnFillTint !== undefined) {
        properties.fillTint = style.adbeIdsnFillTint;
    }

    if (style.adbeIlstStrokeColor && style.adbeIdsnStrokeTint !== undefined) {
        properties.strokeTint = style.adbeIdsnStrokeTint;
    }

    if (style.adbeIdsnStrokeAlignment) {
        if (style.adbeIdsnStrokeAlignment === 'TextStrokeAlign.CENTER_ALIGNMENT') {
            properties.strokeAlignment = TextStrokeAlign.CENTER_ALIGNMENT;
        } else if (style.adbeIdsnStrokeAlignment === 'TextStrokeAlign.OUTSIDE_ALIGNMENT') {
            properties.strokeAlignment = TextStrokeAlign.OUTSIDE_ALIGNMENT;
        }
    }

    if (style.adbeIdsnEndJoin) {
        switch (style.adbeIdsnEndJoin) {
        case 'EndJoin.MITER_END_JOIN':
            properties.endJoin = EndJoin.MITER_END_JOIN;
            if (style.adbeIdsnMiterLimit !== undefined) {
                properties.miterLimit = style.adbeIdsnMiterLimit;
            }
            break;
        case 'EndJoin.ROUND_END_JOIN':
            properties.endJoin = EndJoin.ROUND_END_JOIN;
            break;
        case 'EndJoin.BEVEL_END_JOIN':
            properties.endJoin = EndJoin.BEVEL_END_JOIN;
            break;
        }
    }

    target.properties = properties;
};

TEXT.applyOpenTypeProperties = function (target, style) {
    var properties = {};

    if (style.adbeIlstFigureStyle) {
        switch (style.adbeIlstFigureStyle) {
        case 'FigureStyleType.DEFAULTFIGURESTYLE':
            properties.otfFigureStyle = OTFFigureStyle.DEFAULT_VALUE;
            break;
        case 'FigureStyleType.PROPORTIONAL':
            properties.otfFigureStyle = OTFFigureStyle.PROPORTIONAL_LINING;
            break;
        case 'FigureStyleType.PROPORTIONALOLDSTYLE':
            properties.otfFigureStyle = OTFFigureStyle.PROPORTIONAL_OLDSTYLE;
            break;
        case 'FigureStyleType.TABULAR':
            properties.otfFigureStyle = OTFFigureStyle.TABULAR_LINING;
            break;
        case 'FigureStyleType.TABULAROLDSTYLE':
            properties.otfFigureStyle = OTFFigureStyle.TABULAR_OLDSTYLE;
            break;
        }
    }

    if (style.adbeIlstOpenTypePosition) {
        switch (style.adbeIlstOpenTypePosition) {
        case 'FontOpenTypePositionOption.OPENTYPEDEFAULT':
            properties.position = Position.NORMAL;
            break;
        case 'FontOpenTypePositionOption.DENOMINATOR':
            properties.position = Position.OT_DENOMINATOR;
            break;
        case 'FontOpenTypePositionOption.NUMERATOR':
            properties.position = Position.OT_NUMERATOR;
            break;
        case 'FontOpenTypePositionOption.OPENTYPESUBSCRIPT':
            properties.position = Position.OT_SUBSCRIPT;
            break;
        case 'FontOpenTypePositionOption.OPENTYPESUPERSCRIPT':
            properties.position = Position.OT_SUPERSCRIPT;
            break;
        }
    }

    //OpenType feature settings
    //Use the fontFeatureSettings object if it exists, otherwise see if we have the legacy settings array
    var fontFeatureSettings = style.fontFeatureSettingsObject;
    if (!fontFeatureSettings) {
        fontFeatureSettings = style.fontFeatureSettings;
    }
    if (fontFeatureSettings) {
        if (fontFeatureSettings.__class__ === 'Array' && fontFeatureSettings.length > 0) {

            properties.otfSwash = fontFeatureSettings.indexOf('swsh') !== -1;
            properties.otfOrdinal = fontFeatureSettings.indexOf('ordn') !== -1;
            properties.otfDiscretionaryLigature = fontFeatureSettings.indexOf('dlig') !== -1;
            properties.otfContextualAlternate = fontFeatureSettings.indexOf('clig') !== -1;
            properties.ligatures = fontFeatureSettings.indexOf('liga') !== -1;
            properties.otfFraction = fontFeatureSettings.indexOf('frac') !== -1;
            properties.otfTitling = fontFeatureSettings.indexOf('titl') !== -1;
            properties.otfStylisticAlternate = fontFeatureSettings.indexOf('salt') !== -1;
            properties.otfHVKana = fontFeatureSettings.indexOf('hvkn') !== -1;
            properties.otfRomanItalics = fontFeatureSettings.indexOf('rita') !== -1;
            properties.otfSlashedZero = fontFeatureSettings.indexOf('szer') !== -1;

            if (fontFeatureSettings.indexOf('sups') !== -1) {
                properties.position = Position.SUPERSCRIPT;
            } else if (fontFeatureSettings.indexOf('subs') !== -1) {
                properties.position = Position.SUBSCRIPT;
            }
        } else if (fontFeatureSettings.__class__ === 'Object') {

            if (fontFeatureSettings.adbeOTFSwash !== undefined) {
                properties.otfSwash = fontFeatureSettings.adbeOTFSwash;
            }
            if (fontFeatureSettings.adbeOTFOrdinals !== undefined) {
                properties.otfOrdinal = fontFeatureSettings.adbeOTFOrdinals;
            }
            if (fontFeatureSettings.adbeOTFDiscretionaryLigatures !== undefined) {
                properties.otfDiscretionaryLigature = fontFeatureSettings.adbeOTFDiscretionaryLigatures;
            }
            if (fontFeatureSettings.adbeOTFContextualAlternates !== undefined) {
                properties.otfContextualAlternate = fontFeatureSettings.adbeOTFContextualAlternates;
            }
            if (fontFeatureSettings.adbeLigatures !== undefined) {
                properties.ligatures = fontFeatureSettings.adbeLigatures;
            }
            if (fontFeatureSettings.adbeOTFFractions !== undefined) {
                properties.otfFraction = fontFeatureSettings.adbeOTFFractions;
            }
            if (fontFeatureSettings.adbeOTFTitlingAlternates !== undefined) {
                properties.otfTitling = fontFeatureSettings.adbeOTFTitlingAlternates;
            }
            if (fontFeatureSettings.adbeOTFStylisticAlternates !== undefined) {
                properties.otfStylisticAlternate = fontFeatureSettings.adbeOTFStylisticAlternates;
            }
            if (fontFeatureSettings.adbeOTFHVKana !== undefined) {
                properties.otfHVKana = fontFeatureSettings.adbeOTFHVKana;
            }
            if (fontFeatureSettings.adbeOTFRomanItalics !== undefined) {
                properties.otfRomanItalics = fontFeatureSettings.adbeOTFRomanItalics;
            }
            if (fontFeatureSettings.adbeOTFSlashedZero !== undefined) {
                properties.otfSlashedZero = fontFeatureSettings.adbeOTFSlashedZero;
            }

            if (fontFeatureSettings.adbePosition) {
                switch (fontFeatureSettings) {
                case 'Position.NORMAL':
                    properties.position = Position.NORMAL;
                    break;
                case 'Position.SUBSCRIPT':
                    properties.position = Position.SUBSCRIPT;
                    break;
                case 'Position.SUPERSCRIPT':
                    properties.position = Position.SUPERSCRIPT;
                    break;
                }
            }
        }
    }

    if (style.adbeIlstProportionalMetrics !== undefined) {
        properties.otfProportionalMetrics = style.adbeIlstProportionalMetrics;
    }

    switch (style.adbeIdsnPositionalForm) {
    case 'PositionalForm.CALCULATE':
        properties.positionalForm = PositionalForms.CALCULATE;
        break;
    case 'PositionalForm.FINAL':
        properties.positionalForm = PositionalForms.FINAL;
        break;
    case 'PositionalForm.INITIAL':
        properties.positionalForm = PositionalForms.INITIAL;
        break;
    case 'PositionalForm.ISOLATED':
        properties.positionalForm = PositionalForms.ISOLATED;
        break;
    case 'PositionalForm.MEDIAL':
        properties.positionalForm = PositionalForms.MEDIAL;
        break;
    case 'PositionalForm.NONE':
        properties.positionalForm = PositionalForms.NONE;
        break;
    }

    if (style.adbeIdsnOtfStylisticSets !== undefined) {
        properties.otfStylisticSets = style.adbeIdsnOtfStylisticSets;
    }
    target.properties = properties;
};

TEXT.applyTCYProperties = function (target, style) {
    var properties = {};

    if (style.adbeIdsnTatechuyoko !== undefined) {
        properties.tatechuyoko = style.adbeIdsnTatechuyoko;
    }

    if (style.adbeIlstTateChuYokoHorizontal !== undefined) {
        properties.tatechuyokoXOffset = style.adbeIlstTateChuYokoHorizontal;
    }

    if (style.adbeIlstTateChuYokoVertical !== undefined) {
        properties.tatechuyokoYOffset = style.adbeIlstTateChuYokoVertical;
    }

    target.properties = properties;
};

TEXT.applyWarichuProperties = function (target, style) {
    var properties = {};

    if (style.adbeIlstWariChuEnabled !== undefined) {
        properties.warichu = style.adbeIlstWariChuEnabled;
    }
    if (style.adbeIlstWariChuEnabled) {
        if (style.adbeIlstWariChuJustification) {
            switch (style.adbeIlstWariChuJustification) {
            case 'WariChuJustificationType.WARICHUAUTOJUSTIFY':
                properties.warichuAlignment = WarichuAlignment.AUTO;
                break;
            case 'WariChuJustificationType.Center':
                properties.warichuAlignment = WarichuAlignment.CENTER_ALIGN;
                break;
            case 'WariChuJustificationType.WARICHUFULLJUSTIFYLASTLINECENTER':
                properties.warichuAlignment = WarichuAlignment.CENTER_JUSTIFIED;
                break;
            case 'WariChuJustificationType.WARICHUFULLJUSTIFY':
                properties.warichuAlignment = WarichuAlignment.FULLY_JUSTIFIED;
                break;
            case 'WariChuJustificationType.Left':
                properties.warichuAlignment = WarichuAlignment.LEFT_ALIGN;
                break;
            case 'WariChuJustificationType.WARICHUFULLJUSTIFYLASTLINELEFT':
                properties.warichuAlignment = WarichuAlignment.LEFT_JUSTIFIED;
                break;
            case 'WariChuJustificationType.Right':
                properties.warichuAlignment = WarichuAlignment.RIGHT_ALIGN;
                break;
            case 'WariChuJustificationType.WARICHUFULLJUSTIFYLASTLINERIGHT':
                properties.warichuAlignment = WarichuAlignment.RIGHT_JUSTIFIED;
                break;
            }
        }

        if (style.adbeIlstWariChuCharactersAfterBreak !== undefined) {
            properties.warichuCharsAfterBreak = style.adbeIlstWariChuCharactersAfterBreak;
        }
        if (style.adbeIlstWariChuCharactersBeforeBreak !== undefined) {
            properties.warichuCharsBeforeBreak = style.adbeIlstWariChuCharactersBeforeBreak;
        }
        if (style.adbeIlstWariChuLineGap !== undefined) {
            properties.warichuLineSpacing = style.adbeIlstWariChuLineGap;
        }
        if (style.adbeIlstWariChuLines !== undefined) {
            properties.warichuLines = style.adbeIlstWariChuLines;
        }
        if (style.adbeIlstWariChuScale !== undefined) {
            properties.warichuSize = style.adbeIlstWariChuScale;
        }
    }
    target.properties = properties;
};

TEXT.applyMENAProperties =  function (target, style) {
    var properties = {};
    if (style.adbeIdsnDigitsType) {
        switch (style.adbeIdsnDigitsType) {
        case 'DigitsTypeOptions.DEFAULT_DIGITS':
            properties.digitsType = DigitsTypeOptions.DEFAULT_DIGITS;
            break;
        case 'DigitsTypeOptions.ARABIC_DIGITS':
            properties.digitsType = DigitsTypeOptions.ARABIC_DIGITS;
            break;
        case 'DigitsTypeOptions.HINDI_DIGITS':
            properties.digitsType = DigitsTypeOptions.HINDI_DIGITS;
            break;
        case 'DigitsTypeOptions.FARSI_DIGITS':
            properties.digitsType = DigitsTypeOptions.FARSI_DIGITS;
            break;
        }
    }

    if (style.adbeIdsnKashidas) {
        switch (style.adbeIdsnKashidas) {
        case 'KashidasOptions.DEFAULT_KASHIDAS':
            properties.kashidas = KashidasOptions.DEFAULT_KASHIDAS;
            break;
        case 'KashidasOptions.KASHIDAS_OFF':
            properties.kashidas = KashidasOptions.KASHIDAS_OFF;
            break;
        }
    }

    if (style.adbeIdsnCharacterDirection) {
        switch (style.adbeIdsnCharacterDirection) {
        case 'CharacterDirectionOptions.DEFAULT_DIRECTION':
            properties.characterDirection = CharacterDirectionOptions.DEFAULT_DIRECTION;
            break;
        case 'CharacterDirectionOptions.LEFT_TO_RIGHT_DIRECTION':
            properties.characterDirection = CharacterDirectionOptions.LEFT_TO_RIGHT_DIRECTION;
            break;
        case 'CharacterDirectionOptions.RIGHT_TO_LEFT_DIRECTION':
            properties.characterDirection = CharacterDirectionOptions.RIGHT_TO_LEFT_DIRECTION;
            break;
        }
    }

    if (style.adbeIdsnDiacriticPosition) {
        switch (style.adbeIdsnDiacriticPosition) {
        case 'DiacriticPositionOptions.OPENTYPE_POSITION_FROM_BASELINE':
            properties.diacriticPosition = DiacriticPositionOptions.OPENTYPE_POSITION_FROM_BASELINE;
            break;
        case 'DiacriticPositionOptions.OPENTYPE_POSITION':
            properties.diacriticPosition = DiacriticPositionOptions.OPENTYPE_POSITION;
            break;
        case 'DiacriticPositionOptions.DEFAULT_POSITION':
            properties.diacriticPosition = DiacriticPositionOptions.DEFAULT_POSITION;
            break;
        case 'DiacriticPositionOptions.LOOSE_POSITION':
            properties.diacriticPosition = DiacriticPositionOptions.LOOSE_POSITION;
            break;
        case 'DiacriticPositionOptions.MEDIUM_POSITION':
            properties.diacriticPosition = DiacriticPositionOptions.MEDIUM_POSITION;
            break;
        case 'DiacriticPositionOptions.TIGHT_POSITION':
            properties.diacriticPosition = DiacriticPositionOptions.TIGHT_POSITION;
            break;
        }
    }

    if (style.adbeIdsnXOffsetDiacritic !== undefined) {
        properties.xOffsetDiacritic = style.adbeIdsnXOffsetDiacritic;
    }

    if (style.adbeIdsnYOffsetDiacritic !== undefined) {
        properties.yOffsetDiacritic = style.adbeIdsnYOffsetDiacritic;
    }

    //Use the fontFeatureSettings object if it exists, otherwise see if we have the legacy settings array
    var fontFeatureSettings = style.fontFeatureSettingsObject;
    if (!fontFeatureSettings) {
        fontFeatureSettings = style.fontFeatureSettings;
    }
    if (fontFeatureSettings) {
        if (fontFeatureSettings.__class__ === 'Array' && fontFeatureSettings.length > 0) {

            properties.otfJustificationAlternate = fontFeatureSettings.indexOf('jalt') !== -1;
            properties.otfStretchedAlternate = fontFeatureSettings.indexOf('stal') !== -1;
            properties.otfOverlapSwash = fontFeatureSettings.indexOf('olsh') !== -1;
        } else if (fontFeatureSettings.__class__ === 'Object') {

            if (fontFeatureSettings.adbeOTFJustificationAlternates !== undefined) {
                properties.otfJustificationAlternate = fontFeatureSettings.adbeOTFJustificationAlternates;
            }
            if (fontFeatureSettings.adbeOTFStretchedAlternates !== undefined) {
                properties.otfStretchedAlternate = fontFeatureSettings.adbeOTFStretchedAlternates;
            }
            if (fontFeatureSettings.adbeOTFOverlapSwash !== undefined) {
                properties.otfOverlapSwash = fontFeatureSettings.adbeOTFOverlapSwash;
            }
        }
    }

    target.properties = properties;
};

TEXT.applyKentenProperties = function (target, style) {
    var properties = {};
    if (style.adbeIdsnKentenKind !== undefined && style.adbeIdsnKentenKind !== 'KentenKind.NONE') {

        if (style.adbeIdsnKentenPlacement !== undefined) {
            properties.kentenPlacement = style.adbeIdsnKentenPlacement;
        }

        if (style.adbeIdsnKentenPosition) {
            if (style.adbeIdsnKentenPosition === 'RubyKentenPosition.BELOW_LEFT') {
                properties.kentenPosition = RubyKentenPosition.BELOW_LEFT;
            } else if (style.adbeIdsnKentenPosition === 'RubyKentenPosition.ABOVE_RIGHT') {
                properties.kentenPosition = RubyKentenPosition.ABOVE_RIGHT;
            }
        }

        if (style.adbeIdsnKentenFontSize !== undefined) {
            properties.kentenFontSize = style.adbeIdsnKentenFontSize;
        }

        if (style.adbeIdsnKentenAlignment) {
            if (style.adbeIdsnKentenAlignment === 'KentenAlignment.ALIGN_KENTEN_CENTER') {
                properties.kentenAlignment = KentenAlignment.ALIGN_KENTEN_CENTER;
            } else if (style.adbeIdsnKentenAlignment === 'KentenAlignment.ALIGN_KENTEN_LEFT') {
                properties.kentenAlignment = KentenAlignment.ALIGN_KENTEN_LEFT;
            }
        }

        if (style.adbeIdsnKentenXScale !== undefined) {
            properties.kentenXScale = style.adbeIdsnKentenXScale;
        }

        if (style.adbeIdsnKentenYScale !== undefined) {
            properties.kentenYScale = style.adbeIdsnKentenYScale;
        }

        switch (style.adbeIdsnKentenKind) {
        case 'KentenKind.CUSTOM':
            properties.kentenKind = KentenCharacter.CUSTOM;
            break;
        case 'KentenKind.KENTEN_BLACK_CIRCLE':
            properties.kentenKind = KentenCharacter.KENTEN_BLACK_CIRCLE;
            break;
        case 'KentenKind.KENTEN_BLACK_TRIANGLE':
            properties.kentenKind = KentenCharacter.KENTEN_BLACK_TRIANGLE;
            break;
        case 'KentenKind.KENTEN_BULLSEYE':
            properties.kentenKind = KentenCharacter.KENTEN_BULLSEYE;
            break;
        case 'KentenKind.KENTEN_FISHEYE':
            properties.kentenKind = KentenCharacter.KENTEN_FISHEYE;
            break;
        case 'KentenKind.KENTEN_SESAME_DOT':
            properties.kentenKind = KentenCharacter.KENTEN_SESAME_DOT;
            break;
        case 'KentenKind.KENTEN_SMALL_BLACK_CIRCLE':
            properties.kentenKind = KentenCharacter.KENTEN_SMALL_BLACK_CIRCLE;
            break;
        case 'KentenKind.KENTEN_SMALL_WHITE_CIRCLE':
            properties.kentenKind = KentenCharacter.KENTEN_SMALL_WHITE_CIRCLE;
            break;
        case 'KentenKind.KENTEN_WHITE_CIRCLE':
            properties.kentenKind = KentenCharacter.KENTEN_WHITE_CIRCLE;
            break;
        case 'KentenKind.KENTEN_WHITE_SESAME_DOT':
            properties.kentenKind = KentenCharacter.KENTEN_WHITE_SESAME_DOT;
            break;
        case 'KentenKind.KENTEN_WHITE_TRIANGLE':
            properties.kentenKind = KentenCharacter.KENTEN_WHITE_TRIANGLE;
            break;
        case 'KentenKind.NONE':
            properties.kentenKind = KentenCharacter.NONE;
            break;
        }

        if (style.adbeIdsnKentenKind === 'KentenKind.CUSTOM') {

            if (style.adbeIdsnKentenFont) {
                var kentenFont = TEXT.dataToFont(style.adbeIdsnKentenFont, style.adbeIdsnKentenFont.family, true);
                if (kentenFont) {
                    try {
                        properties.kentenFont = kentenFont;
                        properties.kentenFontStyle = kentenFont.fontStyleName;
                    } catch (ex1) {
                        //alert(ex1);
                    }
                }
            }

            if (style.adbeIdsnKentenCustomCharacter) {
                properties.kentenCustomCharacter = style.adbeIdsnKentenCustomCharacter;
            }

            if (style.adbeIdsnKentenCharacterSet) {
                switch (style.adbeIdsnKentenCharacterSet) {
                case 'KentenCharacterSet.CHARACTER_INPUT':
                    properties.kentenCharacterSet = KentenCharacterSet.CHARACTER_INPUT;
                    break;
                case 'KentenCharacterSet.JIS':
                    properties.kentenCharacterSet = KentenCharacterSet.JIS;
                    break;
                case 'KentenCharacterSet.KUTEN':
                    properties.kentenCharacterSet = KentenCharacterSet.KUTEN;
                    break;
                case 'KentenCharacterSet.SHIFT_JIS':
                    properties.kentenCharacterSet = KentenCharacterSet.SHIFT_JIS;
                    break;
                case 'KentenCharacterSet.UNICODE':
                    properties.kentenCharacterSet = KentenCharacterSet.UNICODE;
                    break;
                default:
                    properties.kentenCharacterSet = KentenCharacterSet.CHARACTER_INPUT;
                }
            }
        }

        if (style.adbeIdsnKentenTint !== undefined) {
            properties.kentenTint = style.adbeIdsnKentenTint === 'KentenTint.AUTO'  ? -1 : style.adbeIdsnKentenTint;
        }

        if (style.adbeIdsnKentenWeight !== undefined) {
            properties.kentenWeight = style.adbeIdsnKentenWeight === 'KentenWeight.AUTO' ? -1 : style.adbeIdsnKentenWeight;
        }

        if (style.adbeIdsnKentenOverprintFill) {
            if (style.adbeIdsnKentenOverprintFill === 'AdornmentOverprint.AUTO') {
                properties.kentenOverprintFill = AdornmentOverprint.AUTO;
            } else if (style.adbeIdsnOverprintFill === 'AdornmentOverprint.OVERPRINT_ON') {
                properties.kentenOverprintFill = AdornmentOverprint.OVERPRINT_ON;
            } else if (style.adbeIdsnOverprintFill === 'AdornmentOverprint.OVERPRINT_OFF') {
                properties.kentenOverprintFill = AdornmentOverprint.OVERPRINT_OFF;
            }
        }

        if (style.adbeIdsnKentenOverprintStroke) {
            if (style.adbeIdsnKentenOverprintStroke === 'AdornmentOverprint.AUTO') {
                properties.kentenOverprintStroke = AdornmentOverprint.AUTO;
            } else if (style.adbeIdsnOverprintStroke === 'AdornmentOverprint.OVERPRINT_ON') {
                properties.kentenOverprintStroke = AdornmentOverprint.OVERPRINT_ON;
            } else if (style.adbeIdsnOverprintStroke === 'AdornmentOverprint.OVERPRINT_OFF') {
                properties.kentenOverprintStroke = AdornmentOverprint.OVERPRINT_OFF;
            }
        }

        if (style.adbeIdsnKentenFillColor) {
            properties.kentenFillColor = TEXT.dataToColor(style.adbeIdsnKentenFillColor);
        }
        if (style.adbeIdsnKentenStrokeColor) {
            properties.kentenStrokeColor = TEXT.dataToColor(style.adbeIdsnKentenStrokeColor);
        }
    } else if (style.adbeIdsnKentenKind === 'KentenKind.NONE') {
        properties.kentenKind = KentenCharacter.NONE;
    }
    target.properties = properties;
};

TEXT.applyRubyProperties = function (target, style) {
    var properties = {};
    if (style.adbeIdsnRubyFlag !== undefined && style.adbeIdsnRubyFlag === true) {
        properties.rubyFlag = true;

        if (style.adbeIdsnRubyType) {
            if (style.adbeIdsnRubyType === 'RubyType.GROUP_RUBY') {
                properties.rubyType = RubyTypes.GROUP_RUBY;
            } else if (style.adbeIdsnRubyType === 'RubyType.PER_CHARACTER_RUBY') {
                properties.rubyType = RubyTypes.PER_CHARACTER_RUBY;
            }
        }

        if (style.adbeIdsnRubyAlignment) {
            switch (style.adbeIdsnRubyAlignment) {
            case 'RubyAlignment.RUBY_1_AKI':
                properties.rubyAlignment = RubyAlignments.RUBY_1_AKI;
                break;
            case 'RubyAlignment.RUBY_CENTER':
                properties.rubyAlignment = RubyAlignments.RUBY_CENTER;
                break;
            case 'RubyAlignment.RUBY_EQUAL_AKI':
                properties.rubyAlignment = RubyAlignments.RUBY_EQUAL_AKI;
                break;
            case 'RubyAlignment.RUBY_FULL_JUSTIFY':
                properties.rubyAlignment = RubyAlignments.RUBY_FULL_JUSTIFY;
                break;
            case 'RubyAlignment.RUBY_JIS':
                properties.rubyAlignment = RubyAlignments.RUBY_JIS;
                break;
            case 'RubyAlignment.RUBY_LEFT':
                properties.rubyAlignment = RubyAlignments.RUBY_LEFT;
                break;
            case 'RubyAlignment.RUBY_RIGHT':
                properties.rubyAlignment = RubyAlignments.RUBY_RIGHT;
                break;
            }
        }

        if (style.adbeIdsnRubyPosition) {
            switch (style.adbeIdsnRubyPosition) {
            case 'RubyKentenPosition.ABOVE_RIGHT':
                properties.rubyPosition = RubyKentenPosition.ABOVE_RIGHT;
                break;
            case 'RubyKentenPosition.BELOW_LEFT':
                properties.rubyPosition = RubyKentenPosition.BELOW_LEFT;
                break;
            }
        }

        if (style.adbeIdsnRubyXOffset !== undefined) {
            properties.rubyXOffset = style.adbeIdsnRubyXOffset;
        }

        if (style.adbeIdsnRubyYOffset !== undefined) {
            properties.rubyYOffset = style.adbeIdsnRubyYOffset;
        }

        if (style.adbeIdsnRubyFont) {
            var rubyFont = TEXT.dataToFont(style.adbeIdsnRubyFont, style.adbeIdsnRubyFont.family, true);
            if (rubyFont) {
                try {
                    properties.rubyFont = rubyFont;
                    properties.rubyFontStyle = style.adbeIdsnRubyFont.style;
                } catch (ex2) {
                    //alert(ex2);
                }
            }
        }

        if (style.adbeIdsnRubyFontSize !== undefined) {
            properties.rubyFontSize = style.adbeIdsnRubyFontSize;
        }

        if (style.adbeIdsnRubyXScale !== undefined) {
            properties.rubyXScale = style.adbeIdsnRubyXScale;
        }

        if (style.adbeIdsnRubyYScale !== undefined) {
            properties.rubyYScale = style.adbeIdsnRubyYScale;
        }

        if (style.adbeIdsnRubyOpenTypePro !== undefined) {
            properties.rubyOpenTypePro = style.adbeIdsnRubyOpenTypePro;
        }

        if (style.adbeIdsnRubyAutoTcyDigits !== undefined) {
            properties.rubyAutoTcyDigits = style.adbeIdsnRubyAutoTcyDigits;
        }

        if (style.adbeIdsnRubyAutoTcyIncludeRoman !== undefined) {
            properties.rubyAutoTcyIncludeRoman = style.adbeIdsnRubyAutoTcyIncludeRoman;
        }

        if (style.adbeIdsnRubyAutoTcyAutoScale !== undefined) {
            properties.rubyAutoTcyAutoScale = style.adbeIdsnRubyAutoTcyAutoScale;
        }

        if (style.adbeIdsnRubyParentOverhangAmount) {
            switch (style.adbeIdsnRubyParentOverhangAmount) {
            case 'RubyOverhang.NONE':
                properties.rubyParentOverhangAmount = RubyOverhang.NONE;
                break;
            case 'RubyOverhang.RUBY_OVERHANG_HALF_CHAR':
                properties.rubyParentOverhangAmount = RubyOverhang.RUBY_OVERHANG_HALF_CHAR;
                break;
            case 'RubyOverhang.RUBY_OVERHANG_HALF_RUBY':
                properties.rubyParentOverhangAmount = RubyOverhang.RUBY_OVERHANG_HALF_RUBY;
                break;
            case 'RubyOverhang.RUBY_OVERHANG_NO_LIMIT':
                properties.rubyParentOverhangAmount = RubyOverhang.RUBY_OVERHANG_NO_LIMIT;
                break;
            case 'RubyOverhang.RUBY_OVERHANG_ONE_CHAR':
                properties.rubyParentOverhangAmount = RubyOverhang.RUBY_OVERHANG_ONE_CHAR;
                break;
            case 'RubyOverhang.RUBY_OVERHAND_ONE_RUBY':
                properties.rubyParentOverhangAmount = RubyOverhang.RUBY_OVERHAND_ONE_RUBY;
                break;
            }
        }

        if (style.adbeIdsnRubyParentSpacing) {
            switch (style.adbeIdsnRubyParentSpacing) {
            case 'RubyParentSpacing.RUBY_PARENT_121_AKI':
                properties.rubyParentSpacing = RubyParentSpacing.RUBY_PARENT_121_AKI;
                break;
            case 'RubyParentSpacing.RUBY_PARENT_BOTH_SIDES':
                properties.rubyParentSpacing = RubyParentSpacing.RUBY_PARENT_BOTH_SIDES;
                break;
            case 'RubyParentSpacing.RUBY_PARENT_EQUAL_AKI':
                properties.rubyParentSpacing = RubyParentSpacing.RUBY_PARENT_EQUAL_AKI;
                break;
            case 'RubyParentSpacing.RUBY_PARENT_FULL_JUSTIFY':
                properties.rubyParentSpacing = RubyParentSpacing.RUBY_PARENT_FULL_JUSTIFY;
                break;
            case 'RubyParentSpacing.RUBY_PARENT_NO_ADJUSTMENT':
                properties.rubyParentSpacing = RubyParentSpacing.RUBY_PARENT_NO_ADJUSTMENT;
                break;
            }
        }

        if (style.adbeIdsnRubyAutoScaling !== undefined) {
            properties.rubyAutoScaling = style.adbeIdsnRubyAutoScaling;

            if (style.adbeIdsnRubyAutoScaling && style.adbeIdsnRubyParentScalingPercent !== undefined) {
                properties.rubyParentScalingPercent = style.adbeIdsnRubyParentScalingPercent;
            }
        }

        if (style.adbeIdsnRubyAutoAlign !== undefined) {
            properties.rubyAutoAlign = style.adbeIdsnRubyAutoAlign;
        }

        if (style.adbeIdsnRubyFillColor) {
            properties.rubyFill = TEXT.dataToColor(style.adbeIdsnRubyFillColor);
        }

        if (style.adbeIdsnRubyStrokeColor) {
            properties.rubyStroke = TEXT.dataToColor(style.adbeIdsnRubyStrokeColor);
        }

        if (style.adbeIdsnRubyTint !== undefined) {
            properties.rubyTint = style.adbeIdsnRubyTint === 'RubyTint.AUTO' ? -1 : style.adbeIdsnRubyTint;
        }

        if (style.adbeIdsnRubyWeight !== undefined) {
            properties.rubyWeight = style.adbeIdsnRubyWeight === 'RubyWeight.AUTO' ? -1 : style.adbeIdsnRubyWeight;
        }

        if (style.adbeIdsnRubyOverprintFill) {
            if (style.adbeIdsnRubyOverprintFill === 'AdornmentOverprint.AUTO') {
                properties.rubyOverprintFill = AdornmentOverprint.AUTO;
            } else if (style.adbeIdsnRubyOverprintFill === 'AdornmentOverprint.OVERPRINT_ON') {
                properties.rubyOverprintFill = AdornmentOverprint.OVERPRINT_ON;
            } else if (style.adbeIdsnRubyOverprintFill === 'AdornmentOverprint.OVERPRINT_OFF') {
                properties.rubyOverprintFill = AdornmentOverprint.OVERPRINT_OFF;
            }
        }

        if (style.adbeIdsnRubyOverprintStroke) {
            if (style.adbeIdsnRubyOverprintStroke === 'AdornmentOverprint.AUTO') {
                properties.rubyOverprintStroke = AdornmentOverprint.AUTO;
            } else if (style.adbeIdsnRubyOverprintStroke === 'AdornmentOverprint.OVERPRINT_ON') {
                properties.rubyOverprintStroke = AdornmentOverprint.OVERPRINT_ON;
            } else if (style.adbeIdsnRubyOverprintStroke === 'AdornmentOverprint.OVERPRINT_OFF') {
                properties.rubyOverprintStroke = AdornmentOverprint.OVERPRINT_OFF;
            }
        }
    } else if (style.adbeIdsnRubyFlag === false) {
        properties.rubyFlag = false;
    }
    if (properties) {
        target.properties = properties;
    }
};

TEXT.applyShataiProperties = function (target, style) {
    var properties = {};

    if (style.adbeIdsnShataiMagnification !== undefined) {
        properties.shataiMagnification = style.adbeIdsnShataiMagnification;
    }
    if (style.adbeIdsnShataiDegreeAngle !== undefined) {
        properties.shataiDegreeAngle = style.adbeIdsnShataiDegreeAngle;
    }
    if (style.adbeIdsnShataiAdjustRotation !== undefined) {
        properties.shataiAdjustRotation = style.adbeIdsnShataiAdjustRotation;
    }
    if (style.adbeIdsnShataiAdjustTsume !== undefined) {
        properties.shataiAdjustTsume = style.adbeIdsnShataiAdjustTsume;
    }

    target.properties = properties;
};

TEXT.applyStrikeThroughProperties = function (target, style) {
    if (style.textDecoration && style.textDecoration.indexOf('line-through') !== -1) {
        var properties = {};

        if (style.adbeIdsnStrikeThroughWeight) {
            var strikeThroughWeight = new UnitValue(style.adbeIdsnStrikeThroughWeight.value, style.adbeIdsnStrikeThroughWeight.type);
            properties.strikeThroughWeight = strikeThroughWeight.as('pt') + ' pt';
        }

        if (style.adbeIdsnStrikeThroughType) {
            var strikeThroughStyle = TEXT.dataToStrokeStyle(style.adbeIdsnStrikeThroughType);
            if (strikeThroughStyle && strikeThroughStyle.isValid) {
                properties.strikeThroughType = strikeThroughStyle;
            }
        }

        if (style.adbeIdsnStrikeThroughOffset) {
            var strikeThroughOffset = new UnitValue(style.adbeIdsnStrikeThroughOffset.value, style.adbeIdsnStrikeThroughOffset.type);
            properties.strikeThroughOffset = strikeThroughOffset.as('pt') + ' pt';
        }

        if (style.adbeIdsnStrikeThroughColor) {
            properties.strikeThroughColor = TEXT.dataToColor(style.adbeIdsnStrikeThroughColor);

            if (style.adbeIdsnStrikeThroughTint !== undefined) {
                properties.strikeThroughTint = style.adbeIdsnStrikeThroughTint;
            }

            if (style.adbeIdsnStrikeThroughOverprint !== undefined) {
                properties.strikeThroughOverprint = style.adbeIdsnStrikeThroughOverprint;
            }
        }

        if (style.adbeIdsnStrikeThroughGapColor) {
            properties.strikeThroughGapColor = TEXT.dataToColor(style.adbeIdsnStrikeThroughGapColor);

            if (style.adbeIdsnStrikeThroughGapTint !== undefined) {
                properties.strikeThroughGapTint = style.adbeIdsnStrikeThroughGapTint;
            }

            if (style.adbeIdsnStrikeThroughGapOverprint !== undefined) {
                properties.strikeThroughGapOverprint = style.adbeIdsnStrikeThroughGapOverprint;
            }
        }

        target.properties = properties;
    }
};

TEXT.applyUnderlineProperties = function (target, style) {
    if (style.textDecoration && style.textDecoration.indexOf('underline') !== -1) {
        var properties = {};

        if (style.adbeIdsnUnderlineWeight) {
            var underlineWeight = new UnitValue(style.adbeIdsnUnderlineWeight.value, style.adbeIdsnUnderlineWeight.type);
            properties.underlineWeight = underlineWeight.as('pt') + ' pt';
        }

        if (style.adbeIdsnUnderlineType) {
            var underlineStyle = TEXT.dataToStrokeStyle(style.adbeIdsnUnderlineType);
            if (underlineStyle && underlineStyle.isValid) {
                properties.underlineType = underlineStyle;
            }
        }

        if (style.adbeIdsnUnderlineOffset) {
            var underlineOffset = new UnitValue(style.adbeIdsnUnderlineOffset.value, style.adbeIdsnUnderlineOffset.type);
            properties.underlineOffset = underlineOffset.as('pt') + ' pt';
        }

        if (style.adbeIdsnUnderlineColor) {
            properties.underlineColor = TEXT.dataToColor(style.adbeIdsnUnderlineColor);

            if (style.adbeIdsnUnderlineTint !== undefined) {
                properties.underlineTint = style.adbeIdsnUnderlineTint;
            }

            if (style.adbeIdsnUnderlineOverprint !== undefined) {
                properties.underlineOverprint = style.adbeIdsnUnderlineOverprint;
            }
        }

        if (style.adbeIdsnUnderlineGapColor) {
            properties.underlineGapColor = TEXT.dataToColor(style.adbeIdsnUnderlineGapColor);

            if (style.adbeIdsnUnderlineGapTint !== undefined) {
                properties.underlineGapTint = style.adbeIdsnUnderlineGapTint;
            }

            if (style.adbeIdsnUnderlineGapOverprint !== undefined) {
                properties.underlineGapOverprint = style.adbeIdsnUnderlineGapOverprint;
            }
        }
        target.properties = properties;
    }
};

TEXT.removeStylesAndStyleGroups = function (collection, isParaStyle) {
    var i;
    if (isParaStyle) {
        for (i = collection.length - 1; i >= 0; --i) {
            try {
                collection[i].forceDelete(); //gets rid of [Basic Paragraph Style] as well
            } catch (ignore) {
                //Will fail for [No Paragraph Style], ignore.
            }
        }
    } else {
        for (i = collection.length - 1; i >= 0; --i) {
            try {
                collection[i].remove();
            } catch (ignore1) {
                //Will fail for [None] character style, ignore.
            }
        }
    }
};

TEXT.removeAllTypeStyles = function (doc) {
    TEXT.removeStylesAndStyleGroups(doc.paragraphStyleGroups, false);
    TEXT.removeStylesAndStyleGroups(doc.paragraphStyles, true);
    TEXT.removeStylesAndStyleGroups(doc.characterStyleGroups, false);
    TEXT.removeStylesAndStyleGroups(doc.characterStyles, false);
};

TEXT.getAllTypeStyles = function (doc, isCharStyle) {
    var collection;
    if (isCharStyle) {
        collection = doc.allCharacterStyles;
    } else {
        collection = doc.allParagraphStyles;
    }

    var styleNames = [];
    var length = collection.length;

    var i;
    for (i = 0; i < length; ++i) {
        var styleName = TEXT.getStyleFullyQualifiedName(collection[i]);
        if (isCharStyle && styleName === AppStrings.NoneCharacterStyle) {
            continue;
        }
        if (!isCharStyle && styleName === AppStrings.NoParagraphStyle) {
            continue;
        }
        styleNames.push(styleName);
    }
    return styleNames;
};

TEXT.applyIdToAllStyles = function (targetDoc, uniqueId) {
    var typeStyle;

    //Apply unique id to all character styles in the document.
    var charStyles = targetDoc.allCharacterStyles;

    var i;
    for (i = 0; i < charStyles.length; ++i) {
        typeStyle = charStyles[i];
        if (typeStyle && typeStyle.isValid) {
            typeStyle.styleUniqueId = uniqueId;
        }
    }

    //Apply unique id to all paragraph styles in the document.
    var paraStyles = targetDoc.allParagraphStyles;

    for (i = 0; i < paraStyles.length; ++i) {
        typeStyle = paraStyles[i];
        if (typeStyle && typeStyle.isValid) {
            typeStyle.styleUniqueId = uniqueId;
        }
    }
};

var ConflictEnum = {
    STYLES_MATCH: 0,    //No conflict, all styles match
    STYLES_CONFLICT: 1, //At least one conflicting style
    STYLES_MISSING: 2   //No conflict, but atleast one style is missing
};

TEXT.hasConflictingStyles = function (targetDoc, sourceDoc, isCharStyle, uniqueId) {
    var typeStyle;
    var styleNames = TEXT.getAllTypeStyles(sourceDoc, isCharStyle);

    var areAllStylesPresent = true; //one or more styles are missing.
    var i;
    for (i = 0; i < styleNames.length; ++i) {
        typeStyle = TEXT.getStyleByFullyQualifiedName(styleNames[i], isCharStyle, targetDoc);
        if (typeStyle && typeStyle.isValid) {
            if (typeStyle.styleUniqueId !== uniqueId) {
                //We have got a conflict
                return ConflictEnum.STYLES_CONFLICT;
            }
        } else {
            areAllStylesPresent = false;
        }
    }

    //For paragraph styles, also check the character styles (nested styles...)
    if (!isCharStyle) {
        styleNames = TEXT.getAllTypeStyles(sourceDoc, true);
        for (i = 0; i < styleNames.length; ++i) {
            typeStyle = TEXT.getStyleByFullyQualifiedName(styleNames[i], true, targetDoc);
            if (typeStyle && typeStyle.isValid) {
                if (typeStyle.styleUniqueId !== uniqueId) {
                    //We have got a conflict
                    return ConflictEnum.STYLES_CONFLICT;
                }
            } else {
                areAllStylesPresent = false;
            }
        }
    }

    if (areAllStylesPresent) {
        return ConflictEnum.STYLES_MATCH;
    }

    return ConflictEnum.STYLES_MISSING;
};

TEXT.createTypeStyle = function (typography) {
    var activeDoc = app.activeDocument;
    if (!activeDoc) {
        return;
    }

    var isCharStyle = (typography.type === 'charstyle');
    var typeStyle; //undefined

    var styleConflict = ConflictEnum.STYLES_MATCH;
    var strategy; //undefined
    var newTypeStyle;

    if (typography.hasOwnProperty('idmsPath')) {

        //Create a temporary document to place the snippet.
        var newDoc = app.documents.add(false);
        TEXT.removeAllTypeStyles(newDoc);

        //Place the snippet file. This adds the required styles to the document.
        var pageItems = newDoc.pages[0].place(typography.idmsPath, [0, 0], undefined, false, true);
        if (pageItems.length !== 1) {
            newDoc.close(SaveOptions.NO);
            return;
        }

        //Rename the applied style
        if (isCharStyle) {
            newTypeStyle = pageItems[0].texts[0].appliedCharacterStyle;
        } else {
            newTypeStyle = pageItems[0].texts[0].appliedParagraphStyle;
        }

        if (typography.name) {
            try {
                newTypeStyle.name = typography.name;
            } catch (ignore) {
                //Catch and ignore issues with naming, for example, if the Libraries style asset has been renamed
                //to a style name which already exists in this style's hierarchy.
            }
        }

        //Apply uniqueid to every style that came in.
        TEXT.applyIdToAllStyles(newDoc, typography.id);

        //Check for style conflicts
        styleConflict = TEXT.hasConflictingStyles(activeDoc, newDoc, isCharStyle, typography.id);

        var styleName = TEXT.getStyleFullyQualifiedName(newTypeStyle);

        if (styleConflict === ConflictEnum.STYLES_CONFLICT) {
            //We have a style conflict. Get the resolution strategy from user.
            strategy = activeDoc.getStyleConflictResolutionStrategy(isCharStyle ? StyleType.CHARACTER_STYLE_TYPE : StyleType.PARAGRAPH_STYLE_TYPE);
            if (strategy === false) {
                strategy = undefined;
            }
        } else if (styleConflict === ConflictEnum.STYLES_MISSING) {
            strategy = GlobalClashResolutionStrategy.DO_NOT_LOAD_THE_STYLE; //Bring in just the missing styles
        } else if (styleConflict === ConflictEnum.STYLES_MATCH) {
            typeStyle = TEXT.getStyleByFullyQualifiedName(styleName, isCharStyle, app.activeDocument);
            strategy = undefined;
        }

        if (strategy !== undefined) {
            //Save the document, and import its styles into the active document using the resolution strategy.
            var newDocPath = Folder.temp.fsName + '/TextStyles' + $.hiresTimer + '.indd';
            newDoc.save(newDocPath);

            app.activeDocument.importStyles(ImportFormat.TEXT_STYLES_FORMAT, newDocPath, strategy);

            //Get hold of the imported style
            typeStyle = TEXT.getStyleByFullyQualifiedName(styleName, isCharStyle, app.activeDocument);

            //Get rid of the temporary document
            newDoc.close(SaveOptions.NO);

            var tempFile = new File(newDocPath);
            app.removeFileFromRecentFiles(tempFile); //Ensure it doesn't show up in recent documents list
            tempFile.remove();
        } else {
            newDoc.close(SaveOptions.NO);
        }
    } else {
        //Check for style conflicts
        if (isCharStyle) {
            typeStyle = activeDoc.characterStyles.itemByName(typography.name);
        } else {
            typeStyle = activeDoc.paragraphStyles.itemByName(typography.name);
        }

        if (typeStyle && typeStyle.isValid) {
            if (typeStyle.styleUniqueId === typography.id) {
                styleConflict = ConflictEnum.STYLES_MATCH;
                strategy = undefined;
            } else {
                styleConflict = ConflictEnum.STYLES_CONFLICT;
                //We have a style conflict. Get the resolution strategy from user.
                strategy = activeDoc.getStyleConflictResolutionStrategy(isCharStyle ? StyleType.CHARACTER_STYLE_TYPE : StyleType.PARAGRAPH_STYLE_TYPE);
                if (strategy === false) {
                    strategy = undefined;
                    typeStyle = undefined;
                }
            }
        } else {
            styleConflict = ConflictEnum.STYLES_MISSING;
            strategy = GlobalClashResolutionStrategy.LOAD_ALL_WITH_OVERWRITE;
        }

        if (strategy === GlobalClashResolutionStrategy.LOAD_ALL_WITH_OVERWRITE) {
            if (isCharStyle) {
                newTypeStyle = TEXT.createCharacterStyle(typography);
            } else {
                newTypeStyle = TEXT.createParagraphStyle(typography);
            }

            if (styleConflict === ConflictEnum.STYLES_CONFLICT) {
                //We are using the incoming definition of the style. Remove existing, replacing with the new.
                typeStyle.remove(newTypeStyle);
            }

            newTypeStyle.name = typography.name;
            typeStyle = newTypeStyle;
            typeStyle.styleUniqueId = typography.id;
        }
    }
    return typeStyle;
};

TEXT.applyTypeStyle = function (text, typeStyle) {
    if (typeStyle.__class__ === 'CharacterStyle') {
        text.appliedCharacterStyle = typeStyle;
    } else if (typeStyle.__class__ === 'ParagraphStyle') {
        text.appliedParagraphStyle = typeStyle;
    }
};

TEXT.setOrCreateFont = function (typography, createLayer) {
    'use strict';
    var doc;
    var newDocCreated = false; //Did we create a new document as well?
    var textref; //new text layer
    var typeStyle; //applied style

    try {

        try {
            if (app.documents.length !== 0) {
                //app.activeDocument throws if the only documents that are open, are opened in background.
                doc = app.activeDocument;
            }
        } catch (ignore) {}

        if (!doc && !createLayer) {
            return;
        }

        var selection = [];
        try {
            selection = app.selection;
        } catch (ignore1) {}

        var hasTextElements = false;
        var i;
        for (i = 0; i < selection.length; i++) {
            if (selection[i].hasOwnProperty('characters')) {
                hasTextElements = true;
            }
        }

        var size = new UnitValue(typography.fontSize ? typography.fontSize.value : 12, typography.fontSize ? typography.fontSize.type : 'pt');
        var fontSize = size.as('pt');

        if (createLayer) {
            if (!doc) {
                doc = app.documents.add();
                newDocCreated = true;
            }

            var currentPage;
            if (doc.layoutWindows.length !== 0) {
                currentPage = doc.layoutWindows[0].activePage;
            }
            if (!currentPage) {
                currentPage = doc.pages[0];
            }

            textref = currentPage.textFrames.add();
            textref.geometricBounds = [0, 0, 100, 100];
            textref.texts[0].pointSize = fontSize + ' pt';
            textref.contents = typography.name;

            textref.texts[0].recompose();
            textref.fit(FitOptions.FRAME_TO_CONTENT);
            textref.select();

            hasTextElements = true;
            selection = app.selection;
        }

        if (hasTextElements) {
            var triedOnce = false;
            for (i = 0; i < selection.length; i++) {
                if (!selection[i].hasOwnProperty('characters')) {
                    //Non text selection.
                    continue;
                }

                if (TEXT.isLockedStory(selection[i].texts[0])) {
                    //Locked story.
                    continue;
                }

                if (selection[i].__class__ === 'TextFrame') {
                    //For threaded text frames, we skip applying text attributes.
                    if (selection[i].parentStory.textContainers.length === 1) {
                        if (!typeStyle && !triedOnce) {
                            typeStyle = TEXT.createTypeStyle(typography);
                            triedOnce = true;
                        }
                        //Apply to the entire story including overset text
                        if (typeStyle) {
                            TEXT.applyTypeStyle(selection[i].parentStory.texts[0], typeStyle);
                        }/* else {
                            TEXT.setTextAttributes(selection[i].parentStory.texts[0], typography);
                        }*/
                    }
                } else {
                    if (!typeStyle && !triedOnce) {
                        typeStyle = TEXT.createTypeStyle(typography);
                        triedOnce = true;
                    }
                    if (typeStyle) {
                        //Apply to the entire story including overset text
                        TEXT.applyTypeStyle(selection[i].texts[0], typeStyle);
                    }/* else {
                        TEXT.setTextAttributes(selection[i].texts[0], typography);
                    }*/
                }
            }
        }

        if (createLayer) {
            textref.texts[0].recompose();
            textref.fit(FitOptions.FRAME_TO_CONTENT);
        }

    } catch (ex) {
        //alert(ex);
        $._ext_CORE.writeToLog('IDSN.jsx-setOrCreateFont()', ex);
    }

    //If we created a new document, or new text frame, but didn't apply the text style, for example, if the
    //user canceled in case of style conflict, we delete the text frame, and/or close the document.
    if (createLayer && !typeStyle) {
        if (newDocCreated) {
            doc.close(SaveOptions.NO);
        } else if (textref) {
            textref.remove();
        }
    }
};

TEXT.setFont = function (typography) {
    'use strict';
    try {
        app.doScript(
            'TEXT.setOrCreateFont(typography, false);',
            undefined,
            undefined,
            UndoModes.entireScript,
            '$ID/Apply Text Style'
        );
    } catch (ex) {
        $._ext_CORE.writeToLog('IDSN.jsx-setFont()', ex);
    }
};

TEXT.createFontLayer = function (typography) {
    try {
        app.doScript(
            'TEXT.setOrCreateFont(typography, true);',
            undefined,
            undefined,
            UndoModes.entireScript,
            '$ID/Apply Text Style'
        );
    } catch (ex) {
        $._ext_CORE.writeToLog('IDSN.jsx-createFontLayer()', ex);
    }
};

// Paragraph only properties - IndentsAndSpacing, Tabs, Hyphenation, Justification, Japanese Composition
// Called only for paragraph styles, these properties don't need the NOTHING checks

TEXT.collectIndentsAndSpacing = function (obj, source) {
    // Alignment
    // Left Indent
    // First Line Indent
    // Right Indent
    // Space Before
    // Space After
    var prefsOwner = TEXT.getPrefsOwner();

    var horizontalUnits = prefsOwner.viewPreferences.horizontalMeasurementUnits;
    var verticalUnits = prefsOwner.viewPreferences.verticalMeasurementUnits;

    if (source.justification !== Justification.TO_BINDING_SIDE && source.justification !== Justification.AWAY_FROM_BINDING_SIDE) {
        obj.adbeParaAlignment = 'Alignment.' + source.justification.toString();
    }

    var leftIndent = TEXT.convertUnitsToPoints(horizontalUnits, source.leftIndent);
    obj.adbeLeftIndent = {type: 'pt', value: leftIndent};

    var firstLineIndent = TEXT.convertUnitsToPoints(horizontalUnits, source.firstLineIndent);
    obj.adbeFirstLineIndent = {type: 'pt', value: firstLineIndent};

    var rightIndent = TEXT.convertUnitsToPoints(horizontalUnits, source.rightIndent);
    obj.adbeRightIndent = {type: 'pt', value: rightIndent};

    var spaceBefore = TEXT.convertUnitsToPoints(verticalUnits, source.spaceBefore);
    obj.adbeSpaceBefore = {type: 'pt', value: spaceBefore};

    var spaceAfter = TEXT.convertUnitsToPoints(verticalUnits, source.spaceAfter);
    obj.adbeSpaceAfter = {type: 'pt', value: spaceAfter};
};

TEXT.collectTabs = function (obj, source) {
    // Tab Stops
    // -- Alignment
    // -- Alignment Character
    // -- Leader
    // -- Position
    var prefsOwner = TEXT.getPrefsOwner();
    var horizontalUnits = prefsOwner.viewPreferences.horizontalMeasurementUnits;

    obj.adbeTabStops = [];

    var tabStops = source.tabStops;
    var i;
    for (i = 0; i < tabStops.length; ++i) {
        var tabStop = tabStops[i];

        var tabStopObj = {};
        tabStopObj.adbeTabAlignment = 'TabStopAlignment.' + tabStop.alignment.toString();
        tabStopObj.adbeTabAlignmentChar = tabStop.alignmentCharacter;
        tabStopObj.adbeTabLeader = tabStop.leader;

        var position = TEXT.convertUnitsToPoints(horizontalUnits, tabStop.position);
        tabStopObj.adbeTabPosition = {type: 'pt', value: position};
        obj.adbeTabStops.push(tabStopObj);
    }

    if (obj.adbeTabStops.length === 0) {
        delete obj.adbeTabStops;
    }
};

TEXT.collectHyphenationProperties = function (obj, source) {
    // Hyphenate
    // Words Longer Than (With at Least)
    // After First
    // Before Last
    // Hyphen Limit
    // Hyphenation Zone 
    // Hyphen Weight
    // Hyphenate Capitalized Words
    var prefsOwner = TEXT.getPrefsOwner();

    var horizontalUnits = prefsOwner.viewPreferences.horizontalMeasurementUnits;

    obj.adbeHyphenation = source.hyphenation;
    if (obj.adbeHyphenation) {
        obj.adbeHyphenateWordsLongerThan = source.hyphenateWordsLongerThan;
        obj.adbeHyphenateAfterFirst = source.hyphenateAfterFirst;
        obj.adbeHyphenateBeforeLast = source.hyphenateBeforeLast;
        obj.adbeHyphenateLimit = source.hyphenateLadderLimit;

        var hyphenationZone = TEXT.convertUnitsToPoints(horizontalUnits, source.hyphenationZone);
        obj.adbeHyphenationZone = {type: 'pt', value: hyphenationZone};

        obj.adbeHyphenWeight = source.hyphenWeight * 10.0; //make it 0 to 100
        obj.adbeHyphenateCapitalizedWords = source.hyphenateCapitalizedWords;
    }
};

TEXT.fixupParagraphHyphenationSwitch = function (obj) {
    if (obj.adbeHyphenateWordsLongerThan !== undefined ||
            obj.adbeHyphenateAfterFirst !== undefined ||
            obj.adbeHyphenateBeforeLast !== undefined ||
            obj.adbeHyphenateLimit !== undefined ||
            obj.adbeHyphenationZone !== undefined ||
            obj.adbehyphenWeight !== undefined ||
            obj.adbeHyphenateCapitalizedWords !== undefined) {
        obj.adbeHyphenation = true;
    }
};

TEXT.collectJustificationProperties = function (obj, source) {
    // Minimumn Word Spacing
    // Desired Word Spacing
    // Maximum Word Spacing
    // Minimumn letter Spacing
    // Desired letter Spacing
    // Maximum letter Spacing
    // Minimumn Glyph Scaling
    // Desired Glyph Scaling
    // Maximum Glyph Scaling
    // Auto Leading
    // Single Word Justification
    obj.adbeMinimumWordSpacing = source.minimumWordSpacing;
    obj.adbeDesiredWordSpacing = source.desiredWordSpacing;
    obj.adbeMaximumWordSpacing = source.maximumWordSpacing;

    obj.adbeMinimumLetterSpacing = source.minimumLetterSpacing;
    obj.adbeDesiredLetterSpacing = source.desiredLetterSpacing;
    obj.adbeMaximumLetterSpacing = source.maximumLetterSpacing;

    obj.adbeMinimumGlyphScaling = source.minimumGlyphScaling;
    obj.adbeDesiredGlyphScaling = source.desiredGlyphScaling;
    obj.adbeMaximumGlyphScaling = source.maximumGlyphScaling;

    obj.adbeParaAutoLeading = source.autoLeading;
    obj.adbeSingleWordJustification = 'Justification.' + source.singleWordJustification.toString();
};

TEXT.collectJCompositionSettings = function (obj, source) {
    // Kinsoku Set
    // Kinsoku Type
    // Kinsoku Hang Type
    // Bunri-Kinshi
    // Mojikumi
    // Leading Model    
    var kinsokuSet = source.kinsokuSet;
    if (kinsokuSet === KinsokuSet.NOTHING ||
            kinsokuSet === KinsokuSet.HARD_KINSOKU ||
            kinsokuSet === KinsokuSet.SOFT_KINSOKU) {
        obj.adbeKinsokuSet = 'KinsokuSet.' + kinsokuSet.toString();
    }

    var kinsokuType = source.kinsokuType;
    if (kinsokuType === KinsokuType.KINSOKU_PUSH_IN_FIRST ||
            kinsokuType === KinsokuType.KINSOKU_PUSH_OUT_FIRST ||
            kinsokuType === KinsokuType.KINSOKU_PUSH_OUT_ONLY) {
        obj.adbeKinsokuType = 'KinsokuType.' + kinsokuType.toString();
    }

    obj.adbeKinsokuHangType = 'KinsokuHangType.' + source.kinsokuHangType.toString();
    obj.adbeBunriKinshi = source.bunriKinshi;

    //TODO
    //obj.adbeMojikumi
    //obj.adbeLeadingModel
};

TEXT.applyIndentsAndSpacing = function (target, style) {
    var properties = {};

    // Alignment
    if (style.adbeParaAlignment) {
        switch (style.adbeParaAlignment) {
        case 'Alignment.LEFT_ALIGN':
            properties.justification = Justification.LEFT_ALIGN;
            break;
        case 'Alignment.CENTER_ALIGN':
            properties.justification = Justification.CENTER_ALIGN;
            break;
        case 'Alignment.RIGHT_ALIGN':
            properties.justification = Justification.RIGHT_ALIGN;
            break;
        case 'Alignment.LEFT_JUSTIFIED':
            properties.justification = Justification.LEFT_JUSTIFIED;
            break;
        case 'Alignment.CENTER_JUSTIFIED':
            properties.justification = Justification.CENTER_JUSTIFIED;
            break;
        case 'Alignment.RIGHT_JUSTIFIED':
            properties.justification = Justification.RIGHT_JUSTIFIED;
            break;
        case 'Alignment.FULLY_JUSTIFIED':
            properties.justification = Justification.FULLY_JUSTIFIED;
            break;
        }
    }

    if (style.adbeLeftIndent) {
        var leftIndent = new UnitValue(style.adbeLeftIndent.value, style.adbeLeftIndent.type);
        properties.leftIndent = leftIndent.as('pt') + ' pt';
    }

    if (style.adbeFirstLineIndent) {
        var firstLineIndent = new UnitValue(style.adbeFirstLineIndent.value, style.adbeFirstLineIndent.type);
        properties.firstLineIndent = firstLineIndent.as('pt') + ' pt';
    }

    if (style.adbeRightIndent) {
        var rightIndent = new UnitValue(style.adbeRightIndent.value, style.adbeRightIndent.type);
        properties.rightIndent = rightIndent.as('pt') + ' pt';
    }

    if (style.adbeSpaceBefore) {
        var spaceBefore = new UnitValue(style.adbeSpaceBefore.value, style.adbeSpaceBefore.type);
        properties.spaceBefore = spaceBefore.as('pt') + ' pt';
    }

    if (style.adbeSpaceAfter) {
        var spaceAfter = new UnitValue(style.adbeSpaceAfter.value, style.adbeSpaceAfter.type);
        properties.spaceAfter = spaceAfter.as('pt') + ' pt';
    }

    target.properties = properties;
};

TEXT.applyTabs = function (target, style) {
    if (style.adbeTabStops) {
        var i;
        for (i = 0; i < style.adbeTabStops.length; ++i) {
            var tabStop = style.adbeTabStops[i];

            var properties = {};
            if (tabStop.adbeTabAlignment) {
                switch (tabStop.adbeTabAlignment) {
                case 'TabStopAlignment.LEFT_ALIGN':
                    properties.alignment = TabStopAlignment.LEFT_ALIGN;
                    break;
                case 'TabStopAlignment.CENTER_ALIGN':
                    properties.alignment = TabStopAlignment.CENTER_ALIGN;
                    break;
                case 'TabStopAlignment.RIGHT_ALIGN':
                    properties.alignment = TabStopAlignment.RIGHT_ALIGN;
                    break;
                case 'TabStopAlignment.CHARACTER_ALIGN':
                    properties.alignment = TabStopAlignment.CHARACTER_ALIGN;
                    break;
                }
            }

            if (tabStop.adbeTabAlignmentChar !== undefined) {
                properties.alignmentCharacter = tabStop.adbeTabAlignmentChar;
            }
            if (tabStop.adbeTabLeader !== undefined) {
                properties.leader = tabStop.adbeTabLeader;
            }
            if (tabStop.adbeTabPosition !== undefined) {
                var position = new UnitValue(tabStop.adbeTabPosition.value, tabStop.adbeTabPosition.type);
                properties.position = position.as('pt') + ' pt';
            }

            target.tabStops.add(properties);
        }
    }
};

TEXT.applyHyphenationProperties = function (target, style) {
    if (style.adbeHyphenation === true) {
        var properties = {};
        properties.hyphenation = true;

        if (style.adbeHyphenateWordsLongerThan !== undefined) {
            properties.hyphenateWordsLongerThan = style.adbeHyphenateWordsLongerThan;
        }
        if (style.adbeHyphenateAfterFirst !== undefined) {
            properties.hyphenateAfterFirst = style.adbeHyphenateAfterFirst;
        }
        if (style.adbeHyphenateBeforeLast !== undefined) {
            properties.hyphenateBeforeLast = style.adbeHyphenateBeforeLast;
        }
        if (style.adbeHyphenateLimit !== undefined) {
            properties.hyphenateLadderLimit = style.adbeHyphenateLimit;
        }
        if (style.adbeHyphenationZone) {
            var hyphenationZone = new UnitValue(style.adbeHyphenationZone.value, style.adbeHyphenationZone.type);
            properties.hyphenationZone = hyphenationZone.as('pt') + ' pt';
        }
        if (style.adbeHyphenWeight !== undefined) {
            properties.hyphenWeight = Math.round(style.adbeHyphenWeight / 10.0);
        }
        if (style.adbeHyphenateCapitalizedWords !== undefined) {
            properties.hyphenateCapitalizedWords = style.adbeHyphenateCapitalizedWords;
        }

        target.properties = properties;

    } else if (style.adbeHyphenation === false) {
        target.hyphenation = false;
    }
};

TEXT.applyJustificationProperties = function (target, style) {
    var properties = {};

    if (style.adbeMinimumWordSpacing !== undefined) {
        properties.minimumWordSpacing = style.adbeMinimumWordSpacing;
    }
    if (style.adbeDesiredWordSpacing !== undefined) {
        properties.desiredWordSpacing = style.adbeDesiredWordSpacing;
    }
    if (style.adbeMaximumWordSpacing !== undefined) {
        properties.maximumWordSpacing = style.adbeMaximumWordSpacing;
    }
    if (style.adbeMinimumLetterSpacing !== undefined) {
        properties.minimumLetterSpacing = style.adbeMinimumLetterSpacing;
    }
    if (style.adbeDesiredLetterSpacing !== undefined) {
        properties.desiredLetterSpacing = style.adbeDesiredLetterSpacing;
    }
    if (style.adbeMaximumLetterSpacing !== undefined) {
        properties.maximumLetterSpacing = style.adbeMaximumLetterSpacing;
    }
    if (style.adbeMinimumGlyphScaling !== undefined) {
        properties.minimumGlyphScaling = style.adbeMinimumGlyphScaling;
    }
    if (style.adbeDesiredGlyphScaling !== undefined) {
        properties.desiredGlyphScaling = style.adbeDesiredGlyphScaling;
    }
    if (style.adbeMaximumGlyphScaling !== undefined) {
        properties.maximumGlyphScaling = style.adbeMaximumGlyphScaling;
    }
    if (style.adbeParaAutoLeading !== undefined) {
        properties.autoLeading = style.adbeParaAutoLeading;
    }
    if (style.adbeSingleWordJustification !== undefined) {
        switch (style.adbeSingleWordJustification) {
        case 'Justification.FULLY_JUSTIFIED':
            properties.singleWordJustification = SingleWordJustification.FULLY_JUSTIFIED;
            break;
        case 'Justification.LEFT_ALIGN':
            properties.singleWordJustification = SingleWordJustification.LEFT_ALIGN;
            break;
        case 'Justification.CENTER_ALIGN':
            properties.singleWordJustification = SingleWordJustification.CENTER_ALIGN;
            break;
        case 'Justification.RIGHT_ALIGN':
            properties.singleWordJustification = SingleWordJustification.RIGHT_ALIGN;
            break;
        }
    }

    target.properties = properties;
};

TEXT.applyJCompositionSettings = function (target, style) {
    var properties = {};

    if (style.adbeKinsokuSet) {
        switch (style.adbeKinsokuSet) {
        case 'KinsokuSet.NOTHING':
            properties.kinsokuSet = KinsokuSet.NOTHING;
            break;
        case 'KinsokuSet.HARD_KINSOKU':
            properties.kinsokuSet = KinsokuSet.HARD_KINSOKU;
            break;
        case 'KinsokuSet.SOFT_KINSOKU':
            properties.kinsokuSet = KinsokuSet.SOFT_KINSOKU;
            break;
        }
    }

    if (style.adbeKinsokuType) {
        switch (style.adbeKinsokuType) {
        case 'KinsokuType.KINSOKU_PUSH_IN_FIRST':
            properties.kinsokuType = KinsokuType.KINSOKU_PUSH_IN_FIRST;
            break;
        case 'KinsokuType.KINSOKU_PUSH_OUT_FIRST':
            properties.kinsokuType = KinsokuType.KINSOKU_PUSH_OUT_FIRST;
            break;
        case 'KinsokuType.KINSOKU_PUSH_OUT_ONLY':
            properties.kinsokuType = KinsokuType.KINSOKU_PUSH_OUT_ONLY;
            break;
        }
    }

    if (style.adbeKinsokuHangType) {
        switch (style.adbeKinsokuHangType) {
        case 'KinsokuHangType.NONE':
            properties.kinsokuHangType = KinsokuHangTypes.NONE;
            break;
        case 'KinsokuHangType.KINSOKU_HANG_REGULAR':
            properties.kinsokuHangType = KinsokuHangTypes.KINSOKU_HANG_REGULAR;
            break;
        case 'KinsokuHangType.KINSOKU_HANG_FORCE':
            properties.kinsokuHangType = KinsokuHangTypes.KINSOKU_HANG_FORCE;
            break;
        }
    }

    if (style.adbeBunriKinshi !== undefined) {
        properties.bunriKinshi = style.adbeBunriKinshi;
    }

    //TODO
    //properties.adbeMojikumi
    //properties.adbeLeadingModel

    target.properties = properties;
};

TEXT.getTextStylePreviewColorFromText = function (text, isCharStyle) {

    //Use RGB black for text color
    var textColorValues = [0, 0, 0];
    var fontFamily;
    if (isCharStyle) {
        fontFamily = (text.appliedFont.__class__ === 'String') ? text.appliedFont : text.appliedFont.fontFamily;
        var appliedParaStyle = text.appliedParagraphStyle;
        var paraStyleFontFamily = (appliedParaStyle.appliedFont.__class__ === 'String') ? appliedParaStyle.appliedFont : appliedParaStyle.appliedFont.fontFamily;

        if (fontFamily === paraStyleFontFamily) {
            //If character style is defining a font family, the style does have font defined.
            var appliedCharStyle = text.appliedCharacterStyle;
            if (appliedCharStyle.appliedFont === NothingEnum.NOTHING || appliedCharStyle.appliedFont === '') {
                textColorValues = [128, 128, 128];
            }
        }
    } else {
        //If the applied font family is different from [No paragraph style], text has font defined through styles/overrides etc.
        fontFamily = (text.appliedFont.__class__ === 'String') ? text.appliedFont : text.appliedFont.fontFamily;
        var rootParaStyle = app.paragraphStyles.itemByName(AppStrings.NoParagraphStyle);
        var baseFontFamily = rootParaStyle.appliedFont.fontFamily;

        if (fontFamily === baseFontFamily) {
            textColorValues = [128, 128, 128];
        }
    }
    return textColorValues;
};

TEXT.getTextStylePreviewColorFromStyleObject = function (styleObj) {
    //Use RGB black for text color
    var textColorValues = [0, 0, 0];

    if (!styleObj.styleInfo.adbeFont && !styleObj.styleInfo.fontFamily) {
        // If the style does not have font information, use gray color for the text.
        textColorValues = [128, 128, 128];
    }
    return textColorValues;
};

TEXT.getTypeStyleWithOverridesInfoObject = function (text, isCharStyle) {
    var styleObj = {};

    var previewBasePath = Folder.temp.fsName + '/TextStylePreview' + $.hiresTimer;
    var previewPath = previewBasePath + '.png';

    //Generate style preview
    var textColorSpace = ColorSpace.RGB;
    var textColorValues = TEXT.getTextStylePreviewColorFromText(text, isCharStyle);

    var styleType = isCharStyle ? StyleType.CHARACTER_STYLE_TYPE : StyleType.PARAGRAPH_STYLE_TYPE;
    text.createStyleThumbnailWithProperties(JSXGlobals.textPreviewString, JSXGlobals.textPreviewFontSize, textColorSpace, textColorValues, new File(previewPath), styleType);

    styleObj.previewPath = previewPath;
    styleObj.idmsPath = previewBasePath + '.idms';

    //Since the style is deleted as soon as we are done with snippet and thumbnail, we need to place the newly created snippet 
    //in a headless document so that we can get the style object JSON from that.
    var tempDoc = app.documents.add(false);

    //Remove all type style in the headless document.
    //This ensures that the new snippet placement in headless document does not cause any style conflicts.
    TEXT.removeAllTypeStyles(tempDoc);

    //Get the applied style.
    var pageItems = tempDoc.pages[0].place(styleObj.idmsPath, [0, 0], undefined, false, true);
    if (pageItems.length !== 1) {
        tempDoc.close(SaveOptions.NO);
        return;
    }

    var newText = pageItems[0].texts[0];
    var typeStyle = isCharStyle ? newText.appliedCharacterStyle : newText.appliedParagraphStyle;

    styleObj.styleName = typeStyle.name;
    if (isCharStyle) {
        styleObj.styleInfo = TEXT.getCharacterStyleObject(typeStyle);
    } else {
        styleObj.styleInfo = TEXT.getParagraphStyleObject(typeStyle);
    }

    tempDoc.close(SaveOptions.NO);
    //if you want to see what's going back, uncomment the line below
    //alert(JSON.stringify(styleObj));

    return styleObj;
};

TEXT.getTypeStyleInfoObject = function (typeStyle) {
    if (!typeStyle) {
        return; //undefined
    }

    var styleObj = {};

    styleObj.styleName = typeStyle.name;

    if (typeStyle.__class__ === 'CharacterStyle') {
        styleObj.styleInfo = TEXT.getCharacterStyleObject(typeStyle);
    } else {
        styleObj.styleInfo = TEXT.getParagraphStyleObject(typeStyle);
    }

    //Generate style preview
    var textColorSpace = ColorSpace.RGB;
    var textColorValues = TEXT.getTextStylePreviewColorFromStyleObject(styleObj);

    var previewBasePath = Folder.temp.fsName + '/TextStylePreview' + $.hiresTimer;
    var previewPath = previewBasePath + '.png';
    typeStyle.createThumbnailWithProperties(JSXGlobals.textPreviewString, JSXGlobals.textPreviewFontSize, textColorSpace, textColorValues, new File(previewPath));

    styleObj.previewPath = previewPath;
    styleObj.idmsPath = previewBasePath + '.idms';

    //if you want to see what's going back, uncomment the line below
    //alert(JSON.stringify(styleObj));

    return styleObj;
};

//getStyleFullyQualifiedName retrieves the full style name, combining
//the name of the style and parent groups together separated by nul.
TEXT.getStyleFullyQualifiedName = function (object) {
    var objectName = object.name;

    if (object.parent.__class__ !== 'Application' && object.parent.__class__ !== 'Document') {
        return TEXT.getStyleFullyQualifiedName(object.parent) + '\u0000' + objectName;
    }

    return objectName;
};

TEXT.getStyleByFullyQualifiedName = function (styleFQN, isCharStyle, stylesOwner) {
    var object = stylesOwner;
    var tmp = styleFQN.split('\u0000');

    var i;
    for (i = 0; i < (tmp.length - 1); ++i) {
        if (object.isValid) {
            if (isCharStyle) {
                object = object.characterStyleGroups.itemByName(tmp[i]);
            } else {
                object = object.paragraphStyleGroups.itemByName(tmp[i]);
            }
        } else {
            break;
        }
    }

    if (object.isValid) {
        if (isCharStyle) {
            object = object.characterStyles.itemByName(tmp[tmp.length - 1]);
        } else {
            object = object.paragraphStyles.itemByName(tmp[tmp.length - 1]);
        }

        if (object.isValid) {
            return object;
        }
    }

    return; //undefined
};

TEXT.getTypeStyleInfoByID = function (documentID, styleID, isCharStyle) {
    var stylesOwner = app;
    var typeStyle;

    if (documentID !== -1) {
        stylesOwner = app.documents.itemByID(documentID);
        if (isCharStyle) {
            typeStyle = stylesOwner.characterStyles.itemByID(styleID);
        } else {
            typeStyle = stylesOwner.paragraphStyles.itemByID(styleID);
        }
    } else {
        stylesOwner = app.documents.add(false);
        var styleName;
        if (isCharStyle) {
            styleName = TEXT.getStyleFullyQualifiedName(app.characterStyles.itemByID(styleID));
            typeStyle = TEXT.getStyleByFullyQualifiedName(styleName, true, stylesOwner);
        } else {
            styleName = TEXT.getStyleFullyQualifiedName(app.paragraphStyles.itemByID(styleID));
            typeStyle = TEXT.getStyleByFullyQualifiedName(styleName, false, stylesOwner);
        }
    }

    var styleObj = TEXT.getTypeStyleInfoObject(typeStyle);

    if (documentID === -1) {
        stylesOwner.close();
    }

    return styleObj;
};

TEXT.getTypeStyleInfo = function (isCharStyle) {
    if (app.selection.length === 0) {
        return; //undefined
    }

    var selection = app.selection[0];
    if (selection.__class__ === 'TextFrame' || selection.__class__ === 'Cell') {
        selection = selection.texts[0];
    }

    var styleType = isCharStyle ? StyleType.CHARACTER_STYLE_TYPE : StyleType.PARAGRAPH_STYLE_TYPE;
    var styleObj; //undefined

    if (selection.textHasOverrides(styleType)) {
        styleObj = TEXT.getTypeStyleWithOverridesInfoObject(selection, isCharStyle);
    } else {
        var typeStyle;
        if (isCharStyle) {
            typeStyle = selection.appliedCharacterStyle;
        } else {
            typeStyle = selection.appliedParagraphStyle;
        }
        styleObj = TEXT.getTypeStyleInfoObject(typeStyle);
    }
    return styleObj;
};

//If the text has local overrides, allow picking up the style. A new style (with overrides) is created in that case.
//Do not allow picking up [None] character style
//Do not allow picking up [No Paragraph Style] paragraph style
TEXT.canAddTypeStyle = function (text, isCharStyle) {

    var allowed = false;
    if (isCharStyle) {
        allowed = text.textHasOverrides(StyleType.CHARACTER_STYLE_TYPE) ||
                    text.appliedCharacterStyle.name !== AppStrings.NoneCharacterStyle;
    } else {
        allowed = text.textHasOverrides(StyleType.PARAGRAPH_STYLE_TYPE) ||
                    text.appliedParagraphStyle.name !== AppStrings.NoParagraphStyle;
    }

    return allowed;
};
