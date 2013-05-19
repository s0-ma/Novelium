//音響関連の基本クラス。
var Nv_Sound = function(isTiApp){
		var self = this;

		//public property
		this.sound;
		this.volume;

		//private property
		var canPlayOgg;
		var canPlayMp3;
		var canPlay;
		var audioType;

		//constructer
		//webブラウザの場合
		if(!isTiApp){
				/*html5*/
				self.sound = new Audio("");
				canPlayMp3 = self.sound.canPlayType("audio/mp3") != "";
				canPlayOgg = self.sound.canPlayType("audio/ogg") != "";
				canPlay = canPlayOgg || canPlayMp3;

				if(!canPlay){
						alert("このブラウザでは音楽再生に対応していません.正しく動作しない可能性があります.");
				}
				if(canPlayMp3){
						audioType = "mp3";
				}else if(canPlayOgg){
						audioType = "ogg";
				}
		}

		//method
		this.setPath = function(path){
				if(isTiApp){
						self.sound = Titanium.Media.createSound("app://" + path + ".mp3");
				}else{
						self.sound.src = path + "." + audioType;
				}
		};

		this.play = function(){
				if(isTiApp){
						self.sound.play();
				}else{
						self.sound.play();
				}
		};

		this.stop = function(){
				if(isTiApp){
						self.sound.stop();
				}else{
						self.sound.pause();
				}
		};

		this.setVolume = function(vol){
				if(isTiApp){
						self.sound.setVolume(vol);
				}else{
						self.sound.volume = vol;
				}
		};

		this.getVolume = function(){
				if(isTiApp){
						return self.sound.getVolume();
				}else{
						return self.sound.volume;
				}
		}

		this.loopEvent = function(){
            self.sound.currentTime = 0;
            self.play();
		}

		this.unloopEvent = function(){
		}

		this.setLoop = function(bool){
				if(isTiApp){
						self.sound.setLooping(bool);
				}else{
		// http://stackoverflow.com/questions/3273552/html-5-audio-looping
						if(bool){
                            // for Firefox:
							self.sound.removeEventListener('ended', self.unloopEvent);
							self.sound.addEventListener('ended', self.loopEvent, false);
                            // for Chrome:
                            // self.sound.loop = true;
						}else{
                            // for Firefox:
							self.sound.removeEventListener('ended', self.loopEvent);
							self.sound.addEventListener('ended', self.unloopEvent, false);
                            // for Chrome:
                            // self.sound.loop = false;
						}
				}
		};

		this.onComplete = function(callback){
				if(isTiApp){
						self.sound.onComplete(callback);
				}else{

				}

		};

		this.getObject = function(){
				return self.sound;
		};

};


//アプリ中の音楽はこのクラスで操作する。
var Nv_Audio = function(isTiApp){
		var self = this;

		//publicプロパティ
		this.BGM_path;

		//private propert
		var inFadeIn = false;
		var _bgm_fadein_timer;
		var _bgm_fadein_vol_end;
		var inFadeOut = false;
		var _bgm_fadeout_timer;
		var _bgm_fadeout_vol_end;
		var _bgm_fadeout_tmp_vol;
		var isEffect1Playing = false;

		//コンストラクタ
		this.audio_bgm = new Nv_Sound(isTiApp);
		this.audio_effect1 = new Nv_Sound(isTiApp);
		this.audio_effect2 = new Nv_Sound(isTiApp);

		//メソッド
		this.BGM_setPath = function(path){
				self.BGM_Path = path;
				self.audio_bgm.setPath(path);
		};

		this.BGM_getPath = function(){
				return self.BGM_Path;
		};

		this.BGM_setVolume = function(vol){
				self.audio_bgm.setVolume(vol);
		};
		this.BGM_play = function(){
				self.audio_bgm.play();
		};
		this.BGM_stop = function(){

				if(inFadeOut){
						clearTimeout(_bgm_fadeout_timer);
				}else if(inFadeIn){
						clearTimeout(_bgm_fadein_timer);
				}

				self.audio_bgm.stop();
		};
		this.BGM_fadeIn = function(time,vol_end){
				inFadeIn = true;
				self.audio_bgm.setVolume(0);
				self.audio_bgm.play();

				if(isTiApp){
						//0からvol_endまで5段階で音量を上げる。
						_bgm_fadein_vol_end = vol_end;
						_bgm_fadein_timer = setInterval(function(){self._up()},parseFloat(time)/5.);
				}else{
						$(self.audio_bgm.getObject()).animate(
										{ volume: vol_end }, 
										{easing: "swing",duration: time}
										);
				}
		};
		this._up = function(){
				self.audio_bgm.setVolume(self.audio_bgm.getVolume() + parseFloat(_bgm_fadein_vol_end)/5.);
				if(self.audio_bgm.getVolume() >= _bgm_fadein_vol_end){
						clearTimeout(_bgm_fadein_timer);
						inFadeIn = false;
				}
		};


		this.BGM_fadeOut = function(time){
				inFadeOut = true;
				if(isTiApp){
						//現状から0まで5段階で音量を上げる。
						_bgm_fadeout_tmp_vol = self.audio_bgm.getVolume();
						_bgm_fadeout_timer = setInterval(function(){self._down()},parseFloat(time)/5.);
				}else{
						$(self.audio_bgm.getObject()).animate(
										{ volume: 0 }, 
										{easing: "swing",duration: time,callback: function(){self.audio_bgm.stop(); }
										});
				}
		};
		this._down = function(){
				self.audio_bgm.setVolume(self.audio_bgm.getVolume() - parseFloat(_bgm_fadeout_tmp_vol)/5.);
				if(self.audio_bgm.getVolume() <= 0 || inFadeIn){
						clearTimeout(_bgm_fadeout_timer);
						self.audio_bgm.stop();
						inFadeOut = false;
				}
		};


		this.Effect1_setPath = function(path){
				self.audio_effect1.setPath(path);
		};
		this.Effect1_setVolume = function(vol){
				self.audio_effect1.setVolume(vol);
		};
		this.Effect1_play = function(){
				if(self.isEffect1Playing == true){
						self.audio_effect1.stop();
				}
				self.audio_effect1.onComplete(function(){self.audio_effect1.stop();});
				self.audio_effect1.play();
		};
		this.Effect1_stop = function(){
				self.audio_effect1.stop();
				self.isEffect1Playing = false;
		};

		this.Effect2_setPath = function(path){
				self.audio_effect1.setPath(path);
		};
		this.Effect2_setVolume = function(vol){
				self.audio_effect2.setVolume(vol);
		};
		this.Effect2_play = function(){
				self.audio_effect2.stop();
				self.audio_effect2.onComplete(function(){self.audio_effect2.stop();});
				self.audio_effect2.play();
		};
		this.Effect2_stop = function(){
				self.audio_effect2.stop();
		};

};

