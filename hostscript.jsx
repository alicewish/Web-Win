/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, app, CSXSEvent, ExternalObject */

/* Import CSXS Events to pass events from jsx to panel

    === host jsx code: 
    
    var eventObj = new CSXSEvent();
        
    // event name (panel is listening for this event)
    eventObj.type = "somename";
    
    // NOTE: You'll have to make this JSON youself as there is no JSON object in jsx
    eventObj.data = "{ data: " + data.toString() + "}";  
    
    // Send event to panel
    eventObj.dispatch();
    
    === panel js code:
    
    csInterface.addEventListener("somename", function (evt) {
        var data =  JSON.parse(evt.data.toString());
        ... // do something interesting with data    
    });    

*/

/* Add additional script entry points here */