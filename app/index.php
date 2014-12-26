<?php

require_once('../publication/publication.inc.php');

?>
<!doctype html>
<html lang="<?= substr(fRamework::GetLanguage(), 0, 2) ?>" ng-app="monitorsConstructor">
	<head>
		<meta charset="utf-8">
		<title><?= fRamework::GetLanguage() == 'rus' ? 'Создай свой кастом' : 'Create your own custom' ?></title>
		<link href="css/reset.css" rel="stylesheet" />
		<link href="css/tooltip.css" rel="stylesheet" />
		<link href="css/style.css" rel="stylesheet" />

		<script src="lib/angular/angular.js"></script>
		<script src="lib/lodash.min.js"></script>
		<script src="lib/jquery/jquery-1.10.2.min.js"></script>
		<script src="lib/tooltip.js"></script>

		<script>
			var POST_URL = 'apply.php?Language=<?= fRamework::GetLanguage() ?>';
		</script>
		<script src="js/models.<?= fRamework::GetLanguage() ?>.js"></script>
		<script src="js/customs.<?= fRamework::GetLanguage() ?>.js"></script>
    <script src="js/defaults.js"></script>
		<script src="js/controllers.js"></script>
		<link href="http://fonts.googleapis.com/css?family=Roboto+Condensed:400,300,700&amp;subset=latin,cyrillic" rel="stylesheet" type="text/css">
	</head>
	<body ng-controller="MonitorsList"><?php

		require('index.body.'.fRamework::GetLanguage().'.php')
		
	?></body>
</html>
