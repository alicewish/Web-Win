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

/* returns # of artboards in the current document */

var classDocument   = app.charIDToTypeID("Dcmn"),
    classProperty   = app.charIDToTypeID("Prpr"),
    eventGet        = app.charIDToTypeID("getd"),
    enumTarget      = app.charIDToTypeID("Trgt"),
    keyArtboards    = app.stringIDToTypeID("artboards"),
    keyList         = app.stringIDToTypeID("list"),
    typeNULL        = app.charIDToTypeID("null"),
    typeOrdinal     = app.charIDToTypeID("Ordn");
    
var targetDocRef = new ActionReference();
targetDocRef.putProperty(classProperty, keyArtboards);
targetDocRef.putEnumerated(classDocument, typeOrdinal, enumTarget);

var getDescriptor = new ActionDescriptor();
getDescriptor.putReference(typeNULL, targetDocRef);
var desc = executeAction(eventGet, getDescriptor, DialogModes.NO);

desc.getObjectValue(keyArtboards).getList(keyList).count;
