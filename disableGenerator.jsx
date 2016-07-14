/*
 * ADOBE CONFIDENTIAL
 *
 * Copyright (c) 2015 Adobe Systems Incorporated. All rights reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 */

/* unchecks "Enable Generator" checkbox in the PS Plug-ins Preferences */

var classApplication        = app.charIDToTypeID("capp"),
    classPluginPrefs        = app.charIDToTypeID("PlgP"),
    classProperty           = app.charIDToTypeID("Prpr"),
    enumTarget              = app.charIDToTypeID("Trgt"),
    eventGet                = app.charIDToTypeID("getd"),
    eventSet                = app.charIDToTypeID("setd");
    keyTo                   = app.charIDToTypeID("T   "),
    typeNULL                = app.charIDToTypeID("null"),
    typeOrdinal             = app.charIDToTypeID("Ordn"),
    kgeneratorDisabledStr   = app.stringIDToTypeID("generatorDisabled"),
    kgeneratorEnabledStr    = app.stringIDToTypeID("generatorEnabled");

var enable = false
var desc = new ActionDescriptor();
var ref = new ActionReference();
ref.putProperty(classProperty, classPluginPrefs);
ref.putEnumerated(classApplication, typeOrdinal, enumTarget);
desc.putReference(typeNULL, ref);
var desc5 = new ActionDescriptor();
desc5.putBoolean(kgeneratorEnabledStr, enable);
desc5.putBoolean(kgeneratorDisabledStr, !enable);
desc.putObject(keyTo, classPluginPrefs, desc5);
executeAction(eventSet, desc, DialogModes.NO);
