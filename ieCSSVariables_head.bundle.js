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
/******/ 	__webpack_require__.p = "/";
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2llMTFDdXN0b21Qcm9wZXJ0aWVzLmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsInRlc3RFbCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInN0eWxlIiwic2V0UHJvcGVydHkiLCJnZXRQcm9wZXJ0eVZhbHVlIiwibXNNYXRjaGVzU2VsZWN0b3IiLCJFbGVtZW50IiwicHJvdG90eXBlIiwibWF0Y2hlcyIsImxpc3RlbmVycyIsInJvb3QiLCJPYnNlcnZlciIsInFzYSIsImVsIiwic2VsZWN0b3IiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZSIsIm9uRWxlbWVudCIsImNhbGxiYWNrIiwibGlzdGVuZXIiLCJlbGVtZW50cyIsIldlYWtNYXAiLCJlbHMiLCJpIiwic2V0IiwiY2FsbCIsInB1c2giLCJNdXRhdGlvbk9ic2VydmVyIiwiY2hlY2tNdXRhdGlvbnMiLCJvYnNlcnZlIiwiY2hpbGRMaXN0Iiwic3VidHJlZSIsImNoZWNrTGlzdGVuZXIiLCJ0YXJnZXQiLCJsb2FkZWQiLCJBcnJheSIsImFwcGx5IiwiaGFzIiwiY2hlY2tMaXN0ZW5lcnMiLCJpbnNpZGUiLCJtdXRhdGlvbnMiLCJqIiwibXV0YXRpb24iLCJub2RlcyIsImFkZGVkTm9kZXMiLCJub2RlVHlwZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJjb3B5UHJvcGVydHkiLCJwcm9wIiwiZnJvbSIsInRvIiwiZGVzYyIsIk9iamVjdCIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImRlZmluZVByb3BlcnR5IiwiSFRNTEVsZW1lbnQiLCJTVkdTdHlsZUVsZW1lbnQiLCJnZXQiLCJhbGwiLCJzdHlsZVNoZWV0cyIsInNoZWV0Iiwib3duZXJOb2RlIiwicmVnRmluZFNldHRlcnMiLCJyZWdGaW5kR2V0dGVycyIsInJlZ1J1bGVJRUdldHRlcnMiLCJyZWdSdWxlSUVTZXR0ZXJzIiwicmVnUHNldWRvcyIsImZldGNoQ3NzIiwiaHJlZiIsImNzcyIsIm5ld0NzcyIsInJld3JpdGVDc3MiLCJyZWxUb0FicyIsImRpc2FibGVkIiwibWVkaWEiLCJzZXRBdHRyaWJ1dGUiLCJwYXJlbnROb2RlIiwiaW5zZXJ0QmVmb3JlIiwiYWN0aXZhdGVTdHlsZUVsZW1lbnQiLCJmb3VuZFN0eWxlIiwiaWVDUF9wb2x5ZmlsbGVkIiwiaWVDUF9lbGVtZW50U2hlZXQiLCJpbm5lckhUTUwiLCJnZXRBdHRyaWJ1dGUiLCJzdWJzdHIiLCJjc3NUZXh0IiwiZm91bmQiLCJwYXJzZVJld3JpdHRlblN0eWxlIiwiZ2V0dGVycyIsImFkZEdldHRlckVsZW1lbnQiLCJzZXR0ZXJzIiwiYWRkU2V0dGVyRWxlbWVudCIsImJhc2UiLCJyZXBsYWNlIiwiJDAiLCIkMSIsInRyaW0iLCJtYXRjaCIsIiQyIiwiJDMiLCIkNCIsImltcG9ydGFudCIsImVuY29kZVZhbHVlIiwidmFsdWUiLCJrZXl3b3JkcyIsImluaXRpYWwiLCJpbmhlcml0IiwicmV2ZXJ0IiwidW5zZXQiLCJkZWNvZGVWYWx1ZSIsInVuZGVmaW5lZCIsInRyaW1tZWQiLCJzdHlsZXNfb2ZfZ2V0dGVyX3Byb3BlcnRpZXMiLCJtYXRjaGVzR2V0dGVycyIsInByb3BOYW1lIiwic2xpY2UiLCJtYXRjaGVzU2V0dGVycyIsIngiLCJzcGxpdCIsInByb3BWYWx1ZSIsInJ1bGVzIiwicnVsZSIsImFkZEdldHRlcnNTZWxlY3RvciIsInNlbGVjdG9yVGV4dCIsImNzc1ZhcmlhYmxlcyIsImtleXMiLCJyZWR1Y2UiLCJhY2MiLCJjc3NWYXJpYWJsZSIsImluY2x1ZGVzIiwiYWRkU2V0dGVyc1NlbGVjdG9yIiwicGFyZW50UnVsZSIsIm1lZGlhVGV4dCIsIm1hdGNoTWVkaWEiLCJhZGRMaXN0ZW5lciIsImRyYXdUcmVlIiwiZG9jdW1lbnRFbGVtZW50IiwicmVkcmF3U3R5bGVTaGVldHMiLCJwcm9wZXJ0aWVzIiwic2VsZWN0b3JBZGRQc2V1ZG9MaXN0ZW5lcnMiLCJ1blBzZXVkbyIsImRyYXdFbGVtZW50Iiwic2VsZWN0b3JzIiwiaWVDUFNlbGVjdG9ycyIsInBhcnRzIiwicHNldWRvIiwicHJvcFZhbHMiLCJpZUNQX3NldHRlcnMiLCJzdHlsZXMiLCJvd25pbmdFbGVtZW50Iiwic3R5bGVDb21wdXRlVmFsdWVXaWR0aFZhcnMiLCJnZXRDb21wdXRlZFN0eWxlIiwicHNldWRvcyIsImhvdmVyIiwib24iLCJvZmYiLCJmb2N1cyIsImFjdGl2ZSIsImxlbmd0aCIsImVuZGluZyIsInNlbCIsImRyYXdUcmVlRXZlbnQiLCJDU1NBY3RpdmUiLCJzZXRUaW1lb3V0IiwiYWN0aXZlRWxlbWVudCIsImV2dCIsImNyZWF0ZUV2ZW50IiwiaW5pdEV2ZW50IiwiZGlzcGF0Y2hFdmVudCIsInVuaXF1ZUNvdW50ZXIiLCJfZHJhd0VsZW1lbnQiLCJpZUNQX3VuaXF1ZSIsImNsYXNzTGlzdCIsImFkZCIsInZhbHVlV2l0aFZhciIsImRldGFpbHMiLCJpdGVtIiwiYWxsQnlSb290IiwiZWxlbWVudFNldENzcyIsImllQ1Bfc3R5bGVFbCIsInN0eWxlRWwiLCJoZWFkIiwiYXBwZW5kQ2hpbGQiLCJoYXNBdHRyaWJ1dGUiLCJkcmF3UXVldWUiLCJTZXQiLCJjb2xsZWN0aW5nIiwiZHJhd2luZyIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImZvckVhY2giLCJjbGVhciIsImZpbmRWYXJzIiwic3RyIiwiY2IiLCJsZXZlbCIsIm9wZW5lZExldmVsIiwibGFzdFBvaW50IiwibmV3U3RyIiwiY2hhciIsImluc2lkZUNhbGMiLCJzdWJzdHJpbmciLCJ2YXJpYWJsZSIsImZhbGxiYWNrIiwiaW5kZXhPZiIsInZhbHVlV2l0aFZhcnMiLCJsYXN0UHJvcGVydHlTZXJ2ZWRCeSIsIm9ic2VydmVyIiwiYXR0cmlidXRlTmFtZSIsImF0dHJpYnV0ZXMiLCJvbGRIYXNoIiwibG9jYXRpb24iLCJoYXNoIiwibmV3RWwiLCJnZXRFbGVtZW50QnlJZCIsIm9sZEVsIiwiZGVzY3JpcHRvciIsInN0eWxlR2V0dGVyIiwib3JpZ2luYWxHZXRDb21wdXRlZCIsImFyZ3VtZW50cyIsImNvbXB1dGVkRm9yIiwiU3R5bGVQcm90byIsIkNTU1N0eWxlRGVjbGFyYXRpb24iLCJvbGRHZXRQIiwicHJvcGVydHkiLCJ1bmRhc2hlZCIsImllUHJvcGVydHkiLCJpZVByb3BlcnR5SW1wb3J0YW50IiwiaW5oZXJpdGluZ0tleXdvcmRzIiwicmVnaXN0ZXIiLCJpbmhlcml0cyIsInRtcFZhbCIsImluaXRpYWxWYWx1ZSIsIm9sZFNldFAiLCJwcmlvIiwiQ1NTIiwicmVnaXN0ZXJQcm9wZXJ0eSIsIm9wdGlvbnMiLCJuYW1lIiwidXJsIiwicmVxdWVzdCIsIlhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsIm92ZXJyaWRlTWltZVR5cGUiLCJvbmxvYWQiLCJzdGF0dXMiLCJyZXNwb25zZVRleHQiLCJzZW5kIl0sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0EsQ0FBQyxZQUFZO0FBQ1o7O0FBRUFBLFFBQU0s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LFdBQU8sQ0FBQ08sSUFBUjtBQUNBO0FBRUQsQ0E3c0JBLEVBQUQsQyIsImZpbGUiOiJpZUNTU1ZhcmlhYmxlc19oZWFkLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL1wiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pZTExQ3VzdG9tUHJvcGVydGllcy5qc1wiKTtcbiIsIi8qISBpZTExQ3VzdG9tUHJvcGVydGllcy5qcyB2My4wLjYgfCBNSVQgTGljZW5zZSB8IGh0dHBzOi8vZ2l0LmlvL2ZqWE1OICovXHJcbiFmdW5jdGlvbiAoKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHR3aW5kb3dbJ2Nzc1ZhcmlhYmxlcyddID0ge307XHJcblx0Ly8gY2hlY2sgZm9yIHN1cHBvcnRcclxuXHR2YXIgdGVzdEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaScpO1xyXG5cdHRlc3RFbC5zdHlsZS5zZXRQcm9wZXJ0eSgnLS14JywgJ3knKTtcclxuXHRpZiAodGVzdEVsLnN0eWxlLmdldFByb3BlcnR5VmFsdWUoJy0teCcpID09PSAneScgfHwgIXRlc3RFbC5tc01hdGNoZXNTZWxlY3RvcikgcmV0dXJuO1xyXG5cclxuXHRpZiAoIUVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXMpIEVsZW1lbnQucHJvdG90eXBlLm1hdGNoZXMgPSBFbGVtZW50LnByb3RvdHlwZS5tc01hdGNoZXNTZWxlY3RvcjtcclxuXHJcbiAgICB2YXIgbGlzdGVuZXJzID0gW10sXHJcbiAgICAgICAgcm9vdCA9IGRvY3VtZW50LFxyXG4gICAgICAgIE9ic2VydmVyO1xyXG5cclxuXHRmdW5jdGlvbiBxc2EoZWwsIHNlbGVjdG9yKXtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHJldHVybiBlbC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcclxuXHRcdH0gY2F0Y2goZSkge1xyXG5cdFx0XHQvLyBjb25zb2xlLndhcm4oJ3RoZSBTZWxlY3RvciAnK3NlbGVjdG9yKycgY2FuIG5vdCBiZSBwYXJzZWQnKTtcclxuXHRcdFx0cmV0dXJuIFtdO1xyXG5cdFx0fVxyXG5cdH1cclxuICAgIGZ1bmN0aW9uIG9uRWxlbWVudCAoc2VsZWN0b3IsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdmFyIGxpc3RlbmVyID0ge1xyXG4gICAgICAgICAgICBzZWxlY3Rvcjogc2VsZWN0b3IsXHJcbiAgICAgICAgICAgIGNhbGxiYWNrOiBjYWxsYmFjayxcclxuICAgICAgICAgICAgZWxlbWVudHM6IG5ldyBXZWFrTWFwKCksXHJcbiAgICAgICAgfTtcclxuXHRcdHZhciBlbHMgPSBxc2Eocm9vdCwgbGlzdGVuZXIuc2VsZWN0b3IpLCBpPTAsIGVsO1xyXG5cdFx0d2hpbGUgKGVsID0gZWxzW2krK10pIHtcclxuICAgICAgICAgICAgbGlzdGVuZXIuZWxlbWVudHMuc2V0KGVsLCB0cnVlKTtcclxuICAgICAgICAgICAgbGlzdGVuZXIuY2FsbGJhY2suY2FsbChlbCwgZWwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsaXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XHJcbiAgICAgICAgaWYgKCFPYnNlcnZlcikge1xyXG4gICAgICAgICAgICBPYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGNoZWNrTXV0YXRpb25zKTtcclxuICAgICAgICAgICAgT2JzZXJ2ZXIub2JzZXJ2ZShyb290LCB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZExpc3Q6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBzdWJ0cmVlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjaGVja0xpc3RlbmVyKGxpc3RlbmVyKTtcclxuICAgIH07XHJcbiAgICBmdW5jdGlvbiBjaGVja0xpc3RlbmVyKGxpc3RlbmVyLCB0YXJnZXQpIHtcclxuICAgICAgICB2YXIgaSA9IDAsIGVsLCBlbHMgPSBbXTtcclxuXHRcdHRyeSB7XHJcblx0XHRcdHRhcmdldCAmJiB0YXJnZXQubWF0Y2hlcyhsaXN0ZW5lci5zZWxlY3RvcikgJiYgZWxzLnB1c2godGFyZ2V0KTtcclxuXHRcdH0gY2F0Y2goZSkge31cclxuICAgICAgICBpZiAobG9hZGVkKSB7IC8vIG9rPyBjaGVjayBpbnNpZGUgbm9kZSBvbiBpbm5lckhUTUwgLSBvbmx5IHdoZW4gbG9hZGVkXHJcbiAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KGVscywgcXNhKHRhcmdldCB8fCByb290LCBsaXN0ZW5lci5zZWxlY3RvcikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3aGlsZSAoZWwgPSBlbHNbaSsrXSkge1xyXG4gICAgICAgICAgICBpZiAobGlzdGVuZXIuZWxlbWVudHMuaGFzKGVsKSkgY29udGludWU7XHJcbiAgICAgICAgICAgIGxpc3RlbmVyLmVsZW1lbnRzLnNldChlbCx0cnVlKTtcclxuICAgICAgICAgICAgbGlzdGVuZXIuY2FsbGJhY2suY2FsbChlbCwgZWwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIGNoZWNrTGlzdGVuZXJzKGluc2lkZSkge1xyXG4gICAgICAgIHZhciBpID0gMCwgbGlzdGVuZXI7XHJcbiAgICAgICAgd2hpbGUgKGxpc3RlbmVyID0gbGlzdGVuZXJzW2krK10pIGNoZWNrTGlzdGVuZXIobGlzdGVuZXIsIGluc2lkZSk7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBjaGVja011dGF0aW9ucyhtdXRhdGlvbnMpIHtcclxuXHRcdHZhciBqID0gMCwgaSwgbXV0YXRpb24sIG5vZGVzLCB0YXJnZXQ7XHJcbiAgICAgICAgd2hpbGUgKG11dGF0aW9uID0gbXV0YXRpb25zW2orK10pIHtcclxuICAgICAgICAgICAgbm9kZXMgPSBtdXRhdGlvbi5hZGRlZE5vZGVzLCBpID0gMDtcclxuICAgICAgICAgICAgd2hpbGUgKHRhcmdldCA9IG5vZGVzW2krK10pIHRhcmdldC5ub2RlVHlwZSA9PT0gMSAmJiBjaGVja0xpc3RlbmVycyh0YXJnZXQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB2YXIgbG9hZGVkID0gZmFsc2U7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGxvYWRlZCA9IHRydWU7XHJcbiAgICB9KTtcclxuXHJcblx0Ly8gc3ZnIHBvbHlmaWxsc1xyXG5cdGZ1bmN0aW9uIGNvcHlQcm9wZXJ0eShwcm9wLCBmcm9tLCB0byl7XHJcblx0XHR2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoZnJvbSwgcHJvcCk7XHJcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkodG8sIHByb3AsIGRlc2MpO1xyXG5cdH1cclxuXHRpZiAoISgnY2xhc3NMaXN0JyBpbiBFbGVtZW50LnByb3RvdHlwZSkpIHtcclxuXHRcdGNvcHlQcm9wZXJ0eSgnY2xhc3NMaXN0JywgSFRNTEVsZW1lbnQucHJvdG90eXBlLCBFbGVtZW50LnByb3RvdHlwZSk7XHJcblx0fVxyXG5cdGlmICghKCdpbm5lckhUTUwnIGluIEVsZW1lbnQucHJvdG90eXBlKSkge1xyXG5cdFx0Y29weVByb3BlcnR5KCdpbm5lckhUTUwnLCBIVE1MRWxlbWVudC5wcm90b3R5cGUsIEVsZW1lbnQucHJvdG90eXBlKTtcclxuXHR9XHJcblx0aWYgKCEoJ3NoZWV0JyBpbiBTVkdTdHlsZUVsZW1lbnQucHJvdG90eXBlKSkge1xyXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KFNWR1N0eWxlRWxlbWVudC5wcm90b3R5cGUsICdzaGVldCcsIHtcclxuXHRcdFx0Z2V0OmZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0dmFyIGFsbCA9IGRvY3VtZW50LnN0eWxlU2hlZXRzLCBpPTAsIHNoZWV0O1xyXG5cdFx0XHRcdHdoaWxlIChzaGVldD1hbGxbaSsrXSkge1xyXG5cdFx0XHRcdFx0aWYgKHNoZWV0Lm93bmVyTm9kZSA9PT0gdGhpcykgcmV0dXJuIHNoZWV0O1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblxyXG5cdC8vIG1haW4gbG9naWNcclxuXHJcblx0Ly8gY2FjaGVkIHJlZ2V4cHMsIGJldHRlciBwZXJmb3JtYW5jZVxyXG5cdGNvbnN0IHJlZ0ZpbmRTZXR0ZXJzID0gLyhbXFxzeztdKSgtLShbQS1aYS16MC05LV9dKilcXHMqOihbXjshfXtdKykoIWltcG9ydGFudCk/KSg/PVxccyooWzt9XXwkKSkvZztcclxuXHRjb25zdCByZWdGaW5kR2V0dGVycyA9IC8oW3s7XVxccyopKFtBLVphLXowLTktX10rXFxzKjpbXjt9e10qdmFyXFwoW14hO317XSspKCFpbXBvcnRhbnQpPyg/PVxccyooWzt9JF18JCkpL2c7XHJcblx0Y29uc3QgcmVnUnVsZUlFR2V0dGVycyA9IC8taWVWYXItKFteOl0rKTovZ1xyXG5cdGNvbnN0IHJlZ1J1bGVJRVNldHRlcnMgPSAvLWllLShbXn07XSspL2dcclxuXHQvL2NvbnN0IHJlZ0hhc1ZhciA9IC92YXJcXCgvO1xyXG5cdGNvbnN0IHJlZ1BzZXVkb3MgPSAvOihob3ZlcnxhY3RpdmV8Zm9jdXN8dGFyZ2V0fDpiZWZvcmV8OmFmdGVyfDpmaXJzdC1sZXR0ZXJ8OmZpcnN0LWxpbmUpLztcclxuXHJcblx0b25FbGVtZW50KCdsaW5rW3JlbD1cInN0eWxlc2hlZXRcIl0nLCBmdW5jdGlvbiAoZWwpIHtcclxuXHRcdGZldGNoQ3NzKGVsLmhyZWYsIGZ1bmN0aW9uIChjc3MpIHtcclxuXHRcdFx0dmFyIG5ld0NzcyA9IHJld3JpdGVDc3MoY3NzKTtcclxuXHRcdFx0aWYgKGNzcyA9PT0gbmV3Q3NzKSByZXR1cm47XHJcblx0XHRcdG5ld0NzcyA9IHJlbFRvQWJzKGVsLmhyZWYsIG5ld0Nzcyk7XHJcblx0XHRcdGVsLmRpc2FibGVkID0gdHJ1ZTtcclxuXHRcdFx0dmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcclxuXHRcdFx0aWYgKGVsLm1lZGlhKSBzdHlsZS5zZXRBdHRyaWJ1dGUoJ21lZGlhJywgZWwubWVkaWEpO1xyXG5cdFx0XHRlbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShzdHlsZSwgZWwpO1xyXG5cdFx0XHRhY3RpdmF0ZVN0eWxlRWxlbWVudChzdHlsZSwgbmV3Q3NzKTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cclxuXHRmdW5jdGlvbiBmb3VuZFN0eWxlKGVsKXtcclxuXHRcdGlmIChlbC5pZUNQX3BvbHlmaWxsZWQpIHJldHVybjtcclxuXHRcdGlmIChlbC5pZUNQX2VsZW1lbnRTaGVldCkgcmV0dXJuO1xyXG5cdFx0dmFyIGNzcyA9IGVsLmlubmVySFRNTDtcclxuXHRcdHZhciBuZXdDc3MgPSByZXdyaXRlQ3NzKGNzcyk7XHJcblx0XHRpZiAoY3NzID09PSBuZXdDc3MpIHJldHVybjtcclxuXHRcdGFjdGl2YXRlU3R5bGVFbGVtZW50KGVsLCBuZXdDc3MpO1xyXG5cdH1cclxuXHRvbkVsZW1lbnQoJ3N0eWxlJywgZm91bmRTdHlsZSk7XHJcblx0Ly8gaW1tZWRpYXRlLCB0byBwYXNzIHczYy10ZXN0cywgYnVkIGl0cyBhIGJhZCBpZGVhXHJcblx0Ly8gYWRkRXZlbnRMaXN0ZW5lcignRE9NTm9kZUluc2VydGVkJyxmdW5jdGlvbihlKXsgZS50YXJnZXQudGFnTmFtZSA9PT0gJ1NUWUxFJyAmJiBmb3VuZFN0eWxlKGUudGFyZ2V0KTsgfSk7XHJcblxyXG5cclxuXHJcblx0b25FbGVtZW50KCdbaWUtc3R5bGVdJywgZnVuY3Rpb24gKGVsKSB7XHJcblx0XHR2YXIgbmV3Q3NzID0gcmV3cml0ZUNzcygneycrZWwuZ2V0QXR0cmlidXRlKCdpZS1zdHlsZScpKS5zdWJzdHIoMSk7XHJcblx0XHRlbC5zdHlsZS5jc3NUZXh0ICs9ICc7JysgbmV3Q3NzO1xyXG5cdFx0dmFyIGZvdW5kID0gcGFyc2VSZXdyaXR0ZW5TdHlsZShlbC5zdHlsZSk7XHJcblx0XHRpZiAoZm91bmQuZ2V0dGVycykgYWRkR2V0dGVyRWxlbWVudChlbCwgZm91bmQuZ2V0dGVycywgJyVzdHlsZUF0dHInKTtcclxuXHRcdGlmIChmb3VuZC5zZXR0ZXJzKSBhZGRTZXR0ZXJFbGVtZW50KGVsLCBmb3VuZC5zZXR0ZXJzKTtcclxuXHR9KTtcclxuXHJcblx0ZnVuY3Rpb24gcmVsVG9BYnMoYmFzZSwgY3NzKSB7XHJcblx0XHRyZXR1cm4gY3NzLnJlcGxhY2UoL3VybFxcKChbXildKylcXCkvZywgZnVuY3Rpb24oJDAsICQxKXtcclxuXHRcdFx0JDEgPSAkMS50cmltKCkucmVwbGFjZSgvKF5bJ1wiXXxbJ1wiXSQpL2csJycpO1xyXG5cdFx0XHRpZiAoJDEubWF0Y2goL14oW2Etel0rOnxcXC8pLykpIHJldHVybiAkMDtcclxuXHRcdFx0YmFzZSA9IGJhc2UucmVwbGFjZSgvXFw/LiovLCcnKTtcclxuXHRcdFx0cmV0dXJuICd1cmwoJysgYmFzZSArICcuLy4uLycgKyAkMSArJyknO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHQvLyBpZSBoYXMgYSBidWcsIHdoZXJlIHVua25vd24gcHJvcGVydGllcyBhdCBwc2V1ZG8tc2VsZWN0b3JzIGFyZSBjb21wdXRlZCBhdCB0aGUgZWxlbWVudFxyXG5cdC8vICNlbDo6YWZ0ZXIgeyAtY29udGVudDoneCc7IH0gPT4gZ2V0Q29tcHV0ZWRTdHlsZShlbClbJy1jb250ZW50J10gPT0gJ3gnXHJcblx0Ly8gc2hvdWxkIHdlIGFkZCBzb21ldGhpbmcgbGlrZSAtaWVWYXItcHNldWRvX2FmdGVyLWNvbnRlbnQ6J3gnP1xyXG5cdGZ1bmN0aW9uIHJld3JpdGVDc3MoY3NzKSB7XHJcblxyXG5cdFx0LyogdW5jb21tZW50IGlmIHNwZWMgZmluaXNoZWQgYW5kIG5lZWRlZCBieSBzb21lb25lXHJcblx0XHRjc3MgPSBjc3MucmVwbGFjZSgvQHByb3BlcnR5IChbXntdKyl7KFtefV0rKX0vLCBmdW5jdGlvbigkMCwgcHJvcCwgYm9keSl7XHJcblx0XHRcdHByb3AgPSBwcm9wLnRyaW0oKTtcclxuXHRcdFx0Y29uc3QgZGVjbGFyYXRpb24gPSB7bmFtZTpwcm9wfTtcclxuXHRcdFx0Ym9keS5zcGxpdCgnOycpLmZvckVhY2goZnVuY3Rpb24ocGFpcil7XHJcblx0XHRcdFx0Y29uc3QgeCA9IHBhaXIuc3BsaXQoJzonKTtcclxuXHRcdFx0XHRpZiAoeFsxXSkgZGVjbGFyYXRpb25bIHhbMF0udHJpbSgpIF0gPSB4WzFdO1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0ZGVjbGFyYXRpb25bJ2luaGVyaXRzJ10gPSBkZWNsYXJhdGlvblsnaW5oZXJpdHMnXS50cmltKCk9PT0ndHJ1ZScgPyB0cnVlIDogZmFsc2U7XHJcblx0XHRcdGRlY2xhcmF0aW9uWydpbml0aWFsVmFsdWUnXSA9IGRlY2xhcmF0aW9uWydpbml0aWFsLXZhbHVlJ107XHJcblx0XHRcdENTUy5yZWdpc3RlclByb3BlcnR5KGRlY2xhcmF0aW9uKVxyXG5cdFx0XHRyZXR1cm4gJy8qXFxuIEBwcm9wZXJ0eSAuLi4gcmVtb3ZlZCBcXG4qJysnLyc7XHJcblx0XHR9KTtcclxuXHRcdCovXHJcblx0XHRyZXR1cm4gY3NzLnJlcGxhY2UocmVnRmluZFNldHRlcnMsIGZ1bmN0aW9uKCQwLCAkMSwgJDIsICQzLCAkNCwgaW1wb3J0YW50KXtcclxuXHRcdFx0cmV0dXJuICQxKyctaWUtJysoaW1wb3J0YW50PyfinZcnOicnKSskMysnOicrZW5jb2RlVmFsdWUoJDQpO1xyXG5cdFx0fSkucmVwbGFjZShyZWdGaW5kR2V0dGVycywgZnVuY3Rpb24oJDAsICQxLCAkMiwgaW1wb3J0YW50KXtcclxuXHRcdFx0cmV0dXJuICQxKyctaWVWYXItJysoaW1wb3J0YW50PyfinZcnOicnKSskMisnOyAnKyQyOyAvLyBrZWVwIHRoZSBvcmlnaW5hbCwgc28gY2hhaW5pbmcgd29ya3MgXCItLXg6dmFyKC0teSlcIlxyXG5cdFx0fSk7XHJcblx0fVxyXG5cdGZ1bmN0aW9uIGVuY29kZVZhbHVlKHZhbHVlKXtcclxuXHRcdHJldHVybiB2YWx1ZTtcclxuXHRcdHJldHVybiB2YWx1ZS5yZXBsYWNlKC8gL2csJ+KQoycpO1xyXG5cdH1cclxuXHRjb25zdCBrZXl3b3JkcyA9IHtpbml0aWFsOjEsaW5oZXJpdDoxLHJldmVydDoxLHVuc2V0OjF9O1xyXG5cdGZ1bmN0aW9uIGRlY29kZVZhbHVlKHZhbHVlKXtcclxuXHRcdHJldHVybiB2YWx1ZTtcclxuXHRcdGlmICh2YWx1ZT09PXVuZGVmaW5lZCkgcmV0dXJuO1xyXG5cdFx0dmFsdWUgPSAgdmFsdWUucmVwbGFjZSgv4pCjL2csJyAnKTtcclxuXHRcdGNvbnN0IHRyaW1tZWQgPSB2YWx1ZS50cmltKCk7XHJcblx0XHRpZiAoa2V5d29yZHNbdHJpbW1lZF0pIHJldHVybiB0cmltbWVkO1xyXG5cdFx0cmV0dXJuIHZhbHVlO1xyXG5cdH1cclxuXHJcblx0Ly8gYmV0YVxyXG5cdGNvbnN0IHN0eWxlc19vZl9nZXR0ZXJfcHJvcGVydGllcyA9IHt9O1xyXG5cclxuXHRmdW5jdGlvbiBwYXJzZVJld3JpdHRlblN0eWxlKHN0eWxlKSB7IC8vIGxlc3MgbWVtb3J5IHRoZW4gcGFyYW1ldGVyIGNzc1RleHQ/XHJcblxyXG5cdFx0Ly8gYmV0YVxyXG5cdFx0c3R5bGVbJ3otaW5kZXgnXTsgLy8gaWUxMSBjYW4gYWNjZXNzIHVua25vd24gcHJvcGVydGllcyBpbiBzdHlsZXNoZWV0cyBvbmx5IGlmIGFjY2Vzc2VkIGEgZGFzaGVkIGtub3duIHByb3BlcnR5XHJcblxyXG5cdFx0Y29uc3QgY3NzVGV4dCA9IHN0eWxlLmNzc1RleHQ7XHJcblx0XHR2YXIgbWF0Y2hlc0dldHRlcnMgPSBjc3NUZXh0Lm1hdGNoKHJlZ1J1bGVJRUdldHRlcnMpLCBqLCBtYXRjaDtcclxuXHRcdGlmIChtYXRjaGVzR2V0dGVycykge1xyXG5cdFx0XHR2YXIgZ2V0dGVycyA9IFtdOyAvLyBlZy4gW2JvcmRlcixjb2xvcl1cclxuXHRcdFx0Zm9yIChqID0gMDsgbWF0Y2ggPSBtYXRjaGVzR2V0dGVyc1tqKytdOykge1xyXG5cdFx0XHRcdGxldCBwcm9wTmFtZSA9IG1hdGNoLnNsaWNlKDcsIC0xKTtcclxuXHRcdFx0XHRpZiAocHJvcE5hbWVbMF0gPT09ICfinZcnKSBwcm9wTmFtZSA9IHByb3BOYW1lLnN1YnN0cigxKTtcclxuXHRcdFx0XHRnZXR0ZXJzLnB1c2gocHJvcE5hbWUpO1xyXG5cclxuXHRcdFx0XHQvLyBiZXRhXHJcblx0XHRcdFx0aWYgKCFzdHlsZXNfb2ZfZ2V0dGVyX3Byb3BlcnRpZXNbcHJvcE5hbWVdKSBzdHlsZXNfb2ZfZ2V0dGVyX3Byb3BlcnRpZXNbcHJvcE5hbWVdID0gW107XHJcblx0XHRcdFx0c3R5bGVzX29mX2dldHRlcl9wcm9wZXJ0aWVzW3Byb3BOYW1lXS5wdXNoKHN0eWxlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0dmFyIG1hdGNoZXNTZXR0ZXJzID0gY3NzVGV4dC5tYXRjaChyZWdSdWxlSUVTZXR0ZXJzKTtcclxuXHRcdGlmIChtYXRjaGVzU2V0dGVycykge1xyXG5cdFx0XHR2YXIgc2V0dGVycyA9IHt9OyAvLyBlZy4gWy0tY29sb3I6I2ZmZiwgLS1wYWRkaW5nOjEwcHhdO1xyXG5cdFx0XHRmb3IgKGogPSAwOyBtYXRjaCA9IG1hdGNoZXNTZXR0ZXJzW2orK107KSB7XHJcblx0XHRcdFx0bGV0IHggPSBtYXRjaC5zdWJzdHIoNCkuc3BsaXQoJzonKTtcclxuXHRcdFx0XHRsZXQgcHJvcE5hbWUgPSB4WzBdO1xyXG5cdFx0XHRcdGxldCBwcm9wVmFsdWUgPSB4WzFdO1xyXG5cdFx0XHRcdGlmIChwcm9wTmFtZVswXSA9PT0gJ+KdlycpIHByb3BOYW1lID0gcHJvcE5hbWUuc3Vic3RyKDEpO1xyXG5cdFx0XHRcdHNldHRlcnNbcHJvcE5hbWVdID0gcHJvcFZhbHVlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4ge2dldHRlcnM6Z2V0dGVycywgc2V0dGVyczpzZXR0ZXJzfTtcclxuXHR9XHJcblx0ZnVuY3Rpb24gYWN0aXZhdGVTdHlsZUVsZW1lbnQoc3R5bGUsIGNzcykge1xyXG5cdFx0c3R5bGUuaW5uZXJIVE1MID0gY3NzO1xyXG5cdFx0c3R5bGUuaWVDUF9wb2x5ZmlsbGVkID0gdHJ1ZTtcclxuXHRcdHZhciBydWxlcyA9IHN0eWxlLnNoZWV0LnJ1bGVzLCBpPTAsIHJ1bGU7IC8vIGNzc1J1bGVzID0gQ1NTUnVsZUxpc3QsIHJ1bGVzID0gTVNDU1NSdWxlTGlzdFxyXG5cdFx0d2hpbGUgKHJ1bGUgPSBydWxlc1tpKytdKSB7XHJcblx0XHRcdGNvbnN0IGZvdW5kID0gcGFyc2VSZXdyaXR0ZW5TdHlsZShydWxlLnN0eWxlKTtcclxuXHRcdFx0aWYgKGZvdW5kLmdldHRlcnMpIHtcclxuXHRcdFx0XHRhZGRHZXR0ZXJzU2VsZWN0b3IocnVsZS5zZWxlY3RvclRleHQsIGZvdW5kLmdldHRlcnMpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChmb3VuZC5zZXR0ZXJzKSB7XHJcblx0XHRcdFx0d2luZG93LmNzc1ZhcmlhYmxlc1tydWxlLnNlbGVjdG9yVGV4dF0gPSBPYmplY3Qua2V5cyhmb3VuZC5zZXR0ZXJzKS5yZWR1Y2UoKGFjYywgY3NzVmFyaWFibGUpID0+IHtcclxuXHRcdFx0XHRcdGlmICghZm91bmQuc2V0dGVyc1tjc3NWYXJpYWJsZV0uaW5jbHVkZXMoXCJ2YXIoLS1cIikpIGFjY1soJy0tJyArIGNzc1ZhcmlhYmxlKS50cmltKCldID0gZm91bmQuc2V0dGVyc1tjc3NWYXJpYWJsZV0udHJpbSgpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIGFjYztcclxuXHRcdFx0XHR9LCB7fSk7XHJcblx0XHRcdFx0YWRkU2V0dGVyc1NlbGVjdG9yKHJ1bGUuc2VsZWN0b3JUZXh0LCBmb3VuZC5zZXR0ZXJzKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gbWVkaWFRdWVyaWVzOiByZWRyYXcgdGhlIGhvbGUgZG9jdW1lbnRcclxuXHRcdFx0Ly8gYmV0dGVyIGFkZCBldmVudHMgZm9yIGVhY2ggZWxlbWVudD9cclxuXHRcdFx0Y29uc3QgbWVkaWEgPSBydWxlLnBhcmVudFJ1bGUgJiYgcnVsZS5wYXJlbnRSdWxlLm1lZGlhICYmIHJ1bGUucGFyZW50UnVsZS5tZWRpYS5tZWRpYVRleHQ7XHJcblx0XHRcdGlmIChtZWRpYSAmJiAoZm91bmQuZ2V0dGVycyB8fCBmb3VuZC5zZXR0ZXJzKSkge1xyXG5cdFx0XHRcdG1hdGNoTWVkaWEobWVkaWEpLmFkZExpc3RlbmVyKGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRkcmF3VHJlZShkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpXHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGJldGFcclxuXHRcdHJlZHJhd1N0eWxlU2hlZXRzKClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGFkZEdldHRlcnNTZWxlY3RvcihzZWxlY3RvciwgcHJvcGVydGllcykge1xyXG5cdFx0c2VsZWN0b3JBZGRQc2V1ZG9MaXN0ZW5lcnMoc2VsZWN0b3IpO1xyXG5cdFx0b25FbGVtZW50KHVuUHNldWRvKHNlbGVjdG9yKSwgZnVuY3Rpb24gKGVsKSB7XHJcblx0XHRcdGFkZEdldHRlckVsZW1lbnQoZWwsIHByb3BlcnRpZXMsIHNlbGVjdG9yKTtcclxuXHRcdFx0ZHJhd0VsZW1lbnQoZWwpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdGZ1bmN0aW9uIGFkZEdldHRlckVsZW1lbnQoZWwsIHByb3BlcnRpZXMsIHNlbGVjdG9yKSB7XHJcblx0XHR2YXIgaT0wLCBwcm9wLCBqO1xyXG5cdFx0Y29uc3Qgc2VsZWN0b3JzID0gc2VsZWN0b3Iuc3BsaXQoJywnKTsgLy8gc3BsaXQgZ3JvdXBlZCBzZWxlY3RvcnNcclxuXHRcdGVsLnNldEF0dHJpYnV0ZSgnaWVjcC1uZWVkZWQnLCB0cnVlKTtcclxuXHRcdGlmICghZWwuaWVDUFNlbGVjdG9ycykgZWwuaWVDUFNlbGVjdG9ycyA9IHt9O1xyXG5cdFx0d2hpbGUgKHByb3AgPSBwcm9wZXJ0aWVzW2krK10pIHtcclxuXHRcdFx0Zm9yIChqID0gMDsgc2VsZWN0b3IgPSBzZWxlY3RvcnNbaisrXTspIHtcclxuXHRcdFx0XHRjb25zdCBwYXJ0cyA9IHNlbGVjdG9yLnRyaW0oKS5zcGxpdCgnOjonKTtcclxuXHRcdFx0XHRpZiAoIWVsLmllQ1BTZWxlY3RvcnNbcHJvcF0pIGVsLmllQ1BTZWxlY3RvcnNbcHJvcF0gPSBbXTtcclxuXHRcdFx0XHRlbC5pZUNQU2VsZWN0b3JzW3Byb3BdLnB1c2goe1xyXG5cdFx0XHRcdFx0c2VsZWN0b3I6IHBhcnRzWzBdLFxyXG5cdFx0XHRcdFx0cHNldWRvOiBwYXJ0c1sxXSA/ICc6OicgKyBwYXJ0c1sxXSA6ICcnXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0ZnVuY3Rpb24gYWRkU2V0dGVyc1NlbGVjdG9yKHNlbGVjdG9yLCBwcm9wVmFscykge1xyXG5cdFx0c2VsZWN0b3JBZGRQc2V1ZG9MaXN0ZW5lcnMoc2VsZWN0b3IpO1xyXG5cdFx0b25FbGVtZW50KHVuUHNldWRvKHNlbGVjdG9yKSwgZnVuY3Rpb24gKGVsKSB7XHJcblx0XHRcdGFkZFNldHRlckVsZW1lbnQoZWwsIHByb3BWYWxzKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRmdW5jdGlvbiBhZGRTZXR0ZXJFbGVtZW50KGVsLCBwcm9wVmFscykge1xyXG5cdFx0aWYgKCFlbC5pZUNQX3NldHRlcnMpIGVsLmllQ1Bfc2V0dGVycyA9IHt9O1xyXG5cdFx0Zm9yICh2YXIgcHJvcCBpbiBwcm9wVmFscykgeyAvLyBlZy4ge2ZvbzojZmZmLCBiYXI6YmF6fVxyXG5cdFx0XHRlbC5pZUNQX3NldHRlcnNbJy0tJyArIHByb3BdID0gMTtcclxuXHRcdH1cclxuXHRcdGRyYXdUcmVlKGVsKTtcclxuXHR9XHJcblxyXG5cdC8vYmV0YVxyXG5cdGZ1bmN0aW9uIHJlZHJhd1N0eWxlU2hlZXRzKCkge1xyXG5cdFx0Zm9yICh2YXIgcHJvcCBpbiBzdHlsZXNfb2ZfZ2V0dGVyX3Byb3BlcnRpZXMpIHtcclxuXHRcdFx0bGV0IHN0eWxlcyA9IHN0eWxlc19vZl9nZXR0ZXJfcHJvcGVydGllc1twcm9wXTtcclxuXHRcdFx0Zm9yICh2YXIgaT0wLCBzdHlsZTsgc3R5bGU9c3R5bGVzW2krK107KSB7XHJcblx0XHRcdFx0aWYgKHN0eWxlLm93bmluZ0VsZW1lbnQpIGNvbnRpbnVlO1xyXG5cdFx0XHRcdHZhciB2YWx1ZSA9IHN0eWxlWyctaWVWYXItJytwcm9wXTtcclxuXHRcdFx0XHRpZiAoIXZhbHVlKSBjb250aW51ZTtcclxuXHRcdFx0XHR2YWx1ZSA9IHN0eWxlQ29tcHV0ZVZhbHVlV2lkdGhWYXJzKGdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSwgdmFsdWUpO1xyXG5cdFx0XHRcdGlmICh2YWx1ZSA9PT0gJycpIGNvbnRpbnVlO1xyXG5cdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRzdHlsZVtwcm9wXSA9IHZhbHVlO1xyXG5cdFx0XHRcdH0gY2F0Y2goZSkge31cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblxyXG5cdGNvbnN0IHBzZXVkb3MgPSB7XHJcblx0XHRob3Zlcjp7XHJcblx0XHRcdG9uOidtb3VzZWVudGVyJyxcclxuXHRcdFx0b2ZmOidtb3VzZWxlYXZlJ1xyXG5cdFx0fSxcclxuXHRcdGZvY3VzOntcclxuXHRcdFx0b246J2ZvY3VzaW4nLFxyXG5cdFx0XHRvZmY6J2ZvY3Vzb3V0J1xyXG5cdFx0fSxcclxuXHRcdGFjdGl2ZTp7XHJcblx0XHRcdG9uOidDU1NBY3RpdmF0ZScsXHJcblx0XHRcdG9mZjonQ1NTRGVhY3RpdmF0ZSdcclxuXHRcdH0sXHJcblx0fTtcclxuXHRmdW5jdGlvbiBzZWxlY3RvckFkZFBzZXVkb0xpc3RlbmVycyhzZWxlY3Rvcil7XHJcblx0XHQvLyBpZTExIGhhcyB0aGUgc3RyYW5nZSBiZWhhdm9pciwgdGhhdCBncm91cHMgb2Ygc2VsZWN0b3JzIGFyZSBpbmRpdmlkdWFsIHJ1bGVzLCBidXQgc3RhcnRpbmcgd2l0aCB0aGUgZnVsbCBzZWxlY3RvcjpcclxuXHRcdC8vIHRkLCB0aCwgYnV0dG9uIHsgY29sb3I6cmVkIH0gcmVzdWx0cyBpbiB0aGlzIHJ1bGVzOlxyXG5cdFx0Ly8gXCJ0ZCwgdGgsIGJ1dHRvblwiIHwgXCJ0aCwgdGhcIiB8IFwidGhcIlxyXG5cdFx0c2VsZWN0b3IgPSBzZWxlY3Rvci5zcGxpdCgnLCcpWzBdO1xyXG5cdFx0Zm9yICh2YXIgcHNldWRvIGluIHBzZXVkb3MpIHtcclxuXHRcdFx0dmFyIHBhcnRzID0gc2VsZWN0b3Iuc3BsaXQoJzonK3BzZXVkbyk7XHJcblx0XHRcdGlmIChwYXJ0cy5sZW5ndGggPiAxKSB7XHJcblx0XHRcdFx0dmFyIGVuZGluZyA9IHBhcnRzWzFdLm1hdGNoKC9eW15cXHNdKi8pOyAvLyBlbmRpbmcgZWxlbWVudHBhcnQgb2Ygc2VsZWN0b3IgKHVzZWQgZm9yIG5vdCg6YWN0aXZlKSlcclxuXHRcdFx0XHRsZXQgc2VsID0gdW5Qc2V1ZG8ocGFydHNbMF0rZW5kaW5nKTtcclxuXHRcdFx0XHRjb25zdCBsaXN0ZW5lcnMgPSBwc2V1ZG9zW3BzZXVkb107XHJcblx0XHRcdFx0b25FbGVtZW50KHNlbCwgZnVuY3Rpb24gKGVsKSB7XHJcblx0XHRcdFx0XHRlbC5hZGRFdmVudExpc3RlbmVyKGxpc3RlbmVycy5vbiwgZHJhd1RyZWVFdmVudCk7XHJcblx0XHRcdFx0XHRlbC5hZGRFdmVudExpc3RlbmVyKGxpc3RlbmVycy5vZmYsIGRyYXdUcmVlRXZlbnQpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdGxldCBDU1NBY3RpdmUgPSBudWxsO1xyXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsZnVuY3Rpb24oZSl7XHJcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmIChlLnRhcmdldCA9PT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkge1xyXG5cdFx0XHRcdHZhciBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcclxuXHRcdFx0XHRldnQuaW5pdEV2ZW50KCdDU1NBY3RpdmF0ZScsIHRydWUsIHRydWUpO1xyXG5cdFx0XHRcdENTU0FjdGl2ZSA9IGUudGFyZ2V0O1xyXG5cdFx0XHRcdENTU0FjdGl2ZS5kaXNwYXRjaEV2ZW50KGV2dCk7XHJcblx0XHRcdH1cclxuXHRcdH0pXHJcblx0fSk7XHJcblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsZnVuY3Rpb24oKXtcclxuXHRcdGlmIChDU1NBY3RpdmUpIHtcclxuXHRcdFx0dmFyIGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdFdmVudCcpO1xyXG5cdFx0XHRldnQuaW5pdEV2ZW50KCdDU1NEZWFjdGl2YXRlJywgdHJ1ZSwgdHJ1ZSk7XHJcblx0XHRcdENTU0FjdGl2ZS5kaXNwYXRjaEV2ZW50KGV2dCk7XHJcblx0XHRcdENTU0FjdGl2ZSA9IG51bGw7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdGZ1bmN0aW9uIHVuUHNldWRvKHNlbGVjdG9yKXtcclxuXHRcdHJldHVybiBzZWxlY3Rvci5yZXBsYWNlKHJlZ1BzZXVkb3MsJycpLnJlcGxhY2UoJzpub3QoKScsJycpO1xyXG5cdH1cclxuXHJcblx0dmFyIHVuaXF1ZUNvdW50ZXIgPSAwO1xyXG5cclxuXHQvKiBvbGQgKlxyXG5cdGZ1bmN0aW9uIF9kcmF3RWxlbWVudChlbCkge1xyXG5cdFx0aWYgKCFlbC5pZUNQX3VuaXF1ZSkgeyAvLyB1c2UgZWwudW5pcXVlTnVtYmVyPyBidXQgbmVlZHMgY2xhc3MgZm9yIHRoZSBjc3Mtc2VsZWN0b3IgPT4gdGVzdCBwZXJmb3JtYW5jZVxyXG5cdFx0XHRlbC5pZUNQX3VuaXF1ZSA9ICsrdW5pcXVlQ291bnRlcjtcclxuXHRcdFx0ZWwuY2xhc3NMaXN0LmFkZCgnaWVjcC11JyArIGVsLmllQ1BfdW5pcXVlKTtcclxuXHRcdH1cclxuXHRcdHZhciBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoZWwpO1xyXG5cdFx0aWYgKGVsLmllQ1Bfc2hlZXQpIHdoaWxlIChlbC5pZUNQX3NoZWV0LnJ1bGVzWzBdKSBlbC5pZUNQX3NoZWV0LmRlbGV0ZVJ1bGUoMCk7XHJcblx0XHRmb3IgKHZhciBwcm9wIGluIGVsLmllQ1BTZWxlY3RvcnMpIHtcclxuXHRcdFx0dmFyIGltcG9ydGFudCA9IHN0eWxlWyctaWVWYXIt4p2XJyArIHByb3BdO1xyXG5cdFx0XHRsZXQgdmFsdWVXaXRoVmFyID0gaW1wb3J0YW50IHx8IHN0eWxlWyctaWVWYXItJyArIHByb3BdO1xyXG5cdFx0XHRpZiAoIXZhbHVlV2l0aFZhcikgY29udGludWU7IC8vIHRvZG8sIHdoYXQgaWYgJzAnXHJcblxyXG5cdFx0XHR2YXIgZGV0YWlscyA9IHt9O1xyXG5cdFx0XHR2YXIgdmFsdWUgPSBzdHlsZUNvbXB1dGVWYWx1ZVdpZHRoVmFycyhzdHlsZSwgdmFsdWVXaXRoVmFyLCBkZXRhaWxzKTtcclxuXHJcblx0XHRcdGlmIChpbXBvcnRhbnQpIHZhbHVlICs9ICcgIWltcG9ydGFudCc7XHJcblx0XHRcdGZvciAodmFyIGk9MCwgaXRlbTsgaXRlbT1lbC5pZUNQU2VsZWN0b3JzW3Byb3BdW2krK107KSB7IC8vIHRvZG86IHNwbGl0IGFuZCB1c2UgcmVxdWVzdEFuaW1hdGlvbkZyYW1lP1xyXG5cdFx0XHRcdGlmIChpdGVtLnNlbGVjdG9yID09PSAnJXN0eWxlQXR0cicpIHtcclxuXHRcdFx0XHRcdGVsLnN0eWxlW3Byb3BdID0gdmFsdWU7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdFx0XHQvLyBiZXRhXHJcblx0XHRcdFx0XHRpZiAoIWltcG9ydGFudCAmJiBkZXRhaWxzLmFsbEJ5Um9vdCAhPT0gZmFsc2UpIGNvbnRpbnVlOyAvLyBkb250IGhhdmUgdG8gZHJhdyByb290LXByb3BlcnRpZXNcclxuXHJcblx0XHRcdFx0XHQvL2xldCBzZWxlY3RvciA9IGl0ZW0uc2VsZWN0b3IucmVwbGFjZSgvPj8gXFwuW14gXSsvLCAnICcsIGl0ZW0uc2VsZWN0b3IpOyAvLyB0b2RvOiB0cnkgdG8gZXF1YWxpemUgc3BlY2lmaWNpdHlcclxuXHRcdFx0XHRcdGxldCBzZWxlY3RvciA9IGl0ZW0uc2VsZWN0b3I7XHJcblx0XHRcdFx0XHRlbGVtZW50U3R5bGVTaGVldChlbCkuaW5zZXJ0UnVsZShzZWxlY3RvciArICcuaWVjcC11JyArIGVsLmllQ1BfdW5pcXVlICsgaXRlbS5wc2V1ZG8gKyAnIHsnICsgcHJvcCArICc6JyArIHZhbHVlICsgJ30nLCAwKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0ZnVuY3Rpb24gZWxlbWVudFN0eWxlU2hlZXQoZWwpe1xyXG5cdFx0aWYgKCFlbC5pZUNQX3NoZWV0KSB7XHJcblx0XHRcdGNvbnN0IHN0eWxlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xyXG5cdFx0XHRzdHlsZUVsLmllQ1BfZWxlbWVudFNoZWV0ID0gMTtcclxuXHRcdFx0Ly9lbC5hcHBlbmRDaGlsZChzdHlsZUVsKTsgLy8geWVzISBzZWxmLWNsb3NpbmcgdGFncyBjYW4gaGF2ZSBzdHlsZSBhcyBjaGlsZHJlbiwgYnV0IC0gaWYgaSBzZXQgaW5uZXJIVE1MLCB0aGUgc3R5bGVzaGVldCBpcyBsb3N0XHJcblx0XHRcdGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbCk7XHJcblx0XHRcdGVsLmllQ1Bfc2hlZXQgPSBzdHlsZUVsLnNoZWV0O1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGVsLmllQ1Bfc2hlZXQ7XHJcblx0fVxyXG5cclxuXHQvKiAqL1xyXG5cdGZ1bmN0aW9uIF9kcmF3RWxlbWVudChlbCkge1xyXG5cdFx0aWYgKCFlbC5pZUNQX3VuaXF1ZSkgeyAvLyB1c2UgZWwudW5pcXVlTnVtYmVyPyBidXQgbmVlZHMgY2xhc3MgZm9yIHRoZSBjc3Mtc2VsZWN0b3IgPT4gdGVzdCBwZXJmb3JtYW5jZVxyXG5cdFx0XHRlbC5pZUNQX3VuaXF1ZSA9ICsrdW5pcXVlQ291bnRlcjtcclxuXHRcdFx0ZWwuY2xhc3NMaXN0LmFkZCgnaWVjcC11JyArIGVsLmllQ1BfdW5pcXVlKTtcclxuXHRcdH1cclxuXHRcdHZhciBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoZWwpO1xyXG5cdFx0bGV0IGNzcyA9ICcnO1xyXG5cdFx0Zm9yICh2YXIgcHJvcCBpbiBlbC5pZUNQU2VsZWN0b3JzKSB7XHJcblx0XHRcdHZhciBpbXBvcnRhbnQgPSBzdHlsZVsnLWllVmFyLeKdlycgKyBwcm9wXTtcclxuXHRcdFx0bGV0IHZhbHVlV2l0aFZhciA9IGltcG9ydGFudCB8fCBzdHlsZVsnLWllVmFyLScgKyBwcm9wXTtcclxuXHRcdFx0aWYgKCF2YWx1ZVdpdGhWYXIpIGNvbnRpbnVlOyAvLyB0b2RvLCB3aGF0IGlmICcwJ1xyXG5cdFx0XHR2YXIgZGV0YWlscyA9IHt9O1xyXG5cdFx0XHR2YXIgdmFsdWUgPSBzdHlsZUNvbXB1dGVWYWx1ZVdpZHRoVmFycyhzdHlsZSwgdmFsdWVXaXRoVmFyLCBkZXRhaWxzKTtcclxuXHRcdFx0Ly9pZiAodmFsdWU9PT0naW5pdGlhbCcpIHZhbHVlID0gaW5pdGlhbHNbcHJvcF07XHJcblx0XHRcdGlmIChpbXBvcnRhbnQpIHZhbHVlICs9ICcgIWltcG9ydGFudCc7XHJcblx0XHRcdGZvciAodmFyIGk9MCwgaXRlbTsgaXRlbT1lbC5pZUNQU2VsZWN0b3JzW3Byb3BdW2krK107KSB7XHJcblx0XHRcdFx0Ly8gdG9kbzogc3BsaXQgYW5kIHVzZSByZXF1ZXN0QW5pbWF0aW9uRnJhbWU/XHJcblx0XHRcdFx0aWYgKGl0ZW0uc2VsZWN0b3IgPT09ICclc3R5bGVBdHRyJykge1xyXG5cdFx0XHRcdFx0ZWwuc3R5bGVbcHJvcF0gPSB2YWx1ZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHRcdC8vIGJldGFcclxuXHRcdFx0XHRcdGlmICghaW1wb3J0YW50ICYmIGRldGFpbHMuYWxsQnlSb290ICE9PSBmYWxzZSkgY29udGludWU7IC8vIGRvbnQgaGF2ZSB0byBkcmF3IHJvb3QtcHJvcGVydGllc1xyXG5cclxuXHRcdFx0XHRcdC8vbGV0IHNlbGVjdG9yID0gaXRlbS5zZWxlY3Rvci5yZXBsYWNlKC8+PyBcXC5bXiBdKy8sICcgJywgaXRlbS5zZWxlY3Rvcik7IC8vIHRvZG86IHRyeSB0byBlcXVhbGl6ZSBzcGVjaWZpY2l0eVxyXG5cdFx0XHRcdFx0bGV0IHNlbGVjdG9yID0gaXRlbS5zZWxlY3RvcjtcclxuXHRcdFx0XHRcdGNzcyArPSBzZWxlY3RvciArICcuaWVjcC11JyArIGVsLmllQ1BfdW5pcXVlICsgaXRlbS5wc2V1ZG8gKyAneycgKyBwcm9wICsgJzonICsgdmFsdWUgKyAnfVxcbic7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbGVtZW50U2V0Q3NzKGVsLCBjc3MpO1xyXG5cdH1cclxuXHRmdW5jdGlvbiBlbGVtZW50U2V0Q3NzKGVsLCBjc3Mpe1xyXG5cdFx0aWYgKCFlbC5pZUNQX3N0eWxlRWwgJiYgY3NzKSB7XHJcblx0XHRcdGNvbnN0IHN0eWxlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xyXG5cdFx0XHRzdHlsZUVsLmllQ1BfZWxlbWVudFNoZWV0ID0gMTtcclxuXHRcdFx0Ly9lbC5hcHBlbmRDaGlsZChzdHlsZUVsKTsgLy8geWVzISBzZWxmLWNsb3NpbmcgdGFncyBjYW4gaGF2ZSBzdHlsZSBhcyBjaGlsZHJlbiwgYnV0IC0gaWYgaSBzZXQgaW5uZXJIVE1MLCB0aGUgc3R5bGVzaGVldCBpcyBsb3N0XHJcblx0XHRcdGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbCk7XHJcblx0XHRcdGVsLmllQ1Bfc3R5bGVFbCA9IHN0eWxlRWw7XHJcblx0XHR9XHJcblx0XHRpZiAoZWwuaWVDUF9zdHlsZUVsKSB7XHJcblx0XHRcdGVsLmllQ1Bfc3R5bGVFbC5pbm5lckhUTUwgPSBjc3M7XHJcblx0XHR9XHJcblx0fVxyXG5cdC8qICovXHJcblxyXG5cdGZ1bmN0aW9uIGRyYXdUcmVlKHRhcmdldCkge1xyXG5cdFx0aWYgKCF0YXJnZXQpIHJldHVybjtcclxuXHRcdHZhciBlbHMgPSB0YXJnZXQucXVlcnlTZWxlY3RvckFsbCgnW2llY3AtbmVlZGVkXScpO1xyXG5cdFx0aWYgKHRhcmdldC5oYXNBdHRyaWJ1dGUgJiYgdGFyZ2V0Lmhhc0F0dHJpYnV0ZSgnaWVjcC1uZWVkZWQnKSkgZHJhd0VsZW1lbnQodGFyZ2V0KTsgLy8gc2VsZlxyXG5cdFx0Zm9yICh2YXIgaSA9IDAsIGVsOyBlbCA9IGVsc1tpKytdOykge1xyXG5cdFx0XHRkcmF3RWxlbWVudChlbCk7IC8vIHRyZWVcclxuXHRcdH1cclxuXHR9XHJcblx0Ly8gZHJhdyBxdWV1ZVxyXG5cdGxldCBkcmF3UXVldWUgPSBuZXcgU2V0KCk7XHJcblx0bGV0IGNvbGxlY3RpbmcgPSBmYWxzZTtcclxuXHRsZXQgZHJhd2luZyA9IGZhbHNlO1xyXG5cdGZ1bmN0aW9uIGRyYXdFbGVtZW50KGVsKXtcclxuXHRcdGRyYXdRdWV1ZS5hZGQoZWwpO1xyXG5cdFx0aWYgKGNvbGxlY3RpbmcpIHJldHVybjtcclxuXHRcdGNvbGxlY3RpbmcgPSB0cnVlO1xyXG5cdFx0cmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uKCl7XHJcblx0XHQvL3NldEltbWVkaWF0ZShmdW5jdGlvbigpe1xyXG5cdFx0XHRjb2xsZWN0aW5nID0gZmFsc2U7XHJcblx0XHRcdGRyYXdpbmcgPSB0cnVlO1xyXG5cdFx0XHRkcmF3UXVldWUuZm9yRWFjaChfZHJhd0VsZW1lbnQpO1xyXG5cdFx0XHRkcmF3UXVldWUuY2xlYXIoKTtcclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpeyAvLyBtdXRhdGlvbk9ic2VydmVyIHdpbGwgdHJpZ2dlciBkZWxheWVkLCByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgd2lsbCBtaXNzIHNvbWUgY2hhbmdlc1xyXG5cdFx0XHRcdGRyYXdpbmcgPSBmYWxzZTtcclxuXHRcdFx0fSlcclxuXHRcdH0pXHJcblx0fVxyXG5cclxuXHJcblx0ZnVuY3Rpb24gZHJhd1RyZWVFdmVudChlKSB7XHJcblx0XHRkcmF3VHJlZShlLnRhcmdldClcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGZpbmRWYXJzKHN0ciwgY2IpeyAvLyBjc3MgdmFsdWUgcGFyc2VyXHJcblx0XHRsZXQgbGV2ZWw9MCwgb3BlbmVkTGV2ZWw9bnVsbCwgbGFzdFBvaW50PTAsIG5ld1N0ciA9ICcnLCBpPTAsIGNoYXIsIGluc2lkZUNhbGM7XHJcblx0XHR3aGlsZSAoY2hhcj1zdHJbaSsrXSkge1xyXG5cdFx0XHRpZiAoY2hhciA9PT0gJygnKSB7XHJcblx0XHRcdFx0KytsZXZlbDtcclxuXHRcdFx0XHRpZiAob3BlbmVkTGV2ZWwgPT09IG51bGwgJiYgc3RyW2ktNF0rc3RyW2ktM10rc3RyW2ktMl0gPT09ICd2YXInKSB7XHJcblx0XHRcdFx0XHRvcGVuZWRMZXZlbCA9IGxldmVsO1xyXG5cdFx0XHRcdFx0bmV3U3RyICs9IHN0ci5zdWJzdHJpbmcobGFzdFBvaW50LCBpLTQpO1xyXG5cdFx0XHRcdFx0bGFzdFBvaW50ID0gaTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKHN0cltpLTVdK3N0cltpLTRdK3N0cltpLTNdK3N0cltpLTJdID09PSAnY2FsYycpIHtcclxuXHRcdFx0XHRcdGluc2lkZUNhbGMgPSBsZXZlbDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGNoYXIgPT09ICcpJyAmJiBvcGVuZWRMZXZlbCA9PT0gbGV2ZWwpIHtcclxuXHRcdFx0XHRsZXQgdmFyaWFibGUgPSBzdHIuc3Vic3RyaW5nKGxhc3RQb2ludCwgaS0xKS50cmltKCksIGZhbGxiYWNrO1xyXG5cdFx0XHRcdGxldCB4ID0gdmFyaWFibGUuaW5kZXhPZignLCcpO1xyXG5cdFx0XHRcdGlmICh4IT09LTEpIHtcclxuXHRcdFx0XHRcdGZhbGxiYWNrID0gdmFyaWFibGUuc2xpY2UoeCsxKTtcclxuXHRcdFx0XHRcdHZhcmlhYmxlID0gdmFyaWFibGUuc2xpY2UoMCx4KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bmV3U3RyICs9IGNiKHZhcmlhYmxlLCBmYWxsYmFjaywgaW5zaWRlQ2FsYyk7XHJcblx0XHRcdFx0bGFzdFBvaW50ID0gaTtcclxuXHRcdFx0XHRvcGVuZWRMZXZlbCA9IG51bGw7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGNoYXIgPT09ICcpJykge1xyXG5cdFx0XHRcdC0tbGV2ZWw7XHJcblx0XHRcdFx0aWYgKGluc2lkZUNhbGMgPT09IGxldmVsKSBpbnNpZGVDYWxjID0gbnVsbDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0bmV3U3RyICs9IHN0ci5zdWJzdHJpbmcobGFzdFBvaW50KTtcclxuXHRcdHJldHVybiBuZXdTdHI7XHJcblx0fVxyXG5cdGZ1bmN0aW9uIHN0eWxlQ29tcHV0ZVZhbHVlV2lkdGhWYXJzKHN0eWxlLCB2YWx1ZVdpdGhWYXJzLCBkZXRhaWxzKXtcclxuXHRcdHJldHVybiBmaW5kVmFycyh2YWx1ZVdpdGhWYXJzLCBmdW5jdGlvbih2YXJpYWJsZSwgZmFsbGJhY2ssIGluc2lkZUNhbGMpe1xyXG5cdFx0XHR2YXIgdmFsdWUgPSBzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKHZhcmlhYmxlKTtcclxuXHRcdFx0aWYgKGluc2lkZUNhbGMpIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvXmNhbGNcXCgvLCAnKCcpOyAvLyBwcmV2ZW50IG5lc3RlZCBjYWxjXHJcblx0XHRcdGlmIChkZXRhaWxzICYmIHN0eWxlLmxhc3RQcm9wZXJ0eVNlcnZlZEJ5ICE9PSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIGRldGFpbHMuYWxsQnlSb290ID0gZmFsc2U7XHJcblx0XHRcdGlmICh2YWx1ZT09PScnICYmIGZhbGxiYWNrKSB2YWx1ZSA9IHN0eWxlQ29tcHV0ZVZhbHVlV2lkdGhWYXJzKHN0eWxlLCBmYWxsYmFjaywgZGV0YWlscyk7XHJcblx0XHRcdHJldHVybiB2YWx1ZTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0Ly8gbXV0YXRpb24gbGlzdGVuZXJcclxuXHR2YXIgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbihtdXRhdGlvbnMpIHtcclxuXHRcdGlmIChkcmF3aW5nKSByZXR1cm47XHJcblx0XHRmb3IgKHZhciBpPTAsIG11dGF0aW9uOyBtdXRhdGlvbj1tdXRhdGlvbnNbaSsrXTspIHtcclxuXHRcdFx0aWYgKG11dGF0aW9uLmF0dHJpYnV0ZU5hbWUgPT09ICdpZWNwLW5lZWRlZCcpIGNvbnRpbnVlOyAvLyB3aHk/XHJcblx0XHRcdC8vIHJlY2hlY2sgYWxsIHNlbGVjdG9ycyBpZiBpdCB0YXJnZXRzIG5ldyBlbGVtZW50cz9cclxuXHRcdFx0ZHJhd1RyZWUobXV0YXRpb24udGFyZ2V0KTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRvYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LHthdHRyaWJ1dGVzOiB0cnVlLCBzdWJ0cmVlOiB0cnVlIH0pO1xyXG5cdH0pXHJcblxyXG5cdC8vIDp0YXJnZXQgbGlzdGVuZXJcclxuXHR2YXIgb2xkSGFzaCA9IGxvY2F0aW9uLmhhc2hcclxuXHRhZGRFdmVudExpc3RlbmVyKCdoYXNoY2hhbmdlJyxmdW5jdGlvbihlKXtcclxuXHRcdHZhciBuZXdFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGxvY2F0aW9uLmhhc2guc3Vic3RyKDEpKTtcclxuXHRcdGlmIChuZXdFbCkge1xyXG5cdFx0XHR2YXIgb2xkRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChvbGRIYXNoLnN1YnN0cigxKSk7XHJcblx0XHRcdGRyYXdUcmVlKG5ld0VsKTtcclxuXHRcdFx0ZHJhd1RyZWUob2xkRWwpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0ZHJhd1RyZWUoZG9jdW1lbnQpO1xyXG5cdFx0fVxyXG5cdFx0b2xkSGFzaCA9IGxvY2F0aW9uLmhhc2g7XHJcblx0fSk7XHJcblxyXG5cdC8vIGFkZCBvd25pbmdFbGVtZW50IHRvIEVsZW1lbnQuc3R5bGVcclxuXHR2YXIgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoSFRNTEVsZW1lbnQucHJvdG90eXBlLCAnc3R5bGUnKTtcclxuXHR2YXIgc3R5bGVHZXR0ZXIgPSBkZXNjcmlwdG9yLmdldDtcclxuXHRkZXNjcmlwdG9yLmdldCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdGNvbnN0IHN0eWxlID0gc3R5bGVHZXR0ZXIuY2FsbCh0aGlzKTtcclxuXHRcdHN0eWxlLm93bmluZ0VsZW1lbnQgPSB0aGlzO1xyXG5cdFx0cmV0dXJuIHN0eWxlO1xyXG5cdH1cclxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoSFRNTEVsZW1lbnQucHJvdG90eXBlLCAnc3R5bGUnLCBkZXNjcmlwdG9yKTtcclxuXHJcblx0Ly8gYWRkIGNvbXB1dGVkRm9yIHRvIGNvbXB1dGVkIHN0eWxlLW9iamVjdHNcclxuXHR2YXIgb3JpZ2luYWxHZXRDb21wdXRlZCA9IGdldENvbXB1dGVkU3R5bGU7XHJcblx0d2luZG93LmdldENvbXB1dGVkU3R5bGUgPSBmdW5jdGlvbiAoZWwpIHtcclxuXHRcdHZhciBzdHlsZSA9IG9yaWdpbmFsR2V0Q29tcHV0ZWQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuXHRcdHN0eWxlLmNvbXB1dGVkRm9yID0gZWw7XHJcblx0XHQvL3N0eWxlLnBzZXVkb0VsdCA9IHBzZXVkb0VsdDsgLy9ub3QgbmVlZGVkIGF0IHRoZSBtb21lbnRcclxuXHRcdHJldHVybiBzdHlsZTtcclxuXHR9XHJcblxyXG5cdC8vIGdldFByb3BlcnR5VmFsdWUgLyBzZXRQcm9wZXJ0eSBob29rc1xyXG5cdGNvbnN0IFN0eWxlUHJvdG8gPSBDU1NTdHlsZURlY2xhcmF0aW9uLnByb3RvdHlwZTtcclxuXHJcblx0Y29uc3Qgb2xkR2V0UCA9IFN0eWxlUHJvdG8uZ2V0UHJvcGVydHlWYWx1ZTtcclxuXHRTdHlsZVByb3RvLmdldFByb3BlcnR5VmFsdWUgPSBmdW5jdGlvbiAocHJvcGVydHkpIHtcclxuXHRcdHRoaXMubGFzdFByb3BlcnR5U2VydmVkQnkgPSBmYWxzZTtcclxuXHRcdHByb3BlcnR5ID0gcHJvcGVydHkudHJpbSgpO1xyXG5cclxuXHRcdC8qICpcclxuXHRcdGlmICh0aGlzLm93bmluZ0VsZW1lbnQpIHtcclxuXHRcdFx0Y29uc3QgaWVQcm9wZXJ0eSA9ICctaWVWYXItJytwcm9wZXJ0eTtcclxuXHRcdFx0Y29uc3QgaWVQcm9wZXJ0eUltcG9ydGFudCA9ICctaWVWYXIt4p2XJytwcm9wZXJ0eTtcclxuXHRcdFx0bGV0IHZhbHVlID0gdGhpc1tpZVByb3BlcnR5SW1wb3J0YW50XSB8fCB0aGlzW2llUHJvcGVydHldO1xyXG5cdFx0XHRpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdC8vIHRvZG8sIHRlc3QgaWYgc3ludGF4IHZhbGlkXHJcblx0XHRcdFx0cmV0dXJuIHZhbHVlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQvKiAqL1xyXG5cclxuXHRcdGlmIChwcm9wZXJ0eVswXSAhPT0gJy0nIHx8IHByb3BlcnR5WzFdICE9PSAnLScpIHJldHVybiBvbGRHZXRQLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblx0XHRjb25zdCB1bmRhc2hlZCA9IHByb3BlcnR5LnN1YnN0cigyKTtcclxuXHRcdGNvbnN0IGllUHJvcGVydHkgPSAnLWllLScrdW5kYXNoZWQ7XHJcblx0XHRjb25zdCBpZVByb3BlcnR5SW1wb3J0YW50ID0gJy1pZS3inZcnK3VuZGFzaGVkO1xyXG5cdFx0bGV0IHZhbHVlID0gZGVjb2RlVmFsdWUodGhpc1tpZVByb3BlcnR5SW1wb3J0YW50XSB8fCB0aGlzW2llUHJvcGVydHldKTtcclxuXHJcblx0XHRpZiAodGhpcy5jb21wdXRlZEZvcikgeyAvLyBjb21wdXRlZFN0eWxlXHJcblx0XHRcdGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmICFpbmhlcml0aW5nS2V5d29yZHNbdmFsdWVdKSB7XHJcblx0XHRcdFx0Ly9pZiAocmVnSGFzVmFyLnRlc3QodmFsdWUpKSAgLy8gdG9kbzogdG8gaSBuZWVkIHRoaXMgY2hlY2s/ISEhIGkgdGhpbmsgaXRzIGZhc3RlciB3aXRob3V0XHJcblx0XHRcdFx0XHR2YWx1ZSA9IHN0eWxlQ29tcHV0ZVZhbHVlV2lkdGhWYXJzKHRoaXMsIHZhbHVlKTtcclxuXHRcdFx0XHR0aGlzLmxhc3RQcm9wZXJ0eVNlcnZlZEJ5ID0gdGhpcy5jb21wdXRlZEZvcjtcclxuXHRcdFx0fSBlbHNlIHsgLy8gaW5oZXJpdGVkXHJcblx0XHRcdFx0aWYgKGluaGVyaXRpbmdLZXl3b3Jkc1t2YWx1ZV0gfHwgIXJlZ2lzdGVyW3Byb3BlcnR5XSB8fCByZWdpc3Rlcltwcm9wZXJ0eV0uaW5oZXJpdHMpIHtcclxuXHRcdFx0XHRcdC8vbGV0IGVsID0gdGhpcy5wc2V1ZG9FbHQgPyB0aGlzLmNvbXB1dGVkRm9yIDogdGhpcy5jb21wdXRlZEZvci5wYXJlbnROb2RlO1xyXG5cdFx0XHRcdFx0bGV0IGVsID0gdGhpcy5jb21wdXRlZEZvci5wYXJlbnROb2RlO1xyXG5cdFx0XHRcdFx0d2hpbGUgKGVsLm5vZGVUeXBlID09PSAxKSB7XHJcblx0XHRcdFx0XHRcdC8vIGhvdyBzbG93ZXIgd291bGQgaXQgYmUgdG8gZ2V0Q29tcHV0ZWRTdHlsZSBmb3IgZXZlcnkgZWxlbWVudCwgbm90IGp1c3Qgd2l0aCBkZWZpbmVkIGllQ1Bfc2V0dGVyc1xyXG5cdFx0XHRcdFx0XHRpZiAoZWwuaWVDUF9zZXR0ZXJzICYmIGVsLmllQ1Bfc2V0dGVyc1twcm9wZXJ0eV0pIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBpIGNvdWxkIG1ha2VcclxuXHRcdFx0XHRcdFx0XHQvLyB2YWx1ZSA9IGVsLm5vZGVUeXBlID8gZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmNvbXB1dGVkRm9yLnBhcmVudE5vZGUpLmdldFByb3BlcnR5VmFsdWUocHJvcGVydHkpXHJcblx0XHRcdFx0XHRcdFx0Ly8gYnV0IGkgZmVhciBwZXJmb3JtYW5jZSwgc3R1cGlkP1xyXG5cdFx0XHRcdFx0XHRcdHZhciBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoZWwpO1xyXG5cdFx0XHRcdFx0XHRcdHZhciB0bXBWYWwgPSBkZWNvZGVWYWx1ZShzdHlsZVtpZVByb3BlcnR5SW1wb3J0YW50XSB8fCBzdHlsZVtpZVByb3BlcnR5XSk7XHJcblx0XHRcdFx0XHRcdFx0aWYgKHRtcFZhbCAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjYWxjdWxhdGVkIHN0eWxlIGZyb20gY3VycmVudCBlbGVtZW50IG5vdCBmcm9tIHRoZSBlbGVtZW50IHRoZSB2YWx1ZSB3YXMgaW5oZXJpdGVkIGZyb20hIChzdHlsZSwgdmFsdWUpXHJcblx0XHRcdFx0XHRcdFx0XHQvL3ZhbHVlID0gdG1wVmFsOyBpZiAocmVnSGFzVmFyLnRlc3QodG1wVmFsKSkgIC8vIHRvZG86IHRvIGkgbmVlZCB0aGlzIGNoZWNrPyEhISBpIHRoaW5rIGl0cyBmYXN0ZXIgd2l0aG91dFxyXG5cdFx0XHRcdFx0XHRcdFx0XHR2YWx1ZSA9IHN0eWxlQ29tcHV0ZVZhbHVlV2lkdGhWYXJzKHRoaXMsIHRtcFZhbCk7XHJcblx0XHRcdFx0XHRcdFx0XHR0aGlzLmxhc3RQcm9wZXJ0eVNlcnZlZEJ5ID0gZWw7XHJcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWwgPSBlbC5wYXJlbnROb2RlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAodmFsdWU9PT0naW5pdGlhbCcpIHJldHVybiAnJztcclxuXHRcdH1cclxuXHRcdC8vaWYgKCh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSAnaW5pdGlhbCcpICYmIHJlZ2lzdGVyW3Byb3BlcnR5XSkgdmFsdWUgPSByZWdpc3Rlcltwcm9wZXJ0eV0uaW5pdGlhbFZhbHVlOyAvLyB0b2RvP1xyXG5cdFx0aWYgKHZhbHVlID09PSB1bmRlZmluZWQgJiYgcmVnaXN0ZXJbcHJvcGVydHldKSB2YWx1ZSA9IHJlZ2lzdGVyW3Byb3BlcnR5XS5pbml0aWFsVmFsdWU7XHJcblx0XHRpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkgcmV0dXJuICcnO1xyXG5cdFx0cmV0dXJuIHZhbHVlO1xyXG5cdH07XHJcblx0Y29uc3QgaW5oZXJpdGluZ0tleXdvcmRzID0ge2luaGVyaXQ6MSxyZXZlcnQ6MSx1bnNldDoxfTtcclxuXHJcblx0Y29uc3Qgb2xkU2V0UCA9IFN0eWxlUHJvdG8uc2V0UHJvcGVydHk7XHJcblx0U3R5bGVQcm90by5zZXRQcm9wZXJ0eSA9IGZ1bmN0aW9uIChwcm9wZXJ0eSwgdmFsdWUsIHByaW8pIHtcclxuXHRcdGlmIChwcm9wZXJ0eVswXSAhPT0gJy0nIHx8IHByb3BlcnR5WzFdICE9PSAnLScpIHJldHVybiBvbGRTZXRQLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblx0XHRjb25zdCBlbCA9IHRoaXMub3duaW5nRWxlbWVudDtcclxuXHRcdGlmIChlbCkge1xyXG5cdFx0XHRpZiAoIWVsLmllQ1Bfc2V0dGVycykgZWwuaWVDUF9zZXR0ZXJzID0ge307XHJcblx0XHRcdGVsLmllQ1Bfc2V0dGVyc1twcm9wZXJ0eV0gPSAxO1xyXG5cdFx0fVxyXG5cdFx0cHJvcGVydHkgPSAnLWllLScrKHByaW89PT0naW1wb3J0YW50Jz8n4p2XJzonJykgKyBwcm9wZXJ0eS5zdWJzdHIoMik7XHJcblx0XHR0aGlzLmNzc1RleHQgKz0gJzsgJyArIHByb3BlcnR5ICsgJzonICsgZW5jb2RlVmFsdWUodmFsdWUpICsgJzsnO1xyXG5cdFx0Ly90aGlzW3Byb3BlcnR5XSA9IHZhbHVlO1xyXG5cdFx0ZWwgPT09IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCAmJiByZWRyYXdTdHlsZVNoZWV0cygpO1xyXG5cdFx0ZWwgJiYgZHJhd1RyZWUoZWwpOyAvLyBpdHMgZGVsYXllZCBpbnRlcm5hbFxyXG5cdH07XHJcblxyXG5cclxuXHQvKlxyXG5cdHZhciBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihTdHlsZVByb3RvLCAnY3NzVGV4dCcpO1xyXG5cdHZhciBjc3NUZXh0R2V0dGVyID0gZGVzY3JpcHRvci5nZXQ7XHJcblx0dmFyIGNzc1RleHRTZXR0ZXIgPSBkZXNjcmlwdG9yLnNldDtcclxuXHQvLyBkZXNjcmlwdG9yLmdldCA9IGZ1bmN0aW9uICgpIHtcclxuXHQvLyBcdGNvbnN0IHN0eWxlID0gc3R5bGVHZXR0ZXIuY2FsbCh0aGlzKTtcclxuXHQvLyBcdHN0eWxlLm93bmluZ0VsZW1lbnQgPSB0aGlzO1xyXG5cdC8vIFx0cmV0dXJuIHN0eWxlO1xyXG5cdC8vIH1cclxuXHRkZXNjcmlwdG9yLnNldCA9IGZ1bmN0aW9uIChjc3MpIHtcclxuXHRcdHZhciBlbCA9IHRoaXMub3duaW5nRWxlbWVudDtcclxuXHRcdGlmIChlbCkge1xyXG5cdFx0XHRjc3MgPSByZXdyaXRlQ3NzKCd7Jytjc3MpLnN1YnN0cigxKTtcclxuXHRcdFx0Y3NzVGV4dFNldHRlci5jYWxsKHRoaXMsIGNzcyk7XHJcblx0XHRcdHZhciBmb3VuZCA9IHBhcnNlUmV3cml0dGVuU3R5bGUodGhpcyk7XHJcblx0XHRcdGlmIChmb3VuZC5nZXR0ZXJzKSBhZGRHZXR0ZXJFbGVtZW50KGVsLCBmb3VuZC5nZXR0ZXJzLCAnJXN0eWxlQXR0cicpO1xyXG5cdFx0XHRpZiAoZm91bmQuc2V0dGVycykgYWRkU2V0dGVyRWxlbWVudChlbCwgZm91bmQuc2V0dGVycyk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdHJldHVybiBjc3NUZXh0U2V0dGVyLmNhbGwodGhpcywgY3NzKTtcclxuXHR9XHJcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KFN0eWxlUHJvdG8sICdjc3NUZXh0JywgZGVzY3JpcHRvcik7XHJcblx0Ki9cclxuXHJcblxyXG5cdGlmICghd2luZG93LkNTUykgd2luZG93LkNTUyA9IHt9O1xyXG5cdGNvbnN0IHJlZ2lzdGVyID0ge31cclxuXHRDU1MucmVnaXN0ZXJQcm9wZXJ0eSA9IGZ1bmN0aW9uKG9wdGlvbnMpe1xyXG5cdFx0cmVnaXN0ZXJbb3B0aW9ucy5uYW1lXSA9IG9wdGlvbnM7XHJcblx0fVxyXG5cclxuXHQvLyBmaXggXCJpbml0aWFsXCIga2V5d29yZCB3aXRoIGdlbmVyYXRlZCBjdXN0b20gcHJvcGVydGllcywgdGhpcyBpcyBub3Qgc3VwcG9ydGVkIGFkIGFsbCBieSBpZSwgc2hvdWxkIGkgbWFrZSBhIHNlcGFyYXRlIFwiaW5oZXJpdFwiLXBvbHlmaWxsP1xyXG5cdC8qXHJcblx0Y29uc3QgY29tcHV0ZWQgPSBnZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudClcclxuXHRjb25zdCBpbml0aWFscyA9IHt9O1xyXG5cdGZvciAobGV0IGkgaW4gY29tcHV0ZWQpIHtcclxuXHRcdGluaXRpYWxzW2kucmVwbGFjZSgvKFtBLVpdKS8sIGZ1bmN0aW9uKHgpeyByZXR1cm4gJy0nK3gudG9Mb3dlckNhc2UoeCkgfSldID0gY29tcHV0ZWRbaV07XHJcblx0fVxyXG5cdGluaXRpYWxzWydkaXNwbGF5J10gPSAnaW5saW5lJztcclxuXHQqL1xyXG5cclxuXHQvLyB1dGlsc1xyXG5cdGZ1bmN0aW9uIGZldGNoQ3NzKHVybCwgY2FsbGJhY2spIHtcclxuXHRcdHZhciByZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblx0XHRyZXF1ZXN0Lm9wZW4oJ0dFVCcsIHVybCk7XHJcblx0XHRyZXF1ZXN0Lm92ZXJyaWRlTWltZVR5cGUoJ3RleHQvY3NzJyk7XHJcblx0XHRyZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0aWYgKHJlcXVlc3Quc3RhdHVzID49IDIwMCAmJiByZXF1ZXN0LnN0YXR1cyA8IDQwMCkge1xyXG5cdFx0XHRcdGNhbGxiYWNrKHJlcXVlc3QucmVzcG9uc2VUZXh0KTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHRcdHJlcXVlc3Quc2VuZCgpO1xyXG5cdH1cclxuXHJcbn0oKTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==