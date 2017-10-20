/**
	* Directiva de diseño <b>uniGrid</b>, transforma un <code>html DIV</code> a una regilla, generando una nueva estructura <code>HTML Conatiner de 
	* </code> <a href='http://getbootstrap.com/css/#forms' target='_blank'>Bootstrap</a>.	
	* 
	* ```html
	* <div uni-grid></div>
	* <div uni-grid=""></div>
	* <div uni-grid="{cols:[2,2,2,2,2,2]}"></div>
	* ```
	*
	* @param {JavaScript Object} `$rootScope` Variable de ámbito raiz, propio de angularJS.
	* @param {JavaScript Object} `$unikit` Modulo principal de todos los componentes.
	* @param {JavaScript Object} `$compile` Compila una cadena HTML o DOM en una plantilla, propio de angularJS.
	* @api uniGrid
	*/
unikit.directive('uniGrid', ['$rootScope', '$unikit', '$compile', function ($rootScope, $unikit, $compile) {
		/**
			* Adicionar un identificador <code>HTML id</code> a una etiqueta, si tiene identificador lo mantiene.
			* 
			* ```js
			* var html = addIdToElement(HTMLElement)
			* ```
			*
			* @param {htmlElement} `element` Elemento HTML DOM al cual se adiciona el identificador
			* @api metodo addIdToElement()
			*/
		var addIdToElement = function (element) {
			if (!element.prop("id")) {
				var id = "uni-" + Math.random().toString(16).slice(2);
				element.prop("id", id);
			}
			return element;
		};
		/**
			* Relaciona elementos <code>HTMl input, select, textarea</code> con la etiqueta <coode>HTML label</code>, para asignar a traves de la 
			* propiedad <code>for</code>.
			* 
			* ```js
			* relateInputWithLabel(HTMLElement)
			* ```
			*
			* @param {htmlElement} `element` Elemento HTML DOM al cual se adiciona la relación entre "HTML label" y "HTML control"
			* @api metodo relateInputWithLabel()
			*/
		var relateInputWithLabel = function (element) {
			var id;
			var tagName = element.prop("tagName");
			var relatedToTag = ["INPUT", "SELECT", "TEXTAREA"];
			element = addIdToElement(element);
			if (tagName === "LABEL") {
				var nextNode = element.next();
				var nodeName = nextNode.prop("tagName");
				if (relatedToTag.indexOf(nodeName) !== -1) {
					id = addIdToElement(nextNode).prop("id");
					element.prop("for", id);
				}
				if (nextNode.prop("nodeName") === "SPAN") {
					id = addIdToElement(nextNode).prop("id");
					element.prop("for", id);
				}
			}
		};
		/**
			* Si el valor de la propiedad <code>extend</code> es <code>true</code>, adiciona las directivas correspondientes a las etiquetas: 
			* <p><code>HTML input, HTML select, HTML textarea, HTML span</code></p>
			* 
			* ```js
			* processExtendDirectives(HTMLElement)
			* ```
			*
			* @param {htmlElement} `item` Elemento HTML Element
			* @api metodo  processExtendDirectives()
			*/
		var processExtendDirectives = function (item) {
			if (item.nodeName === 'INPUT' && !item.hasAttribute('uni-input') && !item.hasAttribute('uni-filter')) {
				item.setAttribute('uni-input', '{}');
			} else if (item.nodeName === 'SELECT' && !item.hasAttribute('uni-select') && !item.hasAttribute('uni-filter')) {
				item.setAttribute('uni-select', '{}');
			} else if (item.nodeName === 'TEXTAREA' && !item.hasAttribute('uni-editor')) {
				item.setAttribute('uni-editor', "{type:'simple'}");
			} else if (item.nodeName === 'LABEL' && !item.hasAttribute('uni-text')) {
				item.setAttribute('uni-text', '{}');
				item.className = "control-label";
			} else if (item.nodeName === 'SPAN' && !item.hasAttribute('uni-group')) {
				item.setAttribute('uni-group', '{}');
			}
		};
		/**
			* Genera el sistema de regillas para la estructura <code>HTML Bootstrap</code> 
			* Se basa en 12 columnas, itera los nodos hijos del <code>HTML principal</code>, si se tiene un nodo &lt;br&gt; crea una fila 
			* <code>&lt;div class='row'&gt;&lt;/div&gt</code>
			* 
			* ```js
			* createHTMLGridTemplate(HTMLElement, config)
			* ```
			*
			* @param {htmlElement} `gridDom` Elemento HTML DOM clon del HTML al cual se adiciona la directiva "uni-grid".
			* @param {Javascript Object} `config` Configuración de los atributos del componente.
			* @returns {String} `html` Cadena HTML formada a partir de todos los hijos de nodo principal.
			* @api metodo createHTMLGridTemplate()
			*/
		var createHTMLGridTemplate = function (gridDom, config) {
			var i = 0;
			var html = '<div class="row">';
			angular.forEach(gridDom.children, function (item, index) {
				relateInputWithLabel(angular.element(item));
				if (item.nodeName === 'BR') {
					html = html + '</div><div class="row uni-grid-row">';
					i = 0;
				} else {
					var col = item.getAttribute('col') || config.cols[i];
					var lcol = item.getAttribute('lcol') || "";
					if (lcol) {
						lcol = 'col-md-offset-' + lcol;
					}
					i = (i + 1) % config.cols.length;

					if (config.extend) {
						processExtendDirectives(item);
					}
					html = html + '<div class="col-md-' + col + " " + lcol + ' uni-grid-item">' + item.outerHTML + '</div>';
				}
			});
			html = html + '</div>';
			html = '<div class="container-fluid uni-grid-' + config.status + '">' + html + '</div>';
			return html;
		};
		/**
			* Genera el sistema de regillas para la estructura <code>HTML TABLE</code> 
			* Se basa la creacion de filas y columnas, itera los nodos hijos del <code>HTML principal</code>, si se tiene un nodo &lt;br&gt; crea una nueva fila .
			* 
			* ```js
			* createHTMLTableTemplate(HTMLElement, config)
			* ```
			*
			* @param {htmlElement} `gridDom` Elemento HTML DOM clon del HTML al cual se adiciona la directiva "uni-grid".
			* @param {Javascript Object} `config` Configuración de los atributos del componente.
			* @returns {String} `html` Cadena HTML formada a partir de todos los hijos de nodo principal.
			* @api metodo createHTMLTableTemplate()
			*/
		var createHTMLTableTemplate = function (gridDom, config) {
			var html = '<tr>';
			angular.forEach(gridDom.children, function (item) {
				item = item.cloneNode(true);
				if (item.nodeName === 'BR') {
					html = html + '</tr><tr>';
				} else {
					if (config.extend) {
						processExtendDirectives(item);
					}
					html = html + '<td>' + item.outerHTML + '</td>';
				}
			});
			html = html + '</tr>';
			html = '<table class="table">' + html + '</table>';
			return html;
		};

		return {
			restrict: 'A',
			replace: true,
			scope: false,
			priority: 10,
			terminal: true,
			template: function (element, attrs) {
				var config = $unikit.componentConfig(element, attrs, 'uniGrid');
				if (config.skip) {
					return element[1];
				}
				var gridDom = element[0];
				var html = '<a>No support for template <b>' + config.type + '</b> type.</a>';
				if (config.type === 'GRID') {
					html = createHTMLGridTemplate(gridDom, config);
				} else if (config.type === 'TABLE') {
					html = createHTMLTableTemplate(gridDom, config);
				}
				return html;
			},
			link: function (scope, element) {
				$compile(element)(scope);
			}
		};
	}]);