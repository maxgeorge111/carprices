/*
	Eventually by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function() {

	"use strict";

	var	$body = document.querySelector('body');

	// Methods/polyfills.

	// classList | (c) @remy | github.com/remy/polyfills | rem.mit-license.org
	!function(){function t(t){this.el=t;for(var n=t.className.replace(/^\s+|\s+$/g,"").split(/\s+/),i=0;i<n.length;i++)e.call(this,n[i])}function n(t,n,i){Object.defineProperty?Object.defineProperty(t,n,{get:i}):t.__defineGetter__(n,i)}if(!("undefined"==typeof window.Element||"classList"in document.documentElement)){var i=Array.prototype,e=i.push,s=i.splice,o=i.join;t.prototype={add:function(t){this.contains(t)||(e.call(this,t),this.el.className=this.toString())},contains:function(t){return-1!=this.el.className.indexOf(t)},item:function(t){return this[t]||null},remove:function(t){if(this.contains(t)){for(var n=0;n<this.length&&this[n]!=t;n++);s.call(this,n,1),this.el.className=this.toString()}},toString:function(){return o.call(this," ")},toggle:function(t){return this.contains(t)?this.remove(t):this.add(t),this.contains(t)}},window.DOMTokenList=t,n(Element.prototype,"classList",function(){return new t(this)})}}();

	// canUse
	window.canUse=function(p){if(!window._canUse)window._canUse=document.createElement("div");var e=window._canUse.style,up=p.charAt(0).toUpperCase()+p.slice(1);return p in e||"Moz"+up in e||"Webkit"+up in e||"O"+up in e||"ms"+up in e};

	// window.addEventListener
	(function(){if("addEventListener"in window)return;window.addEventListener=function(type,f){window.attachEvent("on"+type,f)}})();

	(function() {
		// Vars.
		var	$wrapper, $bg;

		// Create BG wrapper, BGs.
		$wrapper = document.createElement('div');
		$wrapper.id = 'bg';
		$body.appendChild($wrapper);

		// Create BG.
		$bg = document.createElement('div');
		$bg.style.backgroundImage = 'url("images/bg01.jpg")';
		$bg.style.backgroundPosition = 'center';
		$wrapper.appendChild($bg);

		// Main loop.
		$bg.classList.add('visible');
		$bg.classList.add('top');
	})();

	// Predict form
	(function() {
		// Vars.
		var $form = document.querySelectorAll('#signup-form')[0],
			$submit = document.querySelectorAll('#signup-form input[type="submit"]')[0],
			$message;

		// Bail if addEventListener isn't supported.
		if (!('addEventListener' in $form))
			return;

		// Message.
		$message = document.createElement('span');
		$message.classList.add('message');
		$form.appendChild($message);

		$message._show = function(type, text) {
			$message.innerHTML = text;
			$message.classList.remove('failure', 'success');
			$message.classList.add(type, 'visible');
		};

		$message._hide = function() {
			$message.classList.remove('visible');
		};

		// Events
		$form.addEventListener("submit", function(event) {
			event.stopPropagation();
			event.preventDefault();

			$message._hide();
			
			let make = document.getElementById("make").value;
			let model = document.getElementById("model").value;
			let year = document.getElementById("year").value;
			let mileage = document.getElementById("mileage").value;

			if (!make || !model || !year || !mileage) {
				$message._show('failure', 'Please fill in all fields.');
				return;
			}

			$submit.disabled = true;

			fetch("https://3ttgjnibkj.execute-api.us-east-1.amazonaws.com/DEV/predict", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ make, model, year: parseInt(year), mileage: parseInt(mileage) })
			})
			.then(response => response.json())
			.then(data => {
				$submit.disabled = false;
				
				if (data.error) {
					$message._show('failure', 'Something went wrong. Please try again.');
				} else {
					$message._show('success', data.body);
				}
			})
			.catch(error => console.error("Error:", error));
		});
	})();
})();
