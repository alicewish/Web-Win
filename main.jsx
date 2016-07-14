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
/*globals $, app, ToolTipOptions*/

$._ext_AEFT = {
    setThumbnailExportOptions: function () {
        // This appears to be Illustrator specific PHXS does not have this function
    },
    getTooltipState: function () {
        return app.areToolTipsEnabled;
    },
    getIMSUserID: function () {
        return app.ccUserGuid;
    },
    isAnalyticsEnabled: function () {
        return app.isAnalyticsEnabled;
    },
    getCurrentState: function () {
    },
    placeAsset: function (pathStr, is_psdB, elemName) {
        app.project.placeAsset(pathStr, is_psdB, elemName);
    },
    setColor: function (colorRec) {
        // to be implemented later
        return false;
    },
    isFontAvailable: function () {
        /*
        style
        if (style.adbeFont) {
            try {
                if (app.textFonts.getByName(style.adbeFont.postScriptName)) {
                    return true;
                }
            } catch (e) {
                return false;
            }
        } else if (style.fontFamily) {
            //If all we have is the font-family then try to use that
            var i, font, found = false;
            for (i = 0; i < app.textFonts.length; i++) {
                font = app.textFonts[i];
                if (font.family === style.fontFamily) {
                    found = true;
                    break;
                }
            }

            return found;
        }
        */
        return 'true';
    }
};