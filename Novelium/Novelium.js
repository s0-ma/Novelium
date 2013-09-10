/*Novelium.ts*/
var Novelium;
(function (Novelium) {
    var isBrowser = false;
    var isBrowser = false;
    var browserName = "";
    var isTiApp = false;
    var isTideSDK = false;
    var isAdobeAir = false;

    if (navigator.userAgent.indexOf("Titanium") != -1) {
        isTiApp = true;
    } else if (navigator.userAgent.indexOf("tide-sdk") != -1) {
        isTideSDK = true;
    } else if (navigator.userAgent.indexOf("AdobeAIR") != -1) {
        isAdobeAir = true;
    } else {
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

    if (!document.createElement('canvas').getContext) {
        alert("This browser seems not to support HTML5(canvas)!");
    } else if (!document.createElement('audio').canPlayType) {
        alert("This browser seems not to support HTML5(audio)!");
    }

    var test;
    (function (test) {
        function hoge() {
            alert(browserName);
        }
    })(test || (test = {}));
})(Novelium || (Novelium = {}));
