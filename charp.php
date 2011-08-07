<?php
header("content-Type: text/html; charset=utf-8");
error_reporting(0);

$realm = $_GET['realm'];
$name = $_GET['name'];
$lang = $_GET['lang'];

if($name && $realm){
	$uid = "{$realm}_{$name}_{$lang}";

	$mc = memcache_init();

	$r = unserialize(memcache_get($mc, $uid));
	if(!$r){
		require 'wowservers.php';
		$ws = $wow_servers[$lang] ? $wow_servers[$lang] : $wow_servers['cn'];

		$c = json_decode(file_get_contents($ws->character($realm, $name)),1);

		if($c){
			$r = array(
				'name' => $c['name'],
				'icon' => str_replace("-avatar.jpg","-card.jpg",$c['thumbnail']) . '?alt=/wow/static/images/2d/card/'.$c['race'].'-'.$c['gender'].'.jpg',
				'race' => $c['race'],
				'level' => $c['level'],
				'guild' => $c['guild']['name'],
				'achievementPoints' => $c['achievementPoints'],
				'averageItemLevel' => $c['items']['averageItemLevel'],
				'items' => array(),
			);

			foreach( $c['items'] as $i  ){
				if(isset($i['id'])){
					$r['items'][] = array(
						'id' => $i['id'],
						'icon' => $i['icon'],
						'data' => make_data($i['tooltipParams']),
					);
				}
			}

			foreach( $c['talents'] as $i){
				if($i['selected']){
					$r['talent'] = $i['name'] . ' ';
					$r['talent'] .= $i['trees'][0]['total'] . '/' . $i['trees'][1]['total'] . '/' . $i['trees'][2]['total'];
					break;
				}
			}

			$r['uid'] = $uid;
			$r['error'] = 0;
			memcache_set($mc, $uid, serialize($r) , false, 43200);
		}else{
			$r = array();
			$r['uid'] = $uid;
			$r['error'] = 1;
			memcache_set($mc, $uid, serialize($r) , false, 60);
		}

	}

	$r = json_encode($r);
	echo "wowtip.refresh_char($r);";
}

function make_data($tooltip){
	$r = '';

	$map = array(
		'reforge' => 're',
		'gem0' => 'g0',
		'gem1' => 'g1',
		'gem2' => 'g2',
		'gem3' => 'g3',
		'gem4' => 'g4',
		'enchant' => 'e',
		'set' => 'set',
		'tinker' => 'ee',
		'suffix' => 'r',
		'extraSocket' => 'es',
	);

	foreach($tooltip  as $k => $v){
		if(is_array($v)){
			$r .= $map[$k] . ':' . join(',',$v) . '|';
		}else{
			if($k == 'extraSocket'){
				$r .= $map[$k] . ':' . '3729' . '|';
			}else{
				$r .= $map[$k] . ':' . $v . '|';
			}
		}
	}
	return $r;
	// 3729
}
