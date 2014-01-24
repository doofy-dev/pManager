
$(document).ready(function(){
	


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

})