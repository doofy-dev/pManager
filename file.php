<?php
header('Content-Type: text/html; charset=utf-8');
	if(isset($_GET['type'])&&isset($_GET['value'])){
		if($_GET['type']=="getProject") echo getProject($_GET['value']);
		if($_GET['type']=="listProject") echo listProject($_GET['value']);
		if($_GET['type']=="getUsers") echo getUsers();
		if($_GET['type']=="deleteUser") deleteUser($_GET['value']);
		if($_GET['type']=="addUser") addUser($_GET['value']);
		if($_GET['type']=="updateproject") updateproject($_GET['value']);
		if($_GET['type']=="addElement") addElement($_GET['value']);
		if($_GET['type']=="getElement") echo getElement($_GET['value'],$_GET['id']);
		if($_GET['type']=="moveElement")moveElement($_GET['value']);
		if($_GET['type']=="updateElement")updateElement($_GET['value']);
		if($_GET['type']=="updatePro")updatePro($_GET['value']);
		if($_GET['type']=="addProject")addProject();
		if($_GET['type']=="delElement")delElement($_GET['value']);
		if($_GET['type']=="appendproject")appendproject($_GET['value']);
	}

	function appendproject($file){
		$project=json_decode(file_get_contents('projects/'.$file.'.json'),true);
		$project["depends"][]=array("weight"=>$_POST['weight'],"project"=>$_POST['name']);
		print_r($project);
		unlink('projects/'.$file.'.json');
		$fp=fopen('projects/'.$file.'.json', "w");
		fwrite($fp, json_encode($project));
		fclose($fp);
	}

	function delElement($file){
		$project=json_decode(file_get_contents('projects/'.$file.'.json'),true);
		$orig=explode("_", $_POST['delete']);

		array_splice($project[$orig[0]], $orig[1], 1);
		unlink('projects/'.$file.'.json');
		$fp=fopen('projects/'.$file.'.json', "w");
		fwrite($fp, json_encode($project));
		fclose($fp);
	}

	function addProject(){
		$file=preg_replace('/[^(\x20-\x7F)]*/','', $_POST['name']);

		$fp=fopen('projects/'.$file.'.json', "w");
		$project=array(
			"name"=>$_POST['name'],
			"description"=>$_POST['description'],
			"url"=>$_POST['link'],
			"finished"=>"false",
			"done"=>array(),
			"inBag"=>array(),
			"sprint"=>array(),
			"process"=>array(),
			"bugcheck"=>array()
		);
		fwrite($fp, json_encode($project));
		echo $file;
	}
	function updatePro($file){
		$project=json_decode(file_get_contents('projects/'.$file.'.json'),true);
		$orig=explode("_", $_POST['id']);
		$project[$orig[0]][$orig[1]]["weight"]=$_POST['weight'];
		print_r($project);
		unlink('projects/'.$file.'.json');
		$fp=fopen('projects/'.$file.'.json', "w");
		fwrite($fp, json_encode($project));
		fclose($fp);
	}
	function updateElement($file){
		$project=json_decode(file_get_contents('projects/'.$file.'.json'),true);
		$orig=explode("_", $_POST['id']);
		$project[$orig[0]][$orig[1]]=array("name"=>$_POST['name'],"description"=>$_POST['description'],"weight"=>$_POST['weight'],"developer"=>$_POST['developer'],"type"=>$_POST['type'],"time_taken"=>$_POST['time_taken']);
		unlink('projects/'.$file.'.json');
		$fp=fopen('projects/'.$file.'.json', "w");
		fwrite($fp, json_encode($project));
		fclose($fp);
	}

	function moveElement($file){
		$project=json_decode(file_get_contents('projects/'.$file.'.json'),true);
		$orig=explode("_", $_POST['original']);
		$temp=$project[$orig[0]][$orig[1]];
		array_splice($project[$orig[0]], $orig[1], 1);
		switch ($_POST['newkateg']) {
			case 'moveSprint':
				$project['sprint'][]=$temp;
				break;
			case 'moveBug':
				$project['bugcheck'][]=$temp;
				break;
			case 'moveProcess':
				$project['process'][]=$temp;
				break;
			case 'moveBag':
				$project['inBag'][]=$temp;
				break;
			case 'moveDone':
				$project['done'][]=$temp;
				break;
		}
		unlink('projects/'.$file.'.json');
		$fp=fopen('projects/'.$file.'.json', "w");
		fwrite($fp, json_encode($project));
		fclose($fp);
	}

	function getElement($file,$id){
	//	print_r($_GET);
		$az=explode("_", $id);
		$project=json_decode(file_get_contents('projects/'.$file.'.json'),true);
		$element=$project[$az[0]][$az[1]];
		return json_encode($element);
	}

	function addElement($name){
		$project=json_decode(file_get_contents('projects/'.$name.'.json'),true);
		print_r($project);
		$project['inBag'][]=array("name"=>$_POST['name'],"description"=>$_POST['description'],"weight"=>$_POST['weight'],"developer"=>"","type"=>$_POST['type'],"time_taken"=>"0");
		print_r($project);
		unlink('projects/'.$name.'.json');
		$fp=fopen('projects/'.$name.'.json', "w");
		fwrite($fp, json_encode($project));
		fclose($fp);
	}

	function updateproject($name){
		$project=json_decode(file_get_contents('projects/'.$name.'.json'),true);
		$project['name']=$_POST['name'];
		$project['description']=$_POST['description'];
		$project['url']=$_POST['link'];
		$project['finished']=$_POST['finished'];
		unlink('projects/'.$name.'.json');
		$fp=fopen('projects/'.$name.'.json', "w");
		fwrite($fp, json_encode($project));
		fclose($fp);
	}

	function deleteUser($id){
		$users=json_decode(getUsers(),true);
		print_r($users);
		array_splice($users['users'], $id, 1);
		unset($users[$id]);
		unlink('users.json');
		$fp=fopen('users.json','w');
		fwrite($fp, json_encode($users));
		fclose($fp);
	}
	function addUser($name){
		$users=json_decode(getUsers(),true);
		echo count($users['users']);
		$users['users'][]=$name;
		asort($users);
		unlink('users.json');
		$fp=fopen('users.json','w');
		fwrite($fp, json_encode($users));
		fclose($fp);
	}

	function getUsers(){
		$json=file_get_contents("users.json");
		return $json;
	}


	function getProject($what="all"){
		if($what=="all"){
				$dt= '{"projects":[';
				$volte=false;
				if ($handle = opendir('projects')) {
					while (false !== ($entry = readdir($handle))) {
					    if ($entry != "." && $entry != "..") {
					          if($volte!=false){
					          	$dt.= ',';
					          }
					          $volte=true;
					          	$dt.= '{
					          		"filename":"'.$entry.'",
					          		"content":';
					           $dt.= file_get_contents('projects/'.$entry).'}';
					        }
					}
				    closedir($handle);
				}
				
				$dt.= ']}';
		}
		else{
			$dt="";
			
			if(file_exists('projects/'.$what.'.json')){
				$project = json_decode(file_get_contents('projects/'.$what.'.json'),true);
				if(isset($project['depends'])){
					for($i=0;$i<count($project['depends']);$i++){
						$temp=$project['depends'][$i];
				

						$project['depends'][$i]=array("weight"=>$temp["weight"],"data"=>json_decode(getProject($temp["project"]),true));
					

					}
				}
				//	echo "<pre>";
			//	print_r($project);
				$dt= json_encode($project);
			//		echo "</pre>";
				return $dt;
			}
			$dt.= '{}';	
			return $dt;
		}
	}

	function listProject($what="active"){
		echo '{"projects":[';
		$volte=false;
		$active=($what!="active"?"true":"false");

					
		if ($handle = opendir('projects')) {
			while (false !== ($entry = readdir($handle))) {
			    if ($entry != "." && $entry != "..") {

			    	$filename=str_replace('.json','',$entry);
					
					$getjson=getProject($filename);
				//	echo $getjson.'<br>';
					$getarr=json_decode($getjson,true);
					//echo "string";
					//print_r($getarr);
				
					if($getarr['finished']==$active||$what=="all"){
						if($volte!=false){
						   	echo ',';
						}
						$volte=true;
						echo '{
							"filename":"'.$filename.'.json",
							"content":';
						echo $getjson.'}';
					}
		        }
			}
		    closedir($handle);
		}
		echo ']}';
		
		
	}
?>