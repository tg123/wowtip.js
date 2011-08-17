<?php
error_reporting(0);


$q = $_GET['q'];
$tip = $_GET['tip'];
$data = $_GET['data'];
$lang = $_GET['lang'];
$uid = "{$q}_{$lang}_{$data}";


if($q){
	$magic = 'v1';
	$etag = md5($uid . $tip . $magic . date('m'));
	if(isset($_SERVER['HTTP_IF_NONE_MATCH']) && trim($_SERVER['HTTP_IF_NONE_MATCH']) == $etag) { 
		header("HTTP/1.1 304 Not Modified"); 
		exit; 
	}

	header("content-Type: text/html; charset=utf-8");
	header("Etag: $etag");

	$support_query = array(
		'cn','tw','eu','us'
	);

	$mc = memcache_init();
	$d = (memcache_get($mc, $uid . $tip));
	if(!$d){
		if($data || !in_array($lang, $support_query)){
			/// {{{
			require 'wowservers.php';
			$lang = $wow_servers[$lang] ? $lang : 'cn';
			$ws = $wow_servers[$lang];
			$c = file_get_contents($ws->item($q, $data));

			if($c){
			$c = trim($c);

			$c = str_replace("\r",'',$c);
			$c = str_replace("\n",'',$c);
			$c = str_replace("\t",'',$c);
			}

			$d = array(
				'uid' => $uid,
				'wow_id' => $q,
				'color' => 'color-q0', //TODO ME
				'error' => 0,
				'lang' => $lang,
				'tip' => $c
			);
			/// }}}
		}else{
			// {{{
			$db = new PDO("mysql:dbname=" . SAE_MYSQL_DB . ";host=" . SAE_MYSQL_HOST_M . ";port=".SAE_MYSQL_PORT, SAE_MYSQL_USER, SAE_MYSQL_PASS);

			$cols = "`wow_id`,`name`,`color`" . ($tip ? ",`tip`" : '');

			if(is_numeric($q)){
				$support_query = array($lang);
			}

			foreach($support_query as $lang){ //TODO FOR EASE NOT optimized 
				if(is_numeric($q)){
					$stmt = $db->prepare("SELECT $cols FROM `items_$lang` where wow_id=:uid");
				}else{
					$stmt = $db->prepare("SELECT $cols FROM `items_$lang` where name=:uid");
				}
				
				$stmt->bindValue(':uid', $q);
				$stmt->execute();

				$d = $stmt->fetch(PDO::FETCH_ASSOC);
				if($d){
					$d['uid'] = $uid;
					$d['error'] = 0;
					$d['lang'] = $lang;
					break;
				}else{
					$d = array(
						'uid' => $uid,
						'error' => 1
					);
				}
			}
			// }}}
		}
		$d = json_encode($d);
		memcache_set($mc, $uid . $tip, $d , false, 43200);
	}

	echo "wowtip.refresh_item($d);";
}

