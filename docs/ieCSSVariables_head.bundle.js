/******/ (() => { // webpackBootstrap
/*!*************************************!*\
  !*** ./src/ie11CustomProperties.js ***!
  \*************************************/
/*! ie11CustomProperties.js v3.0.6 | MIT License | https://git.io/fjXMN */
!function () {
  'use strict';

  window['cssVariables'] = {};
  // check for support
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
    while (listener = listeners[i++]) checkListener(listener, inside);
  }
  function checkMutations(mutations) {
    var j = 0,
      i,
      mutation,
      nodes,
      target;
    while (mutation = mutations[j++]) {
      nodes = mutation.addedNodes, i = 0;
      while (target = nodes[i++]) target.nodeType === 1 && checkListeners(target);
    }
  }
  var loaded = false;
  document.addEventListener('DOMContentLoaded', function () {
    loaded = true;
  });

  // svg polyfills
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
  }

  // main logic

  // cached regexps, better performance
  var regFindSetters = /([\s{;])(--([A-Za-z0-9-_]*)\s*:([^;!}{]+)(!important)?)(?=\s*([;}]|$))/g;
  var regFindGetters = /([{;]\s*)([A-Za-z0-9-_]+\s*:[^;}{]*var\([^!;}{]+)(!important)?(?=\s*([;}$]|$))/g;
  var regRuleIEGetters = /-ieVar-([^:]+):/g;
  var regRuleIESetters = /-ie-([^};]+)/g;
  //const regHasVar = /var\(/;
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
  onElement('style', foundStyle);
  // immediate, to pass w3c-tests, bud its a bad idea
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
  }

  // ie has a bug, where unknown properties at pseudo-selectors are computed at the element
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
    // removed by dead control flow

  }
  var keywords = {
    initial: 1,
    inherit: 1,
    revert: 1,
    unset: 1
  };
  function decodeValue(value) {
    return value;
    // removed by dead control flow

    // removed by dead control flow

    // removed by dead control flow
 var trimmed; 
    // removed by dead control flow

    // removed by dead control flow

  }

  // beta
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
        getters.push(propName);

        // beta
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
      }

      // mediaQueries: redraw the hole document
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
    }

    // beta
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
  }

  //beta
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
    var _loop2 = function _loop2() {
        parts = selector.split(':' + pseudo);
        if (parts.length > 1) {
          ending = parts[1].match(/^[^\s]*/); // ending elementpart of selector (used for not(:active))
          var sel = unPseudo(parts[0] + ending);
          var _listeners = pseudos[pseudo];
          onElement(sel, function (el) {
            el.addEventListener(_listeners.on, drawTreeEvent);
            el.addEventListener(_listeners.off, drawTreeEvent);
          });
        }
      },
      parts,
      ending;
    for (var pseudo in pseudos) {
      _loop2();
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
      var value = styleComputeValueWidthVars(style, valueWithVar, details);
      //if (value==='initial') value = initials[prop];
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
      styleEl.ieCP_elementSheet = 1;
      //el.appendChild(styleEl); // yes! self-closing tags can have style as children, but - if i set innerHTML, the stylesheet is lost
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
  }
  // draw queue
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
  }

  // mutation listener
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
  });

  // :target listener
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
  });

  // add owningElement to Element.style
  var descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'style');
  var styleGetter = descriptor.get;
  descriptor.get = function () {
    var style = styleGetter.call(this);
    style.owningElement = this;
    return style;
  };
  Object.defineProperty(HTMLElement.prototype, 'style', descriptor);

  // add computedFor to computed style-objects
  var originalGetComputed = getComputedStyle;
  window.getComputedStyle = function (el) {
    var style = originalGetComputed.apply(this, arguments);
    style.computedFor = el;
    //style.pseudoElt = pseudoElt; //not needed at the moment
    return style;
  };

  // getPropertyValue / setProperty hooks
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
    }
    //if ((value === undefined || value === 'initial') && register[property]) value = register[property].initialValue; // todo?
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
    this.cssText += '; ' + property + ':' + encodeValue(value) + ';';
    //this[property] = value;
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
  };

  // fix "initial" keyword with generated custom properties, this is not supported ad all by ie, should i make a separate "inherit"-polyfill?
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
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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OztFQUdEO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0VBR0MsSUFBSSxDQUFDZixNQUFNLENBQUM4TyxHQUFHLEVBQUU5TyxNQUFNLENBQUM4TyxHQUFHLEdBQUcsQ0FBQyxDQUFDO0VBQ2hDLElBQU1OLFFBQVEsR0FBRyxDQUFDLENBQUM7RUFDbkJNLEdBQUcsQ0FBQ0MsZ0JBQWdCLEdBQUcsVUFBU0MsT0FBTyxFQUFDO0lBQ3ZDUixRQUFRLENBQUNRLE9BQU8sQ0FBQ0MsSUFBSSxDQUFDLEdBQUdELE9BQU87RUFDakMsQ0FBQzs7RUFFRDtFQUNBO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0VBRUM7RUFDQSxTQUFTM0ssUUFBUUEsQ0FBQzZLLEdBQUcsRUFBRTlOLFFBQVEsRUFBRTtJQUNoQyxJQUFJK04sT0FBTyxHQUFHLElBQUlDLGNBQWMsQ0FBQyxDQUFDO0lBQ2xDRCxPQUFPLENBQUNFLElBQUksQ0FBQyxLQUFLLEVBQUVILEdBQUcsQ0FBQztJQUN4QkMsT0FBTyxDQUFDRyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUM7SUFDcENILE9BQU8sQ0FBQ0ksTUFBTSxHQUFHLFlBQVk7TUFDNUIsSUFBSUosT0FBTyxDQUFDSyxNQUFNLElBQUksR0FBRyxJQUFJTCxPQUFPLENBQUNLLE1BQU0sR0FBRyxHQUFHLEVBQUU7UUFDbERwTyxRQUFRLENBQUMrTixPQUFPLENBQUNNLFlBQVksQ0FBQztNQUMvQjtJQUNELENBQUM7SUFDRE4sT0FBTyxDQUFDTyxJQUFJLENBQUMsQ0FBQztFQUNmO0FBRUQsQ0FBQyxDQUFDLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYi8uL3NyYy9pZTExQ3VzdG9tUHJvcGVydGllcy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiEgaWUxMUN1c3RvbVByb3BlcnRpZXMuanMgdjMuMC42IHwgTUlUIExpY2Vuc2UgfCBodHRwczovL2dpdC5pby9malhNTiAqL1xyXG4hZnVuY3Rpb24gKCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0d2luZG93Wydjc3NWYXJpYWJsZXMnXSA9IHt9O1xyXG5cdC8vIGNoZWNrIGZvciBzdXBwb3J0XHJcblx0dmFyIHRlc3RFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2knKTtcclxuXHR0ZXN0RWwuc3R5bGUuc2V0UHJvcGVydHkoJy0teCcsICd5Jyk7XHJcblx0aWYgKHRlc3RFbC5zdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCctLXgnKSA9PT0gJ3knIHx8ICF0ZXN0RWwubXNNYXRjaGVzU2VsZWN0b3IpIHJldHVybjtcclxuXHJcblx0aWYgKCFFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzKSBFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzID0gRWxlbWVudC5wcm90b3R5cGUubXNNYXRjaGVzU2VsZWN0b3I7XHJcblxyXG4gICAgdmFyIGxpc3RlbmVycyA9IFtdLFxyXG4gICAgICAgIHJvb3QgPSBkb2N1bWVudCxcclxuICAgICAgICBPYnNlcnZlcjtcclxuXHJcblx0ZnVuY3Rpb24gcXNhKGVsLCBzZWxlY3Rvcil7XHJcblx0XHR0cnkge1xyXG5cdFx0XHRyZXR1cm4gZWwucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XHJcblx0XHR9IGNhdGNoKGUpIHtcclxuXHRcdFx0Ly8gY29uc29sZS53YXJuKCd0aGUgU2VsZWN0b3IgJytzZWxlY3RvcisnIGNhbiBub3QgYmUgcGFyc2VkJyk7XHJcblx0XHRcdHJldHVybiBbXTtcclxuXHRcdH1cclxuXHR9XHJcbiAgICBmdW5jdGlvbiBvbkVsZW1lbnQgKHNlbGVjdG9yLCBjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBsaXN0ZW5lciA9IHtcclxuICAgICAgICAgICAgc2VsZWN0b3I6IHNlbGVjdG9yLFxyXG4gICAgICAgICAgICBjYWxsYmFjazogY2FsbGJhY2ssXHJcbiAgICAgICAgICAgIGVsZW1lbnRzOiBuZXcgV2Vha01hcCgpLFxyXG4gICAgICAgIH07XHJcblx0XHR2YXIgZWxzID0gcXNhKHJvb3QsIGxpc3RlbmVyLnNlbGVjdG9yKSwgaT0wLCBlbDtcclxuXHRcdHdoaWxlIChlbCA9IGVsc1tpKytdKSB7XHJcbiAgICAgICAgICAgIGxpc3RlbmVyLmVsZW1lbnRzLnNldChlbCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGxpc3RlbmVyLmNhbGxiYWNrLmNhbGwoZWwsIGVsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xyXG4gICAgICAgIGlmICghT2JzZXJ2ZXIpIHtcclxuICAgICAgICAgICAgT2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihjaGVja011dGF0aW9ucyk7XHJcbiAgICAgICAgICAgIE9ic2VydmVyLm9ic2VydmUocm9vdCwge1xyXG4gICAgICAgICAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc3VidHJlZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2hlY2tMaXN0ZW5lcihsaXN0ZW5lcik7XHJcbiAgICB9O1xyXG4gICAgZnVuY3Rpb24gY2hlY2tMaXN0ZW5lcihsaXN0ZW5lciwgdGFyZ2V0KSB7XHJcbiAgICAgICAgdmFyIGkgPSAwLCBlbCwgZWxzID0gW107XHJcblx0XHR0cnkge1xyXG5cdFx0XHR0YXJnZXQgJiYgdGFyZ2V0Lm1hdGNoZXMobGlzdGVuZXIuc2VsZWN0b3IpICYmIGVscy5wdXNoKHRhcmdldCk7XHJcblx0XHR9IGNhdGNoKGUpIHt9XHJcbiAgICAgICAgaWYgKGxvYWRlZCkgeyAvLyBvaz8gY2hlY2sgaW5zaWRlIG5vZGUgb24gaW5uZXJIVE1MIC0gb25seSB3aGVuIGxvYWRlZFxyXG4gICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShlbHMsIHFzYSh0YXJnZXQgfHwgcm9vdCwgbGlzdGVuZXIuc2VsZWN0b3IpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgd2hpbGUgKGVsID0gZWxzW2krK10pIHtcclxuICAgICAgICAgICAgaWYgKGxpc3RlbmVyLmVsZW1lbnRzLmhhcyhlbCkpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICBsaXN0ZW5lci5lbGVtZW50cy5zZXQoZWwsdHJ1ZSk7XHJcbiAgICAgICAgICAgIGxpc3RlbmVyLmNhbGxiYWNrLmNhbGwoZWwsIGVsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBjaGVja0xpc3RlbmVycyhpbnNpZGUpIHtcclxuICAgICAgICB2YXIgaSA9IDAsIGxpc3RlbmVyO1xyXG4gICAgICAgIHdoaWxlIChsaXN0ZW5lciA9IGxpc3RlbmVyc1tpKytdKSBjaGVja0xpc3RlbmVyKGxpc3RlbmVyLCBpbnNpZGUpO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gY2hlY2tNdXRhdGlvbnMobXV0YXRpb25zKSB7XHJcblx0XHR2YXIgaiA9IDAsIGksIG11dGF0aW9uLCBub2RlcywgdGFyZ2V0O1xyXG4gICAgICAgIHdoaWxlIChtdXRhdGlvbiA9IG11dGF0aW9uc1tqKytdKSB7XHJcbiAgICAgICAgICAgIG5vZGVzID0gbXV0YXRpb24uYWRkZWROb2RlcywgaSA9IDA7XHJcbiAgICAgICAgICAgIHdoaWxlICh0YXJnZXQgPSBub2Rlc1tpKytdKSB0YXJnZXQubm9kZVR5cGUgPT09IDEgJiYgY2hlY2tMaXN0ZW5lcnModGFyZ2V0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGxvYWRlZCA9IGZhbHNlO1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBsb2FkZWQgPSB0cnVlO1xyXG4gICAgfSk7XHJcblxyXG5cdC8vIHN2ZyBwb2x5ZmlsbHNcclxuXHRmdW5jdGlvbiBjb3B5UHJvcGVydHkocHJvcCwgZnJvbSwgdG8pe1xyXG5cdFx0dmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGZyb20sIHByb3ApO1xyXG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRvLCBwcm9wLCBkZXNjKTtcclxuXHR9XHJcblx0aWYgKCEoJ2NsYXNzTGlzdCcgaW4gRWxlbWVudC5wcm90b3R5cGUpKSB7XHJcblx0XHRjb3B5UHJvcGVydHkoJ2NsYXNzTGlzdCcsIEhUTUxFbGVtZW50LnByb3RvdHlwZSwgRWxlbWVudC5wcm90b3R5cGUpO1xyXG5cdH1cclxuXHRpZiAoISgnaW5uZXJIVE1MJyBpbiBFbGVtZW50LnByb3RvdHlwZSkpIHtcclxuXHRcdGNvcHlQcm9wZXJ0eSgnaW5uZXJIVE1MJywgSFRNTEVsZW1lbnQucHJvdG90eXBlLCBFbGVtZW50LnByb3RvdHlwZSk7XHJcblx0fVxyXG5cdGlmICghKCdzaGVldCcgaW4gU1ZHU3R5bGVFbGVtZW50LnByb3RvdHlwZSkpIHtcclxuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTVkdTdHlsZUVsZW1lbnQucHJvdG90eXBlLCAnc2hlZXQnLCB7XHJcblx0XHRcdGdldDpmdW5jdGlvbigpe1xyXG5cdFx0XHRcdHZhciBhbGwgPSBkb2N1bWVudC5zdHlsZVNoZWV0cywgaT0wLCBzaGVldDtcclxuXHRcdFx0XHR3aGlsZSAoc2hlZXQ9YWxsW2krK10pIHtcclxuXHRcdFx0XHRcdGlmIChzaGVldC5vd25lck5vZGUgPT09IHRoaXMpIHJldHVybiBzaGVldDtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cclxuXHQvLyBtYWluIGxvZ2ljXHJcblxyXG5cdC8vIGNhY2hlZCByZWdleHBzLCBiZXR0ZXIgcGVyZm9ybWFuY2VcclxuXHRjb25zdCByZWdGaW5kU2V0dGVycyA9IC8oW1xcc3s7XSkoLS0oW0EtWmEtejAtOS1fXSopXFxzKjooW147IX17XSspKCFpbXBvcnRhbnQpPykoPz1cXHMqKFs7fV18JCkpL2c7XHJcblx0Y29uc3QgcmVnRmluZEdldHRlcnMgPSAvKFt7O11cXHMqKShbQS1aYS16MC05LV9dK1xccyo6W147fXtdKnZhclxcKFteITt9e10rKSghaW1wb3J0YW50KT8oPz1cXHMqKFs7fSRdfCQpKS9nO1xyXG5cdGNvbnN0IHJlZ1J1bGVJRUdldHRlcnMgPSAvLWllVmFyLShbXjpdKyk6L2dcclxuXHRjb25zdCByZWdSdWxlSUVTZXR0ZXJzID0gLy1pZS0oW159O10rKS9nXHJcblx0Ly9jb25zdCByZWdIYXNWYXIgPSAvdmFyXFwoLztcclxuXHRjb25zdCByZWdQc2V1ZG9zID0gLzooaG92ZXJ8YWN0aXZlfGZvY3VzfHRhcmdldHw6YmVmb3JlfDphZnRlcnw6Zmlyc3QtbGV0dGVyfDpmaXJzdC1saW5lKS87XHJcblxyXG5cdG9uRWxlbWVudCgnbGlua1tyZWw9XCJzdHlsZXNoZWV0XCJdJywgZnVuY3Rpb24gKGVsKSB7XHJcblx0XHRmZXRjaENzcyhlbC5ocmVmLCBmdW5jdGlvbiAoY3NzKSB7XHJcblx0XHRcdHZhciBuZXdDc3MgPSByZXdyaXRlQ3NzKGNzcyk7XHJcblx0XHRcdGlmIChjc3MgPT09IG5ld0NzcykgcmV0dXJuO1xyXG5cdFx0XHRuZXdDc3MgPSByZWxUb0FicyhlbC5ocmVmLCBuZXdDc3MpO1xyXG5cdFx0XHRlbC5kaXNhYmxlZCA9IHRydWU7XHJcblx0XHRcdHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XHJcblx0XHRcdGlmIChlbC5tZWRpYSkgc3R5bGUuc2V0QXR0cmlidXRlKCdtZWRpYScsIGVsLm1lZGlhKTtcclxuXHRcdFx0ZWwucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoc3R5bGUsIGVsKTtcclxuXHRcdFx0YWN0aXZhdGVTdHlsZUVsZW1lbnQoc3R5bGUsIG5ld0Nzcyk7XHJcblx0XHR9KTtcclxuXHR9KTtcclxuXHJcblx0ZnVuY3Rpb24gZm91bmRTdHlsZShlbCl7XHJcblx0XHRpZiAoZWwuaWVDUF9wb2x5ZmlsbGVkKSByZXR1cm47XHJcblx0XHRpZiAoZWwuaWVDUF9lbGVtZW50U2hlZXQpIHJldHVybjtcclxuXHRcdHZhciBjc3MgPSBlbC5pbm5lckhUTUw7XHJcblx0XHR2YXIgbmV3Q3NzID0gcmV3cml0ZUNzcyhjc3MpO1xyXG5cdFx0aWYgKGNzcyA9PT0gbmV3Q3NzKSByZXR1cm47XHJcblx0XHRhY3RpdmF0ZVN0eWxlRWxlbWVudChlbCwgbmV3Q3NzKTtcclxuXHR9XHJcblx0b25FbGVtZW50KCdzdHlsZScsIGZvdW5kU3R5bGUpO1xyXG5cdC8vIGltbWVkaWF0ZSwgdG8gcGFzcyB3M2MtdGVzdHMsIGJ1ZCBpdHMgYSBiYWQgaWRlYVxyXG5cdC8vIGFkZEV2ZW50TGlzdGVuZXIoJ0RPTU5vZGVJbnNlcnRlZCcsZnVuY3Rpb24oZSl7IGUudGFyZ2V0LnRhZ05hbWUgPT09ICdTVFlMRScgJiYgZm91bmRTdHlsZShlLnRhcmdldCk7IH0pO1xyXG5cclxuXHJcblxyXG5cdG9uRWxlbWVudCgnW2llLXN0eWxlXScsIGZ1bmN0aW9uIChlbCkge1xyXG5cdFx0dmFyIG5ld0NzcyA9IHJld3JpdGVDc3MoJ3snK2VsLmdldEF0dHJpYnV0ZSgnaWUtc3R5bGUnKSkuc3Vic3RyKDEpO1xyXG5cdFx0ZWwuc3R5bGUuY3NzVGV4dCArPSAnOycrIG5ld0NzcztcclxuXHRcdHZhciBmb3VuZCA9IHBhcnNlUmV3cml0dGVuU3R5bGUoZWwuc3R5bGUpO1xyXG5cdFx0aWYgKGZvdW5kLmdldHRlcnMpIGFkZEdldHRlckVsZW1lbnQoZWwsIGZvdW5kLmdldHRlcnMsICclc3R5bGVBdHRyJyk7XHJcblx0XHRpZiAoZm91bmQuc2V0dGVycykgYWRkU2V0dGVyRWxlbWVudChlbCwgZm91bmQuc2V0dGVycyk7XHJcblx0fSk7XHJcblxyXG5cdGZ1bmN0aW9uIHJlbFRvQWJzKGJhc2UsIGNzcykge1xyXG5cdFx0cmV0dXJuIGNzcy5yZXBsYWNlKC91cmxcXCgoW14pXSspXFwpL2csIGZ1bmN0aW9uKCQwLCAkMSl7XHJcblx0XHRcdCQxID0gJDEudHJpbSgpLnJlcGxhY2UoLyheWydcIl18WydcIl0kKS9nLCcnKTtcclxuXHRcdFx0aWYgKCQxLm1hdGNoKC9eKFthLXpdKzp8XFwvKS8pKSByZXR1cm4gJDA7XHJcblx0XHRcdGJhc2UgPSBiYXNlLnJlcGxhY2UoL1xcPy4qLywnJyk7XHJcblx0XHRcdHJldHVybiAndXJsKCcrIGJhc2UgKyAnLi8uLi8nICsgJDEgKycpJztcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0Ly8gaWUgaGFzIGEgYnVnLCB3aGVyZSB1bmtub3duIHByb3BlcnRpZXMgYXQgcHNldWRvLXNlbGVjdG9ycyBhcmUgY29tcHV0ZWQgYXQgdGhlIGVsZW1lbnRcclxuXHQvLyAjZWw6OmFmdGVyIHsgLWNvbnRlbnQ6J3gnOyB9ID0+IGdldENvbXB1dGVkU3R5bGUoZWwpWyctY29udGVudCddID09ICd4J1xyXG5cdC8vIHNob3VsZCB3ZSBhZGQgc29tZXRoaW5nIGxpa2UgLWllVmFyLXBzZXVkb19hZnRlci1jb250ZW50Oid4Jz9cclxuXHRmdW5jdGlvbiByZXdyaXRlQ3NzKGNzcykge1xyXG5cclxuXHRcdC8qIHVuY29tbWVudCBpZiBzcGVjIGZpbmlzaGVkIGFuZCBuZWVkZWQgYnkgc29tZW9uZVxyXG5cdFx0Y3NzID0gY3NzLnJlcGxhY2UoL0Bwcm9wZXJ0eSAoW157XSspeyhbXn1dKyl9LywgZnVuY3Rpb24oJDAsIHByb3AsIGJvZHkpe1xyXG5cdFx0XHRwcm9wID0gcHJvcC50cmltKCk7XHJcblx0XHRcdGNvbnN0IGRlY2xhcmF0aW9uID0ge25hbWU6cHJvcH07XHJcblx0XHRcdGJvZHkuc3BsaXQoJzsnKS5mb3JFYWNoKGZ1bmN0aW9uKHBhaXIpe1xyXG5cdFx0XHRcdGNvbnN0IHggPSBwYWlyLnNwbGl0KCc6Jyk7XHJcblx0XHRcdFx0aWYgKHhbMV0pIGRlY2xhcmF0aW9uWyB4WzBdLnRyaW0oKSBdID0geFsxXTtcclxuXHRcdFx0fSk7XHJcblx0XHRcdGRlY2xhcmF0aW9uWydpbmhlcml0cyddID0gZGVjbGFyYXRpb25bJ2luaGVyaXRzJ10udHJpbSgpPT09J3RydWUnID8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFx0XHRkZWNsYXJhdGlvblsnaW5pdGlhbFZhbHVlJ10gPSBkZWNsYXJhdGlvblsnaW5pdGlhbC12YWx1ZSddO1xyXG5cdFx0XHRDU1MucmVnaXN0ZXJQcm9wZXJ0eShkZWNsYXJhdGlvbilcclxuXHRcdFx0cmV0dXJuICcvKlxcbiBAcHJvcGVydHkgLi4uIHJlbW92ZWQgXFxuKicrJy8nO1xyXG5cdFx0fSk7XHJcblx0XHQqL1xyXG5cdFx0cmV0dXJuIGNzcy5yZXBsYWNlKHJlZ0ZpbmRTZXR0ZXJzLCBmdW5jdGlvbigkMCwgJDEsICQyLCAkMywgJDQsIGltcG9ydGFudCl7XHJcblx0XHRcdHJldHVybiAkMSsnLWllLScrKGltcG9ydGFudD8n4p2XJzonJykrJDMrJzonK2VuY29kZVZhbHVlKCQ0KTtcclxuXHRcdH0pLnJlcGxhY2UocmVnRmluZEdldHRlcnMsIGZ1bmN0aW9uKCQwLCAkMSwgJDIsIGltcG9ydGFudCl7XHJcblx0XHRcdHJldHVybiAkMSsnLWllVmFyLScrKGltcG9ydGFudD8n4p2XJzonJykrJDIrJzsgJyskMjsgLy8ga2VlcCB0aGUgb3JpZ2luYWwsIHNvIGNoYWluaW5nIHdvcmtzIFwiLS14OnZhcigtLXkpXCJcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRmdW5jdGlvbiBlbmNvZGVWYWx1ZSh2YWx1ZSl7XHJcblx0XHRyZXR1cm4gdmFsdWU7XHJcblx0XHRyZXR1cm4gdmFsdWUucmVwbGFjZSgvIC9nLCfikKMnKTtcclxuXHR9XHJcblx0Y29uc3Qga2V5d29yZHMgPSB7aW5pdGlhbDoxLGluaGVyaXQ6MSxyZXZlcnQ6MSx1bnNldDoxfTtcclxuXHRmdW5jdGlvbiBkZWNvZGVWYWx1ZSh2YWx1ZSl7XHJcblx0XHRyZXR1cm4gdmFsdWU7XHJcblx0XHRpZiAodmFsdWU9PT11bmRlZmluZWQpIHJldHVybjtcclxuXHRcdHZhbHVlID0gIHZhbHVlLnJlcGxhY2UoL+KQoy9nLCcgJyk7XHJcblx0XHRjb25zdCB0cmltbWVkID0gdmFsdWUudHJpbSgpO1xyXG5cdFx0aWYgKGtleXdvcmRzW3RyaW1tZWRdKSByZXR1cm4gdHJpbW1lZDtcclxuXHRcdHJldHVybiB2YWx1ZTtcclxuXHR9XHJcblxyXG5cdC8vIGJldGFcclxuXHRjb25zdCBzdHlsZXNfb2ZfZ2V0dGVyX3Byb3BlcnRpZXMgPSB7fTtcclxuXHJcblx0ZnVuY3Rpb24gcGFyc2VSZXdyaXR0ZW5TdHlsZShzdHlsZSkgeyAvLyBsZXNzIG1lbW9yeSB0aGVuIHBhcmFtZXRlciBjc3NUZXh0P1xyXG5cclxuXHRcdC8vIGJldGFcclxuXHRcdHN0eWxlWyd6LWluZGV4J107IC8vIGllMTEgY2FuIGFjY2VzcyB1bmtub3duIHByb3BlcnRpZXMgaW4gc3R5bGVzaGVldHMgb25seSBpZiBhY2Nlc3NlZCBhIGRhc2hlZCBrbm93biBwcm9wZXJ0eVxyXG5cclxuXHRcdGNvbnN0IGNzc1RleHQgPSBzdHlsZS5jc3NUZXh0O1xyXG5cdFx0dmFyIG1hdGNoZXNHZXR0ZXJzID0gY3NzVGV4dC5tYXRjaChyZWdSdWxlSUVHZXR0ZXJzKSwgaiwgbWF0Y2g7XHJcblx0XHRpZiAobWF0Y2hlc0dldHRlcnMpIHtcclxuXHRcdFx0dmFyIGdldHRlcnMgPSBbXTsgLy8gZWcuIFtib3JkZXIsY29sb3JdXHJcblx0XHRcdGZvciAoaiA9IDA7IG1hdGNoID0gbWF0Y2hlc0dldHRlcnNbaisrXTspIHtcclxuXHRcdFx0XHRsZXQgcHJvcE5hbWUgPSBtYXRjaC5zbGljZSg3LCAtMSk7XHJcblx0XHRcdFx0aWYgKHByb3BOYW1lWzBdID09PSAn4p2XJykgcHJvcE5hbWUgPSBwcm9wTmFtZS5zdWJzdHIoMSk7XHJcblx0XHRcdFx0Z2V0dGVycy5wdXNoKHByb3BOYW1lKTtcclxuXHJcblx0XHRcdFx0Ly8gYmV0YVxyXG5cdFx0XHRcdGlmICghc3R5bGVzX29mX2dldHRlcl9wcm9wZXJ0aWVzW3Byb3BOYW1lXSkgc3R5bGVzX29mX2dldHRlcl9wcm9wZXJ0aWVzW3Byb3BOYW1lXSA9IFtdO1xyXG5cdFx0XHRcdHN0eWxlc19vZl9nZXR0ZXJfcHJvcGVydGllc1twcm9wTmFtZV0ucHVzaChzdHlsZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHZhciBtYXRjaGVzU2V0dGVycyA9IGNzc1RleHQubWF0Y2gocmVnUnVsZUlFU2V0dGVycyk7XHJcblx0XHRpZiAobWF0Y2hlc1NldHRlcnMpIHtcclxuXHRcdFx0dmFyIHNldHRlcnMgPSB7fTsgLy8gZWcuIFstLWNvbG9yOiNmZmYsIC0tcGFkZGluZzoxMHB4XTtcclxuXHRcdFx0Zm9yIChqID0gMDsgbWF0Y2ggPSBtYXRjaGVzU2V0dGVyc1tqKytdOykge1xyXG5cdFx0XHRcdGxldCB4ID0gbWF0Y2guc3Vic3RyKDQpLnNwbGl0KCc6Jyk7XHJcblx0XHRcdFx0bGV0IHByb3BOYW1lID0geFswXTtcclxuXHRcdFx0XHRsZXQgcHJvcFZhbHVlID0geFsxXTtcclxuXHRcdFx0XHRpZiAocHJvcE5hbWVbMF0gPT09ICfinZcnKSBwcm9wTmFtZSA9IHByb3BOYW1lLnN1YnN0cigxKTtcclxuXHRcdFx0XHRzZXR0ZXJzW3Byb3BOYW1lXSA9IHByb3BWYWx1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHtnZXR0ZXJzOmdldHRlcnMsIHNldHRlcnM6c2V0dGVyc307XHJcblx0fVxyXG5cdGZ1bmN0aW9uIGFjdGl2YXRlU3R5bGVFbGVtZW50KHN0eWxlLCBjc3MpIHtcclxuXHRcdHN0eWxlLmlubmVySFRNTCA9IGNzcztcclxuXHRcdHN0eWxlLmllQ1BfcG9seWZpbGxlZCA9IHRydWU7XHJcblx0XHR2YXIgcnVsZXMgPSBzdHlsZS5zaGVldC5ydWxlcywgaT0wLCBydWxlOyAvLyBjc3NSdWxlcyA9IENTU1J1bGVMaXN0LCBydWxlcyA9IE1TQ1NTUnVsZUxpc3RcclxuXHRcdHdoaWxlIChydWxlID0gcnVsZXNbaSsrXSkge1xyXG5cdFx0XHRjb25zdCBmb3VuZCA9IHBhcnNlUmV3cml0dGVuU3R5bGUocnVsZS5zdHlsZSk7XHJcblx0XHRcdGlmIChmb3VuZC5nZXR0ZXJzKSB7XHJcblx0XHRcdFx0YWRkR2V0dGVyc1NlbGVjdG9yKHJ1bGUuc2VsZWN0b3JUZXh0LCBmb3VuZC5nZXR0ZXJzKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoZm91bmQuc2V0dGVycykge1xyXG5cdFx0XHRcdHdpbmRvdy5jc3NWYXJpYWJsZXNbcnVsZS5zZWxlY3RvclRleHRdID0gT2JqZWN0LmtleXMoZm91bmQuc2V0dGVycykucmVkdWNlKChhY2MsIGNzc1ZhcmlhYmxlKSA9PiB7XHJcblx0XHRcdFx0XHRpZiAoIWZvdW5kLnNldHRlcnNbY3NzVmFyaWFibGVdLmluY2x1ZGVzKFwidmFyKC0tXCIpKSBhY2NbKCctLScgKyBjc3NWYXJpYWJsZSkudHJpbSgpXSA9IGZvdW5kLnNldHRlcnNbY3NzVmFyaWFibGVdLnRyaW0oKTtcclxuXHRcdFx0XHRcdHJldHVybiBhY2M7XHJcblx0XHRcdFx0fSwge30pO1xyXG5cdFx0XHRcdGFkZFNldHRlcnNTZWxlY3RvcihydWxlLnNlbGVjdG9yVGV4dCwgZm91bmQuc2V0dGVycyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIG1lZGlhUXVlcmllczogcmVkcmF3IHRoZSBob2xlIGRvY3VtZW50XHJcblx0XHRcdC8vIGJldHRlciBhZGQgZXZlbnRzIGZvciBlYWNoIGVsZW1lbnQ/XHJcblx0XHRcdGNvbnN0IG1lZGlhID0gcnVsZS5wYXJlbnRSdWxlICYmIHJ1bGUucGFyZW50UnVsZS5tZWRpYSAmJiBydWxlLnBhcmVudFJ1bGUubWVkaWEubWVkaWFUZXh0O1xyXG5cdFx0XHRpZiAobWVkaWEgJiYgKGZvdW5kLmdldHRlcnMgfHwgZm91bmQuc2V0dGVycykpIHtcclxuXHRcdFx0XHRtYXRjaE1lZGlhKG1lZGlhKS5hZGRMaXN0ZW5lcihmdW5jdGlvbigpe1xyXG5cdFx0XHRcdFx0ZHJhd1RyZWUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvLyBiZXRhXHJcblx0XHRyZWRyYXdTdHlsZVNoZWV0cygpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBhZGRHZXR0ZXJzU2VsZWN0b3Ioc2VsZWN0b3IsIHByb3BlcnRpZXMpIHtcclxuXHRcdHNlbGVjdG9yQWRkUHNldWRvTGlzdGVuZXJzKHNlbGVjdG9yKTtcclxuXHRcdG9uRWxlbWVudCh1blBzZXVkbyhzZWxlY3RvciksIGZ1bmN0aW9uIChlbCkge1xyXG5cdFx0XHRhZGRHZXR0ZXJFbGVtZW50KGVsLCBwcm9wZXJ0aWVzLCBzZWxlY3Rvcik7XHJcblx0XHRcdGRyYXdFbGVtZW50KGVsKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRmdW5jdGlvbiBhZGRHZXR0ZXJFbGVtZW50KGVsLCBwcm9wZXJ0aWVzLCBzZWxlY3Rvcikge1xyXG5cdFx0dmFyIGk9MCwgcHJvcCwgajtcclxuXHRcdGNvbnN0IHNlbGVjdG9ycyA9IHNlbGVjdG9yLnNwbGl0KCcsJyk7IC8vIHNwbGl0IGdyb3VwZWQgc2VsZWN0b3JzXHJcblx0XHRlbC5zZXRBdHRyaWJ1dGUoJ2llY3AtbmVlZGVkJywgdHJ1ZSk7XHJcblx0XHRpZiAoIWVsLmllQ1BTZWxlY3RvcnMpIGVsLmllQ1BTZWxlY3RvcnMgPSB7fTtcclxuXHRcdHdoaWxlIChwcm9wID0gcHJvcGVydGllc1tpKytdKSB7XHJcblx0XHRcdGZvciAoaiA9IDA7IHNlbGVjdG9yID0gc2VsZWN0b3JzW2orK107KSB7XHJcblx0XHRcdFx0Y29uc3QgcGFydHMgPSBzZWxlY3Rvci50cmltKCkuc3BsaXQoJzo6Jyk7XHJcblx0XHRcdFx0aWYgKCFlbC5pZUNQU2VsZWN0b3JzW3Byb3BdKSBlbC5pZUNQU2VsZWN0b3JzW3Byb3BdID0gW107XHJcblx0XHRcdFx0ZWwuaWVDUFNlbGVjdG9yc1twcm9wXS5wdXNoKHtcclxuXHRcdFx0XHRcdHNlbGVjdG9yOiBwYXJ0c1swXSxcclxuXHRcdFx0XHRcdHBzZXVkbzogcGFydHNbMV0gPyAnOjonICsgcGFydHNbMV0gOiAnJ1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdGZ1bmN0aW9uIGFkZFNldHRlcnNTZWxlY3RvcihzZWxlY3RvciwgcHJvcFZhbHMpIHtcclxuXHRcdHNlbGVjdG9yQWRkUHNldWRvTGlzdGVuZXJzKHNlbGVjdG9yKTtcclxuXHRcdG9uRWxlbWVudCh1blBzZXVkbyhzZWxlY3RvciksIGZ1bmN0aW9uIChlbCkge1xyXG5cdFx0XHRhZGRTZXR0ZXJFbGVtZW50KGVsLCBwcm9wVmFscyk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0ZnVuY3Rpb24gYWRkU2V0dGVyRWxlbWVudChlbCwgcHJvcFZhbHMpIHtcclxuXHRcdGlmICghZWwuaWVDUF9zZXR0ZXJzKSBlbC5pZUNQX3NldHRlcnMgPSB7fTtcclxuXHRcdGZvciAodmFyIHByb3AgaW4gcHJvcFZhbHMpIHsgLy8gZWcuIHtmb286I2ZmZiwgYmFyOmJhen1cclxuXHRcdFx0ZWwuaWVDUF9zZXR0ZXJzWyctLScgKyBwcm9wXSA9IDE7XHJcblx0XHR9XHJcblx0XHRkcmF3VHJlZShlbCk7XHJcblx0fVxyXG5cclxuXHQvL2JldGFcclxuXHRmdW5jdGlvbiByZWRyYXdTdHlsZVNoZWV0cygpIHtcclxuXHRcdGZvciAodmFyIHByb3AgaW4gc3R5bGVzX29mX2dldHRlcl9wcm9wZXJ0aWVzKSB7XHJcblx0XHRcdGxldCBzdHlsZXMgPSBzdHlsZXNfb2ZfZ2V0dGVyX3Byb3BlcnRpZXNbcHJvcF07XHJcblx0XHRcdGZvciAodmFyIGk9MCwgc3R5bGU7IHN0eWxlPXN0eWxlc1tpKytdOykge1xyXG5cdFx0XHRcdGlmIChzdHlsZS5vd25pbmdFbGVtZW50KSBjb250aW51ZTtcclxuXHRcdFx0XHR2YXIgdmFsdWUgPSBzdHlsZVsnLWllVmFyLScrcHJvcF07XHJcblx0XHRcdFx0aWYgKCF2YWx1ZSkgY29udGludWU7XHJcblx0XHRcdFx0dmFsdWUgPSBzdHlsZUNvbXB1dGVWYWx1ZVdpZHRoVmFycyhnZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCksIHZhbHVlKTtcclxuXHRcdFx0XHRpZiAodmFsdWUgPT09ICcnKSBjb250aW51ZTtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0c3R5bGVbcHJvcF0gPSB2YWx1ZTtcclxuXHRcdFx0XHR9IGNhdGNoKGUpIHt9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cclxuXHRjb25zdCBwc2V1ZG9zID0ge1xyXG5cdFx0aG92ZXI6e1xyXG5cdFx0XHRvbjonbW91c2VlbnRlcicsXHJcblx0XHRcdG9mZjonbW91c2VsZWF2ZSdcclxuXHRcdH0sXHJcblx0XHRmb2N1czp7XHJcblx0XHRcdG9uOidmb2N1c2luJyxcclxuXHRcdFx0b2ZmOidmb2N1c291dCdcclxuXHRcdH0sXHJcblx0XHRhY3RpdmU6e1xyXG5cdFx0XHRvbjonQ1NTQWN0aXZhdGUnLFxyXG5cdFx0XHRvZmY6J0NTU0RlYWN0aXZhdGUnXHJcblx0XHR9LFxyXG5cdH07XHJcblx0ZnVuY3Rpb24gc2VsZWN0b3JBZGRQc2V1ZG9MaXN0ZW5lcnMoc2VsZWN0b3Ipe1xyXG5cdFx0Ly8gaWUxMSBoYXMgdGhlIHN0cmFuZ2UgYmVoYXZvaXIsIHRoYXQgZ3JvdXBzIG9mIHNlbGVjdG9ycyBhcmUgaW5kaXZpZHVhbCBydWxlcywgYnV0IHN0YXJ0aW5nIHdpdGggdGhlIGZ1bGwgc2VsZWN0b3I6XHJcblx0XHQvLyB0ZCwgdGgsIGJ1dHRvbiB7IGNvbG9yOnJlZCB9IHJlc3VsdHMgaW4gdGhpcyBydWxlczpcclxuXHRcdC8vIFwidGQsIHRoLCBidXR0b25cIiB8IFwidGgsIHRoXCIgfCBcInRoXCJcclxuXHRcdHNlbGVjdG9yID0gc2VsZWN0b3Iuc3BsaXQoJywnKVswXTtcclxuXHRcdGZvciAodmFyIHBzZXVkbyBpbiBwc2V1ZG9zKSB7XHJcblx0XHRcdHZhciBwYXJ0cyA9IHNlbGVjdG9yLnNwbGl0KCc6Jytwc2V1ZG8pO1xyXG5cdFx0XHRpZiAocGFydHMubGVuZ3RoID4gMSkge1xyXG5cdFx0XHRcdHZhciBlbmRpbmcgPSBwYXJ0c1sxXS5tYXRjaCgvXlteXFxzXSovKTsgLy8gZW5kaW5nIGVsZW1lbnRwYXJ0IG9mIHNlbGVjdG9yICh1c2VkIGZvciBub3QoOmFjdGl2ZSkpXHJcblx0XHRcdFx0bGV0IHNlbCA9IHVuUHNldWRvKHBhcnRzWzBdK2VuZGluZyk7XHJcblx0XHRcdFx0Y29uc3QgbGlzdGVuZXJzID0gcHNldWRvc1twc2V1ZG9dO1xyXG5cdFx0XHRcdG9uRWxlbWVudChzZWwsIGZ1bmN0aW9uIChlbCkge1xyXG5cdFx0XHRcdFx0ZWwuYWRkRXZlbnRMaXN0ZW5lcihsaXN0ZW5lcnMub24sIGRyYXdUcmVlRXZlbnQpO1xyXG5cdFx0XHRcdFx0ZWwuYWRkRXZlbnRMaXN0ZW5lcihsaXN0ZW5lcnMub2ZmLCBkcmF3VHJlZUV2ZW50KTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH1cclxuXHRsZXQgQ1NTQWN0aXZlID0gbnVsbDtcclxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLGZ1bmN0aW9uKGUpe1xyXG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0XHRpZiAoZS50YXJnZXQgPT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpIHtcclxuXHRcdFx0XHR2YXIgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XHJcblx0XHRcdFx0ZXZ0LmluaXRFdmVudCgnQ1NTQWN0aXZhdGUnLCB0cnVlLCB0cnVlKTtcclxuXHRcdFx0XHRDU1NBY3RpdmUgPSBlLnRhcmdldDtcclxuXHRcdFx0XHRDU1NBY3RpdmUuZGlzcGF0Y2hFdmVudChldnQpO1xyXG5cdFx0XHR9XHJcblx0XHR9KVxyXG5cdH0pO1xyXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLGZ1bmN0aW9uKCl7XHJcblx0XHRpZiAoQ1NTQWN0aXZlKSB7XHJcblx0XHRcdHZhciBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcclxuXHRcdFx0ZXZ0LmluaXRFdmVudCgnQ1NTRGVhY3RpdmF0ZScsIHRydWUsIHRydWUpO1xyXG5cdFx0XHRDU1NBY3RpdmUuZGlzcGF0Y2hFdmVudChldnQpO1xyXG5cdFx0XHRDU1NBY3RpdmUgPSBudWxsO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHRmdW5jdGlvbiB1blBzZXVkbyhzZWxlY3Rvcil7XHJcblx0XHRyZXR1cm4gc2VsZWN0b3IucmVwbGFjZShyZWdQc2V1ZG9zLCcnKS5yZXBsYWNlKCc6bm90KCknLCcnKTtcclxuXHR9XHJcblxyXG5cdHZhciB1bmlxdWVDb3VudGVyID0gMDtcclxuXHJcblx0Lyogb2xkICpcclxuXHRmdW5jdGlvbiBfZHJhd0VsZW1lbnQoZWwpIHtcclxuXHRcdGlmICghZWwuaWVDUF91bmlxdWUpIHsgLy8gdXNlIGVsLnVuaXF1ZU51bWJlcj8gYnV0IG5lZWRzIGNsYXNzIGZvciB0aGUgY3NzLXNlbGVjdG9yID0+IHRlc3QgcGVyZm9ybWFuY2VcclxuXHRcdFx0ZWwuaWVDUF91bmlxdWUgPSArK3VuaXF1ZUNvdW50ZXI7XHJcblx0XHRcdGVsLmNsYXNzTGlzdC5hZGQoJ2llY3AtdScgKyBlbC5pZUNQX3VuaXF1ZSk7XHJcblx0XHR9XHJcblx0XHR2YXIgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsKTtcclxuXHRcdGlmIChlbC5pZUNQX3NoZWV0KSB3aGlsZSAoZWwuaWVDUF9zaGVldC5ydWxlc1swXSkgZWwuaWVDUF9zaGVldC5kZWxldGVSdWxlKDApO1xyXG5cdFx0Zm9yICh2YXIgcHJvcCBpbiBlbC5pZUNQU2VsZWN0b3JzKSB7XHJcblx0XHRcdHZhciBpbXBvcnRhbnQgPSBzdHlsZVsnLWllVmFyLeKdlycgKyBwcm9wXTtcclxuXHRcdFx0bGV0IHZhbHVlV2l0aFZhciA9IGltcG9ydGFudCB8fCBzdHlsZVsnLWllVmFyLScgKyBwcm9wXTtcclxuXHRcdFx0aWYgKCF2YWx1ZVdpdGhWYXIpIGNvbnRpbnVlOyAvLyB0b2RvLCB3aGF0IGlmICcwJ1xyXG5cclxuXHRcdFx0dmFyIGRldGFpbHMgPSB7fTtcclxuXHRcdFx0dmFyIHZhbHVlID0gc3R5bGVDb21wdXRlVmFsdWVXaWR0aFZhcnMoc3R5bGUsIHZhbHVlV2l0aFZhciwgZGV0YWlscyk7XHJcblxyXG5cdFx0XHRpZiAoaW1wb3J0YW50KSB2YWx1ZSArPSAnICFpbXBvcnRhbnQnO1xyXG5cdFx0XHRmb3IgKHZhciBpPTAsIGl0ZW07IGl0ZW09ZWwuaWVDUFNlbGVjdG9yc1twcm9wXVtpKytdOykgeyAvLyB0b2RvOiBzcGxpdCBhbmQgdXNlIHJlcXVlc3RBbmltYXRpb25GcmFtZT9cclxuXHRcdFx0XHRpZiAoaXRlbS5zZWxlY3RvciA9PT0gJyVzdHlsZUF0dHInKSB7XHJcblx0XHRcdFx0XHRlbC5zdHlsZVtwcm9wXSA9IHZhbHVlO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdFx0Ly8gYmV0YVxyXG5cdFx0XHRcdFx0aWYgKCFpbXBvcnRhbnQgJiYgZGV0YWlscy5hbGxCeVJvb3QgIT09IGZhbHNlKSBjb250aW51ZTsgLy8gZG9udCBoYXZlIHRvIGRyYXcgcm9vdC1wcm9wZXJ0aWVzXHJcblxyXG5cdFx0XHRcdFx0Ly9sZXQgc2VsZWN0b3IgPSBpdGVtLnNlbGVjdG9yLnJlcGxhY2UoLz4/IFxcLlteIF0rLywgJyAnLCBpdGVtLnNlbGVjdG9yKTsgLy8gdG9kbzogdHJ5IHRvIGVxdWFsaXplIHNwZWNpZmljaXR5XHJcblx0XHRcdFx0XHRsZXQgc2VsZWN0b3IgPSBpdGVtLnNlbGVjdG9yO1xyXG5cdFx0XHRcdFx0ZWxlbWVudFN0eWxlU2hlZXQoZWwpLmluc2VydFJ1bGUoc2VsZWN0b3IgKyAnLmllY3AtdScgKyBlbC5pZUNQX3VuaXF1ZSArIGl0ZW0ucHNldWRvICsgJyB7JyArIHByb3AgKyAnOicgKyB2YWx1ZSArICd9JywgMCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdGZ1bmN0aW9uIGVsZW1lbnRTdHlsZVNoZWV0KGVsKXtcclxuXHRcdGlmICghZWwuaWVDUF9zaGVldCkge1xyXG5cdFx0XHRjb25zdCBzdHlsZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcclxuXHRcdFx0c3R5bGVFbC5pZUNQX2VsZW1lbnRTaGVldCA9IDE7XHJcblx0XHRcdC8vZWwuYXBwZW5kQ2hpbGQoc3R5bGVFbCk7IC8vIHllcyEgc2VsZi1jbG9zaW5nIHRhZ3MgY2FuIGhhdmUgc3R5bGUgYXMgY2hpbGRyZW4sIGJ1dCAtIGlmIGkgc2V0IGlubmVySFRNTCwgdGhlIHN0eWxlc2hlZXQgaXMgbG9zdFxyXG5cdFx0XHRkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlRWwpO1xyXG5cdFx0XHRlbC5pZUNQX3NoZWV0ID0gc3R5bGVFbC5zaGVldDtcclxuXHRcdH1cclxuXHRcdHJldHVybiBlbC5pZUNQX3NoZWV0O1xyXG5cdH1cclxuXHJcblx0LyogKi9cclxuXHRmdW5jdGlvbiBfZHJhd0VsZW1lbnQoZWwpIHtcclxuXHRcdGlmICghZWwuaWVDUF91bmlxdWUpIHsgLy8gdXNlIGVsLnVuaXF1ZU51bWJlcj8gYnV0IG5lZWRzIGNsYXNzIGZvciB0aGUgY3NzLXNlbGVjdG9yID0+IHRlc3QgcGVyZm9ybWFuY2VcclxuXHRcdFx0ZWwuaWVDUF91bmlxdWUgPSArK3VuaXF1ZUNvdW50ZXI7XHJcblx0XHRcdGVsLmNsYXNzTGlzdC5hZGQoJ2llY3AtdScgKyBlbC5pZUNQX3VuaXF1ZSk7XHJcblx0XHR9XHJcblx0XHR2YXIgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsKTtcclxuXHRcdGxldCBjc3MgPSAnJztcclxuXHRcdGZvciAodmFyIHByb3AgaW4gZWwuaWVDUFNlbGVjdG9ycykge1xyXG5cdFx0XHR2YXIgaW1wb3J0YW50ID0gc3R5bGVbJy1pZVZhci3inZcnICsgcHJvcF07XHJcblx0XHRcdGxldCB2YWx1ZVdpdGhWYXIgPSBpbXBvcnRhbnQgfHwgc3R5bGVbJy1pZVZhci0nICsgcHJvcF07XHJcblx0XHRcdGlmICghdmFsdWVXaXRoVmFyKSBjb250aW51ZTsgLy8gdG9kbywgd2hhdCBpZiAnMCdcclxuXHRcdFx0dmFyIGRldGFpbHMgPSB7fTtcclxuXHRcdFx0dmFyIHZhbHVlID0gc3R5bGVDb21wdXRlVmFsdWVXaWR0aFZhcnMoc3R5bGUsIHZhbHVlV2l0aFZhciwgZGV0YWlscyk7XHJcblx0XHRcdC8vaWYgKHZhbHVlPT09J2luaXRpYWwnKSB2YWx1ZSA9IGluaXRpYWxzW3Byb3BdO1xyXG5cdFx0XHRpZiAoaW1wb3J0YW50KSB2YWx1ZSArPSAnICFpbXBvcnRhbnQnO1xyXG5cdFx0XHRmb3IgKHZhciBpPTAsIGl0ZW07IGl0ZW09ZWwuaWVDUFNlbGVjdG9yc1twcm9wXVtpKytdOykge1xyXG5cdFx0XHRcdC8vIHRvZG86IHNwbGl0IGFuZCB1c2UgcmVxdWVzdEFuaW1hdGlvbkZyYW1lP1xyXG5cdFx0XHRcdGlmIChpdGVtLnNlbGVjdG9yID09PSAnJXN0eWxlQXR0cicpIHtcclxuXHRcdFx0XHRcdGVsLnN0eWxlW3Byb3BdID0gdmFsdWU7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdFx0XHQvLyBiZXRhXHJcblx0XHRcdFx0XHRpZiAoIWltcG9ydGFudCAmJiBkZXRhaWxzLmFsbEJ5Um9vdCAhPT0gZmFsc2UpIGNvbnRpbnVlOyAvLyBkb250IGhhdmUgdG8gZHJhdyByb290LXByb3BlcnRpZXNcclxuXHJcblx0XHRcdFx0XHQvL2xldCBzZWxlY3RvciA9IGl0ZW0uc2VsZWN0b3IucmVwbGFjZSgvPj8gXFwuW14gXSsvLCAnICcsIGl0ZW0uc2VsZWN0b3IpOyAvLyB0b2RvOiB0cnkgdG8gZXF1YWxpemUgc3BlY2lmaWNpdHlcclxuXHRcdFx0XHRcdGxldCBzZWxlY3RvciA9IGl0ZW0uc2VsZWN0b3I7XHJcblx0XHRcdFx0XHRjc3MgKz0gc2VsZWN0b3IgKyAnLmllY3AtdScgKyBlbC5pZUNQX3VuaXF1ZSArIGl0ZW0ucHNldWRvICsgJ3snICsgcHJvcCArICc6JyArIHZhbHVlICsgJ31cXG4nO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxlbWVudFNldENzcyhlbCwgY3NzKTtcclxuXHR9XHJcblx0ZnVuY3Rpb24gZWxlbWVudFNldENzcyhlbCwgY3NzKXtcclxuXHRcdGlmICghZWwuaWVDUF9zdHlsZUVsICYmIGNzcykge1xyXG5cdFx0XHRjb25zdCBzdHlsZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcclxuXHRcdFx0c3R5bGVFbC5pZUNQX2VsZW1lbnRTaGVldCA9IDE7XHJcblx0XHRcdC8vZWwuYXBwZW5kQ2hpbGQoc3R5bGVFbCk7IC8vIHllcyEgc2VsZi1jbG9zaW5nIHRhZ3MgY2FuIGhhdmUgc3R5bGUgYXMgY2hpbGRyZW4sIGJ1dCAtIGlmIGkgc2V0IGlubmVySFRNTCwgdGhlIHN0eWxlc2hlZXQgaXMgbG9zdFxyXG5cdFx0XHRkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlRWwpO1xyXG5cdFx0XHRlbC5pZUNQX3N0eWxlRWwgPSBzdHlsZUVsO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGVsLmllQ1Bfc3R5bGVFbCkge1xyXG5cdFx0XHRlbC5pZUNQX3N0eWxlRWwuaW5uZXJIVE1MID0gY3NzO1xyXG5cdFx0fVxyXG5cdH1cclxuXHQvKiAqL1xyXG5cclxuXHRmdW5jdGlvbiBkcmF3VHJlZSh0YXJnZXQpIHtcclxuXHRcdGlmICghdGFyZ2V0KSByZXR1cm47XHJcblx0XHR2YXIgZWxzID0gdGFyZ2V0LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tpZWNwLW5lZWRlZF0nKTtcclxuXHRcdGlmICh0YXJnZXQuaGFzQXR0cmlidXRlICYmIHRhcmdldC5oYXNBdHRyaWJ1dGUoJ2llY3AtbmVlZGVkJykpIGRyYXdFbGVtZW50KHRhcmdldCk7IC8vIHNlbGZcclxuXHRcdGZvciAodmFyIGkgPSAwLCBlbDsgZWwgPSBlbHNbaSsrXTspIHtcclxuXHRcdFx0ZHJhd0VsZW1lbnQoZWwpOyAvLyB0cmVlXHJcblx0XHR9XHJcblx0fVxyXG5cdC8vIGRyYXcgcXVldWVcclxuXHRsZXQgZHJhd1F1ZXVlID0gbmV3IFNldCgpO1xyXG5cdGxldCBjb2xsZWN0aW5nID0gZmFsc2U7XHJcblx0bGV0IGRyYXdpbmcgPSBmYWxzZTtcclxuXHRmdW5jdGlvbiBkcmF3RWxlbWVudChlbCl7XHJcblx0XHRkcmF3UXVldWUuYWRkKGVsKTtcclxuXHRcdGlmIChjb2xsZWN0aW5nKSByZXR1cm47XHJcblx0XHRjb2xsZWN0aW5nID0gdHJ1ZTtcclxuXHRcdHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpe1xyXG5cdFx0Ly9zZXRJbW1lZGlhdGUoZnVuY3Rpb24oKXtcclxuXHRcdFx0Y29sbGVjdGluZyA9IGZhbHNlO1xyXG5cdFx0XHRkcmF3aW5nID0gdHJ1ZTtcclxuXHRcdFx0ZHJhd1F1ZXVlLmZvckVhY2goX2RyYXdFbGVtZW50KTtcclxuXHRcdFx0ZHJhd1F1ZXVlLmNsZWFyKCk7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXsgLy8gbXV0YXRpb25PYnNlcnZlciB3aWxsIHRyaWdnZXIgZGVsYXllZCwgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIHdpbGwgbWlzcyBzb21lIGNoYW5nZXNcclxuXHRcdFx0XHRkcmF3aW5nID0gZmFsc2U7XHJcblx0XHRcdH0pXHJcblx0XHR9KVxyXG5cdH1cclxuXHJcblxyXG5cdGZ1bmN0aW9uIGRyYXdUcmVlRXZlbnQoZSkge1xyXG5cdFx0ZHJhd1RyZWUoZS50YXJnZXQpXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBmaW5kVmFycyhzdHIsIGNiKXsgLy8gY3NzIHZhbHVlIHBhcnNlclxyXG5cdFx0bGV0IGxldmVsPTAsIG9wZW5lZExldmVsPW51bGwsIGxhc3RQb2ludD0wLCBuZXdTdHIgPSAnJywgaT0wLCBjaGFyLCBpbnNpZGVDYWxjO1xyXG5cdFx0d2hpbGUgKGNoYXI9c3RyW2krK10pIHtcclxuXHRcdFx0aWYgKGNoYXIgPT09ICcoJykge1xyXG5cdFx0XHRcdCsrbGV2ZWw7XHJcblx0XHRcdFx0aWYgKG9wZW5lZExldmVsID09PSBudWxsICYmIHN0cltpLTRdK3N0cltpLTNdK3N0cltpLTJdID09PSAndmFyJykge1xyXG5cdFx0XHRcdFx0b3BlbmVkTGV2ZWwgPSBsZXZlbDtcclxuXHRcdFx0XHRcdG5ld1N0ciArPSBzdHIuc3Vic3RyaW5nKGxhc3RQb2ludCwgaS00KTtcclxuXHRcdFx0XHRcdGxhc3RQb2ludCA9IGk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChzdHJbaS01XStzdHJbaS00XStzdHJbaS0zXStzdHJbaS0yXSA9PT0gJ2NhbGMnKSB7XHJcblx0XHRcdFx0XHRpbnNpZGVDYWxjID0gbGV2ZWw7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChjaGFyID09PSAnKScgJiYgb3BlbmVkTGV2ZWwgPT09IGxldmVsKSB7XHJcblx0XHRcdFx0bGV0IHZhcmlhYmxlID0gc3RyLnN1YnN0cmluZyhsYXN0UG9pbnQsIGktMSkudHJpbSgpLCBmYWxsYmFjaztcclxuXHRcdFx0XHRsZXQgeCA9IHZhcmlhYmxlLmluZGV4T2YoJywnKTtcclxuXHRcdFx0XHRpZiAoeCE9PS0xKSB7XHJcblx0XHRcdFx0XHRmYWxsYmFjayA9IHZhcmlhYmxlLnNsaWNlKHgrMSk7XHJcblx0XHRcdFx0XHR2YXJpYWJsZSA9IHZhcmlhYmxlLnNsaWNlKDAseCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5ld1N0ciArPSBjYih2YXJpYWJsZSwgZmFsbGJhY2ssIGluc2lkZUNhbGMpO1xyXG5cdFx0XHRcdGxhc3RQb2ludCA9IGk7XHJcblx0XHRcdFx0b3BlbmVkTGV2ZWwgPSBudWxsO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChjaGFyID09PSAnKScpIHtcclxuXHRcdFx0XHQtLWxldmVsO1xyXG5cdFx0XHRcdGlmIChpbnNpZGVDYWxjID09PSBsZXZlbCkgaW5zaWRlQ2FsYyA9IG51bGw7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdG5ld1N0ciArPSBzdHIuc3Vic3RyaW5nKGxhc3RQb2ludCk7XHJcblx0XHRyZXR1cm4gbmV3U3RyO1xyXG5cdH1cclxuXHRmdW5jdGlvbiBzdHlsZUNvbXB1dGVWYWx1ZVdpZHRoVmFycyhzdHlsZSwgdmFsdWVXaXRoVmFycywgZGV0YWlscyl7XHJcblx0XHRyZXR1cm4gZmluZFZhcnModmFsdWVXaXRoVmFycywgZnVuY3Rpb24odmFyaWFibGUsIGZhbGxiYWNrLCBpbnNpZGVDYWxjKXtcclxuXHRcdFx0dmFyIHZhbHVlID0gc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSh2YXJpYWJsZSk7XHJcblx0XHRcdGlmIChpbnNpZGVDYWxjKSB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL15jYWxjXFwoLywgJygnKTsgLy8gcHJldmVudCBuZXN0ZWQgY2FsY1xyXG5cdFx0XHRpZiAoZGV0YWlscyAmJiBzdHlsZS5sYXN0UHJvcGVydHlTZXJ2ZWRCeSAhPT0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KSBkZXRhaWxzLmFsbEJ5Um9vdCA9IGZhbHNlO1xyXG5cdFx0XHRpZiAodmFsdWU9PT0nJyAmJiBmYWxsYmFjaykgdmFsdWUgPSBzdHlsZUNvbXB1dGVWYWx1ZVdpZHRoVmFycyhzdHlsZSwgZmFsbGJhY2ssIGRldGFpbHMpO1xyXG5cdFx0XHRyZXR1cm4gdmFsdWU7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdC8vIG11dGF0aW9uIGxpc3RlbmVyXHJcblx0dmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24obXV0YXRpb25zKSB7XHJcblx0XHRpZiAoZHJhd2luZykgcmV0dXJuO1xyXG5cdFx0Zm9yICh2YXIgaT0wLCBtdXRhdGlvbjsgbXV0YXRpb249bXV0YXRpb25zW2krK107KSB7XHJcblx0XHRcdGlmIChtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lID09PSAnaWVjcC1uZWVkZWQnKSBjb250aW51ZTsgLy8gd2h5P1xyXG5cdFx0XHQvLyByZWNoZWNrIGFsbCBzZWxlY3RvcnMgaWYgaXQgdGFyZ2V0cyBuZXcgZWxlbWVudHM/XHJcblx0XHRcdGRyYXdUcmVlKG11dGF0aW9uLnRhcmdldCk7XHJcblx0XHR9XHJcblx0fSk7XHJcblx0c2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0b2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudCx7YXR0cmlidXRlczogdHJ1ZSwgc3VidHJlZTogdHJ1ZSB9KTtcclxuXHR9KVxyXG5cclxuXHQvLyA6dGFyZ2V0IGxpc3RlbmVyXHJcblx0dmFyIG9sZEhhc2ggPSBsb2NhdGlvbi5oYXNoXHJcblx0YWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsZnVuY3Rpb24oZSl7XHJcblx0XHR2YXIgbmV3RWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChsb2NhdGlvbi5oYXNoLnN1YnN0cigxKSk7XHJcblx0XHRpZiAobmV3RWwpIHtcclxuXHRcdFx0dmFyIG9sZEVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQob2xkSGFzaC5zdWJzdHIoMSkpO1xyXG5cdFx0XHRkcmF3VHJlZShuZXdFbCk7XHJcblx0XHRcdGRyYXdUcmVlKG9sZEVsKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGRyYXdUcmVlKGRvY3VtZW50KTtcclxuXHRcdH1cclxuXHRcdG9sZEhhc2ggPSBsb2NhdGlvbi5oYXNoO1xyXG5cdH0pO1xyXG5cclxuXHQvLyBhZGQgb3duaW5nRWxlbWVudCB0byBFbGVtZW50LnN0eWxlXHJcblx0dmFyIGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKEhUTUxFbGVtZW50LnByb3RvdHlwZSwgJ3N0eWxlJyk7XHJcblx0dmFyIHN0eWxlR2V0dGVyID0gZGVzY3JpcHRvci5nZXQ7XHJcblx0ZGVzY3JpcHRvci5nZXQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRjb25zdCBzdHlsZSA9IHN0eWxlR2V0dGVyLmNhbGwodGhpcyk7XHJcblx0XHRzdHlsZS5vd25pbmdFbGVtZW50ID0gdGhpcztcclxuXHRcdHJldHVybiBzdHlsZTtcclxuXHR9XHJcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KEhUTUxFbGVtZW50LnByb3RvdHlwZSwgJ3N0eWxlJywgZGVzY3JpcHRvcik7XHJcblxyXG5cdC8vIGFkZCBjb21wdXRlZEZvciB0byBjb21wdXRlZCBzdHlsZS1vYmplY3RzXHJcblx0dmFyIG9yaWdpbmFsR2V0Q29tcHV0ZWQgPSBnZXRDb21wdXRlZFN0eWxlO1xyXG5cdHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlID0gZnVuY3Rpb24gKGVsKSB7XHJcblx0XHR2YXIgc3R5bGUgPSBvcmlnaW5hbEdldENvbXB1dGVkLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblx0XHRzdHlsZS5jb21wdXRlZEZvciA9IGVsO1xyXG5cdFx0Ly9zdHlsZS5wc2V1ZG9FbHQgPSBwc2V1ZG9FbHQ7IC8vbm90IG5lZWRlZCBhdCB0aGUgbW9tZW50XHJcblx0XHRyZXR1cm4gc3R5bGU7XHJcblx0fVxyXG5cclxuXHQvLyBnZXRQcm9wZXJ0eVZhbHVlIC8gc2V0UHJvcGVydHkgaG9va3NcclxuXHRjb25zdCBTdHlsZVByb3RvID0gQ1NTU3R5bGVEZWNsYXJhdGlvbi5wcm90b3R5cGU7XHJcblxyXG5cdGNvbnN0IG9sZEdldFAgPSBTdHlsZVByb3RvLmdldFByb3BlcnR5VmFsdWU7XHJcblx0U3R5bGVQcm90by5nZXRQcm9wZXJ0eVZhbHVlID0gZnVuY3Rpb24gKHByb3BlcnR5KSB7XHJcblx0XHR0aGlzLmxhc3RQcm9wZXJ0eVNlcnZlZEJ5ID0gZmFsc2U7XHJcblx0XHRwcm9wZXJ0eSA9IHByb3BlcnR5LnRyaW0oKTtcclxuXHJcblx0XHQvKiAqXHJcblx0XHRpZiAodGhpcy5vd25pbmdFbGVtZW50KSB7XHJcblx0XHRcdGNvbnN0IGllUHJvcGVydHkgPSAnLWllVmFyLScrcHJvcGVydHk7XHJcblx0XHRcdGNvbnN0IGllUHJvcGVydHlJbXBvcnRhbnQgPSAnLWllVmFyLeKdlycrcHJvcGVydHk7XHJcblx0XHRcdGxldCB2YWx1ZSA9IHRoaXNbaWVQcm9wZXJ0eUltcG9ydGFudF0gfHwgdGhpc1tpZVByb3BlcnR5XTtcclxuXHRcdFx0aWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHQvLyB0b2RvLCB0ZXN0IGlmIHN5bnRheCB2YWxpZFxyXG5cdFx0XHRcdHJldHVybiB2YWx1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0LyogKi9cclxuXHJcblx0XHRpZiAocHJvcGVydHlbMF0gIT09ICctJyB8fCBwcm9wZXJ0eVsxXSAhPT0gJy0nKSByZXR1cm4gb2xkR2V0UC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG5cdFx0Y29uc3QgdW5kYXNoZWQgPSBwcm9wZXJ0eS5zdWJzdHIoMik7XHJcblx0XHRjb25zdCBpZVByb3BlcnR5ID0gJy1pZS0nK3VuZGFzaGVkO1xyXG5cdFx0Y29uc3QgaWVQcm9wZXJ0eUltcG9ydGFudCA9ICctaWUt4p2XJyt1bmRhc2hlZDtcclxuXHRcdGxldCB2YWx1ZSA9IGRlY29kZVZhbHVlKHRoaXNbaWVQcm9wZXJ0eUltcG9ydGFudF0gfHwgdGhpc1tpZVByb3BlcnR5XSk7XHJcblxyXG5cdFx0aWYgKHRoaXMuY29tcHV0ZWRGb3IpIHsgLy8gY29tcHV0ZWRTdHlsZVxyXG5cdFx0XHRpZiAodmFsdWUgIT09IHVuZGVmaW5lZCAmJiAhaW5oZXJpdGluZ0tleXdvcmRzW3ZhbHVlXSkge1xyXG5cdFx0XHRcdC8vaWYgKHJlZ0hhc1Zhci50ZXN0KHZhbHVlKSkgIC8vIHRvZG86IHRvIGkgbmVlZCB0aGlzIGNoZWNrPyEhISBpIHRoaW5rIGl0cyBmYXN0ZXIgd2l0aG91dFxyXG5cdFx0XHRcdFx0dmFsdWUgPSBzdHlsZUNvbXB1dGVWYWx1ZVdpZHRoVmFycyh0aGlzLCB2YWx1ZSk7XHJcblx0XHRcdFx0dGhpcy5sYXN0UHJvcGVydHlTZXJ2ZWRCeSA9IHRoaXMuY29tcHV0ZWRGb3I7XHJcblx0XHRcdH0gZWxzZSB7IC8vIGluaGVyaXRlZFxyXG5cdFx0XHRcdGlmIChpbmhlcml0aW5nS2V5d29yZHNbdmFsdWVdIHx8ICFyZWdpc3Rlcltwcm9wZXJ0eV0gfHwgcmVnaXN0ZXJbcHJvcGVydHldLmluaGVyaXRzKSB7XHJcblx0XHRcdFx0XHQvL2xldCBlbCA9IHRoaXMucHNldWRvRWx0ID8gdGhpcy5jb21wdXRlZEZvciA6IHRoaXMuY29tcHV0ZWRGb3IucGFyZW50Tm9kZTtcclxuXHRcdFx0XHRcdGxldCBlbCA9IHRoaXMuY29tcHV0ZWRGb3IucGFyZW50Tm9kZTtcclxuXHRcdFx0XHRcdHdoaWxlIChlbC5ub2RlVHlwZSA9PT0gMSkge1xyXG5cdFx0XHRcdFx0XHQvLyBob3cgc2xvd2VyIHdvdWxkIGl0IGJlIHRvIGdldENvbXB1dGVkU3R5bGUgZm9yIGV2ZXJ5IGVsZW1lbnQsIG5vdCBqdXN0IHdpdGggZGVmaW5lZCBpZUNQX3NldHRlcnNcclxuXHRcdFx0XHRcdFx0aWYgKGVsLmllQ1Bfc2V0dGVycyAmJiBlbC5pZUNQX3NldHRlcnNbcHJvcGVydHldKSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gaSBjb3VsZCBtYWtlXHJcblx0XHRcdFx0XHRcdFx0Ly8gdmFsdWUgPSBlbC5ub2RlVHlwZSA/IGdldENvbXB1dGVkU3R5bGUodGhpcy5jb21wdXRlZEZvci5wYXJlbnROb2RlKS5nZXRQcm9wZXJ0eVZhbHVlKHByb3BlcnR5KVxyXG5cdFx0XHRcdFx0XHRcdC8vIGJ1dCBpIGZlYXIgcGVyZm9ybWFuY2UsIHN0dXBpZD9cclxuXHRcdFx0XHRcdFx0XHR2YXIgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsKTtcclxuXHRcdFx0XHRcdFx0XHR2YXIgdG1wVmFsID0gZGVjb2RlVmFsdWUoc3R5bGVbaWVQcm9wZXJ0eUltcG9ydGFudF0gfHwgc3R5bGVbaWVQcm9wZXJ0eV0pO1xyXG5cdFx0XHRcdFx0XHRcdGlmICh0bXBWYWwgIT09IHVuZGVmaW5lZCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY2FsY3VsYXRlZCBzdHlsZSBmcm9tIGN1cnJlbnQgZWxlbWVudCBub3QgZnJvbSB0aGUgZWxlbWVudCB0aGUgdmFsdWUgd2FzIGluaGVyaXRlZCBmcm9tISAoc3R5bGUsIHZhbHVlKVxyXG5cdFx0XHRcdFx0XHRcdFx0Ly92YWx1ZSA9IHRtcFZhbDsgaWYgKHJlZ0hhc1Zhci50ZXN0KHRtcFZhbCkpICAvLyB0b2RvOiB0byBpIG5lZWQgdGhpcyBjaGVjaz8hISEgaSB0aGluayBpdHMgZmFzdGVyIHdpdGhvdXRcclxuXHRcdFx0XHRcdFx0XHRcdFx0dmFsdWUgPSBzdHlsZUNvbXB1dGVWYWx1ZVdpZHRoVmFycyh0aGlzLCB0bXBWYWwpO1xyXG5cdFx0XHRcdFx0XHRcdFx0dGhpcy5sYXN0UHJvcGVydHlTZXJ2ZWRCeSA9IGVsO1xyXG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGVsID0gZWwucGFyZW50Tm9kZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHZhbHVlPT09J2luaXRpYWwnKSByZXR1cm4gJyc7XHJcblx0XHR9XHJcblx0XHQvL2lmICgodmFsdWUgPT09IHVuZGVmaW5lZCB8fCB2YWx1ZSA9PT0gJ2luaXRpYWwnKSAmJiByZWdpc3Rlcltwcm9wZXJ0eV0pIHZhbHVlID0gcmVnaXN0ZXJbcHJvcGVydHldLmluaXRpYWxWYWx1ZTsgLy8gdG9kbz9cclxuXHRcdGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkICYmIHJlZ2lzdGVyW3Byb3BlcnR5XSkgdmFsdWUgPSByZWdpc3Rlcltwcm9wZXJ0eV0uaW5pdGlhbFZhbHVlO1xyXG5cdFx0aWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHJldHVybiAnJztcclxuXHRcdHJldHVybiB2YWx1ZTtcclxuXHR9O1xyXG5cdGNvbnN0IGluaGVyaXRpbmdLZXl3b3JkcyA9IHtpbmhlcml0OjEscmV2ZXJ0OjEsdW5zZXQ6MX07XHJcblxyXG5cdGNvbnN0IG9sZFNldFAgPSBTdHlsZVByb3RvLnNldFByb3BlcnR5O1xyXG5cdFN0eWxlUHJvdG8uc2V0UHJvcGVydHkgPSBmdW5jdGlvbiAocHJvcGVydHksIHZhbHVlLCBwcmlvKSB7XHJcblx0XHRpZiAocHJvcGVydHlbMF0gIT09ICctJyB8fCBwcm9wZXJ0eVsxXSAhPT0gJy0nKSByZXR1cm4gb2xkU2V0UC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG5cdFx0Y29uc3QgZWwgPSB0aGlzLm93bmluZ0VsZW1lbnQ7XHJcblx0XHRpZiAoZWwpIHtcclxuXHRcdFx0aWYgKCFlbC5pZUNQX3NldHRlcnMpIGVsLmllQ1Bfc2V0dGVycyA9IHt9O1xyXG5cdFx0XHRlbC5pZUNQX3NldHRlcnNbcHJvcGVydHldID0gMTtcclxuXHRcdH1cclxuXHRcdHByb3BlcnR5ID0gJy1pZS0nKyhwcmlvPT09J2ltcG9ydGFudCc/J+Kdlyc6JycpICsgcHJvcGVydHkuc3Vic3RyKDIpO1xyXG5cdFx0dGhpcy5jc3NUZXh0ICs9ICc7ICcgKyBwcm9wZXJ0eSArICc6JyArIGVuY29kZVZhbHVlKHZhbHVlKSArICc7JztcclxuXHRcdC8vdGhpc1twcm9wZXJ0eV0gPSB2YWx1ZTtcclxuXHRcdGVsID09PSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiYgcmVkcmF3U3R5bGVTaGVldHMoKTtcclxuXHRcdGVsICYmIGRyYXdUcmVlKGVsKTsgLy8gaXRzIGRlbGF5ZWQgaW50ZXJuYWxcclxuXHR9O1xyXG5cclxuXHJcblx0LypcclxuXHR2YXIgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoU3R5bGVQcm90bywgJ2Nzc1RleHQnKTtcclxuXHR2YXIgY3NzVGV4dEdldHRlciA9IGRlc2NyaXB0b3IuZ2V0O1xyXG5cdHZhciBjc3NUZXh0U2V0dGVyID0gZGVzY3JpcHRvci5zZXQ7XHJcblx0Ly8gZGVzY3JpcHRvci5nZXQgPSBmdW5jdGlvbiAoKSB7XHJcblx0Ly8gXHRjb25zdCBzdHlsZSA9IHN0eWxlR2V0dGVyLmNhbGwodGhpcyk7XHJcblx0Ly8gXHRzdHlsZS5vd25pbmdFbGVtZW50ID0gdGhpcztcclxuXHQvLyBcdHJldHVybiBzdHlsZTtcclxuXHQvLyB9XHJcblx0ZGVzY3JpcHRvci5zZXQgPSBmdW5jdGlvbiAoY3NzKSB7XHJcblx0XHR2YXIgZWwgPSB0aGlzLm93bmluZ0VsZW1lbnQ7XHJcblx0XHRpZiAoZWwpIHtcclxuXHRcdFx0Y3NzID0gcmV3cml0ZUNzcygneycrY3NzKS5zdWJzdHIoMSk7XHJcblx0XHRcdGNzc1RleHRTZXR0ZXIuY2FsbCh0aGlzLCBjc3MpO1xyXG5cdFx0XHR2YXIgZm91bmQgPSBwYXJzZVJld3JpdHRlblN0eWxlKHRoaXMpO1xyXG5cdFx0XHRpZiAoZm91bmQuZ2V0dGVycykgYWRkR2V0dGVyRWxlbWVudChlbCwgZm91bmQuZ2V0dGVycywgJyVzdHlsZUF0dHInKTtcclxuXHRcdFx0aWYgKGZvdW5kLnNldHRlcnMpIGFkZFNldHRlckVsZW1lbnQoZWwsIGZvdW5kLnNldHRlcnMpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY3NzVGV4dFNldHRlci5jYWxsKHRoaXMsIGNzcyk7XHJcblx0fVxyXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdHlsZVByb3RvLCAnY3NzVGV4dCcsIGRlc2NyaXB0b3IpO1xyXG5cdCovXHJcblxyXG5cclxuXHRpZiAoIXdpbmRvdy5DU1MpIHdpbmRvdy5DU1MgPSB7fTtcclxuXHRjb25zdCByZWdpc3RlciA9IHt9XHJcblx0Q1NTLnJlZ2lzdGVyUHJvcGVydHkgPSBmdW5jdGlvbihvcHRpb25zKXtcclxuXHRcdHJlZ2lzdGVyW29wdGlvbnMubmFtZV0gPSBvcHRpb25zO1xyXG5cdH1cclxuXHJcblx0Ly8gZml4IFwiaW5pdGlhbFwiIGtleXdvcmQgd2l0aCBnZW5lcmF0ZWQgY3VzdG9tIHByb3BlcnRpZXMsIHRoaXMgaXMgbm90IHN1cHBvcnRlZCBhZCBhbGwgYnkgaWUsIHNob3VsZCBpIG1ha2UgYSBzZXBhcmF0ZSBcImluaGVyaXRcIi1wb2x5ZmlsbD9cclxuXHQvKlxyXG5cdGNvbnN0IGNvbXB1dGVkID0gZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpXHJcblx0Y29uc3QgaW5pdGlhbHMgPSB7fTtcclxuXHRmb3IgKGxldCBpIGluIGNvbXB1dGVkKSB7XHJcblx0XHRpbml0aWFsc1tpLnJlcGxhY2UoLyhbQS1aXSkvLCBmdW5jdGlvbih4KXsgcmV0dXJuICctJyt4LnRvTG93ZXJDYXNlKHgpIH0pXSA9IGNvbXB1dGVkW2ldO1xyXG5cdH1cclxuXHRpbml0aWFsc1snZGlzcGxheSddID0gJ2lubGluZSc7XHJcblx0Ki9cclxuXHJcblx0Ly8gdXRpbHNcclxuXHRmdW5jdGlvbiBmZXRjaENzcyh1cmwsIGNhbGxiYWNrKSB7XHJcblx0XHR2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cdFx0cmVxdWVzdC5vcGVuKCdHRVQnLCB1cmwpO1xyXG5cdFx0cmVxdWVzdC5vdmVycmlkZU1pbWVUeXBlKCd0ZXh0L2NzcycpO1xyXG5cdFx0cmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGlmIChyZXF1ZXN0LnN0YXR1cyA+PSAyMDAgJiYgcmVxdWVzdC5zdGF0dXMgPCA0MDApIHtcclxuXHRcdFx0XHRjYWxsYmFjayhyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0XHRyZXF1ZXN0LnNlbmQoKTtcclxuXHR9XHJcblxyXG59KCk7XHJcbiJdLCJuYW1lcyI6WyJ3aW5kb3ciLCJ0ZXN0RWwiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJzdHlsZSIsInNldFByb3BlcnR5IiwiZ2V0UHJvcGVydHlWYWx1ZSIsIm1zTWF0Y2hlc1NlbGVjdG9yIiwiRWxlbWVudCIsInByb3RvdHlwZSIsIm1hdGNoZXMiLCJsaXN0ZW5lcnMiLCJyb290IiwiT2JzZXJ2ZXIiLCJxc2EiLCJlbCIsInNlbGVjdG9yIiwicXVlcnlTZWxlY3RvckFsbCIsImUiLCJvbkVsZW1lbnQiLCJjYWxsYmFjayIsImxpc3RlbmVyIiwiZWxlbWVudHMiLCJXZWFrTWFwIiwiZWxzIiwiaSIsInNldCIsImNhbGwiLCJwdXNoIiwiTXV0YXRpb25PYnNlcnZlciIsImNoZWNrTXV0YXRpb25zIiwib2JzZXJ2ZSIsImNoaWxkTGlzdCIsInN1YnRyZWUiLCJjaGVja0xpc3RlbmVyIiwidGFyZ2V0IiwibG9hZGVkIiwiQXJyYXkiLCJhcHBseSIsImhhcyIsImNoZWNrTGlzdGVuZXJzIiwiaW5zaWRlIiwibXV0YXRpb25zIiwiaiIsIm11dGF0aW9uIiwibm9kZXMiLCJhZGRlZE5vZGVzIiwibm9kZVR5cGUiLCJhZGRFdmVudExpc3RlbmVyIiwiY29weVByb3BlcnR5IiwicHJvcCIsImZyb20iLCJ0byIsImRlc2MiLCJPYmplY3QiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJkZWZpbmVQcm9wZXJ0eSIsIkhUTUxFbGVtZW50IiwiU1ZHU3R5bGVFbGVtZW50IiwiZ2V0IiwiYWxsIiwic3R5bGVTaGVldHMiLCJzaGVldCIsIm93bmVyTm9kZSIsInJlZ0ZpbmRTZXR0ZXJzIiwicmVnRmluZEdldHRlcnMiLCJyZWdSdWxlSUVHZXR0ZXJzIiwicmVnUnVsZUlFU2V0dGVycyIsInJlZ1BzZXVkb3MiLCJmZXRjaENzcyIsImhyZWYiLCJjc3MiLCJuZXdDc3MiLCJyZXdyaXRlQ3NzIiwicmVsVG9BYnMiLCJkaXNhYmxlZCIsIm1lZGlhIiwic2V0QXR0cmlidXRlIiwicGFyZW50Tm9kZSIsImluc2VydEJlZm9yZSIsImFjdGl2YXRlU3R5bGVFbGVtZW50IiwiZm91bmRTdHlsZSIsImllQ1BfcG9seWZpbGxlZCIsImllQ1BfZWxlbWVudFNoZWV0IiwiaW5uZXJIVE1MIiwiZ2V0QXR0cmlidXRlIiwic3Vic3RyIiwiY3NzVGV4dCIsImZvdW5kIiwicGFyc2VSZXdyaXR0ZW5TdHlsZSIsImdldHRlcnMiLCJhZGRHZXR0ZXJFbGVtZW50Iiwic2V0dGVycyIsImFkZFNldHRlckVsZW1lbnQiLCJiYXNlIiwicmVwbGFjZSIsIiQwIiwiJDEiLCJ0cmltIiwibWF0Y2giLCIkMiIsIiQzIiwiJDQiLCJpbXBvcnRhbnQiLCJlbmNvZGVWYWx1ZSIsInZhbHVlIiwia2V5d29yZHMiLCJpbml0aWFsIiwiaW5oZXJpdCIsInJldmVydCIsInVuc2V0IiwiZGVjb2RlVmFsdWUiLCJ1bmRlZmluZWQiLCJ0cmltbWVkIiwic3R5bGVzX29mX2dldHRlcl9wcm9wZXJ0aWVzIiwibWF0Y2hlc0dldHRlcnMiLCJwcm9wTmFtZSIsInNsaWNlIiwibWF0Y2hlc1NldHRlcnMiLCJ4Iiwic3BsaXQiLCJwcm9wVmFsdWUiLCJydWxlcyIsInJ1bGUiLCJfbG9vcCIsImFkZEdldHRlcnNTZWxlY3RvciIsInNlbGVjdG9yVGV4dCIsImNzc1ZhcmlhYmxlcyIsImtleXMiLCJyZWR1Y2UiLCJhY2MiLCJjc3NWYXJpYWJsZSIsImluY2x1ZGVzIiwiYWRkU2V0dGVyc1NlbGVjdG9yIiwicGFyZW50UnVsZSIsIm1lZGlhVGV4dCIsIm1hdGNoTWVkaWEiLCJhZGRMaXN0ZW5lciIsImRyYXdUcmVlIiwiZG9jdW1lbnRFbGVtZW50IiwicmVkcmF3U3R5bGVTaGVldHMiLCJwcm9wZXJ0aWVzIiwic2VsZWN0b3JBZGRQc2V1ZG9MaXN0ZW5lcnMiLCJ1blBzZXVkbyIsImRyYXdFbGVtZW50Iiwic2VsZWN0b3JzIiwiaWVDUFNlbGVjdG9ycyIsInBhcnRzIiwicHNldWRvIiwicHJvcFZhbHMiLCJpZUNQX3NldHRlcnMiLCJzdHlsZXMiLCJvd25pbmdFbGVtZW50Iiwic3R5bGVDb21wdXRlVmFsdWVXaWR0aFZhcnMiLCJnZXRDb21wdXRlZFN0eWxlIiwicHNldWRvcyIsImhvdmVyIiwib24iLCJvZmYiLCJmb2N1cyIsImFjdGl2ZSIsIl9sb29wMiIsImxlbmd0aCIsImVuZGluZyIsInNlbCIsImRyYXdUcmVlRXZlbnQiLCJDU1NBY3RpdmUiLCJzZXRUaW1lb3V0IiwiYWN0aXZlRWxlbWVudCIsImV2dCIsImNyZWF0ZUV2ZW50IiwiaW5pdEV2ZW50IiwiZGlzcGF0Y2hFdmVudCIsInVuaXF1ZUNvdW50ZXIiLCJfZHJhd0VsZW1lbnQiLCJpZUNQX3VuaXF1ZSIsImNsYXNzTGlzdCIsImFkZCIsInZhbHVlV2l0aFZhciIsImRldGFpbHMiLCJpdGVtIiwiYWxsQnlSb290IiwiZWxlbWVudFNldENzcyIsImllQ1Bfc3R5bGVFbCIsInN0eWxlRWwiLCJoZWFkIiwiYXBwZW5kQ2hpbGQiLCJoYXNBdHRyaWJ1dGUiLCJkcmF3UXVldWUiLCJTZXQiLCJjb2xsZWN0aW5nIiwiZHJhd2luZyIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImZvckVhY2giLCJjbGVhciIsImZpbmRWYXJzIiwic3RyIiwiY2IiLCJsZXZlbCIsIm9wZW5lZExldmVsIiwibGFzdFBvaW50IiwibmV3U3RyIiwiY2hhciIsImluc2lkZUNhbGMiLCJzdWJzdHJpbmciLCJ2YXJpYWJsZSIsImZhbGxiYWNrIiwiaW5kZXhPZiIsInZhbHVlV2l0aFZhcnMiLCJsYXN0UHJvcGVydHlTZXJ2ZWRCeSIsIm9ic2VydmVyIiwiYXR0cmlidXRlTmFtZSIsImF0dHJpYnV0ZXMiLCJvbGRIYXNoIiwibG9jYXRpb24iLCJoYXNoIiwibmV3RWwiLCJnZXRFbGVtZW50QnlJZCIsIm9sZEVsIiwiZGVzY3JpcHRvciIsInN0eWxlR2V0dGVyIiwib3JpZ2luYWxHZXRDb21wdXRlZCIsImFyZ3VtZW50cyIsImNvbXB1dGVkRm9yIiwiU3R5bGVQcm90byIsIkNTU1N0eWxlRGVjbGFyYXRpb24iLCJvbGRHZXRQIiwicHJvcGVydHkiLCJ1bmRhc2hlZCIsImllUHJvcGVydHkiLCJpZVByb3BlcnR5SW1wb3J0YW50IiwiaW5oZXJpdGluZ0tleXdvcmRzIiwicmVnaXN0ZXIiLCJpbmhlcml0cyIsInRtcFZhbCIsImluaXRpYWxWYWx1ZSIsIm9sZFNldFAiLCJwcmlvIiwiQ1NTIiwicmVnaXN0ZXJQcm9wZXJ0eSIsIm9wdGlvbnMiLCJuYW1lIiwidXJsIiwicmVxdWVzdCIsIlhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsIm92ZXJyaWRlTWltZVR5cGUiLCJvbmxvYWQiLCJzdGF0dXMiLCJyZXNwb25zZVRleHQiLCJzZW5kIl0sInNvdXJjZVJvb3QiOiIifQ==