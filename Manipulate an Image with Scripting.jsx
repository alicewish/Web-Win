//步骤二  初始化
preferences.rulerUnits = Units.PIXELS; 
displayDialogs = DialogModes.NO
//步骤三  打开文件、复制背景层
open(File(openDialog()));
var docRef_1 = activeDocument;
docRef_1.backgroundLayer.duplicate(); 
//步骤四  定义黑色和白色的十六进制颜色值，更改前景色和背景色
var white = new SolidColor(); 
white.rgb["hexValue"] = "ffffff"; 
var black = new SolidColor(); 
black.rgb["hexValue"] = "000000";
foregroundColor = black; 
backgroundColor = white; 
//步骤五  填充白色
docRef_1.selection.selectAll(); 
docRef_1.selection.fill(white); 
docRef_1.selection.deselect(); 
//步骤六  复制图片图层并施加平均模糊滤镜
docRef_1.layers[0].duplicate(); 
docRef_1.activeLayer = docRef_1.layers[0]; 
docRef_1.activeLayer.applyAverage(); 
//步骤七  通过通道直方图取步骤六得到的平均色填充层的颜色
for (RLevel = 0; RLevel <= 255; RLevel ++) { if (docRef_1.channels[0].histogram[RLevel]) { break; } }
for (GLevel = 0; GLevel <= 255; GLevel ++) { if (docRef_1.channels[1].histogram[GLevel]) { break; } } 
for (BLevel = 0; BLevel <= 255; BLevel ++) { if (docRef_1.channels[2].histogram[BLevel]) { break; } }
//步骤九  调色
var R = 0; var G = 0; var B = 0; 
if (RLevel > GLevel && RLevel > BLevel) { R = 255; }
if (GLevel > BLevel && GLevel > RLevel) { G = 255; } 
if (BLevel > RLevel && BLevel > GLevel) { B = 255; }
//步骤十  填色
var color = new SolidColor();
color.rgb.red = R; color.rgb.green = G; color.rgb.blue = B; 
docRef_1.selection.selectAll(); 
docRef_1.selection.fill(color); 
docRef_1.selection.deselect();
//步骤十一  填色层反相，更改混合模式为颜色，降低不透明度，合并图层
docRef_1.activeLayer.invert(); 
docRef_1.activeLayer.blendMode = BlendMode.COLORBLEND; 
docRef_1.activeLayer.opacity = 50;
docRef_1.activeLayer.merge(); 
//步骤十二  重定画布大小
var width = docRef_1.width; 
var height = docRef_1.height; 
if (width <= height) { var borderSize = Math.round(width * 0.15); } 
else { var borderSize = Math.round(height * 0.15); }
docRef_1.resizeCanvas(width + borderSize, height + borderSize); 
//步骤十三  增加边框
docRef_1.artLayers.add(); 
docRef_1.activeLayer.move(docRef_1.backgroundLayer, ElementPlacement.PLACEBEFORE); docRef_1.selection.selectAll(); 
docRef_1.selection.fill(white); 
docRef_1.selection.deselect(); 
docRef_1.layers[0].merge();
//步骤十四  添加黑色填充层，为添加阴影做好准备
docRef_1.artLayers.add();
docRef_1.activeLayer.move(docRef_1.backgroundLayer, ElementPlacement.PLACEBEFORE);
docRef_1.selection.selectAll();
docRef_1.selection.fill(black); 
docRef_1.selection.deselect(); 
//步骤十五  再次增加画布大小 ，适应图片任意角度旋转
var width = docRef_1.width; 
var height = docRef_1.height; 
var newSize = Math.round(Math.sqrt(width * width + height * height)) + borderSize; 
docRef_1.resizeCanvas(newSize, newSize); 
//步骤十六  对黑色填充层施加高斯模糊滤镜，阴影展现
docRef_1.activeLayer.applyGaussianBlur(borderSize / 3);
docRef_1.activeLayer.opacity = 50; 
//步骤十七  对图片图层和阴影图层随机旋转相同角度，合并
var angle = Math.round(Math.random() * 40) - 20; 
docRef_1.activeLayer.rotate(angle, AnchorPosition.MIDDLECENTER); 
docRef_1.activeLayer = docRef_1.layers[0]; 
docRef_1.activeLayer.rotate(angle,AnchorPosition.MIDDLECENTER); 
docRef_1.activeLayer.merge();






