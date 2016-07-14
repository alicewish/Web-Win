
var UTIL = {};
UTIL.getArtboardPosition = function getArtboardPosition(artBoardRect, position, difference) {
    'use strict';
    return [artBoardRect[0] + position[0] - difference.left, artBoardRect[1] + difference.top - position[1]];
};

UTIL.getRealPosition = function getRealPosition(artBoardRect, position) {
    'use strict';
    var realPosition = {};
    realPosition.left = position[0] - artBoardRect[0];
    realPosition.top = artBoardRect[1] - position[1];
    return realPosition;
};