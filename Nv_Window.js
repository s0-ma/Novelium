var Nv_Window = function(isTiApp){

//public property
	this.isTiApp = isTiApp;

//private property
	var self = this;
	var win;

//constructor
	if(self.isTiApp){
		win = Titanium.UI.getCurrentWindow();
	}else{

	}

	this.disableDrag = function(){
		window.ondrag = function(){return false;};
		window.ondragstart = function(){return false;};
		window.ondragend = function(){return false;};
		//window.oncontextmenu = function(){return false;};
	};

//method
	this.getWindowWidth = function(){
		if(self.isTiApp){
			return win.getWidth();
		}else{
			return $(window).width();
		}
	};
	this.getWindowHeight = function(){
		if(self.isTiApp){
			return win.getHeight();
		}else{
			return $(window).height();
		}
	};
	this.setWindowWidth = function(width){
		if(self.isTiApp){
			win.setWidth(width);
		}else{

		}
	};
	this.setWindowHeight = function(height){
		if(self.isTiApp){
			win.setHeight(height);
		}else{

		}
	};
	this.zoom = function(ratio){
		if(self.isTiApp){
			document.body.style.zoom = ratio;
		}else{
			document.body.style.zoom = ratio;
			$("#container").css("-moz-transform","scale("+ratio+")");
		}
	};

	this.setFullScreen = function(){
		if(self.isTiApp){
			win.setFullscreen();
		}else{

		}
	};

	this.setFlexibleWindow = function(){
		//windowサイズに合わせて拡大縮小
		window.onload = function(){
			(self.getWindowWidth() * 576 < self.getWindowHeight() * 1024) ? self.zoom(self.getWindowWidth() /1024) : self.zoom(self.getWindowHeight() / 576);
		};
		window.onresize = function(){
			//console.log(self.getWindowWidth() + "\t" + self.getWindowHeight());
			(self.getWindowWidth() * 576 < self.getWindowHeight() * 1024) ? self.zoom(self.getWindowWidth() /1024) : self.zoom(self.getWindowHeight() / 576);
		};
	};

	this.cursorAutoHide = function(limit_time){
		$("document").ready(function(){
				document.body.style.cursor="url(system/dummy1x1.png),default";
				document.body.style.cursor="url(system/mousecursor.png),default";
		});
		var count = 0;
		var flag_after_change = false;
		window.onmousemove = function(){
			count = 0;
			if(flag_after_change){
				flag_after_change = false;

			}else{
				document.body.style.cursor="url(system/mousecursor.png),default";
				flag_after_change = true;
			}
		};

		setTimer();

		function setTimer(){
			count += 1;
			if (count > limit_time/1000) {
				document.body.style.cursor="url(system/dummy1x1.png),default";
				flag_after_change = true;
				count = 0;
				mousemove_count = 0;
			}
			setTimeout(setTimer,1000);
		};
	}

};
