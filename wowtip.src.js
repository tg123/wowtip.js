window.wowtip = (function(){

// {{{ DomReady
    var DomReady = {};

	// Everything that has to do with properly supporting our document ready event. Brought over from the most awesome jQuery. 

    var userAgent = navigator.userAgent.toLowerCase();

    // Figure out what browser is being used
    var browser = {
    	version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1],
    	safari: /webkit/.test(userAgent),
    	opera: /opera/.test(userAgent),
    	msie: (/msie/.test(userAgent)) && (!/opera/.test( userAgent )),
    	mozilla: (/mozilla/.test(userAgent)) && (!/(compatible|webkit)/.test(userAgent))
    };    

	var readyBound = false;	
	var isReady = false;
	var readyList = [];

	// Handle when the DOM is ready
	function domReady() {
		// Make sure that the DOM is not already loaded
		if(!isReady) {
			// Remember that the DOM is ready
			isReady = true;
        
	        if(readyList) {
	            for(var fn = 0; fn < readyList.length; fn++) {
	                readyList[fn].call(window, []);
	            }
            
	            readyList = [];
	        }
		}
	};

	// From Simon Willison. A safe way to fire onload w/o screwing up everyone else.
	function addLoadEvent(func) {
	  var oldonload = window.onload;
	  if (typeof window.onload != 'function') {
	    window.onload = func;
	  } else {
	    window.onload = function() {
	      if (oldonload) {
	        oldonload();
	      }
	      func();
	    }
	  }
	};

	// does the heavy work of working through the browsers idiosyncracies (let's call them that) to hook onload.
	function bindReady() {
		if(readyBound) {
		    return;
	    }
	
		readyBound = true;

		// Mozilla, Opera (see further below for it) and webkit nightlies currently support this event
		if (document.addEventListener && !browser.opera) {
			// Use the handy event callback
			document.addEventListener("DOMContentLoaded", domReady, false);
		}

		// If IE is used and is not in a frame
		// Continually check to see if the document is ready
		if (browser.msie && window == top) (function(){
			if (isReady) return;
			try {
				// If IE is used, use the trick by Diego Perini
				// http://javascript.nwbox.com/IEContentLoaded/
				document.documentElement.doScroll("left");
			} catch(error) {
				setTimeout(arguments.callee, 0);
				return;
			}
			// and execute any waiting functions
		    domReady();
		})();

		if(browser.opera) {
			document.addEventListener( "DOMContentLoaded", function () {
				if (isReady) return;
				for (var i = 0; i < document.styleSheets.length; i++)
					if (document.styleSheets[i].disabled) {
						setTimeout( arguments.callee, 0 );
						return;
					}
				// and execute any waiting functions
	            domReady();
			}, false);
		}

		if(browser.safari) {
		    var numStyles;
			(function(){
				if (isReady) return;
				if (document.readyState != "loaded" && document.readyState != "complete") {
					setTimeout( arguments.callee, 0 );
					return;
				}
				if (numStyles === undefined) {
	                var links = document.getElementsByTagName("link");
	                for (var i=0; i < links.length; i++) {
	                	if(links[i].getAttribute('rel') == 'stylesheet') {
	                	    numStyles++;
	                	}
	                }
	                var styles = document.getElementsByTagName("style");
	                numStyles += styles.length;
				}
				if (document.styleSheets.length != numStyles) {
					setTimeout( arguments.callee, 0 );
					return;
				}
			
				// and execute any waiting functions
				domReady();
			})();
		}

		// A fallback to window.onload, that will always work
	    addLoadEvent(domReady);
	};

	// This is the public function that people can use to hook up ready.
	DomReady.ready = function(fn, args) {
		// Attach the listeners
		bindReady();
    
		// If the DOM is already ready
		if (isReady) {
			// Execute the function immediately
			fn.call(window, []);
	    } else {
			// Add the function to the wait list
	        readyList.push( function() { return fn.call(window, []); } );
	    }
	};
    
	bindReady();

	// domReady.js from domready.googlecode.com

// }}} domReady
	
	// {{{ Node Type
	var ELEMENT_NODE = document.ELEMENT_NODE | 1;
	var TEXT_NODE = document.TEXT_NODE | 3;

	// }}} Node Type
	
	var WowTipServer = 'http://wowtip.sinaapp.com/'

	var DefaultLang = 'cn';

	// {{{ Server URL
	var makeWowBnServer = function(server){
		return {
			//main: function(url){
			//	return 'http://' + server.main + url;
			//}
			//,
			//media: function(url){
			//},
			icon: function(icon,size){
				return 'http://' + server.media + '/wow/icons/'+ size + '/' + icon +'.jpg';
			},
			character: function(realm, name){
				return 'http://' + server.main + '/wow/' + server.lang + '/character/' + realm + '/'+ name +'/';
			},
			item: function(itemid){
				return 'http://' + server.main + '/wow/' + server.lang + '/item/' + itemid;
			},
			avatar:function(avatar){
				if(avatar){
					return 'http://' + server.main + '/static-render/' + server.prefix + '/' + avatar;
				}else{
					return 'http://' + server.main + '/wow/static/images/2d/card/0-0.jpg';
				}
			}
		}
	};
	// }}} Server URL

	// {{{ Server 
	//'cn' => new WowServer('www.battlenet.com.cn', 'zh'),
	//'tw' => new WowServer('tw.battle.net', 'zh'),
	//'kr' => new WowServer('kr.battle.net', 'ko'),
	//'eu' => new WowServer('eu.battle.net', 'en'),
	//'de' => new WowServer('eu.battle.net', 'de'),
	//'fr' => new WowServer('eu.battle.net', 'fr'),
	//'it' => new WowServer('eu.battle.net', 'it'),
	//'pl' => new WowServer('eu.battle.net', 'pl'),
	//'ru' => new WowServer('eu.battle.net', 'ru'),
	//'es' => new WowServer('eu.battle.net', 'es'),
	//'us' => new WowServer('us.battle.net', 'en'),
	//'mx' => new WowServer('us.battle.net', 'es'),
	//'pt' => new WowServer('us.battle.net', 'pt'),
	var WoWBnServers = {
		cn : makeWowBnServer({
			prefix : 'cn',
			lang: 'zh',
			main : 'www.battlenet.com.cn' ,
			media: 'content.battlenet.com.cn'
		}),
		tw : makeWowBnServer({
			prefix : 'tw',
			lang: 'zh',
			main : 'tw.battle.net' ,
			media: 'us.media.blizzard.com'
		}),
		kr : makeWowBnServer({
			prefix : 'kr',
			lang: 'ko',
			main : 'ko.battle.net' ,
			media: 'kr.media.blizzard.com'
		}),
		eu : makeWowBnServer({
			prefix : 'eu',
			lang: 'en',
			main : 'eu.battle.net' ,
			media: 'eu.media.blizzard.com'
		}),
		de : makeWowBnServer({
			prefix : 'eu',
			lang: 'de',
			main : 'eu.battle.net' ,
			media: 'eu.media.blizzard.com'
		}),
		fr : makeWowBnServer({
			prefix : 'eu',
			lang: 'fr',
			main : 'eu.battle.net' ,
			media: 'eu.media.blizzard.com'
		}),
		it : makeWowBnServer({
			prefix : 'eu',
			lang: 'it',
			main : 'eu.battle.net' ,
			media: 'eu.media.blizzard.com'
		}),
		pl : makeWowBnServer({
			prefix : 'eu',
			lang: 'pl',
			main : 'eu.battle.net' ,
			media: 'eu.media.blizzard.com'
		}),
		es : makeWowBnServer({
			prefix : 'eu',
			lang: 'es',
			main : 'eu.battle.net' ,
			media: 'eu.media.blizzard.com'
		}),
		ru : makeWowBnServer({
			prefix : 'eu',
			lang: 'ru',
			main : 'eu.battle.net' ,
			media: 'eu.media.blizzard.com'
		}),
		mx : makeWowBnServer({
			prefix : 'us',
			lang: 'es',
			main : 'us.battle.net' ,
			media: 'us.media.blizzard.com'
		}),
		pt : makeWowBnServer({
			prefix : 'us',
			lang: 'pt',
			main : 'us.battle.net' ,
			media: 'us.media.blizzard.com'
		}),
		us : makeWowBnServer({
			prefix : 'us',
			lang: 'en',
			main : 'us.battle.net' ,
			media: 'us.media.blizzard.com'
		})
	};
	// }}} Server 

	var changeDefaultLang = function(lang){
		if(WoWBnServers[lang]){
			for(var f in WoWBnServers[lang]){
				WoWBnServers[f] = WoWBnServers[lang][f];
			}
		}
	};
	
	changeDefaultLang(DefaultLang);

	// {{{ Cache and Map
	var ItemCache = {};
	var CharseterCache = {};
	var ItemAMap = {};
	var CharseterDivMap = {};
	var CurrentUid = '';
	// }}} Cache and Map

	// {{{ Const
	var ItemLoadingText = '<div class="wiki-tooltip"><span style="background-image: url(' + WoWBnServers.icon('inv_misc_questionmark', 56) +');" class="icon-frame frame-56 "></span><h3 class="color-q1">Loading</h3>... ...<br/>... ...</div>';
	var ItemErrorD = { tip:'<div class="wiki-tooltip"><span style="background-image: url('+ WoWBnServers.icon('inv_misc_bone_humanskull_01', 56) +');" class="icon-frame frame-56 "></span><h3 class="color-q1">Error</h3>... ...<br/>... ...</div>' };
	var ItemLoadingD = {tip : ItemLoadingText};

	// }}} Const


	var jsonp = function(path){
		var h = document.getElementsByTagName("head")[0];
		var s = document.createElement("script");
		s.setAttribute("src",encodeURI(WowTipServer + path));
		s.setAttribute("charset",'utf8');
		h.appendChild(s);
	};

	// {{{ ItemJson
	var _item = function(idorname, showhtml, lang , data){
		var uid = idorname + '_' + lang + '_' + data;
		if(!ItemCache[uid]){
			ItemCache[uid] = ItemLoadingD;
			jsonp("itemp.php?q=" + idorname + "&lang=" + lang);
		}
		return '<a href="javascript:;" class="wowtipitem" item_uid="'+ uid +'" lang="'+ lang +'" data="' + data + '" q="'+ idorname +'" >' + showhtml +'</a>'		
	}

	var item = function(_ ,name){
		return _item(name,'[' + name + ']', DefaultLang, '');
	};

	var item_withid = function(_ ,id, name){
		return _item(id,'[' + name + ']', DefaultLang, '');
	};
	// }}} ItemJson

	var _character = function(realm, name, lang){
		var uid = realm + '_' + name + '_' + lang;
		if(!CharseterCache[uid]){
			jsonp("charp.php?realm=" + realm + "&name=" + name + "&lang=" + lang);
		}
		return '<div class="wowtipchar" char_uid="'+ uid +'" name="' + name + '" realm="'+ realm +'" lang="'+ lang +'" >'+'<div class="inner">Loading...</div></div>'
	};

	var character = function(_, realm, name){
		return _character(realm, name, DefaultLang);
	};

	var character_with_lang = function(_, lang,realm, name){
		return _character(realm, name, lang);
	};

	var regx = [
		{regx : /\[item\](.+?)\[\/item\]/gi ,func : item },
		{regx : /\[item (.+?)\]/gi ,func: item },
		{regx : /\[item=(\d+?)\](.+?)\[\/item\]/gi ,func : item_withid },
		{regx : /\[armory=(.+?)\](.+?)\[\/armory\]/gi ,func : character},
		{regx : /\[armory (.+?) (.+?)\]/gi ,func : character},
		{regx : /\[(cn|tw|eu|us|kr|de|fr|es|pt|it|pl|ru)armory (.+?) (.+?)\]/gi ,func : character_with_lang}
	];

	// {{{ Tooltip and pos
	var toolTip = document.createElement("div");
	toolTip.className = "ui-tooltip";
	toolTip.innerHTML = '<div class="tooltip-content"></div>';
	toolTip.style.display = "none";

	var texthandle = toolTip.firstChild;
	var show = function(text){
		texthandle.innerHTML = text ? text : ItemLoadingText;
	}

	var xPos = 0;
	var yPos = 0;
	var sl = 0;
	var st = 0;
	// {{{ updatePos
	var updatePos = function(){

		//尽量放左边 不能放右边 且 能放左边时候才放左边	
		if( xPos + toolTip.clientWidth - sl >  document.documentElement.clientWidth && toolTip.clientWidth < xPos ){
			xPos = xPos - toolTip.clientWidth - 15;
		}else{
			xPos = xPos + 60;
		}

		//尽量放下边 不能放下边 且 能放上边才放上边
		if( yPos + toolTip.clientHeight - st >  document.documentElement.clientHeight && toolTip.clientHeight < yPos ){
			yPos = yPos - toolTip.clientHeight - 15;
		}else{
			yPos = yPos + 8;
		}

		toolTip.style.top = parseInt(yPos) + "px";
		toolTip.style.left = parseInt(xPos) + "px";
	}
	// }}} updatePos
	var _onmousemove = function(e){
		sl = document.documentElement.scrollLeft + document.body.scrollLeft;
		st = document.documentElement.scrollTop + document.body.scrollTop;
		var e = e ? e : event;
		xPos = e.clientX + sl;
		yPos = e.clientY + st;
		updatePos();
		var _uid = this.getAttribute('item_uid');
		var idorname = this.getAttribute('q');
		var lang = this.getAttribute('lang');
		var data = this.getAttribute('data');
		CurrentUid = _uid;
		if(!ItemCache[_uid].tip && !ItemCache[_uid].loadingTip){
			ItemCache[_uid].loadingTip = true;
			jsonp("itemp.php?tip=1&q=" + idorname + "&lang=" + lang + "&data=" + data);
		}
		show(ItemCache[_uid].tip);
		toolTip.style.display = "block";
	}

	var _onmouseout = function(e){
		toolTip.style.display = "none";
	}

	var attachE = function(l){
		l.onmousemove = _onmousemove;
		l.onmouseout = 	_onmouseout;
	}
	// }}} Tooltip and pos

	// {{{ findAll
	var findAll = function(root){
		var hasWowtipMark = function(text){
			if(text){
				for(var i in regx){
					if(text.match(regx[i].regx)){
						return true;
					}
				}
			}
			return false;
		}

		var rt = [];
		var find = function(node){
			var c = node.childNodes;
			for (var i in c){
				if(c[i].nodeType == TEXT_NODE){
					if(hasWowtipMark(c[i].nodeValue)){
						rt.push(c[i]);
					}
				}else if(c[i].nodeType == ELEMENT_NODE){
					if(c[i].nodeName != 'PRE' 
					&& c[i].nodeName != 'TEXTAREA'
					&& c[i].nodeName != 'A'
					&& c[i].className != 'blockcode' //DISCUZ 
					&& c[i].className != 'blockquote2' //PHPWIND TODO make 
					){
						find(c[i]);
					}
				}
			}
		}

		find(root);
		return rt;
	}
	// }}} findAll

	var refreshCache = function(root){
		// {{{ handle reg div char 
		var divs = root.getElementsByTagName('DIV');
		for(var j = 0; j < divs.length; j++){
			if(divs[j].getAttribute('char_uid')){
				var uid = divs[j].getAttribute('char_uid');

				if(CharseterDivMap[uid]){
					CharseterDivMap[uid].push(divs[j]);
				}else{
					CharseterDivMap[uid] = [divs[j]];
				}

				if(CharseterCache[uid]){
					drawCharDiv(divs[j], CharseterCache[uid]);
				}
			}
		}
		// }}} handle reg div char 

		// {{{ handle reg a link (mouse event)
		var links = root.getElementsByTagName('A');
		for(var j = 0; j < links.length; j++){
			if(links[j].getAttribute('item_uid')){
				var uid = links[j].getAttribute('item_uid');
				if(ItemAMap[uid]){
					ItemAMap[uid].push(links[j]);
				}else{
					ItemAMap[uid] = [links[j]];
				}

				if(ItemCache[uid]){
					colorLink(links[j], ItemCache[uid]);
				}
				attachE(links[j]);
			}
		}
		// }}} handle reg a link (mouse event)
	}

	var colorLink = function(l, d){
		if(d.color){
			l.className += ' ' + d.color;
			l.href = (WoWBnServers[d.lang] ? WoWBnServers[d.lang] : WoWBnServers).item(d.wow_id);
			l.target = '_blank';
		}
	}

	var drawCharDiv = function(div, d){
		var name = div.getAttribute("name");
		var realm = div.getAttribute("realm");
		var lang = div.getAttribute("lang");
		var text = '';

		var ws = WoWBnServers[lang] ? WoWBnServers[lang] : WoWBnServers;
		var _div = document.createElement("div"); //Fuck IE
		_div.className = 'inner';

		text += '<div><a href="' + encodeURI(ws.character(realm ,name)) +'" target="_blank" style="font-size:1.2em;font-weight:blod">' + name + '</a>';
		if(d.name){
			div.style.background = 'url('+ ws.avatar(d.icon) +') no-repeat scroll 30%';
			text += '&nbsp;LV:'+ d.level + '</div>';
			text += '<div>' + d.talent + '</div>';
			text += '<div>';
			for (var i in d.items){
				var data = d.items[i].data;
				ItemCache[d.items[i].id + '_' + lang + '_' + data] = {};
				text += _item(d.items[i].id, '<img src="'+ ws.icon(d.items[i].icon, 18)+'" />', lang, data);
			}
			text += '</div>';
		}else{
			div.style.background = 'url('+ ws.avatar() +') no-repeat scroll 30%';
			text += '<div>NOT FOUND</div>';
		}
		_div.innerHTML = text;
		while(div.firstChild){
			div.removeChild(div.firstChild);
		}
		div.appendChild(_div);
		refreshCache(div);
	}

	// {{{ replaceALL
	var replaceAll = function(root){
		var all = findAll(root);
		for(var i in all){
			var text = all[i].nodeValue;
			for(var j in regx){
				text = text.replace(regx[j].regx, regx[j].func);
			}
			var s = document.createElement("span");
			s.innerHTML = text;

			refreshCache(s);

			all[i].parentNode.replaceChild(s, all[i])
		}
	}
	// }}} replaceALL


	DomReady.ready(function(){

		replaceAll(document.body);

		var notEmpty = function(o){
			for(var i in o){
			return true;
			}
			return false;
		}

		if( notEmpty(ItemAMap) || notEmpty(CharseterDivMap)){
		// {{{ add CSS
			var h = document.getElementsByTagName("head")[0];
			var l = document.createElement("link");
			l.setAttribute("type","text/css");
			l.setAttribute("rel","stylesheet");
			l.setAttribute("href",WowTipServer + "wowtip.css");
			h.appendChild(l);
			// }}} add CSS
			document.body.appendChild(toolTip);
		}
	});

	return {
		// {{{ refresh_item
		refresh_item: function(d){
			if(d.error == 0){
				ItemCache[d.uid] = d; 

				var aa = ItemAMap[d.uid];
				if(aa){
					for(var i = 0; i < aa.length; i++){
						colorLink(aa[i] ,d );
					}
				}
			}else{
				ItemCache[d.uid] = ItemErrorD;
			}
			if(ItemCache[CurrentUid]){
				show(ItemCache[CurrentUid].tip);
			}
		}
		// }}} refresh_item
		,
		refresh_char: function(d){
			if(d.error == 0){
				CharseterCache[d.uid] = d;
			}else{
				//TODO
				d = CharseterCache[d.uid] = {
					uid : d.uid

				}
			}

			var dd = CharseterDivMap[d.uid]

			if(dd){
				for(var i = 0; i < dd.length; i++){
					drawCharDiv(dd[i] ,d );
				}
			}
		}
		,
		refresh_web: function(){
			replaceAll(document.body);
		},
		set_lang: function(lang){
			DefaultLang = lang;
		}
	};

})();
