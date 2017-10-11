/**
	* La directiva realiza la agrupación y adiciona estilos <code>CSS class btn-group</code>compatible con <a href='http://getbootstrap.com/css/#forms' target='_blank'>Bootstrap</a> 
	* a las etiquetas tradicionales HTML BUTTON, HTML INPUT type "button".
	* Esta Directiva puede ser combinada con la directiva <code>uni-badge</code> para la personalización de los botones.	
	* 
	* ```html
	* <div uni-action><button >Test1</button><input value="Test2"/></div>
	* ```
	*
	* @param {JavaScript Object} `$rootScope` Variable de ámbito raiz, propio de angularJS.	
	* @param {JavaScript Object} `$unikit` Modulo principal de todos los componentes.
	* @param {JavaScript Object} `$compile` Compila una cadena HTML o DOM en una plantilla, propio de angularJS.
	* @api uniAction
	*/
unikit.directive('uniAction', ['$rootScope', '$unikit', '$compile', function ($rootScope, $unikit, $compile) {
		/** 
			* Verifica si el elemento HTML al cual se adiciono la directiva es un elemento valido <code>HTML BUTTON, HTML INPUT "type Button o Submit"</code>, 
			* si es valido se adiciona la directiva <code>uni-badge</code>.
			* 
			* ```js
			* processExtendDirectives(htmlElement);
			* ```
			*
			* @param {htmlElement} `item` Elemento HTML DOM clon del HTML al cual se adiciona la directiva "uni-input".
			* @api Method processExtendDirectives()
			*/
		var processExtendDirectives = function (item) {
			var hasNotBadge = !item.hasAttribute('uni-badge');
			var nodeName = item.nodeName;
			var type = item.getAttribute('type');
			if (hasNotBadge) {
				if (nodeName === 'BUTTON') {
					item.setAttribute('uni-badge', '{}');
				} else if (nodeName === 'A') {
					item.setAttribute('uni-badge', '{}');
				} else if (nodeName === 'INPUT') {
					if (type === 'submit') {
						item.setAttribute('uni-badge', '{}');
					} else if (type === 'button') {
						item.setAttribute('uni-badge', '{}');
					}
				}
			}
		};

		/** 
			* 
			* Evalua a los HTML hijos y adiciona la directiva <code>"uni-badge"</code>, ademas de agrupar a los HTML hijos en un contenedor <code>HTML DIV con CSS class btn-group</code>
			* Creando asi un  "HTML template".
			* 
			* ```js
			* createHTMLBlockTemplate(id, dom, config);
			* ```
			*
			* @param {String} `id` Identificador para la propieddad "id" del componente
			* @param {htmlElement} `dom` Elemento HTML DOM clon del HTML al cual se adiciona la directiva "uni-action".
			* @param {javascrip Object} `config` Configuración fijada por el usuario unida con la configuracion por defecto para el componente.
			* @returns {String} `html` Retorna una plantilla html, que contiene las estructura del componente.
			* @api Method createHTMLBlockTemplate()
			*/
		var createHTMLBlockTemplate = function (id, dom, config) {

			var html = '';
			angular.forEach(dom.children, function (item) {
				if (config.extend) {
					processExtendDirectives(item);
				}
				html = html + item.outerHTML;
			});

			html = '<div class="btn-group uni-action-block" role="group">' + html + '</div>';
			return html;
		};

		var createHTMLHeaderTemplate = function (id, dom, config) {
			var html = dom.innerHTML;
			html = '';
			angular.forEach(dom.children, function (item) {
				if (config.extend) {
					processExtendDirectives(item);
				}
				html = html + item.outerHTML;
			});
			html = '<div class="btn-group uni-action-header pull-right" role="group">' + html + '</div>';
			return html;
		};

		var createHTMLDropdownTemplate = function (id, dom, config) {
			var header = dom.querySelector(':scope > legend, :scope > header');
			if (header) {
				dom.removeChild(header);
				header = header.innerHTML;
			}
			var htmlHeader = header || config.title || 'Opciones';
			var htmlOption = '';
			angular.forEach(dom.children, function (item, index) {
				if (item.nodeName === 'BR') {
					htmlOption = htmlOption + '<li role="separator" class="divider"></li>';
				} else {
					if (config.extend) {
						processExtendDirectives(item);
					}
					htmlOption = htmlOption + '<li>' + item.outerHTML + '</li>';
				}
			});
			var html = '<div class="dropdown uni-action-dropdown">' +
											'<span class="dropdown-toggle uni-click" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">' +
											' {htmlHeader}' +
											'<span class="caret"></span>' +
											'</span>' +
											'<ul class="dropdown-menu">' +
											' {htmlOption}' +
											'</ul>' +
											'</div>';
			//html = html.replace(/{id}/g, id);
			html = html.replace(/{htmlHeader}/g, htmlHeader);
			html = html.replace(/{htmlOption}/g, htmlOption);
			return html;
		};

		return {
			restrict: 'A',
			replace: true,
			scope: false,
			priority: 10,
			terminal: true,
			template: function (element, attrs) {
				var config = $unikit.componentConfig(element, attrs, 'uniAction');
				var id = $unikit.createID(element);
				//var config = {skip: false, type: 'GROUP', extend: true};
				//delete attrs.uniAction;
				element[0].removeAttribute('uni-action');
				if (config.skip) {
					return element[1];
				}
				var dom = element[0];
				var html = '<a>No support for template <b>' + config.type + '</b> type.</a>';
				if (config.type === 'BLOCK') {
					html = createHTMLBlockTemplate(id, dom, config);
				} else if (config.type === 'HEADER') {
					html = createHTMLHeaderTemplate(id, dom, config);
				} else if (config.type === 'DROPDOWN') {
					html = createHTMLDropdownTemplate(id, dom, config);
				}
				return html;
			},
			link: function (scope, element) {
				$compile(element)(scope);
			}
		};
	}]);
