<!doctype html>
<html lang="hu">
	<head>
		<title>ProjectManagement</title>
		<meta charset="utf-8">
		<link rel="stylesheet" media="screen" href="css/main.css">

	<link rel="stylesheet" href="css/jquery-ui.css">
		<script type="text/javascript" src="js/jquery-1.9.1.min.js"></script>

	<script src="js/jquery-ui.js"></script>
		<script src="js/jquery.history.js"></script>
		<script type="text/javascript" src="js/pmanager.js"></script>
	</head>
	<body>
		<header>
			<a href="javascript:void(0);" onClick="History.pushState({}, 'Aktív projektek', '?list=active');" alt="">Projektek</a>
			<a href="javascript:void(0);" alt="add_project">Új projekt</a>
			<a href="javascript:void(0);" onClick="History.pushState({}, 'Elkészült projektek', '?list=done');" alt="">Kész projektek</a>
			<a href="javascript:void(0);" onClick="History.pushState({}, 'Állapotgrafikon', '?graph=state');" alt="">Állapot grafikon</a>
		</header>
		<section class="project_list">
			<h2 style="margin-left:20px;">Aktív projektek</h2>
			<section class="active">
			</section>
		</section>
		<section class="current_project">
		</section>
		<div id="dialog" title="Basic dialog" style="display:none;">
		</div>
	</body>
</html>