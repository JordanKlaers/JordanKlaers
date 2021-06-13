/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://localhost:9000";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/ie11CustomProperties.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/ie11CustomProperties.js":
/*!*************************************!*\
  !*** ./src/ie11CustomProperties.js ***!
  \*************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

/*! ie11CustomProperties.js v3.0.6 | MIT License | https://git.io/fjXMN */
!function () {
  'use strict'; // check for support

  var testEl = document.createElement('i');
  testEl.style.setProperty('--x', 'y');
  if (testEl.style.getPropertyValue('--x') === 'y' || !testEl.msMatchesSelector) return;
  if (!Element.prototype.matches) Element.prototype.matches = Element.prototype.msMatchesSelector;
  var listeners = [],
      root = document,
      Observer;

  function qsa(el, selector) {
    try {
      return el.querySelectorAll(selector);
    } catch (e) {
      // console.warn('the Selector '+selector+' can not be parsed');
      return [];
    }
  }

  function onElement(selector, callback) {
    var listener = {
      selector: selector,
      callback: callback,
      elements: new WeakMap()
    };
    var els = qsa(root, listener.selector),
        i = 0,
        el;

    while (el = els[i++]) {
      listener.elements.set(el, true);
      listener.callback.call(el, el);
    }

    listeners.push(listener);

    if (!Observer) {
      Observer = new MutationObserver(checkMutations);
      Observer.observe(root, {
        childList: true,
        subtree: true
      });
    }

    checkListener(listener);
  }

  ;

  function checkListener(listener, target) {
    var i = 0,
        el,
        els = [];

    try {
      target && target.matches(listener.selector) && els.push(target);
    } catch (e) {}

    if (loaded) {
      // ok? check inside node on innerHTML - only when loaded
      Array.prototype.push.apply(els, qsa(target || root, listener.selector));
    }

    while (el = els[i++]) {
      if (listener.elements.has(el)) continue;
      listener.elements.set(el, true);
      listener.callback.call(el, el);
    }
  }

  function checkListeners(inside) {
    var i = 0,
        listener;

    while (listener = listeners[i++]) {
      checkListener(listener, inside);
    }
  }

  function checkMutations(mutations) {
    var j = 0,
        i,
        mutation,
        nodes,
        target;

    while (mutation = mutations[j++]) {
      nodes = mutation.addedNodes, i = 0;

      while (target = nodes[i++]) {
        target.nodeType === 1 && checkListeners(target);
      }
    }
  }

  var loaded = false;
  document.addEventListener('DOMContentLoaded', function () {
    loaded = true;
  }); // svg polyfills

  function copyProperty(prop, from, to) {
    var desc = Object.getOwnPropertyDescriptor(from, prop);
    Object.defineProperty(to, prop, desc);
  }

  if (!('classList' in Element.prototype)) {
    copyProperty('classList', HTMLElement.prototype, Element.prototype);
  }

  if (!('innerHTML' in Element.prototype)) {
    copyProperty('innerHTML', HTMLElement.prototype, Element.prototype);
  }

  if (!('sheet' in SVGStyleElement.prototype)) {
    Object.defineProperty(SVGStyleElement.prototype, 'sheet', {
      get: function get() {
        var all = document.styleSheets,
            i = 0,
            sheet;

        while (sheet = all[i++]) {
          if (sheet.ownerNode === this) return sheet;
        }
      }
    });
  } // main logic
  // cached regexps, better performance


  var regFindSetters = /([\s{;])(--([A-Za-z0-9-_]*)\s*:([^;!}{]+)(!important)?)(?=\s*([;}]|$))/g;
  var regFindGetters = /([{;]\s*)([A-Za-z0-9-_]+\s*:[^;}{]*var\([^!;}{]+)(!important)?(?=\s*([;}$]|$))/g;
  var regRuleIEGetters = /-ieVar-([^:]+):/g;
  var regRuleIESetters = /-ie-([^};]+)/g; //const regHasVar = /var\(/;

  var regPseudos = /:(hover|active|focus|target|:before|:after|:first-letter|:first-line)/;
  onElement('link[rel="stylesheet"]', function (el) {
    fetchCss(el.href, function (css) {
      var newCss = rewriteCss(css);
      if (css === newCss) return;
      newCss = relToAbs(el.href, newCss);
      el.disabled = true;
      var style = document.createElement('style');
      if (el.media) style.setAttribute('media', el.media);
      el.parentNode.insertBefore(style, el);
      activateStyleElement(style, newCss);
    });
  });

  function foundStyle(el) {
    if (el.ieCP_polyfilled) return;
    if (el.ieCP_elementSheet) return;
    var css = el.innerHTML;
    var newCss = rewriteCss(css);
    if (css === newCss) return;
    activateStyleElement(el, newCss);
  }

  onElement('style', foundStyle); // immediate, to pass w3c-tests, bud its a bad idea
  // addEventListener('DOMNodeInserted',function(e){ e.target.tagName === 'STYLE' && foundStyle(e.target); });

  onElement('[ie-style]', function (el) {
    var newCss = rewriteCss('{' + el.getAttribute('ie-style')).substr(1);
    el.style.cssText += ';' + newCss;
    var found = parseRewrittenStyle(el.style);
    if (found.getters) addGetterElement(el, found.getters, '%styleAttr');
    if (found.setters) addSetterElement(el, found.setters);
  });

  function relToAbs(base, css) {
    return css.replace(/url\(([^)]+)\)/g, function ($0, $1) {
      $1 = $1.trim().replace(/(^['"]|['"]$)/g, '');
      if ($1.match(/^([a-z]+:|\/)/)) return $0;
      base = base.replace(/\?.*/, '');
      return 'url(' + base + './../' + $1 + ')';
    });
  } // ie has a bug, where unknown properties at pseudo-selectors are computed at the element
  // #el::after { -content:'x'; } => getComputedStyle(el)['-content'] == 'x'
  // should we add something like -ieVar-pseudo_after-content:'x'?


  function rewriteCss(css) {
    /* uncomment if spec finished and needed by someone
    css = css.replace(/@property ([^{]+){([^}]+)}/, function($0, prop, body){
    	prop = prop.trim();
    	const declaration = {name:prop};
    	body.split(';').forEach(function(pair){
    		const x = pair.split(':');
    		if (x[1]) declaration[ x[0].trim() ] = x[1];
    	});
    	declaration['inherits'] = declaration['inherits'].trim()==='true' ? true : false;
    	declaration['initialValue'] = declaration['initial-value'];
    	CSS.registerProperty(declaration)
    	return '/*\n @property ... removed \n*'+'/';
    });
    */
    return css.replace(regFindSetters, function ($0, $1, $2, $3, $4, important) {
      return $1 + '-ie-' + (important ? '❗' : '') + $3 + ':' + encodeValue($4);
    }).replace(regFindGetters, function ($0, $1, $2, important) {
      return $1 + '-ieVar-' + (important ? '❗' : '') + $2 + '; ' + $2; // keep the original, so chaining works "--x:var(--y)"
    });
  }

  function encodeValue(value) {
    return value;
    return value.replace(/ /g, '␣');
  }

  var keywords = {
    initial: 1,
    inherit: 1,
    revert: 1,
    unset: 1
  };

  function decodeValue(value) {
    return value;
    if (value === undefined) return;
    value = value.replace(/␣/g, ' ');
    var trimmed = value.trim();
    if (keywords[trimmed]) return trimmed;
    return value;
  } // beta


  var styles_of_getter_properties = {};

  function parseRewrittenStyle(style) {
    // less memory then parameter cssText?
    // beta
    style['z-index']; // ie11 can access unknown properties in stylesheets only if accessed a dashed known property

    var cssText = style.cssText;
    var matchesGetters = cssText.match(regRuleIEGetters),
        j,
        match;

    if (matchesGetters) {
      var getters = []; // eg. [border,color]

      for (j = 0; match = matchesGetters[j++];) {
        var propName = match.slice(7, -1);
        if (propName[0] === '❗') propName = propName.substr(1);
        getters.push(propName); // beta

        if (!styles_of_getter_properties[propName]) styles_of_getter_properties[propName] = [];
        styles_of_getter_properties[propName].push(style);
      }
    }

    var matchesSetters = cssText.match(regRuleIESetters);

    if (matchesSetters) {
      var setters = {}; // eg. [--color:#fff, --padding:10px];

      for (j = 0; match = matchesSetters[j++];) {
        var x = match.substr(4).split(':');
        var _propName = x[0];
        var propValue = x[1];
        if (_propName[0] === '❗') _propName = _propName.substr(1);
        setters[_propName] = propValue;
      }
    }

    return {
      getters: getters,
      setters: setters
    };
  }

  function activateStyleElement(style, css) {
    style.innerHTML = css;
    style.ieCP_polyfilled = true;
    var rules = style.sheet.rules,
        i = 0,
        rule; // cssRules = CSSRuleList, rules = MSCSSRuleList

    while (rule = rules[i++]) {
      var found = parseRewrittenStyle(rule.style);
      if (found.getters) addGettersSelector(rule.selectorText, found.getters);
      if (found.setters) addSettersSelector(rule.selectorText, found.setters); // mediaQueries: redraw the hole document
      // better add events for each element?

      var media = rule.parentRule && rule.parentRule.media && rule.parentRule.media.mediaText;

      if (media && (found.getters || found.setters)) {
        matchMedia(media).addListener(function () {
          drawTree(document.documentElement);
        });
      }
    } // beta


    redrawStyleSheets();
  }

  function addGettersSelector(selector, properties) {
    selectorAddPseudoListeners(selector);
    onElement(unPseudo(selector), function (el) {
      addGetterElement(el, properties, selector);
      drawElement(el);
    });
  }

  function addGetterElement(el, properties, selector) {
    var i = 0,
        prop,
        j;
    var selectors = selector.split(','); // split grouped selectors

    el.setAttribute('iecp-needed', true);
    if (!el.ieCPSelectors) el.ieCPSelectors = {};

    while (prop = properties[i++]) {
      for (j = 0; selector = selectors[j++];) {
        var parts = selector.trim().split('::');
        if (!el.ieCPSelectors[prop]) el.ieCPSelectors[prop] = [];
        el.ieCPSelectors[prop].push({
          selector: parts[0],
          pseudo: parts[1] ? '::' + parts[1] : ''
        });
      }
    }
  }

  function addSettersSelector(selector, propVals) {
    selectorAddPseudoListeners(selector);
    onElement(unPseudo(selector), function (el) {
      addSetterElement(el, propVals);
    });
  }

  function addSetterElement(el, propVals) {
    if (!el.ieCP_setters) el.ieCP_setters = {};

    for (var prop in propVals) {
      // eg. {foo:#fff, bar:baz}
      el.ieCP_setters['--' + prop] = 1;
    }

    drawTree(el);
  } //beta


  function redrawStyleSheets() {
    for (var prop in styles_of_getter_properties) {
      var styles = styles_of_getter_properties[prop];

      for (var i = 0, style; style = styles[i++];) {
        if (style.owningElement) continue;
        var value = style['-ieVar-' + prop];
        if (!value) continue;
        value = styleComputeValueWidthVars(getComputedStyle(document.documentElement), value);
        if (value === '') continue;

        try {
          style[prop] = value;
        } catch (e) {}
      }
    }
  }

  var pseudos = {
    hover: {
      on: 'mouseenter',
      off: 'mouseleave'
    },
    focus: {
      on: 'focusin',
      off: 'focusout'
    },
    active: {
      on: 'CSSActivate',
      off: 'CSSDeactivate'
    }
  };

  function selectorAddPseudoListeners(selector) {
    // ie11 has the strange behavoir, that groups of selectors are individual rules, but starting with the full selector:
    // td, th, button { color:red } results in this rules:
    // "td, th, button" | "th, th" | "th"
    selector = selector.split(',')[0];

    for (var pseudo in pseudos) {
      var parts = selector.split(':' + pseudo);

      if (parts.length > 1) {
        var ending;

        (function () {
          ending = parts[1].match(/^[^\s]*/); // ending elementpart of selector (used for not(:active))

          var sel = unPseudo(parts[0] + ending);
          var listeners = pseudos[pseudo];
          onElement(sel, function (el) {
            el.addEventListener(listeners.on, drawTreeEvent);
            el.addEventListener(listeners.off, drawTreeEvent);
          });
        })();
      }
    }
  }

  var CSSActive = null;
  document.addEventListener('mousedown', function (e) {
    setTimeout(function () {
      if (e.target === document.activeElement) {
        var evt = document.createEvent('Event');
        evt.initEvent('CSSActivate', true, true);
        CSSActive = e.target;
        CSSActive.dispatchEvent(evt);
      }
    });
  });
  document.addEventListener('mouseup', function () {
    if (CSSActive) {
      var evt = document.createEvent('Event');
      evt.initEvent('CSSDeactivate', true, true);
      CSSActive.dispatchEvent(evt);
      CSSActive = null;
    }
  });

  function unPseudo(selector) {
    return selector.replace(regPseudos, '').replace(':not()', '');
  }

  var uniqueCounter = 0;
  /* old *
  function _drawElement(el) {
  	if (!el.ieCP_unique) { // use el.uniqueNumber? but needs class for the css-selector => test performance
  		el.ieCP_unique = ++uniqueCounter;
  		el.classList.add('iecp-u' + el.ieCP_unique);
  	}
  	var style = getComputedStyle(el);
  	if (el.ieCP_sheet) while (el.ieCP_sheet.rules[0]) el.ieCP_sheet.deleteRule(0);
  	for (var prop in el.ieCPSelectors) {
  		var important = style['-ieVar-❗' + prop];
  		let valueWithVar = important || style['-ieVar-' + prop];
  		if (!valueWithVar) continue; // todo, what if '0'
  
  		var details = {};
  		var value = styleComputeValueWidthVars(style, valueWithVar, details);
  
  		if (important) value += ' !important';
  		for (var i=0, item; item=el.ieCPSelectors[prop][i++];) { // todo: split and use requestAnimationFrame?
  			if (item.selector === '%styleAttr') {
  				el.style[prop] = value;
  			} else {
  
  				// beta
  				if (!important && details.allByRoot !== false) continue; // dont have to draw root-properties
  
  				//let selector = item.selector.replace(/>? \.[^ ]+/, ' ', item.selector); // todo: try to equalize specificity
  				let selector = item.selector;
  				elementStyleSheet(el).insertRule(selector + '.iecp-u' + el.ieCP_unique + item.pseudo + ' {' + prop + ':' + value + '}', 0);
  			}
  		}
  	}
  }
  function elementStyleSheet(el){
  	if (!el.ieCP_sheet) {
  		const styleEl = document.createElement('style');
  		styleEl.ieCP_elementSheet = 1;
  		//el.appendChild(styleEl); // yes! self-closing tags can have style as children, but - if i set innerHTML, the stylesheet is lost
  		document.head.appendChild(styleEl);
  		el.ieCP_sheet = styleEl.sheet;
  	}
  	return el.ieCP_sheet;
  }
  
  /* */

  function _drawElement(el) {
    if (!el.ieCP_unique) {
      // use el.uniqueNumber? but needs class for the css-selector => test performance
      el.ieCP_unique = ++uniqueCounter;
      el.classList.add('iecp-u' + el.ieCP_unique);
    }

    var style = getComputedStyle(el);
    var css = '';

    for (var prop in el.ieCPSelectors) {
      var important = style['-ieVar-❗' + prop];
      var valueWithVar = important || style['-ieVar-' + prop];
      if (!valueWithVar) continue; // todo, what if '0'

      var details = {};
      var value = styleComputeValueWidthVars(style, valueWithVar, details); //if (value==='initial') value = initials[prop];

      if (important) value += ' !important';

      for (var i = 0, item; item = el.ieCPSelectors[prop][i++];) {
        // todo: split and use requestAnimationFrame?
        if (item.selector === '%styleAttr') {
          el.style[prop] = value;
        } else {
          // beta
          if (!important && details.allByRoot !== false) continue; // dont have to draw root-properties
          //let selector = item.selector.replace(/>? \.[^ ]+/, ' ', item.selector); // todo: try to equalize specificity

          var selector = item.selector;
          css += selector + '.iecp-u' + el.ieCP_unique + item.pseudo + '{' + prop + ':' + value + '}\n';
        }
      }
    }

    elementSetCss(el, css);
  }

  function elementSetCss(el, css) {
    if (!el.ieCP_styleEl && css) {
      var styleEl = document.createElement('style');
      styleEl.ieCP_elementSheet = 1; //el.appendChild(styleEl); // yes! self-closing tags can have style as children, but - if i set innerHTML, the stylesheet is lost

      document.head.appendChild(styleEl);
      el.ieCP_styleEl = styleEl;
    }

    if (el.ieCP_styleEl) el.ieCP_styleEl.innerHTML = css;
  }
  /* */


  function drawTree(target) {
    if (!target) return;
    var els = target.querySelectorAll('[iecp-needed]');
    if (target.hasAttribute && target.hasAttribute('iecp-needed')) drawElement(target); // self

    for (var i = 0, el; el = els[i++];) {
      drawElement(el);
    } // tree

  } // draw queue


  var drawQueue = new Set();
  var collecting = false;
  var drawing = false;

  function drawElement(el) {
    drawQueue.add(el);
    if (collecting) return;
    collecting = true;
    requestAnimationFrame(function () {
      //setImmediate(function(){
      collecting = false;
      drawing = true;
      drawQueue.forEach(_drawElement);
      drawQueue.clear();
      setTimeout(function () {
        // mutationObserver will trigger delayed, requestAnimationFrame will miss some changes
        drawing = false;
      });
    });
  }

  function drawTreeEvent(e) {
    drawTree(e.target);
  }

  function findVars(str, cb) {
    // css value parser
    var level = 0,
        openedLevel = null,
        lastPoint = 0,
        newStr = '',
        i = 0,
        _char,
        insideCalc;

    while (_char = str[i++]) {
      if (_char === '(') {
        ++level;

        if (openedLevel === null && str[i - 4] + str[i - 3] + str[i - 2] === 'var') {
          openedLevel = level;
          newStr += str.substring(lastPoint, i - 4);
          lastPoint = i;
        }

        if (str[i - 5] + str[i - 4] + str[i - 3] + str[i - 2] === 'calc') {
          insideCalc = level;
        }
      }

      if (_char === ')' && openedLevel === level) {
        var variable = str.substring(lastPoint, i - 1).trim(),
            fallback = void 0;
        var x = variable.indexOf(',');

        if (x !== -1) {
          fallback = variable.slice(x + 1);
          variable = variable.slice(0, x);
        }

        newStr += cb(variable, fallback, insideCalc);
        lastPoint = i;
        openedLevel = null;
      }

      if (_char === ')') {
        --level;
        if (insideCalc === level) insideCalc = null;
      }
    }

    newStr += str.substring(lastPoint);
    return newStr;
  }

  function styleComputeValueWidthVars(style, valueWithVars, details) {
    return findVars(valueWithVars, function (variable, fallback, insideCalc) {
      var value = style.getPropertyValue(variable);
      if (insideCalc) value = value.replace(/^calc\(/, '('); // prevent nested calc

      if (details && style.lastPropertyServedBy !== document.documentElement) details.allByRoot = false;
      if (value === '' && fallback) value = styleComputeValueWidthVars(style, fallback, details);
      return value;
    });
  } // mutation listener


  var observer = new MutationObserver(function (mutations) {
    if (drawing) return;

    for (var i = 0, mutation; mutation = mutations[i++];) {
      if (mutation.attributeName === 'iecp-needed') continue; // why?
      // recheck all selectors if it targets new elements?

      drawTree(mutation.target);
    }
  });
  setTimeout(function () {
    observer.observe(document, {
      attributes: true,
      subtree: true
    });
  }); // :target listener

  var oldHash = location.hash;
  addEventListener('hashchange', function (e) {
    var newEl = document.getElementById(location.hash.substr(1));

    if (newEl) {
      var oldEl = document.getElementById(oldHash.substr(1));
      drawTree(newEl);
      drawTree(oldEl);
    } else {
      drawTree(document);
    }

    oldHash = location.hash;
  }); // add owningElement to Element.style

  var descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'style');
  var styleGetter = descriptor.get;

  descriptor.get = function () {
    var style = styleGetter.call(this);
    style.owningElement = this;
    return style;
  };

  Object.defineProperty(HTMLElement.prototype, 'style', descriptor); // add computedFor to computed style-objects

  var originalGetComputed = getComputedStyle;

  window.getComputedStyle = function (el) {
    var style = originalGetComputed.apply(this, arguments);
    style.computedFor = el; //style.pseudoElt = pseudoElt; //not needed at the moment

    return style;
  }; // getPropertyValue / setProperty hooks


  var StyleProto = CSSStyleDeclaration.prototype;
  var oldGetP = StyleProto.getPropertyValue;

  StyleProto.getPropertyValue = function (property) {
    this.lastPropertyServedBy = false;
    property = property.trim();
    /* *
    if (this.owningElement) {
    	const ieProperty = '-ieVar-'+property;
    	const iePropertyImportant = '-ieVar-❗'+property;
    	let value = this[iePropertyImportant] || this[ieProperty];
    	if (value !== undefined) {
    		// todo, test if syntax valid
    		return value;
    	}
    }
    /* */

    if (property[0] !== '-' || property[1] !== '-') return oldGetP.apply(this, arguments);
    var undashed = property.substr(2);
    var ieProperty = '-ie-' + undashed;
    var iePropertyImportant = '-ie-❗' + undashed;
    var value = decodeValue(this[iePropertyImportant] || this[ieProperty]);

    if (this.computedFor) {
      // computedStyle
      if (value !== undefined && !inheritingKeywords[value]) {
        //if (regHasVar.test(value))  // todo: to i need this check?!!! i think its faster without
        value = styleComputeValueWidthVars(this, value);
        this.lastPropertyServedBy = this.computedFor;
      } else {
        // inherited
        if (inheritingKeywords[value] || !register[property] || register[property].inherits) {
          //let el = this.pseudoElt ? this.computedFor : this.computedFor.parentNode;
          var el = this.computedFor.parentNode;

          while (el.nodeType === 1) {
            // how slower would it be to getComputedStyle for every element, not just with defined ieCP_setters
            if (el.ieCP_setters && el.ieCP_setters[property]) {
              // i could make
              // value = el.nodeType ? getComputedStyle(this.computedFor.parentNode).getPropertyValue(property)
              // but i fear performance, stupid?
              var style = getComputedStyle(el);
              var tmpVal = decodeValue(style[iePropertyImportant] || style[ieProperty]);

              if (tmpVal !== undefined) {
                // calculated style from current element not from the element the value was inherited from! (style, value)
                //value = tmpVal; if (regHasVar.test(tmpVal))  // todo: to i need this check?!!! i think its faster without
                value = styleComputeValueWidthVars(this, tmpVal);
                this.lastPropertyServedBy = el;
                break;
              }
            }

            el = el.parentNode;
          }
        }
      }

      if (value === 'initial') return '';
    } //if ((value === undefined || value === 'initial') && register[property]) value = register[property].initialValue; // todo?


    if (value === undefined && register[property]) value = register[property].initialValue;
    if (value === undefined) return '';
    return value;
  };

  var inheritingKeywords = {
    inherit: 1,
    revert: 1,
    unset: 1
  };
  var oldSetP = StyleProto.setProperty;

  StyleProto.setProperty = function (property, value, prio) {
    if (property[0] !== '-' || property[1] !== '-') return oldSetP.apply(this, arguments);
    var el = this.owningElement;

    if (el) {
      if (!el.ieCP_setters) el.ieCP_setters = {};
      el.ieCP_setters[property] = 1;
    }

    property = '-ie-' + (prio === 'important' ? '❗' : '') + property.substr(2);
    this.cssText += '; ' + property + ':' + encodeValue(value) + ';'; //this[property] = value;

    el === document.documentElement && redrawStyleSheets();
    el && drawTree(el); // its delayed internal
  };
  /*
  var descriptor = Object.getOwnPropertyDescriptor(StyleProto, 'cssText');
  var cssTextGetter = descriptor.get;
  var cssTextSetter = descriptor.set;
  // descriptor.get = function () {
  // 	const style = styleGetter.call(this);
  // 	style.owningElement = this;
  // 	return style;
  // }
  descriptor.set = function (css) {
  	var el = this.owningElement;
  	if (el) {
  		css = rewriteCss('{'+css).substr(1);
  		cssTextSetter.call(this, css);
  		var found = parseRewrittenStyle(this);
  		if (found.getters) addGetterElement(el, found.getters, '%styleAttr');
  		if (found.setters) addSetterElement(el, found.setters);
  		return;
  	}
  	return cssTextSetter.call(this, css);
  }
  Object.defineProperty(StyleProto, 'cssText', descriptor);
  */


  if (!window.CSS) window.CSS = {};
  var register = {};

  CSS.registerProperty = function (options) {
    register[options.name] = options;
  }; // fix "initial" keyword with generated custom properties, this is not supported ad all by ie, should i make a separate "inherit"-polyfill?

  /*
  const computed = getComputedStyle(document.documentElement)
  const initials = {};
  for (let i in computed) {
  	initials[i.replace(/([A-Z])/, function(x){ return '-'+x.toLowerCase(x) })] = computed[i];
  }
  initials['display'] = 'inline';
  */
  // utils


  function fetchCss(url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.overrideMimeType('text/css');

    request.onload = function () {
      if (request.status >= 200 && request.status < 400) {
        callback(request.responseText);
      }
    };

    request.send();
  }
}();

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2llMTFDdXN0b21Qcm9wZXJ0aWVzLmpzIl0sIm5hbWVzIjpbInRlc3RFbCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInN0eWxlIiwic2V0UHJvcGVydHkiLCJnZXRQcm9wZXJ0eVZhbHVlIiwibXNNYXRjaGVzU2VsZWN0b3IiLCJFbGVtZW50IiwicHJvdG90eXBlIiwibWF0Y2hlcyIsImxpc3RlbmVycyIsInJvb3QiLCJPYnNlcnZlciIsInFzYSIsImVsIiwic2VsZWN0b3IiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZSIsIm9uRWxlbWVudCIsImNhbGxiYWNrIiwibGlzdGVuZXIiLCJlbGVtZW50cyIsIldlYWtNYXAiLCJlbHMiLCJpIiwic2V0IiwiY2FsbCIsInB1c2giLCJNdXRhdGlvbk9ic2VydmVyIiwiY2hlY2tNdXRhdGlvbnMiLCJvYnNlcnZlIiwiY2hpbGRMaXN0Iiwic3VidHJlZSIsImNoZWNrTGlzdGVuZXIiLCJ0YXJnZXQiLCJsb2FkZWQiLCJBcnJheSIsImFwcGx5IiwiaGFzIiwiY2hlY2tMaXN0ZW5lcnMiLCJpbnNpZGUiLCJtdXRhdGlvbnMiLCJqIiwibXV0YXRpb24iLCJub2RlcyIsImFkZGVkTm9kZXMiLCJub2RlVHlwZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJjb3B5UHJvcGVydHkiLCJwcm9wIiwiZnJvbSIsInRvIiwiZGVzYyIsIk9iamVjdCIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImRlZmluZVByb3BlcnR5IiwiSFRNTEVsZW1lbnQiLCJTVkdTdHlsZUVsZW1lbnQiLCJnZXQiLCJhbGwiLCJzdHlsZVNoZWV0cyIsInNoZWV0Iiwib3duZXJOb2RlIiwicmVnRmluZFNldHRlcnMiLCJyZWdGaW5kR2V0dGVycyIsInJlZ1J1bGVJRUdldHRlcnMiLCJyZWdSdWxlSUVTZXR0ZXJzIiwicmVnUHNldWRvcyIsImZldGNoQ3NzIiwiaHJlZiIsImNzcyIsIm5ld0NzcyIsInJld3JpdGVDc3MiLCJyZWxUb0FicyIsImRpc2FibGVkIiwibWVkaWEiLCJzZXRBdHRyaWJ1dGUiLCJwYXJlbnROb2RlIiwiaW5zZXJ0QmVmb3JlIiwiYWN0aXZhdGVTdHlsZUVsZW1lbnQiLCJmb3VuZFN0eWxlIiwiaWVDUF9wb2x5ZmlsbGVkIiwiaWVDUF9lbGVtZW50U2hlZXQiLCJpbm5lckhUTUwiLCJnZXRBdHRyaWJ1dGUiLCJzdWJzdHIiLCJjc3NUZXh0IiwiZm91bmQiLCJwYXJzZVJld3JpdHRlblN0eWxlIiwiZ2V0dGVycyIsImFkZEdldHRlckVsZW1lbnQiLCJzZXR0ZXJzIiwiYWRkU2V0dGVyRWxlbWVudCIsImJhc2UiLCJyZXBsYWNlIiwiJDAiLCIkMSIsInRyaW0iLCJtYXRjaCIsIiQyIiwiJDMiLCIkNCIsImltcG9ydGFudCIsImVuY29kZVZhbHVlIiwidmFsdWUiLCJrZXl3b3JkcyIsImluaXRpYWwiLCJpbmhlcml0IiwicmV2ZXJ0IiwidW5zZXQiLCJkZWNvZGVWYWx1ZSIsInVuZGVmaW5lZCIsInRyaW1tZWQiLCJzdHlsZXNfb2ZfZ2V0dGVyX3Byb3BlcnRpZXMiLCJtYXRjaGVzR2V0dGVycyIsInByb3BOYW1lIiwic2xpY2UiLCJtYXRjaGVzU2V0dGVycyIsIngiLCJzcGxpdCIsInByb3BWYWx1ZSIsInJ1bGVzIiwicnVsZSIsImFkZEdldHRlcnNTZWxlY3RvciIsInNlbGVjdG9yVGV4dCIsImFkZFNldHRlcnNTZWxlY3RvciIsInBhcmVudFJ1bGUiLCJtZWRpYVRleHQiLCJtYXRjaE1lZGlhIiwiYWRkTGlzdGVuZXIiLCJkcmF3VHJlZSIsImRvY3VtZW50RWxlbWVudCIsInJlZHJhd1N0eWxlU2hlZXRzIiwicHJvcGVydGllcyIsInNlbGVjdG9yQWRkUHNldWRvTGlzdGVuZXJzIiwidW5Qc2V1ZG8iLCJkcmF3RWxlbWVudCIsInNlbGVjdG9ycyIsImllQ1BTZWxlY3RvcnMiLCJwYXJ0cyIsInBzZXVkbyIsInByb3BWYWxzIiwiaWVDUF9zZXR0ZXJzIiwic3R5bGVzIiwib3duaW5nRWxlbWVudCIsInN0eWxlQ29tcHV0ZVZhbHVlV2lkdGhWYXJzIiwiZ2V0Q29tcHV0ZWRTdHlsZSIsInBzZXVkb3MiLCJob3ZlciIsIm9uIiwib2ZmIiwiZm9jdXMiLCJhY3RpdmUiLCJsZW5ndGgiLCJlbmRpbmciLCJzZWwiLCJkcmF3VHJlZUV2ZW50IiwiQ1NTQWN0aXZlIiwic2V0VGltZW91dCIsImFjdGl2ZUVsZW1lbnQiLCJldnQiLCJjcmVhdGVFdmVudCIsImluaXRFdmVudCIsImRpc3BhdGNoRXZlbnQiLCJ1bmlxdWVDb3VudGVyIiwiX2RyYXdFbGVtZW50IiwiaWVDUF91bmlxdWUiLCJjbGFzc0xpc3QiLCJhZGQiLCJ2YWx1ZVdpdGhWYXIiLCJkZXRhaWxzIiwiaXRlbSIsImFsbEJ5Um9vdCIsImVsZW1lbnRTZXRDc3MiLCJpZUNQX3N0eWxlRWwiLCJzdHlsZUVsIiwiaGVhZCIsImFwcGVuZENoaWxkIiwiaGFzQXR0cmlidXRlIiwiZHJhd1F1ZXVlIiwiU2V0IiwiY29sbGVjdGluZyIsImRyYXdpbmciLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJmb3JFYWNoIiwiY2xlYXIiLCJmaW5kVmFycyIsInN0ciIsImNiIiwibGV2ZWwiLCJvcGVuZWRMZXZlbCIsImxhc3RQb2ludCIsIm5ld1N0ciIsImNoYXIiLCJpbnNpZGVDYWxjIiwic3Vic3RyaW5nIiwidmFyaWFibGUiLCJmYWxsYmFjayIsImluZGV4T2YiLCJ2YWx1ZVdpdGhWYXJzIiwibGFzdFByb3BlcnR5U2VydmVkQnkiLCJvYnNlcnZlciIsImF0dHJpYnV0ZU5hbWUiLCJhdHRyaWJ1dGVzIiwib2xkSGFzaCIsImxvY2F0aW9uIiwiaGFzaCIsIm5ld0VsIiwiZ2V0RWxlbWVudEJ5SWQiLCJvbGRFbCIsImRlc2NyaXB0b3IiLCJzdHlsZUdldHRlciIsIm9yaWdpbmFsR2V0Q29tcHV0ZWQiLCJ3aW5kb3ciLCJhcmd1bWVudHMiLCJjb21wdXRlZEZvciIsIlN0eWxlUHJvdG8iLCJDU1NTdHlsZURlY2xhcmF0aW9uIiwib2xkR2V0UCIsInByb3BlcnR5IiwidW5kYXNoZWQiLCJpZVByb3BlcnR5IiwiaWVQcm9wZXJ0eUltcG9ydGFudCIsImluaGVyaXRpbmdLZXl3b3JkcyIsInJlZ2lzdGVyIiwiaW5oZXJpdHMiLCJ0bXBWYWwiLCJpbml0aWFsVmFsdWUiLCJvbGRTZXRQIiwicHJpbyIsIkNTUyIsInJlZ2lzdGVyUHJvcGVydHkiLCJvcHRpb25zIiwibmFtZSIsInVybCIsInJlcXVlc3QiLCJYTUxIdHRwUmVxdWVzdCIsIm9wZW4iLCJvdmVycmlkZU1pbWVUeXBlIiwib25sb2FkIiwic3RhdHVzIiwicmVzcG9uc2VUZXh0Iiwic2VuZCJdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUNBLENBQUMsWUFBWTtBQUNaLGVBRFksQ0FFWjs7QUFDQSxNQUFJQSxNQUFNLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QixHQUF2QixDQUFiO0FBQ0FGLFFB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Ozs7O0FBU0E7OztBQUNBLFdBQVNwSyxRQUFULENBQWtCc0ssR0FBbEIsRUFBdUJ2TixRQUF2QixFQUFpQztBQUNoQyxRQUFJd04sT0FBTyxHQUFHLElBQUlDLGNBQUosRUFBZDtBQUNBRCxXQUFPLENBQUNFLElBQVIsQ0FBYSxLQUFiLEVBQW9CSCxHQUFwQjtBQUNBQyxXQUFPLENBQUNHLGdCQUFSLENBQXlCLFVBQXpCOztBQUNBSCxXQUFPLENBQUNJLE1BQVIsR0FBaUIsWUFBWTtBQUM1QixVQUFJSixPQUFPLENBQUNLLE1BQVIsSUFBa0IsR0FBbEIsSUFBeUJMLE9BQU8sQ0FBQ0ssTUFBUixHQUFpQixHQUE5QyxFQUFtRDtBQUNsRDdOLGdCQUFRLENBQUN3TixPQUFPLENBQUNNLFlBQVQsQ0FBUjtBQUNBO0FBQ0QsS0FKRDs7QUFLQU4sV0FBTyxDQUFDTyxJQUFSO0FBQ0E7QUFFRCxDQTlyQkEsRUFBRCxDIiwiZmlsZSI6ImllQ1NTVmFyaWFibGVzX2hlYWQuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJodHRwOi8vbG9jYWxob3N0OjkwMDBcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaWUxMUN1c3RvbVByb3BlcnRpZXMuanNcIik7XG4iLCIvKiEgaWUxMUN1c3RvbVByb3BlcnRpZXMuanMgdjMuMC42IHwgTUlUIExpY2Vuc2UgfCBodHRwczovL2dpdC5pby9malhNTiAqL1xyXG4hZnVuY3Rpb24gKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHQvLyBjaGVjayBmb3Igc3VwcG9ydFxyXG5cdHZhciB0ZXN0RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpJyk7XHJcblx0dGVzdEVsLnN0eWxlLnNldFByb3BlcnR5KCctLXgnLCAneScpO1xyXG5cdGlmICh0ZXN0RWwuc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnLS14JykgPT09ICd5JyB8fCAhdGVzdEVsLm1zTWF0Y2hlc1NlbGVjdG9yKSByZXR1cm47XHJcblxyXG5cdGlmICghRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcykgRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcyA9IEVsZW1lbnQucHJvdG90eXBlLm1zTWF0Y2hlc1NlbGVjdG9yO1xyXG5cclxuICAgIHZhciBsaXN0ZW5lcnMgPSBbXSxcclxuICAgICAgICByb290ID0gZG9jdW1lbnQsXHJcbiAgICAgICAgT2JzZXJ2ZXI7XHJcblxyXG5cdGZ1bmN0aW9uIHFzYShlbCwgc2VsZWN0b3Ipe1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0cmV0dXJuIGVsLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xyXG5cdFx0fSBjYXRjaChlKSB7XHJcblx0XHRcdC8vIGNvbnNvbGUud2FybigndGhlIFNlbGVjdG9yICcrc2VsZWN0b3IrJyBjYW4gbm90IGJlIHBhcnNlZCcpO1xyXG5cdFx0XHRyZXR1cm4gW107XHJcblx0XHR9XHJcblx0fVxyXG4gICAgZnVuY3Rpb24gb25FbGVtZW50IChzZWxlY3RvciwgY2FsbGJhY2spIHtcclxuICAgICAgICB2YXIgbGlzdGVuZXIgPSB7XHJcbiAgICAgICAgICAgIHNlbGVjdG9yOiBzZWxlY3RvcixcclxuICAgICAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrLFxyXG4gICAgICAgICAgICBlbGVtZW50czogbmV3IFdlYWtNYXAoKSxcclxuICAgICAgICB9O1xyXG5cdFx0dmFyIGVscyA9IHFzYShyb290LCBsaXN0ZW5lci5zZWxlY3RvciksIGk9MCwgZWw7XHJcblx0XHR3aGlsZSAoZWwgPSBlbHNbaSsrXSkge1xyXG4gICAgICAgICAgICBsaXN0ZW5lci5lbGVtZW50cy5zZXQoZWwsIHRydWUpO1xyXG4gICAgICAgICAgICBsaXN0ZW5lci5jYWxsYmFjay5jYWxsKGVsLCBlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcclxuICAgICAgICBpZiAoIU9ic2VydmVyKSB7XHJcbiAgICAgICAgICAgIE9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoY2hlY2tNdXRhdGlvbnMpO1xyXG4gICAgICAgICAgICBPYnNlcnZlci5vYnNlcnZlKHJvb3QsIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHN1YnRyZWU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNoZWNrTGlzdGVuZXIobGlzdGVuZXIpO1xyXG4gICAgfTtcclxuICAgIGZ1bmN0aW9uIGNoZWNrTGlzdGVuZXIobGlzdGVuZXIsIHRhcmdldCkge1xyXG4gICAgICAgIHZhciBpID0gMCwgZWwsIGVscyA9IFtdO1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0dGFyZ2V0ICYmIHRhcmdldC5tYXRjaGVzKGxpc3RlbmVyLnNlbGVjdG9yKSAmJiBlbHMucHVzaCh0YXJnZXQpO1xyXG5cdFx0fSBjYXRjaChlKSB7fVxyXG4gICAgICAgIGlmIChsb2FkZWQpIHsgLy8gb2s/IGNoZWNrIGluc2lkZSBub2RlIG9uIGlubmVySFRNTCAtIG9ubHkgd2hlbiBsb2FkZWRcclxuICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoZWxzLCBxc2EodGFyZ2V0IHx8IHJvb3QsIGxpc3RlbmVyLnNlbGVjdG9yKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdoaWxlIChlbCA9IGVsc1tpKytdKSB7XHJcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lci5lbGVtZW50cy5oYXMoZWwpKSBjb250aW51ZTtcclxuICAgICAgICAgICAgbGlzdGVuZXIuZWxlbWVudHMuc2V0KGVsLHRydWUpO1xyXG4gICAgICAgICAgICBsaXN0ZW5lci5jYWxsYmFjay5jYWxsKGVsLCBlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gY2hlY2tMaXN0ZW5lcnMoaW5zaWRlKSB7XHJcbiAgICAgICAgdmFyIGkgPSAwLCBsaXN0ZW5lcjtcclxuICAgICAgICB3aGlsZSAobGlzdGVuZXIgPSBsaXN0ZW5lcnNbaSsrXSkgY2hlY2tMaXN0ZW5lcihsaXN0ZW5lciwgaW5zaWRlKTtcclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGNoZWNrTXV0YXRpb25zKG11dGF0aW9ucykge1xyXG5cdFx0dmFyIGogPSAwLCBpLCBtdXRhdGlvbiwgbm9kZXMsIHRhcmdldDtcclxuICAgICAgICB3aGlsZSAobXV0YXRpb24gPSBtdXRhdGlvbnNbaisrXSkge1xyXG4gICAgICAgICAgICBub2RlcyA9IG11dGF0aW9uLmFkZGVkTm9kZXMsIGkgPSAwO1xyXG4gICAgICAgICAgICB3aGlsZSAodGFyZ2V0ID0gbm9kZXNbaSsrXSkgdGFyZ2V0Lm5vZGVUeXBlID09PSAxICYmIGNoZWNrTGlzdGVuZXJzKHRhcmdldCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHZhciBsb2FkZWQgPSBmYWxzZTtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbG9hZGVkID0gdHJ1ZTtcclxuICAgIH0pO1xyXG5cclxuXHQvLyBzdmcgcG9seWZpbGxzXHJcblx0ZnVuY3Rpb24gY29weVByb3BlcnR5KHByb3AsIGZyb20sIHRvKXtcclxuXHRcdHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihmcm9tLCBwcm9wKTtcclxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0bywgcHJvcCwgZGVzYyk7XHJcblx0fVxyXG5cdGlmICghKCdjbGFzc0xpc3QnIGluIEVsZW1lbnQucHJvdG90eXBlKSkge1xyXG5cdFx0Y29weVByb3BlcnR5KCdjbGFzc0xpc3QnLCBIVE1MRWxlbWVudC5wcm90b3R5cGUsIEVsZW1lbnQucHJvdG90eXBlKTtcclxuXHR9XHJcblx0aWYgKCEoJ2lubmVySFRNTCcgaW4gRWxlbWVudC5wcm90b3R5cGUpKSB7XHJcblx0XHRjb3B5UHJvcGVydHkoJ2lubmVySFRNTCcsIEhUTUxFbGVtZW50LnByb3RvdHlwZSwgRWxlbWVudC5wcm90b3R5cGUpO1xyXG5cdH1cclxuXHRpZiAoISgnc2hlZXQnIGluIFNWR1N0eWxlRWxlbWVudC5wcm90b3R5cGUpKSB7XHJcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoU1ZHU3R5bGVFbGVtZW50LnByb3RvdHlwZSwgJ3NoZWV0Jywge1xyXG5cdFx0XHRnZXQ6ZnVuY3Rpb24oKXtcclxuXHRcdFx0XHR2YXIgYWxsID0gZG9jdW1lbnQuc3R5bGVTaGVldHMsIGk9MCwgc2hlZXQ7XHJcblx0XHRcdFx0d2hpbGUgKHNoZWV0PWFsbFtpKytdKSB7XHJcblx0XHRcdFx0XHRpZiAoc2hlZXQub3duZXJOb2RlID09PSB0aGlzKSByZXR1cm4gc2hlZXQ7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHJcblx0Ly8gbWFpbiBsb2dpY1xyXG5cclxuXHQvLyBjYWNoZWQgcmVnZXhwcywgYmV0dGVyIHBlcmZvcm1hbmNlXHJcblx0Y29uc3QgcmVnRmluZFNldHRlcnMgPSAvKFtcXHN7O10pKC0tKFtBLVphLXowLTktX10qKVxccyo6KFteOyF9e10rKSghaW1wb3J0YW50KT8pKD89XFxzKihbO31dfCQpKS9nO1xyXG5cdGNvbnN0IHJlZ0ZpbmRHZXR0ZXJzID0gLyhbeztdXFxzKikoW0EtWmEtejAtOS1fXStcXHMqOlteO317XSp2YXJcXChbXiE7fXtdKykoIWltcG9ydGFudCk/KD89XFxzKihbO30kXXwkKSkvZztcclxuXHRjb25zdCByZWdSdWxlSUVHZXR0ZXJzID0gLy1pZVZhci0oW146XSspOi9nXHJcblx0Y29uc3QgcmVnUnVsZUlFU2V0dGVycyA9IC8taWUtKFtefTtdKykvZ1xyXG5cdC8vY29uc3QgcmVnSGFzVmFyID0gL3ZhclxcKC87XHJcblx0Y29uc3QgcmVnUHNldWRvcyA9IC86KGhvdmVyfGFjdGl2ZXxmb2N1c3x0YXJnZXR8OmJlZm9yZXw6YWZ0ZXJ8OmZpcnN0LWxldHRlcnw6Zmlyc3QtbGluZSkvO1xyXG5cclxuXHRvbkVsZW1lbnQoJ2xpbmtbcmVsPVwic3R5bGVzaGVldFwiXScsIGZ1bmN0aW9uIChlbCkge1xyXG5cdFx0ZmV0Y2hDc3MoZWwuaHJlZiwgZnVuY3Rpb24gKGNzcykge1xyXG5cdFx0XHR2YXIgbmV3Q3NzID0gcmV3cml0ZUNzcyhjc3MpO1xyXG5cdFx0XHRpZiAoY3NzID09PSBuZXdDc3MpIHJldHVybjtcclxuXHRcdFx0bmV3Q3NzID0gcmVsVG9BYnMoZWwuaHJlZiwgbmV3Q3NzKTtcclxuXHRcdFx0ZWwuZGlzYWJsZWQgPSB0cnVlO1xyXG5cdFx0XHR2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xyXG5cdFx0XHRpZiAoZWwubWVkaWEpIHN0eWxlLnNldEF0dHJpYnV0ZSgnbWVkaWEnLCBlbC5tZWRpYSk7XHJcblx0XHRcdGVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHN0eWxlLCBlbCk7XHJcblx0XHRcdGFjdGl2YXRlU3R5bGVFbGVtZW50KHN0eWxlLCBuZXdDc3MpO1xyXG5cdFx0fSk7XHJcblx0fSk7XHJcblxyXG5cdGZ1bmN0aW9uIGZvdW5kU3R5bGUoZWwpe1xyXG5cdFx0aWYgKGVsLmllQ1BfcG9seWZpbGxlZCkgcmV0dXJuO1xyXG5cdFx0aWYgKGVsLmllQ1BfZWxlbWVudFNoZWV0KSByZXR1cm47XHJcblx0XHR2YXIgY3NzID0gZWwuaW5uZXJIVE1MO1xyXG5cdFx0dmFyIG5ld0NzcyA9IHJld3JpdGVDc3MoY3NzKTtcclxuXHRcdGlmIChjc3MgPT09IG5ld0NzcykgcmV0dXJuO1xyXG5cdFx0YWN0aXZhdGVTdHlsZUVsZW1lbnQoZWwsIG5ld0Nzcyk7XHJcblx0fVxyXG5cdG9uRWxlbWVudCgnc3R5bGUnLCBmb3VuZFN0eWxlKTtcclxuXHQvLyBpbW1lZGlhdGUsIHRvIHBhc3MgdzNjLXRlc3RzLCBidWQgaXRzIGEgYmFkIGlkZWFcclxuXHQvLyBhZGRFdmVudExpc3RlbmVyKCdET01Ob2RlSW5zZXJ0ZWQnLGZ1bmN0aW9uKGUpeyBlLnRhcmdldC50YWdOYW1lID09PSAnU1RZTEUnICYmIGZvdW5kU3R5bGUoZS50YXJnZXQpOyB9KTtcclxuXHJcblxyXG5cclxuXHRvbkVsZW1lbnQoJ1tpZS1zdHlsZV0nLCBmdW5jdGlvbiAoZWwpIHtcclxuXHRcdHZhciBuZXdDc3MgPSByZXdyaXRlQ3NzKCd7JytlbC5nZXRBdHRyaWJ1dGUoJ2llLXN0eWxlJykpLnN1YnN0cigxKTtcclxuXHRcdGVsLnN0eWxlLmNzc1RleHQgKz0gJzsnKyBuZXdDc3M7XHJcblx0XHR2YXIgZm91bmQgPSBwYXJzZVJld3JpdHRlblN0eWxlKGVsLnN0eWxlKTtcclxuXHRcdGlmIChmb3VuZC5nZXR0ZXJzKSBhZGRHZXR0ZXJFbGVtZW50KGVsLCBmb3VuZC5nZXR0ZXJzLCAnJXN0eWxlQXR0cicpO1xyXG5cdFx0aWYgKGZvdW5kLnNldHRlcnMpIGFkZFNldHRlckVsZW1lbnQoZWwsIGZvdW5kLnNldHRlcnMpO1xyXG5cdH0pO1xyXG5cclxuXHRmdW5jdGlvbiByZWxUb0FicyhiYXNlLCBjc3MpIHtcclxuXHRcdHJldHVybiBjc3MucmVwbGFjZSgvdXJsXFwoKFteKV0rKVxcKS9nLCBmdW5jdGlvbigkMCwgJDEpe1xyXG5cdFx0XHQkMSA9ICQxLnRyaW0oKS5yZXBsYWNlKC8oXlsnXCJdfFsnXCJdJCkvZywnJyk7XHJcblx0XHRcdGlmICgkMS5tYXRjaCgvXihbYS16XSs6fFxcLykvKSkgcmV0dXJuICQwO1xyXG5cdFx0XHRiYXNlID0gYmFzZS5yZXBsYWNlKC9cXD8uKi8sJycpO1xyXG5cdFx0XHRyZXR1cm4gJ3VybCgnKyBiYXNlICsgJy4vLi4vJyArICQxICsnKSc7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdC8vIGllIGhhcyBhIGJ1Zywgd2hlcmUgdW5rbm93biBwcm9wZXJ0aWVzIGF0IHBzZXVkby1zZWxlY3RvcnMgYXJlIGNvbXB1dGVkIGF0IHRoZSBlbGVtZW50XHJcblx0Ly8gI2VsOjphZnRlciB7IC1jb250ZW50Oid4JzsgfSA9PiBnZXRDb21wdXRlZFN0eWxlKGVsKVsnLWNvbnRlbnQnXSA9PSAneCdcclxuXHQvLyBzaG91bGQgd2UgYWRkIHNvbWV0aGluZyBsaWtlIC1pZVZhci1wc2V1ZG9fYWZ0ZXItY29udGVudDoneCc/XHJcblx0ZnVuY3Rpb24gcmV3cml0ZUNzcyhjc3MpIHtcclxuXHJcblx0XHQvKiB1bmNvbW1lbnQgaWYgc3BlYyBmaW5pc2hlZCBhbmQgbmVlZGVkIGJ5IHNvbWVvbmVcclxuXHRcdGNzcyA9IGNzcy5yZXBsYWNlKC9AcHJvcGVydHkgKFtee10rKXsoW159XSspfS8sIGZ1bmN0aW9uKCQwLCBwcm9wLCBib2R5KXtcclxuXHRcdFx0cHJvcCA9IHByb3AudHJpbSgpO1xyXG5cdFx0XHRjb25zdCBkZWNsYXJhdGlvbiA9IHtuYW1lOnByb3B9O1xyXG5cdFx0XHRib2R5LnNwbGl0KCc7JykuZm9yRWFjaChmdW5jdGlvbihwYWlyKXtcclxuXHRcdFx0XHRjb25zdCB4ID0gcGFpci5zcGxpdCgnOicpO1xyXG5cdFx0XHRcdGlmICh4WzFdKSBkZWNsYXJhdGlvblsgeFswXS50cmltKCkgXSA9IHhbMV07XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRkZWNsYXJhdGlvblsnaW5oZXJpdHMnXSA9IGRlY2xhcmF0aW9uWydpbmhlcml0cyddLnRyaW0oKT09PSd0cnVlJyA/IHRydWUgOiBmYWxzZTtcclxuXHRcdFx0ZGVjbGFyYXRpb25bJ2luaXRpYWxWYWx1ZSddID0gZGVjbGFyYXRpb25bJ2luaXRpYWwtdmFsdWUnXTtcclxuXHRcdFx0Q1NTLnJlZ2lzdGVyUHJvcGVydHkoZGVjbGFyYXRpb24pXHJcblx0XHRcdHJldHVybiAnLypcXG4gQHByb3BlcnR5IC4uLiByZW1vdmVkIFxcbionKycvJztcclxuXHRcdH0pO1xyXG5cdFx0Ki9cclxuXHRcdHJldHVybiBjc3MucmVwbGFjZShyZWdGaW5kU2V0dGVycywgZnVuY3Rpb24oJDAsICQxLCAkMiwgJDMsICQ0LCBpbXBvcnRhbnQpe1xyXG5cdFx0XHRyZXR1cm4gJDErJy1pZS0nKyhpbXBvcnRhbnQ/J+Kdlyc6JycpKyQzKyc6JytlbmNvZGVWYWx1ZSgkNCk7XHJcblx0XHR9KS5yZXBsYWNlKHJlZ0ZpbmRHZXR0ZXJzLCBmdW5jdGlvbigkMCwgJDEsICQyLCBpbXBvcnRhbnQpe1xyXG5cdFx0XHRyZXR1cm4gJDErJy1pZVZhci0nKyhpbXBvcnRhbnQ/J+Kdlyc6JycpKyQyKyc7ICcrJDI7IC8vIGtlZXAgdGhlIG9yaWdpbmFsLCBzbyBjaGFpbmluZyB3b3JrcyBcIi0teDp2YXIoLS15KVwiXHJcblx0XHR9KTtcclxuXHR9XHJcblx0ZnVuY3Rpb24gZW5jb2RlVmFsdWUodmFsdWUpe1xyXG5cdFx0cmV0dXJuIHZhbHVlO1xyXG5cdFx0cmV0dXJuIHZhbHVlLnJlcGxhY2UoLyAvZywn4pCjJyk7XHJcblx0fVxyXG5cdGNvbnN0IGtleXdvcmRzID0ge2luaXRpYWw6MSxpbmhlcml0OjEscmV2ZXJ0OjEsdW5zZXQ6MX07XHJcblx0ZnVuY3Rpb24gZGVjb2RlVmFsdWUodmFsdWUpe1xyXG5cdFx0cmV0dXJuIHZhbHVlO1xyXG5cdFx0aWYgKHZhbHVlPT09dW5kZWZpbmVkKSByZXR1cm47XHJcblx0XHR2YWx1ZSA9ICB2YWx1ZS5yZXBsYWNlKC/ikKMvZywnICcpO1xyXG5cdFx0Y29uc3QgdHJpbW1lZCA9IHZhbHVlLnRyaW0oKTtcclxuXHRcdGlmIChrZXl3b3Jkc1t0cmltbWVkXSkgcmV0dXJuIHRyaW1tZWQ7XHJcblx0XHRyZXR1cm4gdmFsdWU7XHJcblx0fVxyXG5cclxuXHQvLyBiZXRhXHJcblx0Y29uc3Qgc3R5bGVzX29mX2dldHRlcl9wcm9wZXJ0aWVzID0ge307XHJcblxyXG5cdGZ1bmN0aW9uIHBhcnNlUmV3cml0dGVuU3R5bGUoc3R5bGUpIHsgLy8gbGVzcyBtZW1vcnkgdGhlbiBwYXJhbWV0ZXIgY3NzVGV4dD9cclxuXHJcblx0XHQvLyBiZXRhXHJcblx0XHRzdHlsZVsnei1pbmRleCddOyAvLyBpZTExIGNhbiBhY2Nlc3MgdW5rbm93biBwcm9wZXJ0aWVzIGluIHN0eWxlc2hlZXRzIG9ubHkgaWYgYWNjZXNzZWQgYSBkYXNoZWQga25vd24gcHJvcGVydHlcclxuXHJcblx0XHRjb25zdCBjc3NUZXh0ID0gc3R5bGUuY3NzVGV4dDtcclxuXHRcdHZhciBtYXRjaGVzR2V0dGVycyA9IGNzc1RleHQubWF0Y2gocmVnUnVsZUlFR2V0dGVycyksIGosIG1hdGNoO1xyXG5cdFx0aWYgKG1hdGNoZXNHZXR0ZXJzKSB7XHJcblx0XHRcdHZhciBnZXR0ZXJzID0gW107IC8vIGVnLiBbYm9yZGVyLGNvbG9yXVxyXG5cdFx0XHRmb3IgKGogPSAwOyBtYXRjaCA9IG1hdGNoZXNHZXR0ZXJzW2orK107KSB7XHJcblx0XHRcdFx0bGV0IHByb3BOYW1lID0gbWF0Y2guc2xpY2UoNywgLTEpO1xyXG5cdFx0XHRcdGlmIChwcm9wTmFtZVswXSA9PT0gJ+KdlycpIHByb3BOYW1lID0gcHJvcE5hbWUuc3Vic3RyKDEpO1xyXG5cdFx0XHRcdGdldHRlcnMucHVzaChwcm9wTmFtZSk7XHJcblxyXG5cdFx0XHRcdC8vIGJldGFcclxuXHRcdFx0XHRpZiAoIXN0eWxlc19vZl9nZXR0ZXJfcHJvcGVydGllc1twcm9wTmFtZV0pIHN0eWxlc19vZl9nZXR0ZXJfcHJvcGVydGllc1twcm9wTmFtZV0gPSBbXTtcclxuXHRcdFx0XHRzdHlsZXNfb2ZfZ2V0dGVyX3Byb3BlcnRpZXNbcHJvcE5hbWVdLnB1c2goc3R5bGUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR2YXIgbWF0Y2hlc1NldHRlcnMgPSBjc3NUZXh0Lm1hdGNoKHJlZ1J1bGVJRVNldHRlcnMpO1xyXG5cdFx0aWYgKG1hdGNoZXNTZXR0ZXJzKSB7XHJcblx0XHRcdHZhciBzZXR0ZXJzID0ge307IC8vIGVnLiBbLS1jb2xvcjojZmZmLCAtLXBhZGRpbmc6MTBweF07XHJcblx0XHRcdGZvciAoaiA9IDA7IG1hdGNoID0gbWF0Y2hlc1NldHRlcnNbaisrXTspIHtcclxuXHRcdFx0XHRsZXQgeCA9IG1hdGNoLnN1YnN0cig0KS5zcGxpdCgnOicpO1xyXG5cdFx0XHRcdGxldCBwcm9wTmFtZSA9IHhbMF07XHJcblx0XHRcdFx0bGV0IHByb3BWYWx1ZSA9IHhbMV07XHJcblx0XHRcdFx0aWYgKHByb3BOYW1lWzBdID09PSAn4p2XJykgcHJvcE5hbWUgPSBwcm9wTmFtZS5zdWJzdHIoMSk7XHJcblx0XHRcdFx0c2V0dGVyc1twcm9wTmFtZV0gPSBwcm9wVmFsdWU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiB7Z2V0dGVyczpnZXR0ZXJzLCBzZXR0ZXJzOnNldHRlcnN9O1xyXG5cdH1cclxuXHRmdW5jdGlvbiBhY3RpdmF0ZVN0eWxlRWxlbWVudChzdHlsZSwgY3NzKSB7XHJcblx0XHRzdHlsZS5pbm5lckhUTUwgPSBjc3M7XHJcblx0XHRzdHlsZS5pZUNQX3BvbHlmaWxsZWQgPSB0cnVlO1xyXG5cdFx0dmFyIHJ1bGVzID0gc3R5bGUuc2hlZXQucnVsZXMsIGk9MCwgcnVsZTsgLy8gY3NzUnVsZXMgPSBDU1NSdWxlTGlzdCwgcnVsZXMgPSBNU0NTU1J1bGVMaXN0XHJcblx0XHR3aGlsZSAocnVsZSA9IHJ1bGVzW2krK10pIHtcclxuXHRcdFx0Y29uc3QgZm91bmQgPSBwYXJzZVJld3JpdHRlblN0eWxlKHJ1bGUuc3R5bGUpO1xyXG5cdFx0XHRpZiAoZm91bmQuZ2V0dGVycykgYWRkR2V0dGVyc1NlbGVjdG9yKHJ1bGUuc2VsZWN0b3JUZXh0LCBmb3VuZC5nZXR0ZXJzKTtcclxuXHRcdFx0aWYgKGZvdW5kLnNldHRlcnMpIGFkZFNldHRlcnNTZWxlY3RvcihydWxlLnNlbGVjdG9yVGV4dCwgZm91bmQuc2V0dGVycyk7XHJcblxyXG5cdFx0XHQvLyBtZWRpYVF1ZXJpZXM6IHJlZHJhdyB0aGUgaG9sZSBkb2N1bWVudFxyXG5cdFx0XHQvLyBiZXR0ZXIgYWRkIGV2ZW50cyBmb3IgZWFjaCBlbGVtZW50P1xyXG5cdFx0XHRjb25zdCBtZWRpYSA9IHJ1bGUucGFyZW50UnVsZSAmJiBydWxlLnBhcmVudFJ1bGUubWVkaWEgJiYgcnVsZS5wYXJlbnRSdWxlLm1lZGlhLm1lZGlhVGV4dDtcclxuXHRcdFx0aWYgKG1lZGlhICYmIChmb3VuZC5nZXR0ZXJzIHx8IGZvdW5kLnNldHRlcnMpKSB7XHJcblx0XHRcdFx0bWF0Y2hNZWRpYShtZWRpYSkuYWRkTGlzdGVuZXIoZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRcdGRyYXdUcmVlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudClcclxuXHRcdFx0XHR9KVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gYmV0YVxyXG5cdFx0cmVkcmF3U3R5bGVTaGVldHMoKVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gYWRkR2V0dGVyc1NlbGVjdG9yKHNlbGVjdG9yLCBwcm9wZXJ0aWVzKSB7XHJcblx0XHRzZWxlY3RvckFkZFBzZXVkb0xpc3RlbmVycyhzZWxlY3Rvcik7XHJcblx0XHRvbkVsZW1lbnQodW5Qc2V1ZG8oc2VsZWN0b3IpLCBmdW5jdGlvbiAoZWwpIHtcclxuXHRcdFx0YWRkR2V0dGVyRWxlbWVudChlbCwgcHJvcGVydGllcywgc2VsZWN0b3IpO1xyXG5cdFx0XHRkcmF3RWxlbWVudChlbCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0ZnVuY3Rpb24gYWRkR2V0dGVyRWxlbWVudChlbCwgcHJvcGVydGllcywgc2VsZWN0b3IpIHtcclxuXHRcdHZhciBpPTAsIHByb3AsIGo7XHJcblx0XHRjb25zdCBzZWxlY3RvcnMgPSBzZWxlY3Rvci5zcGxpdCgnLCcpOyAvLyBzcGxpdCBncm91cGVkIHNlbGVjdG9yc1xyXG5cdFx0ZWwuc2V0QXR0cmlidXRlKCdpZWNwLW5lZWRlZCcsIHRydWUpO1xyXG5cdFx0aWYgKCFlbC5pZUNQU2VsZWN0b3JzKSBlbC5pZUNQU2VsZWN0b3JzID0ge307XHJcblx0XHR3aGlsZSAocHJvcCA9IHByb3BlcnRpZXNbaSsrXSkge1xyXG5cdFx0XHRmb3IgKGogPSAwOyBzZWxlY3RvciA9IHNlbGVjdG9yc1tqKytdOykge1xyXG5cdFx0XHRcdGNvbnN0IHBhcnRzID0gc2VsZWN0b3IudHJpbSgpLnNwbGl0KCc6OicpO1xyXG5cdFx0XHRcdGlmICghZWwuaWVDUFNlbGVjdG9yc1twcm9wXSkgZWwuaWVDUFNlbGVjdG9yc1twcm9wXSA9IFtdO1xyXG5cdFx0XHRcdGVsLmllQ1BTZWxlY3RvcnNbcHJvcF0ucHVzaCh7XHJcblx0XHRcdFx0XHRzZWxlY3RvcjogcGFydHNbMF0sXHJcblx0XHRcdFx0XHRwc2V1ZG86IHBhcnRzWzFdID8gJzo6JyArIHBhcnRzWzFdIDogJydcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRmdW5jdGlvbiBhZGRTZXR0ZXJzU2VsZWN0b3Ioc2VsZWN0b3IsIHByb3BWYWxzKSB7XHJcblx0XHRzZWxlY3RvckFkZFBzZXVkb0xpc3RlbmVycyhzZWxlY3Rvcik7XHJcblx0XHRvbkVsZW1lbnQodW5Qc2V1ZG8oc2VsZWN0b3IpLCBmdW5jdGlvbiAoZWwpIHtcclxuXHRcdFx0YWRkU2V0dGVyRWxlbWVudChlbCwgcHJvcFZhbHMpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdGZ1bmN0aW9uIGFkZFNldHRlckVsZW1lbnQoZWwsIHByb3BWYWxzKSB7XHJcblx0XHRpZiAoIWVsLmllQ1Bfc2V0dGVycykgZWwuaWVDUF9zZXR0ZXJzID0ge307XHJcblx0XHRmb3IgKHZhciBwcm9wIGluIHByb3BWYWxzKSB7IC8vIGVnLiB7Zm9vOiNmZmYsIGJhcjpiYXp9XHJcblx0XHRcdGVsLmllQ1Bfc2V0dGVyc1snLS0nICsgcHJvcF0gPSAxO1xyXG5cdFx0fVxyXG5cdFx0ZHJhd1RyZWUoZWwpO1xyXG5cdH1cclxuXHJcblx0Ly9iZXRhXHJcblx0ZnVuY3Rpb24gcmVkcmF3U3R5bGVTaGVldHMoKSB7XHJcblx0XHRmb3IgKHZhciBwcm9wIGluIHN0eWxlc19vZl9nZXR0ZXJfcHJvcGVydGllcykge1xyXG5cdFx0XHRsZXQgc3R5bGVzID0gc3R5bGVzX29mX2dldHRlcl9wcm9wZXJ0aWVzW3Byb3BdO1xyXG5cdFx0XHRmb3IgKHZhciBpPTAsIHN0eWxlOyBzdHlsZT1zdHlsZXNbaSsrXTspIHtcclxuXHRcdFx0XHRpZiAoc3R5bGUub3duaW5nRWxlbWVudCkgY29udGludWU7XHJcblx0XHRcdFx0dmFyIHZhbHVlID0gc3R5bGVbJy1pZVZhci0nK3Byb3BdO1xyXG5cdFx0XHRcdGlmICghdmFsdWUpIGNvbnRpbnVlO1xyXG5cdFx0XHRcdHZhbHVlID0gc3R5bGVDb21wdXRlVmFsdWVXaWR0aFZhcnMoZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpLCB2YWx1ZSk7XHJcblx0XHRcdFx0aWYgKHZhbHVlID09PSAnJykgY29udGludWU7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdHN0eWxlW3Byb3BdID0gdmFsdWU7XHJcblx0XHRcdFx0fSBjYXRjaChlKSB7fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHJcblx0Y29uc3QgcHNldWRvcyA9IHtcclxuXHRcdGhvdmVyOntcclxuXHRcdFx0b246J21vdXNlZW50ZXInLFxyXG5cdFx0XHRvZmY6J21vdXNlbGVhdmUnXHJcblx0XHR9LFxyXG5cdFx0Zm9jdXM6e1xyXG5cdFx0XHRvbjonZm9jdXNpbicsXHJcblx0XHRcdG9mZjonZm9jdXNvdXQnXHJcblx0XHR9LFxyXG5cdFx0YWN0aXZlOntcclxuXHRcdFx0b246J0NTU0FjdGl2YXRlJyxcclxuXHRcdFx0b2ZmOidDU1NEZWFjdGl2YXRlJ1xyXG5cdFx0fSxcclxuXHR9O1xyXG5cdGZ1bmN0aW9uIHNlbGVjdG9yQWRkUHNldWRvTGlzdGVuZXJzKHNlbGVjdG9yKXtcclxuXHRcdC8vIGllMTEgaGFzIHRoZSBzdHJhbmdlIGJlaGF2b2lyLCB0aGF0IGdyb3VwcyBvZiBzZWxlY3RvcnMgYXJlIGluZGl2aWR1YWwgcnVsZXMsIGJ1dCBzdGFydGluZyB3aXRoIHRoZSBmdWxsIHNlbGVjdG9yOlxyXG5cdFx0Ly8gdGQsIHRoLCBidXR0b24geyBjb2xvcjpyZWQgfSByZXN1bHRzIGluIHRoaXMgcnVsZXM6XHJcblx0XHQvLyBcInRkLCB0aCwgYnV0dG9uXCIgfCBcInRoLCB0aFwiIHwgXCJ0aFwiXHJcblx0XHRzZWxlY3RvciA9IHNlbGVjdG9yLnNwbGl0KCcsJylbMF07XHJcblx0XHRmb3IgKHZhciBwc2V1ZG8gaW4gcHNldWRvcykge1xyXG5cdFx0XHR2YXIgcGFydHMgPSBzZWxlY3Rvci5zcGxpdCgnOicrcHNldWRvKTtcclxuXHRcdFx0aWYgKHBhcnRzLmxlbmd0aCA+IDEpIHtcclxuXHRcdFx0XHR2YXIgZW5kaW5nID0gcGFydHNbMV0ubWF0Y2goL15bXlxcc10qLyk7IC8vIGVuZGluZyBlbGVtZW50cGFydCBvZiBzZWxlY3RvciAodXNlZCBmb3Igbm90KDphY3RpdmUpKVxyXG5cdFx0XHRcdGxldCBzZWwgPSB1blBzZXVkbyhwYXJ0c1swXStlbmRpbmcpO1xyXG5cdFx0XHRcdGNvbnN0IGxpc3RlbmVycyA9IHBzZXVkb3NbcHNldWRvXTtcclxuXHRcdFx0XHRvbkVsZW1lbnQoc2VsLCBmdW5jdGlvbiAoZWwpIHtcclxuXHRcdFx0XHRcdGVsLmFkZEV2ZW50TGlzdGVuZXIobGlzdGVuZXJzLm9uLCBkcmF3VHJlZUV2ZW50KTtcclxuXHRcdFx0XHRcdGVsLmFkZEV2ZW50TGlzdGVuZXIobGlzdGVuZXJzLm9mZiwgZHJhd1RyZWVFdmVudCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0bGV0IENTU0FjdGl2ZSA9IG51bGw7XHJcblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJyxmdW5jdGlvbihlKXtcclxuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYgKGUudGFyZ2V0ID09PSBkb2N1bWVudC5hY3RpdmVFbGVtZW50KSB7XHJcblx0XHRcdFx0dmFyIGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xyXG5cdFx0XHRcdGV2dC5pbml0RXZlbnQoJ0NTU0FjdGl2YXRlJywgdHJ1ZSwgdHJ1ZSk7XHJcblx0XHRcdFx0Q1NTQWN0aXZlID0gZS50YXJnZXQ7XHJcblx0XHRcdFx0Q1NTQWN0aXZlLmRpc3BhdGNoRXZlbnQoZXZ0KTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9KTtcclxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJyxmdW5jdGlvbigpe1xyXG5cdFx0aWYgKENTU0FjdGl2ZSkge1xyXG5cdFx0XHR2YXIgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XHJcblx0XHRcdGV2dC5pbml0RXZlbnQoJ0NTU0RlYWN0aXZhdGUnLCB0cnVlLCB0cnVlKTtcclxuXHRcdFx0Q1NTQWN0aXZlLmRpc3BhdGNoRXZlbnQoZXZ0KTtcclxuXHRcdFx0Q1NTQWN0aXZlID0gbnVsbDtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0ZnVuY3Rpb24gdW5Qc2V1ZG8oc2VsZWN0b3Ipe1xyXG5cdFx0cmV0dXJuIHNlbGVjdG9yLnJlcGxhY2UocmVnUHNldWRvcywnJykucmVwbGFjZSgnOm5vdCgpJywnJyk7XHJcblx0fVxyXG5cclxuXHR2YXIgdW5pcXVlQ291bnRlciA9IDA7XHJcblxyXG5cdC8qIG9sZCAqXHJcblx0ZnVuY3Rpb24gX2RyYXdFbGVtZW50KGVsKSB7XHJcblx0XHRpZiAoIWVsLmllQ1BfdW5pcXVlKSB7IC8vIHVzZSBlbC51bmlxdWVOdW1iZXI/IGJ1dCBuZWVkcyBjbGFzcyBmb3IgdGhlIGNzcy1zZWxlY3RvciA9PiB0ZXN0IHBlcmZvcm1hbmNlXHJcblx0XHRcdGVsLmllQ1BfdW5pcXVlID0gKyt1bmlxdWVDb3VudGVyO1xyXG5cdFx0XHRlbC5jbGFzc0xpc3QuYWRkKCdpZWNwLXUnICsgZWwuaWVDUF91bmlxdWUpO1xyXG5cdFx0fVxyXG5cdFx0dmFyIHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XHJcblx0XHRpZiAoZWwuaWVDUF9zaGVldCkgd2hpbGUgKGVsLmllQ1Bfc2hlZXQucnVsZXNbMF0pIGVsLmllQ1Bfc2hlZXQuZGVsZXRlUnVsZSgwKTtcclxuXHRcdGZvciAodmFyIHByb3AgaW4gZWwuaWVDUFNlbGVjdG9ycykge1xyXG5cdFx0XHR2YXIgaW1wb3J0YW50ID0gc3R5bGVbJy1pZVZhci3inZcnICsgcHJvcF07XHJcblx0XHRcdGxldCB2YWx1ZVdpdGhWYXIgPSBpbXBvcnRhbnQgfHwgc3R5bGVbJy1pZVZhci0nICsgcHJvcF07XHJcblx0XHRcdGlmICghdmFsdWVXaXRoVmFyKSBjb250aW51ZTsgLy8gdG9kbywgd2hhdCBpZiAnMCdcclxuXHJcblx0XHRcdHZhciBkZXRhaWxzID0ge307XHJcblx0XHRcdHZhciB2YWx1ZSA9IHN0eWxlQ29tcHV0ZVZhbHVlV2lkdGhWYXJzKHN0eWxlLCB2YWx1ZVdpdGhWYXIsIGRldGFpbHMpO1xyXG5cclxuXHRcdFx0aWYgKGltcG9ydGFudCkgdmFsdWUgKz0gJyAhaW1wb3J0YW50JztcclxuXHRcdFx0Zm9yICh2YXIgaT0wLCBpdGVtOyBpdGVtPWVsLmllQ1BTZWxlY3RvcnNbcHJvcF1baSsrXTspIHsgLy8gdG9kbzogc3BsaXQgYW5kIHVzZSByZXF1ZXN0QW5pbWF0aW9uRnJhbWU/XHJcblx0XHRcdFx0aWYgKGl0ZW0uc2VsZWN0b3IgPT09ICclc3R5bGVBdHRyJykge1xyXG5cdFx0XHRcdFx0ZWwuc3R5bGVbcHJvcF0gPSB2YWx1ZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHRcdC8vIGJldGFcclxuXHRcdFx0XHRcdGlmICghaW1wb3J0YW50ICYmIGRldGFpbHMuYWxsQnlSb290ICE9PSBmYWxzZSkgY29udGludWU7IC8vIGRvbnQgaGF2ZSB0byBkcmF3IHJvb3QtcHJvcGVydGllc1xyXG5cclxuXHRcdFx0XHRcdC8vbGV0IHNlbGVjdG9yID0gaXRlbS5zZWxlY3Rvci5yZXBsYWNlKC8+PyBcXC5bXiBdKy8sICcgJywgaXRlbS5zZWxlY3Rvcik7IC8vIHRvZG86IHRyeSB0byBlcXVhbGl6ZSBzcGVjaWZpY2l0eVxyXG5cdFx0XHRcdFx0bGV0IHNlbGVjdG9yID0gaXRlbS5zZWxlY3RvcjtcclxuXHRcdFx0XHRcdGVsZW1lbnRTdHlsZVNoZWV0KGVsKS5pbnNlcnRSdWxlKHNlbGVjdG9yICsgJy5pZWNwLXUnICsgZWwuaWVDUF91bmlxdWUgKyBpdGVtLnBzZXVkbyArICcgeycgKyBwcm9wICsgJzonICsgdmFsdWUgKyAnfScsIDApO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRmdW5jdGlvbiBlbGVtZW50U3R5bGVTaGVldChlbCl7XHJcblx0XHRpZiAoIWVsLmllQ1Bfc2hlZXQpIHtcclxuXHRcdFx0Y29uc3Qgc3R5bGVFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XHJcblx0XHRcdHN0eWxlRWwuaWVDUF9lbGVtZW50U2hlZXQgPSAxO1xyXG5cdFx0XHQvL2VsLmFwcGVuZENoaWxkKHN0eWxlRWwpOyAvLyB5ZXMhIHNlbGYtY2xvc2luZyB0YWdzIGNhbiBoYXZlIHN0eWxlIGFzIGNoaWxkcmVuLCBidXQgLSBpZiBpIHNldCBpbm5lckhUTUwsIHRoZSBzdHlsZXNoZWV0IGlzIGxvc3RcclxuXHRcdFx0ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsKTtcclxuXHRcdFx0ZWwuaWVDUF9zaGVldCA9IHN0eWxlRWwuc2hlZXQ7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZWwuaWVDUF9zaGVldDtcclxuXHR9XHJcblxyXG5cdC8qICovXHJcblx0ZnVuY3Rpb24gX2RyYXdFbGVtZW50KGVsKSB7XHJcblx0XHRpZiAoIWVsLmllQ1BfdW5pcXVlKSB7IC8vIHVzZSBlbC51bmlxdWVOdW1iZXI/IGJ1dCBuZWVkcyBjbGFzcyBmb3IgdGhlIGNzcy1zZWxlY3RvciA9PiB0ZXN0IHBlcmZvcm1hbmNlXHJcblx0XHRcdGVsLmllQ1BfdW5pcXVlID0gKyt1bmlxdWVDb3VudGVyO1xyXG5cdFx0XHRlbC5jbGFzc0xpc3QuYWRkKCdpZWNwLXUnICsgZWwuaWVDUF91bmlxdWUpO1xyXG5cdFx0fVxyXG5cdFx0dmFyIHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XHJcblx0XHRsZXQgY3NzID0gJyc7XHJcblx0XHRmb3IgKHZhciBwcm9wIGluIGVsLmllQ1BTZWxlY3RvcnMpIHtcclxuXHRcdFx0dmFyIGltcG9ydGFudCA9IHN0eWxlWyctaWVWYXIt4p2XJyArIHByb3BdO1xyXG5cdFx0XHRsZXQgdmFsdWVXaXRoVmFyID0gaW1wb3J0YW50IHx8IHN0eWxlWyctaWVWYXItJyArIHByb3BdO1xyXG5cdFx0XHRpZiAoIXZhbHVlV2l0aFZhcikgY29udGludWU7IC8vIHRvZG8sIHdoYXQgaWYgJzAnXHJcblx0XHRcdHZhciBkZXRhaWxzID0ge307XHJcblx0XHRcdHZhciB2YWx1ZSA9IHN0eWxlQ29tcHV0ZVZhbHVlV2lkdGhWYXJzKHN0eWxlLCB2YWx1ZVdpdGhWYXIsIGRldGFpbHMpO1xyXG5cdFx0XHQvL2lmICh2YWx1ZT09PSdpbml0aWFsJykgdmFsdWUgPSBpbml0aWFsc1twcm9wXTtcclxuXHRcdFx0aWYgKGltcG9ydGFudCkgdmFsdWUgKz0gJyAhaW1wb3J0YW50JztcclxuXHRcdFx0Zm9yICh2YXIgaT0wLCBpdGVtOyBpdGVtPWVsLmllQ1BTZWxlY3RvcnNbcHJvcF1baSsrXTspIHsgLy8gdG9kbzogc3BsaXQgYW5kIHVzZSByZXF1ZXN0QW5pbWF0aW9uRnJhbWU/XHJcblx0XHRcdFx0aWYgKGl0ZW0uc2VsZWN0b3IgPT09ICclc3R5bGVBdHRyJykge1xyXG5cdFx0XHRcdFx0ZWwuc3R5bGVbcHJvcF0gPSB2YWx1ZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHRcdC8vIGJldGFcclxuXHRcdFx0XHRcdGlmICghaW1wb3J0YW50ICYmIGRldGFpbHMuYWxsQnlSb290ICE9PSBmYWxzZSkgY29udGludWU7IC8vIGRvbnQgaGF2ZSB0byBkcmF3IHJvb3QtcHJvcGVydGllc1xyXG5cclxuXHRcdFx0XHRcdC8vbGV0IHNlbGVjdG9yID0gaXRlbS5zZWxlY3Rvci5yZXBsYWNlKC8+PyBcXC5bXiBdKy8sICcgJywgaXRlbS5zZWxlY3Rvcik7IC8vIHRvZG86IHRyeSB0byBlcXVhbGl6ZSBzcGVjaWZpY2l0eVxyXG5cdFx0XHRcdFx0bGV0IHNlbGVjdG9yID0gaXRlbS5zZWxlY3RvcjtcclxuXHRcdFx0XHRcdGNzcyArPSBzZWxlY3RvciArICcuaWVjcC11JyArIGVsLmllQ1BfdW5pcXVlICsgaXRlbS5wc2V1ZG8gKyAneycgKyBwcm9wICsgJzonICsgdmFsdWUgKyAnfVxcbic7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbGVtZW50U2V0Q3NzKGVsLCBjc3MpO1xyXG5cdH1cclxuXHRmdW5jdGlvbiBlbGVtZW50U2V0Q3NzKGVsLCBjc3Mpe1xyXG5cdFx0aWYgKCFlbC5pZUNQX3N0eWxlRWwgJiYgY3NzKSB7XHJcblx0XHRcdGNvbnN0IHN0eWxlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xyXG5cdFx0XHRzdHlsZUVsLmllQ1BfZWxlbWVudFNoZWV0ID0gMTtcclxuXHRcdFx0Ly9lbC5hcHBlbmRDaGlsZChzdHlsZUVsKTsgLy8geWVzISBzZWxmLWNsb3NpbmcgdGFncyBjYW4gaGF2ZSBzdHlsZSBhcyBjaGlsZHJlbiwgYnV0IC0gaWYgaSBzZXQgaW5uZXJIVE1MLCB0aGUgc3R5bGVzaGVldCBpcyBsb3N0XHJcblx0XHRcdGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbCk7XHJcblx0XHRcdGVsLmllQ1Bfc3R5bGVFbCA9IHN0eWxlRWw7XHJcblx0XHR9XHJcblx0XHRpZiAoZWwuaWVDUF9zdHlsZUVsKSBlbC5pZUNQX3N0eWxlRWwuaW5uZXJIVE1MID0gY3NzO1xyXG5cdH1cclxuXHQvKiAqL1xyXG5cclxuXHRmdW5jdGlvbiBkcmF3VHJlZSh0YXJnZXQpIHtcclxuXHRcdGlmICghdGFyZ2V0KSByZXR1cm47XHJcblx0XHR2YXIgZWxzID0gdGFyZ2V0LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tpZWNwLW5lZWRlZF0nKTtcclxuXHRcdGlmICh0YXJnZXQuaGFzQXR0cmlidXRlICYmIHRhcmdldC5oYXNBdHRyaWJ1dGUoJ2llY3AtbmVlZGVkJykpIGRyYXdFbGVtZW50KHRhcmdldCk7IC8vIHNlbGZcclxuXHRcdGZvciAodmFyIGkgPSAwLCBlbDsgZWwgPSBlbHNbaSsrXTspIGRyYXdFbGVtZW50KGVsKTsgLy8gdHJlZVxyXG5cdH1cclxuXHQvLyBkcmF3IHF1ZXVlXHJcblx0bGV0IGRyYXdRdWV1ZSA9IG5ldyBTZXQoKTtcclxuXHRsZXQgY29sbGVjdGluZyA9IGZhbHNlO1xyXG5cdGxldCBkcmF3aW5nID0gZmFsc2U7XHJcblx0ZnVuY3Rpb24gZHJhd0VsZW1lbnQoZWwpe1xyXG5cdFx0ZHJhd1F1ZXVlLmFkZChlbCk7XHJcblx0XHRpZiAoY29sbGVjdGluZykgcmV0dXJuO1xyXG5cdFx0Y29sbGVjdGluZyA9IHRydWU7XHJcblx0XHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKXtcclxuXHRcdC8vc2V0SW1tZWRpYXRlKGZ1bmN0aW9uKCl7XHJcblx0XHRcdGNvbGxlY3RpbmcgPSBmYWxzZTtcclxuXHRcdFx0ZHJhd2luZyA9IHRydWU7XHJcblx0XHRcdGRyYXdRdWV1ZS5mb3JFYWNoKF9kcmF3RWxlbWVudCk7XHJcblx0XHRcdGRyYXdRdWV1ZS5jbGVhcigpO1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7IC8vIG11dGF0aW9uT2JzZXJ2ZXIgd2lsbCB0cmlnZ2VyIGRlbGF5ZWQsIHJlcXVlc3RBbmltYXRpb25GcmFtZSB3aWxsIG1pc3Mgc29tZSBjaGFuZ2VzXHJcblx0XHRcdFx0ZHJhd2luZyA9IGZhbHNlO1xyXG5cdFx0XHR9KVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cclxuXHRmdW5jdGlvbiBkcmF3VHJlZUV2ZW50KGUpIHtcclxuXHRcdGRyYXdUcmVlKGUudGFyZ2V0KVxyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gZmluZFZhcnMoc3RyLCBjYil7IC8vIGNzcyB2YWx1ZSBwYXJzZXJcclxuXHRcdGxldCBsZXZlbD0wLCBvcGVuZWRMZXZlbD1udWxsLCBsYXN0UG9pbnQ9MCwgbmV3U3RyID0gJycsIGk9MCwgY2hhciwgaW5zaWRlQ2FsYztcclxuXHRcdHdoaWxlIChjaGFyPXN0cltpKytdKSB7XHJcblx0XHRcdGlmIChjaGFyID09PSAnKCcpIHtcclxuXHRcdFx0XHQrK2xldmVsO1xyXG5cdFx0XHRcdGlmIChvcGVuZWRMZXZlbCA9PT0gbnVsbCAmJiBzdHJbaS00XStzdHJbaS0zXStzdHJbaS0yXSA9PT0gJ3ZhcicpIHtcclxuXHRcdFx0XHRcdG9wZW5lZExldmVsID0gbGV2ZWw7XHJcblx0XHRcdFx0XHRuZXdTdHIgKz0gc3RyLnN1YnN0cmluZyhsYXN0UG9pbnQsIGktNCk7XHJcblx0XHRcdFx0XHRsYXN0UG9pbnQgPSBpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoc3RyW2ktNV0rc3RyW2ktNF0rc3RyW2ktM10rc3RyW2ktMl0gPT09ICdjYWxjJykge1xyXG5cdFx0XHRcdFx0aW5zaWRlQ2FsYyA9IGxldmVsO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoY2hhciA9PT0gJyknICYmIG9wZW5lZExldmVsID09PSBsZXZlbCkge1xyXG5cdFx0XHRcdGxldCB2YXJpYWJsZSA9IHN0ci5zdWJzdHJpbmcobGFzdFBvaW50LCBpLTEpLnRyaW0oKSwgZmFsbGJhY2s7XHJcblx0XHRcdFx0bGV0IHggPSB2YXJpYWJsZS5pbmRleE9mKCcsJyk7XHJcblx0XHRcdFx0aWYgKHghPT0tMSkge1xyXG5cdFx0XHRcdFx0ZmFsbGJhY2sgPSB2YXJpYWJsZS5zbGljZSh4KzEpO1xyXG5cdFx0XHRcdFx0dmFyaWFibGUgPSB2YXJpYWJsZS5zbGljZSgwLHgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuZXdTdHIgKz0gY2IodmFyaWFibGUsIGZhbGxiYWNrLCBpbnNpZGVDYWxjKTtcclxuXHRcdFx0XHRsYXN0UG9pbnQgPSBpO1xyXG5cdFx0XHRcdG9wZW5lZExldmVsID0gbnVsbDtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoY2hhciA9PT0gJyknKSB7XHJcblx0XHRcdFx0LS1sZXZlbDtcclxuXHRcdFx0XHRpZiAoaW5zaWRlQ2FsYyA9PT0gbGV2ZWwpIGluc2lkZUNhbGMgPSBudWxsO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRuZXdTdHIgKz0gc3RyLnN1YnN0cmluZyhsYXN0UG9pbnQpO1xyXG5cdFx0cmV0dXJuIG5ld1N0cjtcclxuXHR9XHJcblx0ZnVuY3Rpb24gc3R5bGVDb21wdXRlVmFsdWVXaWR0aFZhcnMoc3R5bGUsIHZhbHVlV2l0aFZhcnMsIGRldGFpbHMpe1xyXG5cdFx0cmV0dXJuIGZpbmRWYXJzKHZhbHVlV2l0aFZhcnMsIGZ1bmN0aW9uKHZhcmlhYmxlLCBmYWxsYmFjaywgaW5zaWRlQ2FsYyl7XHJcblx0XHRcdHZhciB2YWx1ZSA9IHN0eWxlLmdldFByb3BlcnR5VmFsdWUodmFyaWFibGUpO1xyXG5cdFx0XHRpZiAoaW5zaWRlQ2FsYykgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9eY2FsY1xcKC8sICcoJyk7IC8vIHByZXZlbnQgbmVzdGVkIGNhbGNcclxuXHRcdFx0aWYgKGRldGFpbHMgJiYgc3R5bGUubGFzdFByb3BlcnR5U2VydmVkQnkgIT09IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkgZGV0YWlscy5hbGxCeVJvb3QgPSBmYWxzZTtcclxuXHRcdFx0aWYgKHZhbHVlPT09JycgJiYgZmFsbGJhY2spIHZhbHVlID0gc3R5bGVDb21wdXRlVmFsdWVXaWR0aFZhcnMoc3R5bGUsIGZhbGxiYWNrLCBkZXRhaWxzKTtcclxuXHRcdFx0cmV0dXJuIHZhbHVlO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHQvLyBtdXRhdGlvbiBsaXN0ZW5lclxyXG5cdHZhciBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uKG11dGF0aW9ucykge1xyXG5cdFx0aWYgKGRyYXdpbmcpIHJldHVybjtcclxuXHRcdGZvciAodmFyIGk9MCwgbXV0YXRpb247IG11dGF0aW9uPW11dGF0aW9uc1tpKytdOykge1xyXG5cdFx0XHRpZiAobXV0YXRpb24uYXR0cmlidXRlTmFtZSA9PT0gJ2llY3AtbmVlZGVkJykgY29udGludWU7IC8vIHdoeT9cclxuXHRcdFx0Ly8gcmVjaGVjayBhbGwgc2VsZWN0b3JzIGlmIGl0IHRhcmdldHMgbmV3IGVsZW1lbnRzP1xyXG5cdFx0XHRkcmF3VHJlZShtdXRhdGlvbi50YXJnZXQpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuXHRcdG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQse2F0dHJpYnV0ZXM6IHRydWUsIHN1YnRyZWU6IHRydWUgfSk7XHJcblx0fSlcclxuXHJcblx0Ly8gOnRhcmdldCBsaXN0ZW5lclxyXG5cdHZhciBvbGRIYXNoID0gbG9jYXRpb24uaGFzaFxyXG5cdGFkZEV2ZW50TGlzdGVuZXIoJ2hhc2hjaGFuZ2UnLGZ1bmN0aW9uKGUpe1xyXG5cdFx0dmFyIG5ld0VsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobG9jYXRpb24uaGFzaC5zdWJzdHIoMSkpO1xyXG5cdFx0aWYgKG5ld0VsKSB7XHJcblx0XHRcdHZhciBvbGRFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG9sZEhhc2guc3Vic3RyKDEpKTtcclxuXHRcdFx0ZHJhd1RyZWUobmV3RWwpO1xyXG5cdFx0XHRkcmF3VHJlZShvbGRFbCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRkcmF3VHJlZShkb2N1bWVudCk7XHJcblx0XHR9XHJcblx0XHRvbGRIYXNoID0gbG9jYXRpb24uaGFzaDtcclxuXHR9KTtcclxuXHJcblx0Ly8gYWRkIG93bmluZ0VsZW1lbnQgdG8gRWxlbWVudC5zdHlsZVxyXG5cdHZhciBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihIVE1MRWxlbWVudC5wcm90b3R5cGUsICdzdHlsZScpO1xyXG5cdHZhciBzdHlsZUdldHRlciA9IGRlc2NyaXB0b3IuZ2V0O1xyXG5cdGRlc2NyaXB0b3IuZ2V0ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0Y29uc3Qgc3R5bGUgPSBzdHlsZUdldHRlci5jYWxsKHRoaXMpO1xyXG5cdFx0c3R5bGUub3duaW5nRWxlbWVudCA9IHRoaXM7XHJcblx0XHRyZXR1cm4gc3R5bGU7XHJcblx0fVxyXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShIVE1MRWxlbWVudC5wcm90b3R5cGUsICdzdHlsZScsIGRlc2NyaXB0b3IpO1xyXG5cclxuXHQvLyBhZGQgY29tcHV0ZWRGb3IgdG8gY29tcHV0ZWQgc3R5bGUtb2JqZWN0c1xyXG5cdHZhciBvcmlnaW5hbEdldENvbXB1dGVkID0gZ2V0Q29tcHV0ZWRTdHlsZTtcclxuXHR3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSA9IGZ1bmN0aW9uIChlbCkge1xyXG5cdFx0dmFyIHN0eWxlID0gb3JpZ2luYWxHZXRDb21wdXRlZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG5cdFx0c3R5bGUuY29tcHV0ZWRGb3IgPSBlbDtcclxuXHRcdC8vc3R5bGUucHNldWRvRWx0ID0gcHNldWRvRWx0OyAvL25vdCBuZWVkZWQgYXQgdGhlIG1vbWVudFxyXG5cdFx0cmV0dXJuIHN0eWxlO1xyXG5cdH1cclxuXHJcblx0Ly8gZ2V0UHJvcGVydHlWYWx1ZSAvIHNldFByb3BlcnR5IGhvb2tzXHJcblx0Y29uc3QgU3R5bGVQcm90byA9IENTU1N0eWxlRGVjbGFyYXRpb24ucHJvdG90eXBlO1xyXG5cclxuXHRjb25zdCBvbGRHZXRQID0gU3R5bGVQcm90by5nZXRQcm9wZXJ0eVZhbHVlO1xyXG5cdFN0eWxlUHJvdG8uZ2V0UHJvcGVydHlWYWx1ZSA9IGZ1bmN0aW9uIChwcm9wZXJ0eSkge1xyXG5cdFx0dGhpcy5sYXN0UHJvcGVydHlTZXJ2ZWRCeSA9IGZhbHNlO1xyXG5cdFx0cHJvcGVydHkgPSBwcm9wZXJ0eS50cmltKCk7XHJcblxyXG5cdFx0LyogKlxyXG5cdFx0aWYgKHRoaXMub3duaW5nRWxlbWVudCkge1xyXG5cdFx0XHRjb25zdCBpZVByb3BlcnR5ID0gJy1pZVZhci0nK3Byb3BlcnR5O1xyXG5cdFx0XHRjb25zdCBpZVByb3BlcnR5SW1wb3J0YW50ID0gJy1pZVZhci3inZcnK3Byb3BlcnR5O1xyXG5cdFx0XHRsZXQgdmFsdWUgPSB0aGlzW2llUHJvcGVydHlJbXBvcnRhbnRdIHx8IHRoaXNbaWVQcm9wZXJ0eV07XHJcblx0XHRcdGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0Ly8gdG9kbywgdGVzdCBpZiBzeW50YXggdmFsaWRcclxuXHRcdFx0XHRyZXR1cm4gdmFsdWU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8qICovXHJcblxyXG5cdFx0aWYgKHByb3BlcnR5WzBdICE9PSAnLScgfHwgcHJvcGVydHlbMV0gIT09ICctJykgcmV0dXJuIG9sZEdldFAuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuXHRcdGNvbnN0IHVuZGFzaGVkID0gcHJvcGVydHkuc3Vic3RyKDIpO1xyXG5cdFx0Y29uc3QgaWVQcm9wZXJ0eSA9ICctaWUtJyt1bmRhc2hlZDtcclxuXHRcdGNvbnN0IGllUHJvcGVydHlJbXBvcnRhbnQgPSAnLWllLeKdlycrdW5kYXNoZWQ7XHJcblx0XHRsZXQgdmFsdWUgPSBkZWNvZGVWYWx1ZSh0aGlzW2llUHJvcGVydHlJbXBvcnRhbnRdIHx8IHRoaXNbaWVQcm9wZXJ0eV0pO1xyXG5cclxuXHRcdGlmICh0aGlzLmNvbXB1dGVkRm9yKSB7IC8vIGNvbXB1dGVkU3R5bGVcclxuXHRcdFx0aWYgKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgIWluaGVyaXRpbmdLZXl3b3Jkc1t2YWx1ZV0pIHtcclxuXHRcdFx0XHQvL2lmIChyZWdIYXNWYXIudGVzdCh2YWx1ZSkpICAvLyB0b2RvOiB0byBpIG5lZWQgdGhpcyBjaGVjaz8hISEgaSB0aGluayBpdHMgZmFzdGVyIHdpdGhvdXRcclxuXHRcdFx0XHRcdHZhbHVlID0gc3R5bGVDb21wdXRlVmFsdWVXaWR0aFZhcnModGhpcywgdmFsdWUpO1xyXG5cdFx0XHRcdHRoaXMubGFzdFByb3BlcnR5U2VydmVkQnkgPSB0aGlzLmNvbXB1dGVkRm9yO1xyXG5cdFx0XHR9IGVsc2UgeyAvLyBpbmhlcml0ZWRcclxuXHRcdFx0XHRpZiAoaW5oZXJpdGluZ0tleXdvcmRzW3ZhbHVlXSB8fCAhcmVnaXN0ZXJbcHJvcGVydHldIHx8IHJlZ2lzdGVyW3Byb3BlcnR5XS5pbmhlcml0cykge1xyXG5cdFx0XHRcdFx0Ly9sZXQgZWwgPSB0aGlzLnBzZXVkb0VsdCA/IHRoaXMuY29tcHV0ZWRGb3IgOiB0aGlzLmNvbXB1dGVkRm9yLnBhcmVudE5vZGU7XHJcblx0XHRcdFx0XHRsZXQgZWwgPSB0aGlzLmNvbXB1dGVkRm9yLnBhcmVudE5vZGU7XHJcblx0XHRcdFx0XHR3aGlsZSAoZWwubm9kZVR5cGUgPT09IDEpIHtcclxuXHRcdFx0XHRcdFx0Ly8gaG93IHNsb3dlciB3b3VsZCBpdCBiZSB0byBnZXRDb21wdXRlZFN0eWxlIGZvciBldmVyeSBlbGVtZW50LCBub3QganVzdCB3aXRoIGRlZmluZWQgaWVDUF9zZXR0ZXJzXHJcblx0XHRcdFx0XHRcdGlmIChlbC5pZUNQX3NldHRlcnMgJiYgZWwuaWVDUF9zZXR0ZXJzW3Byb3BlcnR5XSkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIGkgY291bGQgbWFrZVxyXG5cdFx0XHRcdFx0XHRcdC8vIHZhbHVlID0gZWwubm9kZVR5cGUgPyBnZXRDb21wdXRlZFN0eWxlKHRoaXMuY29tcHV0ZWRGb3IucGFyZW50Tm9kZSkuZ2V0UHJvcGVydHlWYWx1ZShwcm9wZXJ0eSlcclxuXHRcdFx0XHRcdFx0XHQvLyBidXQgaSBmZWFyIHBlcmZvcm1hbmNlLCBzdHVwaWQ/XHJcblx0XHRcdFx0XHRcdFx0dmFyIHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XHJcblx0XHRcdFx0XHRcdFx0dmFyIHRtcFZhbCA9IGRlY29kZVZhbHVlKHN0eWxlW2llUHJvcGVydHlJbXBvcnRhbnRdIHx8IHN0eWxlW2llUHJvcGVydHldKTtcclxuXHRcdFx0XHRcdFx0XHRpZiAodG1wVmFsICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIGNhbGN1bGF0ZWQgc3R5bGUgZnJvbSBjdXJyZW50IGVsZW1lbnQgbm90IGZyb20gdGhlIGVsZW1lbnQgdGhlIHZhbHVlIHdhcyBpbmhlcml0ZWQgZnJvbSEgKHN0eWxlLCB2YWx1ZSlcclxuXHRcdFx0XHRcdFx0XHRcdC8vdmFsdWUgPSB0bXBWYWw7IGlmIChyZWdIYXNWYXIudGVzdCh0bXBWYWwpKSAgLy8gdG9kbzogdG8gaSBuZWVkIHRoaXMgY2hlY2s/ISEhIGkgdGhpbmsgaXRzIGZhc3RlciB3aXRob3V0XHJcblx0XHRcdFx0XHRcdFx0XHRcdHZhbHVlID0gc3R5bGVDb21wdXRlVmFsdWVXaWR0aFZhcnModGhpcywgdG1wVmFsKTtcclxuXHRcdFx0XHRcdFx0XHRcdHRoaXMubGFzdFByb3BlcnR5U2VydmVkQnkgPSBlbDtcclxuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRlbCA9IGVsLnBhcmVudE5vZGU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmICh2YWx1ZT09PSdpbml0aWFsJykgcmV0dXJuICcnO1xyXG5cdFx0fVxyXG5cdFx0Ly9pZiAoKHZhbHVlID09PSB1bmRlZmluZWQgfHwgdmFsdWUgPT09ICdpbml0aWFsJykgJiYgcmVnaXN0ZXJbcHJvcGVydHldKSB2YWx1ZSA9IHJlZ2lzdGVyW3Byb3BlcnR5XS5pbml0aWFsVmFsdWU7IC8vIHRvZG8/XHJcblx0XHRpZiAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiByZWdpc3Rlcltwcm9wZXJ0eV0pIHZhbHVlID0gcmVnaXN0ZXJbcHJvcGVydHldLmluaXRpYWxWYWx1ZTtcclxuXHRcdGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSByZXR1cm4gJyc7XHJcblx0XHRyZXR1cm4gdmFsdWU7XHJcblx0fTtcclxuXHRjb25zdCBpbmhlcml0aW5nS2V5d29yZHMgPSB7aW5oZXJpdDoxLHJldmVydDoxLHVuc2V0OjF9O1xyXG5cclxuXHRjb25zdCBvbGRTZXRQID0gU3R5bGVQcm90by5zZXRQcm9wZXJ0eTtcclxuXHRTdHlsZVByb3RvLnNldFByb3BlcnR5ID0gZnVuY3Rpb24gKHByb3BlcnR5LCB2YWx1ZSwgcHJpbykge1xyXG5cdFx0aWYgKHByb3BlcnR5WzBdICE9PSAnLScgfHwgcHJvcGVydHlbMV0gIT09ICctJykgcmV0dXJuIG9sZFNldFAuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuXHRcdGNvbnN0IGVsID0gdGhpcy5vd25pbmdFbGVtZW50O1xyXG5cdFx0aWYgKGVsKSB7XHJcblx0XHRcdGlmICghZWwuaWVDUF9zZXR0ZXJzKSBlbC5pZUNQX3NldHRlcnMgPSB7fTtcclxuXHRcdFx0ZWwuaWVDUF9zZXR0ZXJzW3Byb3BlcnR5XSA9IDE7XHJcblx0XHR9XHJcblx0XHRwcm9wZXJ0eSA9ICctaWUtJysocHJpbz09PSdpbXBvcnRhbnQnPyfinZcnOicnKSArIHByb3BlcnR5LnN1YnN0cigyKTtcclxuXHRcdHRoaXMuY3NzVGV4dCArPSAnOyAnICsgcHJvcGVydHkgKyAnOicgKyBlbmNvZGVWYWx1ZSh2YWx1ZSkgKyAnOyc7XHJcblx0XHQvL3RoaXNbcHJvcGVydHldID0gdmFsdWU7XHJcblx0XHRlbCA9PT0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50ICYmIHJlZHJhd1N0eWxlU2hlZXRzKCk7XHJcblx0XHRlbCAmJiBkcmF3VHJlZShlbCk7IC8vIGl0cyBkZWxheWVkIGludGVybmFsXHJcblx0fTtcclxuXHJcblxyXG5cdC8qXHJcblx0dmFyIGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKFN0eWxlUHJvdG8sICdjc3NUZXh0Jyk7XHJcblx0dmFyIGNzc1RleHRHZXR0ZXIgPSBkZXNjcmlwdG9yLmdldDtcclxuXHR2YXIgY3NzVGV4dFNldHRlciA9IGRlc2NyaXB0b3Iuc2V0O1xyXG5cdC8vIGRlc2NyaXB0b3IuZ2V0ID0gZnVuY3Rpb24gKCkge1xyXG5cdC8vIFx0Y29uc3Qgc3R5bGUgPSBzdHlsZUdldHRlci5jYWxsKHRoaXMpO1xyXG5cdC8vIFx0c3R5bGUub3duaW5nRWxlbWVudCA9IHRoaXM7XHJcblx0Ly8gXHRyZXR1cm4gc3R5bGU7XHJcblx0Ly8gfVxyXG5cdGRlc2NyaXB0b3Iuc2V0ID0gZnVuY3Rpb24gKGNzcykge1xyXG5cdFx0dmFyIGVsID0gdGhpcy5vd25pbmdFbGVtZW50O1xyXG5cdFx0aWYgKGVsKSB7XHJcblx0XHRcdGNzcyA9IHJld3JpdGVDc3MoJ3snK2Nzcykuc3Vic3RyKDEpO1xyXG5cdFx0XHRjc3NUZXh0U2V0dGVyLmNhbGwodGhpcywgY3NzKTtcclxuXHRcdFx0dmFyIGZvdW5kID0gcGFyc2VSZXdyaXR0ZW5TdHlsZSh0aGlzKTtcclxuXHRcdFx0aWYgKGZvdW5kLmdldHRlcnMpIGFkZEdldHRlckVsZW1lbnQoZWwsIGZvdW5kLmdldHRlcnMsICclc3R5bGVBdHRyJyk7XHJcblx0XHRcdGlmIChmb3VuZC5zZXR0ZXJzKSBhZGRTZXR0ZXJFbGVtZW50KGVsLCBmb3VuZC5zZXR0ZXJzKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGNzc1RleHRTZXR0ZXIuY2FsbCh0aGlzLCBjc3MpO1xyXG5cdH1cclxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoU3R5bGVQcm90bywgJ2Nzc1RleHQnLCBkZXNjcmlwdG9yKTtcclxuXHQqL1xyXG5cclxuXHJcblx0aWYgKCF3aW5kb3cuQ1NTKSB3aW5kb3cuQ1NTID0ge307XHJcblx0Y29uc3QgcmVnaXN0ZXIgPSB7fVxyXG5cdENTUy5yZWdpc3RlclByb3BlcnR5ID0gZnVuY3Rpb24ob3B0aW9ucyl7XHJcblx0XHRyZWdpc3RlcltvcHRpb25zLm5hbWVdID0gb3B0aW9ucztcclxuXHR9XHJcblxyXG5cdC8vIGZpeCBcImluaXRpYWxcIiBrZXl3b3JkIHdpdGggZ2VuZXJhdGVkIGN1c3RvbSBwcm9wZXJ0aWVzLCB0aGlzIGlzIG5vdCBzdXBwb3J0ZWQgYWQgYWxsIGJ5IGllLCBzaG91bGQgaSBtYWtlIGEgc2VwYXJhdGUgXCJpbmhlcml0XCItcG9seWZpbGw/XHJcblx0LypcclxuXHRjb25zdCBjb21wdXRlZCA9IGdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KVxyXG5cdGNvbnN0IGluaXRpYWxzID0ge307XHJcblx0Zm9yIChsZXQgaSBpbiBjb21wdXRlZCkge1xyXG5cdFx0aW5pdGlhbHNbaS5yZXBsYWNlKC8oW0EtWl0pLywgZnVuY3Rpb24oeCl7IHJldHVybiAnLScreC50b0xvd2VyQ2FzZSh4KSB9KV0gPSBjb21wdXRlZFtpXTtcclxuXHR9XHJcblx0aW5pdGlhbHNbJ2Rpc3BsYXknXSA9ICdpbmxpbmUnO1xyXG5cdCovXHJcblxyXG5cdC8vIHV0aWxzXHJcblx0ZnVuY3Rpb24gZmV0Y2hDc3ModXJsLCBjYWxsYmFjaykge1xyXG5cdFx0dmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHRcdHJlcXVlc3Qub3BlbignR0VUJywgdXJsKTtcclxuXHRcdHJlcXVlc3Qub3ZlcnJpZGVNaW1lVHlwZSgndGV4dC9jc3MnKTtcclxuXHRcdHJlcXVlc3Qub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRpZiAocmVxdWVzdC5zdGF0dXMgPj0gMjAwICYmIHJlcXVlc3Quc3RhdHVzIDwgNDAwKSB7XHJcblx0XHRcdFx0Y2FsbGJhY2socmVxdWVzdC5yZXNwb25zZVRleHQpO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdFx0cmVxdWVzdC5zZW5kKCk7XHJcblx0fVxyXG5cclxufSgpO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9