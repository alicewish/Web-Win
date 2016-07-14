/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50, sloppy: true, continue: true */
/*global $, Folder, app, DocumentFill, ActionDescriptor, ActionReference, DialogModes, File,
         TypeUnits, ActionList, SolidColor, executeAction, executeActionGet, PhotoshopSaveOptions, SaveOptions, PNGSaveOptions, WarpStyle,
         AntiAlias, Direction, AutoKernType, UnderlineType, StrikeThruType, TextCase,
         LayerKind, cssToClip, svg, ColorModel, JSXGlobals, PSKey, PSClass, PSString, PSType, PSEnum, descriptorToColorData, cTID, sTID */
var PSClass = function () {};
var PSEnum = function () {};
var PSEvent = function () {};
var PSForm = function () {};
var PSKey = function () {};
var PSType = function () {};
var PSUnit = function () {};
var PSString = function () {};

PSClass.Document = cTID('Dcmn');
PSClass.Version = cTID('Vrsn');

PSClass.RGBColor = cTID('RGBC');
PSClass.CMYKColor = cTID('CMYC');
PSClass.HSBColor = cTID('HSBC');
PSClass.Grayscale = cTID('Grsc');
PSClass.LabColor = cTID('LbCl');

PSUnit.Angle = cTID('#Ang');

PSKey.Gray = cTID('Gry ');

PSKey.Red = cTID('Rd  ');
PSKey.Green = cTID('Grn ');
PSKey.Blue = cTID('Bl  ');

PSKey.Cyan = cTID('Cyn ');
PSKey.Magenta = cTID('Mgnt');
PSKey.Yellow = cTID('Ylw ');
PSKey.Black = cTID('Blck');

PSKey.Hue = cTID('H   ');
PSKey.Start = cTID('Strt');
PSKey.Brightness = cTID('Brgh');

PSKey.Luminance = cTID('Lmnc');
PSKey.A = cTID('A   ');
PSKey.B = cTID('B   ');

PSClass.Color = sTID('color'); // DEPRECATE: Use PSKey.Color
PSClass.ColorStop = cTID('Clrt');
PSClass.Gradient = cTID('Grdn');
PSClass.Layer = cTID('Lyr ');
PSClass.LayerEffects = cTID('Lefx');
PSClass.Point = sTID('point'); // 'Pnt '
PSClass.Property = sTID('property'); // 'Prpr'

PSClass.Application = cTID('capp');
PSClass.Brush = cTID('Brsh');
PSClass.PaintbrushTool = cTID('PbTl');
PSKey.Append = cTID('Appe');
PSEvent.Select = cTID('slct'); // DEPRECATE: Use PSKey.Select

PSClass.TransparencyStop = cTID('TrnS');
PSEnum.CustomStops = cTID('CstS');
PSEnum.GradientFill = cTID('GrFl');
PSEnum.Linear = cTID('Lnr ');
PSEnum.Normal = cTID('Nrml');
PSEnum.Target = sTID('targetEnum');    // 'Trgt'
PSEnum.UserStop = cTID('UsrS');
PSEnum.QCSAverage = cTID('Qcsa');

PSEvent.Set = sTID('set'); // 'setd'
PSEvent.Place = cTID('Plc ');

PSKey.FrameFX = cTID('FrFX');
PSKey.Using = cTID('Usng');
PSEvent.Make = cTID('Mk  ');
PSKey.Alignment = cTID('Algn');
PSKey.Angle = cTID('Angl');
PSKey.Color = sTID('color'); // 'Clr '
PSKey.Colors = cTID('Clrs');
PSKey.Dither = cTID('Dthr');
PSKey.Enabled = cTID('enab');
PSKey.FreeTransformCenterState = cTID('FTcs');
PSKey.Gradient = cTID('Grad');
PSKey.Horizontal = cTID('Hrzn');
PSKey.Interpolation = cTID('Intr');
PSKey.Location = cTID('Lctn');
PSKey.Merge = sTID('merge');
PSKey.Midpoint = cTID('Mdpn');
PSKey.Mode = cTID('Md  ');
PSKey.Name = cTID('Nm  ');
PSKey.Offset = cTID('Ofst');
PSKey.Opacity = cTID('Opct');
PSKey.Reverse = cTID('Rvrs');
PSKey.Scale = cTID('Scl ');
PSKey.SolidFill = cTID('SoFi');
PSKey.To = sTID('to'); // 'T   '
PSKey.Transparency = cTID('Trns');
PSKey.Type = cTID('Type');
PSKey.Vertical = cTID('Vrtc');
PSKey.Text = sTID('textKey'); // 'Txt '

PSKey.Transform = sTID('transform');
PSKey.Xx = sTID('xx');
PSKey.Xy = sTID('xy');
PSKey.Yx = sTID('yx');
PSKey.Yy = sTID('yy');
PSKey.Tx = sTID('tx');
PSKey.Ty = sTID('ty');

PSString.Null = sTID('null'); // DEPRECATE: Use PSKey.Target
PSString.contentLayer = sTID('contentLayer');
PSString.fillEnabled = sTID('fillEnabled');
PSString.shapeStyle = sTID('shapeStyle');
PSString.solidColorLayer = sTID('solidColorLayer');
PSString.strokeStyle = sTID('strokeStyle');
PSString.strokeStyleVersion = sTID('strokeStyleVersion');
PSString.strokeEnabled = sTID('strokeEnabled');
PSString.strokeStyleContent = sTID('strokeStyleContent');

PSType.BlendMode = cTID('BlnM');
PSType.ColorStopType = cTID('Clry');
PSType.FillContents = cTID('FlCn');
PSType.GradientForm = cTID('GrdF');
PSType.GradientType = cTID('GrdT');
PSType.Ordinal = sTID('ordinal'); // 'Ordn'
PSType.QuadCenterState = cTID('QCSt');

PSUnit.Angle = cTID('#Ang');
PSUnit.Percent = cTID('#Prc');
PSUnit.Pixels = cTID('#Pxl');
PSUnit.Points = sTID('pointsUnit'); // '#Pnt'
PSUnit.Millimeters = sTID('millimetersUnit'); // '#Mlm'

//Text Style Values
PSClass.TextStyleRange = sTID('textStyleRange'); // 'Txtt' // RENAME: PSKey.TextStyleRange
PSClass.TextStyle = sTID('textStyle'); // 'TxtS' // RENAME: PSKey.TextStyle
PSClass.TextLayer = sTID('textLayer'); // 'TxLr' // RENAME: PSKey.TextLayer
PSType.AntiAlias = cTID('Annt');
PSKey.Bounds = sTID('bounds');
PSKey.Char = sTID('char');
PSKey.FontCaps = sTID('fontCaps');
PSKey.AltLigature = sTID('altligature');
PSKey.FontName = cTID('FntN');
PSKey.FontStyleName = cTID('FntS');
PSKey.Fractions = sTID('fractions');
PSKey.Leading = sTID('leading'); // 'Ldng'
PSKey.Ligature = sTID('ligature');
PSKey.ImpliedLeading = sTID('impliedLeading');
PSKey.NoBreak = sTID('noBreak');
PSKey.OldStyle = sTID('oldStyle');
PSKey.Ordinals = sTID('ordinals');
PSKey.Ornaments = sTID('ornaments');
PSKey.Titling = sTID('titling');
PSKey.Tracking = sTID('tracking'); // 'Trck'
PSKey.HorizontalScale = sTID('horizontalScale'); // 'HrzS'
PSKey.VerticalScale = sTID('verticalScale'); // 'VrtS'
PSKey.Size = sTID('size');    // 'Sz  '
PSKey.ImpliedFontSize = sTID('impliedFontSize');
PSKey.Orientation = cTID('Ornt');
PSKey.SubScript = sTID('subScript');
PSKey.SuperScript = sTID('superScript');
PSKey.BaselineNormal = sTID('normal');
PSKey.StylisticAlternates = sTID('stylisticAlternates');
PSKey.ContextualLigatures = sTID('contextualLigatures');
PSKey.Swash = sTID('swash');
PSKey.SyntheticBold = sTID('syntheticBold');
PSKey.SyntheticItalic = sTID('syntheticItalic');
PSKey.TextClickPoint = sTID('textClickPoint'); // 'TxtC'
PSKey.TextShape = sTID('textShape');
PSKey.Underline = sTID('underline'); // 'Undl'
PSKey.AutoKerning = sTID('autoKern'); // 'AtKr'
PSEnum.Box = sTID('box');
PSEnum.Horizontal = cTID('Hrzn');
PSEnum.Vertical = cTID('Vrtc');
PSEnum.AntiAliasNone = cTID('Anno');
PSEnum.AntiAliasLow = cTID('AnLo');
PSEnum.AntiAliasMedium = cTID('AnMd');
PSEnum.AntiAliasHigh = cTID('AnHi');
PSEnum.AntiAliasCrisp = cTID('AnCr');
PSEnum.AntiAliasStrong = cTID('AnSt');
PSEnum.AntiAliasSmooth = cTID('AnSm');
PSString.AutoLeading = sTID('autoLeading');
PSString.strikethrough = sTID('strikethrough');
PSString.fontPostScriptName = sTID('fontPostScriptName');
PSString.underlineOnLeftInVertical = sTID('underlineOnLeftInVertical');
PSString.underlineOnRightInVertical = sTID('underlineOnRightInVertical');
PSString.xHeightStrikethroughOn = sTID('xHeightStrikethroughOn');
PSString.opticalKern = sTID('opticalKern');
PSString.metricsKern = sTID('metricsKern');
PSString.manual = sTID('manual');
PSKey.Baseline = sTID('baseline');
PSKey.BaselineShift = sTID('baselineShift'); // 'Bsln'
PSKey.ImpliedBaselineShift = sTID('impliedBaselineShift');

PSKey.FileOpenContext = sTID("fileOpenContext");
PSEnum.FileOpenContextCCLibraries = sTID("fileOpenContextCCLibrariesAsset");


PSString.FROM = sTID('from');
PSString.TO = sTID('to'); // DEPRECATE: Use PSKey.To

PSString.TEXT_STYLE = sTID('textStyle'); // DEPRECATE: PSClass.TextStyle
PSString.TEXT_STYLE_RANGE = sTID('textStyleRange');    // DEPRECATE: PSClass.TextStyleRange

PSString.ORIENTATION = sTID('orientation');

PSString.ANTI_ALIAS = sTID('antiAlias');
PSString.ANTI_ALIAS_TYPE = sTID('antiAliasType');
PSString.ANTI_ALIAS_IDS = {};
PSString.ANTI_ALIAS_IDS[AntiAlias.CRISP]  = sTID('antiAliasCrisp');
PSString.ANTI_ALIAS_IDS[AntiAlias.NONE]   = sTID('antiAliasNone');
PSString.ANTI_ALIAS_IDS[AntiAlias.SHARP]  = sTID('antiAliasSharp');
PSString.ANTI_ALIAS_IDS[AntiAlias.SMOOTH] = sTID('antiAliasSmooth');
PSString.ANTI_ALIAS_IDS[AntiAlias.STRONG] = sTID('antiAliasStrong');
PSString.ANTI_ALIAS_IDS['AntiAlias.PLATFORM_GRAY'] = sTID('antiAliasPlatformGray');
PSString.ANTI_ALIAS_IDS['AntiAlias.PLATFORM_LCD'] = sTID('antiAliasPlatformLCD');

PSString.WARP = sTID('warp');
PSString.WARP_ROTATE = sTID('warpRotate');
PSString.WARP_STYLE = sTID('warpStyle');
PSString.WARP_STYLE_IDS = {};
PSString.WARP_STYLE_IDS[WarpStyle.ARC] =  sTID('warpArc');
PSString.WARP_STYLE_IDS[WarpStyle.ARCH] =  sTID('warpArch');
PSString.WARP_STYLE_IDS[WarpStyle.ARCLOWER] =  sTID('warpArcLower');
PSString.WARP_STYLE_IDS[WarpStyle.ARCUPPER] =  sTID('warpArcUpper');
PSString.WARP_STYLE_IDS[WarpStyle.BULGE] =  sTID('warpBulge');
PSString.WARP_STYLE_IDS[WarpStyle.FISH] =  sTID('warpFish');
PSString.WARP_STYLE_IDS[WarpStyle.FISHEYE] =  sTID('warpFisheye');
PSString.WARP_STYLE_IDS[WarpStyle.FLAG] =  sTID('warpFlag');
PSString.WARP_STYLE_IDS[WarpStyle.INFLATE] =  sTID('warpInflate');
PSString.WARP_STYLE_IDS[WarpStyle.NONE] =  sTID('warpNone');
PSString.WARP_STYLE_IDS[WarpStyle.RISE] =  sTID('warpRise');
PSString.WARP_STYLE_IDS[WarpStyle.SHELLLOWER] =  sTID('warpShellLower');
PSString.WARP_STYLE_IDS[WarpStyle.SHELLUPPER] =  sTID('warpShellUpper');
PSString.WARP_STYLE_IDS[WarpStyle.SQUEEZE] =  sTID('warpSqueeze');
PSString.WARP_STYLE_IDS[WarpStyle.TWIST] =  sTID('warpTwist');
PSString.WARP_STYLE_IDS[WarpStyle.WAVE] =  sTID('warpWave');

PSString.DIRECTION_IDS = {};
PSString.DIRECTION_IDS[Direction.HORIZONTAL] = sTID('horizontal');
PSString.DIRECTION_IDS[Direction.VERTICAL] = sTID('vertical');


PSString.AUTO_KERN_IDS = {};
PSString.AUTO_KERN_IDS[AutoKernType.MANUAL] = sTID('manual');
PSString.AUTO_KERN_IDS[AutoKernType.METRICS] = sTID('metricsKern');
PSString.AUTO_KERN_IDS[AutoKernType.OPTICAL] = sTID('opticalKern');

PSString.UNDERLINE_TYPE_IDS = {};
PSString.UNDERLINE_TYPE_IDS[UnderlineType.UNDERLINEOFF] = sTID('underlineOff');
PSString.UNDERLINE_TYPE_IDS[UnderlineType.UNDERLINERIGHT] = sTID('underlineOnRightInVertical');
PSString.UNDERLINE_TYPE_IDS[UnderlineType.UNDERLINELEFT] = sTID('underlineOnLeftInVertical');


PSString.STRIKETHRU_TYPE_IDS = {};
PSString.STRIKETHRU_TYPE_IDS[StrikeThruType.STRIKEOFF] = sTID('strikethroughOff');
PSString.STRIKETHRU_TYPE_IDS[StrikeThruType.STRIKEHEIGHT] = sTID('xHeightStrikethroughOn');
PSString.STRIKETHRU_TYPE_IDS[StrikeThruType.STRIKEBOX] = sTID('eMBoxStrikethroughOn');

PSString.TEXT_CASE_IDS = {};
PSString.TEXT_CASE_IDS[TextCase.ALLCAPS] = sTID('allCaps');
PSString.TEXT_CASE_IDS[TextCase.NORMAL] = sTID('normal');
PSString.TEXT_CASE_IDS[TextCase.SMALLCAPS] = sTID('smallCaps');


PSEvent.Crop = cTID('Crop');
PSKey.Top = cTID('Top ');
PSKey.Left = cTID('Left');
PSKey.Right = sTID('right'); // 'Rght'
PSKey.Bottom = sTID('bottom'); // 'Btom'
PSClass.Rectangle = cTID('Rctn');
PSEvent.Delete = cTID('Dlt ');
PSKey.ConstrainProportions = cTID('CnsP');

PSKey.CCLibrariesConfig = cTID('CCLc');
PSKey.EnableGeneralLinking = sTID('enableGeneralLinking');
PSKey.FileFormats = sTID('FileFormats');
PSKey.LargeDocumentFormat = sTID('largeDocumentFormat');
PSKey.Photoshop35Format = sTID('photoshop35Format');
PSKey.HasVectorMask = sTID('hasVectorMask');
PSKey.LayerKey = sTID('layer');
PSKey.OrdinalKey = sTID('ordinal');    // DEPRECATE: Use PSType.Ordinal
PSKey.Select = sTID('select'); // 'slct'
PSKey.SelectionModifier = sTID('selectionModifier');
PSKey.SelectionModifierType = sTID('selectionModifierType');
PSKey.AddToSelection = sTID('addToSelection');
PSKey.Target = sTID('target');    // 'null'
PSKey.TargetEnum = sTID('targetEnum');    // DEPRECATE: Use PSEnum.Target
PSKey.MaximizeCompatibility = sTID('maximizeCompatibility');
PSKey.Save = sTID('save');
PSKey.Export = sTID('export');
PSKey.OverrideOpen = sTID('overrideOpen');
PSKey.ReadableFileExtensions = sTID("readableFileExtensions");
PSKey.Representation = sTID('representation');
PSKey.SaveForCCLibrariesElement = sTID('saveForCCLibrariesElement');
PSKey.SmartObject = sTID('smartObject');
PSKey.As = sTID('as');
PSKey.LowerCase = sTID('lowerCase');
PSKey.IN = sTID('in');
PSKey.PLACE_EVENT = sTID('placeEvent');
PSKey.LINK = sTID('link');
PSKey.LINKED = sTID('linked');
PSKey.UNWRAP_LAYERS = sTID('unwrapLayers');
PSKey.LAYER_NAME = sTID('layerName');
PSKey.LIBRARY_NAME = sTID('libraryName');
PSKey.LIB_ELEMENT = sTID('ccLibrariesElement');
PSKey.ELEMENT_REF = sTID('elementReference');
PSKey.DATE_MODIFIED = sTID('dateModified');
PSKey.ADOBE_STOCK_ID = sTID('adobeStockId');
PSKey.ADOBE_STOCK_LICENSE_STATE = sTID('adobeStockLicenseState');
PSKey.Licensed = sTID('licensed');
PSKey.Unlicensed = sTID('unlicensed');

PSString.interfacePrefs = sTID('interfacePrefs');
PSKey.ShowToolTips = cTID('ShwT');

PSString.Open = sTID('open');
PSString.IN = sTID('in');
PSString.PixelWidth = sTID('pixelWidth');
PSString.PixelHeight = sTID('pixelHeight');
PSString.ExternalPreview = sTID('externalPreviewParams');

PSEvent.Duplicate = cTID('Dplc');

// These are needed for Highbeam analytics reporting. The PSKey entries are custom, not defined by PS.
PSEvent.HeadlightsInfo = sTID('headlightsInfo');
PSEvent.Record = sTID('eventRecord');

// These are custom keys that we pass through as headlights data.
// Per Headlights documentation:
// Avoid using the following key names:
// GroupID, docID, sequenceNum, time, sessionId are illegal for data record name.
// Because they will lead to failure of pivot operation. The illegal names are case insensitive.
// We will add prefix "HL_validataion_error_" before the illegal name. The modified name will occur in database.
// e.g. GroupID will be modified to HL_validataion_error_groupID.
PSKey.HighbeamEventName = sTID("eventName");
PSKey.HighbeamLibraryID = sTID("libraryID");
PSKey.HighbeamLibraryElementCount = sTID("libraryElemCount");
PSKey.HighbeamElementID = sTID("elementID");
PSKey.HighbeamElementType = sTID("elementType");
PSKey.HighbeamRepresentationType = sTID("representationType");
PSKey.HighbeamOpType = sTID("opType");
PSKey.HighbeamDetails = sTID("details");
