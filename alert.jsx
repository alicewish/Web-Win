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

/*global alert */
var message = "%1$s",
    usedWinOnlyTitle = "%2$s" || " ",
    usedWinOnlyUseErrorIcon = !!(%3$s);
if (usedWinOnlyTitle === "undefined") {
    usedWinOnlyTitle = " ";
}
alert(message, usedWinOnlyTitle, usedWinOnlyUseErrorIcon);
