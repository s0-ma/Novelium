/*Novelium.ts*/

module Novelium {
	var isBrowser: Boolean = false;
    var isBrowser: Boolean = false;
    var browserName: string = "";
    var isTiApp: Boolean = false;
    var isTideSDK: Boolean = false;
    var isAdobeAir: Boolean = false;

    //プラットフォーム判別
    if(navigator.userAgent.indexOf("Titanium") != -1){
    	isTiApp = true;
    }else if(navigator.userAgent.indexOf("tide-sdk") != -1){
        isTideSDK = true;
    }else if(navigator.userAgent.indexOf("AdobeAIR") != -1){
        isAdobeAir = true;
    }else{
    	isBrowser = true;
    	//ブラウザ判別
    	var userAgent = window.navigator.userAgent.toLowerCase();
    	if (userAgent.indexOf('opera') != -1) {
    		browserName = 'opera';
    	} else if (userAgent.indexOf('msie') != -1) {
    		browserName = 'ie';
    	} else if (userAgent.indexOf('chrome') != -1) {
    		browserName = 'chrome';
    	} else if (userAgent.indexOf('safari') != -1) {
    		browserName = 'safari';
    	} else if (userAgent.indexOf('gecko') != -1) {
    		browserName = 'gecko';
    	} else {
    		browserName = 'unknown';
    	}
    }

    //HTML5対応状況確認
    if(!document.createElement('canvas').getContext){
        alert("This browser seems not to support HTML5(canvas)!");
    }else if(!document.createElement('audio').canPlayType){
        alert("This browser seems not to support HTML5(audio)!");
    }
	
	module test{
		function hoge() : void{
			alert(browserName);
		}
	}

}


//var nv_storage;
//var nv_audio;
//var nv_window; 
//var nv_scripter;
//
//var nv_fromStart;
//var nv_fromContinue;//0:autosave,1,2,3:save
//
//
//var Nv_Init = function(){
////プラットフォーム判別
//	var isTiApp;
//	if(navigator.userAgent.indexOf("Titanium") != -1){
//		isTiApp = true;
//	}else{
//		isTiApp = false;
//	}
////Novelium Objects
//	nv_storage = new Nv_Storage(isTiApp);
//	nv_audio = new Nv_Audio(isTiApp);
//	nv_window = new Nv_Window(isTiApp);
//	nv_scripter = new Nv_Scripter();
//
//	nv_window.setFlexibleWindow();
//};
