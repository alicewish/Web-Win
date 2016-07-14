/*----------------------------------------------------------------------- 
	ADOBE SYSTEMS INCORPORATED
	Copyright 2007 - Adobe Systems Incorporated
	All Rights Reserved
 
	If this file is provided by Adobe in modifiable form (e.g., source 
	code or JavaScript), then you may modify this file.  
	You may use and distribute this file, in modified or unmodified form, 
	provided that you must reproduce the above acknowledgement and this 
	notice with all copies of the file.
 
	THIS SOFTWARE IS PROVIDED BY ADOBE SYSTEMS INCORPORATED 'AS IS' AND 
	ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, 
	THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A 
	PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL ADOBE BE 
	LIABLE TO YOU FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
	EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
	PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, 
	OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY 
	THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT 
	(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE 
	USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF 
	SUCH DAMAGE.
-----------------------------------------------------------------------*/

/* 
@@@BUILDINFO@@@ "LiveTrace_AI.jsx" 2.0 225 25-Jan-2007
*/

/*
@@@START_XML@@@
<?xml version="1.0" encoding="UTF-8"?>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="en_US">
     <dc:title>Image Trace CC</dc:title>
     <dc:description>Automates the tracing of image files using Illustrator's Image Trace feature.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="de_DE">
     <dc:title>Interaktiv abpausen CC</dc:title>
     <dc:description>Automatisiert das Abpausen von Bilddateien mit der Illustrator-Funktion 'Interaktiv abpausen'.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="fr_FR">
     <dc:title>Vectorisation dynamique CC</dc:title>
     <dc:description>Automatise la vectorisation des fichiers images à l'aide de la fonction de vectorisation dynamique d'Illustrator.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="ja_JP">
     <dc:title>Image Trace CC</dc:title>
     <dc:description>Illustrator のライブトレース機能を使用して画像ファイルのトレースを自動化します。</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="da_DK">
     <dc:title>Dynamisk vektorisering CC</dc:title>
     <dc:description>Automatiserer vektorisering af billedfiler ved hjælp af funktionen Dynamisk vektorisering i Illustrator.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="es_ES">
     <dc:title>Calco interactivo CC</dc:title>
     <dc:description>Automatiza el calco de archivos de imágenes con la función Calco interactivo de Illustrator.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="it_IT">
     <dc:title>Ricalco dinamico CC</dc:title>
     <dc:description>Consente il ricalco automatico di file di immagini mediante la funzione Ricalco dinamico di Illustrator.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="nl_NL">
     <dc:title>Actief overtrekken CC</dc:title>
     <dc:description>Automatisch afbeeldingsbestanden overtrekken met de functie Actief overtrekken van Illustrator.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="sv_SE">
     <dc:title>Direktkalkering CC</dc:title>
     <dc:description>Automatiserar kalkeringen av bilder genom att använda direktkalkeringsfunktionen som finns i Illustrator.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="ko_KR">
     <dc:title>라이브 추적 CC</dc:title>
     <dc:description>Illustrator의 라이브 추적 기능을 사용하여 이미지 파일 추적을 자동화합니다.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="zh_CN">
     <dc:title>Image Trace CC</dc:title>
     <dc:description>使用 Illustrator 的“实时描摹”功能来实现图像文件描摹的自动化。</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="zh_TW">
     <dc:title>即時描圖 CC</dc:title>
     <dc:description>使用 Illustrator 的「即時描圖」功能在影像檔案中進行自動描圖。</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="cs_CZ">
     <dc:title>Živá vektorizace CC</dc:title>
     <dc:description>Automatizuje vektorizaci obrazových souborů s použitím funkce Živá vektorizace Illustratoru.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="el_GR">
     <dc:title>Image Trace CC</dc:title>
     <dc:description>Αυτοματοποιεί τον εντοπισμό αρχείων εικόνας, χρησιμοποιώντας τη λειτουργία Live Trace του Illustrator.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="tr_TR">
     <dc:title>Canlı Kontur CC</dc:title>
     <dc:description>Illustrator'ın Canlı Kontur özelliğini kullanarak görüntü dosyalarının izlenmesini otomatikleştirir.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="hu_HU">
     <dc:title>Élő kontúr CC</dc:title>
     <dc:description>Automatizálja a képfájloknak az Illustrator Élő kontúr szolgáltatásával való kontúrozását.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="ro_RO">
     <dc:title>Vectorizare dinamică CC</dc:title>
     <dc:description>Automatizează urmărirea fişierelor de imagine utilizând caracteristica Vectorizare dinamică din Illustrator</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="uk_UA">
     <dc:title>Image Trace CC</dc:title>
     <dc:description>Автоматизує трасування файлів зображення за допомогою можливості Live Trace програми Illustrator.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="pl_PL">
     <dc:title>Aktywny obrys CC</dc:title>
     <dc:description>Automatyzuje obrys obrazów przy pomocy funkcji programu Illustrator: Aktywny obrys.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="ru_RU">
     <dc:title>Быстрая трассировка CC</dc:title>
     <dc:description>Автоматизирует трассировку изображений с помощью средства Illustrator "Быстрая трассировка".</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="ar_AE">
     <dc:title>Image Trace CC</dc:title>
     <dc:description>يقوم بتتبع ملفات الصور باستخدام خاصية التتبع المباشر في Illustrator.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="he_IL">
     <dc:title>Image Trace CC</dc:title>
     <dc:description>אוטומציית עקיבה של קובצי תמונה בעזרת תכונת 'עקיבה חיה' של Illustrator.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="pt_BR">
     <dc:title>Image Trace CC</dc:title>
     <dc:description>Automatiza o traço dos arquivos de imagem usando o recurso Image Trace do Illustrator.</dc:description>
</ScriptInfo>
@@@END_XML@@@
*/

/** Allows the user to select a number of raster image files and create 
	an Illustrator file containing a traced version of each image using 
	Illustrator's Image Trace feature. 
	
	Use: 
		Select a set of images in Bridge
		Select menu item Tools>Illustrator>Image Trace... 
		Select the Image Trace preset to use.
		Images can be combined into a single document or output as separate 
		documents.
		If the images are going to be saved, you must select the destination 
		folder for the operation.
		The generated documents can be saved using a specified filename format, 
		or left open as unsaved documents in Illustrator.
*/

illustratorTargetName = "illustrator-19"

if (BridgeTalk.appName == "bridge" )	 {	

	// ===========================================================
	// FILE COLLECTOR
	// ===========================================================
	
	/**	Searches thumbnails in Bridge for those that match 
		the extensions or file types given by
		LT_FileCollector.COLLECTABLE_EXTENSIONS and
		LT_FileCollector.COLLECTABLE_FILETYPES

		The search is implemented as a scheduled task in Bridge
		so that the user can cancel the request when a large
		set of thumbnails are being searched.
	*/
	LT_FileCollector = {};
	
	// Change this value to increase the maximum number of files that can be collected.
	LT_FileCollector.MAX_BATCH_SIZE = 50000;	
		
	// Change this constant to increase the number of thumbnails scanned each time
	// the LT_FileCollector.search task runs.
	LT_FileCollector.SEARCH_LIMIT_PER_TASK = 250;
	
	// Collectable files
	LT_FileCollector.COLLECTABLE_EXTENSIONS = ["bmp", "gif", "giff", "jpeg", "jpg", "pct", "pic", "psd", "png", "tif", "tiff"];
	LT_FileCollector.COLLECTABLE_FILETYPES = ["BMP ", "GIFf", "JPEG", "PICT", "8BIM", "8BPS", "PNGf", "TIFF"]; 
			
	/** Starts file collection.
		@param callbackOnStop function to be called when search completes
	*/
	LT_FileCollector.start = function(callbackOnStop) {
		LT_FileCollector.fileStore = new File(Folder.temp + "/LiveTrace_AI_Files.txt");
		LT_FileCollector.fileStore.encoding = "UTF-8";
		LT_FileCollector.fileStore.open("w");
		LT_FileCollector.fileStoreCount = 0;
		
		LT_FileCollector.callbackOnStop = callbackOnStop;		
		LT_FileCollector.searchCount = 0;
		LT_FileCollector.hasSkipped = false;		
		LT_FileCollector.searchThumbnails = new Array();
		LT_FileCollector.fcthi = 0;		
		LT_FileCollector.searchSelectedFolders = false;
		LT_FileCollector.folderThumbnails = new Array();
		LT_FileCollector.cancelled = false;
		LT_FileCollector.taskPalette = null;
		// Search the thumbnails selected by the user, or, the visible thumbnails in the content pane
		if (app.document != undefined) {
			if (app.document.selectionLength > 0) {
				LT_FileCollector.searchThumbnails = app.document.selections;
				LT_FileCollector.searchSelectedFolders = true;
			}				
			else  {
				var myVisibleThumbnails = app.document.visibleThumbnails;
				if (myVisibleThumbnails != undefined) {
					LT_FileCollector.searchThumbnails = myVisibleThumbnails;
				}
			}
		}
		if (LT_FileCollector.searchThumbnails.length > 0) {
			// Kick off search for collectable files.
			LT_FileCollector.search();
		}
		else {
			// Nothing to do - so stop.
			LT_FileCollector.stop();
		}
	}
	
	/** Stops file collection.
	*/
	LT_FileCollector.stop = function()
	{
		// Close the file containing the URIs of the collected files
		LT_FileCollector.fileStore.close();
		// Clear out searchThumbnails so it can be garbage collected
		LT_FileCollector.searchThumbnails = new Array();
  		if (!LT_FileCollector.cancelled) {
  			// Pass the collected files back to the client.
			LT_FileCollector.callbackOnStop();
		}
		// Re-enable Image Trace menu.
		LiveTrace_AI.menu.enabled = true;
		if (LT_FileCollector.taskPalette != null) {
			// Close the task palette.
    		LT_FileCollector.closeTaskPalette();
    	}	
	}
	
	/** Returns true if the thumbnail should be collected, false otherwise.
	*/
	LT_FileCollector.isCollectable = function(thumbnail) {
		var result = false;
		result = illustrator.matchesFileExtensions(thumbnail, LT_FileCollector.COLLECTABLE_EXTENSIONS);
		if (!result && thumbnail.type == "file") {
			var file = thumbnail.spec;
			if ( file.fs == "Macintosh" ) {
				result = illustrator.matchesMacFileType(file.type, LT_FileCollector.COLLECTABLE_FILETYPES); 
			}
		}
		return result;
	}	

	/** Searches LT_FileCollector.searchThumbnails for thumbnails
		that are collectable and adds them to LT_FileCollector.matchingThumbnails.
		A maximum of LT_FileCollector.SEARCH_LIMIT_PER_TASK thumbnails are
		examined per call to this function which is designed to be run
		as a scheduled task.
	*/
	LT_FileCollector.search = function() {
		// Turn on synchronous mode if it's not already on.
		var resetSynchronousMode = false;
		if (!app.synchronousMode) {
			app.synchronousMode = true;
			resetSynchronousMode = true;
		}
		var matchingThumbnails = new Array();
		for (i = 0; i < LT_FileCollector.SEARCH_LIMIT_PER_TASK; i++)
  	 	{
  	 		if (LT_FileCollector.cancelled) {
  	 			// The user cancelled file collection.
  	 			break;	
   	 		} else if (LT_FileCollector.fcthi >= LT_FileCollector.searchThumbnails.length) {
   	 			// All thumbnails scanned - any folders to search?
   	 			if (LT_FileCollector.folderThumbnails.length > 0) {
   	 				// Yes - set up search of these folders.
   	 				LT_FileCollector.searchThumbnails = new Array();
					for (var i = 0; i < LT_FileCollector.folderThumbnails.length; i++ ) {
						var folderThumbnail = LT_FileCollector.folderThumbnails[i];
						var kids = folderThumbnail.children;
						for (var j = 0; j < kids.length; j++) {
							LT_FileCollector.searchThumbnails.push(kids[j]);
						}
   	 				}
					LT_FileCollector.fcthi = 0;   	 				
   	 				LT_FileCollector.folderThumbnails = new Array();
   	 				// Workaround for bug 1467862 - do not search sub-folders for traceable files.
   	 				LT_FileCollector.searchSelectedFolders = false;
   	 			} else {
   	 				// No more thumbnails to search.
  	 				break;
  	 			}
  	 		} else if (LT_FileCollector.fileStoreCount + matchingThumbnails.length >= LT_FileCollector.MAX_BATCH_SIZE) {
  	 			// Hit the limit on the number of files to be collected.
  	 			break;
  	 		}
  	 		
  	 		// Process thumbnail.
  	 		LT_FileCollector.searchCount++;
 			var thumbnail = LT_FileCollector.searchThumbnails [LT_FileCollector.fcthi];
 			if (thumbnail && !thumbnail.hidden) {
 				app.document.status = LT_FileCollector.searchCount + " " + thumbnail.path;
				if (thumbnail.type == "file") {
					if (LT_FileCollector.isCollectable( thumbnail )) {
						matchingThumbnails.push( thumbnail );
					} else {
						LT_FileCollector.hasSkipped = true;
					}
				} else if (thumbnail.type == "folder" && LT_FileCollector.searchSelectedFolders) {
					// Look in this folder once LT_FileCollector.searchThumbnails has been scanned.
					LT_FileCollector.folderThumbnails.push(thumbnail);
				}
			}
			
			// Next thumbnail in LT_FileCollector.searchThumbnails
			LT_FileCollector.fcthi++;

		} // end for
		
		// Save off the paths to collected thumbnails
	  	if (!LT_FileCollector.cancelled) {
 			LT_FileCollector.thumbnailsToFileStore(matchingThumbnails);	
 		}
		
   	 	if (LT_FileCollector.cancelled ||
   	 		LT_FileCollector.fcthi >= LT_FileCollector.searchThumbnails.length ||
   	 		LT_FileCollector.fileStoreCount + matchingThumbnails.length >= LT_FileCollector.MAX_BATCH_SIZE) {
   	 		// Search for files is either cancelled or complete so stop.
			LT_FileCollector.stop();
  	 	}
  	 	else {
 			// Disable the Image Trace menu to prevent user requesting another 
 			// Image Trace while collecting files.
			LiveTrace_AI.menu.enabled = false;
			// Open a palette to allow the user to cancel the collection of files.
  	 		if (LT_FileCollector.taskPalette == null) {	
				LT_FileCollector.openTaskPalette();
			}
  	 		// Schedule a task to call this function back to collect more files.
			app.scheduleTask("LT_FileCollector.search()", 100, false);
  		}
 		// Reset synchronous mode if we set it.
 		if (resetSynchronousMode) {
			app.synchronousMode = false;
		}
	}

	/** Preflights thumbnails from remote repositories and saves off the path to each file.
	*/
	LT_FileCollector.thumbnailsToFileStore = function ( thumbnails ) {
		// Force files from remote repositories to download if the repositories are online.
		app.acquirePhysicalFiles(thumbnails);
		for (var i = 0; i < thumbnails.length; i++ ) {
			var thumbnail = thumbnails[i];
			if ( thumbnail != undefined && thumbnail.exists && thumbnail.spec != undefined ) {
				// File encoding is set to UTF-8 so the URI will be encoded on write
				LT_FileCollector.fileStore.writeln(thumbnail.spec.absoluteURI);
				LT_FileCollector.fileStoreCount++;
			}
		}
	}
	
	/** Pops a palette that allows the file collection task to be cancelled.
	*/
	LT_FileCollector.openTaskPalette = function() {
		LT_FileCollector.taskPalette = new Window("palette", localize("$$$/LiveTrace_AI/TaskDialogTitle=Image Trace Task")); 
		LT_FileCollector.taskPalette.orientation = "row";
		LT_FileCollector.taskPalette.alignChildren = 'top';	
		LT_FileCollector.taskPalette.add("statictext", undefined, 
			localize("$$$/LiveTrace_AI/CollectingFiles=Collecting files"));
		LT_FileCollector.taskPalette.cancelButton = LT_FileCollector.taskPalette.add("button", 
			undefined, 
			localize("$$$/LiveTrace_AI/Cancel=Cancel"));
		LT_FileCollector.taskPalette.cancelButton.onClick = function () {
			LT_FileCollector.cancelled = true;
			LT_FileCollector.stop();
		};
		LT_FileCollector.taskPalette.show();
	}
	
	/** Closes the file collection task palette.
	*/
	LT_FileCollector.closeTaskPalette = function () {
		LT_FileCollector.taskPalette.close();
		//LT_FileCollector.taskPalette = null;			
	}

	// ===========================================================
	// Image TRACE DIALOG
	// ===========================================================
		
	/** Handles Image Trace's ScriptUI dialog.
	*/
	LT_Dialog = {};
	
	// Min and max Illustrator document size measure in points.
	LT_Dialog.MIN_DOC_MEASURE = 1;
	LT_Dialog.MAX_DOC_MEASURE = 16383;

	// Maximum number of files for which the save and close results control is enabled.
	// The user can trace more files that this but the traced files can't be left open
	// in Illustrator.
	LT_Dialog.MAX_FILE_COUNT_FOR_ENABLED_SAVE_AND_CLOSE = 50;
		
	// Maximum number of files to display in the source list box control.
	LT_Dialog.MAX_FILE_COUNT_IN_SOURCE_LISTBOX = 500;
	
	/** Initialises the Image Trace dialog.
	*/
	LT_Dialog.init = function() {
		// Get DOM data from Illustrator to display in dialog.
		LT_Dialog.getAiDOMData();
	}
	
	/** Gathers input data from Illustrator scripting DOM 
		needed to populate the Image Trace dialog options.
	*/
	LT_Dialog.getAiDOMData = function() {
		LT_Dialog.aiDOMData = {};
		
		// Set up script commands to gather DOM data from Illustrator.
		var scpt = 
			'function AiAutomationLiveTrace_GetDOMData() {\n' +
			'var aiDOMData = new  Object();\n' +
			'aiDOMData.tracingPresetsList = new Array();\n' +
			'aiDOMData.documentPresets = new Array();\n' + 
			'try {\n' +
				'aiDOMData.tracingPresetsList = app.tracingPresetsList;\n' +
				'for (var i = 0; i <  app.startupPresetsList.length; i++) {\n' +
					'var documentPreset = app.getPresetSettings(app.startupPresetsList[i]);\n' +
					'var aiPreset = new Object();\n' +
					'aiPreset.name = app.startupPresetsList[i];\n' +
					'aiPreset.width = documentPreset.width;\n' +
					'aiPreset.height = documentPreset.height;\n' +
					'aiPreset.units = documentPreset.units.toString();\n' +
					'aiDOMData.documentPresets.push(aiPreset);\n' +
				'}\n' +
			'} catch (e) { \n' +
			'// likely no document preset files\n' +
			'} finally {\n' +
				'return aiDOMData;\n' +
			'}\n' +
			'}\n' +
			'AiAutomationLiveTrace_GetDOMData().toSource();\n';		
		
		// Run the script to gather the DOM data
		LiveTrace_AI.sendBridgeTalkMessage(
			illustratorTargetName,
			scpt,
			function (msg) {
				// Called back when the above script completes.
				// Save off the DOM data returned from Illustrator by the script
				BridgeTalk.bringToFront('bridge');
				eval("var aiDOMData = "+msg.body);
				aiDOMData.hasDocumentPresets = aiDOMData.documentPresets.length > 0;
				if (!aiDOMData.hasDocumentPresets ) {
					// No document presets available - spoof a 
					// Basic CMYK and Basic RGB for the dialog.
					// When we are tracing files we'll create documents 
					// using documents.add rather than documents.addDocument
					var cmykPreset = new Object();
					cmykPreset.name = localize("$$$/LiveTrace_AI/DocumentPresetTypeBasicCMYK=Basic CMYK");
					cmykPreset.width = 612;
					cmykPreset.height = 792;
					cmykPreset.units = "RulerUnits.Points";
					aiDOMData.documentPresets.push(cmykPreset);
					var rgbPreset = new Object();
					rgbPreset.name = localize("$$$/LiveTrace_AI/DocumentPresetTypeBasicRGB=Basic RGB");
					rgbPreset.width = 800;
					rgbPreset.height = 600;
					rgbPreset.units = "RulerUnits.Points";	
					aiDOMData.documentPresets.push(rgbPreset);		
				}
				LT_Dialog.aiDOMData = aiDOMData;
				
				// Open the Image Trace dialog
				LT_Dialog.open();
			},
			function(btObj) {
				// Called back on error.
				LiveTrace_AI.defaultBridgeTalkErrorHandler(btObj);
				LiveTrace_AI.menu.enabled = true;
			}
		); 	// End run the script to gather the DOM data
		
	}
		
	/** Creates the Image Trace dialog windows, 
		adds its controls and shows the dialog.
	*/
	LT_Dialog.open = function()  {
		// make a display object to hold all the input references
		LT_Dialog.controls = {};	

		LT_Dialog.win = new Window("dialog", localize("$$$/LiveTrace_AI/DialogTitle=Image Trace"));
		LT_Dialog.win.orientation = "row";
		LT_Dialog.win.alignChildren = 'top';

		//
		// FIRST COLUMN -----------------------------------------------------------
		//

		LT_Dialog.win.mainCol = LT_Dialog.win.add( "group" );
		LT_Dialog.win.mainCol.orientation = 'column';
		LT_Dialog.win.mainCol.alignChildren = 'left';

		// Tracing preset dropdownlist
		var preset = LT_Dialog.win.mainCol.add( "group" );
		preset.add( "statictext", undefined, localize("$$$/LiveTrace_AI/Preset=Tracing Preset:")  );
		preset.presetDD = preset.add( "dropdownlist" );
		for (var i=0; i<LT_Dialog.aiDOMData.tracingPresetsList.length; i++) {
			preset.presetDD.add('item', LT_Dialog.aiDOMData.tracingPresetsList[i]);
		}
		preset.presetDD.selection = preset.presetDD.items[0];
		LT_Dialog.controls.presetDD = preset.presetDD;

		// Vectorize to layers in single document checkbox
		LT_Dialog.win.mainCol.layersCb = LT_Dialog.win.mainCol.add( "checkbox", undefined, localize("$$$/LiveTrace_AI/VectorizeToLayersInSingleDocument=Vectorize To Layers In Single Document") );
		LT_Dialog.controls.layersCb = LT_Dialog.win.mainCol.layersCb;
		LT_Dialog.win.mainCol.layersCb.onClick = function() {
			LT_Dialog.win.mainCol.closeCb.enabled = !this.value;
			// if we are going to a single doc, disable save and close and naming
			if (this.value) {
				LT_Dialog.win.destinationPnl.enabled = false;
			} else {
				LT_Dialog.win.destinationPnl.enabled = LT_Dialog.win.mainCol.closeCb.value;
			}
		}
		
		// Save and Close Results checkbox
		LT_Dialog.win.mainCol.closeCb = LT_Dialog.win.mainCol.add( "checkbox", undefined, localize("$$$/LiveTrace_AI/SaveAndClose=Save and Close Results") );
		LT_Dialog.win.mainCol.closeCb.value = true;
		LT_Dialog.controls.closeCb = LT_Dialog.win.mainCol.closeCb;
		LT_Dialog.win.mainCol.closeCb.onClick = function() {
			LT_Dialog.win.destinationPnl.enabled = this.value;
		}
		if (LT_FileCollector.fileStoreCount > LT_Dialog.MAX_FILE_COUNT_FOR_ENABLED_SAVE_AND_CLOSE) {
			// If there many files to be traced then leaving documents open
			// in Illustrator is not allowed since machine performance
			// would degrade. Disable the control.
			LT_Dialog.controls.closeCb.enabled = false;
		}

		// Document profile panel
		LT_Dialog.win.docProfilePnl = LT_Dialog.win.mainCol.add( "panel", undefined, localize("$$$/LiveTrace_AI/DocumentProfile=Document Profile:") );
		LT_Dialog.win.docProfilePnl.orientation = "column";		
		LT_Dialog.win.docProfilePnl.alignChildren = "right";
		LT_Dialog.win.docProfilePnl.alignment = "fill";
				
		// Document profiles dropdownlist
		var docProfile = LT_Dialog.win.docProfilePnl.add( "group" );
		docProfile.controlDD = docProfile.add( "dropdownlist" );
		docProfile.controlDD.preferredSize = [212, 20];
		for (var i=0; i<LT_Dialog.aiDOMData.documentPresets.length; i++) {
			docProfile.controlDD.add('item', LT_Dialog.aiDOMData.documentPresets[i].name);
		}
		// Select first document profile.
		docProfile.controlDD.selection = docProfile.controlDD.items[0];
		// Initialise the other controls that depend on document profile data.
		var myDocProfile = LT_Dialog.aiDOMData.documentPresets[0];
		LT_Dialog.controls.docProfileDD = docProfile.controlDD;
		LT_Dialog.controls.docProfileDD.onChange = function() {
			var myProfile = LT_Dialog.aiDOMData.documentPresets[this.selection.index];
			var myUnitAbbrev = LT_Dialog.convertRulerUnitsToUnitAbbrev(myProfile.units);
			var myDocWidthUV = new UnitValue(myProfile.width, "pt");
			var myDocHeightUV = new UnitValue(myProfile.height, "pt");
			if (myUnitAbbrev != "pt") {
				myDocWidthUV.convert(myUnitAbbrev);
				myDocHeightUV.convert(myUnitAbbrev);
			}
			LT_Dialog.controls.docWidthET.text = LT_Dialog.unitValueToDisplay(myDocWidthUV);
			LT_Dialog.controls.docWidthET.lt_lastGoodUV = myDocWidthUV;
			LT_Dialog.controls.docHeightET.text = LT_Dialog.unitValueToDisplay(myDocHeightUV);
			LT_Dialog.controls.docHeightET.lt_lastGoodUV = myDocHeightUV;
			LT_Dialog.controls.docUnitsDD.selection = LT_Dialog.convertRulerUnitsToUnitsDDIndex(myProfile.units);
		}
		
		// Units to be used to display measures
		var myUnitAbbrev = LT_Dialog.convertRulerUnitsToUnitAbbrev(myDocProfile.units);
		
		// Width control
		var myDocWidthUV = new UnitValue(myDocProfile.width, "pt");
		if (myUnitAbbrev != "pt") {
			myDocWidthUV.convert(myUnitAbbrev);
		}
		var docWidth = LT_Dialog.win.docProfilePnl.add( "group" );
		docWidth.add( "statictext", undefined, localize("$$$/LiveTrace_AI/DocumentWidth=Width:")  ); 
		docWidth.controlET = docWidth.add( "edittext", 
			undefined, 
			LT_Dialog.unitValueToDisplay(myDocWidthUV)); 
		docWidth.controlET.preferredSize = [75, 20];
		LT_Dialog.controls.docWidthET = docWidth.controlET;
		LT_Dialog.controls.docWidthET.lt_lastGoodUV = myDocWidthUV;
		LT_Dialog.controls.docWidthET.lt_minValue = LT_Dialog.MIN_DOC_MEASURE;
		LT_Dialog.controls.docWidthET.lt_maxValue = LT_Dialog.MAX_DOC_MEASURE;
		LT_Dialog.controls.docWidthET.onChange = LT_Dialog.onChangeMeasure;

		// Height control
		var myDocHeightUV = new UnitValue(myDocProfile.height, "pt");
		if (myUnitAbbrev != "pt") {
			myDocHeightUV.convert(myUnitAbbrev);
		}
		var docHeight = docWidth;
		docHeight.add( "statictext", undefined, localize("$$$/LiveTrace_AI/DocumentHeight=Height:")  );
		docHeight.controlET = docHeight.add( "edittext", 
			undefined, 
			LT_Dialog.unitValueToDisplay(myDocHeightUV));
		docHeight.controlET.preferredSize = [75, 20];
		LT_Dialog.controls.docHeightET = docHeight.controlET;
		LT_Dialog.controls.docHeightET.lt_lastGoodUV = myDocHeightUV;
		LT_Dialog.controls.docHeightET.lt_minValue = LT_Dialog.MIN_DOC_MEASURE;
		LT_Dialog.controls.docHeightET.lt_maxValue = LT_Dialog.MAX_DOC_MEASURE;
		LT_Dialog.controls.docHeightET.onChange = LT_Dialog.onChangeMeasure;
		
		// Units control
		var docUnits = LT_Dialog.win.docProfilePnl.add( "group" );
		docUnits.add( "statictext", undefined, localize("$$$/LiveTrace_AI/DocumentUnits=Units:")  );
		docUnits.controlDD = docUnits.add( "dropdownlist" );
		docUnits.controlDD.add('item', localize("$$$/LiveTrace_AI/RulerUnitsPoints=Points"));
		docUnits.controlDD.add('item', localize("$$$/LiveTrace_AI/RulerUnitsPicas=Picas"));
		docUnits.controlDD.add('item', localize("$$$/LiveTrace_AI/RulerUnitsInches=Inches"));
		docUnits.controlDD.add('item', localize("$$$/LiveTrace_AI/RulerUnitsMillimeters=Millimeters"));
		docUnits.controlDD.add('item', localize("$$$/LiveTrace_AI/RulerUnitsCentimeters=Centimeters"));
		docUnits.controlDD.add('item', localize("$$$/LiveTrace_AI/RulerUnitsPixels=Pixels"));
		docUnits.controlDD.selection = LT_Dialog.convertRulerUnitsToUnitsDDIndex(myDocProfile.units);
		LT_Dialog.controls.docUnitsDD = docUnits.controlDD;	
		LT_Dialog.controls.docUnitsDD.onChange = function() {
			var myUnitAbbrev = LT_Dialog.convertUnitsDDIndexToUnitAbbrev(this.selection.index);
			LT_Dialog.controls.docWidthET.lt_lastGoodUV.convert(myUnitAbbrev);
			LT_Dialog.controls.docWidthET.text = LT_Dialog.unitValueToDisplay(LT_Dialog.controls.docWidthET.lt_lastGoodUV);			
			LT_Dialog.controls.docHeightET.lt_lastGoodUV.convert(myUnitAbbrev);
			LT_Dialog.controls.docHeightET.text = LT_Dialog.unitValueToDisplay(LT_Dialog.controls.docHeightET.lt_lastGoodUV);
		}
					
		// Source panel
		LT_Dialog.win.srcPnl = LT_Dialog.win.mainCol.add( "panel", undefined, localize("$$$/LiveTrace_AI/Source=Source:") );
		LT_Dialog.win.srcPnl.orientation = "column";		
		LT_Dialog.win.srcPnl.alignChildren = "left";
		LT_Dialog.win.srcPnl.alignment = "fill";
		var srclb = LT_Dialog.win.srcPnl.add('listbox');
		srclb.alignment = "fill";
		srclb.preferredSize.height = 100;
		var fileStore = new File(Folder.temp + "/LiveTrace_AI_Files.txt");
		fileStore.encoding = "UTF-8"; // encoded URI's will be decoded on read
		if (fileStore.open("r")) { 
			if (LT_FileCollector.fileStoreCount <= LT_Dialog.MAX_FILE_COUNT_IN_SOURCE_LISTBOX) {
				// Display all the files in the list box
				while (!fileStore.eof && fileStore.error == "") {
					var f = new File(fileStore.readln());
					srclb.add('item', decodeURI(f.name));
				}
			} else {
				var n = LT_Dialog.MAX_FILE_COUNT_IN_SOURCE_LISTBOX / 2;
				// Display first n and last n files in the list box.
				// There is no max constraint on the number of files that 
				// can be traced but we constrain the max number we show in 
				// the dialog.
				var i = 0;
				// Display first n files
				while (!fileStore.eof && fileStore.error == "" && i < n) {
					var f = new File(fileStore.readln());
					srclb.add('item', decodeURI(f.name));
					i++;
				}
				// Skip intervening files
				var j = i;
				while (!fileStore.eof && fileStore.error == "" && i < LT_FileCollector.fileStoreCount - n) {
					fileStore.readln();
					i++;
				}
				var skipped = i -j;
				srclb.add('item', "++++" + skipped + "++++");
				// Display last n files
				while (!fileStore.eof && fileStore.error == "" && i < LT_FileCollector.fileStoreCount) {
					var f = new File(fileStore.readln());
					srclb.add('item', decodeURI(f.name));
					i++;
				}
			}
			srclb.add('item', "________________");
			srclb.add('item', LT_FileCollector.fileStoreCount);		
			fileStore.close();
		} // end fileStore.open

		// Destination panel
		LT_Dialog.win.destinationPnl = LT_Dialog.win.mainCol.add( "panel", undefined, localize("$$$/LiveTrace_AI/Destination=Destination:") );
		LT_Dialog.win.destinationPnl.orientation = "column";		
		LT_Dialog.win.destinationPnl.alignChildren = "left";

		// Choose destination folder button and edit control
		var dest = LT_Dialog.win.destinationPnl.add( "group" ); 
		dest.btn 	= dest.add( "button", undefined, localize("$$$/LiveTrace_AI/Choose=Choose...") );
		LT_Dialog.destinationFolder = null;
		dest.btn.onClick = function() {
			var f = Folder.selectDialog(localize("$$$/LiveTrace_AI/ChooseOutputDirectory=Choose output directory:"));
			if (f != null) {
				LT_Dialog.destinationFolder = f;
				LT_Dialog.controls.destinationFolderPath.text = decodeURI(LT_Dialog.destinationFolder.absoluteURI);
			}
		}
		LT_Dialog.controls.destinationFolderPath = dest.add('edittext', undefined, '', {readonly:true});
		LT_Dialog.controls.destinationFolderPath.preferredSize.width = 220;
		LT_Dialog.controls.destinationFolderPath.enabled = false;
		
		// File Naming panel
		var filename = LT_Dialog.win.filename = LT_Dialog.win.destinationPnl.add("panel", undefined, localize("$$$/LiveTrace_AI/FileNaming=File Naming") );
		filename.orientation = "column";
		filename.alignment = "fill";
		filename.alignChildren = "left";

		// Sample filename control
		var row = filename.add( "group" );
		LT_Dialog.controls.nameSampleST = row.add("statictext", undefined, "MyDocument.ai");
		LT_Dialog.controls.nameSampleST.preferredSize.width = 300

		// Make an array to hold the name parts
		LT_Dialog.controls.filename = [];
		var row = filename.add( "group" ); 		
			var name1 = row.add( "dropdownlist" );
			name1.add('item', ' ');
			name1.add('item', localize("$$$/LiveTrace_AI/DocumentName=Document Name") );
			name1.add('item', ".ai" );
			name1.selection = name1.items[1];
			LT_Dialog.controls.filename.push(name1);
			
			row.add( "statictext", undefined, " + " );
	
			var name2 = row.add( "edittext", undefined, "" );
			name2.preferredSize.width = 100;
			LT_Dialog.controls.filename.push(name2);
	
			row.add( "statictext", undefined, " + " );

		var row = filename.add( "group" ); 		
			var name3 = row.add( "dropdownlist" );
			name3.add('item', ' ');
			name3.add('item', localize("$$$/LiveTrace_AI/DocumentName=Document Name") );
			name3.add('item', ".ai");
			name3.selection = name3.items[2];
			LT_Dialog.controls.filename.push(name3);
			
			row.add( "statictext", undefined, " + " );
	
			var name4 = row.add( "edittext", undefined, "" );
			name4.preferredSize.width = 100;
			LT_Dialog.controls.filename.push(name4);
	
			row.add( "statictext", undefined, " + " );


		var row = filename.add( "group" ); 		
			var name5 = row.add( "dropdownlist" );
			name5.add('item', ' ');
			name5.add('item', localize("$$$/LiveTrace_AI/DocumentName=Document Name") );
			name5.add('item', ".ai" );
			LT_Dialog.controls.filename.push(name5);
			
			row.add( "statictext", undefined, " + " );
	
			var name6 = row.add( "edittext", undefined, "" );
			name6.preferredSize.width = 100;
			LT_Dialog.controls.filename.push(name6);

		// add on change actions for all naming items
		name1.onChange = name3.onChange = name5.onChange = function() {
			LT_Dialog.controls.nameSampleST.text = LT_Dialog.getDestinationFilename("MyDocument");
		}

		name2.onChange = name4.onChange = name6.onChange = function() {
			LT_Dialog.controls.nameSampleST.text = LT_Dialog.getDestinationFilename("MyDocument");
		}

		//
		// SECOND COLUMN --------------------------------------------------------
		//
		
		// OK/Cancel button group
		LT_Dialog.win.btn = LT_Dialog.win.add( "group" );
		LT_Dialog.win.btn.orientation = "column";
		LT_Dialog.win.btn.alignChildren = 'top';
		LT_Dialog.win.btn.spacing = 30;
		
		LT_Dialog.win.buttonGroup = LT_Dialog.win.btn.add( "group", undefined );
		LT_Dialog.win.buttonGroup.preferredSize.width = 100;
		LT_Dialog.win.buttonGroup.orientation = "column";
        LT_Dialog.win.buttonGroup.alignChildren = "fill";
		LT_Dialog.win.buttonGroup.okButton = LT_Dialog.win.buttonGroup.add( "button", undefined, localize("$$$/LiveTrace_AI/OK=OK") );
		LT_Dialog.win.buttonGroup.cancelButton = LT_Dialog.win.buttonGroup.add( "button", undefined, localize("$$$/LiveTrace_AI/Cancel=Cancel") );		
		LT_Dialog.win.buttonGroup.okButton.onClick		= LT_Dialog.ok;
		LT_Dialog.win.buttonGroup.cancelButton.onClick	= LT_Dialog.cancel;

		// Show the dialog.
		LT_Dialog.win.center();
		LT_Dialog.win.show();
	}

	/**
	*/
	LT_Dialog.convertRulerUnitsToUnitsDDIndex = function(rulerUnitsAsString) {
		switch (rulerUnitsAsString) {
			case "RulerUnits.Points": return 0;
			case "RulerUnits.Picas":  return 1;
			case "RulerUnits.Inches": return 2;
			case "RulerUnits.Millimeters": return 3;
			case "RulerUnits.Centimeters": return 4;
			case "RulerUnits.Pixels": return 5;
			default: return 0;
		}
	}
	
	/**
	*/
	LT_Dialog.convertRulerUnitsToUnitAbbrev = function(rulerUnitsAsString) {
		switch (rulerUnitsAsString) {
			case "RulerUnits.Inches": return "in";
			case "RulerUnits.Centimeters": return "cm";
			case "RulerUnits.Points": return "pt";
			case "RulerUnits.Picas":  return "pc";
			case "RulerUnits.Millimeters": return "mm";
			case "RulerUnits.Pixels": return "px";
			default: return "pt";
		}
	}
	
	/**
	*/
	LT_Dialog.convertUnitsDDIndexToUnitAbbrev = function(index) {
		switch (index) {
			case 0: return "pt";
			case 1: return "pc";
			case 2: return "in";
			case 3: return "mm";
			case 4: return "cm";
			case 5: return "px";
			default: return "pt";
		}
	}
	
	/**
	*/
	LT_Dialog.unitsDDIndexToRulerUnits = function(index) {
		switch (index) {
			case 0: return "RulerUnits.Points";
			case 1: return "RulerUnits.Picas";
			case 2: return "RulerUnits.Inches";
			case 3: return "RulerUnits.Millimeters";
			case 4: return "RulerUnits.Centimeters";
			case 5: return "RulerUnits.Pixels";
			default: return "RulerUnits.Points";
		}
	}
	
	/**
	*/
	LT_Dialog.convertUnitsAsString = function(value, fromUnit, toUnit) {
		var myVal = new UnitValue(value, fromUnit);
		if (myVal.convert(toUnit)) {
			return myVal.value.toString() + " " + myVal.type;
		} else {
			return value.toString() + " " + fromUnit;
		}
	
	}
	
	/** Checks that the text property of an edittext control 
		has a valid measurement value on change and restores 
		the last known good value if the text is invalid.
	*/
	LT_Dialog.onChangeMeasure = function() {
		var isGoodValue = false;
		// Get the units to be used to display values.
		var myUnitAbbrev = LT_Dialog.convertUnitsDDIndexToUnitAbbrev(LT_Dialog.controls.docUnitsDD.selection.index);	
		// Get the text value entered by the user.
		var myValue = new UnitValue(this.text);
		if (myValue.type == "?") {
			// Looks like a bad value - could be non numeric "foo" or a number without a unit "500"
			// Add units and try again to catch numbers without units
			myValue = new UnitValue(this.text + myUnitAbbrev);
		}
		if (myValue.type != "?" && isNaN(myValue.value) == false) {
			// Round the value to 6 decimal places.
			var rounded = Number(myValue.value.toFixed(6));
			myValue = new UnitValue(rounded, myValue.type);
			// Range check the value.
			if (LT_Dialog.rangeCheck(myValue, this.lt_minValue, this.lt_maxValue)) {
				// Potentially this is a good value - convert to the units for display. 
				if (myValue.convert(myUnitAbbrev)) {
					// Got a good value!
					isGoodValue = true;
					// Display the value.
					this.text = LT_Dialog.unitValueToDisplay(myValue);
					// Save off the good value for the next time the propery is changed.
					this.lt_lastGoodUV = myValue;
				}
			}
		}
		if (!isGoodValue && this.lt_lastGoodUV != undefined) {
			// Bad value entered by user - display last known good value.
			this.text = LT_Dialog.unitValueToDisplay(this.lt_lastGoodUV);
		}
	}
	
	/** Returns true if the value is in range, false otherwise
		@param unitValue object of type UnitValue
		@param min minimum value in points
		@param max maximum value in points
	*/
	LT_Dialog.rangeCheck = function(unitValue, min, max) {
		var result = true;
		// Range check a copy of the unitValue so we don't trample on its contents.
		var myUnitValue = new UnitValue(unitValue.value, unitValue.type);
		if (min != undefined && max != undefined) {
			if (myUnitValue.convert("pt")) {
				if (myUnitValue.value < min || myUnitValue.value > max) {
					result = false;
				}
			}
		}
		return result;
	}
	
	/** Returns string containing the given unit value for display.
		@param unitValue the UnitValue object to be converted to a string
	*/
	LT_Dialog.unitValueToDisplay = function(unitValue) {
		if (Math.abs(unitValue.value - Math.round(unitValue.value)) < 1.0e-6) {
			return unitValue.value.toFixed(0) + " " + unitValue.type;
		}
		else {
			return unitValue.value.toFixed(2) + " " + unitValue.type;
		}
	}
	
	/** Handles the cancel button on the Image Trace dialog.
	*/
	LT_Dialog.cancel = function () {
		LT_Dialog.win.close();
		LiveTrace_AI.menu.enabled = true;
	}
	
	/** Handles the OK button on the Image Trace dialog.
	*/
	LT_Dialog.ok = function () {
		// make sure a destination folder is choosen
		if (LT_Dialog.win.destinationPnl.enabled && LT_Dialog.destinationFolder == null) {
			alert(localize("$$$/LiveTrace_AI/YouMustChooseAnOutputDirectory=You must choose an output directory"));
			return;
		}
		LT_Dialog.win.close();
		

		// Kick off the process to trace the files.
		LT_FileTracer.start();

	}

	/** Returns the destination filename using the user specified format.
	*/
	LT_Dialog.getDestinationFilename = function(basename) {
		var format = '';
		for (var i=0; i<LT_Dialog.controls.filename.length; i++) {
			if (LT_Dialog.controls.filename[i].type == 'dropdownlist') {
				// if doc name is choosen
				if (LT_Dialog.controls.filename[i].selection == LT_Dialog.controls.filename[i].items[1]) {
					format += '\\1';
				} else if (LT_Dialog.controls.filename[i].selection == LT_Dialog.controls.filename[i].items[2]) {
					format += '.ai';
				}
			} else if (LT_Dialog.controls.filename[i].type == 'edittext') {
				format += LT_Dialog.controls.filename[i].text;
			}
		}
		return format.replace(/\\1/g, basename);
	}

	// ===========================================================
	// FILE TRACER
	// ===========================================================
	
	/** Scripts Illustrator to trace files.
	*/
	LT_FileTracer = {};

	/** Starts tracing of image files using the options given by the Image Trace dialog.
	*/
	LT_FileTracer.start = function() {
		LT_FileTracer.fileStoreCount = LT_FileCollector.fileStoreCount;
		LT_FileTracer.fileStore = new File(Folder.temp + "/LiveTrace_AI_Files.txt");
		LT_FileTracer.fileStore.encoding = "UTF-8";
		LT_FileTracer.fileStore.open("r");
		LT_FileTracer.templateScript = "";
		LT_FileTracer.destinationFilename = "";
		LT_FileTracer.destinationFolder = null;
		if (LT_Dialog.controls.layersCb.value == false) {
			// Vactorize to Layers is unchecked
			if (LT_Dialog.win.mainCol.closeCb.value == true) {
				// Save and Close results is checked
				LT_FileTracer.destinationFolder = LT_Dialog.destinationFolder;
			}
		}
		LT_FileTracer.cancelled = false;
		LT_FileTracer.index = 0;
		if (File.fs == "Windows") {
			LT_FileTracer.MAX_FILES_PER_AI_SESSION = 500;
		} else {
			LT_FileTracer.MAX_FILES_PER_AI_SESSION = 500;
		}
		LT_FileTracer.waitAfterQuit = false;
		if (LiveTrace_AI.menu.enabled) {
			// Disable Image Trace menu while we are tracing files.
			LiveTrace_AI.menu.enabled = false;
		}
		LT_FileTracer.openTaskPalette();
		LT_FileTracer.traceFiles();
	}

	/** Stops tracing of image files.
	*/
	LT_FileTracer.stop = function() {
		LT_FileTracer.fileStore.close();
		LT_FileTracer.closeTaskPalette();
		LiveTrace_AI.menu.enabled = true;
	}
		
	/** Opens the Image Trace Task palette for tracing files.
	*/
	LT_FileTracer.openTaskPalette = function() {
		// Create palette window.		
		LT_FileTracer.taskPalette = new Window("palette", 
			localize("$$$/LiveTrace_AI/TaskDialogTitle=Image Trace Task")); 
		LT_FileTracer.taskPalette.orientation = "column";
		LT_FileTracer.taskPalette.alignChildren = "right";	
		
		// Add tracing files panel
		var pnl = LT_FileTracer.taskPalette.add("panel", undefined, localize("$$$/LiveTrace_AI/TracingFiles=Tracing files"));
		pnl.orientation = "column";
		pnl.alignChildren = "right";
		
		// Add progress bar
		LT_FileTracer.taskPalette.progBar = pnl.add("progressbar", [0,0,400,10], 0, LT_FileTracer.fileStoreCount);	
		
		// Add status text widgets showing current file number, file name and maximum number of files
		var statusGroup = pnl.add( "group", [0,0,400,25]);
		LT_FileTracer.taskPalette.currentIndexST = statusGroup.add("statictext", [0,0,60,20], "0");
		LT_FileTracer.taskPalette.currentIndexST.justify = "left";
		LT_FileTracer.taskPalette.currentFileST = statusGroup.add("statictext", [80,0,320,20], "");
		LT_FileTracer.taskPalette.currentFileST.justify = "center";			
		LT_FileTracer.taskPalette.fileListLengthST = statusGroup.add("statictext", [340,0,400,20] , LT_FileTracer.fileStoreCount.toString());;
		LT_FileTracer.taskPalette.fileListLengthST.justify = "right";
					
		// Add cancel button.
		LT_FileTracer.taskPalette.cancelButton = LT_FileTracer.taskPalette.add("button", 
			undefined, 
			localize("$$$/LiveTrace_AI/Cancel=Cancel"));
		LT_FileTracer.taskPalette.cancelButton.onClick = function () {
			LT_FileTracer.cancelled = true;
			LT_FileTracer.stop();
		};

		LT_FileTracer.taskPalette.show();
	}
	
	/** Closes the Image Trace Task palette for tracing files.
	*/
	LT_FileTracer.closeTaskPalette = function () {
		if (LT_FileTracer.taskPalette != null) {
			LT_FileTracer.taskPalette.close();
			//LT_FileTracer.taskPalette = null;			
		}
	}
		
	/** Sets up a template script to trace the image files using the options
		specified by the user in the Image Trace dialog and initiates tracing
		of the image files in Illustrator.
	*/
	LT_FileTracer.traceFiles = function () {
	
		// Get data from the dialog that describes the document the user wants.
		var myPreset = LT_Dialog.aiDOMData.documentPresets[LT_Dialog.controls.docProfileDD.selection.index];
		LT_Dialog.controls.docWidthET.lt_lastGoodUV.convert("pt");
		myPreset.width = LT_Dialog.controls.docWidthET.lt_lastGoodUV.value;
		LT_Dialog.controls.docHeightET.lt_lastGoodUV.convert("pt");
		myPreset.height = LT_Dialog.controls.docHeightET.lt_lastGoodUV.value;
		myPreset.units = LT_Dialog.unitsDDIndexToRulerUnits(LT_Dialog.controls.docUnitsDD.selection.index);
		
		// Set up script commands to create such an Illustrator document.
		var createDocumentScpt = new String();
		if (LT_Dialog.aiDOMData.hasDocumentPresets) {
			// Create the document from a preset using documents.addDocument
			createDocumentScpt = 
				'app.userInteractionLevel=UserInteractionLevel.DONTDISPLAYALERTS;\n' +
				'var docPresetName ="' + myPreset.name + '";\n' +
				'var docPreset = app.getPresetSettings(docPresetName);\n' +
				'docPreset.width =' + myPreset.width + ';\n' +
				'docPreset.height =' + myPreset.height + ';\n' +
				'docPreset.units = ' + myPreset.units  + ';\n' +
				'var doc = app.documents.addDocument(docPresetName, docPreset);\n';
		} else {
			// Create the document using documents.add
			var myColorSpace = myPreset.name == localize("$$$/LiveTrace_AI/DocumentPresetTypeBasicCMYK=Basic CMYK") ?
				"DocumentColorSpace.CMYK" : "DocumentColorSpace.RGB";
			createDocumentScpt = 
				'app.userInteractionLevel=UserInteractionLevel.DONTDISPLAYALERTS;\n' +
				'var doc = app.documents.add(' + myColorSpace + ',' +  myPreset.width + ',' + myPreset.height + ');\n';			
		}
		
		// Trace files to documents or layers?
		if (LT_Dialog.controls.layersCb.value == false) {
			// Trace each image file in a separate Illustrator document.
			
			// Create a template script to create a document then place and trace an image file	
			LT_FileTracer.templateScript = 'function AiAutomationLiveTrace_TraceFile() {\n' +
			createDocumentScpt +
			'var p = doc.placedItems.add();\n' +
			'p.file = new File("<INPUTFILE>");\n' +
			'var t = p.trace();\n' +
			't.tracing.tracingOptions.loadFromPreset("' + LT_Dialog.controls.presetDD.selection.toString() + '");\n' +
			'app.redraw();\n';
				

			if (LT_FileTracer.destinationFolder != null) {
				// Add script commands to save and close the traced document.		
				LT_FileTracer.templateScript += 
					'var outfile = new File("<DOCUMENTFILE>");\n' +
					'doc.saveAs(outfile);\n' +
					'doc.close();\n';
					
				// Get the pattern from which the destination document file name is generated.
				LT_FileTracer.destinationFilename = LT_Dialog.getDestinationFilename("<DESTINATIONFILENAME>");
			}
			LT_FileTracer.templateScript += '}\n' +
			'AiAutomationLiveTrace_TraceFile();\n';
			// The parameters (e.g. <INPUTFILE>) are resolved in LT_FileTracer.tracefile
			
			// Trace the first image file.
			LT_FileTracer.traceFile();	
				
		} else {
			// Trace each image file in a separate layer in one Illustrator document.
			
			// Create a template script to to place each image file in a new layer and trace it.
			LT_FileTracer.templateScript = 'function AiAutomationLiveTrace_TraceFileInLayer() {\n' +
				'var l = activeDocument.layers.add();\n' +
				'l.name = "<INPUTFILENAME>";\n' +
				'var p = l.placedItems.add();\n' +
				'p.file = new File("<INPUTFILE>");\n' +
				'var t = p.trace();\n' +
				't.tracing.tracingOptions.loadFromPreset("' + LT_Dialog.controls.presetDD.selection.toString() + '");\n' +
				'app.redraw();\n' +
				'}\n' +
				'AiAutomationLiveTrace_TraceFileInLayer();\n';
			// The parameters (e.g. <INPUTFILE>) are resolved in LT_FileTracer.tracefile
		
			// Enclose the document creation code in a function to avoid clobbering globals
			createDocumentScpt = 'function AiAutomationLiveTrace_CreateDocument() {\n' + 
				createDocumentScpt +
				'}\n' +
				'AiAutomationLiveTrace_CreateDocument();\n';
						
			// Run the script to create the Illustrator document...
			LiveTrace_AI.sendBridgeTalkMessage(
				illustratorTargetName,
				createDocumentScpt,
				LT_FileTracer.traceFile,
				function(btObj) {
					// Called back on error - if we can't create a doc just stop.
					LiveTrace_AI.defaultBridgeTalkErrorHandler(btObj);
					LT_FileTracer.stop();
				});	
			// ... and when that completes call LT_FileTracer.traceFile.
		}
	}	
	
	/** Scripts Illustrator to trace one image file at a time,
		called back repeatedly using BridgeTalk messaging until
		all files have been traced.
	*/
	LT_FileTracer.traceFile = function() {
		// If the user cancelled just return.
		if (LT_FileTracer.cancelled) {
			return;
		}
		
		// If we are done call stop.
		if (LT_FileTracer.index >= LT_FileTracer.fileStoreCount) {
			LT_FileTracer.stop();
			return;
		}
		
		// If we quit Illustrator last time through pause for a bit
		// before sending the next BridgeTalk message
		if (LT_FileTracer.waitAfterQuit) {
			$.sleep(30000); // 30 seconds
			LT_FileTracer.waitAfterQuit = false;
		}
		
		BridgeTalk.bringToFront('bridge');		
		
		// Get the next image file to be traced.
		// File encoding is set to UTF-8 so the URI will be decoded on read		
		var fileURI = LT_FileTracer.fileStore.readln();
		var file = new File(fileURI);
		if (file.exists) {
		
			// Resolve parameters in the template to create a script that traces the image file
			var scpt = LT_FileTracer.templateScript;
			scpt = scpt.replace(/<INPUTFILE>/g, file.fsName);
			scpt = scpt.replace(/<INPUTFILENAME>/g, decodeURI(file.name));
			if (LT_FileTracer.destinationFolder != null) {
				var documentFile = LT_Dialog.destinationFolder + '/' +
					LT_FileTracer.destinationFilename.replace(/<DESTINATIONFILENAME>/g, LT_FileTracer.pathinfo(file.name).basename);
				scpt = scpt.replace(/<DOCUMENTFILE>/g,  documentFile);
			}

			// Trace the file...		
			LiveTrace_AI.sendBridgeTalkMessage(illustratorTargetName, 
				scpt,
				LT_FileTracer.traceFile,
				LT_FileTracer.traceFileErrorHandler);
			// ... and call LT_FileTracer.traceFile back when the current file is traced.
		} // end file.exists

		// Process next file when called back
		LT_FileTracer.index++;
				
		// Update the progress bar
		LT_FileTracer.taskPalette.progBar.value = LT_FileTracer.index;
		LT_FileTracer.taskPalette.currentIndexST.text = LT_FileTracer.index.toString();
		LT_FileTracer.taskPalette.currentFileST.text = decodeURI(file.name);
		
		// When saving tracings to individual Illustrator files we need 
		// to quit Illustrator periodically because of memory leaks and so on.
		if (LT_FileTracer.destinationFolder != null) {		
			if (LT_FileTracer.index != 0 && LT_FileTracer.index < LT_FileTracer.fileStoreCount) {
				if (LT_FileTracer.index % LT_FileTracer.MAX_FILES_PER_AI_SESSION == 0 ) {
					var scpt = 'app.quit();'
					LiveTrace_AI.sendBridgeTalkMessage(illustratorTargetName, scpt);
					LT_FileTracer.waitAfterQuit = true;
					// Next time through this function pause to allow Illustrator to quit.
				}
			}
		}
		
		// If file did not exist then make a recursive call to trace the next file.
		if (!file.exists) {
			LT_FileTracer.traceFile();
		}
	}
	
	/** Handles errors from BridgeTalk caught while tracing files.
	*/
	LT_FileTracer.traceFileErrorHandler = function(btObj) {
		// Alert the user.
		LiveTrace_AI.defaultBridgeTalkErrorHandler(btObj);
		
		// Attempt to continue with the next file.
		// The user can click the cancel button on 
		// the task palette to abort.
		LT_FileTracer.traceFile();
	}
	
	/**
	*/
	LT_FileTracer.pathinfo = function (fname) {
		var dot = fname.lastIndexOf('.');
		if (dot == -1) dot = fname.length;
		var out = {};
		out.dirname = fname.substring(0, fname.lastIndexOf('/'));
		out.basename = fname.substring(fname.lastIndexOf('/'), dot);
		out.extension = fname.substr(dot+1);
		return out;
	}
	
	
	// ===========================================================
	// Image TRACE MENU AND UTILITIES
	// ===========================================================
	
	/** Handles the Image Trace menu.
	*/
	LiveTrace_AI = {};
	
	/** Sends a message using BridgeTalk.
	*/
	LiveTrace_AI.sendBridgeTalkMessage = function( target, script, onResultHandler, onErrorHandler) {
		try {
			var bt = new BridgeTalk();
			bt.target = target;
			bt.body = script;
			bt.onResult = onResultHandler;
			bt.onError = onErrorHandler;
			if (bt.onError == undefined) {
				bt.onError = LiveTrace_AI.defaultBridgeTalkErrorHandler;
			}
			var p = bt.send();
		} catch (a ) {
			alert( a );
		}
	}
	
	/**
	*/
	LiveTrace_AI.defaultBridgeTalkErrorHandler = function (btObj) {
		alert( btObj.body + " (" + btObj.headers ["Error-Code"] + ")" ); 
	}
	
	/** Creates the Tools > Illustrator > Image Trace ... menu in the Bridge UI.
	*/
	LiveTrace_AI.createLiveTraceMenu = function() {

		// Create Tools > Illustrator menu
		LiveTrace_AI.createMenu( "menu", localize("$$$/LiveTrace_AI/ToolsAIMenu=Illustrator"), "at the end of tools", "tools/ai" );

		// Create Tools > Illustrator > Image Trace... menu
		LiveTrace_AI.menu = LiveTrace_AI.createMenu( "command", localize("$$$/LiveTrace_AI/LiveTraceMenu=Image Trace..."), "at the end of tools/ai", "tools/ai/LiveTrace");
		LiveTrace_AI.menu.onSelect = LiveTrace_AI.doLiveTraceMenuOnSelect;
	}	
	
	/** Creates a menu element in the Bridge UI.
	*/	
	LiveTrace_AI.createMenu = function( type, text, where, id)  {
		var aMenu = null;
		aMenu = MenuElement.find( id );
		if ( aMenu == null )  {
			aMenu = MenuElement.create( type, text, where, id );
		}
		aMenu.enabled = true;
		return aMenu;
	}	
	
	/** Handles the Image Trace menu.
	*/
	LiveTrace_AI.doLiveTraceMenuOnSelect = function() {
	
		// Collect the files to be traced and callback onFileCollectionDone when done.
		LT_FileCollector.start(LiveTrace_AI.onFileCollectionDone);
		
	}
	
	/** Checks whether the set of files to be processed 
		is valid when file collection is complete and 
		initialises the Image Trace dialog.
	*/
	LiveTrace_AI.onFileCollectionDone  = function() {
		// Check some files are available for processing.
		if (LT_FileCollector.fileStoreCount == 0) {
			var e = localize( "$$$/LiveTrace_AI/Library/NONEselected=There was a problem with ^QImage Trace^Q because no valid items were selected. Please make a selection and try again." );
			alert(e);
			// Enable the Image Trace menu
			LiveTrace_AI.menu.enabled = true;
			return;
		} else if (LT_FileCollector.hasSkipped) {
			alert(localize( "$$$/LiveTrace_AI/Library/SomeSkipped=Some files were skipped because they were not of the correct type." ));
		}
		if (LT_FileCollector.fileStoreCount >= LT_FileCollector.MAX_BATCH_SIZE) {
			alert(localize("$$$/LiveTrace_AI/Limit=Limited the number of files to be traced to: ") + LT_FileCollector.MAX_BATCH_SIZE);
		}
	
		try {
			// Initialise the Image Trace dialog
			LT_Dialog.init();
		} catch (e) {
			// Alert the user and re-enable the Image Trace menu on error.
			alert(e);
			LiveTrace_AI.menu.enabled = true;
		}
	}
	
	// ===========================================================
	// MAIN
	// ===========================================================
	
	// Create the Image Trace menu in the Bridge UI.
	LiveTrace_AI.createLiveTraceMenu();
	
} // end if (BridgeTalk.appName == "bridge" )