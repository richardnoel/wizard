/**
	* Directiva de aspecto <b>uniInput</b>, que transforma un <code>html input</code>, adiciona classes como '<code>form-control</code>'
	* generando una nueva estructura <code>HTML</code> compatible con <a href='http://getbootstrap.com/css/#forms' target='_blank'>Bootstrap</a>.
	* Se debe agregar la directiva unicamente en etiquetas <b>HTML input</b></code> de tipo <code>"text", "number", "date", "time", "file", "password" e "email".</code>
	* <p><b>La propiedad icon:</b>  Nombre corto del icono Font Awesome <a href='http://fontawesome.io/icons/' target='_blank'>Icons</a>. </p>
	* <p><b>La propiedad level:</b>  Color de prioridad segun distintivos de Bootstrap, los valores permitidos son <code>danger, success, primary, warning, info y default</code></p>
	* 
	* ```html
	* <input type='text' uni-input=""/>
	* <input type='text' uni-input="{}"/>
	* <input type='text' uni-input="{icon:'pencil', level:'danger'}"/>
	* ```
	*
	* @param {JavaScript Object} `$compile` Compila una cadena HTML o DOM en una plantilla, propio de angularJS.
	* @param {JavaScript Object} `$rootScope` Variable de ámbito raiz, propio de angularJS.
	* @param {JavaScript Object} `$unikit` Modulo principal de todos los componentes.
	* @api uniInput
	*/
unikit.directive('uniInput', ['$unikit', '$rootScope', '$compile', function ($unikit, $rootScope, $compile) {
		/**
			* Genera una cadena <code>HTML</code>, que contiene a los iconos de componente, la generaración se produce en base al tipo de 
			* <code>HTML input</code>
			* 
			* ```js
			* var htmlIcon = getIconHTML(config, position);
			* ```
			* @param {Javascript Object} `config` Configuración de los atributos del componente.
			* @param {String} `position` Alineación del icono, los valores permitidos son: "left" y "right".
			* @returns {String} `html` Retorna una plantilla html, que contiene las estructura del icono. 
			* @api Method getIconHTML()
			*/
		var getIconHTML = function (config, position) {
			var html = '<span class="icon input-group-addon uni-addon-' + (position ? position : '') + '">';
			var icon = config.icon;
			if (typeof icon === 'boolean') {
				icon = config.defaultIcon;
			}
			if (angular.isString(icon)) {
				icon = icon.split(/\s|\;|\,/);
			}
			if (!angular.isArray(icon)) {
				icon = [icon];
			}
			for (var i = 0; i < icon.length; i += 1) {
				html = html + '<span uni-badge="{ level:\'' + (config.level ? config.level : 'default') + '\', icon:\'' + icon[i] + '\'}"></span>';
			}
			html = html + '</span>';
			return html;
		};
		/**
			* Genera una cadena <code>HTML</code>, que contiene al componente, la generaración se produce en base al tipo de 
			* <code>HTML input</code> <code>"text", "number", "date", "time", "email" y "password".</code>.
			* 
			* ```js
			* var html = basicHtml(html, config, position);
			* ```
			*
			* @param {htmlElement} `cloneRoot` Elemento HTML DOM clon del HTML al cual se adiciona la directiva "uni-input".
			* @param {Javascript Object} `config` Configuración de los atributos del componente.
			* @param {String} `position` Alineación del icono, los valores permitidos son: "left" y "right".
			* @returns {String} `html` Retorna una plantilla html, que contiene las estructura del componente.
			* @api Method basicHtml()
			*/
		var basicHtml = function (cloneRoot, config, position) {
			var html;
			if (config.icon) {
				var htmlIcon = getIconHTML(config, position);
				html = '<div class="uni-field uni-input input-group uni-' + config.type.toLowerCase() + (position === "normal" ? '' : ' uni-group') + '">' + cloneRoot.outerHTML + htmlIcon + '</div>';
			} else {
				html = '<div class="uni-field uni-input uni-' + config.type.toLowerCase() + '">' + cloneRoot.outerHTML + '</div>';
			}
			return html;
		};
		/** 
			* Genera una cadena <code>HTML</code>, que contiene al componente, la generaración se produce en base al tipo de 
			* <code>HTML input type "file"</code>
			* 
			* ```js
			* var html = fileHtml(cloneRoot, config, position, ngModel);
			* ```
			*
			* @param {htmlElement} `cloneRoot` Elemento HTML DOM clon del HTML al cual se adiciona la directiva "uni-input".
			* @param {Javascript Object} `config` Configuración de los atributos del componente.
			* @param {String} `position` Alineación del icono, los valores permitidos son: "left" y "right".
			* @param {String} `ngModel` Modelo angular del componente, se usa para realizar el enlace al dato original del scope.
			* @returns {String} `html` Retorna una plantilla html, que contiene las estructura del componente.
			* @api Method fileHtml()
			*/
		var fileHtml = function (cloneRoot, config, position, ngModel) {
			var html;
			var htmlIcon = "";
			if (config.icon) {
				htmlIcon = getIconHTML(config, position);
			}
			html = '<div>' +
											'<div class="uni-field uni-input input-group uni-{type}">' +
											'<input class="form-control" readOnly="true" ng-value="__fileName({ngModel})" title="{{__fileName({ngModel}, true)}}"/>' +
											'<span class="input-group-btn">' +
											'<label class="btn btn-{level}">{icon}<span>Browser...</span> {rootHTML} </label>' +
											'<button class="btn btn-danger" ng-click="{ngModel}= undefined">' +
											'<span class="fa fa-trash-o"></span>' +
											'</button>' +
											'</span>' +
											'</div>' +
											'</div>';
			//cloneRoot.id = undefined;
			//html = html.replace(/{rootId}/g, cloneRoot.id);
			html = html.replace(/{type}/g, config.type.toLowerCase());
			html = html.replace(/{ngModel}/g, ngModel);
			html = html.replace(/{level}/g, config.level);
			html = html.replace(/{icon}/g, htmlIcon);
			html = html.replace(/{rootHTML}/g, cloneRoot.outerHTML);
			return html;
		};
		/** 
			* Adiciona <code>clases CSS</code> al elemento htmlElement principal, para generar un nuevo elemento DOM compatible con css de Bootstrap.
			* 
			* ```js
			* var html = createHTMLControl(htmlElement, config, position);
			* ```
			*
			* @param {htmlElement} `cloneRoot` Elemento HTML DOM clon del HTML al cual se adiciona la directiva "uni-input".
			* @param {Javascript Object} `config` Configuración de los atributos del componente.
			* @param {String} `position` Alineación del icono, los valores permitidos son: "left" y "right".
			* @returns {String} `html` Retorna una plantilla html, que contiene las estructura del componente.
			* @api Method createHTMLControl()
			*/
		var createHTMLControl = function (cloneRoot, config, position) {
			var html;
			var typeClass = "uni-input-" + config.type.toLowerCase();
			if (position === "normal") {
				cloneRoot.className = "form-control " + typeClass;
			} else {
				cloneRoot.className = "form-control uni-group " + typeClass;
			}
			var ngModel = cloneRoot.getAttribute('ng-model');
			if (config.type === 'FILE') {
				cloneRoot.style.display = "none";
				cloneRoot.type = "file";
				html = fileHtml(cloneRoot, config, position, ngModel);
			} else {
				html = basicHtml(cloneRoot, config, position);
			}
			return html;
		};
		/** 
			* Verifica si el elemento es parte de una directiva <code>uni-group</code>, y obtiene su posición.
			* 
			* ```js
			* var position = 	var position = elementPosInGroup(element);
			* ```
			*
			* @param {htmlElement} `element` Elemento HTML  input al cual se adiciona la directiva "uni-input"..
			* @returns {String} `html` Retorna una cadena que indica la posición del elemento si pertenece a un "uni-group"
			* @api Method elementPosInGroup()
			*/
		var elementPosInGroup = function (element) {
			var parent, position = "normal";
			parent = element.parent();
			if (parent && parent.hasClass("input-group")) {
				if (element.index() === 0) {
					position = "first";
				} else if (element.index() === (parent.children().length - 1)) {
					position = "last";
				} else {
					position = "medium";
				}
			}
			return position;
		};
		/** 
			* Elimina un atributo del HTML Element
			* 
			* ```js
			* removeNgAttribute(element, 'uni-convert');
			* ```
			*
			* @param {htmlElement} `element` Elemento HTML  input al cual se adiciona la directiva "uni-input"..
			* @param {String} `value` atributo que se eliminara del HTML Element
			* @api Method removeNgAttribute()
			*/
		var removeNgAttribute = function (element, value) {
			element.removeAttr(value);
		};
		/** 
			* Adiciona el evento "click" en el icono, para asignar el foco al HTML Control
			* 
			* ```js
			* addFocus(element);
			* ```
			*
			* @param {htmlElement} `element` Elemento HTML  input al cual se adiciona la directiva "uni-input"..
			* @api Method addFocus()
			*/
		var addFocus = function (element) {
			element.find('.icon').on('click', function () {
				element.find('input').focus();
			});
		};
		var addFileHandler = function (scope) {
			if (scope.__nameFile === undefined) {
				scope.__fileName = function (ngValue, full = false) {
					var toString = '...';
					if (ngValue) {
						if (angular.isArray(ngValue)) {
							var out = '';
							for (var i = 0; i < ngValue.length && (full || i < 3); i++) {
								out += ngValue[i].name + (full ? '\n' : ', ');
							}
							if (ngValue.length >= 3 && !full) {
								out = out + '..(' + ngValue.length + ' files)';
							}
							toString = out || 'NaN';
						} else {
							toString = ngValue.name || 'NaN';
						}
					}
					return toString;
				};
			}
		};
		return {
			restrict: 'A',
			replace: true,
			scope: false,
			terminal: true,
			priority: 10,
			require: '^?form',
			template: function (element, attrs) {
				var config = $unikit.componentConfig(element, attrs, 'uniInput');
				if (config.skip) {
					return element[1];
				}
				$unikit.prepareUniConvert(element, attrs, config);
				var htmlElement = element[0];
				var position = elementPosInGroup(element);
				return createHTMLControl(htmlElement, config, position);
			},
			link: function (scope, element, attrs, ngCtrol) {
				removeNgAttribute(element, 'uni-convert');
				addFocus(element);
				if (attrs.type === "file") {
					addFileHandler(scope);
				}
				$compile(element)(scope);
			}
		};
	}]);
