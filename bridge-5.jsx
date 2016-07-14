// (c) Copyright 2007.  Adobe Systems, Incorporated.  All rights reserved.

// This JavaScript is to be read by Bridge, Photoshop, and other Adobe apps at
// launch. It generally exposes a larger Bridge dom to the other apps.

// debug level: 0-2 (0:disable, 1:break on error, 2:break at beginning)
$.level = 0;
// debugger; // launch debugger on next line



//=================================================================
// Setup/Support
// This first portion of the script sets up an object to provide
// scope for all Bridge BridgeTalk related routines to prevent
// name collision with other groups' scripts, and defines some common
// utility functions.
//=================================================================

var bridge5 = new Object;

// Set the bare bridge global object to this version so API calls are handled
// only by Bridge CS6
bridge = bridge5;

//-----------------------------------------------------------------
// This routine tries to return an array of File objects created
// from the 'files' argument. It will convert a single File object
// or a single string into an array of File objects, or it will
// convert an array of string and File objects into an array of
// file objects.
//-----------------------------------------------------------------
bridge5.ExtractFileArray = function (files)
{
	var fileArray = new Array;
	
	// If it isn't an array, make it a length one array.
	if (!(files instanceof Array))
		files = new Array (files);
	
	// Turn each item in the array into a File, or remove it.
	for (index = 0; index < files.length; ++index)
	{
		var file = files[index];
		
		if (file instanceof File)
			fileArray.push (file);
		else if (typeof file == 'string')
			fileArray.push (File (file));
		else
		{
			// do nothing
		}
	}
	
	return fileArray;
}

bridge5.convertPathStrToFile = function( file )
{
	return File( file );
}

//=================================================================
// CrossDOM/X-DOM
// Implements Bridge's cross DOM API - the a small set of
// operations that are common to all Adobe apps.
//=================================================================


//-----------------------------------------------------------------
// executeScript (script) - Performs an "eval" on the given script.
//
// return value		undefined
//
// script			String		The script to be evaled
//-----------------------------------------------------------------

bridge5.executeScript = function( script )
{
	if( BridgeTalk.appName != "bridge" )
	{
		// Bring Bridge to front if already running
		BridgeTalk.bringToFront( "bridge" );

		var bt = new BridgeTalk;
		bt.target = "bridge-5";
		bt.body = script;
		bt.send();
	}
	else
	{
		// Bring Bridge to front if already running
		app.bringToFront();
		eval( script );
	}
}

//-----------------------------------------------------------------
// open (files) - Performs the equivalent of File->New Window on the
// requested paths. Accepts either an Array object or a single
// path.
//
// return value 	undefined
//			
// files			File or Array of File	files to display in new Window
//-----------------------------------------------------------------

bridge5.open = function( files )
{
	if( BridgeTalk.appName == "bridge" )
	{		
		var fileArray = bridge5.ExtractFileArray ( files ); 
		
		for ( index = 0; index < fileArray.length; ++index )
		{
			var file = fileArray[index];
			
			app.browseTo( file );
		}
		
		app.bringToFront();
	}
	else
	{
		var fileArray = bridge5.ExtractFileArray ( files );
		
		var bt = new BridgeTalk;
		bt.target = "bridge-5";
		bt.body = "bridge5.open( " + fileArray.toSource() + " );";
		bt.send();
	}
}

//-----------------------------------------------------------------
// openAsNew ([creation-options]*) - Performs the equivalent of
// File->New Window. The creation-options are app-specific and should
// ideally map on to the app's new() function. Bridge has no creation
// options. Opens a new Bridge Window to the default path.
//
// return value		undefined
//-----------------------------------------------------------------

bridge5.openAsNew = function()
{
	if( BridgeTalk.appName == "bridge" )
	{
		if( app.documents.length == 0 )
			app.browseTo();
		else
			app.browseTo( app.document.thumbnail.path );

		app.bringToFront();
	}
	else
	{
		var bt = new BridgeTalk;
		bt.target = "bridge-5";
		
		if( BridgeTalk.isRunning( "bridge-5" ) )
			bt.body = "bridge5.openAsNew()";
		else
			bt.body = "app.document.thumbnail = new Thumbnail( app.document.thumbnail.path );";
		
		bt.send();	
	}
}

//-----------------------------------------------------------------
// print (files) - Performs the equivalent of File->Print on the
// requested files. Bridge has no such functionality.
//
// return value			undefined			
// files				File or Array of File	files to be printed
//-----------------------------------------------------------------

bridge5.print = function( files )
{
	//do nothing. Bridge does not print
}

//-----------------------------------------------------------------
// reveal (file) - Gives the target app focus and brings the
// specified document to the foreground if it is already open.
// Scrolls the file into view in the Bridge content pane.
//
// return value		undefined
//
// file				File		file to be revealed
//-----------------------------------------------------------------

bridge5.reveal = function( file )
{
	if( BridgeTalk.appName == "bridge" )
	{
		if( typeof file == "string" )
			file = bridge5.convertPathStrToFile( file );
		
		var fileThumb = new Thumbnail( file );
			
		for( var i = 0; i < app.documents.length; i++ )
		{
			var thumbs = app.documents[i].thumbnail.children;
			
			if( thumbs.length > 0 )
				for( var j = 0; j < thumbs.length; j++ )
				{
					if( thumbs[j].spec.fsName == fileThumb.spec.fsName )
					{
						app.documents[i].bringToFront();
						app.documents[i].reveal( fileThumb );
					}
				}
		}
	}
	else
	{		
		if( typeof file == "string" )
			file = bridge5.convertPathStrToFile( file );
			
		var bt = new BridgeTalk;
		bt.target = "bridge-5";
		bt.body = "bridge5.reveal(" + file.toSource() + ");";
		bt.send();	
	}
}

//-----------------------------------------------------------------
// quit () - Performs the equivalent of File->Exit or Quit Bridge.
//
//	return value	undefined
//-----------------------------------------------------------------

bridge5.quit = function()
{
	if( BridgeTalk.isRunning( "bridge-5" ) )
		bridge5.executeScript( "app.quit();" );
}

/*
@@@START_XML@@@
<?xml version="1.0" encoding="UTF-8"?>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="en_US">
     <dc:title>Adobe Bridge CS6</dc:title>
     <dc:description>This script enables other applications to communicate with Adobe Bridge.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="fr_FR">
     <dc:title>Adobe Bridge CS6</dc:title>
     <dc:description>Ce script permet à d'autres applications de communiquer avec Adobe Bridge.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="fr_CA">
     <dc:title>Adobe Bridge CS6</dc:title>
     <dc:description>Ce script permet à d'autres applications de communiquer avec Adobe Bridge.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="fr_XM">
     <dc:title>Adobe Bridge CS6</dc:title>
     <dc:description>Ce script permet à d'autres applications de communiquer avec Adobe Bridge.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="ja_JP">
     <dc:title>Adobe Bridge CS6</dc:title>
     <dc:description>このスクリプトは、他のアプリケーションと Adobe Bridge との通信を有効にします。</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="de_DE">
     <dc:title>Adobe Bridge CS6</dc:title>
     <dc:description>Mithilfe dieses Skripts können andere Anwendungen mit Adobe Bridge kommunizieren.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="it_IT">
     <dc:title>Adobe Bridge CS6</dc:title>
     <dc:description>Questo script consente ad altre applicazioni di comunicare con Adobe Bridge.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="es_ES">
     <dc:title>Adobe Bridge CS6</dc:title>
     <dc:description>Este script posibilita que otras aplicaciones se comuniquen con Adobe Bridge.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="es_MX">
     <dc:title>Adobe Bridge CS6</dc:title>
     <dc:description>Este script posibilita que otras aplicaciones se comuniquen con Adobe Bridge.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="nl_NL">
     <dc:title>Adobe Bridge CS6</dc:title>
     <dc:description>Dit script laat andere toepassingen toe te communiceren met Adobe Bridge.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="pt_BR">
     <dc:title>Adobe Bridge CS6</dc:title>
     <dc:description>Este script permite que outros aplicativos se comuniquem com o Adobe Bridge.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="nb_NO">
     <dc:title>Adobe Bridge CS6</dc:title>
     <dc:description>Skriptet gjør at andre programmer kan kommunisere med Adobe Bridge.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="da_DK">
     <dc:title>Adobe Bridge CS6</dc:title>
     <dc:description>Dette script betyder, at andre programmer kan kommunikere med Adobe Bridge.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="fi_FI">
     <dc:title>Adobe Bridge CS6</dc:title>
     <dc:description>Tämän komentosarjan avulla muut sovellukset ja Adobe Bridge voivat kommunikoida keskenään.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="sv_SE">
     <dc:title>Adobe Bridge CS6</dc:title>
     <dc:description>Det här skriptet gör det möjligt för andra program att kommunicera med Adobe Bridge.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="zh_TW">
     <dc:title>Adobe Bridge CS6</dc:title>
     <dc:description>此指令碼能讓其他應用程式與 Adobe Bridge 進行通訊。</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="zh_CN">
     <dc:title>Adobe Bridge CS6</dc:title>
     <dc:description>此脚本使其它应用程序能够与 Adobe Bridge 进行通信。</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="ko_KR">
     <dc:title>Adobe Bridge CS6</dc:title>
     <dc:description>이 스크립트를 사용하면 다른 응용 프로그램에서 Adobe Bridge과(와) 통신할 수 있습니다.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="cs_CZ">
     <dc:title>Adobe Bridge CS6</dc:title>
     <dc:description>Díky tomuto skriptu mohou ostatní aplikace komunikovat s aplikací Adobe Bridge.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="hu_HU">
     <dc:title>Adobe Bridge CS6</dc:title>
     <dc:description>Ez a parancsfájl lehetővé teszi más alkalmazások számára a kommunikációt az Adobe Bridge programmal.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="pl_PL">
     <dc:title>Adobe Bridge CS6</dc:title>
     <dc:description>Ten skrypt umożliwia innym aplikacjom komunikowanie się z programem Adobe Bridge.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="ru_RU">
     <dc:title>Adobe Bridge CS6</dc:title>
     <dc:description>Этот сценарий позволяет другим приложениям взаимодействовать с Adobe Bridge.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="tr_TR">
     <dc:title>Adobe Bridge CS6</dc:title>
     <dc:description>Bu komut dosyası, diğer uygulamaların Adobe Bridge ile iletişim kurmasına olanak tanır.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="uk_UA">
     <dc:title>Adobe Bridge CS6</dc:title>
     <dc:description>Цей сценарій вмикає інші програми для зв’язку з Adobe Bridge.</dc:description>
</ScriptInfo>
@@@END_XML@@@
*/