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

/* returns true if the "Enable Generator" checkbox is checked in the PS Plug-ins Preferences */

var classApplication    = app.charIDToTypeID("capp"),
    classProperty       = app.charIDToTypeID("Prpr"),
    enumTarget          = app.charIDToTypeID("Trgt"),
    eventGet            = app.charIDToTypeID("getd"),
    typeNULL            = app.charIDToTypeID("null"),
    typeOrdinal         = app.charIDToTypeID("Ordn"),
    kgeneratorStatusStr = app.stringIDToTypeID("generatorStatus");

var ref = new ActionReference();
var desc1 = new ActionDescriptor();
ref.putProperty(classProperty, kgeneratorStatusStr);
ref.putEnumerated(classApplication, typeOrdinal, enumTarget);
desc1.putReference(typeNULL, ref);

var desc = executeAction(eventGet, desc1, DialogModes.NO);
var v = desc.getObjectValue(kgeneratorStatusStr);

v.getInteger(kgeneratorStatusStr) ? true : false
