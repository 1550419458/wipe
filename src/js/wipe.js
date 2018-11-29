/*
author: yas
data：	2018-11-19
email:
*/
function Wipe(obj){
	this.conID = obj.id;
	this.canvas = document.getElementById(this.conID);
	this.context = this.canvas.getContext("2d");
	this._w = this.canvas.width;
	this._h = this.canvas.height;
	this.coverType = obj.coverType;
	this.color = obj.color || "#666";
	this.imgUrl = obj.imgUrl;
	this.backImgUrl = obj.backImgUrl;
	this.radius = obj.radius;
	this.moveX = 0;
	this.moveY = 0;
	this.isMouseDown = false;
	this.callback = obj.callback;
	this.transpercent = obj.transpercent;
	this.drawMask();
	this.drawMove();
}
//drawT()画点和画线函数
//参数：如果只有两个参数，函数功能画圆，x1,y1即圆的中心坐标 
//如果传递四个参数，函数功能画线，x1,y1为起始坐标，x2,y2为结束坐标
Wipe.prototype.drawZio = function(x1,y1,x2,y2){
	if(arguments.length === 2){
		this.context.save();
		this.context.beginPath();
		this.context.arc(x1,y1,this.radius,0,2*Math.PI);
		this.context.fillStyle = "rgba(255,0,0,255)";
		this.context.fill();
		this.context.restore();
	}else if(arguments.length === 4){
		this.context.save();
		this.context.beginPath();
		this.context.moveTo(x1,y1);
		this.context.lineTo(x2,y2);
		this.context.lineWidth = this.radius*2;
		this.context.lineCap = "round";
		this.context.stroke();
		this.context.restore();
	}else{
		return false;
	}
}

Wipe.prototype.drawMask = function(){
	if(this.coverType === "color"){
		this.context.fillStyle = this.color;
		this.context.fillRect(0,0,this._w,this._h);
		this.context.globalCompositeOperation = "destination-out";
	}else if(this.coverType === "image" ){
		var img = new Image();
		var that = this;
		img.src = this.imgUrl;
		img.onload = function(){
			that.context.drawImage(img,0,0,img.width,img.height,0,0,that._w,that._h);
			that.context.globalCompositeOperation="destination-out";
		}
	}
}

Wipe.prototype.clearRect = function(){
	this.context.clearRect(0,0,this._w,this._h);
}

Wipe.prototype.getTransparencyPercent = function(){
	var t = 0;
	var imgData = this.context.getImageData(0,0,this._w,this._h);
	for(var i=0; i<imgData.data.length; i+=4){
		var a = imgData.data[i+3];
		if(a === 0){
			t++;
		}
	}

	this.percent = (t / (this._w*this._h))*100;
	console.log("透明点的个数：" + t);
	console.log("占总面积" + Math.ceil(this.percent) + "%");
	return Math.round(this.percent);
}


Wipe.prototype.drawMove = function(){
	this.device = (/android|webos|iPhone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
	console.log(this.device);
	var down = this.device?"touchstart":"mousedown";
	var move = this.device?"touchmove":"mousemove";
	var up = this.device?"touchend":"mouseup";
	var	allTop = this.canvas.offsetTop;
	var allLeft = this.canvas.offsetLeft;
	var scrollTop;
	var scrollLeft;
	var tobj = this.canvas;
	while(tobj = tobj.offsetParent){
		allTop += tobj.offsetTop;
		allLeft += tobj.offsetLeft;
	}
	var that = this;
	this.canvas.addEventListener(down,function(evt){
		var event = evt || window.event;
		scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
		that.moveX = that.device?event.touches[0].clientX - allLeft + scrollLeft :event.clientX - allLeft + scrollLeft;
		that.moveY = that.device?event.touches[0].clientY - allTop + scrollTop :event.clientY - allTop + scrollTop;
		that.drawZio(that.moveX,that.moveY);
		that.isMouseDown = true;
	},false);

	this.canvas.addEventListener(move,function(evt){
		if(!that.isMouseDown){
			return false;
		}else{
			var event = evt || window.event;
			event.preventDefault();
			scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
			var x2 = that.device?event.touches[0].clientX - allLeft + scrollLeft :event.clientX - allLeft + scrollLeft;
			var y2 = that.device?event.touches[0].clientY - allTop + scrollTop :event.clientY - allTop + scrollTop;
			that.drawZio(that.moveX,that.moveY,x2,y2);
			that.moveX = x2;
			that.moveY = y2;
		}
	},false);

	var percent;
	this.canvas.addEventListener(up,function(){
		that.isMouseDown = false;
		var tha = that;
		setTimeout(function(){
			percent = tha.getTransparencyPercent();
		},500);
		clearTimeout();
		tha.callback.call(null,percent);	//等同于null
		if(percent > tha.transpercent){
			tha.clearRect();
		}
	},false);
}