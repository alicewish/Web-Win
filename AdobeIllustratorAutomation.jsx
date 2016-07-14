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
@@@BUILDINFO@@@ AdobeIllustratorAutomation.jsx 2.0 203 25-Jan-2007
*/

/*
@@@START_XML@@@
<?xml version="1.0" encoding="UTF-8"?>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="en_US">
     <dc:title>Adobe Illustrator Automation CC</dc:title>
     <dc:description>Automates the tracing of image files using Illustrator's Image Trace feature.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="de_DE">
     <dc:title>Adobe Illustrator-Automatisierung CC</dc:title>
     <dc:description>Automatisiert das Abpausen von Bilddateien mit der Illustrator-Funktion 'Interaktiv abpausen'.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="fr_FR">
     <dc:title>Automatisation Adobe Illustrator CC</dc:title>
     <dc:description>Automatise la vectorisation des fichiers images à l'aide de la fonction de vectorisation dynamique d'Illustrator.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="ja_JP">
     <dc:title>Adobe Illustrator Automation CC</dc:title>
     <dc:description>Illustrator のライブトレース機能を使用して画像ファイルのトレースを自動化します。</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="da_DK">
     <dc:title>Adobe Illustrator-automatisering CC</dc:title>
     <dc:description>Automatiserer vektorisering af billedfiler ved hjælp af funktionen Dynamisk vektorisering i Illustrator.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="es_ES">
     <dc:title>Automatización de Adobe Illustrator CC</dc:title>
     <dc:description>Automatiza el calco de archivos de imágenes con la función Calco interactivo de Illustrator.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="it_IT">
     <dc:title>Automazione di Adobe Illustrator CC</dc:title>
     <dc:description>Consente il ricalco automatico di file di immagini mediante la funzione Ricalco dinamico di Illustrator.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="nl_NL">
     <dc:title>Adobe Illustrator Automatisering CC</dc:title>
     <dc:description>Automatisch afbeeldingsbestanden overtrekken met de functie Actief overtrekken van Illustrator.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="sv_SE">
     <dc:title>Adobe Illustrator Automation CC</dc:title>
     <dc:description>Automatiserar kalkeringen av bilder genom att använda direktkalkeringsfunktionen som finns i Illustrator.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="ko_KR">
     <dc:title>Adobe Illustrator 자동화 CC</dc:title>
     <dc:description>Illustrator의 라이브 추적 기능을 사용하여 이미지 파일 추적을 자동화합니다.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="zh_CN">
     <dc:title>Adobe Illustrator Automation CC</dc:title>
     <dc:description>使用 Illustrator 的“实时描摹”功能来实现图像文件描摹的自动化。</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="zh_TW">
     <dc:title>Adobe Illustrator 自動化 CC</dc:title>
     <dc:description>使用 Illustrator 的「即時描圖」功能在影像檔案中進行自動描圖。</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="cs_CZ">
     <dc:title>Automatizace pro Adobe Illustrator CC</dc:title>
     <dc:description>Automatizuje vektorizaci obrazových souborů s použitím funkce Živá vektorizace Illustratoru.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="el_GR">
     <dc:title>Αυτοματισμός Adobe Illustrator CC</dc:title>
     <dc:description>Αυτοματοποιεί τον εντοπισμό αρχείων εικόνας, χρησιμοποιώντας τη λειτουργία Image Trace του Illustrator.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="tr_TR">
     <dc:title>Adobe Illustrator Otomasyon CC</dc:title>
     <dc:description>Illustrator'ın Canlı Kontur özelliğini kullanarak görüntü dosyalarının izlenmesini otomatikleştirir.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="hu_HU">
     <dc:title>Adobe Illustrator automatizálás CC</dc:title>
     <dc:description>Automatizálja a képfájloknak az Illustrator Élő kontúr szolgáltatásával való kontúrozását.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="ro_RO">
     <dc:title>Automatizare Adobe Illustrator CC</dc:title>
     <dc:description>Automatizează urmărirea fişierelor de imagine utilizând caracteristica Vectorizare dinamică din Illustrator</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="uk_UA">
     <dc:title>Автоматизація в Adobe Illustrator CC</dc:title>
     <dc:description>Автоматизує трасування файлів зображення за допомогою можливості Image Trace програми Illustrator.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="pl_PL">
     <dc:title>Automatyzacja Adobe Illustrator CC</dc:title>
     <dc:description>Automatyzuje obrys obrazów przy pomocy funkcji programu Illustrator: Aktywny obrys.</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="ru_RU">
     <dc:title>Adobe Illustrator Automation CC</dc:title>
     <dc:description>Автоматизирует трассировку изображений с помощью средства Illustrator "Быстрая трассировка".</dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="ar_AE">
     <dc:title>Adobe Illustrator Automation CC</dc:title>
     <dc:description>.Illustrator يقوم بتتبع ملفات الصور باستخدام خاصية التتبع المباشر في </dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="he_IL">
     <dc:title>Adobe Illustrator Automation CC</dc:title>
     <dc:description>.Illustrator אוטומציית עקיבה של קובצי תמונה בעזרת תכונת 'עקיבה חיה' של </dc:description>
</ScriptInfo>
<ScriptInfo xmlns:dc="http://purl.org/dc/elements/1.1/" xml:lang="pt_BR">
     <dc:title>Adobe Illustrator Automation CC</dc:title>
     <dc:description>Automatiza o traço dos arquivos de imagem usando o recurso Image Trace do Illustrator.</dc:description>
</ScriptInfo>
@@@END_XML@@@
*/

/**	Installs the Adobe Illustrator Automation extension on Bridge startup -
	currently one script is managed by this extension - LiveTrace_AI.jsx.
    1.	Creates the Tools > Illustrator menu in Bridge if it is not already there
    2.	Creates the Tools > Illustrator > Image Trace... menu in Bridge
    3.	Lazy loads the LiveTrace_AI.jsx script and calls it when the 
		Image Trace menu is selected.
		
	The minimal amount of work to install underlying scripts is done by
	AdobeIllustratorAutomation.jsx so that the impact on Bridge launch times
	is kept low.
*/

if (BridgeTalk.appName == "bridge" )	 {

	AdobeIllustratorAutomation = {};
	
	// Underlying scripts should be in a Resources folder alongside this script.
	AdobeIllustratorAutomation.resourcesFolderPath = File($.fileName).path + "/Resources";

	// The intervening lines contain helper functions, skip to the foot
	// of the file to see the extensions installed in the Bridge UI.
			
	/** Creates a menu element in the Bridge UI.
	*/
	AdobeIllustratorAutomation.createMenu = function( type, text, where, id)  {
		var aMenu = null;
		aMenu = MenuElement.find( id );
		if ( aMenu == null )  {
			aMenu = MenuElement.create( type, text, where, id );
		}
		aMenu.enabled = true;
		return aMenu;
	}

	/**	Executes the script associated with a menu, the script is 
		loaded then called when the user clicks the menu.
	*/
	AdobeIllustratorAutomation.executeMenu = function( menu ) {
		try {
			if ( !menu.scriptFile.hasBeenLoaded ) {
				$.evalFile( menu.scriptFile );
				menu.scriptFile.hasBeenLoaded = true;
			}
			var exeString = menu.scriptExecutor;
			eval( exeString ); // if this fails, the script hasn't been loaded
		} catch ( e ) { 
			var msg = menu.text + localize( "$$$/AIA/ScriptFailedToLoad= failed to load properly: "  ) + "\n";
			msg += localize( "$$$/AIA/ScriptFile=Script File: " ) + decodeURI( menu.scriptFile.name ) + "\n";
			msg += localize( "$$$/AIA/LineNumber=Line Number: " ) + e.line + "\n";
			msg += e;
			alert( msg );
		}
	}
	
	/** Creates the Tools > Illustrator > Image Trace menu menu in the Bridge UI
		and connects that menu to the code to be executed when the menu is 
		selected.
		
	*/
	AdobeIllustratorAutomation.createLiveTraceMenu = function() {
		AdobeIllustratorAutomation.menu = AdobeIllustratorAutomation.createMenu( "command", localize("$$$/AIA/LiveTraceMenu=Image Trace..."), "at the end of tools/ai", "tools/ai/LiveTrace");
		AdobeIllustratorAutomation.menu.onSelect = AdobeIllustratorAutomation.executeMenu;
		AdobeIllustratorAutomation.menu.scriptFile =  new File( AdobeIllustratorAutomation.resourcesFolderPath + "/LiveTrace_AI.jsx" );
		AdobeIllustratorAutomation.menu.scriptExecutor = "LiveTrace_AI.doLiveTraceMenuOnSelect();";
	}

	// Create Tools > Illustrator menu - the root menu for Adobe Illustrator Automation.
	// If you change the menu path remember to change it in LiveTrace_AI.createLiveTraceMenu aswell.
	AdobeIllustratorAutomation.createMenu( "menu", localize("$$$/AIA/ToolsAIMenu=Illustrator"), "at the end of tools", "tools/ai" );	
	
	// Create the Image Trace menu in the Bridge UI.
	AdobeIllustratorAutomation.createLiveTraceMenu();

} // end if (BridgeTalk.appName == "bridge" )	
