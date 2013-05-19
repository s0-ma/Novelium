//現在Nv_HTML2CANVASはNv.HTML2CANCASに置き換えられています。
function Nv_HTML2CANVAS(canvas_id,html_id,callback){

	var fileArray = $(html_id).html().match(/[0-9a-zA-Z\/\:\-\_]*\.(png|jpg)/g);
	if(fileArray == null){
		fileArray = ["/bgimage/black.png"];
	}
	console.log(fileArray);
	var numMaterials = fileArray.length;
	var loadedCounter = 0;
	var imgObjArray = [];

	var canvas = $(canvas_id)[0];
	var ctx = canvas.getContext("2d");

	loadImges();
	

	function loadImges(){
		var img = new Image();
		img.src = fileArray[imgObjArray.length];
		//console.log(img.src);
		img.onload = function(){
			loadedCounter++;
			imgObjArray.push(img);
			if(numMaterials == loadedCounter){
				display();
			}else{
				loadImges();
			}
		}
	};

	function display(){
		for (var i in imgObjArray){
					var top;
					var left;
					var width;
					var height;
					try{
						var position = $("#" + fileArray[i].replace(/\//g,"").replace(/\./g,"")).position();
						top = position.top;
						left = position.left;
						width= $("#" + fileArray[i].replace(/\//g,"").replace(/\./g,"")).width();
						height = $("#" + fileArray[i].replace(/\//g,"").replace(/\./g,"")).height();
					}catch(e){
						top = 0;
						left = 0;
						width = 1024;
						height = 576;
					}
		//			console.log(top);
		//			console.log(left);
		//			console.log(width);
		//			console.log(height);
					ctx.drawImage(imgObjArray[i], 148./1024.*parseFloat(left), 83./576.*parseFloat(top),148./1024.*parseFloat(width),83./576.*parseFloat(height));
					imgObjArray[i] = null;
			}
			callback(canvas.toDataURL());
	};
}



Nv.HTML2CANVAS = function(canvas_id,html_id,callback){

	var isNull = false;

	var fileArray = [];//ファイルのパスが格納されている
	var tabIdArray = [];//jqueryのtab要素が入っている

	//背景
	tabIdArray.push($(html_id).find("div").attr("id"));
	try{
			fileArray.push( $(html_id).find("div").css("background-image").slice(4,-1) );
			// 上のは文字要素でないとsliceが使えない
			//img要素
			var imgtab = $(html_id).find("img");
			while(imgtab.attr("src") != undefined){
					tabIdArray.push(imgtab.attr("id"));
					fileArray.push( imgtab.attr("src") );
					//console.log(imgtab);
					imgtab = imgtab.next();
			}
	}catch(e){
		fileArray.push("/bgimage/black.png");
	}
	

	var numMaterials = fileArray.length;
	var loadedCounter = 0;
	var imgObjArray = [];

	var canvas = $(canvas_id)[0];
	var ctx = canvas.getContext("2d");

	loadImges();
	

	function loadImges(){
		var img = new Image();
		img.src = fileArray[imgObjArray.length];
		//console.log(img.src);
		img.onload = function(){
			loadedCounter++;
			imgObjArray.push(img);
			if(numMaterials == loadedCounter){
				display();
			}else{
				loadImges();
			}
		}
	};

	function display(){
		var canvas_width = $(canvas_id).width();
		var canvas_height = $(canvas_id).height();
		var html_width = $(html_id).width();
		var html_height = $(html_id).height();
	//	console.log(canvas_width);
	//	console.log(canvas_height);
	//	console.log(html_width);
	//	console.log(html_height);
		for (var i in imgObjArray){
					var top;
					var left;
					var width;
					var height;
					try{
						var position = $("#" + tabIdArray[i]).position();
						top = position.top;
						left = position.left;
						width= $("#" + tabIdArray[i]).width();
						height = $("#" + tabIdArray).height();
					}catch(e){
						top = 0;
						left = 0;
						width = 1024;
						height = 576;
					}
		//			console.log(top);
		//			console.log(left);
		//			console.log(width);
		//			console.log(height);
		//
					
					ctx.drawImage(imgObjArray[i],
								   	canvas_width/2/html_width*parseFloat(left),
								   	83./html_height*parseFloat(top),
									canvas_width/2/html_width*parseFloat(width),
									83./html_height*parseFloat(height)
									);
					imgObjArray[i] = null;
			}
			callback(canvas.toDataURL());
	};
}
