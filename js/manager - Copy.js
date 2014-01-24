$(window).resize(function(){
	updateLayout();
})
var si=setInterval(function(){
		updateLayout();
},1000)

function updateLayout(){
	if($('aside').length>0 && $('.table').length>0){
		//var width=(($('.table').width())/4)-10
	//	$('aside').css({'height':$('.table').height()+"px","width":width+"px"})
			var height=0;
	$('aside').each(function(){
		var h=0;
		$(this).children('section').each(function(){
			h+=$(this).height()+42;
		})
		h+=50;
		if(h>height) height=h;
	})
	$('aside').css({'height':height+"px"})
	}
}

$(document).ready(function(){
	updateLayout();
	var pageState = History.getState();
	handleState(pageState)

	function listProjects(what){

				$('.current_project').hide();
				$('.project_list').show();
				$('.project_list .active').html('');
				$('.current_project').html('');
				$('.project_list h2').html((what=="active"?"Aktív":"Elkészült")+' projektek');
		$('title').html($('.project_list h2').html())
		$.get("file.php?type=listProject&value="+what).done(function(data){
		//	console.log(data)
		var jSon=$.parseJSON(data)
		var projects=jSon.projects
		for(var i=0;i<projects.length;i++){
			var that=projects[i].content
			var filename=projects[i].filename.split('.')
			var string='<section class="project" alt="'+filename[0]+'">';
			string+="<h3>"+that.name+"</h3>";
			string+='</section>';
				$('.project_list .active').append(string);
			
		}
	})
	}
	$( "#dialog" ).dialog({
					  	autoOpen: false,
					       modal: true
					    });
	$(document).on('click','header a',function(){
		if($(this).attr('alt')!=""){
			switch ($(this).attr('alt')){
				case "add_project":
					$('#dialog').html('<input type="text" class="newname" style="width:95%;" placeHolder="Név"><br><br>'+
						'<input type="text" class="newdesc" placeHolder="Leírás" style="width:95%;" ><br><br>'+
						'<input type="text" class="newurl" placeHolder="Link" style="width:95%;" ><br><br>'+
						'<input type="button" value="Hozzáadás" class="addproject" style="width:99%;" >')
					$('#dialog').dialog({
						title:"Új projekt"
					})
					  $("#dialog").dialog('open');
				break;
				case "user_manager":
					getUsers();
					$('#dialog').dialog({title:'Csapattagok'})
					$('#dialog').dialog('open')
				break;	
			}
		}
	})
	$(document).on('click','.addproject',function(){
			$.post("file.php?type=addProject&value=null",{
			"name":$('.newname').val(),
			"description":$('.newdesc').val(),
			"link":$('.newurl').val()
		}).done(function(data){
			$('#dialog').dialog('close');
			History.pushState({}, 'Elkészült projektek', '?project='+data);
		})
	})
	function reload(){
		var pageState = History.getState();
		handleState(pageState)
	}
	function getUsers(){
		$.get('file.php?type=getUsers&value=all').done(function(data){

			var json = $.parseJSON(data)
			var users=json.users;

			var string='<input type="text" class="newusername" placeHolder="Új csapattag neve" style="width:85%;margin:0;"><input type="button" class="newuser" value="+" style="padding-top:3px;margin:0;padding-bottom:7px;"><br><br>';
		//	alert(users.length)
			for(var i=0;i<users.length;i++){
				string+='<section class="user"><strong>'+users[i]+'</strong><a href="javascript:void(0);" alt="'+i+'" title="Törlés">X</a></section>';
			}
			$('#dialog').html(string);
		}).fail(function(){return "ERROR";})
	
	}
	$(document).on('click','.newuser',function(){
		$.get('file.php?type=addUser&value='+$('.newusername').val()).done(function(data){
			$('#dialog').append('<section class="user"><strong>'+$('.newusername').val()+'</strong><a href="javascript:void(0);" alt="'+data+'" title="Törlés">X</a></section>');
		})
	})
	$(document).on('click','.project',function(){
		var id=$(this).attr('alt');
		var name=$(this).children('h3').html()
		History.pushState({}, name, "?project="+id);
	})
			var url = document.getElementById('url')

				History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
					// Log the State
					var State = History.getState(); // Note: We are using History.getState() instead of event.state
					handleState(State)

				});

	$(document).on('click','.user a',function(){
		var id=$(this).attr('alt');
		var that=$(this) 
		$.get('file.php?type=deleteUser&value='+id).done(function(data){
			console.log('delete user with id: '+id)
			console.log(data)
			$(that).parent().remove();
		})
	})
	$(document).on('click','.edit',function(){
		var state = History.getState();
		var spliturl=state.url.split('?')
		var file=spliturl[1].split('=')
	
		$.get("file.php?type=getProject&value="+file[1]).done(function(data){
		var jSon=$.parseJSON(data);
		$('#dialog').html('<strong>Név</strong><br><input type="text" class="newname" style="width:95%;" placeHolder="Név" value="'+jSon.name+'"><br><br>'+
						'<strong>Leírás</strong><input type="text" class="newdesc" placeHolder="Leírás" style="width:95%;" value="'+jSon.description+'"><br><br>'+
						'<strong>Link</strong><input type="text" class="newurl" placeHolder="Link" style="width:95%;" value="'+jSon.url+'"><br><br>'+
						'<input type="checkbox" '+(jSon.finished=="false"?"":"checked")+' class="finished"> <strong> Befejezve</strong><br><br>'+
						'<input type="button" value="Frissítés" class="updateproject" style="width:99%;" >')
					$('#dialog').dialog({
						title:"Szerkesztés"
					})
					  $("#dialog").dialog('open');
		});
	})
	$(document).on('click','.updateproject',function(){
		var state = History.getState();
		var spliturl=state.url.split('?')
		var file=spliturl[1].split('=')
		$.post("file.php?type=updateproject&value="+file[1],{
			"name":$('.newname').val(),
			"description":$('.newdesc').val(),
			"link":$('.newurl').val(),
			"finished": ($(".finished").is(":checked")?"true":"false")
		}).done(function(data){
			$('#dialog').dialog('close');
			handleState(state);
		})
	})
	function handleState(state){
		var spliturl=state.url.split('?')
		if(spliturl.length==2){
			var getname=spliturl[1].split('=')
			if(getname.length==2)
				switch (getname[0]){
					case "list":
						listProjects(getname[1])
					break;
					case "project":
						loadProject(getname[1])
					break;
					case "graph":
						loadGraph();
					break;
				}
			else{
				listProjects("active")
			}
		}
		else listProjects("active")
		updateLayout();
	}
function loadGraph(){
	$('title').html('Állapot grafikon');
	$.get("file.php?type=listProject&value=active").done(function(data){
		//	console.log(data)
		$('.current_project').show();
		$('.project_list').hide();
		var jSon=$.parseJSON(data)

		var projects=jSon.projects
		//console.log(projects)
		var string='<section class="graphtable">'
		for(var i=0;i<projects.length;i++){
			var that=projects[i].content;

			var countdone=getWeight(that.done,1)
			var countbag=getWeight(that.inBag,1)
			var countsprint=getWeight(that.sprint,1)
			var countprocess=getWeight(that.process,1)
			var countbug=getWeight(that.bugcheck,1)



			var allcount=countdone+countbag+countsprint+countprocess+countbug
			countdone=(countdone==0?0.01:countdone)
			var percentage=(countdone/allcount)*100;
			console.log(percentage)
			string+='<strong>'+that.name+'</strong><small>'+that.description+'</small>';
			string+='<section class="percontainer">'+
						'<section class="percval"><div style="width:'+percentage+'%;"></div></section>'+
						'<section class="percentage">'+percentage.toFixed(2)+'%</section>'+
					'</section>'
		}
		string+='</section>'
		$('.current_project').html(string);
	})
}
function getWeight(jSon,multiply){
	var count=0
	for(var i=0;i<jSon.length;i++){
		count+=(jSon[i].weight!=undefined?jSon[i].weight:1)*multiply
	}
//	console.log(count)
	return count
}
	$(document).on('click','.row section',function(){
		var that=$(this);
		var accesskey=$(this).attr('alt');
		var state = History.getState();
		var spliturl=state.url.split('?')
		var file=spliturl[1].split('=')
		$.get("file.php?type=getElement&value="+file[1]+"&id="+$(this).attr('alt')).done(function(data){
			console.log(data)
			var jSon=$.parseJSON(data);
			$("#dialog").dialog({title:"Szerkesztés"});
			$("#dialog").html('<section class="updateelement">'+
			'<input type="text" style="width:95%" class="elementname" placeHolder="Név" value="'+jSon.name+'"><br><br>'+
			'<input type="text" style="width:95%" class="elementdesc" placeHolder="Leírás" value="'+jSon.description+'"><br><br>'+
			'<select class="type" style="width:99%">'+
				'<option value="N/A" '+(jSon.type=="N/A"?"selected":"")+'>Válassz típust</option>'+
				'<option value="bug" '+(jSon.type=="bug"?"selected":"")+'>BUG</option>'+
				'<option value="feature" '+(jSon.type=="feature"?"selected":"")+'>Feature</option>'+
				'<option value="request" '+(jSon.type=="request"?"selected":"")+'>Kérés</option>'+
			'</select><br><br>'+
			'<input type="hidden" value="'+accesskey+'" class="accesskey">'+
			'<strong>Fejlesztő</strong><input type="text" style="width:95%" class="dev" placeHolder="Fejlesztő" value="'+jSon.developer+'"><br><br>'+
			'<strong>Idő (m)</strong><input type="text" style="width:95%" class="ttaken" placeHolder="Idő" value="'+jSon.time_taken+'"><br><br>'+
			'<strong>Súly</strong><input type="text" class="weight" style="width:95%" value="'+(jSon.weight!=undefined?jSon.weight:'1')+'"><br><br>'+
			'<input type="button" style="width:24%;margin-right:1%;float:left;" class="moveSprint" title="Sprint" value="S">'+
			'<input type="button" style="width:24%;margin-right:1%;float:left;" class="moveProcess" title="Folyamatban" value="F">'+
			'<input type="button" style="width:24%;margin-right:1%;float:left;" class="moveBug" title="BUG Check" value="B">'+
			'<input type="button" style="width:24%;float:left;" class="moveBag" title="Kosár" value="K">'+

			'<br><br><br>'+
			'<input type="button" style="width:40%;float:right;" class="updateelemenonlist" value="Frissítés">'+
			'<input type="button" style="width:40%;float:left;" class="moveDone" value="Elkészült">'+
			'</section>');

			$("#dialog").dialog('open');
		})
	})
	
	$(document).on('click','.updateelement input[type="button"]',function(){
		var type=$(this).attr('class');
		var currentkey=$('.accesskey').val();
		console.log(type)
		var state = History.getState();
		var spliturl=state.url.split('?')
		var file=spliturl[1].split('=')
		if(type!='updateelemenonlist'){
				$.post("file.php?type=moveElement&value="+file[1],{
					"original":currentkey,
					"newkateg":type
				}).done(function(data){
					$('#dialog').dialog('close');
					handleState(state);
				})
		}
		else{
			$.post("file.php?type=updateElement&value="+file[1],{
					"name":$('.elementname').val(),
					"description":$('.elementdesc').val(),
					"type":$('.type option:selected').val(),
					"developer":$('.dev').val(),
					"time_taken":$('.ttaken').val(),
					"weight":$('.weight').val(),
					"id":currentkey
				}).done(function(data){
					$('#dialog').dialog('close');
					handleState(state);
				})
		}
	
	})

	$(document).on('click','.addelement',function(){
		$('#dialog').html('<input type="text" style="width:95%" class="elementname" placeHolder="Név"><br><br>'+
			'<input type="text" style="width:95%" class="elementdesc" placeHolder="Leírás"><br><br>'+
			'<select class="type" style="width:99%">'+
				'<option value="N/A">Válassz típust</option>'+
				'<option value="bug">BUG</option>'+
				'<option value="feature">Feature</option>'+
				'<option value="request">Kérés</option>'+
			'</select><br><br>'+
			'<strong>Súly</strong><input type="text" class="weight" style="width:95%" value="1"><br><br>'+
			'<input type="button" style="width:99%" class="addelementolist" value="Hozzáadás">');
		$('#dialog').dialog({title:"Új elem"});
		$('#dialog').dialog('open');
	})
	$(document).on('click','.addelementolist',function(){
		var state = History.getState();
		var spliturl=state.url.split('?')
		var file=spliturl[1].split('=')
		$.post("file.php?type=addElement&value="+file[1],{
			"name":$('.elementname').val(),
			"description":$('.elementdesc').val(),
			"type":$('.type option:selected').val(),
			"weight":$('.weight').val()
		}).done(function(data){
			$('#dialog').dialog('close');
			handleState(state);
		})
	})
	function loadProject(what){

			$('.current_project').show();
			$('.project_list').hide();

		$.get("file.php?type=getProject&value="+what).done(function(data){
			var jSon=$.parseJSON(data)
			console.log(jSon)
			$('title').html(jSon.name)
			var string='<h2>'+jSon.name+'</h2><strong>'+jSon.description+'</strong><br><a href="'+jSon.url+'" target="_blank">Link</a><br><br>'
			string+='<a href="javascript:void(0);" title="Szerkesztés" class="edit"></a>'
			string+='<a href="javascript:void(0);" title="Új elem" class="addelement"></a>'
			string+='<section style="display:inline-block;padding:5px;height:20px;background:orange;margin-right:10px;">BUG</section><section style="padding:5px;display:inline-block;height:20px;background:cyan;margin-right:10px;">Feature</section><section style="padding:5px;display:inline-block;height:20px;background:pink;margin-right:10px;">Kérés</section>'
			string+='<br><br><section class="table"><section>'

			//Sprint
			string+='<aside class="row"><h3>Sprint</h3>'
				for(var i=0;i<jSon.sprint.length;i++){
					that=jSon.sprint[i]
					string+='<section class="'+that.type+'" alt="sprint_'+i+'"><strong>'+that.name+'</strong><small>'+that.description+'</small>'+
				//	'<br>Fejlesztő: '+that.developer+
				//	'<br>Idő: '+decodeTime(that.time_taken)+
					'</section>'
				}
			string+='</aside>'
			
			//Folyamatban
			string+='<aside class="row"><h3>Folyamatban</h3>'
				for(var i=0;i<jSon.process.length;i++){
					that=jSon.process[i]
					string+='<section class="'+that.type+'" alt="process_'+i+'"><strong>'+that.name+'</strong><small>'+that.description+'</small>'+
					(that.developer!=''? '<br><h4>Fejlesztő: '+that.developer+'</h4>':'')+
					//'<br>Idő: '+decodeTime(that.time_taken)+
					'</section>'
				}
			string+='</aside>'
			
			//BUG Check
			string+='<aside class="row"><h3>BUG Check</h3>'
				for(var i=0;i<jSon.bugcheck.length;i++){
					that=jSon.bugcheck[i]
					string+='<section class="'+that.type+'" alt="bugcheck_'+i+'"><strong>'+that.name+'</strong><small>'+that.description+'</small>'+
					'<br><h4>'+(that.developer!=''? 'Fejlesztette: '+that.developer+'<br>':'')+(that.time_taken!=0?'Idő: '+decodeTime(that.time_taken):'')+'</h4></section>'
				}
			string+='</aside>'
			
			//Kosár
			string+='<aside class="row"><h3>Kosár</h3>'
				for(var i=0;i<jSon.inBag.length;i++){
					that=jSon.inBag[i]
					string+='<section class="'+that.type+'" alt="inBag_'+i+'"><strong>'+that.name+'</strong><small>'+that.description+'</small>'+
					//'<br>Fejlesztő: '+that.developer+'<br>Idő: '+decodeTime(that.time_taken)+
					'</section>'
				}
			string+='</aside>'
			
			//Elkészültek
			string+='</section></section><br><br><br><h3>Elkészültek</h2><section class="table" style="border-left:thin solid black;">'
				for(var i=0;i<jSon.done.length;i++){
					that=jSon.done[i]
					string+='<section class="row donerow"><section class="'+that.type+'" alt="done_'+i+'"><strong>'+that.name+'</strong><small>'+that.description+'</small>'+
					'<br><h4>'+(that.developer!=''? 'Fejlesztette: '+that.developer+'<br>':'')+(that.time_taken!=0?'Idő: '+decodeTime(that.time_taken):'')+'</h4></section></section>'
				}
			string+='</section>'
			$('.current_project').html(string);

		})
	}
	function decodeTime(mins){
		var hour=parseInt(mins/60,'10');
		var m=mins-(hour*60);
		return (hour<10?'0':'')+hour+":"+(m<10?'0':'')+m
	}

})