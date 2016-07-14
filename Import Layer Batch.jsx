// Open from the samples folder
var myPsdFile = open(File(app.path + "/Samples/Gotham Academy 005-001.psd")) 
var myJpgFile = open(File(app.path + "/Samples/Gotham Academy 005-001.jpg"))

   JpgFile= app.activeDocument; //prepare your image layer as active document
   JpgFile.selection.selectAll();
   JpgFile.selection.copy(); //copy image into clipboard
   JpgFile.close(SaveOptions.DONOTSAVECHANGES); //close image without saving changes
   
	PsdFile= app.activeDocument; //prepare your image layer as active document
	PsdFile.selection.selectAll();
	PsdFile.paste();