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

	//nv_window.setFlexibleWindow();
	nv_window.cursorAutoHide(3000);
};

var Nv = (function(){
	this.isBrowser = false;
	this.isTiApp = false;
	this.browserName = "";

	//プラットフォーム判別
	if(navigator.userAgent.indexOf("Titanium") != -1){
		//ブラウザかその他か
		this.isTiApp = true;
	}else{
		this.isTiApp = false;
		this.isBrowser = true;
		//ブラウザ判別
		var userAgent = window.navigator.userAgent.toLowerCase();
		if (userAgent.indexOf('opera') != -1) {
			this.browserName = 'opera';
			alert("現在、対応ブラウザはFirefoxのみとなっています。このブラウザでは正常にゲームをプレイすることはできません。Firefoxをインストールして下さい。\n\nFirefoxをインストールしたにも関わらずこの警告文が出る場合は、Readmeのトラブルシューティングをご覧下さい。");
		} else if (userAgent.indexOf('msie') != -1) {
			this.brouserName = 'ie';
			alert("現在、対応ブラウザはFirefoxのみとなっています。このブラウザでは正常にゲームをプレイすることはできません。Firefoxをインストールして下さい。\n\nFirefoxをインストールしたにも関わらずこの警告文が出る場合は、Readmeのトラブルシューティングをご覧下さい。");
		} else if (userAgent.indexOf('chrome') != -1) {
			this.browserName = 'chrome';
			alert("現在、対応ブラウザはFirefoxのみとなっています。このブラウザでは正常にゲームをプレイすることはできません。Firefoxをインストールして下さい。\n\nFirefoxをインストールしたにも関わらずこの警告文が出る場合は、Readmeのトラブルシューティングをご覧下さい。");
		} else if (userAgent.indexOf('safari') != -1) {
			this.browserName = 'safari';
			alert("現在、対応ブラウザはFirefoxのみとなっています。このブラウザでは正常にゲームをプレイすることはできません。Firefoxをインストールして下さい。\n\nFirefoxをインストールしたにも関わらずこの警告文が出る場合は、Readmeのトラブルシューティングをご覧下さい。");
		} else if (userAgent.indexOf('gecko') != -1) {
			this.browserName = 'gecko';
		} else {
			return false;
		}
	}

	return this;
})();
