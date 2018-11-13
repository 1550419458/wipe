// 获取canvas上下文
var canvas = document.getElementById("cas");
var context = canvas.getContext("2d");
var _w = canvas.width,_h = canvas.height,t=0;
var radius = 20;	//涂抹的半径
var moveX;
var moveY;
var isMouseDown = false;	//表示鼠标的状态，是否按下，默认为未按下false
// device保存设备类型，如果是移动端则为true，PC端为false
var device = (/android|webos|iPhone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
console.log(device);
var down = device?"touchstart":"mousedown";
var move = device?"touchmove":"mousemove";
var up = device?"touchend":"mouseup";

// 生成画布上的遮罩，默认为颜色#666
function drawMask(context){
	context.fillStyle = "#666";
	context.fillRect(0,0,_w,_h);
	context.globalCompositeOperation = "destination-out";
}

// 在画布上画半径为30的圆
function drawPoint(context){
	console.log("传递的实参个数：" + arguments.length);
	context.save();
	context.beginPath();
	context.arc(moveX,moveY,radius,0,2*Math.PI);
	context.fillStyle = "rgba(255,0,0,255)";
	context.fill();
	context.restore();
}

function drawLine(context,x1,y1,x2,y2){
	console.log("传递的实参个数：" + arguments.length);
	// 保存当前绘图状态
	context.save();
	// 以原点为起点，绘制一条线
	context.beginPath();
	context.moveTo(x1,y1);
	context.lineTo(x2,y2);
	// 增加一些样式，加宽线条
	context.lineWidth = radius*2;
	// 连接点改成圆角效果
	context.lineCap = "round";
	context.stroke();
	// 恢复原有绘图状态
	context.restore();
}

// function drawZio(context,x1,y1,x2,y2){
// 	console.log("传递的实参个数：" + arguments.length);
// 	context.save();
// 	context.beginPath();
// 	if(arguments.length === 3){
// 		context.arc(moveX,moveY,radius,0,2*Math.PI);
// 		context.fillStyle = "rgba(255,0,0,255)";
// 		context.fill();
// 	}else if(arguments.length === 5){
// 		context.moveTo(x1,y1);
// 		context.lineTo(x2,y2);
// 		// 增加一些样式，加宽线条
// 		context.lineWidth = radius*2;
// 		// 连接点改成圆角效果
// 		context.lineCap = "round";
// 		context.stroke();
// 	}
// 	context.restore();
// }

canvas.addEventListener(down,function(evt){
	var event = evt || window.event;
	// if(device === true){
	// 	moveX = event.touches[0].clientX;
	// 	moveY = event.touches[0].clientY;
	// }else{
	// 	moveX = event.clientX;
	// 	moveY = event.clientY;
	// }
	moveX = device?event.touches[0].clientX:event.clientX;
	moveY = device?event.touches[0].clientY:event.clientY;
	drawPoint(context,moveX,moveY);
	// drawZio(context,moveX,moveY);
	isMouseDown = true;
},false);

// 在画布上监听自定义事件“mousedown”，调用drawPoint函数
// canvas.addEventListener("mousedown",function(evt){
// 	var event = evt || window.event;
// 	// 获取鼠标在视口的坐标，传递参数到drawPoint
// 	moveX = event.clientX;
// 	moveY = event.clientY;

// 	drawPoint(context,moveX,moveY);
// 	isMouseDown = true;
// },false);

// canvas.addEventListener("touchstart",function(evt){
// 	var event = evt || window.event;
// 	// 获取手指在视口的坐标，传递参数到drawPoint
// 	moveX = event.touches[0].clientX;
// 	moveY = event.touches[0].clientY;

// 	drawPoint(context,moveX,moveY);
// 	isMouseDown = true;
// },false);

// canvas.addEventListener("touchmove",fn2,false);


// canvas.addEventListener("mousemove",fn1,false);

canvas.addEventListener(move,fn1,false);

function fn1(evt){
	var event = evt || window.event;
	event.preventDefault();
	if(isMouseDown === true){
		// if(device === true){
		// 	var x2 = event.touches[0].clientX;
		// 	var y2 = event.touches[0].clientY;
		// }else{
		// 	var x2 = event.clientX;
		// 	var y2 = event.clientY;
		// }
		x2 = device?event.touches[0].clientX:event.clientX;
		y2 = device?event.touches[0].clientY:event.clientY;
		drawLine(context,moveX,moveY,x2,y2);
		// drawZio(context,moveX,moveY,x2,y2);
		moveX = x2;
		moveY = y2;
	}
}

// function fn2(evt){
// 	if(!isMouseDown){
// 		return false;
// 	}else{
// 		var event = evt || window.event;
// 		event.preventDefault();
// 		var x2 = event.touches[0].clientX;
// 		var y2 = event.touches[0].clientY;
// 		drawLine(context,moveX,moveY,x2,y2);
// 		moveX = x2;
// 		moveY = y2;
// 	}
// }

// canvas.addEventListener("touchend",function(evt){
// 	isMouseDown = false;
// 	if(getTransparencyPercent(context) > 50){
// 		alert("超过50%");
// 		clearRect(context);
// 	}
// },false);

canvas.addEventListener(up,function(){
	// canvas.removeEventListener("mousemove",fn1,false);
	isMouseDown = false;
	if(getTransparencyPercent(context) > 50){
		alert("超过50%");
		clearRect(context);
	}
},false);

function clearRect(context){
	context.clearRect(0,0,_w,_h);
}

function getTransparencyPercent(context){
	var imgData = context.getImageData(0,0,_w,_h);
	for(var i=0; i<imgData.data.length; i+=4){
		var a = imgData.data[i+3];
		if(a === 0){
			t++;
		}
	}

	var percent = (t / (_w*_h))*100;
	console.log("透明点的个数：" + t);
	console.log("占总面积：" + Math.ceil(percent) + "%");
	// return percent.toFixed(2);	//截取小数点两位
	return Math.round(percent);
}

window.onload = function(){
	drawMask(context);
};