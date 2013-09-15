
var Nv_Scripter = function(){
	var self = this;
	var dd = new Date();
	var dfdObj;//同期処理管理用Object.実態はglobalEvalの実行直前に新たに作成する。
	var dfd_num = 0;
	this.dfdObj = function(){
			return dfdObj;
	}

	/*現在のスクリプトの位置*/
	this.file;
	this.para;
	this.sent;
	/*データ*/
	this.script_data;//ファイルの中身全部
	this.script_para;//空行で区切られた段落
	this.script_sent;//行
	/*設定*/
	this.textArea;
	this.nameArea;
	this.endImgPath;
	this.loadingImgPath;
	this.speed;
	this.waittime;

	/*ログ成形用変数*/
	this.log_namelength_max = 4;

	/*内部状態*/
	this.isLocked;
	this.isPrinting;
	this.isProcessing;
	this.auto;
	this.count;
	this.text_output;
	
	this.init = function(file,para){
		self.sent = 0;
		self.isLocked = true;
		self.isPrinting = false;
		self.isProcessing = false;
		self.auto = false;
		self.count = 0;
		self.text_output = "";

		self.file = file;
		self.para = para;
		$.get(self.file,null,function(data){
			self.raw_data = data + "";
			self.script_para = self.raw_data.split("\n\n");
			self.script_sent = new Array(self.script_para.length);
			var i,j;
			for(i=0;i<self.script_sent.length;i++){
			    self.script_sent[i] = self.script_para[i].split("\n");
			}
			//ファイルの初めの段落は、必ずいつでも実行
			var tmp_js = "";
			dfdObj = new jQuery.Deferred();//同期処理の管理を行うobjectを生成
			dfd_num = 0;//処理待ちをする処理の数
			for(i=0;i<self.script_sent[0].length;i++){
				if(self.script_sent[0][i].indexOf(".",0) == 0){
					if(self.script_sent[0][i].indexOf(".//",0) != 0){
						tmp_js += self.script_sent[0][i].substring(1);
						dfd_num++;
					}
				}
			}
			//処理を行うと、終了時にNv_tag.js内のnv_scripter.dfdObj().notify()が呼ばれれて
			//以下が実行されるようcallbackとして登録
			dfdObj.progress(function(){
                                        
					dfd_num--;
					if(dfd_num==0){
						//console.log("0段落目読み込み終了");
						$("#scenario_curtain").css("display","none");
						self.setEnable(true);
						self.isProcessing = false;
						self.go();
					}
			});
			//ここで初めて、まとめて0段落目を実行
			jQuery.globalEval(tmp_js);
		});
	};
	this.setEnable = function(bool){
		self.isLocked = !bool;
	};
	this.setAutomode = function(time){
		self.auto = true;
		self.waittime = time;
		self.go();
	}
	this.unsetAutomode = function(){
		self.auto = false;
		self.isLocked = false;
	}
	this.isAutomode = function(){
		return self.auto;
	}
	this.setPara = function(para){
		self.para = para;
	};
	this.setTextSpeed = function(speed){
		self.speed = speed;
	};
	this.setTextArea = function(id){
		self.textArea = id;
	};
	this.setNameArea = function(id){
		self.nameArea = id;
	};
	this.setEndImg = function(path){
		self.endImgPath = path;
	};
	this.setLoadingImg = function(path){
		self.loadingImgPath = path;
	};

	this.getPresentText = function(){
		var text = "";
		var i;
		for(i = 0; i < self.script_sent[self.para-1].length ; i++){
		    if(self.script_sent[self.para-1][i].indexOf(".",0) != 0){
		    	text += self.script_sent[self.para-1][i].replace("&","<br>") + "<br>";
			}
		}
		return text;
	};

	this.setLogNameLength = function(num){
		self.log_namelength_max = num;//半角換算
	}

	this.getLog = function(){
		var log_text = "";
		var i,j,k;
		if(self.isPrinting || (self.count != 0)){
		    j = self.para;
		}else{
		    j = self.para - 1;
		}
		//ログ出力の整形
		log_name = "";
		log_sent = "";
		log_isNewLine = false;//の状態が会話(conversation)
		log_isPrevSpeaker = "";//前の状態の話者(地の文なら"")
		for(i=0;i<j;i++){
			for(k = 0; k < self.script_sent[i].length ; k++){
			    if(self.script_sent[i][k].indexOf(".",0) != 0){
					//会話文
					if(self.script_sent[i][k].indexOf("%",0) == 0){
						log_name = self.script_sent[i][k].split(" ",2)[0].substring(1);
						//log_sent = self.script_sent[i][k].split(" ",2)[1];
						//log文章の改行処理
						log_sent_base = self.script_sent[i][k].split(" ",2)[1];
						if(log_sent_base.length < 30){
								log_sent = log_sent_base;
						}else{
								log_sent = "";
								log_sent += log_sent_base.substring(0,31) + "<br>";
								for(raw_num = 1; raw_num < (log_sent_base.length/31) ;raw_num++){
										if(raw_num != log_sent_base.length/31){
											log_sent += "　　　　　" + log_sent_base.substring(31*raw_num,31*(raw_num+1)) + "<br>";
										}else{
											log_sent += "　　　　　" + log_sent_base.substring(31*raw_num,31*(raw_num+1));
										}

								}
						}
						log_isNewLine = (log_isPrevSpeaker != log_name);
						log_isPrevSpeaker = log_name;

						//会話の最初(頭にカギカッコ有り)
						if(log_isNewLine){
								log_text += "<br>";
								for(l=0;l<self.log_namelength_max - log_name.length;l++){
										log_text += "　";
								}
								log_text +=  log_name + "" + log_sent.replace("&","") + "<br>";
						//会話継続中
						}else{
								for(l=0;l<self.log_namelength_max;l++){
										log_text += "　";
								}
								log_text +=  "　" + log_sent.replace("&","") + "<br>";
						}

					//地の文
					}else{
						log_name = "";
						//log_sent = self.script_sent[i][k];
						
						//log文章の改行処理
						log_sent_base = self.script_sent[i][k];
						if(log_sent_base.length < 30){
								log_sent = log_sent_base;
						}else{
								log_sent = "";
								log_sent += log_sent_base.substring(0,30) + "<br>";
								for(raw_num = 1; raw_num < (log_sent_base.length/31) ;raw_num++){
										if(raw_num != log_sent_base.length/31){
											log_sent += "　　　　　" + log_sent_base.substring(31*raw_num-1,31*(raw_num+1)-1) + "<br>";
										}else{
											log_sent += "　　　　　" + log_sent_base.substring(31*raw_num-1,31*(raw_num+1)-1);
										}

								}
						}

						log_isNewLine = (log_isPrevSpeaker != log_name);
						log_isPrevSpeaker = log_name;
					
						if(log_isNewLine){
								log_text += "<br>";
						}
						for(l=0;l<self.log_namelength_max - log_name.length;l++){
								log_text += "　";
						}
						log_text +=  log_name + "　" + log_sent.replace("&","") + "<br>";
					}

		    	}
			}
		}
		return log_text;
	};

	this.go = function(){

		//実効命令処理中は操作を受け付けない
		if(self.isProcessing == true){
				return true;
		}

		//同時実行されない様にロック
		//また、goを無効化する場合もここでreturn trueしている。
		if(self.isLocked == true){
			self.isPrinting = false;
			return true;
		}

		//これがあってオートモード開始
		if(self.auto==true){
			self.isLocked = true;
		}

		self.isLocked = true;
		self.isPrinting = true;

		/*表示処理の初期化*/
		if(self.sent == 0){
			self.count = 0;
			self.text_output = "";
			$(self.textArea).html("");
			$(self.nameArea).html("");
		}
		/*ループ*/
		_go();
	};

	function _go(){
		// 終端行なので終了処理。
		if(self.sent==self.script_sent[self.para].length){
			_end();

		/*終端行でなければ*/
		}else{
			/*"%"から始まれば、キャラ名を表示*/
			if(self.count==0 && self.script_sent[self.para][self.sent].indexOf("%",0) == 0){
				$(self.nameArea).html(self.script_sent[self.para][self.sent].split(" ")[0].substr(1));
				self.count += self.script_sent[self.para][self.sent].split(" ")[0].length + 1;
			}else if(self.count==0){
				$(self.nameArea).html("");
			}
			/* "."から始まる行は指示命令として解釈,実行*/
			if(self.script_sent[self.para][self.sent].indexOf(".",0) == 0){
				//コメント行は飛ばす
				if(self.script_sent[self.para][self.sent].indexOf(".//",0) == 0){
						self.sent++;
						_go();
						return true;
				}
				//1 Enterボタン抑制
				//self.setEnable(false);
				self.isProcessing = true;
				dfdObj = new jQuery.Deferred();
				//2 何も操作を受け付けない状態でEvalのみ実行
				jQuery.globalEval(self.script_sent[self.para][self.sent].substring(1));
				//4 callback関数で、Evalが終わったら、_goで次に進ませる。ここでEnterボタン復帰も同時に行う。
				dfdObj.progress(function(){
					self.sent++;
					_go();
					//self.setEnable(true);
					self.isProcessing = false;
				});
				//3 直後にreturn trueで関数自体は終了。
				return true;
			}


			//自動で文章が進んでいく場合、
			if(self.isPrinting && self.speed!=0){
			//以下の場合は文字送り中のクリック抑制。
			//if(true){
				//ここでスクリプト文章中のhtmlの解釈をする
				speed_factor = 1;
				if(self.script_sent[self.para][self.sent].substring(self.count).indexOf("、",0) == 0){
						speed_factor = 4;
						self.text_output += self.script_sent[self.para][self.sent].substr(self.count,1);
				}else if(self.script_sent[self.para][self.sent].substring(self.count).indexOf("。",0) == 0){
						speed_factor =  8;
						self.text_output += self.script_sent[self.para][self.sent].substr(self.count,1);
				}else if(self.script_sent[self.para][self.sent].substring(self.count).indexOf("<br>",0) == 0){
						self.text_output += "<br>";
						self.count += "<br>".length -1;
				}else if(self.script_sent[self.para][self.sent].substring(self.count).indexOf("&",0) == 0){
						self.text_output += "<br>";
						self.count += "&".length -1;
				}else if(self.script_sent[self.para][self.sent].substring(self.count).indexOf("<",0) == 0){
						var text_sub = self.script_sent[self.para][self.sent].substring(self.count);
						var tag = text_sub.substring(1,text_sub.indexOf(">",2) ); 
						var tag_cont = text_sub.substring(0,text_sub.indexOf("</"+tag+">",5) + 3+tag.length );
						self.text_output += tag_cont;
						self.count += tag_cont.length -1;
				}else{
						self.text_output += self.script_sent[self.para][self.sent].substr(self.count,1);
				}

				//テキストエリアに表示
				$(self.textArea).html(self.text_output);
				self.count++;
				//まだ次に文字があるなら、
				if(self.count < self.script_sent[self.para][self.sent].length){
					setTimeout(_go,(100-self.speed) * speed_factor);
				//終端なら、
				}else{
					self.sent++;
					_end();
				}
			//ずらずらと表示中にクリックされたら、全文表示
			}else{
				var i;
				var tmp = "";
				var tmp_js = [];
				//sent単位ですべてチェックする
				for(i=0;i<self.script_sent[self.para].length;i++){
					//実行文かどうかで場合分け
					if(self.script_sent[self.para][i].indexOf(".",0) != 0){
					
						//キャラ名表示部分無視
						if(self.script_sent[self.para][i].indexOf("%",0) == 0){
								//TODO ２つ以上の空白が含まれた段落があるとヤバイかも
								tmp += self.script_sent[self.para][i].split(" ")[1];
						//ただの文章はそのまま
						}else{
								tmp += self.script_sent[self.para][i].replace("&","<br>");
						}
					}else{
						//self.sent以降のコメントではない処理命令のみ実行させる。
						if(self.script_sent[self.para][i].indexOf(".//",0) != 0 && i>self.sent){
								tmp_js.push(self.script_sent[self.para][i].substring(1));
						}
					}
				}
				//ここでtmpをテキストエリアに表示
				//バグ対策。改行文字はhtml上ではspaceに変換されて表示されてしまうため
				$(self.textArea).html(tmp.replace("&","<br>"));

				//指示命令がない場合
				if(tmp_js.length == 0){
					self.sent = self.script_sent[self.para].length;
					_end();
				//指示命令がある場合
				}else{
						//1 Enterボタン抑制
						//self.setEnable(false);
						self.isProcessing = true;
						i = 0;
						var tmp_func = function(i){
								dfdObj = new jQuery.Deferred();
								jQuery.globalEval(tmp_js[i]);
								//4 callback関数で、次の行の命令を実行。
								//5 最後まで終わったら、_end処理。ここでEnterボタン復帰も同時に行う。
								dfdObj.progress(function(){
												if(i == tmp_js.length - 1){
														self.sent = self.script_sent[self.para].length;
														_end();
														//self.setEnable(true);
														self.isProcessing = false;
												}else{
														tmp_func(i+1);
												}
									});
						}
						//2 何も操作を受け付けない状態でEvalのみ実行
						tmp_func(0);
						//3 直後にreturn trueで関数自体は終了。
						return true;
				}
			}
		}
	};

	function _end(){
		//sent=lastならpara++ かつ 文字が表示されていれば（指示のみでなければ）endImage表示
		if(self.sent==self.script_sent[self.para].length){
			self.para++;
			self.sent = 0;
			if(self.count != 0){
					$(self.textArea).append("<img src=" + self.endImgPath +  " align='top' style='margin-left:10px;'>");
			}
		}
		self.count = 0;

		if(self.auto){
			setTimeout(self.go,self.waittime);
		}
		self.isLocked = false;
	};
	
	this.showSaveData = function(id){

	};
	
	this.save = function(id){
		save.set(id + "_time",dd.getFullYear() +"-"+ (dd.getMonth()+1) +"-"+ dd.getDate() +" "+ dd.getHours() +":"+ dd.getMinutes() + ":" + dd.getSeconds() );
		save.set(id + "_count",++tmp_savecount);
		save.set(id + "_playtime","未実装");
		save.set(id + "_text",self.getPresentText());

		save.set(id + "_page",self.file);
		save.set(id + "_para",self.para);
		//save.set(id + "_music",audio.BGM_getPath());
		save.set(id + "_display",$("#scenario_img").html().replace(/'/g,"\'\'"));
	};

	this.load = function(){

	};
}

