/*==========================================================

    RealSizer
    
    Author: Ashung Hung
    Mail: ashung.hung@gmail.com
    Dribbble: dribbble.com/ashung
    
    THANKS:
    
    List of displays by pixel density:
    http://en.wikipedia.org/wiki/List_of_displays_by_pixel_density
    
    ScriptUI Window in Photoshop – Palette vs. Dialog
    http://www.davidebarranca.com/2012/10/scriptui-window-in-photoshop-palette-vs-dialog/

==========================================================*/

#target photoshop
app.bringToFront();

var devicesDPI = [
{'title': 'iPhone 3GS, iPod Touch', 'dpi': 163, 'resolution': [320, 480], diagonal: 3.54},
{'title': 'iPhone 4, 4S, iPod Touch 4', 'dpi': 326, 'resolution': [640, 960], diagonal: 3.5},
{'title': 'iPhone 5, iPod Touch 5', 'dpi': 326, 'resolution': [640, 1136], diagonal: 4},
{'title': 'iPad, 2', 'dpi': 132, 'resolution': [1024, 768], diagonal: 9.7},
{'title': 'New iPad, 4', 'dpi': 264, 'resolution': [2048, 1536], diagonal: 9.7},
{'title': 'iPad Mini', 'dpi': 163, 'resolution': [1024, 768], diagonal: 7.9},

{'title': 'Kindle Fire', 'dpi': 169, 'resolution': [1024, 600], diagonal: 7},
{'title': 'Kindle Fire HD 7"', 'dpi': 216, 'resolution': [1280, 800], diagonal: 7},
{'title': 'Kindle Fire HD 8.9"', 'dpi': 254, 'resolution': [1280, 800], diagonal: 8.9},

{'title': 'Google/LG Nexus 4', 'dpi': 320, 'resolution': [768, 1280], diagonal: 4.7},
{'title': 'Google Nexus 7', 'dpi': 216, 'resolution': [1280, 800], diagonal: 7},
{'title': 'Google Nexus S', 'dpi': 235, 'resolution': [480, 800], diagonal: 4},
{'title': 'Motorola Xoom', 'dpi': 149, 'resolution': [1280, 800], diagonal: 10.1},

{'title': 'Samsung Galaxy S (I9000/I9001)', 'dpi': 233, 'resolution': [480, 800], diagonal: 4.0},
{'title': 'Samsung Galaxy S II (I9100)', 'dpi': 219, 'resolution': [480, 800], diagonal: 4.27},
{'title': 'Samsung Galaxy S III', 'dpi': 306, 'resolution': [720, 1280], diagonal: 4.8},
{'title': 'Samsung Galaxy S IV', 'dpi': 441, 'resolution': [1080, 1920], diagonal: 5},
{'title': 'Samsung Galaxy Nexus', 'dpi': 316, 'resolution': [720, 1280], diagonal: 4.65},
{'title': 'Samsung Galaxy Tab', 'dpi': 171, 'resolution': [1024, 600], diagonal: 7},
{'title': 'Samsung Galaxy Tab 7.7', 'dpi': 196, 'resolution': [1280, 800], diagonal: 7.7},
{'title': 'Samsung Galaxy Tab 10.1', 'dpi': 149, 'resolution': [1280, 800], diagonal: 10.1},
{'title': 'Samsung Galaxy Note', 'dpi': 285, 'resolution': [800, 1280], diagonal: 5.3},
{'title': 'Samsung Galaxy Note II', 'dpi': 267, 'resolution': [720, 1280], diagonal: 5.55},
{'title': 'Samsung Galaxy Note 10.1', 'dpi': 149, 'resolution': [1280, 800], diagonal: 10.1},
{'title': 'Nexus 10', 'dpi': 300, 'resolution': [2560, 1600], diagonal: 10.055},

{'title': 'Nokia Lumia 710/800', 'dpi': 252, 'resolution': [480, 800], diagonal: 3.7},
{'title': 'Nokia Lumia 820/900', 'dpi': 217, 'resolution': [480, 800], diagonal: 4.3},
{'title': 'Nokia Lumia 920', 'dpi': 332, 'resolution': [768, 1280], diagonal: 4.5},

{'title': 'Microsoft Surface', 'dpi': 148, 'resolution': [1366, 768], diagonal: 10.1},
{'title': 'Microsoft Surface Pro', 'dpi': 148, 'resolution': [1366, 768], diagonal: 10.1},

{'title': 'BlackBerry PlayBook', 'dpi': 169, 'resolution': [1024, 600], diagonal: 7},
{'title': 'BlackBerry Z10', 'dpi': 208, 'resolution': [1920, 1080], diagonal: 4.2},

{'title': 'Oppo Find 5', 'dpi': 441, 'resolution': [1080, 1920], diagonal: 5},
{'title': 'Xiaomi Mi1', 'dpi': 245, 'resolution': [480, 854], diagonal: 4},
{'title': 'Xiaomi Mi2', 'dpi': 341, 'resolution': [720, 1280], diagonal: 4.3},
{'title': 'Huawei D2', 'dpi': 443, 'resolution': [1080, 1920], diagonal: 5},
{'title': 'Huawei P1', 'dpi': 256, 'resolution': [540, 960], diagonal: 4.3}

];

var lang = {
    devicesLabel: {
        en: 'Choose Devices:',
        zh: '选择设备:'
    },
    btnRealSizeView: {
        en: 'New Window for Real Size View',
        zh: '新窗口显示实际尺寸'
    },
    btnRealSizePrint: {
        en: 'New Document for Real Size Printing',
        zh: '创建用于打印真实尺寸的图像'
    },
    alertOpenDoc: {
        en: 'Please open a document first.\rMake sure that the document size or content size is match your screen size of device.',
        zh: '请先打开文档.\r保证文档大小或者内容的尺寸符合你要选择的设备屏幕.'
    },
    about: {
        en: 'About',
        zh: '关于'
    },
    aboutText: {
        en: 'RealSizer help mobile UI designer to display their designs at real size on computer monitor, and printing at real size.\r\rFor more information, visite https://github.com/Ashung/realsizer\r\rRealSizer 1.0 Build 2013.03.15 8:20 PM',
        zh: 'RealSizer用于让Mobile UI设计师在屏幕将设计显示为真实尺寸, 和创建用于打印真实尺寸的图像.\r\r详细信息请访问, https://github.com/Ashung/realsizer\r\rRealSizer 1.0 Build 2013.03.15 8:20 PM'
    }
};

var layoutRes = 
"palette {\
    text: 'RealSizer',\
    alignChildren: 'left',\
    devices: Group {\
        orientation: 'column',\
        alignChildren: 'left',\
        label: StaticText { text: '" + localize(lang.devicesLabel) + "'},\
        select: DropDownList { size: [300, 30] }\
    },\
    actions: Group {\
        orientation: 'column',\
        btnRealSizeView: Button { text: '" + localize(lang.btnRealSizeView) + "', size: [300, 30]}\
        btnRealSizePrint: Button { text: '" + localize(lang.btnRealSizePrint) + "', size: [300, 30]}\
    },\
    about: Panel {\
        orientation: 'column',\
        text: '" + localize(lang.about) + "',\
        size: [300, 150],\
        alignChildren: 'left',\
        aboutText: StaticText { characters: 38, properties: { multiline: true } }\
    }\
}";

var isDone = false;
var win = new Window(layoutRes);
var dpi;
var deviceDropDownList = win.devices.select;
var btnRealSizeView = win.actions.btnRealSizeView;
var btnRealSizePrint = win.actions.btnRealSizePrint;

for(var i = 0; i < devicesDPI.length; i ++) {
    var text = devicesDPI[i].title + ' (' + devicesDPI[i].resolution[0] + 'x' + devicesDPI[i].resolution[1] + 'px, ' + devicesDPI[i].diagonal + '", ' + devicesDPI[i].dpi + 'dpi)';
    deviceDropDownList.add('item', text);
}
deviceDropDownList.onChange = function() {
    dpi = devicesDPI[this.selection.index].dpi;
}
deviceDropDownList.selection = deviceDropDownList.items[0];

btnRealSizeView.onClick = function() {
    realSizeView(dpi);
}

btnRealSizePrint.onClick = function() {
    realSizeForPrint(dpi);
}

    win.about.aboutText.text = localize(lang.aboutText);
    win.show();

while (isDone === false) {
    app.refresh();
}

function realSizeView(deviceDPI) {
    if(!documents.length) {
        alert(localize(lang.alertOpenDoc));
        return;
    }

    var originImageResolution = activeDocument.resolution;

    // Change Image dpi to device dpi
    setImageResolution(deviceDPI);

    // Arrange - New Window for...
    doMenuItem(cTID('NwVw'));

    // View - Print Size
    doMenuItem(cTID('PrnS'));
    
    // View - Show - None
    try {
        doMenuItem(sTID('showNone')); 
    } catch(e) {}

    // Recovery image dpi
    setImageResolution(originImageResolution);
}

function realSizeForPrint(deviceDPI) {
    if(!documents.length) {
        alert(localize(lang.alertOpenDoc));
        return;
    }

    // Select - All    
    activeDocument.selection.selectAll();
    
    // Edit - Copy Merged
    try {
        activeDocument.selection.copy(true);
    } catch(e) {
        activeDocument.artLayers.add();
        activeDocument.selection.copy(true);
        activeDocument.activeLayer.remove();
    }   
    
    // Select - Deselect
    activeDocument.selection.deselect();
    
    // File - New...
    var width = UnitValue (activeDocument.width.as('px'), 'px');
    var height = UnitValue (activeDocument.height.as('px'), 'px');
    var name = activeDocument.name.slice(0, activeDocument.name.lastIndexOf('.')) + '_for_print';
    documents.add(width, height, deviceDPI, name, NewDocumentMode.RGB, DocumentFill.TRANSPARENT);
    
    // Edit - Paste
    activeDocument.paste();
}

function setImageResolution(x) {
    try {
        activeDocument.resizeImage(activeDocument.width, activeDocument.height, x);
    } catch(e) {}
}

function doMenuItem(item) {
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
        ref.putEnumerated(cTID('Mn  '), cTID('MnIt'), item);
        desc.putReference(cTID('null'), ref);
    executeAction(cTID("slct"), desc, DialogModes.NO);
}

function cTID(s) {
    return app.charIDToTypeID(s);
}

function sTID(s) {
    return app.stringIDToTypeID(s);
}
