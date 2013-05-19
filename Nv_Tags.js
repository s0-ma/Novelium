/***********************重要************************
 *scriptファイル(Chap1.txt etc.)から呼び出す関数は
 *必ず処理終了時に
 *
 * 			nv_scripter.dfdObj().resolve();
 *
 * というおまじないをいれること。
 * 0段落目で実行されるものは
 *
 * 			nv_scripter.dfdObj().notify();
 *
 * この関数が実行されるまで、テキストの続きは待機状態に
 * なっています。つまり、fadeinなどの時間がかかる処理の
 * 場合はfadeinが完了したときに上記関数を実行することで、
 * それまでテキストの進行を(同期処理っぽく)止めることが
 * できます。
 *
 * by s0_ma
 ***************************************************/


var Nv_Tags = new Object();

/**********Nv_SYS**********/
Nv_Tags.Sys = new Object();

Nv_Tags.Sys.delay = function(time,func){
	setTimeout(func,time);
	nv_scripter.dfdObj().notify();
};

Nv_Tags.Sys.click = function(){
	nv_scripter.go();
	nv_scripter.dfdObj().notify();
};

Nv_Tags.Sys.enable = function(bool){
	nv_scripter.setEnable(bool);
	nv_scripter.dfdObj().notify();
};

Nv_Tags.Sys.jump = function(filename){
	//TODO 0段落目に指示命令が一つも無いと動作しないバグ有り。
	nv_scripter.init(filename,1);
	//nv_scripter.dfdObj().notify();
}

/**********Nv_DISP**********/
Nv_Tags.Disp = new Object();

Nv_Tags.Disp.fadeOut = function(time){
	if(nv_scripter.isAutomode()){
		$("#scenario_img").hide();
	nv_scripter.dfdObj().notify();
	}else{
		$("#scenario_img").fadeOut(time,function(){nv_scripter.dfdObj().notify();});
	}
};

Nv_Tags.Disp.fadeIn = function(time){
	if(nv_scripter.isAutomode()){
		$("#scenario_img").show();
	nv_scripter.dfdObj().notify();
	}else{
		$("#scenario_img").fadeIn(time,function(){nv_scripter.dfdObj().notify();});
	}
};

Nv_Tags.Disp.shake_v = function(dy,time){
	var timer = setInterval(function(){
					$("#layer_scenario_main").animate({ top: -dy }, 75).animate({ top: dy }, 75);
				},150);
	nv_scripter.dfdObj().notify();
	setTimeout(function(){
					clearInterval(timer);
					$("#layer_scenario_main").animate({ top: 0 }, 75);
				},time);
};

Nv_Tags.Disp.shake_h = function(dx,time){
	var timer = setInterval(function(){
					$("#layer_scenario_main").animate({ left: -dx }, 75).animate({left: dx }, 75);
				},150);
	nv_scripter.dfdObj().notify();
	setTimeout(function(){
					clearInterval(timer);
					$("#layer_scenario_main").animate({ left: 0 }, 75);
				},time);
};

/**********SOUND**********/
Nv_Tags.Audio = new Object();

Nv_Tags.Audio.bgm_play = function(path){
	nv_scripter.dfdObj().notify();
	nv_audio.BGM_setPath(path);
	nv_audio.BGM_setVolume(nv_storage.get("global.bgm")/100);
	nv_audio.BGM_play();
};

Nv_Tags.Audio.bgm_stop = function(){
	nv_scripter.dfdObj().notify();
	nv_audio.BGM_stop();
};

Nv_Tags.Audio.se_play = function(path){
	nv_audio.Effect1_setPath(path);
	nv_audio.Effect1_setVolume(nv_storage.get("global.effect")/100);
	nv_audio.Effect1_play();
	nv_scripter.dfdObj().notify();
}

//werfoo:SE stop
Nv_Tags.Audio.se_stop = function(){
	nv_audio.Effect1_stop();
	nv_scripter.dfdObj().notify();
};

// Kaede: BGM FadeOut
Nv_Tags.Audio.bgm_fadeout = function(milliseconds){
	nv_scripter.dfdObj().notify();
	nv_audio.BGM_fadeOut(milliseconds);
};

// Kaede: BGM FadeIn
Nv_Tags.Audio.bgm_fadein = function(path, milliseconds){
	nv_scripter.dfdObj().notify();
	nv_audio.BGM_setPath(path);
	nv_audio.BGM_setVolume(nv_storage.get("global.bgm")/100);
	nv_audio.BGM_fadeIn(milliseconds);
};

// Kaede: BGM SetLoop
Nv_Tags.Audio.bgm_setloop = function(bool){
	nv_scripter.dfdObj().notify();
	nv_audio.audio_bgm.setLoop(bool)
};


/**********BG**********/
Nv_Tags.BG = new Object();

Nv_Tags.BG.color = function(color){
		$("#bg").css("background-image","none");
		$("#scenario_img").css("background-color",color);
	nv_scripter.dfdObj().notify();
}

Nv_Tags.BG.set = function(path){
	var img = new Image();
	img.src = path;
	img.onload = function(){
		$("#bg").remove();
		$("#scenario_img").prepend("<div id=\"bg\" style=\"display:none;background-image:url(\'" + path + "\'); background-size:100% 100%; width:100%; height:100%; top:0;left:0;\"></div>");
		$("#bg").fadeIn("fast",function(){nv_scripter.dfdObj().notify();});
	}
};

/**********Trans**********/
Nv_Tags.Trans = new Object();
Nv_Tags.Trans.out_left = function(){
	$("#scenario_curtain").css("transition","0.5s background-color linear 1s, 1s height linear");
	nv_scripter.dfdObj().notify();
};


/**********Hiduke**********/
//werfoo:日付の位置と幅（日10の位、１の位、曜日、天気の順）
var hiduke_Offset = [15, 35, 109, 160];
var hiduke_Item_Width =[25,25,24,39]

Nv_Tags.Hiduke_Set = function(hiduke_order_id, hiduke_Num_input){

	var hiduke_Num = 0;
	if(hiduke_Num_input==0){
		hiduke_Num = 10;
	}else{
		hiduke_Num = hiduke_Num_input;
	}
	
	var hiduke_id = "#hiduke_number" + hiduke_order_id;

	var hiduke_Width = hiduke_Item_Width[hiduke_order_id-1];
	var hiduke_Pos = hiduke_Offset[hiduke_order_id-1] - (hiduke_Num-1)*hiduke_Width;

	var clipvalue = "rect(auto "
					+hiduke_Num*hiduke_Width
					+"px auto "
					+(hiduke_Num-1)*hiduke_Width
					+"px)";
	$(hiduke_id).css("clip", clipvalue);
	$(hiduke_id).css("left", hiduke_Pos);

	nv_scripter.dfdObj().notify();

}

Nv_Tags.Hiduke = function(hidukenumber){
	hiduke_value_1st = Math.floor(hidukenumber/10);
	hiduke_value_2nd = hidukenumber%10;
	Nv_Tags.Hiduke_Set(1,hiduke_value_1st);
	Nv_Tags.Hiduke_Set(2,hiduke_value_2nd);
	Nv_Tags.Youbi(hidukenumber%7);

	nv_scripter.dfdObj().notify();
}

//１～７⇔月火水木金土日
Nv_Tags.Youbi = function(youbinumber){
	if(youbinumber == 0){
		Nv_Tags.Hiduke_Set(3,7);
	}else{
		Nv_Tags.Hiduke_Set(3,youbinumber);
	}
	nv_scripter.dfdObj().notify();
}

//1,2,3⇔晴、曇、雨
Nv_Tags.Tenki = function(tenkinumber){
	Nv_Tags.Hiduke_Set(4,tenkinumber);
	nv_scripter.dfdObj().notify();
}

/**********Character**********/

Nv_Tags.characters = new Array();

/* (yokonami) I think "hide_all_characters" is better for the name of this function. */
/* But in script file, short name is preferable. */
Nv_Tags.Hide = function(){
    Nv_Tags.characters.forEach(function(element){
        element.hide();
    });
    nv_scripter.dfdObj().notify();
}

var Character = function(path,v,h,called_from_init){
        if(typeof called_from_init === 'undefined'){
            called_from_init = 0;
        }

	var self = this;

	/*public property*/
	this.path = path; // ex: character/ame/ame.png
	this.id = path.replace(/\//g,"").replace(/\./g,"");// ex: characterameamepng
        this.name = path.split("/")[1];// ex: ame
	this.v = v;
	this.h = h;
        this.img_width = -1;
	this.face = [];// ex: "ikari", vartical, horizontal, max_number, current_number
	this.showswitch = 0;
        this.current_face_name = "normal";
        //this.face_number_info = {};// {"ikari":2, "naki":3,...} from json file

	/*constructor*/
        Nv_Tags.characters.push(this);
	var img = new Image();
	img.src = path;
	img.onload = function(){
            self.img_width = this.width;
            if(called_from_init==0){
	        nv_scripter.dfdObj().notify();
                //console.log("img.onload called from script");
            }else{
                //console.log("img.onload called from init");
            }
        }

	/*method*/
        /* show will called from only "showface"*/
	this.show = function(h_position){
		$("#scenario_img").append("<img id=\"" + self.id + "\" src=\""+self.path+"\" style=\"display:none;position:absolute; top:"+self.v+"px; left:"+self.h+"px; \">");
                if(h_position === undefined){
                    h_position = 512;
                }
		self.move(h_position);
		self.showswitch = 1;
		if(nv_scripter.isAutomode()){
				$("#"+self.id).show();
				nv_scripter.dfdObj().notify();
		}else{
				//$("#"+self.id).fadeIn("slow",function(){nv_scripter.dfdObj().notify();});
				$("#"+self.id).fadeIn("slow");
				nv_scripter.dfdObj().notify();
		}
	}; 
	
	this.hide = function(){
                $("[id^="+self.id+"]").remove(); //ex: self.id=characterameamepng
		this.showswitch = 0;
	        nv_scripter.dfdObj().notify();
	};
	
	this.css = function(tag,val){
		$("#"+self.id).css(tag,val);
	        nv_scripter.dfdObj().notify();
	}

	this.addface = function(face_name,v,h,maxnumber,called_from_init){ 
                if(typeof maxnumber === "undefined"){
                    maxnumber = -1;
                }
                if(typeof called_from_init === "undefined"){
                    called_from_init = 0;
                }
		var facepath = self.path.replace(/\.png/g,"")+"_"+face_name+".png";
                var current_number = 0;
		self.face[face_name] = new Array(facepath,v,h,maxnumber,current_number);
                var i;
                for(i=0; i<maxnumber; i=i+1){
                    var face_img = new Image();
		    var path = self.path.replace(/\.png/g,"")+"_"+face_name + "_" + i + ".png";
                    face_img.src = path;
                }
                if(called_from_init==0){
	            nv_scripter.dfdObj().notify();
                    //console.log("addface called from script");
                }else{
                    //console.log("addface called from init");
                }
	};
	
	this.showface = function(face_name, h_position){
                if(h_position === undefined){
                    h_position = 512;
                }
		if(self.showswitch == 0){
			self.show(h_position);
		}
		var filename = self.face[face_name][0];
                var maxnumber = self.face[face_name][3];
		filename = filename.replace(".png","");
		var face_id_random = Math.floor(Math.random()*(maxnumber+1));
		self.face[face_name][4] = face_id_random;
		self.current_face_name = face_name;
		
		$("#scenario_img").append("<img id=\""+self.id+"_"+face_name+ "\"" 
			+"src=\""+filename+ "_"+face_id_random + ".png"+"\""
			+"style=\"display:none;position:absolute; top:"
			+parseInt(self.v+self.face[face_name][1])+"px;left:"
			+parseInt(self.h+self.face[face_name][2])+"px;\">");
		if(nv_scripter.isAutomode()){
				$("#"+self.id+"_"+face_name).show();
				nv_scripter.dfdObj().notify();
		}else{
				$("#"+self.id+"_"+face_name).fadeIn("slow");
				nv_scripter.dfdObj().notify();
				//$("#"+self.id+"_"+id).fadeIn("slow",function(){nv_scripter.dfdObj().notify();});
		}
	};
	
	this.changeface = function(){
		var face_name = self.current_face_name;
		var maxnumber = self.face[face_name][3];
		var face_id_random = Math.floor(Math.random()*(maxnumber+1));
		while(face_id_random == self.face[face_name][4]){
			if(maxnumber==0){break;}
			face_id_random = Math.floor(Math.random()*(maxnumber+1));
		}
		var filename = this.face[face_name][0];
		filename = filename.replace(".png","");
		self.face[face_name][4]=face_id_random;
		$("img#"+self.id+"_"+face_name).attr("src",filename+ "_"+face_id_random + ".png");//ex: id = characterameamepng_ijike
		nv_scripter.dfdObj().notify();
	};

	this.move = function(h_position){
		//var img_width = $("#"+self.id).width();
		var width = self.img_width;
		change_value = h_position - width/2;
		$("[id^="+self.id+"]").css('left',change_value);
		self.h = change_value;
	        nv_scripter.dfdObj().notify();
	};
};

/*Initialization of all characters with two or more faces*/
/*This treatment is needed because characters have to initilized after JSON file loaded*/
Nv_Tags.init_characters = function(){
    //face_info.json is like this
    //[{"name":"ame", "diff":{"douyou":0,"egao":2, ... },
    //{"name":"iijima", "diff":{"gekido":0,"hohoemi":2, ...},
    //...
    //}]
    $.getJSON("../character/face_info.json", function(data){
        data.forEach(function(element){
            var path = "character/" + element.name + "/" + element.name + ".png";
            // ex: path = "character/ame/ame.png"
            var str =element.name + " = new Character(\"" + path + "\",0,0,1);";
            // ex: str = "ame = new Character("character/ame/ame.png",0,0);"
            eval(str); //Probably "eval" is not a good way, do you know another way?
            for(var face in element.diff){
                var str = element.name + ".addface(\"" + face + "\", 0, 0," + element.diff[face] + ",1);";
                // ex: str = "ame.addface("egao", 0, 0, 2);"
                eval(str);
            }
        });
    });
    nv_scripter.dfdObj().notify();
};

Nv_Tags.ToEnding = function(){
	$("*").unbind("click");
        console.log("toending");
        nv_scripter.dfdObj().notify();
	$("#container").fadeOut(500,function(){
		nv_audio.BGM_stop();
		$("#container").load("ending.html");
	});
};
