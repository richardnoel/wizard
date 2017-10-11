/**
	* La directiva sirve para la personalización de etiquetas tradicionales HTML BUTTON, HTML SPAN, HTML LINK:
	* 
	* Directiva de aspecto <b>uniBadge</b>, que transforma un <code>html textarea</code>, adiciona classes como '<code>btn label lnk</code>'
	* generando una nueva estructura <code>HTML</code> compatible con <a href='http://getbootstrap.com/css/#forms' target='_blank'>Bootstrap</a>	
	* <p><b>La propiedad icon:</b>  Nombre corto del icono Font Awesome <a href='http://fontawesome.io/icons/' target='_blank'>Icons</a>. </p>
	* <p><b>La propiedad level:</b>  Color de prioridad segun distintivos de Bootstrap, los valores permitidos son <code>danger, success, primary, warning, info y default</code></p>
	* 
	* ```html
	* <button uni-badge></button>
	* <span uni-badge></span>
	* <a uni-badge></a>
	* ```
	*	
	* @param {JavaScript Object} `$compile` Compila una cadena HTML o DOM en una plantilla, propio de angularJS.
	* @param {JavaScript Object} `$rootScope` Variable de ámbito raiz, propio de angularJS.
	* @param {JavaScript Object} `$unikit` Modulo principal de todos los componentes.
	* @api uniBadge
	*/
unikit.directive('uniBadge', ['$unikit', '$rootScope', '$compile', function ($unikit, $rootScope, $compile) {
		var TAG = {
			SPAN: 'label',
			DIV: 'alert',
			BUTTON: 'btn',
			A: 'lnk',
			LI: 'list-group-item',
			PANEL: 'panel',
			INPUT: 'btn'
		};
		/** 
			* Verifica si el elemento es parte de una directiva <code>uni-group o clase CSS 'input-group-addon'</code>.
			* 
			* ```js
			* var position = 	var position = parentNodeIsInInputGroup(element);
			* ```
			*
			* @param {htmlElement} `domRoot` Elemento HTML  input al cual se adiciona la directiva 'uni-input'..
			* @returns {htmlElement} `parentNode` Retorna un HTML Element o undefined;
			* @api Method parentNodeIsInInputGroup()
			*/
		var parentNodeIsInInputGroup = function (domRoot) {
			var parentNode;
			if (!(domRoot instanceof angular.element)) {
				domRoot = angular.element(domRoot);
			}
			if (domRoot.parent().hasClass('input-group-addon')) {
				parentNode = domRoot.parent();
			}
			return parentNode;
		};
		/**
			* Construye la estructura HTML para el contenido y para el ícono que acompaña al componente uni-badge,
			* 
			* @param {String} `position` Determina la posición en la cual se adicionara el icono si corresponde.
			* @param {HTMLElement} `domRoot` Elemento HTML DOM clon del HTML al cual se adiciona la directiva 'uni-badge'.
			* @returns {String} `iconClass` Css class que determina el icono que se adicionara al componente.
			* @returns {HTMLElement} `domRoot` Elemento HTML principal con modificaciones en sus nodos hijos.
			* @api positionIconAndText
			*/
		var positionIconAndText = function (position, domRoot, iconClass) {
			var domIcon = document.createElement('span');
			if (domRoot.innerHTML) {
				var textContentNode = document.createElement('span');
				textContentNode.setAttribute('class', 'text-content');
				textContentNode.innerHTML = domRoot.innerHTML;
				domRoot.innerHTML = textContentNode.outerHTML;
			}
			domIcon.setAttribute('class', 'icon-text ' + iconClass);
			if (position === 'left') {
				domRoot.insertBefore(domIcon, domRoot.firstChild);
			} else {
				domRoot.appendChild(domIcon);
			}
			return domRoot;
		};
		/**
			* Genera una cadena <code>HTML</code>, que contiene a los iconos de componente, la generaración se produce en base al tipo de 
			* <code>HTML input</code>
			* 
			* ```js
			* var htmlIcon = createHTMLIconTemplate(HTMLElement, config);
			* ```
			* @param {htmlElement} `cloneRoot` Elemento HTML DOM clon del HTML al cual se adiciona la directiva 'uni-badge'.
			* @param {Javascript Object} `config` Configuración de los atributos del componente.
			* @returns {String} `html` Retorna una plantilla html, que contiene las estructura HTML del icono. 
			* @api Method createHTMLIconTemplate()
			*/
		var createHTMLIconTemplate = function (domRoot, config) {
			var html = '';
			if (config.text === false) {
				domRoot.innerHTML = '';
			}
			var iconClass = $unikit.buildIconClass(config.icon);
			var parentNode = parentNodeIsInInputGroup(domRoot);
			if (!parentNode) {
				domRoot = positionIconAndText(config.position, domRoot, iconClass);
				var pre = TAG[domRoot.nodeName];
				if (pre) {
					var classColor = 'uni-badge ' + pre + ' ' + pre + '-' + config.level;
					domRoot.setAttribute('class', classColor + ' ' + (iconClass ? config.position : ""));
				}
			} else {
				domRoot.setAttribute('class', 'icon-text ' + iconClass);
				if (iconClass === config.icon) {
					domRoot.textContent = config.icon;
				}
				parentNode.addClass(config.level);
			}
			html = domRoot.outerHTML;
			return html;
		};
		return {
			restrict: 'A',
			replace: true,
			scope: false,
			terminal: true,
			priority: 10,
			template: function (element, attrs) {
				var config = $unikit.iconConfig(element, attrs, 'uniBadge');
				if (config.skip) {
					return element[1];
				}
				var dom = element[0];
				return createHTMLIconTemplate(dom, config);
			},
			link: function (scope, element) {
				$compile(element)(scope);
			}
		};
	}]);
