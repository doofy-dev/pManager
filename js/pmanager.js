$(window).resize(function(){project.updateLayout()})
$(document).ready(function(){
		$( "#dialog" ).dialog({
					  	autoOpen: false,
					       modal: true
					    });
	project.handleState()
})
setInterval(function(){
	project.updateLayout()
},500)

$(document).on('click','*',function(){
	//[classnames]=>addproject, project, edit, updateproject, addelement, addelementolist
	switch($(this).attr('class')){
		case "addproject":
			$.post("file.php?type=addProject&value=null",{
				"name":$('.newname').val(),
				"description":$('.newdesc').val(),
				"link":$('.newurl').val()
			}).done(function(data){
				$('#dialog').dialog('close');
				History.pushState({}, 'Elkészült projektek', '?project='+data);
			})
			return;
		break;
		case "project":
			var id=$(this).attr('alt');
			var name=$(this).children('h3').html()
			History.pushState({}, name, "?project="+id);
			return;
		break;
		case "edit":
			var spliturl=project.State.url.split('?')
			var file=spliturl[1].split('=')
			$.get("file.php?type=getProject&value="+file[1]).done(function(data){
				var jSon=$.parseJSON(data);
				template.dialog("Szerkesztés",template.projectForm(jSon,true))
			});
			return;
		break;
		case "updateproject":
			var spliturl=project.State.url.split('?')
			var file=spliturl[1].split('=')
			$.post("file.php?type=updateproject&value="+file[1],{
				"name":$('.newname').val(),
				"description":$('.newdesc').val(),
				"link":$('.newurl').val(),
				"finished": ($(".finished").is(":checked")?"true":"false")
			}).done(function(data){
				$('#dialog').dialog('close');
				project.handleState();
			})
			return;
		break;
		case "addelement":
				template.dialog("Új elem",template.elementForm({},false,''))
			return;	
		break;
		case "addpro":
				template.proForm()
			return;
		break;
		case "addelementolist":
			var spliturl=project.State.url.split('?')
			var file=spliturl[1].split('=')
			$.post("file.php?type=addElement&value="+file[1],{
				"name":$('.elementname').val(),
				"description":$('.elementdesc').val(),
				"type":$('.type option:selected').val(),
				"weight":$('.weight').val()
			}).done(function(data){
				console.log(data)
				$('#dialog').dialog('close');
				project.handleState();
			})
			return;
		break;
		case "appendthis":

			var spliturl=project.State.url.split('?')
			var file=spliturl[1].split('=')
			console.log(file[1])
			console.log($('.appendpro option:selected').val()+" - "+$(".weight").val())
			$.post("file.php?type=appendproject&value="+file[1],{
				"name":$('.appendpro option:selected').val(),
				"weight":$('.weight').val()
			}).done(function(data){
				console.log(data)
				$('#dialog').dialog('close');
				project.handleState();
			})
			return;
		break;
	}
})
$(document).on('click','.row section',function(){
	var spliturl=project.State.url.split('?')
	var file=spliturl[1].split('=')
	var that=$(this);
	var accesskey=$(this).attr('alt');
	if(accesskey==undefined)return;
	if(accesskey.match(/depends_/)!=null){
		$.get("file.php?type=getElement&value="+file[1]+"&id="+$(this).attr('alt')).done(function(data){
			var jSon=$.parseJSON(data)
		template.dialog("Szerkesztés",'<section class="updateelement"><br>'+
			'<input type="hidden" value="'+accesskey+'" class="accesskey">'+
			'<input type="button" style="width:100%;" class="delelement" alt="'+accesskey+'" value="Törlés"><br><br>'+
			'<strong>Súly</strong><input type="text" class="weight" style="width:95%;" value="'+jSon.weight+'"><br><br>'+
			'<input type="button" style="width:100%;" class="updateproonlist" value="Frissítés">'+
			'</section>')
		})
	}
	else{
		$.get("file.php?type=getElement&value="+file[1]+"&id="+$(this).attr('alt')).done(function(data){
			var jSon=$.parseJSON(data);
			console.log(jSon)
			template.dialog("Szerkesztés",template.elementForm(jSon,true,accesskey))
		})
	}
	
})
$(document).on('click','.updateelement input[type="button"]',function(){
	var type=$(this).attr('class');
	var currentkey=$('.accesskey').val();
	
	var spliturl=project.State.url.split('?')
	var file=spliturl[1].split('=')
	if(type=="updateproonlist"){
			//alert("ASD")
			//alert('update')
			$.post("file.php?type=updatePro&value="+file[1],{
							"weight":$('.weight').val(),
							"id":currentkey
						}).done(function(data){
						//	console.log(data)
							$('#dialog').dialog('close');
							project.handleState();
					})
		}
	
	else{
		if(type=="addelementolist"){
			//alert('add')
			$.post("file.php?type=updateElement&value="+file[1],{
							"name":$('.elementname').val(),
							"description":$('.elementdesc').val(),
							"type":$('.type option:selected').val(),
							"developer":$('.dev').val(),
							"time_taken":$('.ttaken').val(),
							"weight":$('.weight').val(),
							"id":currentkey
						}).done(function(data){
							//console.log(data)
							$('#dialog').dialog('close');
							project.handleState();
					})
					}
		else
		{
			if(type=='delelement'){
				//alert('del')
					$.post("file.php?type=delElement&value="+file[1],{
						"delete":currentkey
					}).done(function(data){
						//	console.log(data)
						$('#dialog').dialog('close');
						project.handleState();
					})
				}
				else{
					//alert("else")
					$.post("file.php?type=moveElement&value="+file[1],{
						"original":currentkey,
						"newkateg":type
					}).done(function(data){
						//	console.log(data)
						$('#dialog').dialog('close');
						project.handleState();
					})
				}
			}
		}
})

$(document).on('click','header a',function(){
		if($(this).attr('alt')!=""){
			template.dialog("Új projekt",template.projectForm(null,false))
		}
})

var url = document.getElementById('url')

History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
	var State = History.getState(); // Note: We are using History.getState() instead of event.state
	project.State=State
	project.handleState()

});

var project={
	State: History.getState(),
	updateLayout:function(){
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
	},
	handleState:function(){
		var spliturl=project.State.url.split('?')
		if(spliturl.length==2){
			var getname=spliturl[1].split('=')
			if(getname.length==2)
				switch (getname[0]){
					case "list":
						project.listProjects(getname[1])
					break;
					case "project":
						project.loadProject(getname[1])
					break;
					case "graph":
						project.loadGraph();
					break;
				}
			else{
				project.listProjects("active")
			}
		}
		else project.listProjects("active")
		project.updateLayout();
	},
	reload:function(){
		handleState(project.State)
	},
	listProjects:function(what){
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
	},
	loadProject:function(what){
		$('.current_project').show();
		$('.project_list').hide();
		var rows=["","","","",""];
		$.get("file.php?type=getProject&value="+what).done(function(data){
			var jSon=$.parseJSON(data)
			$('title').html(jSon.name)
			var depends=(jSon.depends!=undefined?jSon.depends:[]);
			for(var i=0;i<depends.length;i++){
				var perc=template.getPerc(depends[i].data)
				if(depends[i].data.finished=="true"){
					index=3
				}else{
					if(perc==100) index=0
					else{
						if(perc>0&&perc<100) index=1
							else index=2
					}
				}

				rows[index]+=(index==3?'<section class="row donerow">':'')+
							'<section class="feature" alt="depends_'+i+'">'+
								'<strong>'+depends[i].data.name+'</strong><small>'+depends[i].data.description+'</small>'+
								'<section class="percontainer">'+
								'<section class="percval"><div style="width:'+perc+'%;"></div></section>'+
								'<section class="percentage">'+perc.toFixed(2)+'%</section>'+
								'</section>'+
							'</section>'+
							(index==3?'</section>':'')
			}
			var string='<h2>'+jSon.name+'</h2><strong>'+jSon.description+'</strong><br><a href="'+jSon.url+'" target="_blank">Link</a><br><br>'
			string+='<a href="javascript:void(0);" title="Szerkesztés" class="edit"></a>'
			string+='<a href="javascript:void(0);" title="Új elem" class="addelement"></a>'
			string+='<a href="javascript:void(0);" title="Projekt hozzáfűzése" class="addpro"></a>'
			string+='<section style="display:inline-block;padding:5px;height:20px;background:orange;margin-right:10px;">BUG</section><section style="padding:5px;display:inline-block;height:20px;background:cyan;margin-right:10px;">Feature</section><section style="padding:5px;display:inline-block;height:20px;background:pink;margin-right:10px;">Kérés</section>'
			string+='<br><br><section class="table"><section>'

			string+='<aside class="row"><h3>Sprint</h3>'+template.projectElement(jSon.sprint,"sprint",false,false,["",""])+rows[0]+'</aside>'
			string+='<aside class="row"><h3>Folyamatban</h3>'+template.projectElement(jSon.process,"process",true,false,["",""])+rows[1]+'</aside>'
			string+='<aside class="row"><h3>Bug Check</h3>'+template.projectElement(jSon.bugcheck,"bugcheck",true,true,["",""])+rows[2]+'</aside>'
			string+='<aside class="row"><h3>Kosár</h3>'+template.projectElement(jSon.inBag,"inBag",false,false,["",""])+'</aside>'

			string+='</section></section><br><br><br><h3>Elkészültek</h2><section class="table" style="border-left:thin solid black;">'
			string+=template.projectElement(jSon.done,"done",true,true,['<section class="row donerow">',"</section>"])
			string+=rows[3]+'</section>'
			$('.current_project').html(string);
		})
	},

	loadGraph:function(){
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
				string+=template.graphElement(projects[i].content)
			}
			string+='</section>'
			$('.current_project').html(string);
		})
	},
	getWeight:function(jSon,multiply){
		var count=0
		for(var i=0;i<jSon.length;i++){
			count+=(jSon[i].weight!=undefined?jSon[i].weight:1)*multiply
		}
	//	console.log(count)
		return count
	},
	decodeTime:function(mins){
		var hour=parseInt(mins/60,'10');
		var m=mins-(hour*60);
		return (hour<10?'0':'')+hour+":"+(m<10?'0':'')+m
	}
}

var template={
	projectElement:function(jSon,alt,dev,time,extra){
		var string="";
		for(var i=0;i<jSon.length;i++){
			that=jSon[i]
				string+= extra[0]+
						'<section class="'+that.type+'" alt="'+alt+'_'+i+'">'+
							'<strong>'+that.name+'</strong><small>'+that.description+'</small>'+
							'<br><h4>'+(that.developer!=''&&dev? 'Fejlesztette: '+that.developer+'<br>':'')+
							(that.time_taken!=0&&time?'Idő: '+project.decodeTime(that.time_taken):'')+'</h4>'+
						'</section>'+
						extra[1]
		}
		return string
	},
	proForm:function(){
		$.get("file.php?type=listProject&value=all").done(function(data){

			var jSon=$.parseJSON(data)

			var projects=jSon.projects
			var string='<section class="appendproject"><br>'+
						'<select class="appendpro" style="width:100%;">'
						for(var i=0;i<projects.length;i++){
							var that=projects[i].content
							var filename=projects[i].filename.replace(".json",'')

							console.log(filename)
							string+='<option value="'+filename+'">'+that.name+'</option>';
						}
					string+='</select><br><br>'+
						'<input type="text" class="weight" placeHolder="Súly" style="width:95%"><br><br>'+
						'<input type="button" class="appendthis" value="Hozzáadás" style="width:100%">'+
						'</section>'
							template.dialog("Projekt hozzáfűzése",string)
			return string;
		})
	},
	getPerc:function(that){
			var countdone=project.getWeight(that.done,1)
			var countbag=project.getWeight(that.inBag,1)
			var countsprint=project.getWeight(that.sprint,1)
			var countprocess=project.getWeight(that.process,1)
			var countbug=project.getWeight(that.bugcheck,1)

			var allcount=countdone+countbag+countsprint+countprocess+countbug
			countdone=(countdone==0?0.01:countdone)
			if(that.depends!=undefined){
				if(that.depends.length>0){
					for(var i=0;i<that.depends.length;i++){
						console.log(that.depends[i])
						var currdep=(template.getPerc(that.depends[i].data)/100)*parseInt(that.depends[i].weight)
						currdep=currdep+(currdep<1?1:0)
						console.log(that.depends[i].data.name+" "+currdep)
						if(that.depends[i].data.finished=="true") countdone+=currdep
						allcount+=currdep
					}
				}
			}
			var percentage=(countdone/allcount)*100;

			return percentage
	},
	dialog:function(cim,content){
		$("#dialog").dialog({title:cim})
		$("#dialog").html(content)
		$("#dialog").dialog('open')
	},
	projectForm:function(json,edit){
		var jSon=(json==null?{"name":"","description":"","url":""}:json)
		return '<strong>Név</strong><br><input type="text" class="newname" style="width:95%;" placeHolder="Név" value="'+jSon.name+'"><br><br>'+
						'<strong>Leírás</strong><input type="text" class="newdesc" placeHolder="Leírás" style="width:95%;" value="'+jSon.description+'"><br><br>'+
						'<strong>Link</strong><input type="text" class="newurl" placeHolder="Link" style="width:95%;" value="'+jSon.url+'"><br><br>'+
						(edit==true?'<input type="checkbox" '+(jSon.finished=="false"?"":"checked")+' class="finished"> <strong> Befejezve</strong><br><br>':'')+
						'<input type="button" value="Frissítés" class="'+(edit==true?'updateproject':'addproject')+'" style="width:99%;" >'
	},
	elementForm:function(jSon,edit,accesskey){

		return '<section class="updateelement">'+
			(edit==true?'<input type="button" style="width:100%;" class="delelement" alt="'+accesskey+'" value="Törlés"><br><br>':'')+
			'<input type="text" style="width:95%" class="elementname" placeHolder="Név" value="'+(edit?jSon.name:'')+'"><br><br>'+
			'<input type="text" style="width:95%" class="elementdesc" placeHolder="Leírás" value="'+(edit?jSon.description:'')+'"><br><br>'+
			'<select class="type" style="width:99%">'+
				'<option value="N/A" '+(jSon.type=="N/A"||!edit?"selected":"")+'>Válassz típust</option>'+
				'<option value="bug" '+(jSon.type=="bug"?"selected":"")+'>BUG</option>'+
				'<option value="feature" '+(jSon.type=="feature"?"selected":"")+'>Feature</option>'+
				'<option value="request" '+(jSon.type=="request"?"selected":"")+'>Kérés</option>'+
			'</select><br><br>'+
			((edit==true)?'<input type="hidden" value="'+accesskey+'" class="accesskey">'+
			'<strong>Fejlesztő</strong><input type="text" style="width:95%" class="dev" placeHolder="Fejlesztő" value="'+jSon.developer+'"><br><br>'+
			'<strong>Idő (m)</strong><input type="text" style="width:95%" class="ttaken" placeHolder="Idő" value="'+jSon.time_taken+'"><br><br>':'')+
			'<strong>Súly</strong><input type="text" class="weight" style="width:95%" value="'+(jSon.weight!=undefined?jSon.weight:'1')+'"><br><br>'+
			((edit==true)?'<input type="button" style="width:24%;margin-right:1%;float:left;" class="moveSprint" title="Sprint" value="S">'+
			'<input type="button" style="width:24%;margin-right:1%;float:left;" class="moveProcess" title="Folyamatban" value="F">'+
			'<input type="button" style="width:24%;margin-right:1%;float:left;" class="moveBug" title="BUG Check" value="B">'+
			'<input type="button" style="width:24%;float:left;" class="moveBag" title="Kosár" value="K">'+

			'<br><br><br>':'')+
			'<input type="button" style="width:40%;float:right;" class="'+((edit==true)?'updateelemenonlist':'addelementolist')+'" value="'+((edit==true)?'Frissítés':'Hozzáadás')+'">'+
			((edit==true)?'<input type="button" style="width:40%;float:left;" class="moveDone" value="Elkészült">':'')+
			'</section>'
	},
	graphElement:function(that){
		var string=""
			
			var percentage=template.getPerc(that);

			string+='<strong>'+that.name+'</strong><small>'+that.description+'</small>';
			string+='<section class="percontainer">'+
						'<section class="percval"><div style="width:'+percentage+'%;"></div></section>'+
						'<section class="percentage">'+percentage.toFixed(2)+'%</section>'+
					'</section>'
		return string
	}
}