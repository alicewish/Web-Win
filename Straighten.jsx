// (c) Copyright 2011.  Adobe Systems, Incorporated.  All rights reserved.

//
// Straighten.jsx - Straighten and crop a photo, based on the ruler position.
// Added prototype Layer transform via shift modifier-steveg, 2011
//
// John Peterson, Adobe Systems, 2009
//

/*
@@@BUILDINFO@@@ Straighten.jsx 3.0.0.4
*/

/*
// BEGIN__HARVEST_EXCEPTION_ZSTRING

<javascriptresource>
<name>$$$/JavaScripts/Straighten/Menu=Straighten to Ruler</name>
<menu>automate</menu>
</javascriptresource>

// END__HARVEST_EXCEPTION_ZSTRING
*/

// on localized builds we pull the $$$/Strings from a .dat file
$.localize = true;

var g_StackScriptFolderPath = app.path + "/"+ localize("$$$/ScriptingSupport/InstalledScripts=Presets/Scripts") + "/"
										+ localize("$$$/private/Exposuremerge/StackScriptOnly=Stack Scripts Only/");


$.evalFile( g_StackScriptFolderPath + "Geometry.jsx");

$.evalFile(g_StackScriptFolderPath + "Terminology.jsx");

// Create a base object to scope the rest of the functions in the file
function Straightener()
{
	this.pluginName = "Straighten";
}

straighten = new Straightener();

straighten.getUnitPoint = function( desc )
{
	var x = desc.getUnitDoubleValue( kxStr );
	var y = desc.getUnitDoubleValue( kyStr );
	return new TPoint( x, y );
}

// Special version of crop supporting the hidePixels option (DOM FIX)
straighten.hideCrop = function( cropRect, hidePixels )
{
	if (typeof hidePixels == "undefined")
		hidePixels = true;
		
	// Hiding  pixels does not work on simple documents
	if ((app.activeDocument.layers.length == 1)
		&& (app.activeDocument.activeLayer.isBackgroundLayer))
		hidePixels = false;
		
    var desc = new ActionDescriptor();
	var cropDesc = new ActionDescriptor();
	cropDesc.putUnitDouble( enumTop, unitPixels, cropRect.fTop );
	cropDesc.putUnitDouble( enumLeft, unitPixels, cropRect.fLeft );
	cropDesc.putUnitDouble( keyBottom, unitPixels, cropRect.fBottom );
	cropDesc.putUnitDouble( enumRight, unitPixels, cropRect.fRight );
    desc.putObject( keyTo, classRectangle, cropDesc );
    desc.putUnitDouble( enumAngle, unitAngle, 0.0 );
	if  (hidePixels)
		desc.putBoolean( eventHide, true );
	executeAction( eventCrop, desc, DialogModes.NO );
}

// Remove the ruler and update the display (DOM FIX)
straighten.clearRuler = function()
{
	desc = new ActionDescriptor();
	var eventClearRuler = app.stringIDToTypeID("clearRuler");
	executeAction( eventClearRuler, desc, DialogModes.NO );
}

// Get the endpoints from the ruler (DOM FIX)
straighten.getRulerEndpoints = function()
{
	var desc1 = new ActionDescriptor();
	var ref1 = new ActionReference();
	ref1.putProperty( classProperty, krulerPointsStr );
	ref1.putEnumerated( classDocument, typeOrdinal, enumTarget );
	desc1.putReference( typeNULL, ref1 );

	var result = executeAction( eventGet, desc1, DialogModes.NO );

	if  (result.hasKey( kpointsStr ))
	{
		var i, ptList = result.getList( kpointsStr );
		// The middle item in the list is an unused "midpoint" (currently == p0)
		var p0 = this.getUnitPoint( ptList.getObjectValue(0) );
		var p1 =  this.getUnitPoint( ptList.getObjectValue(2) );
		if (p0.fX < p1.fX)
			return [p0, p1];
		else
			return [p1, p0];
	}
	else
		return [];
}

// Given two ruler endpoints, compute the rotation (in radians)
// needed to make the ruler horizontal or vertical.
straighten.getRotationAngle = function( p0, p1 )
{
	// Perfectly horizontal or vertical - no rotation
	if ((p0.fX == p1.fX) || (p0.fY == p1.fY))
		return 0.0;
		
	var a, t, v = p1 - p0;
	if (Math.abs(v.fY) > Math.abs(v.fX))
	{
		// If the line is mostly vertical, adjust the angle to
		// straighten to the vertical axis.
		t = v.fX;
		v.fX = v.fY;
		v.fY = t;
		if (v.fX < 0) 
		{
			v.fX = - v.fX;
			a = v.vectorAngle();
		}
		else
			a = -v.vectorAngle();
	}
	else 
		a = v.vectorAngle();
		
	return -a;
}

// Given an angle and a rectangle, compute the rotated
// rectangle and a new bounding rectangle for it.
straighten.computeRotation = function( angle, rect )
{
	// Rotate rect about the origin, and find the bounds of the rotated rectangle.
	rect.setCenter( TPoint.kOrigin );
	var i;
    this.fRotatedPoints = rect.getCornerPoints();
	
	this.fRotatedBounds = new TRect(0,0,0,0);
	for (i in this.fRotatedPoints)
	{
		this.fRotatedPoints[i] = this.fRotatedPoints[i].rotate(angle);
		this.fRotatedBounds.extendTo( this.fRotatedPoints[i] );
	}

	// Move the origin back to top left corner of the enclosing rect,
	// the new center is based on that.
	this.fRotatedBounds.offset( -this.fRotatedBounds.getTopLeft() );
	this.fNewCenter = this.fRotatedBounds.getCenter();

	for (i in this.fRotatedPoints)
		this.fRotatedPoints[i] += this.fNewCenter;	
}

// Given an rectange and a rotation angle, find a new rectangle with the
// same proportions that fits inside the original.
straighten.getCropRect = function( angle, rect )
{
    this.computeRotation( angle, rect );
 
	rect.setCenter( this.fNewCenter );

	var cropPts = [];
	
	// So sign test works below
	if (angle < -Math.PI)
		angle += 2*Math.PI;
		
	var off1 = (angle > 0) ? 3 : 0;
	var off2 = (angle > 0) ? 0 : 1;
	
	// Draw lines from the center through the corners of the original rect.
	// Record where those lines intersect the rotated rect.
	var ii, rectPoints = [rect.getTopLeft(), rect.getTopRight(), rect.getBottomRight(), rect.getBottomLeft()];
	for (ii in rectPoints)
	{
		i = Number(ii);	// Whacky Javascript uses strings, not numbers, for index
		cropPts[i] = TPoint.lineSegmentIntersect( this.fRotatedPoints[(i + off1) % 4], 
                                                                       this.fRotatedPoints[(i + off2) % 4], 
                                                                       this.fNewCenter, rectPoints[i] );
	}
			
	// The new crop is based on the minimum bounds of the intersections found above.
	var cropRect = new TRect( Math.max(cropPts[0].fX, cropPts[3].fX), Math.max(cropPts[0].fY, cropPts[1].fY), 
	                          Math.min(cropPts[1].fX, cropPts[2].fX), Math.min(cropPts[2].fY, cropPts[3].fY) );
	return cropRect;
}

straighten.getRulerAngle = function()
{
	var rulerPts = this.getRulerEndpoints();
	if (rulerPts.length == 0)
		return 0.0;
		
	return this.getRotationAngle( rulerPts[0], rulerPts[1] );
}

// Straighten the layer to the ruler with transform.  Returns the rotation angle,
// or zero if there was no rotation (or no ruler).
straighten.rotateLayerToRuler = function()
{
	var angle = this.getRulerAngle();

    if (angle == 0.0)
        return;

	layerRef = app.activeDocument.activeLayer;
	layerRef.rotate( angle * 180.0 / Math.PI );
	return angle;
}
// Straighten the image to the ruler.  Returns the rotation angle,
// or zero if there was no rotation (or no ruler).
straighten.rotateCanvasToRuler = function()
{
	var angle = this.getRulerAngle();
	app.activeDocument.rotateCanvas( angle * 180.0 / Math.PI );
	return angle;
}

// Crop the image to the bounds, rotated by angle (in radians)
straighten.cropRotatedImage = function( angle, bounds )
{
	var newBounds = this.getCropRect( angle, bounds );
	
	// Ideally we'd report an error here, but since it's past RC, we'll just silently fail.
	if (newBounds.isValid())
		this.hideCrop( newBounds, true );
//	app.activeDocument.crop( [UnitValue(newBounds.fLeft, 'px'), UnitValue(newBounds.fTop, 'px'), 
//							UnitValue(newBounds.fRight, 'px'), UnitValue(newBounds.fBottom, 'px')] );
}

// Original functionality, now not used.
straighten.rotateAndCropCanvas = function ()
{
    var angle, bounds = new TRect( 0, 0, app.activeDocument.width.as('px'), app.activeDocument.height.as('px') );
    angle = straighten.rotateCanvasToRuler();
    straighten.cropRotatedImage( angle, bounds );
}

// Main interactive entry.
straighten.doInteractive = function()
{
    var angle, bounds = new TRect( 0, 0, app.activeDocument.width.as('px'), app.activeDocument.height.as('px') );
    if (app.activeDocument.activeLayer.isBackgroundLayer == true)
        app.activeDocument.activeLayer.isBackgroundLayer = false;
        
    angle = straighten.rotateLayerToRuler() 
 
 // alert(localize("$$$/Straighten/Script/NoBGLayer=Operation cannot be performed on background layer"));
 
	if (angle != 0.0)
		straighten.clearRuler();
}

// Set runstraightenFromScript if you want to load this script w/o running it.
if ((typeof(runstraightenFromScript) == 'undefined')
	|| (runstraightenFromScript==false))
	straighten.doInteractive();
