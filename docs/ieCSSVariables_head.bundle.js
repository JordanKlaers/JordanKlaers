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
/******/ 	__webpack_require__.p = "/JordanKlaers/";
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
  'use strict';

  window['cssVariables'] = {}; // check for support

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

    var _loop = function _loop() {
      var found = parseRewrittenStyle(rule.style);

      if (found.getters) {
        addGettersSelector(rule.selectorText, found.getters);
      }

      if (found.setters) {
        window.cssVariables[rule.selectorText] = Object.keys(found.setters).reduce(function (acc, cssVariable) {
          if (!found.setters[cssVariable].includes("var(--")) acc[('--' + cssVariable).trim()] = found.setters[cssVariable].trim();
          return acc;
        }, {});
        addSettersSelector(rule.selectorText, found.setters);
      } // mediaQueries: redraw the hole document
      // better add events for each element?


      var media = rule.parentRule && rule.parentRule.media && rule.parentRule.media.mediaText;

      if (media && (found.getters || found.setters)) {
        matchMedia(media).addListener(function () {
          drawTree(document.documentElement);
        });
      }
    };

    while (rule = rules[i++]) {
      _loop();
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

    if (el.ieCP_styleEl) {
      el.ieCP_styleEl.innerHTML = css;
    }
  }
  /* */


  function drawTree(target) {
    if (!target) return;
    var els = target.querySelectorAll('[iecp-needed]');
    if (target.hasAttribute && target.hasAttribute('iecp-needed')) drawElement(target); // self

    for (var i = 0, el; el = els[i++];) {
      drawElement(el); // tree
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2llMTFDdXN0b21Qcm9wZXJ0aWVzLmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsInRlc3RFbCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInN0eWxlIiwic2V0UHJvcGVydHkiLCJnZXRQcm9wZXJ0eVZhbHVlIiwibXNNYXRjaGVzU2VsZWN0b3IiLCJFbGVtZW50IiwicHJvdG90eXBlIiwibWF0Y2hlcyIsImxpc3RlbmVycyIsInJvb3QiLCJPYnNlcnZlciIsInFzYSIsImVsIiwic2VsZWN0b3IiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZSIsIm9uRWxlbWVudCIsImNhbGxiYWNrIiwibGlzdGVuZXIiLCJlbGVtZW50cyIsIldlYWtNYXAiLCJlbHMiLCJpIiwic2V0IiwiY2FsbCIsInB1c2giLCJNdXRhdGlvbk9ic2VydmVyIiwiY2hlY2tNdXRhdGlvbnMiLCJvYnNlcnZlIiwiY2hpbGRMaXN0Iiwic3VidHJlZSIsImNoZWNrTGlzdGVuZXIiLCJ0YXJnZXQiLCJsb2FkZWQiLCJBcnJheSIsImFwcGx5IiwiaGFzIiwiY2hlY2tMaXN0ZW5lcnMiLCJpbnNpZGUiLCJtdXRhdGlvbnMiLCJqIiwibXV0YXRpb24iLCJub2RlcyIsImFkZGVkTm9kZXMiLCJub2RlVHlwZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJjb3B5UHJvcGVydHkiLCJwcm9wIiwiZnJvbSIsInRvIiwiZGVzYyIsIk9iamVjdCIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImRlZmluZVByb3BlcnR5IiwiSFRNTEVsZW1lbnQiLCJTVkdTdHlsZUVsZW1lbnQiLCJnZXQiLCJhbGwiLCJzdHlsZVNoZWV0cyIsInNoZWV0Iiwib3duZXJOb2RlIiwicmVnRmluZFNldHRlcnMiLCJyZWdGaW5kR2V0dGVycyIsInJlZ1J1bGVJRUdldHRlcnMiLCJyZWdSdWxlSUVTZXR0ZXJzIiwicmVnUHNldWRvcyIsImZldGNoQ3NzIiwiaHJlZiIsImNzcyIsIm5ld0NzcyIsInJld3JpdGVDc3MiLCJyZWxUb0FicyIsImRpc2FibGVkIiwibWVkaWEiLCJzZXRBdHRyaWJ1dGUiLCJwYXJlbnROb2RlIiwiaW5zZXJ0QmVmb3JlIiwiYWN0aXZhdGVTdHlsZUVsZW1lbnQiLCJmb3VuZFN0eWxlIiwiaWVDUF9wb2x5ZmlsbGVkIiwiaWVDUF9lbGVtZW50U2hlZXQiLCJpbm5lckhUTUwiLCJnZXRBdHRyaWJ1dGUiLCJzdWJzdHIiLCJjc3NUZXh0IiwiZm91bmQiLCJwYXJzZVJld3JpdHRlblN0eWxlIiwiZ2V0dGVycyIsImFkZEdldHRlckVsZW1lbnQiLCJzZXR0ZXJzIiwiYWRkU2V0dGVyRWxlbWVudCIsImJhc2UiLCJyZXBsYWNlIiwiJDAiLCIkMSIsInRyaW0iLCJtYXRjaCIsIiQyIiwiJDMiLCIkNCIsImltcG9ydGFudCIsImVuY29kZVZhbHVlIiwidmFsdWUiLCJrZXl3b3JkcyIsImluaXRpYWwiLCJpbmhlcml0IiwicmV2ZXJ0IiwidW5zZXQiLCJkZWNvZGVWYWx1ZSIsInVuZGVmaW5lZCIsInRyaW1tZWQiLCJzdHlsZXNfb2ZfZ2V0dGVyX3Byb3BlcnRpZXMiLCJtYXRjaGVzR2V0dGVycyIsInByb3BOYW1lIiwic2xpY2UiLCJtYXRjaGVzU2V0dGVycyIsIngiLCJzcGxpdCIsInByb3BWYWx1ZSIsInJ1bGVzIiwicnVsZSIsImFkZEdldHRlcnNTZWxlY3RvciIsInNlbGVjdG9yVGV4dCIsImNzc1ZhcmlhYmxlcyIsImtleXMiLCJyZWR1Y2UiLCJhY2MiLCJjc3NWYXJpYWJsZSIsImluY2x1ZGVzIiwiYWRkU2V0dGVyc1NlbGVjdG9yIiwicGFyZW50UnVsZSIsIm1lZGlhVGV4dCIsIm1hdGNoTWVkaWEiLCJhZGRMaXN0ZW5lciIsImRyYXdUcmVlIiwiZG9jdW1lbnRFbGVtZW50IiwicmVkcmF3U3R5bGVTaGVldHMiLCJwcm9wZXJ0aWVzIiwic2VsZWN0b3JBZGRQc2V1ZG9MaXN0ZW5lcnMiLCJ1blBzZXVkbyIsImRyYXdFbGVtZW50Iiwic2VsZWN0b3JzIiwiaWVDUFNlbGVjdG9ycyIsInBhcnRzIiwicHNldWRvIiwicHJvcFZhbHMiLCJpZUNQX3NldHRlcnMiLCJzdHlsZXMiLCJvd25pbmdFbGVtZW50Iiwic3R5bGVDb21wdXRlVmFsdWVXaWR0aFZhcnMiLCJnZXRDb21wdXRlZFN0eWxlIiwicHNldWRvcyIsImhvdmVyIiwib24iLCJvZmYiLCJmb2N1cyIsImFjdGl2ZSIsImxlbmd0aCIsImVuZGluZyIsInNlbCIsImRyYXdUcmVlRXZlbnQiLCJDU1NBY3RpdmUiLCJzZXRUaW1lb3V0IiwiYWN0aXZlRWxlbWVudCIsImV2dCIsImNyZWF0ZUV2ZW50IiwiaW5pdEV2ZW50IiwiZGlzcGF0Y2hFdmVudCIsInVuaXF1ZUNvdW50ZXIiLCJfZHJhd0VsZW1lbnQiLCJpZUNQX3VuaXF1ZSIsImNsYXNzTGlzdCIsImFkZCIsInZhbHVlV2l0aFZhciIsImRldGFpbHMiLCJpdGVtIiwiYWxsQnlSb290IiwiZWxlbWVudFNldENzcyIsImllQ1Bfc3R5bGVFbCIsInN0eWxlRWwiLCJoZWFkIiwiYXBwZW5kQ2hpbGQiLCJoYXNBdHRyaWJ1dGUiLCJkcmF3UXVldWUiLCJTZXQiLCJjb2xsZWN0aW5nIiwiZHJhd2luZyIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImZvckVhY2giLCJjbGVhciIsImZpbmRWYXJzIiwic3RyIiwiY2IiLCJsZXZlbCIsIm9wZW5lZExldmVsIiwibGFzdFBvaW50IiwibmV3U3RyIiwiY2hhciIsImluc2lkZUNhbGMiLCJzdWJzdHJpbmciLCJ2YXJpYWJsZSIsImZhbGxiYWNrIiwiaW5kZXhPZiIsInZhbHVlV2l0aFZhcnMiLCJsYXN0UHJvcGVydHlTZXJ2ZWRCeSIsIm9ic2VydmVyIiwiYXR0cmlidXRlTmFtZSIsImF0dHJpYnV0ZXMiLCJvbGRIYXNoIiwibG9jYXRpb24iLCJoYXNoIiwibmV3RWwiLCJnZXRFbGVtZW50QnlJZCIsIm9sZEVsIiwiZGVzY3JpcHRvciIsInN0eWxlR2V0dGVyIiwib3JpZ2luYWxHZXRDb21wdXRlZCIsImFyZ3VtZW50cyIsImNvbXB1dGVkRm9yIiwiU3R5bGVQcm90byIsIkNTU1N0eWxlRGVjbGFyYXRpb24iLCJvbGRHZXRQIiwicHJvcGVydHkiLCJ1bmRhc2hlZCIsImllUHJvcGVydHkiLCJpZVByb3BlcnR5SW1wb3J0YW50IiwiaW5oZXJpdGluZ0tleXdvcmRzIiwicmVnaXN0ZXIiLCJpbmhlcml0cyIsInRtcFZhbCIsImluaXRpYWxWYWx1ZSIsIm9sZFNldFAiLCJwcmlvIiwiQ1NTIiwicmVnaXN0ZXJQcm9wZXJ0eSIsIm9wdGlvbnMiLCJuYW1lIiwidXJsIiwicmVxdWVzdCIsIlhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsIm92ZXJyaWRlTWltZVR5cGUiLCJvbmxvYWQiLCJzdGF0dXMiLCJyZXNwb25zZVRleHQiLCJzZW5kIl0sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0EsQ0FBQyxZQUFZO0FBQ1o7O0FBRUFBLFFBQU0sQ0FBQyxjQUFELENBQU4sR0FBeUIsRUFBekIsQ0FIWSxDQUlaOztBQUNBLE1BQUlDLE1BQU0sR0FBR0MsUUFBUSxDQUFDQyxhQUFULENBQXVCLEdBQXZCLENBQWI7QUFDQUYsUUFBTSxDQUFDRyxLQUFQLENBQWFDLFdBQWIsQ0FBeUIsS0FBekIsRUFBZ0MsR0FBaEM7QUFDQSxNQUFJSixNQUFNLENBQUNHLEtBQVAsQ0FBYUUsZ0JBQWIsQ0FBOEIsS0FBOUIsTUFBeUMsR0FBekMsSUFBZ0QsQ0FBQ0wsTUFBTSxDQUFDTSxpQkFBNUQsRUFBK0U7QUFFL0UsTUFBSSxDQUFDQyxPQUFPLENBQUNDLFNBQVIsQ0FBa0JDLE9BQXZCLEVBQWdDRixPQUFPLENBQUNDLFNBQVIsQ0FBa0JDLE9BQWxCLEdBQTRCRixPQUFPLENBQUNDLFNBQVIsQ0FBa0JGLGlCQUE5QztBQUU3QixNQUFJSSxTQUFTLEdBQUcsRUFBaEI7QUFBQSxNQUNJQyxJQUFJLEdBQUdWLFFBRFg7QUFBQSxNQUVJVyxRQUZKOztBQUlILFdBQVNDLEdBQVQsQ0FBYUMsRUFBYixFQUFpQkMsUUFBakIsRUFBMEI7QUFDekIsUUFBSTtBQUNILGFBQU9ELEVBQUUsQ0FBQ0UsZ0JBQUgsQ0FBb0JELFFBQXBCLENBQVA7QUFDQSxLQUZELENBRUUsT0FBTUUsQ0FBTixFQUFTO0FBQ1Y7QUFDQSxhQUFPLEVBQVA7QUFDQTtBQUNEOztBQUNFLFdBQVNDLFNBQVQsQ0FBb0JILFFBQXBCLEVBQThCSSxRQUE5QixFQUF3QztBQUNwQyxRQUFJQyxRQUFRLEdBQUc7QUFDWEwsY0FBUSxFQUFFQSxRQURDO0FBRVhJLGNBQVEsRUFBRUEsUUFGQztBQUdYRSxjQUFRLEVBQUUsSUFBSUMsT0FBSjtBQUhDLEtBQWY7QUFLTixRQUFJQyxHQUFHLEdBQUdWLEdBQUcsQ0FBQ0YsSUFBRCxFQUFPUyxRQUFRLENBQUNMLFFBQWhCLENBQWI7QUFBQSxRQUF3Q1MsQ0FBQyxHQUFDLENBQTFDO0FBQUEsUUFBNkNWLEVBQTdDOztBQUNBLFdBQU9BLEVBQUUsR0FBR1MsR0FBRyxDQUFDQyxDQUFDLEVBQUYsQ0FBZixFQUFzQjtBQUNaSixjQUFRLENBQUNDLFFBQVQsQ0FBa0JJLEdBQWxCLENBQXNCWCxFQUF0QixFQUEwQixJQUExQjtBQUNBTSxjQUFRLENBQUNELFFBQVQsQ0FBa0JPLElBQWxCLENBQXVCWixFQUF2QixFQUEyQkEsRUFBM0I7QUFDSDs7QUFDREosYUFBUyxDQUFDaUIsSUFBVixDQUFlUCxRQUFmOztBQUNBLFFBQUksQ0FBQ1IsUUFBTCxFQUFlO0FBQ1hBLGNBQVEsR0FBRyxJQUFJZ0IsZ0JBQUosQ0FBcUJDLGNBQXJCLENBQVg7QUFDQWpCLGNBQVEsQ0FBQ2tCLE9BQVQsQ0FBaUJuQixJQUFqQixFQUF1QjtBQUNuQm9CLGlCQUFTLEVBQUUsSUFEUTtBQUVuQkMsZUFBTyxFQUFFO0FBRlUsT0FBdkI7QUFJSDs7QUFDREMsaUJBQWEsQ0FBQ2IsUUFBRCxDQUFiO0FBQ0g7O0FBQUE7O0FBQ0QsV0FBU2EsYUFBVCxDQUF1QmIsUUFBdkIsRUFBaUNjLE1BQWpDLEVBQXlDO0FBQ3JDLFFBQUlWLENBQUMsR0FBRyxDQUFSO0FBQUEsUUFBV1YsRUFBWDtBQUFBLFFBQWVTLEdBQUcsR0FBRyxFQUFyQjs7QUFDTixRQUFJO0FBQ0hXLFlBQU0sSUFBSUEsTUFBTSxDQUFDekIsT0FBUCxDQUFlVyxRQUFRLENBQUNMLFFBQXhCLENBQVYsSUFBK0NRLEdBQUcsQ0FBQ0ksSUFBSixDQUFTTyxNQUFULENBQS9DO0FBQ0EsS0FGRCxDQUVFLE9BQU1qQixDQUFOLEVBQVMsQ0FBRTs7QUFDUCxRQUFJa0IsTUFBSixFQUFZO0FBQUU7QUFDVkMsV0FBSyxDQUFDNUIsU0FBTixDQUFnQm1CLElBQWhCLENBQXFCVSxLQUFyQixDQUEyQmQsR0FBM0IsRUFBZ0NWLEdBQUcsQ0FBQ3FCLE1BQU0sSUFBSXZCLElBQVgsRUFBaUJTLFFBQVEsQ0FBQ0wsUUFBMUIsQ0FBbkM7QUFDSDs7QUFDRCxXQUFPRCxFQUFFLEdBQUdTLEdBQUcsQ0FBQ0MsQ0FBQyxFQUFGLENBQWYsRUFBc0I7QUFDbEIsVUFBSUosUUFBUSxDQUFDQyxRQUFULENBQWtCaUIsR0FBbEIsQ0FBc0J4QixFQUF0QixDQUFKLEVBQStCO0FBQy9CTSxjQUFRLENBQUNDLFFBQVQsQ0FBa0JJLEdBQWxCLENBQXNCWCxFQUF0QixFQUF5QixJQUF6QjtBQUNBTSxjQUFRLENBQUNELFFBQVQsQ0FBa0JPLElBQWxCLENBQXVCWixFQUF2QixFQUEyQkEsRUFBM0I7QUFDSDtBQUNKOztBQUNELFdBQVN5QixjQUFULENBQXdCQyxNQUF4QixFQUFnQztBQUM1QixRQUFJaEIsQ0FBQyxHQUFHLENBQVI7QUFBQSxRQUFXSixRQUFYOztBQUNBLFdBQU9BLFFBQVEsR0FBR1YsU0FBUyxDQUFDYyxDQUFDLEVBQUYsQ0FBM0I7QUFBa0NTLG1CQUFhLENBQUNiLFFBQUQsRUFBV29CLE1BQVgsQ0FBYjtBQUFsQztBQUNIOztBQUNELFdBQVNYLGNBQVQsQ0FBd0JZLFNBQXhCLEVBQW1DO0FBQ3JDLFFBQUlDLENBQUMsR0FBRyxDQUFSO0FBQUEsUUFBV2xCLENBQVg7QUFBQSxRQUFjbUIsUUFBZDtBQUFBLFFBQXdCQyxLQUF4QjtBQUFBLFFBQStCVixNQUEvQjs7QUFDTSxXQUFPUyxRQUFRLEdBQUdGLFNBQVMsQ0FBQ0MsQ0FBQyxFQUFGLENBQTNCLEVBQWtDO0FBQzlCRSxXQUFLLEdBQUdELFFBQVEsQ0FBQ0UsVUFBakIsRUFBNkJyQixDQUFDLEdBQUcsQ0FBakM7O0FBQ0EsYUFBT1UsTUFBTSxHQUFHVSxLQUFLLENBQUNwQixDQUFDLEVBQUYsQ0FBckI7QUFBNEJVLGNBQU0sQ0FBQ1ksUUFBUCxLQUFvQixDQUFwQixJQUF5QlAsY0FBYyxDQUFDTCxNQUFELENBQXZDO0FBQTVCO0FBQ0g7QUFDSjs7QUFFRCxNQUFJQyxNQUFNLEdBQUcsS0FBYjtBQUNBbEMsVUFBUSxDQUFDOEMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLFlBQVk7QUFDdERaLFVBQU0sR0FBRyxJQUFUO0FBQ0gsR0FGRCxFQXZFUyxDQTJFWjs7QUFDQSxXQUFTYSxZQUFULENBQXNCQyxJQUF0QixFQUE0QkMsSUFBNUIsRUFBa0NDLEVBQWxDLEVBQXFDO0FBQ3BDLFFBQUlDLElBQUksR0FBR0MsTUFBTSxDQUFDQyx3QkFBUCxDQUFnQ0osSUFBaEMsRUFBc0NELElBQXRDLENBQVg7QUFDQUksVUFBTSxDQUFDRSxjQUFQLENBQXNCSixFQUF0QixFQUEwQkYsSUFBMUIsRUFBZ0NHLElBQWhDO0FBQ0E7O0FBQ0QsTUFBSSxFQUFFLGVBQWU3QyxPQUFPLENBQUNDLFNBQXpCLENBQUosRUFBeUM7QUFDeEN3QyxnQkFBWSxDQUFDLFdBQUQsRUFBY1EsV0FBVyxDQUFDaEQsU0FBMUIsRUFBcUNELE9BQU8sQ0FBQ0MsU0FBN0MsQ0FBWjtBQUNBOztBQUNELE1BQUksRUFBRSxlQUFlRCxPQUFPLENBQUNDLFNBQXpCLENBQUosRUFBeUM7QUFDeEN3QyxnQkFBWSxDQUFDLFdBQUQsRUFBY1EsV0FBVyxDQUFDaEQsU0FBMUIsRUFBcUNELE9BQU8sQ0FBQ0MsU0FBN0MsQ0FBWjtBQUNBOztBQUNELE1BQUksRUFBRSxXQUFXaUQsZUFBZSxDQUFDakQsU0FBN0IsQ0FBSixFQUE2QztBQUM1QzZDLFVBQU0sQ0FBQ0UsY0FBUCxDQUFzQkUsZUFBZSxDQUFDakQsU0FBdEMsRUFBaUQsT0FBakQsRUFBMEQ7QUFDekRrRCxTQUFHLEVBQUMsZUFBVTtBQUNiLFlBQUlDLEdBQUcsR0FBRzFELFFBQVEsQ0FBQzJELFdBQW5CO0FBQUEsWUFBZ0NwQyxDQUFDLEdBQUMsQ0FBbEM7QUFBQSxZQUFxQ3FDLEtBQXJDOztBQUNBLGVBQU9BLEtBQUssR0FBQ0YsR0FBRyxDQUFDbkMsQ0FBQyxFQUFGLENBQWhCLEVBQXVCO0FBQ3RCLGNBQUlxQyxLQUFLLENBQUNDLFNBQU4sS0FBb0IsSUFBeEIsRUFBOEIsT0FBT0QsS0FBUDtBQUM5QjtBQUVEO0FBUHdELEtBQTFEO0FBU0EsR0FoR1csQ0FtR1o7QUFFQTs7O0FBQ0EsTUFBTUUsY0FBYyxHQUFHLHlFQUF2QjtBQUNBLE1BQU1DLGNBQWMsR0FBRyxpRkFBdkI7QUFDQSxNQUFNQyxnQkFBZ0IsR0FBRyxrQkFBekI7QUFDQSxNQUFNQyxnQkFBZ0IsR0FBRyxlQUF6QixDQXpHWSxDQTBHWjs7QUFDQSxNQUFNQyxVQUFVLEdBQUcsdUVBQW5CO0FBRUFqRCxXQUFTLENBQUMsd0JBQUQsRUFBMkIsVUFBVUosRUFBVixFQUFjO0FBQ2pEc0QsWUFBUSxDQUFDdEQsRUFBRSxDQUFDdUQsSUFBSixFQUFVLFVBQVVDLEdBQVYsRUFBZTtBQUNoQyxVQUFJQyxNQUFNLEdBQUdDLFVBQVUsQ0FBQ0YsR0FBRCxDQUF2QjtBQUNBLFVBQUlBLEdBQUcsS0FBS0MsTUFBWixFQUFvQjtBQUNwQkEsWUFBTSxHQUFHRSxRQUFRLENBQUMzRCxFQUFFLENBQUN1RCxJQUFKLEVBQVVFLE1BQVYsQ0FBakI7QUFDQXpELFFBQUUsQ0FBQzRELFFBQUgsR0FBYyxJQUFkO0FBQ0EsVUFBSXZFLEtBQUssR0FBR0YsUUFBUSxDQUFDQyxhQUFULENBQXVCLE9BQXZCLENBQVo7QUFDQSxVQUFJWSxFQUFFLENBQUM2RCxLQUFQLEVBQWN4RSxLQUFLLENBQUN5RSxZQUFOLENBQW1CLE9BQW5CLEVBQTRCOUQsRUFBRSxDQUFDNkQsS0FBL0I7QUFDZDdELFFBQUUsQ0FBQytELFVBQUgsQ0FBY0MsWUFBZCxDQUEyQjNFLEtBQTNCLEVBQWtDVyxFQUFsQztBQUNBaUUsMEJBQW9CLENBQUM1RSxLQUFELEVBQVFvRSxNQUFSLENBQXBCO0FBQ0EsS0FUTyxDQUFSO0FBVUEsR0FYUSxDQUFUOztBQWFBLFdBQVNTLFVBQVQsQ0FBb0JsRSxFQUFwQixFQUF1QjtBQUN0QixRQUFJQSxFQUFFLENBQUNtRSxlQUFQLEVBQXdCO0FBQ3hCLFFBQUluRSxFQUFFLENBQUNvRSxpQkFBUCxFQUEwQjtBQUMxQixRQUFJWixHQUFHLEdBQUd4RCxFQUFFLENBQUNxRSxTQUFiO0FBQ0EsUUFBSVosTUFBTSxHQUFHQyxVQUFVLENBQUNGLEdBQUQsQ0FBdkI7QUFDQSxRQUFJQSxHQUFHLEtBQUtDLE1BQVosRUFBb0I7QUFDcEJRLHdCQUFvQixDQUFDakUsRUFBRCxFQUFLeUQsTUFBTCxDQUFwQjtBQUNBOztBQUNEckQsV0FBUyxDQUFDLE9BQUQsRUFBVThELFVBQVYsQ0FBVCxDQWxJWSxDQW1JWjtBQUNBOztBQUlBOUQsV0FBUyxDQUFDLFlBQUQsRUFBZSxVQUFVSixFQUFWLEVBQWM7QUFDckMsUUFBSXlELE1BQU0sR0FBR0MsVUFBVSxDQUFDLE1BQUkxRCxFQUFFLENBQUNzRSxZQUFILENBQWdCLFVBQWhCLENBQUwsQ0FBVixDQUE0Q0MsTUFBNUMsQ0FBbUQsQ0FBbkQsQ0FBYjtBQUNBdkUsTUFBRSxDQUFDWCxLQUFILENBQVNtRixPQUFULElBQW9CLE1BQUtmLE1BQXpCO0FBQ0EsUUFBSWdCLEtBQUssR0FBR0MsbUJBQW1CLENBQUMxRSxFQUFFLENBQUNYLEtBQUosQ0FBL0I7QUFDQSxRQUFJb0YsS0FBSyxDQUFDRSxPQUFWLEVBQW1CQyxnQkFBZ0IsQ0FBQzVFLEVBQUQsRUFBS3lFLEtBQUssQ0FBQ0UsT0FBWCxFQUFvQixZQUFwQixDQUFoQjtBQUNuQixRQUFJRixLQUFLLENBQUNJLE9BQVYsRUFBbUJDLGdCQUFnQixDQUFDOUUsRUFBRCxFQUFLeUUsS0FBSyxDQUFDSSxPQUFYLENBQWhCO0FBQ25CLEdBTlEsQ0FBVDs7QUFRQSxXQUFTbEIsUUFBVCxDQUFrQm9CLElBQWxCLEVBQXdCdkIsR0FBeEIsRUFBNkI7QUFDNUIsV0FBT0EsR0FBRyxDQUFDd0IsT0FBSixDQUFZLGlCQUFaLEVBQStCLFVBQVNDLEVBQVQsRUFBYUMsRUFBYixFQUFnQjtBQUNyREEsUUFBRSxHQUFHQSxFQUFFLENBQUNDLElBQUgsR0FBVUgsT0FBVixDQUFrQixnQkFBbEIsRUFBbUMsRUFBbkMsQ0FBTDtBQUNBLFVBQUlFLEVBQUUsQ0FBQ0UsS0FBSCxDQUFTLGVBQVQsQ0FBSixFQUErQixPQUFPSCxFQUFQO0FBQy9CRixVQUFJLEdBQUdBLElBQUksQ0FBQ0MsT0FBTCxDQUFhLE1BQWIsRUFBb0IsRUFBcEIsQ0FBUDtBQUNBLGFBQU8sU0FBUUQsSUFBUixHQUFlLE9BQWYsR0FBeUJHLEVBQXpCLEdBQTZCLEdBQXBDO0FBQ0EsS0FMTSxDQUFQO0FBTUEsR0F2SlcsQ0F5Slo7QUFDQTtBQUNBOzs7QUFDQSxXQUFTeEIsVUFBVCxDQUFvQkYsR0FBcEIsRUFBeUI7QUFFeEI7Ozs7Ozs7Ozs7Ozs7O0FBY0EsV0FBT0EsR0FBRyxDQUFDd0IsT0FBSixDQUFZL0IsY0FBWixFQUE0QixVQUFTZ0MsRUFBVCxFQUFhQyxFQUFiLEVBQWlCRyxFQUFqQixFQUFxQkMsRUFBckIsRUFBeUJDLEVBQXpCLEVBQTZCQyxTQUE3QixFQUF1QztBQUN6RSxhQUFPTixFQUFFLEdBQUMsTUFBSCxJQUFXTSxTQUFTLEdBQUMsR0FBRCxHQUFLLEVBQXpCLElBQTZCRixFQUE3QixHQUFnQyxHQUFoQyxHQUFvQ0csV0FBVyxDQUFDRixFQUFELENBQXREO0FBQ0EsS0FGTSxFQUVKUCxPQUZJLENBRUk5QixjQUZKLEVBRW9CLFVBQVMrQixFQUFULEVBQWFDLEVBQWIsRUFBaUJHLEVBQWpCLEVBQXFCRyxTQUFyQixFQUErQjtBQUN6RCxhQUFPTixFQUFFLEdBQUMsU0FBSCxJQUFjTSxTQUFTLEdBQUMsR0FBRCxHQUFLLEVBQTVCLElBQWdDSCxFQUFoQyxHQUFtQyxJQUFuQyxHQUF3Q0EsRUFBL0MsQ0FEeUQsQ0FDTjtBQUNuRCxLQUpNLENBQVA7QUFLQTs7QUFDRCxXQUFTSSxXQUFULENBQXFCQyxLQUFyQixFQUEyQjtBQUMxQixXQUFPQSxLQUFQO0FBQ0EsV0FBT0EsS0FBSyxDQUFDVixPQUFOLENBQWMsSUFBZCxFQUFtQixHQUFuQixDQUFQO0FBQ0E7O0FBQ0QsTUFBTVcsUUFBUSxHQUFHO0FBQUNDLFdBQU8sRUFBQyxDQUFUO0FBQVdDLFdBQU8sRUFBQyxDQUFuQjtBQUFxQkMsVUFBTSxFQUFDLENBQTVCO0FBQThCQyxTQUFLLEVBQUM7QUFBcEMsR0FBakI7O0FBQ0EsV0FBU0MsV0FBVCxDQUFxQk4sS0FBckIsRUFBMkI7QUFDMUIsV0FBT0EsS0FBUDtBQUNBLFFBQUlBLEtBQUssS0FBR08sU0FBWixFQUF1QjtBQUN2QlAsU0FBSyxHQUFJQSxLQUFLLENBQUNWLE9BQU4sQ0FBYyxJQUFkLEVBQW1CLEdBQW5CLENBQVQ7QUFDQSxRQUFNa0IsT0FBTyxHQUFHUixLQUFLLENBQUNQLElBQU4sRUFBaEI7QUFDQSxRQUFJUSxRQUFRLENBQUNPLE9BQUQsQ0FBWixFQUF1QixPQUFPQSxPQUFQO0FBQ3ZCLFdBQU9SLEtBQVA7QUFDQSxHQTlMVyxDQWdNWjs7O0FBQ0EsTUFBTVMsMkJBQTJCLEdBQUcsRUFBcEM7O0FBRUEsV0FBU3pCLG1CQUFULENBQTZCckYsS0FBN0IsRUFBb0M7QUFBRTtBQUVyQztBQUNBQSxTQUFLLENBQUMsU0FBRCxDQUFMLENBSG1DLENBR2pCOztBQUVsQixRQUFNbUYsT0FBTyxHQUFHbkYsS0FBSyxDQUFDbUYsT0FBdEI7QUFDQSxRQUFJNEIsY0FBYyxHQUFHNUIsT0FBTyxDQUFDWSxLQUFSLENBQWNqQyxnQkFBZCxDQUFyQjtBQUFBLFFBQXNEdkIsQ0FBdEQ7QUFBQSxRQUF5RHdELEtBQXpEOztBQUNBLFFBQUlnQixjQUFKLEVBQW9CO0FBQ25CLFVBQUl6QixPQUFPLEdBQUcsRUFBZCxDQURtQixDQUNEOztBQUNsQixXQUFLL0MsQ0FBQyxHQUFHLENBQVQsRUFBWXdELEtBQUssR0FBR2dCLGNBQWMsQ0FBQ3hFLENBQUMsRUFBRixDQUFsQyxHQUEwQztBQUN6QyxZQUFJeUUsUUFBUSxHQUFHakIsS0FBSyxDQUFDa0IsS0FBTixDQUFZLENBQVosRUFBZSxDQUFDLENBQWhCLENBQWY7QUFDQSxZQUFJRCxRQUFRLENBQUMsQ0FBRCxDQUFSLEtBQWdCLEdBQXBCLEVBQXlCQSxRQUFRLEdBQUdBLFFBQVEsQ0FBQzlCLE1BQVQsQ0FBZ0IsQ0FBaEIsQ0FBWDtBQUN6QkksZUFBTyxDQUFDOUQsSUFBUixDQUFhd0YsUUFBYixFQUh5QyxDQUt6Qzs7QUFDQSxZQUFJLENBQUNGLDJCQUEyQixDQUFDRSxRQUFELENBQWhDLEVBQTRDRiwyQkFBMkIsQ0FBQ0UsUUFBRCxDQUEzQixHQUF3QyxFQUF4QztBQUM1Q0YsbUNBQTJCLENBQUNFLFFBQUQsQ0FBM0IsQ0FBc0N4RixJQUF0QyxDQUEyQ3hCLEtBQTNDO0FBQ0E7QUFDRDs7QUFDRCxRQUFJa0gsY0FBYyxHQUFHL0IsT0FBTyxDQUFDWSxLQUFSLENBQWNoQyxnQkFBZCxDQUFyQjs7QUFDQSxRQUFJbUQsY0FBSixFQUFvQjtBQUNuQixVQUFJMUIsT0FBTyxHQUFHLEVBQWQsQ0FEbUIsQ0FDRDs7QUFDbEIsV0FBS2pELENBQUMsR0FBRyxDQUFULEVBQVl3RCxLQUFLLEdBQUdtQixjQUFjLENBQUMzRSxDQUFDLEVBQUYsQ0FBbEMsR0FBMEM7QUFDekMsWUFBSTRFLENBQUMsR0FBR3BCLEtBQUssQ0FBQ2IsTUFBTixDQUFhLENBQWIsRUFBZ0JrQyxLQUFoQixDQUFzQixHQUF0QixDQUFSO0FBQ0EsWUFBSUosU0FBUSxHQUFHRyxDQUFDLENBQUMsQ0FBRCxDQUFoQjtBQUNBLFlBQUlFLFNBQVMsR0FBR0YsQ0FBQyxDQUFDLENBQUQsQ0FBakI7QUFDQSxZQUFJSCxTQUFRLENBQUMsQ0FBRCxDQUFSLEtBQWdCLEdBQXBCLEVBQXlCQSxTQUFRLEdBQUdBLFNBQVEsQ0FBQzlCLE1BQVQsQ0FBZ0IsQ0FBaEIsQ0FBWDtBQUN6Qk0sZUFBTyxDQUFDd0IsU0FBRCxDQUFQLEdBQW9CSyxTQUFwQjtBQUNBO0FBQ0Q7O0FBQ0QsV0FBTztBQUFDL0IsYUFBTyxFQUFDQSxPQUFUO0FBQWtCRSxhQUFPLEVBQUNBO0FBQTFCLEtBQVA7QUFDQTs7QUFDRCxXQUFTWixvQkFBVCxDQUE4QjVFLEtBQTlCLEVBQXFDbUUsR0FBckMsRUFBMEM7QUFDekNuRSxTQUFLLENBQUNnRixTQUFOLEdBQWtCYixHQUFsQjtBQUNBbkUsU0FBSyxDQUFDOEUsZUFBTixHQUF3QixJQUF4QjtBQUNBLFFBQUl3QyxLQUFLLEdBQUd0SCxLQUFLLENBQUMwRCxLQUFOLENBQVk0RCxLQUF4QjtBQUFBLFFBQStCakcsQ0FBQyxHQUFDLENBQWpDO0FBQUEsUUFBb0NrRyxJQUFwQyxDQUh5QyxDQUdDOztBQUhEO0FBS3hDLFVBQU1uQyxLQUFLLEdBQUdDLG1CQUFtQixDQUFDa0MsSUFBSSxDQUFDdkgsS0FBTixDQUFqQzs7QUFDQSxVQUFJb0YsS0FBSyxDQUFDRSxPQUFWLEVBQW1CO0FBQ2xCa0MsMEJBQWtCLENBQUNELElBQUksQ0FBQ0UsWUFBTixFQUFvQnJDLEtBQUssQ0FBQ0UsT0FBMUIsQ0FBbEI7QUFDQTs7QUFDRCxVQUFJRixLQUFLLENBQUNJLE9BQVYsRUFBbUI7QUFDbEI1RixjQUFNLENBQUM4SCxZQUFQLENBQW9CSCxJQUFJLENBQUNFLFlBQXpCLElBQXlDdkUsTUFBTSxDQUFDeUUsSUFBUCxDQUFZdkMsS0FBSyxDQUFDSSxPQUFsQixFQUEyQm9DLE1BQTNCLENBQWtDLFVBQUNDLEdBQUQsRUFBTUMsV0FBTixFQUFzQjtBQUNoRyxjQUFJLENBQUMxQyxLQUFLLENBQUNJLE9BQU4sQ0FBY3NDLFdBQWQsRUFBMkJDLFFBQTNCLENBQW9DLFFBQXBDLENBQUwsRUFBb0RGLEdBQUcsQ0FBQyxDQUFDLE9BQU9DLFdBQVIsRUFBcUJoQyxJQUFyQixFQUFELENBQUgsR0FBbUNWLEtBQUssQ0FBQ0ksT0FBTixDQUFjc0MsV0FBZCxFQUEyQmhDLElBQTNCLEVBQW5DO0FBQ3BELGlCQUFPK0IsR0FBUDtBQUNBLFNBSHdDLEVBR3RDLEVBSHNDLENBQXpDO0FBSUFHLDBCQUFrQixDQUFDVCxJQUFJLENBQUNFLFlBQU4sRUFBb0JyQyxLQUFLLENBQUNJLE9BQTFCLENBQWxCO0FBQ0EsT0FmdUMsQ0FpQnhDO0FBQ0E7OztBQUNBLFVBQU1oQixLQUFLLEdBQUcrQyxJQUFJLENBQUNVLFVBQUwsSUFBbUJWLElBQUksQ0FBQ1UsVUFBTCxDQUFnQnpELEtBQW5DLElBQTRDK0MsSUFBSSxDQUFDVSxVQUFMLENBQWdCekQsS0FBaEIsQ0FBc0IwRCxTQUFoRjs7QUFDQSxVQUFJMUQsS0FBSyxLQUFLWSxLQUFLLENBQUNFLE9BQU4sSUFBaUJGLEtBQUssQ0FBQ0ksT0FBNUIsQ0FBVCxFQUErQztBQUM5QzJDLGtCQUFVLENBQUMzRCxLQUFELENBQVYsQ0FBa0I0RCxXQUFsQixDQUE4QixZQUFVO0FBQ3ZDQyxrQkFBUSxDQUFDdkksUUFBUSxDQUFDd0ksZUFBVixDQUFSO0FBQ0EsU0FGRDtBQUdBO0FBeEJ1Qzs7QUFJekMsV0FBT2YsSUFBSSxHQUFHRCxLQUFLLENBQUNqRyxDQUFDLEVBQUYsQ0FBbkIsRUFBMEI7QUFBQTtBQXFCekIsS0F6QndDLENBMkJ6Qzs7O0FBQ0FrSCxxQkFBaUI7QUFDakI7O0FBRUQsV0FBU2Ysa0JBQVQsQ0FBNEI1RyxRQUE1QixFQUFzQzRILFVBQXRDLEVBQWtEO0FBQ2pEQyw4QkFBMEIsQ0FBQzdILFFBQUQsQ0FBMUI7QUFDQUcsYUFBUyxDQUFDMkgsUUFBUSxDQUFDOUgsUUFBRCxDQUFULEVBQXFCLFVBQVVELEVBQVYsRUFBYztBQUMzQzRFLHNCQUFnQixDQUFDNUUsRUFBRCxFQUFLNkgsVUFBTCxFQUFpQjVILFFBQWpCLENBQWhCO0FBQ0ErSCxpQkFBVyxDQUFDaEksRUFBRCxDQUFYO0FBQ0EsS0FIUSxDQUFUO0FBSUE7O0FBQ0QsV0FBUzRFLGdCQUFULENBQTBCNUUsRUFBMUIsRUFBOEI2SCxVQUE5QixFQUEwQzVILFFBQTFDLEVBQW9EO0FBQ25ELFFBQUlTLENBQUMsR0FBQyxDQUFOO0FBQUEsUUFBU3lCLElBQVQ7QUFBQSxRQUFlUCxDQUFmO0FBQ0EsUUFBTXFHLFNBQVMsR0FBR2hJLFFBQVEsQ0FBQ3dHLEtBQVQsQ0FBZSxHQUFmLENBQWxCLENBRm1ELENBRVo7O0FBQ3ZDekcsTUFBRSxDQUFDOEQsWUFBSCxDQUFnQixhQUFoQixFQUErQixJQUEvQjtBQUNBLFFBQUksQ0FBQzlELEVBQUUsQ0FBQ2tJLGFBQVIsRUFBdUJsSSxFQUFFLENBQUNrSSxhQUFILEdBQW1CLEVBQW5COztBQUN2QixXQUFPL0YsSUFBSSxHQUFHMEYsVUFBVSxDQUFDbkgsQ0FBQyxFQUFGLENBQXhCLEVBQStCO0FBQzlCLFdBQUtrQixDQUFDLEdBQUcsQ0FBVCxFQUFZM0IsUUFBUSxHQUFHZ0ksU0FBUyxDQUFDckcsQ0FBQyxFQUFGLENBQWhDLEdBQXdDO0FBQ3ZDLFlBQU11RyxLQUFLLEdBQUdsSSxRQUFRLENBQUNrRixJQUFULEdBQWdCc0IsS0FBaEIsQ0FBc0IsSUFBdEIsQ0FBZDtBQUNBLFlBQUksQ0FBQ3pHLEVBQUUsQ0FBQ2tJLGFBQUgsQ0FBaUIvRixJQUFqQixDQUFMLEVBQTZCbkMsRUFBRSxDQUFDa0ksYUFBSCxDQUFpQi9GLElBQWpCLElBQXlCLEVBQXpCO0FBQzdCbkMsVUFBRSxDQUFDa0ksYUFBSCxDQUFpQi9GLElBQWpCLEVBQXVCdEIsSUFBdkIsQ0FBNEI7QUFDM0JaLGtCQUFRLEVBQUVrSSxLQUFLLENBQUMsQ0FBRCxDQURZO0FBRTNCQyxnQkFBTSxFQUFFRCxLQUFLLENBQUMsQ0FBRCxDQUFMLEdBQVcsT0FBT0EsS0FBSyxDQUFDLENBQUQsQ0FBdkIsR0FBNkI7QUFGVixTQUE1QjtBQUlBO0FBQ0Q7QUFDRDs7QUFDRCxXQUFTZCxrQkFBVCxDQUE0QnBILFFBQTVCLEVBQXNDb0ksUUFBdEMsRUFBZ0Q7QUFDL0NQLDhCQUEwQixDQUFDN0gsUUFBRCxDQUExQjtBQUNBRyxhQUFTLENBQUMySCxRQUFRLENBQUM5SCxRQUFELENBQVQsRUFBcUIsVUFBVUQsRUFBVixFQUFjO0FBQzNDOEUsc0JBQWdCLENBQUM5RSxFQUFELEVBQUtxSSxRQUFMLENBQWhCO0FBQ0EsS0FGUSxDQUFUO0FBR0E7O0FBQ0QsV0FBU3ZELGdCQUFULENBQTBCOUUsRUFBMUIsRUFBOEJxSSxRQUE5QixFQUF3QztBQUN2QyxRQUFJLENBQUNySSxFQUFFLENBQUNzSSxZQUFSLEVBQXNCdEksRUFBRSxDQUFDc0ksWUFBSCxHQUFrQixFQUFsQjs7QUFDdEIsU0FBSyxJQUFJbkcsSUFBVCxJQUFpQmtHLFFBQWpCLEVBQTJCO0FBQUU7QUFDNUJySSxRQUFFLENBQUNzSSxZQUFILENBQWdCLE9BQU9uRyxJQUF2QixJQUErQixDQUEvQjtBQUNBOztBQUNEdUYsWUFBUSxDQUFDMUgsRUFBRCxDQUFSO0FBQ0EsR0FyU1csQ0F1U1o7OztBQUNBLFdBQVM0SCxpQkFBVCxHQUE2QjtBQUM1QixTQUFLLElBQUl6RixJQUFULElBQWlCZ0UsMkJBQWpCLEVBQThDO0FBQzdDLFVBQUlvQyxNQUFNLEdBQUdwQywyQkFBMkIsQ0FBQ2hFLElBQUQsQ0FBeEM7O0FBQ0EsV0FBSyxJQUFJekIsQ0FBQyxHQUFDLENBQU4sRUFBU3JCLEtBQWQsRUFBcUJBLEtBQUssR0FBQ2tKLE1BQU0sQ0FBQzdILENBQUMsRUFBRixDQUFqQyxHQUF5QztBQUN4QyxZQUFJckIsS0FBSyxDQUFDbUosYUFBVixFQUF5QjtBQUN6QixZQUFJOUMsS0FBSyxHQUFHckcsS0FBSyxDQUFDLFlBQVU4QyxJQUFYLENBQWpCO0FBQ0EsWUFBSSxDQUFDdUQsS0FBTCxFQUFZO0FBQ1pBLGFBQUssR0FBRytDLDBCQUEwQixDQUFDQyxnQkFBZ0IsQ0FBQ3ZKLFFBQVEsQ0FBQ3dJLGVBQVYsQ0FBakIsRUFBNkNqQyxLQUE3QyxDQUFsQztBQUNBLFlBQUlBLEtBQUssS0FBSyxFQUFkLEVBQWtCOztBQUNsQixZQUFJO0FBQ0hyRyxlQUFLLENBQUM4QyxJQUFELENBQUwsR0FBY3VELEtBQWQ7QUFDQSxTQUZELENBRUUsT0FBTXZGLENBQU4sRUFBUyxDQUFFO0FBQ2I7QUFDRDtBQUNEOztBQUdELE1BQU13SSxPQUFPLEdBQUc7QUFDZkMsU0FBSyxFQUFDO0FBQ0xDLFFBQUUsRUFBQyxZQURFO0FBRUxDLFNBQUcsRUFBQztBQUZDLEtBRFM7QUFLZkMsU0FBSyxFQUFDO0FBQ0xGLFFBQUUsRUFBQyxTQURFO0FBRUxDLFNBQUcsRUFBQztBQUZDLEtBTFM7QUFTZkUsVUFBTSxFQUFDO0FBQ05ILFFBQUUsRUFBQyxhQURHO0FBRU5DLFNBQUcsRUFBQztBQUZFO0FBVFEsR0FBaEI7O0FBY0EsV0FBU2hCLDBCQUFULENBQW9DN0gsUUFBcEMsRUFBNkM7QUFDNUM7QUFDQTtBQUNBO0FBQ0FBLFlBQVEsR0FBR0EsUUFBUSxDQUFDd0csS0FBVCxDQUFlLEdBQWYsRUFBb0IsQ0FBcEIsQ0FBWDs7QUFDQSxTQUFLLElBQUkyQixNQUFULElBQW1CTyxPQUFuQixFQUE0QjtBQUMzQixVQUFJUixLQUFLLEdBQUdsSSxRQUFRLENBQUN3RyxLQUFULENBQWUsTUFBSTJCLE1BQW5CLENBQVo7O0FBQ0EsVUFBSUQsS0FBSyxDQUFDYyxNQUFOLEdBQWUsQ0FBbkIsRUFBc0I7QUFBQSxZQUNqQkMsTUFEaUI7O0FBQUE7QUFDakJBLGdCQUFNLEdBQUdmLEtBQUssQ0FBQyxDQUFELENBQUwsQ0FBUy9DLEtBQVQsQ0FBZSxTQUFmLENBRFEsRUFDbUI7O0FBQ3hDLGNBQUkrRCxHQUFHLEdBQUdwQixRQUFRLENBQUNJLEtBQUssQ0FBQyxDQUFELENBQUwsR0FBU2UsTUFBVixDQUFsQjtBQUNBLGNBQU10SixTQUFTLEdBQUcrSSxPQUFPLENBQUNQLE1BQUQsQ0FBekI7QUFDQWhJLG1CQUFTLENBQUMrSSxHQUFELEVBQU0sVUFBVW5KLEVBQVYsRUFBYztBQUM1QkEsY0FBRSxDQUFDaUMsZ0JBQUgsQ0FBb0JyQyxTQUFTLENBQUNpSixFQUE5QixFQUFrQ08sYUFBbEM7QUFDQXBKLGNBQUUsQ0FBQ2lDLGdCQUFILENBQW9CckMsU0FBUyxDQUFDa0osR0FBOUIsRUFBbUNNLGFBQW5DO0FBQ0EsV0FIUSxDQUFUO0FBSnFCO0FBUXJCO0FBQ0Q7QUFDRDs7QUFDRCxNQUFJQyxTQUFTLEdBQUcsSUFBaEI7QUFDQWxLLFVBQVEsQ0FBQzhDLGdCQUFULENBQTBCLFdBQTFCLEVBQXNDLFVBQVM5QixDQUFULEVBQVc7QUFDaERtSixjQUFVLENBQUMsWUFBVTtBQUNwQixVQUFJbkosQ0FBQyxDQUFDaUIsTUFBRixLQUFhakMsUUFBUSxDQUFDb0ssYUFBMUIsRUFBeUM7QUFDeEMsWUFBSUMsR0FBRyxHQUFHckssUUFBUSxDQUFDc0ssV0FBVCxDQUFxQixPQUFyQixDQUFWO0FBQ0FELFdBQUcsQ0FBQ0UsU0FBSixDQUFjLGFBQWQsRUFBNkIsSUFBN0IsRUFBbUMsSUFBbkM7QUFDQUwsaUJBQVMsR0FBR2xKLENBQUMsQ0FBQ2lCLE1BQWQ7QUFDQWlJLGlCQUFTLENBQUNNLGFBQVYsQ0FBd0JILEdBQXhCO0FBQ0E7QUFDRCxLQVBTLENBQVY7QUFRQSxHQVREO0FBVUFySyxVQUFRLENBQUM4QyxnQkFBVCxDQUEwQixTQUExQixFQUFvQyxZQUFVO0FBQzdDLFFBQUlvSCxTQUFKLEVBQWU7QUFDZCxVQUFJRyxHQUFHLEdBQUdySyxRQUFRLENBQUNzSyxXQUFULENBQXFCLE9BQXJCLENBQVY7QUFDQUQsU0FBRyxDQUFDRSxTQUFKLENBQWMsZUFBZCxFQUErQixJQUEvQixFQUFxQyxJQUFyQztBQUNBTCxlQUFTLENBQUNNLGFBQVYsQ0FBd0JILEdBQXhCO0FBQ0FILGVBQVMsR0FBRyxJQUFaO0FBQ0E7QUFDRCxHQVBEOztBQVNBLFdBQVN0QixRQUFULENBQWtCOUgsUUFBbEIsRUFBMkI7QUFDMUIsV0FBT0EsUUFBUSxDQUFDK0UsT0FBVCxDQUFpQjNCLFVBQWpCLEVBQTRCLEVBQTVCLEVBQWdDMkIsT0FBaEMsQ0FBd0MsUUFBeEMsRUFBaUQsRUFBakQsQ0FBUDtBQUNBOztBQUVELE1BQUk0RSxhQUFhLEdBQUcsQ0FBcEI7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNENBLFdBQVNDLFlBQVQsQ0FBc0I3SixFQUF0QixFQUEwQjtBQUN6QixRQUFJLENBQUNBLEVBQUUsQ0FBQzhKLFdBQVIsRUFBcUI7QUFBRTtBQUN0QjlKLFFBQUUsQ0FBQzhKLFdBQUgsR0FBaUIsRUFBRUYsYUFBbkI7QUFDQTVKLFFBQUUsQ0FBQytKLFNBQUgsQ0FBYUMsR0FBYixDQUFpQixXQUFXaEssRUFBRSxDQUFDOEosV0FBL0I7QUFDQTs7QUFDRCxRQUFJekssS0FBSyxHQUFHcUosZ0JBQWdCLENBQUMxSSxFQUFELENBQTVCO0FBQ0EsUUFBSXdELEdBQUcsR0FBRyxFQUFWOztBQUNBLFNBQUssSUFBSXJCLElBQVQsSUFBaUJuQyxFQUFFLENBQUNrSSxhQUFwQixFQUFtQztBQUNsQyxVQUFJMUMsU0FBUyxHQUFHbkcsS0FBSyxDQUFDLGFBQWE4QyxJQUFkLENBQXJCO0FBQ0EsVUFBSThILFlBQVksR0FBR3pFLFNBQVMsSUFBSW5HLEtBQUssQ0FBQyxZQUFZOEMsSUFBYixDQUFyQztBQUNBLFVBQUksQ0FBQzhILFlBQUwsRUFBbUIsU0FIZSxDQUdMOztBQUM3QixVQUFJQyxPQUFPLEdBQUcsRUFBZDtBQUNBLFVBQUl4RSxLQUFLLEdBQUcrQywwQkFBMEIsQ0FBQ3BKLEtBQUQsRUFBUTRLLFlBQVIsRUFBc0JDLE9BQXRCLENBQXRDLENBTGtDLENBTWxDOztBQUNBLFVBQUkxRSxTQUFKLEVBQWVFLEtBQUssSUFBSSxhQUFUOztBQUNmLFdBQUssSUFBSWhGLENBQUMsR0FBQyxDQUFOLEVBQVN5SixJQUFkLEVBQW9CQSxJQUFJLEdBQUNuSyxFQUFFLENBQUNrSSxhQUFILENBQWlCL0YsSUFBakIsRUFBdUJ6QixDQUFDLEVBQXhCLENBQXpCLEdBQXVEO0FBQ3REO0FBQ0EsWUFBSXlKLElBQUksQ0FBQ2xLLFFBQUwsS0FBa0IsWUFBdEIsRUFBb0M7QUFDbkNELFlBQUUsQ0FBQ1gsS0FBSCxDQUFTOEMsSUFBVCxJQUFpQnVELEtBQWpCO0FBQ0EsU0FGRCxNQUVPO0FBRU47QUFDQSxjQUFJLENBQUNGLFNBQUQsSUFBYzBFLE9BQU8sQ0FBQ0UsU0FBUixLQUFzQixLQUF4QyxFQUErQyxTQUh6QyxDQUdtRDtBQUV6RDs7QUFDQSxjQUFJbkssUUFBUSxHQUFHa0ssSUFBSSxDQUFDbEssUUFBcEI7QUFDQXVELGFBQUcsSUFBSXZELFFBQVEsR0FBRyxTQUFYLEdBQXVCRCxFQUFFLENBQUM4SixXQUExQixHQUF3Q0ssSUFBSSxDQUFDL0IsTUFBN0MsR0FBc0QsR0FBdEQsR0FBNERqRyxJQUE1RCxHQUFtRSxHQUFuRSxHQUF5RXVELEtBQXpFLEdBQWlGLEtBQXhGO0FBQ0E7QUFDRDtBQUNEOztBQUNEMkUsaUJBQWEsQ0FBQ3JLLEVBQUQsRUFBS3dELEdBQUwsQ0FBYjtBQUNBOztBQUNELFdBQVM2RyxhQUFULENBQXVCckssRUFBdkIsRUFBMkJ3RCxHQUEzQixFQUErQjtBQUM5QixRQUFJLENBQUN4RCxFQUFFLENBQUNzSyxZQUFKLElBQW9COUcsR0FBeEIsRUFBNkI7QUFDNUIsVUFBTStHLE9BQU8sR0FBR3BMLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QixPQUF2QixDQUFoQjtBQUNBbUwsYUFBTyxDQUFDbkcsaUJBQVIsR0FBNEIsQ0FBNUIsQ0FGNEIsQ0FHNUI7O0FBQ0FqRixjQUFRLENBQUNxTCxJQUFULENBQWNDLFdBQWQsQ0FBMEJGLE9BQTFCO0FBQ0F2SyxRQUFFLENBQUNzSyxZQUFILEdBQWtCQyxPQUFsQjtBQUNBOztBQUNELFFBQUl2SyxFQUFFLENBQUNzSyxZQUFQLEVBQXFCO0FBQ3BCdEssUUFBRSxDQUFDc0ssWUFBSCxDQUFnQmpHLFNBQWhCLEdBQTRCYixHQUE1QjtBQUNBO0FBQ0Q7QUFDRDs7O0FBRUEsV0FBU2tFLFFBQVQsQ0FBa0J0RyxNQUFsQixFQUEwQjtBQUN6QixRQUFJLENBQUNBLE1BQUwsRUFBYTtBQUNiLFFBQUlYLEdBQUcsR0FBR1csTUFBTSxDQUFDbEIsZ0JBQVAsQ0FBd0IsZUFBeEIsQ0FBVjtBQUNBLFFBQUlrQixNQUFNLENBQUNzSixZQUFQLElBQXVCdEosTUFBTSxDQUFDc0osWUFBUCxDQUFvQixhQUFwQixDQUEzQixFQUErRDFDLFdBQVcsQ0FBQzVHLE1BQUQsQ0FBWCxDQUh0QyxDQUcyRDs7QUFDcEYsU0FBSyxJQUFJVixDQUFDLEdBQUcsQ0FBUixFQUFXVixFQUFoQixFQUFvQkEsRUFBRSxHQUFHUyxHQUFHLENBQUNDLENBQUMsRUFBRixDQUE1QixHQUFvQztBQUNuQ3NILGlCQUFXLENBQUNoSSxFQUFELENBQVgsQ0FEbUMsQ0FDbEI7QUFDakI7QUFDRCxHQXBkVyxDQXFkWjs7O0FBQ0EsTUFBSTJLLFNBQVMsR0FBRyxJQUFJQyxHQUFKLEVBQWhCO0FBQ0EsTUFBSUMsVUFBVSxHQUFHLEtBQWpCO0FBQ0EsTUFBSUMsT0FBTyxHQUFHLEtBQWQ7O0FBQ0EsV0FBUzlDLFdBQVQsQ0FBcUJoSSxFQUFyQixFQUF3QjtBQUN2QjJLLGFBQVMsQ0FBQ1gsR0FBVixDQUFjaEssRUFBZDtBQUNBLFFBQUk2SyxVQUFKLEVBQWdCO0FBQ2hCQSxjQUFVLEdBQUcsSUFBYjtBQUNBRSx5QkFBcUIsQ0FBQyxZQUFVO0FBQ2hDO0FBQ0NGLGdCQUFVLEdBQUcsS0FBYjtBQUNBQyxhQUFPLEdBQUcsSUFBVjtBQUNBSCxlQUFTLENBQUNLLE9BQVYsQ0FBa0JuQixZQUFsQjtBQUNBYyxlQUFTLENBQUNNLEtBQVY7QUFDQTNCLGdCQUFVLENBQUMsWUFBVTtBQUFFO0FBQ3RCd0IsZUFBTyxHQUFHLEtBQVY7QUFDQSxPQUZTLENBQVY7QUFHQSxLQVRvQixDQUFyQjtBQVVBOztBQUdELFdBQVMxQixhQUFULENBQXVCakosQ0FBdkIsRUFBMEI7QUFDekJ1SCxZQUFRLENBQUN2SCxDQUFDLENBQUNpQixNQUFILENBQVI7QUFDQTs7QUFFRCxXQUFTOEosUUFBVCxDQUFrQkMsR0FBbEIsRUFBdUJDLEVBQXZCLEVBQTBCO0FBQUU7QUFDM0IsUUFBSUMsS0FBSyxHQUFDLENBQVY7QUFBQSxRQUFhQyxXQUFXLEdBQUMsSUFBekI7QUFBQSxRQUErQkMsU0FBUyxHQUFDLENBQXpDO0FBQUEsUUFBNENDLE1BQU0sR0FBRyxFQUFyRDtBQUFBLFFBQXlEOUssQ0FBQyxHQUFDLENBQTNEO0FBQUEsUUFBOEQrSyxLQUE5RDtBQUFBLFFBQW9FQyxVQUFwRTs7QUFDQSxXQUFPRCxLQUFJLEdBQUNOLEdBQUcsQ0FBQ3pLLENBQUMsRUFBRixDQUFmLEVBQXNCO0FBQ3JCLFVBQUkrSyxLQUFJLEtBQUssR0FBYixFQUFrQjtBQUNqQixVQUFFSixLQUFGOztBQUNBLFlBQUlDLFdBQVcsS0FBSyxJQUFoQixJQUF3QkgsR0FBRyxDQUFDekssQ0FBQyxHQUFDLENBQUgsQ0FBSCxHQUFTeUssR0FBRyxDQUFDekssQ0FBQyxHQUFDLENBQUgsQ0FBWixHQUFrQnlLLEdBQUcsQ0FBQ3pLLENBQUMsR0FBQyxDQUFILENBQXJCLEtBQStCLEtBQTNELEVBQWtFO0FBQ2pFNEsscUJBQVcsR0FBR0QsS0FBZDtBQUNBRyxnQkFBTSxJQUFJTCxHQUFHLENBQUNRLFNBQUosQ0FBY0osU0FBZCxFQUF5QjdLLENBQUMsR0FBQyxDQUEzQixDQUFWO0FBQ0E2SyxtQkFBUyxHQUFHN0ssQ0FBWjtBQUNBOztBQUNELFlBQUl5SyxHQUFHLENBQUN6SyxDQUFDLEdBQUMsQ0FBSCxDQUFILEdBQVN5SyxHQUFHLENBQUN6SyxDQUFDLEdBQUMsQ0FBSCxDQUFaLEdBQWtCeUssR0FBRyxDQUFDekssQ0FBQyxHQUFDLENBQUgsQ0FBckIsR0FBMkJ5SyxHQUFHLENBQUN6SyxDQUFDLEdBQUMsQ0FBSCxDQUE5QixLQUF3QyxNQUE1QyxFQUFvRDtBQUNuRGdMLG9CQUFVLEdBQUdMLEtBQWI7QUFDQTtBQUNEOztBQUNELFVBQUlJLEtBQUksS0FBSyxHQUFULElBQWdCSCxXQUFXLEtBQUtELEtBQXBDLEVBQTJDO0FBQzFDLFlBQUlPLFFBQVEsR0FBR1QsR0FBRyxDQUFDUSxTQUFKLENBQWNKLFNBQWQsRUFBeUI3SyxDQUFDLEdBQUMsQ0FBM0IsRUFBOEJ5RSxJQUE5QixFQUFmO0FBQUEsWUFBcUQwRyxRQUFRLFNBQTdEO0FBQ0EsWUFBSXJGLENBQUMsR0FBR29GLFFBQVEsQ0FBQ0UsT0FBVCxDQUFpQixHQUFqQixDQUFSOztBQUNBLFlBQUl0RixDQUFDLEtBQUcsQ0FBQyxDQUFULEVBQVk7QUFDWHFGLGtCQUFRLEdBQUdELFFBQVEsQ0FBQ3RGLEtBQVQsQ0FBZUUsQ0FBQyxHQUFDLENBQWpCLENBQVg7QUFDQW9GLGtCQUFRLEdBQUdBLFFBQVEsQ0FBQ3RGLEtBQVQsQ0FBZSxDQUFmLEVBQWlCRSxDQUFqQixDQUFYO0FBQ0E7O0FBQ0RnRixjQUFNLElBQUlKLEVBQUUsQ0FBQ1EsUUFBRCxFQUFXQyxRQUFYLEVBQXFCSCxVQUFyQixDQUFaO0FBQ0FILGlCQUFTLEdBQUc3SyxDQUFaO0FBQ0E0SyxtQkFBVyxHQUFHLElBQWQ7QUFDQTs7QUFDRCxVQUFJRyxLQUFJLEtBQUssR0FBYixFQUFrQjtBQUNqQixVQUFFSixLQUFGO0FBQ0EsWUFBSUssVUFBVSxLQUFLTCxLQUFuQixFQUEwQkssVUFBVSxHQUFHLElBQWI7QUFDMUI7QUFDRDs7QUFDREYsVUFBTSxJQUFJTCxHQUFHLENBQUNRLFNBQUosQ0FBY0osU0FBZCxDQUFWO0FBQ0EsV0FBT0MsTUFBUDtBQUNBOztBQUNELFdBQVMvQywwQkFBVCxDQUFvQ3BKLEtBQXBDLEVBQTJDME0sYUFBM0MsRUFBMEQ3QixPQUExRCxFQUFrRTtBQUNqRSxXQUFPZ0IsUUFBUSxDQUFDYSxhQUFELEVBQWdCLFVBQVNILFFBQVQsRUFBbUJDLFFBQW5CLEVBQTZCSCxVQUE3QixFQUF3QztBQUN0RSxVQUFJaEcsS0FBSyxHQUFHckcsS0FBSyxDQUFDRSxnQkFBTixDQUF1QnFNLFFBQXZCLENBQVo7QUFDQSxVQUFJRixVQUFKLEVBQWdCaEcsS0FBSyxHQUFHQSxLQUFLLENBQUNWLE9BQU4sQ0FBYyxTQUFkLEVBQXlCLEdBQXpCLENBQVIsQ0FGc0QsQ0FFZjs7QUFDdkQsVUFBSWtGLE9BQU8sSUFBSTdLLEtBQUssQ0FBQzJNLG9CQUFOLEtBQStCN00sUUFBUSxDQUFDd0ksZUFBdkQsRUFBd0V1QyxPQUFPLENBQUNFLFNBQVIsR0FBb0IsS0FBcEI7QUFDeEUsVUFBSTFFLEtBQUssS0FBRyxFQUFSLElBQWNtRyxRQUFsQixFQUE0Qm5HLEtBQUssR0FBRytDLDBCQUEwQixDQUFDcEosS0FBRCxFQUFRd00sUUFBUixFQUFrQjNCLE9BQWxCLENBQWxDO0FBQzVCLGFBQU94RSxLQUFQO0FBQ0EsS0FOYyxDQUFmO0FBT0EsR0F2aEJXLENBeWhCWjs7O0FBQ0EsTUFBSXVHLFFBQVEsR0FBRyxJQUFJbkwsZ0JBQUosQ0FBcUIsVUFBU2EsU0FBVCxFQUFvQjtBQUN2RCxRQUFJbUosT0FBSixFQUFhOztBQUNiLFNBQUssSUFBSXBLLENBQUMsR0FBQyxDQUFOLEVBQVNtQixRQUFkLEVBQXdCQSxRQUFRLEdBQUNGLFNBQVMsQ0FBQ2pCLENBQUMsRUFBRixDQUExQyxHQUFrRDtBQUNqRCxVQUFJbUIsUUFBUSxDQUFDcUssYUFBVCxLQUEyQixhQUEvQixFQUE4QyxTQURHLENBQ087QUFDeEQ7O0FBQ0F4RSxjQUFRLENBQUM3RixRQUFRLENBQUNULE1BQVYsQ0FBUjtBQUNBO0FBQ0QsR0FQYyxDQUFmO0FBUUFrSSxZQUFVLENBQUMsWUFBVTtBQUNwQjJDLFlBQVEsQ0FBQ2pMLE9BQVQsQ0FBaUI3QixRQUFqQixFQUEwQjtBQUFDZ04sZ0JBQVUsRUFBRSxJQUFiO0FBQW1CakwsYUFBTyxFQUFFO0FBQTVCLEtBQTFCO0FBQ0EsR0FGUyxDQUFWLENBbGlCWSxDQXNpQlo7O0FBQ0EsTUFBSWtMLE9BQU8sR0FBR0MsUUFBUSxDQUFDQyxJQUF2QjtBQUNBckssa0JBQWdCLENBQUMsWUFBRCxFQUFjLFVBQVM5QixDQUFULEVBQVc7QUFDeEMsUUFBSW9NLEtBQUssR0FBR3BOLFFBQVEsQ0FBQ3FOLGNBQVQsQ0FBd0JILFFBQVEsQ0FBQ0MsSUFBVCxDQUFjL0gsTUFBZCxDQUFxQixDQUFyQixDQUF4QixDQUFaOztBQUNBLFFBQUlnSSxLQUFKLEVBQVc7QUFDVixVQUFJRSxLQUFLLEdBQUd0TixRQUFRLENBQUNxTixjQUFULENBQXdCSixPQUFPLENBQUM3SCxNQUFSLENBQWUsQ0FBZixDQUF4QixDQUFaO0FBQ0FtRCxjQUFRLENBQUM2RSxLQUFELENBQVI7QUFDQTdFLGNBQVEsQ0FBQytFLEtBQUQsQ0FBUjtBQUNBLEtBSkQsTUFJTztBQUNOL0UsY0FBUSxDQUFDdkksUUFBRCxDQUFSO0FBQ0E7O0FBQ0RpTixXQUFPLEdBQUdDLFFBQVEsQ0FBQ0MsSUFBbkI7QUFDQSxHQVZlLENBQWhCLENBeGlCWSxDQW9qQlo7O0FBQ0EsTUFBSUksVUFBVSxHQUFHbkssTUFBTSxDQUFDQyx3QkFBUCxDQUFnQ0UsV0FBVyxDQUFDaEQsU0FBNUMsRUFBdUQsT0FBdkQsQ0FBakI7QUFDQSxNQUFJaU4sV0FBVyxHQUFHRCxVQUFVLENBQUM5SixHQUE3Qjs7QUFDQThKLFlBQVUsQ0FBQzlKLEdBQVgsR0FBaUIsWUFBWTtBQUM1QixRQUFNdkQsS0FBSyxHQUFHc04sV0FBVyxDQUFDL0wsSUFBWixDQUFpQixJQUFqQixDQUFkO0FBQ0F2QixTQUFLLENBQUNtSixhQUFOLEdBQXNCLElBQXRCO0FBQ0EsV0FBT25KLEtBQVA7QUFDQSxHQUpEOztBQUtBa0QsUUFBTSxDQUFDRSxjQUFQLENBQXNCQyxXQUFXLENBQUNoRCxTQUFsQyxFQUE2QyxPQUE3QyxFQUFzRGdOLFVBQXRELEVBNWpCWSxDQThqQlo7O0FBQ0EsTUFBSUUsbUJBQW1CLEdBQUdsRSxnQkFBMUI7O0FBQ0F6SixRQUFNLENBQUN5SixnQkFBUCxHQUEwQixVQUFVMUksRUFBVixFQUFjO0FBQ3ZDLFFBQUlYLEtBQUssR0FBR3VOLG1CQUFtQixDQUFDckwsS0FBcEIsQ0FBMEIsSUFBMUIsRUFBZ0NzTCxTQUFoQyxDQUFaO0FBQ0F4TixTQUFLLENBQUN5TixXQUFOLEdBQW9COU0sRUFBcEIsQ0FGdUMsQ0FHdkM7O0FBQ0EsV0FBT1gsS0FBUDtBQUNBLEdBTEQsQ0Foa0JZLENBdWtCWjs7O0FBQ0EsTUFBTTBOLFVBQVUsR0FBR0MsbUJBQW1CLENBQUN0TixTQUF2QztBQUVBLE1BQU11TixPQUFPLEdBQUdGLFVBQVUsQ0FBQ3hOLGdCQUEzQjs7QUFDQXdOLFlBQVUsQ0FBQ3hOLGdCQUFYLEdBQThCLFVBQVUyTixRQUFWLEVBQW9CO0FBQ2pELFNBQUtsQixvQkFBTCxHQUE0QixLQUE1QjtBQUNBa0IsWUFBUSxHQUFHQSxRQUFRLENBQUMvSCxJQUFULEVBQVg7QUFFQTs7Ozs7Ozs7Ozs7O0FBWUEsUUFBSStILFFBQVEsQ0FBQyxDQUFELENBQVIsS0FBZ0IsR0FBaEIsSUFBdUJBLFFBQVEsQ0FBQyxDQUFELENBQVIsS0FBZ0IsR0FBM0MsRUFBZ0QsT0FBT0QsT0FBTyxDQUFDMUwsS0FBUixDQUFjLElBQWQsRUFBb0JzTCxTQUFwQixDQUFQO0FBQ2hELFFBQU1NLFFBQVEsR0FBR0QsUUFBUSxDQUFDM0ksTUFBVCxDQUFnQixDQUFoQixDQUFqQjtBQUNBLFFBQU02SSxVQUFVLEdBQUcsU0FBT0QsUUFBMUI7QUFDQSxRQUFNRSxtQkFBbUIsR0FBRyxVQUFRRixRQUFwQztBQUNBLFFBQUl6SCxLQUFLLEdBQUdNLFdBQVcsQ0FBQyxLQUFLcUgsbUJBQUwsS0FBNkIsS0FBS0QsVUFBTCxDQUE5QixDQUF2Qjs7QUFFQSxRQUFJLEtBQUtOLFdBQVQsRUFBc0I7QUFBRTtBQUN2QixVQUFJcEgsS0FBSyxLQUFLTyxTQUFWLElBQXVCLENBQUNxSCxrQkFBa0IsQ0FBQzVILEtBQUQsQ0FBOUMsRUFBdUQ7QUFDdEQ7QUFDQ0EsYUFBSyxHQUFHK0MsMEJBQTBCLENBQUMsSUFBRCxFQUFPL0MsS0FBUCxDQUFsQztBQUNELGFBQUtzRyxvQkFBTCxHQUE0QixLQUFLYyxXQUFqQztBQUNBLE9BSkQsTUFJTztBQUFFO0FBQ1IsWUFBSVEsa0JBQWtCLENBQUM1SCxLQUFELENBQWxCLElBQTZCLENBQUM2SCxRQUFRLENBQUNMLFFBQUQsQ0FBdEMsSUFBb0RLLFFBQVEsQ0FBQ0wsUUFBRCxDQUFSLENBQW1CTSxRQUEzRSxFQUFxRjtBQUNwRjtBQUNBLGNBQUl4TixFQUFFLEdBQUcsS0FBSzhNLFdBQUwsQ0FBaUIvSSxVQUExQjs7QUFDQSxpQkFBTy9ELEVBQUUsQ0FBQ2dDLFFBQUgsS0FBZ0IsQ0FBdkIsRUFBMEI7QUFDekI7QUFDQSxnQkFBSWhDLEVBQUUsQ0FBQ3NJLFlBQUgsSUFBbUJ0SSxFQUFFLENBQUNzSSxZQUFILENBQWdCNEUsUUFBaEIsQ0FBdkIsRUFBa0Q7QUFDakQ7QUFDQTtBQUNBO0FBQ0Esa0JBQUk3TixLQUFLLEdBQUdxSixnQkFBZ0IsQ0FBQzFJLEVBQUQsQ0FBNUI7QUFDQSxrQkFBSXlOLE1BQU0sR0FBR3pILFdBQVcsQ0FBQzNHLEtBQUssQ0FBQ2dPLG1CQUFELENBQUwsSUFBOEJoTyxLQUFLLENBQUMrTixVQUFELENBQXBDLENBQXhCOztBQUNBLGtCQUFJSyxNQUFNLEtBQUt4SCxTQUFmLEVBQTBCO0FBQ3pCO0FBQ0E7QUFDQ1AscUJBQUssR0FBRytDLDBCQUEwQixDQUFDLElBQUQsRUFBT2dGLE1BQVAsQ0FBbEM7QUFDRCxxQkFBS3pCLG9CQUFMLEdBQTRCaE0sRUFBNUI7QUFDQTtBQUNBO0FBQ0Q7O0FBQ0RBLGNBQUUsR0FBR0EsRUFBRSxDQUFDK0QsVUFBUjtBQUNBO0FBQ0Q7QUFDRDs7QUFDRCxVQUFJMkIsS0FBSyxLQUFHLFNBQVosRUFBdUIsT0FBTyxFQUFQO0FBQ3ZCLEtBcERnRCxDQXFEakQ7OztBQUNBLFFBQUlBLEtBQUssS0FBS08sU0FBVixJQUF1QnNILFFBQVEsQ0FBQ0wsUUFBRCxDQUFuQyxFQUErQ3hILEtBQUssR0FBRzZILFFBQVEsQ0FBQ0wsUUFBRCxDQUFSLENBQW1CUSxZQUEzQjtBQUMvQyxRQUFJaEksS0FBSyxLQUFLTyxTQUFkLEVBQXlCLE9BQU8sRUFBUDtBQUN6QixXQUFPUCxLQUFQO0FBQ0EsR0F6REQ7O0FBMERBLE1BQU00SCxrQkFBa0IsR0FBRztBQUFDekgsV0FBTyxFQUFDLENBQVQ7QUFBV0MsVUFBTSxFQUFDLENBQWxCO0FBQW9CQyxTQUFLLEVBQUM7QUFBMUIsR0FBM0I7QUFFQSxNQUFNNEgsT0FBTyxHQUFHWixVQUFVLENBQUN6TixXQUEzQjs7QUFDQXlOLFlBQVUsQ0FBQ3pOLFdBQVgsR0FBeUIsVUFBVTROLFFBQVYsRUFBb0J4SCxLQUFwQixFQUEyQmtJLElBQTNCLEVBQWlDO0FBQ3pELFFBQUlWLFFBQVEsQ0FBQyxDQUFELENBQVIsS0FBZ0IsR0FBaEIsSUFBdUJBLFFBQVEsQ0FBQyxDQUFELENBQVIsS0FBZ0IsR0FBM0MsRUFBZ0QsT0FBT1MsT0FBTyxDQUFDcE0sS0FBUixDQUFjLElBQWQsRUFBb0JzTCxTQUFwQixDQUFQO0FBQ2hELFFBQU03TSxFQUFFLEdBQUcsS0FBS3dJLGFBQWhCOztBQUNBLFFBQUl4SSxFQUFKLEVBQVE7QUFDUCxVQUFJLENBQUNBLEVBQUUsQ0FBQ3NJLFlBQVIsRUFBc0J0SSxFQUFFLENBQUNzSSxZQUFILEdBQWtCLEVBQWxCO0FBQ3RCdEksUUFBRSxDQUFDc0ksWUFBSCxDQUFnQjRFLFFBQWhCLElBQTRCLENBQTVCO0FBQ0E7O0FBQ0RBLFlBQVEsR0FBRyxVQUFRVSxJQUFJLEtBQUcsV0FBUCxHQUFtQixHQUFuQixHQUF1QixFQUEvQixJQUFxQ1YsUUFBUSxDQUFDM0ksTUFBVCxDQUFnQixDQUFoQixDQUFoRDtBQUNBLFNBQUtDLE9BQUwsSUFBZ0IsT0FBTzBJLFFBQVAsR0FBa0IsR0FBbEIsR0FBd0J6SCxXQUFXLENBQUNDLEtBQUQsQ0FBbkMsR0FBNkMsR0FBN0QsQ0FSeUQsQ0FTekQ7O0FBQ0ExRixNQUFFLEtBQUtiLFFBQVEsQ0FBQ3dJLGVBQWhCLElBQW1DQyxpQkFBaUIsRUFBcEQ7QUFDQTVILE1BQUUsSUFBSTBILFFBQVEsQ0FBQzFILEVBQUQsQ0FBZCxDQVh5RCxDQVdyQztBQUNwQixHQVpEO0FBZUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsTUFBSSxDQUFDZixNQUFNLENBQUM0TyxHQUFaLEVBQWlCNU8sTUFBTSxDQUFDNE8sR0FBUCxHQUFhLEVBQWI7QUFDakIsTUFBTU4sUUFBUSxHQUFHLEVBQWpCOztBQUNBTSxLQUFHLENBQUNDLGdCQUFKLEdBQXVCLFVBQVNDLE9BQVQsRUFBaUI7QUFDdkNSLFlBQVEsQ0FBQ1EsT0FBTyxDQUFDQyxJQUFULENBQVIsR0FBeUJELE9BQXpCO0FBQ0EsR0FGRCxDQWxyQlksQ0FzckJaOztBQUNBOzs7Ozs7OztBQVNBOzs7QUFDQSxXQUFTekssUUFBVCxDQUFrQjJLLEdBQWxCLEVBQXVCNU4sUUFBdkIsRUFBaUM7QUFDaEMsUUFBSTZOLE9BQU8sR0FBRyxJQUFJQyxjQUFKLEVBQWQ7QUFDQUQsV0FBTyxDQUFDRSxJQUFSLENBQWEsS0FBYixFQUFvQkgsR0FBcEI7QUFDQUMsV0FBTyxDQUFDRyxnQkFBUixDQUF5QixVQUF6Qjs7QUFDQUgsV0FBTyxDQUFDSSxNQUFSLEdBQWlCLFlBQVk7QUFDNUIsVUFBSUosT0FBTyxDQUFDSyxNQUFSLElBQWtCLEdBQWxCLElBQXlCTCxPQUFPLENBQUNLLE1BQVIsR0FBaUIsR0FBOUMsRUFBbUQ7QUFDbERsTyxnQkFBUSxDQUFDNk4sT0FBTyxDQUFDTSxZQUFULENBQVI7QUFDQTtBQUNELEtBSkQ7O0FBS0FOLFdBQU8sQ0FBQ08sSUFBUjtBQUNBO0FBRUQsQ0E3c0JBLEVBQUQsQyIsImZpbGUiOiJpZUNTU1ZhcmlhYmxlc19oZWFkLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL0pvcmRhbktsYWVycy9cIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaWUxMUN1c3RvbVByb3BlcnRpZXMuanNcIik7XG4iLCIvKiEgaWUxMUN1c3RvbVByb3BlcnRpZXMuanMgdjMuMC42IHwgTUlUIExpY2Vuc2UgfCBodHRwczovL2dpdC5pby9malhNTiAqL1xyXG4hZnVuY3Rpb24gKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0d2luZG93Wydjc3NWYXJpYWJsZXMnXSA9IHt9O1xyXG5cdC8vIGNoZWNrIGZvciBzdXBwb3J0XHJcblx0dmFyIHRlc3RFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKTtcclxuXHR0ZXN0RWwuc3R5bGUuc2V0UHJvcGVydHkoJy0teCcsICd5Jyk7XHJcblx0aWYgKHRlc3RFbC5zdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCctLXgnKSA9PT0gJ3knIHx8ICF0ZXN0RWwubXNNYXRjaGVzU2VsZWN0b3IpIHJldHVybjtcclxuXHJcblx0aWYgKCFFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzKSBFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzID0gRWxlbWVudC5wcm90b3R5cGUubXNNYXRjaGVzU2VsZWN0b3I7XHJcblxyXG4gICAgdmFyIGxpc3RlbmVycyA9IFtdLFxyXG4gICAgICAgIHJvb3QgPSBkb2N1bWVudCxcclxuICAgICAgICBPYnNlcnZlcjtcclxuXHJcblx0ZnVuY3Rpb24gcXNhKGVsLCBzZWxlY3Rvcil7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRyZXR1cm4gZWwucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XHJcblx0XHR9IGNhdGNoKGUpIHtcclxuXHRcdFx0Ly8gY29uc29sZS53YXJuKCd0aGUgU2VsZWN0b3IgJytzZWxlY3RvcisnIGNhbiBub3QgYmUgcGFyc2VkJyk7XHJcblx0XHRcdHJldHVybiBbXTtcclxuXHRcdH1cclxuXHR9XHJcbiAgICBmdW5jdGlvbiBvbkVsZW1lbnQgKHNlbGVjdG9yLCBjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBsaXN0ZW5lciA9IHtcclxuICAgICAgICAgICAgc2VsZWN0b3I6IHNlbGVjdG9yLFxyXG4gICAgICAgICAgICBjYWxsYmFjazogY2FsbGJhY2ssXHJcbiAgICAgICAgICAgIGVsZW1lbnRzOiBuZXcgV2Vha01hcCgpLFxyXG4gICAgICAgIH07XHJcblx0XHR2YXIgZWxzID0gcXNhKHJvb3QsIGxpc3RlbmVyLnNlbGVjdG9yKSwgaT0wLCBlbDtcclxuXHRcdHdoaWxlIChlbCA9IGVsc1tpKytdKSB7XHJcbiAgICAgICAgICAgIGxpc3RlbmVyLmVsZW1lbnRzLnNldChlbCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGxpc3RlbmVyLmNhbGxiYWNrLmNhbGwoZWwsIGVsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xyXG4gICAgICAgIGlmICghT2JzZXJ2ZXIpIHtcclxuICAgICAgICAgICAgT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihjaGVja011dGF0aW9ucyk7XHJcbiAgICAgICAgICAgIE9ic2VydmVyLm9ic2VydmUocm9vdCwge1xyXG4gICAgICAgICAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc3VidHJlZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2hlY2tMaXN0ZW5lcihsaXN0ZW5lcik7XHJcbiAgICB9O1xyXG4gICAgZnVuY3Rpb24gY2hlY2tMaXN0ZW5lcihsaXN0ZW5lciwgdGFyZ2V0KSB7XHJcbiAgICAgICAgdmFyIGkgPSAwLCBlbCwgZWxzID0gW107XHJcblx0XHR0cnkge1xyXG5cdFx0XHR0YXJnZXQgJiYgdGFyZ2V0Lm1hdGNoZXMobGlzdGVuZXIuc2VsZWN0b3IpICYmIGVscy5wdXNoKHRhcmdldCk7XHJcblx0XHR9IGNhdGNoKGUpIHt9XHJcbiAgICAgICAgaWYgKGxvYWRlZCkgeyAvLyBvaz8gY2hlY2sgaW5zaWRlIG5vZGUgb24gaW5uZXJIVE1MIC0gb25seSB3aGVuIGxvYWRlZFxyXG4gICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShlbHMsIHFzYSh0YXJnZXQgfHwgcm9vdCwgbGlzdGVuZXIuc2VsZWN0b3IpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgd2hpbGUgKGVsID0gZWxzW2krK10pIHtcclxuICAgICAgICAgICAgaWYgKGxpc3RlbmVyLmVsZW1lbnRzLmhhcyhlbCkpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBsaXN0ZW5lci5lbGVtZW50cy5zZXQoZWwsdHJ1ZSk7XHJcbiAgICAgICAgICAgIGxpc3RlbmVyLmNhbGxiYWNrLmNhbGwoZWwsIGVsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBjaGVja0xpc3RlbmVycyhpbnNpZGUpIHtcclxuICAgICAgICB2YXIgaSA9IDAsIGxpc3RlbmVyO1xyXG4gICAgICAgIHdoaWxlIChsaXN0ZW5lciA9IGxpc3RlbmVyc1tpKytdKSBjaGVja0xpc3RlbmVyKGxpc3RlbmVyLCBpbnNpZGUpO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gY2hlY2tNdXRhdGlvbnMobXV0YXRpb25zKSB7XHJcblx0XHR2YXIgaiA9IDAsIGksIG11dGF0aW9uLCBub2RlcywgdGFyZ2V0O1xyXG4gICAgICAgIHdoaWxlIChtdXRhdGlvbiA9IG11dGF0aW9uc1tqKytdKSB7XHJcbiAgICAgICAgICAgIG5vZGVzID0gbXV0YXRpb24uYWRkZWROb2RlcywgaSA9IDA7XHJcbiAgICAgICAgICAgIHdoaWxlICh0YXJnZXQgPSBub2Rlc1tpKytdKSB0YXJnZXQubm9kZVR5cGUgPT09IDEgJiYgY2hlY2tMaXN0ZW5lcnModGFyZ2V0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGxvYWRlZCA9IGZhbHNlO1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBsb2FkZWQgPSB0cnVlO1xyXG4gICAgfSk7XHJcblxyXG5cdC8vIHN2ZyBwb2x5ZmlsbHNcclxuXHRmdW5jdGlvbiBjb3B5UHJvcGVydHkocHJvcCwgZnJvbSwgdG8pe1xyXG5cdFx0dmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGZyb20sIHByb3ApO1xyXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRvLCBwcm9wLCBkZXNjKTtcclxuXHR9XHJcblx0aWYgKCEoJ2NsYXNzTGlzdCcgaW4gRWxlbWVudC5wcm90b3R5cGUpKSB7XHJcblx0XHRjb3B5UHJvcGVydHkoJ2NsYXNzTGlzdCcsIEhUTUxFbGVtZW50LnByb3RvdHlwZSwgRWxlbWVudC5wcm90b3R5cGUpO1xyXG5cdH1cclxuXHRpZiAoISgnaW5uZXJIVE1MJyBpbiBFbGVtZW50LnByb3RvdHlwZSkpIHtcclxuXHRcdGNvcHlQcm9wZXJ0eSgnaW5uZXJIVE1MJywgSFRNTEVsZW1lbnQucHJvdG90eXBlLCBFbGVtZW50LnByb3RvdHlwZSk7XHJcblx0fVxyXG5cdGlmICghKCdzaGVldCcgaW4gU1ZHU3R5bGVFbGVtZW50LnByb3RvdHlwZSkpIHtcclxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTVkdTdHlsZUVsZW1lbnQucHJvdG90eXBlLCAnc2hlZXQnLCB7XHJcblx0XHRcdGdldDpmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciBhbGwgPSBkb2N1bWVudC5zdHlsZVNoZWV0cywgaT0wLCBzaGVldDtcclxuXHRcdFx0XHR3aGlsZSAoc2hlZXQ9YWxsW2krK10pIHtcclxuXHRcdFx0XHRcdGlmIChzaGVldC5vd25lck5vZGUgPT09IHRoaXMpIHJldHVybiBzaGVldDtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cclxuXHQvLyBtYWluIGxvZ2ljXHJcblxyXG5cdC8vIGNhY2hlZCByZWdleHBzLCBiZXR0ZXIgcGVyZm9ybWFuY2VcclxuXHRjb25zdCByZWdGaW5kU2V0dGVycyA9IC8oW1xcc3s7XSkoLS0oW0EtWmEtejAtOS1fXSopXFxzKjooW147IX17XSspKCFpbXBvcnRhbnQpPykoPz1cXHMqKFs7fV18JCkpL2c7XHJcblx0Y29uc3QgcmVnRmluZEdldHRlcnMgPSAvKFt7O11cXHMqKShbQS1aYS16MC05LV9dK1xccyo6W147fXtdKnZhclxcKFteITt9e10rKSghaW1wb3J0YW50KT8oPz1cXHMqKFs7fSRdfCQpKS9nO1xyXG5cdGNvbnN0IHJlZ1J1bGVJRUdldHRlcnMgPSAvLWllVmFyLShbXjpdKyk6L2dcclxuXHRjb25zdCByZWdSdWxlSUVTZXR0ZXJzID0gLy1pZS0oW159O10rKS9nXHJcblx0Ly9jb25zdCByZWdIYXNWYXIgPSAvdmFyXFwoLztcclxuXHRjb25zdCByZWdQc2V1ZG9zID0gLzooaG92ZXJ8YWN0aXZlfGZvY3VzfHRhcmdldHw6YmVmb3JlfDphZnRlcnw6Zmlyc3QtbGV0dGVyfDpmaXJzdC1saW5lKS87XHJcblxyXG5cdG9uRWxlbWVudCgnbGlua1tyZWw9XCJzdHlsZXNoZWV0XCJdJywgZnVuY3Rpb24gKGVsKSB7XHJcblx0XHRmZXRjaENzcyhlbC5ocmVmLCBmdW5jdGlvbiAoY3NzKSB7XHJcblx0XHRcdHZhciBuZXdDc3MgPSByZXdyaXRlQ3NzKGNzcyk7XHJcblx0XHRcdGlmIChjc3MgPT09IG5ld0NzcykgcmV0dXJuO1xyXG5cdFx0XHRuZXdDc3MgPSByZWxUb0FicyhlbC5ocmVmLCBuZXdDc3MpO1xyXG5cdFx0XHRlbC5kaXNhYmxlZCA9IHRydWU7XHJcblx0XHRcdHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XHJcblx0XHRcdGlmIChlbC5tZWRpYSkgc3R5bGUuc2V0QXR0cmlidXRlKCdtZWRpYScsIGVsLm1lZGlhKTtcclxuXHRcdFx0ZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoc3R5bGUsIGVsKTtcclxuXHRcdFx0YWN0aXZhdGVTdHlsZUVsZW1lbnQoc3R5bGUsIG5ld0Nzcyk7XHJcblx0XHR9KTtcclxuXHR9KTtcclxuXHJcblx0ZnVuY3Rpb24gZm91bmRTdHlsZShlbCl7XHJcblx0XHRpZiAoZWwuaWVDUF9wb2x5ZmlsbGVkKSByZXR1cm47XHJcblx0XHRpZiAoZWwuaWVDUF9lbGVtZW50U2hlZXQpIHJldHVybjtcclxuXHRcdHZhciBjc3MgPSBlbC5pbm5lckhUTUw7XHJcblx0XHR2YXIgbmV3Q3NzID0gcmV3cml0ZUNzcyhjc3MpO1xyXG5cdFx0aWYgKGNzcyA9PT0gbmV3Q3NzKSByZXR1cm47XHJcblx0XHRhY3RpdmF0ZVN0eWxlRWxlbWVudChlbCwgbmV3Q3NzKTtcclxuXHR9XHJcblx0b25FbGVtZW50KCdzdHlsZScsIGZvdW5kU3R5bGUpO1xyXG5cdC8vIGltbWVkaWF0ZSwgdG8gcGFzcyB3M2MtdGVzdHMsIGJ1ZCBpdHMgYSBiYWQgaWRlYVxyXG5cdC8vIGFkZEV2ZW50TGlzdGVuZXIoJ0RPTU5vZGVJbnNlcnRlZCcsZnVuY3Rpb24oZSl7IGUudGFyZ2V0LnRhZ05hbWUgPT09ICdTVFlMRScgJiYgZm91bmRTdHlsZShlLnRhcmdldCk7IH0pO1xyXG5cclxuXHJcblxyXG5cdG9uRWxlbWVudCgnW2llLXN0eWxlXScsIGZ1bmN0aW9uIChlbCkge1xyXG5cdFx0dmFyIG5ld0NzcyA9IHJld3JpdGVDc3MoJ3snK2VsLmdldEF0dHJpYnV0ZSgnaWUtc3R5bGUnKSkuc3Vic3RyKDEpO1xyXG5cdFx0ZWwuc3R5bGUuY3NzVGV4dCArPSAnOycrIG5ld0NzcztcclxuXHRcdHZhciBmb3VuZCA9IHBhcnNlUmV3cml0dGVuU3R5bGUoZWwuc3R5bGUpO1xyXG5cdFx0aWYgKGZvdW5kLmdldHRlcnMpIGFkZEdldHRlckVsZW1lbnQoZWwsIGZvdW5kLmdldHRlcnMsICclc3R5bGVBdHRyJyk7XHJcblx0XHRpZiAoZm91bmQuc2V0dGVycykgYWRkU2V0dGVyRWxlbWVudChlbCwgZm91bmQuc2V0dGVycyk7XHJcblx0fSk7XHJcblxyXG5cdGZ1bmN0aW9uIHJlbFRvQWJzKGJhc2UsIGNzcykge1xyXG5cdFx0cmV0dXJuIGNzcy5yZXBsYWNlKC91cmxcXCgoW14pXSspXFwpL2csIGZ1bmN0aW9uKCQwLCAkMSl7XHJcblx0XHRcdCQxID0gJDEudHJpbSgpLnJlcGxhY2UoLyheWydcIl18WydcIl0kKS9nLCcnKTtcclxuXHRcdFx0aWYgKCQxLm1hdGNoKC9eKFthLXpdKzp8XFwvKS8pKSByZXR1cm4gJDA7XHJcblx0XHRcdGJhc2UgPSBiYXNlLnJlcGxhY2UoL1xcPy4qLywnJyk7XHJcblx0XHRcdHJldHVybiAndXJsKCcrIGJhc2UgKyAnLi8uLi8nICsgJDEgKycpJztcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0Ly8gaWUgaGFzIGEgYnVnLCB3aGVyZSB1bmtub3duIHByb3BlcnRpZXMgYXQgcHNldWRvLXNlbGVjdG9ycyBhcmUgY29tcHV0ZWQgYXQgdGhlIGVsZW1lbnRcclxuXHQvLyAjZWw6OmFmdGVyIHsgLWNvbnRlbnQ6J3gnOyB9ID0+IGdldENvbXB1dGVkU3R5bGUoZWwpWyctY29udGVudCddID09ICd4J1xyXG5cdC8vIHNob3VsZCB3ZSBhZGQgc29tZXRoaW5nIGxpa2UgLWllVmFyLXBzZXVkb19hZnRlci1jb250ZW50Oid4Jz9cclxuXHRmdW5jdGlvbiByZXdyaXRlQ3NzKGNzcykge1xyXG5cclxuXHRcdC8qIHVuY29tbWVudCBpZiBzcGVjIGZpbmlzaGVkIGFuZCBuZWVkZWQgYnkgc29tZW9uZVxyXG5cdFx0Y3NzID0gY3NzLnJlcGxhY2UoL0Bwcm9wZXJ0eSAoW157XSspeyhbXn1dKyl9LywgZnVuY3Rpb24oJDAsIHByb3AsIGJvZHkpe1xyXG5cdFx0XHRwcm9wID0gcHJvcC50cmltKCk7XHJcblx0XHRcdGNvbnN0IGRlY2xhcmF0aW9uID0ge25hbWU6cHJvcH07XHJcblx0XHRcdGJvZHkuc3BsaXQoJzsnKS5mb3JFYWNoKGZ1bmN0aW9uKHBhaXIpe1xyXG5cdFx0XHRcdGNvbnN0IHggPSBwYWlyLnNwbGl0KCc6Jyk7XHJcblx0XHRcdFx0aWYgKHhbMV0pIGRlY2xhcmF0aW9uWyB4WzBdLnRyaW0oKSBdID0geFsxXTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdGRlY2xhcmF0aW9uWydpbmhlcml0cyddID0gZGVjbGFyYXRpb25bJ2luaGVyaXRzJ10udHJpbSgpPT09J3RydWUnID8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFx0XHRkZWNsYXJhdGlvblsnaW5pdGlhbFZhbHVlJ10gPSBkZWNsYXJhdGlvblsnaW5pdGlhbC12YWx1ZSddO1xyXG5cdFx0XHRDU1MucmVnaXN0ZXJQcm9wZXJ0eShkZWNsYXJhdGlvbilcclxuXHRcdFx0cmV0dXJuICcvKlxcbiBAcHJvcGVydHkgLi4uIHJlbW92ZWQgXFxuKicrJy8nO1xyXG5cdFx0fSk7XHJcblx0XHQqL1xyXG5cdFx0cmV0dXJuIGNzcy5yZXBsYWNlKHJlZ0ZpbmRTZXR0ZXJzLCBmdW5jdGlvbigkMCwgJDEsICQyLCAkMywgJDQsIGltcG9ydGFudCl7XHJcblx0XHRcdHJldHVybiAkMSsnLWllLScrKGltcG9ydGFudD8n4p2XJzonJykrJDMrJzonK2VuY29kZVZhbHVlKCQ0KTtcclxuXHRcdH0pLnJlcGxhY2UocmVnRmluZEdldHRlcnMsIGZ1bmN0aW9uKCQwLCAkMSwgJDIsIGltcG9ydGFudCl7XHJcblx0XHRcdHJldHVybiAkMSsnLWllVmFyLScrKGltcG9ydGFudD8n4p2XJzonJykrJDIrJzsgJyskMjsgLy8ga2VlcCB0aGUgb3JpZ2luYWwsIHNvIGNoYWluaW5nIHdvcmtzIFwiLS14OnZhcigtLXkpXCJcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRmdW5jdGlvbiBlbmNvZGVWYWx1ZSh2YWx1ZSl7XHJcblx0XHRyZXR1cm4gdmFsdWU7XHJcblx0XHRyZXR1cm4gdmFsdWUucmVwbGFjZSgvIC9nLCfikKMnKTtcclxuXHR9XHJcblx0Y29uc3Qga2V5d29yZHMgPSB7aW5pdGlhbDoxLGluaGVyaXQ6MSxyZXZlcnQ6MSx1bnNldDoxfTtcclxuXHRmdW5jdGlvbiBkZWNvZGVWYWx1ZSh2YWx1ZSl7XHJcblx0XHRyZXR1cm4gdmFsdWU7XHJcblx0XHRpZiAodmFsdWU9PT11bmRlZmluZWQpIHJldHVybjtcclxuXHRcdHZhbHVlID0gIHZhbHVlLnJlcGxhY2UoL+KQoy9nLCcgJyk7XHJcblx0XHRjb25zdCB0cmltbWVkID0gdmFsdWUudHJpbSgpO1xyXG5cdFx0aWYgKGtleXdvcmRzW3RyaW1tZWRdKSByZXR1cm4gdHJpbW1lZDtcclxuXHRcdHJldHVybiB2YWx1ZTtcclxuXHR9XHJcblxyXG5cdC8vIGJldGFcclxuXHRjb25zdCBzdHlsZXNfb2ZfZ2V0dGVyX3Byb3BlcnRpZXMgPSB7fTtcclxuXHJcblx0ZnVuY3Rpb24gcGFyc2VSZXdyaXR0ZW5TdHlsZShzdHlsZSkgeyAvLyBsZXNzIG1lbW9yeSB0aGVuIHBhcmFtZXRlciBjc3NUZXh0P1xyXG5cclxuXHRcdC8vIGJldGFcclxuXHRcdHN0eWxlWyd6LWluZGV4J107IC8vIGllMTEgY2FuIGFjY2VzcyB1bmtub3duIHByb3BlcnRpZXMgaW4gc3R5bGVzaGVldHMgb25seSBpZiBhY2Nlc3NlZCBhIGRhc2hlZCBrbm93biBwcm9wZXJ0eVxyXG5cclxuXHRcdGNvbnN0IGNzc1RleHQgPSBzdHlsZS5jc3NUZXh0O1xyXG5cdFx0dmFyIG1hdGNoZXNHZXR0ZXJzID0gY3NzVGV4dC5tYXRjaChyZWdSdWxlSUVHZXR0ZXJzKSwgaiwgbWF0Y2g7XHJcblx0XHRpZiAobWF0Y2hlc0dldHRlcnMpIHtcclxuXHRcdFx0dmFyIGdldHRlcnMgPSBbXTsgLy8gZWcuIFtib3JkZXIsY29sb3JdXHJcblx0XHRcdGZvciAoaiA9IDA7IG1hdGNoID0gbWF0Y2hlc0dldHRlcnNbaisrXTspIHtcclxuXHRcdFx0XHRsZXQgcHJvcE5hbWUgPSBtYXRjaC5zbGljZSg3LCAtMSk7XHJcblx0XHRcdFx0aWYgKHByb3BOYW1lWzBdID09PSAn4p2XJykgcHJvcE5hbWUgPSBwcm9wTmFtZS5zdWJzdHIoMSk7XHJcblx0XHRcdFx0Z2V0dGVycy5wdXNoKHByb3BOYW1lKTtcclxuXHJcblx0XHRcdFx0Ly8gYmV0YVxyXG5cdFx0XHRcdGlmICghc3R5bGVzX29mX2dldHRlcl9wcm9wZXJ0aWVzW3Byb3BOYW1lXSkgc3R5bGVzX29mX2dldHRlcl9wcm9wZXJ0aWVzW3Byb3BOYW1lXSA9IFtdO1xyXG5cdFx0XHRcdHN0eWxlc19vZl9nZXR0ZXJfcHJvcGVydGllc1twcm9wTmFtZV0ucHVzaChzdHlsZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHZhciBtYXRjaGVzU2V0dGVycyA9IGNzc1RleHQubWF0Y2gocmVnUnVsZUlFU2V0dGVycyk7XHJcblx0XHRpZiAobWF0Y2hlc1NldHRlcnMpIHtcclxuXHRcdFx0dmFyIHNldHRlcnMgPSB7fTsgLy8gZWcuIFstLWNvbG9yOiNmZmYsIC0tcGFkZGluZzoxMHB4XTtcclxuXHRcdFx0Zm9yIChqID0gMDsgbWF0Y2ggPSBtYXRjaGVzU2V0dGVyc1tqKytdOykge1xyXG5cdFx0XHRcdGxldCB4ID0gbWF0Y2guc3Vic3RyKDQpLnNwbGl0KCc6Jyk7XHJcblx0XHRcdFx0bGV0IHByb3BOYW1lID0geFswXTtcclxuXHRcdFx0XHRsZXQgcHJvcFZhbHVlID0geFsxXTtcclxuXHRcdFx0XHRpZiAocHJvcE5hbWVbMF0gPT09ICfinZcnKSBwcm9wTmFtZSA9IHByb3BOYW1lLnN1YnN0cigxKTtcclxuXHRcdFx0XHRzZXR0ZXJzW3Byb3BOYW1lXSA9IHByb3BWYWx1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHtnZXR0ZXJzOmdldHRlcnMsIHNldHRlcnM6c2V0dGVyc307XHJcblx0fVxyXG5cdGZ1bmN0aW9uIGFjdGl2YXRlU3R5bGVFbGVtZW50KHN0eWxlLCBjc3MpIHtcclxuXHRcdHN0eWxlLmlubmVySFRNTCA9IGNzcztcclxuXHRcdHN0eWxlLmllQ1BfcG9seWZpbGxlZCA9IHRydWU7XHJcblx0XHR2YXIgcnVsZXMgPSBzdHlsZS5zaGVldC5ydWxlcywgaT0wLCBydWxlOyAvLyBjc3NSdWxlcyA9IENTU1J1bGVMaXN0LCBydWxlcyA9IE1TQ1NTUnVsZUxpc3RcclxuXHRcdHdoaWxlIChydWxlID0gcnVsZXNbaSsrXSkge1xyXG5cdFx0XHRjb25zdCBmb3VuZCA9IHBhcnNlUmV3cml0dGVuU3R5bGUocnVsZS5zdHlsZSk7XHJcblx0XHRcdGlmIChmb3VuZC5nZXR0ZXJzKSB7XHJcblx0XHRcdFx0YWRkR2V0dGVyc1NlbGVjdG9yKHJ1bGUuc2VsZWN0b3JUZXh0LCBmb3VuZC5nZXR0ZXJzKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoZm91bmQuc2V0dGVycykge1xyXG5cdFx0XHRcdHdpbmRvdy5jc3NWYXJpYWJsZXNbcnVsZS5zZWxlY3RvclRleHRdID0gT2JqZWN0LmtleXMoZm91bmQuc2V0dGVycykucmVkdWNlKChhY2MsIGNzc1ZhcmlhYmxlKSA9PiB7XHJcblx0XHRcdFx0XHRpZiAoIWZvdW5kLnNldHRlcnNbY3NzVmFyaWFibGVdLmluY2x1ZGVzKFwidmFyKC0tXCIpKSBhY2NbKCctLScgKyBjc3NWYXJpYWJsZSkudHJpbSgpXSA9IGZvdW5kLnNldHRlcnNbY3NzVmFyaWFibGVdLnRyaW0oKTtcclxuXHRcdFx0XHRcdHJldHVybiBhY2M7XHJcblx0XHRcdFx0fSwge30pO1xyXG5cdFx0XHRcdGFkZFNldHRlcnNTZWxlY3RvcihydWxlLnNlbGVjdG9yVGV4dCwgZm91bmQuc2V0dGVycyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIG1lZGlhUXVlcmllczogcmVkcmF3IHRoZSBob2xlIGRvY3VtZW50XHJcblx0XHRcdC8vIGJldHRlciBhZGQgZXZlbnRzIGZvciBlYWNoIGVsZW1lbnQ/XHJcblx0XHRcdGNvbnN0IG1lZGlhID0gcnVsZS5wYXJlbnRSdWxlICYmIHJ1bGUucGFyZW50UnVsZS5tZWRpYSAmJiBydWxlLnBhcmVudFJ1bGUubWVkaWEubWVkaWFUZXh0O1xyXG5cdFx0XHRpZiAobWVkaWEgJiYgKGZvdW5kLmdldHRlcnMgfHwgZm91bmQuc2V0dGVycykpIHtcclxuXHRcdFx0XHRtYXRjaE1lZGlhKG1lZGlhKS5hZGRMaXN0ZW5lcihmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0ZHJhd1RyZWUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBiZXRhXHJcblx0XHRyZWRyYXdTdHlsZVNoZWV0cygpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBhZGRHZXR0ZXJzU2VsZWN0b3Ioc2VsZWN0b3IsIHByb3BlcnRpZXMpIHtcclxuXHRcdHNlbGVjdG9yQWRkUHNldWRvTGlzdGVuZXJzKHNlbGVjdG9yKTtcclxuXHRcdG9uRWxlbWVudCh1blBzZXVkbyhzZWxlY3RvciksIGZ1bmN0aW9uIChlbCkge1xyXG5cdFx0XHRhZGRHZXR0ZXJFbGVtZW50KGVsLCBwcm9wZXJ0aWVzLCBzZWxlY3Rvcik7XHJcblx0XHRcdGRyYXdFbGVtZW50KGVsKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRmdW5jdGlvbiBhZGRHZXR0ZXJFbGVtZW50KGVsLCBwcm9wZXJ0aWVzLCBzZWxlY3Rvcikge1xyXG5cdFx0dmFyIGk9MCwgcHJvcCwgajtcclxuXHRcdGNvbnN0IHNlbGVjdG9ycyA9IHNlbGVjdG9yLnNwbGl0KCcsJyk7IC8vIHNwbGl0IGdyb3VwZWQgc2VsZWN0b3JzXHJcblx0XHRlbC5zZXRBdHRyaWJ1dGUoJ2llY3AtbmVlZGVkJywgdHJ1ZSk7XHJcblx0XHRpZiAoIWVsLmllQ1BTZWxlY3RvcnMpIGVsLmllQ1BTZWxlY3RvcnMgPSB7fTtcclxuXHRcdHdoaWxlIChwcm9wID0gcHJvcGVydGllc1tpKytdKSB7XHJcblx0XHRcdGZvciAoaiA9IDA7IHNlbGVjdG9yID0gc2VsZWN0b3JzW2orK107KSB7XHJcblx0XHRcdFx0Y29uc3QgcGFydHMgPSBzZWxlY3Rvci50cmltKCkuc3BsaXQoJzo6Jyk7XHJcblx0XHRcdFx0aWYgKCFlbC5pZUNQU2VsZWN0b3JzW3Byb3BdKSBlbC5pZUNQU2VsZWN0b3JzW3Byb3BdID0gW107XHJcblx0XHRcdFx0ZWwuaWVDUFNlbGVjdG9yc1twcm9wXS5wdXNoKHtcclxuXHRcdFx0XHRcdHNlbGVjdG9yOiBwYXJ0c1swXSxcclxuXHRcdFx0XHRcdHBzZXVkbzogcGFydHNbMV0gPyAnOjonICsgcGFydHNbMV0gOiAnJ1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdGZ1bmN0aW9uIGFkZFNldHRlcnNTZWxlY3RvcihzZWxlY3RvciwgcHJvcFZhbHMpIHtcclxuXHRcdHNlbGVjdG9yQWRkUHNldWRvTGlzdGVuZXJzKHNlbGVjdG9yKTtcclxuXHRcdG9uRWxlbWVudCh1blBzZXVkbyhzZWxlY3RvciksIGZ1bmN0aW9uIChlbCkge1xyXG5cdFx0XHRhZGRTZXR0ZXJFbGVtZW50KGVsLCBwcm9wVmFscyk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0ZnVuY3Rpb24gYWRkU2V0dGVyRWxlbWVudChlbCwgcHJvcFZhbHMpIHtcclxuXHRcdGlmICghZWwuaWVDUF9zZXR0ZXJzKSBlbC5pZUNQX3NldHRlcnMgPSB7fTtcclxuXHRcdGZvciAodmFyIHByb3AgaW4gcHJvcFZhbHMpIHsgLy8gZWcuIHtmb286I2ZmZiwgYmFyOmJhen1cclxuXHRcdFx0ZWwuaWVDUF9zZXR0ZXJzWyctLScgKyBwcm9wXSA9IDE7XHJcblx0XHR9XHJcblx0XHRkcmF3VHJlZShlbCk7XHJcblx0fVxyXG5cclxuXHQvL2JldGFcclxuXHRmdW5jdGlvbiByZWRyYXdTdHlsZVNoZWV0cygpIHtcclxuXHRcdGZvciAodmFyIHByb3AgaW4gc3R5bGVzX29mX2dldHRlcl9wcm9wZXJ0aWVzKSB7XHJcblx0XHRcdGxldCBzdHlsZXMgPSBzdHlsZXNfb2ZfZ2V0dGVyX3Byb3BlcnRpZXNbcHJvcF07XHJcblx0XHRcdGZvciAodmFyIGk9MCwgc3R5bGU7IHN0eWxlPXN0eWxlc1tpKytdOykge1xyXG5cdFx0XHRcdGlmIChzdHlsZS5vd25pbmdFbGVtZW50KSBjb250aW51ZTtcclxuXHRcdFx0XHR2YXIgdmFsdWUgPSBzdHlsZVsnLWllVmFyLScrcHJvcF07XHJcblx0XHRcdFx0aWYgKCF2YWx1ZSkgY29udGludWU7XHJcblx0XHRcdFx0dmFsdWUgPSBzdHlsZUNvbXB1dGVWYWx1ZVdpZHRoVmFycyhnZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCksIHZhbHVlKTtcclxuXHRcdFx0XHRpZiAodmFsdWUgPT09ICcnKSBjb250aW51ZTtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0c3R5bGVbcHJvcF0gPSB2YWx1ZTtcclxuXHRcdFx0XHR9IGNhdGNoKGUpIHt9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHRjb25zdCBwc2V1ZG9zID0ge1xyXG5cdFx0aG92ZXI6e1xyXG5cdFx0XHRvbjonbW91c2VlbnRlcicsXHJcblx0XHRcdG9mZjonbW91c2VsZWF2ZSdcclxuXHRcdH0sXHJcblx0XHRmb2N1czp7XHJcblx0XHRcdG9uOidmb2N1c2luJyxcclxuXHRcdFx0b2ZmOidmb2N1c291dCdcclxuXHRcdH0sXHJcblx0XHRhY3RpdmU6e1xyXG5cdFx0XHRvbjonQ1NTQWN0aXZhdGUnLFxyXG5cdFx0XHRvZmY6J0NTU0RlYWN0aXZhdGUnXHJcblx0XHR9LFxyXG5cdH07XHJcblx0ZnVuY3Rpb24gc2VsZWN0b3JBZGRQc2V1ZG9MaXN0ZW5lcnMoc2VsZWN0b3Ipe1xyXG5cdFx0Ly8gaWUxMSBoYXMgdGhlIHN0cmFuZ2UgYmVoYXZvaXIsIHRoYXQgZ3JvdXBzIG9mIHNlbGVjdG9ycyBhcmUgaW5kaXZpZHVhbCBydWxlcywgYnV0IHN0YXJ0aW5nIHdpdGggdGhlIGZ1bGwgc2VsZWN0b3I6XHJcblx0XHQvLyB0ZCwgdGgsIGJ1dHRvbiB7IGNvbG9yOnJlZCB9IHJlc3VsdHMgaW4gdGhpcyBydWxlczpcclxuXHRcdC8vIFwidGQsIHRoLCBidXR0b25cIiB8IFwidGgsIHRoXCIgfCBcInRoXCJcclxuXHRcdHNlbGVjdG9yID0gc2VsZWN0b3Iuc3BsaXQoJywnKVswXTtcclxuXHRcdGZvciAodmFyIHBzZXVkbyBpbiBwc2V1ZG9zKSB7XHJcblx0XHRcdHZhciBwYXJ0cyA9IHNlbGVjdG9yLnNwbGl0KCc6Jytwc2V1ZG8pO1xyXG5cdFx0XHRpZiAocGFydHMubGVuZ3RoID4gMSkge1xyXG5cdFx0XHRcdHZhciBlbmRpbmcgPSBwYXJ0c1sxXS5tYXRjaCgvXlteXFxzXSovKTsgLy8gZW5kaW5nIGVsZW1lbnRwYXJ0IG9mIHNlbGVjdG9yICh1c2VkIGZvciBub3QoOmFjdGl2ZSkpXHJcblx0XHRcdFx0bGV0IHNlbCA9IHVuUHNldWRvKHBhcnRzWzBdK2VuZGluZyk7XHJcblx0XHRcdFx0Y29uc3QgbGlzdGVuZXJzID0gcHNldWRvc1twc2V1ZG9dO1xyXG5cdFx0XHRcdG9uRWxlbWVudChzZWwsIGZ1bmN0aW9uIChlbCkge1xyXG5cdFx0XHRcdFx0ZWwuYWRkRXZlbnRMaXN0ZW5lcihsaXN0ZW5lcnMub24sIGRyYXdUcmVlRXZlbnQpO1xyXG5cdFx0XHRcdFx0ZWwuYWRkRXZlbnRMaXN0ZW5lcihsaXN0ZW5lcnMub2ZmLCBkcmF3VHJlZUV2ZW50KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRsZXQgQ1NTQWN0aXZlID0gbnVsbDtcclxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLGZ1bmN0aW9uKGUpe1xyXG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0XHRpZiAoZS50YXJnZXQgPT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIHtcclxuXHRcdFx0XHR2YXIgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XHJcblx0XHRcdFx0ZXZ0LmluaXRFdmVudCgnQ1NTQWN0aXZhdGUnLCB0cnVlLCB0cnVlKTtcclxuXHRcdFx0XHRDU1NBY3RpdmUgPSBlLnRhcmdldDtcclxuXHRcdFx0XHRDU1NBY3RpdmUuZGlzcGF0Y2hFdmVudChldnQpO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdH0pO1xyXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLGZ1bmN0aW9uKCl7XHJcblx0XHRpZiAoQ1NTQWN0aXZlKSB7XHJcblx0XHRcdHZhciBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcclxuXHRcdFx0ZXZ0LmluaXRFdmVudCgnQ1NTRGVhY3RpdmF0ZScsIHRydWUsIHRydWUpO1xyXG5cdFx0XHRDU1NBY3RpdmUuZGlzcGF0Y2hFdmVudChldnQpO1xyXG5cdFx0XHRDU1NBY3RpdmUgPSBudWxsO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHRmdW5jdGlvbiB1blBzZXVkbyhzZWxlY3Rvcil7XHJcblx0XHRyZXR1cm4gc2VsZWN0b3IucmVwbGFjZShyZWdQc2V1ZG9zLCcnKS5yZXBsYWNlKCc6bm90KCknLCcnKTtcclxuXHR9XHJcblxyXG5cdHZhciB1bmlxdWVDb3VudGVyID0gMDtcclxuXHJcblx0Lyogb2xkICpcclxuXHRmdW5jdGlvbiBfZHJhd0VsZW1lbnQoZWwpIHtcclxuXHRcdGlmICghZWwuaWVDUF91bmlxdWUpIHsgLy8gdXNlIGVsLnVuaXF1ZU51bWJlcj8gYnV0IG5lZWRzIGNsYXNzIGZvciB0aGUgY3NzLXNlbGVjdG9yID0+IHRlc3QgcGVyZm9ybWFuY2VcclxuXHRcdFx0ZWwuaWVDUF91bmlxdWUgPSArK3VuaXF1ZUNvdW50ZXI7XHJcblx0XHRcdGVsLmNsYXNzTGlzdC5hZGQoJ2llY3AtdScgKyBlbC5pZUNQX3VuaXF1ZSk7XHJcblx0XHR9XHJcblx0XHR2YXIgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsKTtcclxuXHRcdGlmIChlbC5pZUNQX3NoZWV0KSB3aGlsZSAoZWwuaWVDUF9zaGVldC5ydWxlc1swXSkgZWwuaWVDUF9zaGVldC5kZWxldGVSdWxlKDApO1xyXG5cdFx0Zm9yICh2YXIgcHJvcCBpbiBlbC5pZUNQU2VsZWN0b3JzKSB7XHJcblx0XHRcdHZhciBpbXBvcnRhbnQgPSBzdHlsZVsnLWllVmFyLeKdlycgKyBwcm9wXTtcclxuXHRcdFx0bGV0IHZhbHVlV2l0aFZhciA9IGltcG9ydGFudCB8fCBzdHlsZVsnLWllVmFyLScgKyBwcm9wXTtcclxuXHRcdFx0aWYgKCF2YWx1ZVdpdGhWYXIpIGNvbnRpbnVlOyAvLyB0b2RvLCB3aGF0IGlmICcwJ1xyXG5cclxuXHRcdFx0dmFyIGRldGFpbHMgPSB7fTtcclxuXHRcdFx0dmFyIHZhbHVlID0gc3R5bGVDb21wdXRlVmFsdWVXaWR0aFZhcnMoc3R5bGUsIHZhbHVlV2l0aFZhciwgZGV0YWlscyk7XHJcblxyXG5cdFx0XHRpZiAoaW1wb3J0YW50KSB2YWx1ZSArPSAnICFpbXBvcnRhbnQnO1xyXG5cdFx0XHRmb3IgKHZhciBpPTAsIGl0ZW07IGl0ZW09ZWwuaWVDUFNlbGVjdG9yc1twcm9wXVtpKytdOykgeyAvLyB0b2RvOiBzcGxpdCBhbmQgdXNlIHJlcXVlc3RBbmltYXRpb25GcmFtZT9cclxuXHRcdFx0XHRpZiAoaXRlbS5zZWxlY3RvciA9PT0gJyVzdHlsZUF0dHInKSB7XHJcblx0XHRcdFx0XHRlbC5zdHlsZVtwcm9wXSA9IHZhbHVlO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdFx0Ly8gYmV0YVxyXG5cdFx0XHRcdFx0aWYgKCFpbXBvcnRhbnQgJiYgZGV0YWlscy5hbGxCeVJvb3QgIT09IGZhbHNlKSBjb250aW51ZTsgLy8gZG9udCBoYXZlIHRvIGRyYXcgcm9vdC1wcm9wZXJ0aWVzXHJcblxyXG5cdFx0XHRcdFx0Ly9sZXQgc2VsZWN0b3IgPSBpdGVtLnNlbGVjdG9yLnJlcGxhY2UoLz4/IFxcLlteIF0rLywgJyAnLCBpdGVtLnNlbGVjdG9yKTsgLy8gdG9kbzogdHJ5IHRvIGVxdWFsaXplIHNwZWNpZmljaXR5XHJcblx0XHRcdFx0XHRsZXQgc2VsZWN0b3IgPSBpdGVtLnNlbGVjdG9yO1xyXG5cdFx0XHRcdFx0ZWxlbWVudFN0eWxlU2hlZXQoZWwpLmluc2VydFJ1bGUoc2VsZWN0b3IgKyAnLmllY3AtdScgKyBlbC5pZUNQX3VuaXF1ZSArIGl0ZW0ucHNldWRvICsgJyB7JyArIHByb3AgKyAnOicgKyB2YWx1ZSArICd9JywgMCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdGZ1bmN0aW9uIGVsZW1lbnRTdHlsZVNoZWV0KGVsKXtcclxuXHRcdGlmICghZWwuaWVDUF9zaGVldCkge1xyXG5cdFx0XHRjb25zdCBzdHlsZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcclxuXHRcdFx0c3R5bGVFbC5pZUNQX2VsZW1lbnRTaGVldCA9IDE7XHJcblx0XHRcdC8vZWwuYXBwZW5kQ2hpbGQoc3R5bGVFbCk7IC8vIHllcyEgc2VsZi1jbG9zaW5nIHRhZ3MgY2FuIGhhdmUgc3R5bGUgYXMgY2hpbGRyZW4sIGJ1dCAtIGlmIGkgc2V0IGlubmVySFRNTCwgdGhlIHN0eWxlc2hlZXQgaXMgbG9zdFxyXG5cdFx0XHRkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlRWwpO1xyXG5cdFx0XHRlbC5pZUNQX3NoZWV0ID0gc3R5bGVFbC5zaGVldDtcclxuXHRcdH1cclxuXHRcdHJldHVybiBlbC5pZUNQX3NoZWV0O1xyXG5cdH1cclxuXHJcblx0LyogKi9cclxuXHRmdW5jdGlvbiBfZHJhd0VsZW1lbnQoZWwpIHtcclxuXHRcdGlmICghZWwuaWVDUF91bmlxdWUpIHsgLy8gdXNlIGVsLnVuaXF1ZU51bWJlcj8gYnV0IG5lZWRzIGNsYXNzIGZvciB0aGUgY3NzLXNlbGVjdG9yID0+IHRlc3QgcGVyZm9ybWFuY2VcclxuXHRcdFx0ZWwuaWVDUF91bmlxdWUgPSArK3VuaXF1ZUNvdW50ZXI7XHJcblx0XHRcdGVsLmNsYXNzTGlzdC5hZGQoJ2llY3AtdScgKyBlbC5pZUNQX3VuaXF1ZSk7XHJcblx0XHR9XHJcblx0XHR2YXIgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsKTtcclxuXHRcdGxldCBjc3MgPSAnJztcclxuXHRcdGZvciAodmFyIHByb3AgaW4gZWwuaWVDUFNlbGVjdG9ycykge1xyXG5cdFx0XHR2YXIgaW1wb3J0YW50ID0gc3R5bGVbJy1pZVZhci3inZcnICsgcHJvcF07XHJcblx0XHRcdGxldCB2YWx1ZVdpdGhWYXIgPSBpbXBvcnRhbnQgfHwgc3R5bGVbJy1pZVZhci0nICsgcHJvcF07XHJcblx0XHRcdGlmICghdmFsdWVXaXRoVmFyKSBjb250aW51ZTsgLy8gdG9kbywgd2hhdCBpZiAnMCdcclxuXHRcdFx0dmFyIGRldGFpbHMgPSB7fTtcclxuXHRcdFx0dmFyIHZhbHVlID0gc3R5bGVDb21wdXRlVmFsdWVXaWR0aFZhcnMoc3R5bGUsIHZhbHVlV2l0aFZhciwgZGV0YWlscyk7XHJcblx0XHRcdC8vaWYgKHZhbHVlPT09J2luaXRpYWwnKSB2YWx1ZSA9IGluaXRpYWxzW3Byb3BdO1xyXG5cdFx0XHRpZiAoaW1wb3J0YW50KSB2YWx1ZSArPSAnICFpbXBvcnRhbnQnO1xyXG5cdFx0XHRmb3IgKHZhciBpPTAsIGl0ZW07IGl0ZW09ZWwuaWVDUFNlbGVjdG9yc1twcm9wXVtpKytdOykge1xyXG5cdFx0XHRcdC8vIHRvZG86IHNwbGl0IGFuZCB1c2UgcmVxdWVzdEFuaW1hdGlvbkZyYW1lP1xyXG5cdFx0XHRcdGlmIChpdGVtLnNlbGVjdG9yID09PSAnJXN0eWxlQXR0cicpIHtcclxuXHRcdFx0XHRcdGVsLnN0eWxlW3Byb3BdID0gdmFsdWU7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdFx0XHQvLyBiZXRhXHJcblx0XHRcdFx0XHRpZiAoIWltcG9ydGFudCAmJiBkZXRhaWxzLmFsbEJ5Um9vdCAhPT0gZmFsc2UpIGNvbnRpbnVlOyAvLyBkb250IGhhdmUgdG8gZHJhdyByb290LXByb3BlcnRpZXNcclxuXHJcblx0XHRcdFx0XHQvL2xldCBzZWxlY3RvciA9IGl0ZW0uc2VsZWN0b3IucmVwbGFjZSgvPj8gXFwuW14gXSsvLCAnICcsIGl0ZW0uc2VsZWN0b3IpOyAvLyB0b2RvOiB0cnkgdG8gZXF1YWxpemUgc3BlY2lmaWNpdHlcclxuXHRcdFx0XHRcdGxldCBzZWxlY3RvciA9IGl0ZW0uc2VsZWN0b3I7XHJcblx0XHRcdFx0XHRjc3MgKz0gc2VsZWN0b3IgKyAnLmllY3AtdScgKyBlbC5pZUNQX3VuaXF1ZSArIGl0ZW0ucHNldWRvICsgJ3snICsgcHJvcCArICc6JyArIHZhbHVlICsgJ31cXG4nO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxlbWVudFNldENzcyhlbCwgY3NzKTtcclxuXHR9XHJcblx0ZnVuY3Rpb24gZWxlbWVudFNldENzcyhlbCwgY3NzKXtcclxuXHRcdGlmICghZWwuaWVDUF9zdHlsZUVsICYmIGNzcykge1xyXG5cdFx0XHRjb25zdCBzdHlsZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcclxuXHRcdFx0c3R5bGVFbC5pZUNQX2VsZW1lbnRTaGVldCA9IDE7XHJcblx0XHRcdC8vZWwuYXBwZW5kQ2hpbGQoc3R5bGVFbCk7IC8vIHllcyEgc2VsZi1jbG9zaW5nIHRhZ3MgY2FuIGhhdmUgc3R5bGUgYXMgY2hpbGRyZW4sIGJ1dCAtIGlmIGkgc2V0IGlubmVySFRNTCwgdGhlIHN0eWxlc2hlZXQgaXMgbG9zdFxyXG5cdFx0XHRkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlRWwpO1xyXG5cdFx0XHRlbC5pZUNQX3N0eWxlRWwgPSBzdHlsZUVsO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGVsLmllQ1Bfc3R5bGVFbCkge1xyXG5cdFx0XHRlbC5pZUNQX3N0eWxlRWwuaW5uZXJIVE1MID0gY3NzO1xyXG5cdFx0fVxyXG5cdH1cclxuXHQvKiAqL1xyXG5cclxuXHRmdW5jdGlvbiBkcmF3VHJlZSh0YXJnZXQpIHtcclxuXHRcdGlmICghdGFyZ2V0KSByZXR1cm47XHJcblx0XHR2YXIgZWxzID0gdGFyZ2V0LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tpZWNwLW5lZWRlZF0nKTtcclxuXHRcdGlmICh0YXJnZXQuaGFzQXR0cmlidXRlICYmIHRhcmdldC5oYXNBdHRyaWJ1dGUoJ2llY3AtbmVlZGVkJykpIGRyYXdFbGVtZW50KHRhcmdldCk7IC8vIHNlbGZcclxuXHRcdGZvciAodmFyIGkgPSAwLCBlbDsgZWwgPSBlbHNbaSsrXTspIHtcclxuXHRcdFx0ZHJhd0VsZW1lbnQoZWwpOyAvLyB0cmVlXHJcblx0XHR9XHJcblx0fVxyXG5cdC8vIGRyYXcgcXVldWVcclxuXHRsZXQgZHJhd1F1ZXVlID0gbmV3IFNldCgpO1xyXG5cdGxldCBjb2xsZWN0aW5nID0gZmFsc2U7XHJcblx0bGV0IGRyYXdpbmcgPSBmYWxzZTtcclxuXHRmdW5jdGlvbiBkcmF3RWxlbWVudChlbCl7XHJcblx0XHRkcmF3UXVldWUuYWRkKGVsKTtcclxuXHRcdGlmIChjb2xsZWN0aW5nKSByZXR1cm47XHJcblx0XHRjb2xsZWN0aW5nID0gdHJ1ZTtcclxuXHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpe1xyXG5cdFx0Ly9zZXRJbW1lZGlhdGUoZnVuY3Rpb24oKXtcclxuXHRcdFx0Y29sbGVjdGluZyA9IGZhbHNlO1xyXG5cdFx0XHRkcmF3aW5nID0gdHJ1ZTtcclxuXHRcdFx0ZHJhd1F1ZXVlLmZvckVhY2goX2RyYXdFbGVtZW50KTtcclxuXHRcdFx0ZHJhd1F1ZXVlLmNsZWFyKCk7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXsgLy8gbXV0YXRpb25PYnNlcnZlciB3aWxsIHRyaWdnZXIgZGVsYXllZCwgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIHdpbGwgbWlzcyBzb21lIGNoYW5nZXNcclxuXHRcdFx0XHRkcmF3aW5nID0gZmFsc2U7XHJcblx0XHRcdH0pXHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblxyXG5cdGZ1bmN0aW9uIGRyYXdUcmVlRXZlbnQoZSkge1xyXG5cdFx0ZHJhd1RyZWUoZS50YXJnZXQpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBmaW5kVmFycyhzdHIsIGNiKXsgLy8gY3NzIHZhbHVlIHBhcnNlclxyXG5cdFx0bGV0IGxldmVsPTAsIG9wZW5lZExldmVsPW51bGwsIGxhc3RQb2ludD0wLCBuZXdTdHIgPSAnJywgaT0wLCBjaGFyLCBpbnNpZGVDYWxjO1xyXG5cdFx0d2hpbGUgKGNoYXI9c3RyW2krK10pIHtcclxuXHRcdFx0aWYgKGNoYXIgPT09ICcoJykge1xyXG5cdFx0XHRcdCsrbGV2ZWw7XHJcblx0XHRcdFx0aWYgKG9wZW5lZExldmVsID09PSBudWxsICYmIHN0cltpLTRdK3N0cltpLTNdK3N0cltpLTJdID09PSAndmFyJykge1xyXG5cdFx0XHRcdFx0b3BlbmVkTGV2ZWwgPSBsZXZlbDtcclxuXHRcdFx0XHRcdG5ld1N0ciArPSBzdHIuc3Vic3RyaW5nKGxhc3RQb2ludCwgaS00KTtcclxuXHRcdFx0XHRcdGxhc3RQb2ludCA9IGk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChzdHJbaS01XStzdHJbaS00XStzdHJbaS0zXStzdHJbaS0yXSA9PT0gJ2NhbGMnKSB7XHJcblx0XHRcdFx0XHRpbnNpZGVDYWxjID0gbGV2ZWw7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChjaGFyID09PSAnKScgJiYgb3BlbmVkTGV2ZWwgPT09IGxldmVsKSB7XHJcblx0XHRcdFx0bGV0IHZhcmlhYmxlID0gc3RyLnN1YnN0cmluZyhsYXN0UG9pbnQsIGktMSkudHJpbSgpLCBmYWxsYmFjaztcclxuXHRcdFx0XHRsZXQgeCA9IHZhcmlhYmxlLmluZGV4T2YoJywnKTtcclxuXHRcdFx0XHRpZiAoeCE9PS0xKSB7XHJcblx0XHRcdFx0XHRmYWxsYmFjayA9IHZhcmlhYmxlLnNsaWNlKHgrMSk7XHJcblx0XHRcdFx0XHR2YXJpYWJsZSA9IHZhcmlhYmxlLnNsaWNlKDAseCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5ld1N0ciArPSBjYih2YXJpYWJsZSwgZmFsbGJhY2ssIGluc2lkZUNhbGMpO1xyXG5cdFx0XHRcdGxhc3RQb2ludCA9IGk7XHJcblx0XHRcdFx0b3BlbmVkTGV2ZWwgPSBudWxsO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChjaGFyID09PSAnKScpIHtcclxuXHRcdFx0XHQtLWxldmVsO1xyXG5cdFx0XHRcdGlmIChpbnNpZGVDYWxjID09PSBsZXZlbCkgaW5zaWRlQ2FsYyA9IG51bGw7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdG5ld1N0ciArPSBzdHIuc3Vic3RyaW5nKGxhc3RQb2ludCk7XHJcblx0XHRyZXR1cm4gbmV3U3RyO1xyXG5cdH1cclxuXHRmdW5jdGlvbiBzdHlsZUNvbXB1dGVWYWx1ZVdpZHRoVmFycyhzdHlsZSwgdmFsdWVXaXRoVmFycywgZGV0YWlscyl7XHJcblx0XHRyZXR1cm4gZmluZFZhcnModmFsdWVXaXRoVmFycywgZnVuY3Rpb24odmFyaWFibGUsIGZhbGxiYWNrLCBpbnNpZGVDYWxjKXtcclxuXHRcdFx0dmFyIHZhbHVlID0gc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSh2YXJpYWJsZSk7XHJcblx0XHRcdGlmIChpbnNpZGVDYWxjKSB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL15jYWxjXFwoLywgJygnKTsgLy8gcHJldmVudCBuZXN0ZWQgY2FsY1xyXG5cdFx0XHRpZiAoZGV0YWlscyAmJiBzdHlsZS5sYXN0UHJvcGVydHlTZXJ2ZWRCeSAhPT0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSBkZXRhaWxzLmFsbEJ5Um9vdCA9IGZhbHNlO1xyXG5cdFx0XHRpZiAodmFsdWU9PT0nJyAmJiBmYWxsYmFjaykgdmFsdWUgPSBzdHlsZUNvbXB1dGVWYWx1ZVdpZHRoVmFycyhzdHlsZSwgZmFsbGJhY2ssIGRldGFpbHMpO1xyXG5cdFx0XHRyZXR1cm4gdmFsdWU7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdC8vIG11dGF0aW9uIGxpc3RlbmVyXHJcblx0dmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24obXV0YXRpb25zKSB7XHJcblx0XHRpZiAoZHJhd2luZykgcmV0dXJuO1xyXG5cdFx0Zm9yICh2YXIgaT0wLCBtdXRhdGlvbjsgbXV0YXRpb249bXV0YXRpb25zW2krK107KSB7XHJcblx0XHRcdGlmIChtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lID09PSAnaWVjcC1uZWVkZWQnKSBjb250aW51ZTsgLy8gd2h5P1xyXG5cdFx0XHQvLyByZWNoZWNrIGFsbCBzZWxlY3RvcnMgaWYgaXQgdGFyZ2V0cyBuZXcgZWxlbWVudHM/XHJcblx0XHRcdGRyYXdUcmVlKG11dGF0aW9uLnRhcmdldCk7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0c2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0b2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudCx7YXR0cmlidXRlczogdHJ1ZSwgc3VidHJlZTogdHJ1ZSB9KTtcclxuXHR9KVxyXG5cclxuXHQvLyA6dGFyZ2V0IGxpc3RlbmVyXHJcblx0dmFyIG9sZEhhc2ggPSBsb2NhdGlvbi5oYXNoXHJcblx0YWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsZnVuY3Rpb24oZSl7XHJcblx0XHR2YXIgbmV3RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChsb2NhdGlvbi5oYXNoLnN1YnN0cigxKSk7XHJcblx0XHRpZiAobmV3RWwpIHtcclxuXHRcdFx0dmFyIG9sZEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQob2xkSGFzaC5zdWJzdHIoMSkpO1xyXG5cdFx0XHRkcmF3VHJlZShuZXdFbCk7XHJcblx0XHRcdGRyYXdUcmVlKG9sZEVsKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGRyYXdUcmVlKGRvY3VtZW50KTtcclxuXHRcdH1cclxuXHRcdG9sZEhhc2ggPSBsb2NhdGlvbi5oYXNoO1xyXG5cdH0pO1xyXG5cclxuXHQvLyBhZGQgb3duaW5nRWxlbWVudCB0byBFbGVtZW50LnN0eWxlXHJcblx0dmFyIGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKEhUTUxFbGVtZW50LnByb3RvdHlwZSwgJ3N0eWxlJyk7XHJcblx0dmFyIHN0eWxlR2V0dGVyID0gZGVzY3JpcHRvci5nZXQ7XHJcblx0ZGVzY3JpcHRvci5nZXQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRjb25zdCBzdHlsZSA9IHN0eWxlR2V0dGVyLmNhbGwodGhpcyk7XHJcblx0XHRzdHlsZS5vd25pbmdFbGVtZW50ID0gdGhpcztcclxuXHRcdHJldHVybiBzdHlsZTtcclxuXHR9XHJcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KEhUTUxFbGVtZW50LnByb3RvdHlwZSwgJ3N0eWxlJywgZGVzY3JpcHRvcik7XHJcblxyXG5cdC8vIGFkZCBjb21wdXRlZEZvciB0byBjb21wdXRlZCBzdHlsZS1vYmplY3RzXHJcblx0dmFyIG9yaWdpbmFsR2V0Q29tcHV0ZWQgPSBnZXRDb21wdXRlZFN0eWxlO1xyXG5cdHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlID0gZnVuY3Rpb24gKGVsKSB7XHJcblx0XHR2YXIgc3R5bGUgPSBvcmlnaW5hbEdldENvbXB1dGVkLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblx0XHRzdHlsZS5jb21wdXRlZEZvciA9IGVsO1xyXG5cdFx0Ly9zdHlsZS5wc2V1ZG9FbHQgPSBwc2V1ZG9FbHQ7IC8vbm90IG5lZWRlZCBhdCB0aGUgbW9tZW50XHJcblx0XHRyZXR1cm4gc3R5bGU7XHJcblx0fVxyXG5cclxuXHQvLyBnZXRQcm9wZXJ0eVZhbHVlIC8gc2V0UHJvcGVydHkgaG9va3NcclxuXHRjb25zdCBTdHlsZVByb3RvID0gQ1NTU3R5bGVEZWNsYXJhdGlvbi5wcm90b3R5cGU7XHJcblxyXG5cdGNvbnN0IG9sZEdldFAgPSBTdHlsZVByb3RvLmdldFByb3BlcnR5VmFsdWU7XHJcblx0U3R5bGVQcm90by5nZXRQcm9wZXJ0eVZhbHVlID0gZnVuY3Rpb24gKHByb3BlcnR5KSB7XHJcblx0XHR0aGlzLmxhc3RQcm9wZXJ0eVNlcnZlZEJ5ID0gZmFsc2U7XHJcblx0XHRwcm9wZXJ0eSA9IHByb3BlcnR5LnRyaW0oKTtcclxuXHJcblx0XHQvKiAqXHJcblx0XHRpZiAodGhpcy5vd25pbmdFbGVtZW50KSB7XHJcblx0XHRcdGNvbnN0IGllUHJvcGVydHkgPSAnLWllVmFyLScrcHJvcGVydHk7XHJcblx0XHRcdGNvbnN0IGllUHJvcGVydHlJbXBvcnRhbnQgPSAnLWllVmFyLeKdlycrcHJvcGVydHk7XHJcblx0XHRcdGxldCB2YWx1ZSA9IHRoaXNbaWVQcm9wZXJ0eUltcG9ydGFudF0gfHwgdGhpc1tpZVByb3BlcnR5XTtcclxuXHRcdFx0aWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHQvLyB0b2RvLCB0ZXN0IGlmIHN5bnRheCB2YWxpZFxyXG5cdFx0XHRcdHJldHVybiB2YWx1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0LyogKi9cclxuXHJcblx0XHRpZiAocHJvcGVydHlbMF0gIT09ICctJyB8fCBwcm9wZXJ0eVsxXSAhPT0gJy0nKSByZXR1cm4gb2xkR2V0UC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG5cdFx0Y29uc3QgdW5kYXNoZWQgPSBwcm9wZXJ0eS5zdWJzdHIoMik7XHJcblx0XHRjb25zdCBpZVByb3BlcnR5ID0gJy1pZS0nK3VuZGFzaGVkO1xyXG5cdFx0Y29uc3QgaWVQcm9wZXJ0eUltcG9ydGFudCA9ICctaWUt4p2XJyt1bmRhc2hlZDtcclxuXHRcdGxldCB2YWx1ZSA9IGRlY29kZVZhbHVlKHRoaXNbaWVQcm9wZXJ0eUltcG9ydGFudF0gfHwgdGhpc1tpZVByb3BlcnR5XSk7XHJcblxyXG5cdFx0aWYgKHRoaXMuY29tcHV0ZWRGb3IpIHsgLy8gY29tcHV0ZWRTdHlsZVxyXG5cdFx0XHRpZiAodmFsdWUgIT09IHVuZGVmaW5lZCAmJiAhaW5oZXJpdGluZ0tleXdvcmRzW3ZhbHVlXSkge1xyXG5cdFx0XHRcdC8vaWYgKHJlZ0hhc1Zhci50ZXN0KHZhbHVlKSkgIC8vIHRvZG86IHRvIGkgbmVlZCB0aGlzIGNoZWNrPyEhISBpIHRoaW5rIGl0cyBmYXN0ZXIgd2l0aG91dFxyXG5cdFx0XHRcdFx0dmFsdWUgPSBzdHlsZUNvbXB1dGVWYWx1ZVdpZHRoVmFycyh0aGlzLCB2YWx1ZSk7XHJcblx0XHRcdFx0dGhpcy5sYXN0UHJvcGVydHlTZXJ2ZWRCeSA9IHRoaXMuY29tcHV0ZWRGb3I7XHJcblx0XHRcdH0gZWxzZSB7IC8vIGluaGVyaXRlZFxyXG5cdFx0XHRcdGlmIChpbmhlcml0aW5nS2V5d29yZHNbdmFsdWVdIHx8ICFyZWdpc3Rlcltwcm9wZXJ0eV0gfHwgcmVnaXN0ZXJbcHJvcGVydHldLmluaGVyaXRzKSB7XHJcblx0XHRcdFx0XHQvL2xldCBlbCA9IHRoaXMucHNldWRvRWx0ID8gdGhpcy5jb21wdXRlZEZvciA6IHRoaXMuY29tcHV0ZWRGb3IucGFyZW50Tm9kZTtcclxuXHRcdFx0XHRcdGxldCBlbCA9IHRoaXMuY29tcHV0ZWRGb3IucGFyZW50Tm9kZTtcclxuXHRcdFx0XHRcdHdoaWxlIChlbC5ub2RlVHlwZSA9PT0gMSkge1xyXG5cdFx0XHRcdFx0XHQvLyBob3cgc2xvd2VyIHdvdWxkIGl0IGJlIHRvIGdldENvbXB1dGVkU3R5bGUgZm9yIGV2ZXJ5IGVsZW1lbnQsIG5vdCBqdXN0IHdpdGggZGVmaW5lZCBpZUNQX3NldHRlcnNcclxuXHRcdFx0XHRcdFx0aWYgKGVsLmllQ1Bfc2V0dGVycyAmJiBlbC5pZUNQX3NldHRlcnNbcHJvcGVydHldKSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gaSBjb3VsZCBtYWtlXHJcblx0XHRcdFx0XHRcdFx0Ly8gdmFsdWUgPSBlbC5ub2RlVHlwZSA/IGdldENvbXB1dGVkU3R5bGUodGhpcy5jb21wdXRlZEZvci5wYXJlbnROb2RlKS5nZXRQcm9wZXJ0eVZhbHVlKHByb3BlcnR5KVxyXG5cdFx0XHRcdFx0XHRcdC8vIGJ1dCBpIGZlYXIgcGVyZm9ybWFuY2UsIHN0dXBpZD9cclxuXHRcdFx0XHRcdFx0XHR2YXIgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsKTtcclxuXHRcdFx0XHRcdFx0XHR2YXIgdG1wVmFsID0gZGVjb2RlVmFsdWUoc3R5bGVbaWVQcm9wZXJ0eUltcG9ydGFudF0gfHwgc3R5bGVbaWVQcm9wZXJ0eV0pO1xyXG5cdFx0XHRcdFx0XHRcdGlmICh0bXBWYWwgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2FsY3VsYXRlZCBzdHlsZSBmcm9tIGN1cnJlbnQgZWxlbWVudCBub3QgZnJvbSB0aGUgZWxlbWVudCB0aGUgdmFsdWUgd2FzIGluaGVyaXRlZCBmcm9tISAoc3R5bGUsIHZhbHVlKVxyXG5cdFx0XHRcdFx0XHRcdFx0Ly92YWx1ZSA9IHRtcFZhbDsgaWYgKHJlZ0hhc1Zhci50ZXN0KHRtcFZhbCkpICAvLyB0b2RvOiB0byBpIG5lZWQgdGhpcyBjaGVjaz8hISEgaSB0aGluayBpdHMgZmFzdGVyIHdpdGhvdXRcclxuXHRcdFx0XHRcdFx0XHRcdFx0dmFsdWUgPSBzdHlsZUNvbXB1dGVWYWx1ZVdpZHRoVmFycyh0aGlzLCB0bXBWYWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5sYXN0UHJvcGVydHlTZXJ2ZWRCeSA9IGVsO1xyXG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGVsID0gZWwucGFyZW50Tm9kZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHZhbHVlPT09J2luaXRpYWwnKSByZXR1cm4gJyc7XHJcblx0XHR9XHJcblx0XHQvL2lmICgodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gJ2luaXRpYWwnKSAmJiByZWdpc3Rlcltwcm9wZXJ0eV0pIHZhbHVlID0gcmVnaXN0ZXJbcHJvcGVydHldLmluaXRpYWxWYWx1ZTsgLy8gdG9kbz9cclxuXHRcdGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkICYmIHJlZ2lzdGVyW3Byb3BlcnR5XSkgdmFsdWUgPSByZWdpc3Rlcltwcm9wZXJ0eV0uaW5pdGlhbFZhbHVlO1xyXG5cdFx0aWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHJldHVybiAnJztcclxuXHRcdHJldHVybiB2YWx1ZTtcclxuXHR9O1xyXG5cdGNvbnN0IGluaGVyaXRpbmdLZXl3b3JkcyA9IHtpbmhlcml0OjEscmV2ZXJ0OjEsdW5zZXQ6MX07XHJcblxyXG5cdGNvbnN0IG9sZFNldFAgPSBTdHlsZVByb3RvLnNldFByb3BlcnR5O1xyXG5cdFN0eWxlUHJvdG8uc2V0UHJvcGVydHkgPSBmdW5jdGlvbiAocHJvcGVydHksIHZhbHVlLCBwcmlvKSB7XHJcblx0XHRpZiAocHJvcGVydHlbMF0gIT09ICctJyB8fCBwcm9wZXJ0eVsxXSAhPT0gJy0nKSByZXR1cm4gb2xkU2V0UC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG5cdFx0Y29uc3QgZWwgPSB0aGlzLm93bmluZ0VsZW1lbnQ7XHJcblx0XHRpZiAoZWwpIHtcclxuXHRcdFx0aWYgKCFlbC5pZUNQX3NldHRlcnMpIGVsLmllQ1Bfc2V0dGVycyA9IHt9O1xyXG5cdFx0XHRlbC5pZUNQX3NldHRlcnNbcHJvcGVydHldID0gMTtcclxuXHRcdH1cclxuXHRcdHByb3BlcnR5ID0gJy1pZS0nKyhwcmlvPT09J2ltcG9ydGFudCc/J+Kdlyc6JycpICsgcHJvcGVydHkuc3Vic3RyKDIpO1xyXG5cdFx0dGhpcy5jc3NUZXh0ICs9ICc7ICcgKyBwcm9wZXJ0eSArICc6JyArIGVuY29kZVZhbHVlKHZhbHVlKSArICc7JztcclxuXHRcdC8vdGhpc1twcm9wZXJ0eV0gPSB2YWx1ZTtcclxuXHRcdGVsID09PSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiYgcmVkcmF3U3R5bGVTaGVldHMoKTtcclxuXHRcdGVsICYmIGRyYXdUcmVlKGVsKTsgLy8gaXRzIGRlbGF5ZWQgaW50ZXJuYWxcclxuXHR9O1xyXG5cclxuXHJcblx0LypcclxuXHR2YXIgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoU3R5bGVQcm90bywgJ2Nzc1RleHQnKTtcclxuXHR2YXIgY3NzVGV4dEdldHRlciA9IGRlc2NyaXB0b3IuZ2V0O1xyXG5cdHZhciBjc3NUZXh0U2V0dGVyID0gZGVzY3JpcHRvci5zZXQ7XHJcblx0Ly8gZGVzY3JpcHRvci5nZXQgPSBmdW5jdGlvbiAoKSB7XHJcblx0Ly8gXHRjb25zdCBzdHlsZSA9IHN0eWxlR2V0dGVyLmNhbGwodGhpcyk7XHJcblx0Ly8gXHRzdHlsZS5vd25pbmdFbGVtZW50ID0gdGhpcztcclxuXHQvLyBcdHJldHVybiBzdHlsZTtcclxuXHQvLyB9XHJcblx0ZGVzY3JpcHRvci5zZXQgPSBmdW5jdGlvbiAoY3NzKSB7XHJcblx0XHR2YXIgZWwgPSB0aGlzLm93bmluZ0VsZW1lbnQ7XHJcblx0XHRpZiAoZWwpIHtcclxuXHRcdFx0Y3NzID0gcmV3cml0ZUNzcygneycrY3NzKS5zdWJzdHIoMSk7XHJcblx0XHRcdGNzc1RleHRTZXR0ZXIuY2FsbCh0aGlzLCBjc3MpO1xyXG5cdFx0XHR2YXIgZm91bmQgPSBwYXJzZVJld3JpdHRlblN0eWxlKHRoaXMpO1xyXG5cdFx0XHRpZiAoZm91bmQuZ2V0dGVycykgYWRkR2V0dGVyRWxlbWVudChlbCwgZm91bmQuZ2V0dGVycywgJyVzdHlsZUF0dHInKTtcclxuXHRcdFx0aWYgKGZvdW5kLnNldHRlcnMpIGFkZFNldHRlckVsZW1lbnQoZWwsIGZvdW5kLnNldHRlcnMpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY3NzVGV4dFNldHRlci5jYWxsKHRoaXMsIGNzcyk7XHJcblx0fVxyXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdHlsZVByb3RvLCAnY3NzVGV4dCcsIGRlc2NyaXB0b3IpO1xyXG5cdCovXHJcblxyXG5cclxuXHRpZiAoIXdpbmRvdy5DU1MpIHdpbmRvdy5DU1MgPSB7fTtcclxuXHRjb25zdCByZWdpc3RlciA9IHt9XHJcblx0Q1NTLnJlZ2lzdGVyUHJvcGVydHkgPSBmdW5jdGlvbihvcHRpb25zKXtcclxuXHRcdHJlZ2lzdGVyW29wdGlvbnMubmFtZV0gPSBvcHRpb25zO1xyXG5cdH1cclxuXHJcblx0Ly8gZml4IFwiaW5pdGlhbFwiIGtleXdvcmQgd2l0aCBnZW5lcmF0ZWQgY3VzdG9tIHByb3BlcnRpZXMsIHRoaXMgaXMgbm90IHN1cHBvcnRlZCBhZCBhbGwgYnkgaWUsIHNob3VsZCBpIG1ha2UgYSBzZXBhcmF0ZSBcImluaGVyaXRcIi1wb2x5ZmlsbD9cclxuXHQvKlxyXG5cdGNvbnN0IGNvbXB1dGVkID0gZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpXHJcblx0Y29uc3QgaW5pdGlhbHMgPSB7fTtcclxuXHRmb3IgKGxldCBpIGluIGNvbXB1dGVkKSB7XHJcblx0XHRpbml0aWFsc1tpLnJlcGxhY2UoLyhbQS1aXSkvLCBmdW5jdGlvbih4KXsgcmV0dXJuICctJyt4LnRvTG93ZXJDYXNlKHgpIH0pXSA9IGNvbXB1dGVkW2ldO1xyXG5cdH1cclxuXHRpbml0aWFsc1snZGlzcGxheSddID0gJ2lubGluZSc7XHJcblx0Ki9cclxuXHJcblx0Ly8gdXRpbHNcclxuXHRmdW5jdGlvbiBmZXRjaENzcyh1cmwsIGNhbGxiYWNrKSB7XHJcblx0XHR2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cdFx0cmVxdWVzdC5vcGVuKCdHRVQnLCB1cmwpO1xyXG5cdFx0cmVxdWVzdC5vdmVycmlkZU1pbWVUeXBlKCd0ZXh0L2NzcycpO1xyXG5cdFx0cmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmIChyZXF1ZXN0LnN0YXR1cyA+PSAyMDAgJiYgcmVxdWVzdC5zdGF0dXMgPCA0MDApIHtcclxuXHRcdFx0XHRjYWxsYmFjayhyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0XHRyZXF1ZXN0LnNlbmQoKTtcclxuXHR9XHJcblxyXG59KCk7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=