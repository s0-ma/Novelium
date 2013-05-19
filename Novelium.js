/*Novelium.js*/

var nv_storage;
var nv_audio;
var nv_window; 
var nv_scripter;

var nv_fromStart;
var nv_fromContinue;//0:autosave,1,2,3:save


var Nv_Init = function(){
//プラットフォーム判別
	var isTiApp;
	if(navigator.userAgent.indexOf("Titanium") != -1){
		isTiApp = true;
	}else{
		isTiApp = false;
	}
//Novelium Objects
	nv_storage = new Nv_Storage(isTiApp);
	nv_audio = new Nv_Audio(isTiApp);
	nv_window = new Nv_Window(isTiApp);
	nv_scripter = new Nv_Scripter();

	nv_window.setFlexibleWindow();
};

var Nv = (function(){
	this.isBrowser = false;
	this.browserName = "";
	this.isTiApp = false;
    this.isTideSDK = false;
    this.isAdobeAir = false;

	//プラットフォーム判別
	if(navigator.userAgent.indexOf("Titanium") != -1){
		this.isTiApp = true;
	}else if(navigator.userAgent.indexOf("tide-sdk") != -1){
        this.isTideSDK = true;
	}else if(navigator.userAgent.indexOf("AdobeAIR") != -1){
        this.isAdobeAir = true;
	}else{
		this.isBrowser = true;
		//ブラウザ判別
		var userAgent = window.navigator.userAgent.toLowerCase();
		if (userAgent.indexOf('opera') != -1) {
			this.browserName = 'opera';
		} else if (userAgent.indexOf('msie') != -1) {
			this.brouserName = 'ie';
		} else if (userAgent.indexOf('chrome') != -1) {
			this.browserName = 'chrome';
		} else if (userAgent.indexOf('safari') != -1) {
			this.browserName = 'safari';
		} else if (userAgent.indexOf('gecko') != -1) {
			this.browserName = 'gecko';
		} else {
			this.browserName = 'unknown';
		}
	}

    //HTML5対応状況確認
    if(!document.createElement('canvas').getContext){
        alert("This browser seems not to support HTML5(canvas)!")
    }else if(!document.createElement('audio').canPlayType){
        alert("This browser seems not to support HTML5(audio)!")
    }

	return this;
})();
