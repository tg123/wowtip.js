<?php
// cn|tw|eu|us|kr|de|fr|es|pt|it|pl|ru

class WowServer {
	private $server;
	private $lang;
	public function __construct($server, $lang){
		$this->server = $server;
		$this->lang = $lang;
	}

	public function item($item_id, $ext = ''){
		$ext = str_replace(':', '=', $ext);
		$ext = str_replace('|', '&', $ext);
		return "http://{$this->server}/wow/{$this->lang}/item/$item_id/tooltip?$ext";
	}

	public function character($realm, $name){
		$realm = rawurlencode($realm);
		$name = rawurlencode($name);
		return "http://{$this->server}/api/wow/character/$realm/$name/?fields=items,professions,talents,titles,guild";
	}
}

$wow_servers = array(
	'cn' => new WowServer('www.battlenet.com.cn', 'zh'),
	'tw' => new WowServer('tw.battle.net', 'zh'),
	'kr' => new WowServer('kr.battle.net', 'ko'),
	'eu' => new WowServer('eu.battle.net', 'en'),
	'de' => new WowServer('eu.battle.net', 'de'),
	'fr' => new WowServer('eu.battle.net', 'fr'),
	'it' => new WowServer('eu.battle.net', 'it'),
	'pl' => new WowServer('eu.battle.net', 'pl'),
	'ru' => new WowServer('eu.battle.net', 'ru'),
	'us' => new WowServer('us.battle.net', 'en'),
	'es' => new WowServer('us.battle.net', 'es'),
	'pt' => new WowServer('us.battle.net', 'pt'),
);


