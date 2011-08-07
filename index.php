<!doctype html>
<html>
<head>
<meta charset="utf8">
<title>WowTip.js</title>
<script src="http://wowtip.sinaapp.com/wowtip.js" charset="utf8"></script>
<link href="http://kevinburke.bitbucket.org/markdowncss/markdown.css" rel="stylesheet"></link>
</head>
<body>

<style>
#fuckie { background-color: #888888; color: orange; padding: 10px;}
#fuckie a{color:orange }
</style>
<div id="fuckie" style="display:none;">请使用现代浏览器 <a href="http://www.firefox.com" target="_blank">Firefox</a> 或 <a href="http://chrome.google.com" target="_blank" >Chrome</a>  获得最佳效果</div>
<?php
include 'index.markdown.php';
?>

<a target="_blank" href="http://sae.sina.com.cn"><img title="Powered by Sina App Engine" src="http://static.sae.sina.com.cn/image/poweredby/120X33_transparent.gif"></a>

<!--[if IE]>
<script type="text/javascript" 
src="http://ajax.googleapis.com/ajax/libs/chrome-frame/1/CFInstall.min.js"></script>

<script>
// The conditional ensures that this code will only execute in IE,
// Therefore we can use the IE-specific attachEvent without worry
window.attachEvent("onload", function() {
		CFInstall.check({
	preventPrompt : true,
onmissing: function(){
	
	document.getElementById('fuckie').style.display = 'block';
}
});
		});
</script>
<![endif]-->
</body>
</html>
