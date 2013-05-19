var Nv_Storage = function(isTiApp){

//property

//constructor
	if(isTiApp){
		this.db = Titanium.Database.open("Nv_Storage");
		this.db.execute("create table if not exists Storage \(id text primary key, data text\)");
	}

//method
	this.set = function(key,data){
		if(isTiApp){
			this.db.execute("replace into Storage (id,data) values ('" + key + "','" + data +"')");
		}else{
			localStorage.setItem( key ,data );
		}
	};
	
	this.get = function(key){
		if(isTiApp){
			return this.db.execute("select * from Storage where id = '" + key + "'").field(1);
		}else{
			return localStorage.getItem(key);
		}
	};

	this.remove = function(){
		if(isTiApp){
			this.db.remove();
			this.db = Titanium.Database.open("Nv_Storage");
			this.db.execute("create table if not exists Storage \(id text primary key, data text\)");
		}else{
			localStorage.clear();
		}
	};

	this.clear = function(key){
		if(isTiApp){
			console.log("SQLのDELETE文が実行されました。適当にやったのでバグがある可能性が有ります。by S0_ma");
			return this.db.execute("delete from Storage where id = '" + key + "'");
		}else{
			return localStorage.removeItem(key);
		}

	};

}
