unikit.factory('$unikit', ['$rootScope', function ($rootScope) {

		var DEFAUTL_CLASS_ICON = 'fa fa-';

		var VALIDATE_MESSAGE = {
			convertTo: "Error al convertir el valor",
			convertTo$number: "Error al convertir el numero",
			convertTo$date: "Error al convertir la fecha",
			convertTo$datetime: "Error al convertir la fecha y hora",
			convertTo$time: "Error al convertir la hora",
			format: 'Es valor es requerido',
			format$number: 'Es valor es requerido',
			format$date: 'Es valor es requerido',
			validate: 'Es valor es requerido',
			validate$number: 'Es valor es requerido',
			validate$date: 'Es valor es requerido',
			required: 'Es requerido el valor',
			required$text: 'Se requiere un valor texto',
			required$file: 'Se requiere adjuntar archivos',
			required$date: 'Seleccione una fecha',
			required$datetime: 'Seleccione una fecha y hora',
			required$time: 'Seleccione una hora',
			required$number: 'Se requiere un valor numerico',
			required$email: 'Se requiere el correo',
			required$select: 'Seleccione un valor',
			email$email: 'Valor invalido para correo',
			number$number: 'valor nuemerico invalido',
			lbl: 'valor',
			lbl$nobre: 'Nombre',
			lbl$sexo: 'Sexo'
		};

		var REGEX = [
			//filtro
			[/filter|filtrar/i, {icon: 'filter', text: true, level: 'primary', position: 'left'}],
			[/apply|aplicar/i, {icon: 'check', text: true, level: 'success', position: 'right'}],
			[/clear|limpiar/i, {icon: 'ban', text: true, level: 'danger', position: 'left'}],
			[/volver|return/i, {icon: 'arrow-left', text: true, level: 'danger', position: 'left'}],
			//bandeja
			[/crear|adicionar|add|nuevo/i, {icon: 'plus', text: true, level: 'primary', position: 'left'}],
			[/modif|edit/i, {icon: 'pencil', text: true, level: 'primary', position: 'left'}],
			[/view|ver|dato/i, {icon: 'eye', text: true, level: 'primary', position: 'left'}],
			[/infor|show/i, {icon: 'eye', text: true, level: 'success', position: 'left'}],
			[/elimin|delete|del/i, {icon: 'remove', text: true, level: 'danger', position: 'left'}],
			//modales
			[/sigui|next/i, {icon: 'arrow-right', text: true, level: 'primary', position: 'right'}],
			[/x|X/i, {icon: 'close', text: false, level: 'danger', position: 'left'}],
			[/cerrar|close/i, {icon: 'close', text: true, level: 'danger', position: 'left'}],
			[/cancel|cancelar|no/i, {icon: 'reply', text: true, level: 'warning', position: 'left'}],
			[/save|guardar/i, {icon: 'save', text: true, level: 'info', position: 'left'}],
			[/actuali|updat/i, {icon: 'save', text: true, level: 'info', position: 'left'}],
			[/acept|aceptar|si/i, {icon: 'check', text: true, level: 'success', position: 'left'}],
			[/enviar|send/i, {icon: 'paper-plane', text: true, level: 'success', position: 'left'}],
			[/refresh|recargar/i, {icon: 'refresh', text: true, level: 'primary', position: 'left'}],
			//otros
			[/busca|search/i, {icon: 'search', text: true, level: 'primary', position: 'right'}],
			[/atras|back/i, {icon: 'arrow-left', text: true, level: 'danger', position: 'left'}],
			[/print|imprimir/i, {icon: 'print', text: true, level: 'success', position: 'left'}],
			[/download|descargar/i, {icon: 'download', text: true, level: 'success', position: 'left'}]
		];

		var UI_UNIKIT = {
			UNI_PANEL: {
				__type: 'type',
				__default: 'PANEL',
				__tag: ['div', 'fieldset'],
				PANEL: {skip: false, level: 'default'},
				SUBPANEL: {skip: false, level: 'default'},
				MODAL: {skip: false, level: 'default', content: false, size: 'md', height: 'none'}
			},
			UNI_PANELS: {
				__type: 'type',
				__default: 'TAB',
				__tag: ['div'],
				TAB: {skip: false, level: 'default'},
				ACC: {skip: false, level: 'default', autoclose: false},
				LTAB: {skip: false, level: 'default'}
				//RTAB: {skip: false, icon: 'tab', level: 'default'},
				//BTAB: {skip: false, icon: 'tab', level: 'default'},
				//SLIDE: {skip: false, icon: 'tab', level: 'default', interval: false, links: true, control: true}
			},
			UNI_GRID: {
				__type: 'type',
				__default: 'GRID',
				__tag: ['div'],
				GRID: {skip: false, extend: true, cols: [1, 3], status: 'active'},
				TABLE: {skip: false, extend: true}
			},
			UNI_INPUT: {
				__type: 'type',
				__default: 'TEXT',
				__tag: ['input'],
				TEXT: {skip: false, icon: false, defaultIcon: 'pencil', level: 'default', convert: 'text'},
				TIME: {skip: false, icon: true, defaultIcon: 'clock-o', level: 'default', convert: 'time'},
				NUMBER: {skip: false, icon: true, defaultIcon: 'hashtag', level: 'default', convert: 'number'},
				PASSWORD: {skip: false, icon: true, defaultIcon: 'key', level: 'default', convert: 'text'},
				EMAIL: {skip: false, icon: true, defaultIcon: 'envelope-o', level: 'default', convert: 'email'},
				DATE: {skip: false, icon: true, defaultIcon: 'calendar', level: 'default', convert: 'date'},
				DATETIME: {skip: false, icon: true, defaultIcon: 'calendar;clock-o', level: 'default', convert: 'datetime'},
				DATETIME_LOCAL: {skip: false, icon: true, defaultIcon: 'calendar;clock-o', level: 'default', convert: 'datetime'},
				FILE: {skip: false, icon: true, defaultIcon: 'folder-open', level: 'primary', convert: 'file'},
				OBJECT: {skip: false, icon: true, defaultIcon: 'box', convert: 'object'},
				ARRAY: {skip: false, icon: true, defaultIcon: 'box', convert: 'array'}
			},
			UNI_OUTPUT: {
				__type: 'node',
				__default: 'LABEL',
				__tag: ['label', 'span'],
				LABEL: {skip: false},
				SPAN: {skip: false}
			},
			UNI_FILTER: {
				__default: 'FILTER',
				__tag: ['input'],
				FILTER: {skip: false, icon: 'filter'}
				//FILTER: {skip: false, icon: 'filter', ope: [], nope: []}
			},
			UNI_SELECT: {
				__type: 'mode',
				__default: 'NATIVE',
				__tag: ['select'],
				NORMAL: {skip: false, icon: false, defaultIcon: 'align-justify', level: 'default', convert: false},
				SEARCH: {skip: false, icon: false, defaultIcon: 'align-justify', level: 'default', convert: false, search: true},
				NATIVE: {skip: false, icon: false, defaultIcon: 'align-justify', level: 'default', convert: false}
			},
			UNI_GROUP: {
				__type: 'type',
				__default: 'GROUP',
				__tag: ['span'],
				GROUP: {skip: false}
			},
			UNI_EDITOR: {
				__default: 'NORMAL',
				__type: 'mode',
				__tag: ['textarea'],
				NORMAL: {skip: false, icon: false, level: 'default', convert: false}
			},
			UNI_TREE: {
				__type: 'type',
				__default: 'TREE',
				__tag: ['ul'],
				TREE: {children: 'children', /*collapse: false, draggable: false,*/ state: {open: 'folder-open-o:+', close: 'folder-o', item: 'file'}}
			},
			UNI_ACTION: {
				__type: 'type',
				__default: 'BLOCK',
				__tag: ['div', 'span'],
				BLOCK: {skip: false, extend: true},
				DROPDOWN: {skip: false, extend: true, title: 'Opciones'},
				HEADER: {skip: false, extend: true}
			},
			UNI_SCROLL: {
				__type: 'type',
				__default: 'SCROLL',
				__tag: ['div', 'tbody'],
				SCROLL: {skip: false, height: 'none', always: false},
				NATIVE: {skip: false, height: 'none'}
			},
			UNI_IMAGE: {
				__type: 'type',
				__default: 'IMAGE',
				__tag: ['img'],
				IMAGE: {skip: false, design: 'rounded', expand: false, download: false}
			}
		};
		var FN_UNIKIT = {
			UNI_PAGER: {
				__type: 'type',
				__default: 'FILTER',
				__tag: ['div'],
				SIMPLE: {skip: false, config: {index: 1, size: 10, last: null}, open: false},
				FILTER: {skip: false, config: {index: 1, size: 10, last: null}, open: false}
			},
			UNI_TABLE: {
				__default: 'TABLE',
				__tag: ['table'],
				TABLE: {skip: false, select: undefined, selected: undefined}
				//TABLE: {skip: false, select: undefined, selected: undefined, sort: undefined}
			},
			UNI_VALIDATOR: {
				__type: 'type',
				__default: 'MODAL',
				__tag: ['form'],
				MODAL: {skip: false, validationsMessage: VALIDATE_MESSAGE},
				TOOLTIP: {skip: false, validationsMessage: VALIDATE_MESSAGE}
			},
			UNI_CONFIRM: {
				__default: 'CONFIRM',
				__tag: ['button'],
				CONFIRM: {skip: false, message: ''}
			},
			UNI_PART: {
				__tag: ['div'],
				PART: {skip: false, replace: null}
			},
			UNI_PLUS: {
				__type: 'type',
				__default: 'DIV',
				__tag: ['div', 'tr'],
				DIV: {skip: false},
				TR: {skip: false}
			},
			I18N: {
				__tag: ['label', 'span', 'a', 'button'],
				__type: 'lang',
				__default: 'ES',
				ES: {skip: false, variable: 'i18n'},
				EN: {skip: false, variable: 'i18n'}
			}
		};

		var CONVERT = {
			TEXT: {transform: 'none'},
			EMAIL: {mask: 'abc123@abc123.abc123'},
			TIME: {format: 'HH:mm:ss', mask: '00:00:00', options: {placeholder: '__:__:__', clearIfNotMatch: false}},
			DATE: {format: 'DD/MM/YYYY', mask: '00/00/0000', options: {placeholder: '__/__/____', clearIfNotMatch: false}},
			DATETIME: {format: "DD/MM/YYYY HH:mm:ss", mask: '00/00/0000 00:00:00', options: {placeholder: '__/__/____ __:__:__', clearIfNotMatch: false}},
			NUMBER: {},
			INTEGER: {mask: '##0', options: {reverse: true, clearIfNotMatch: true}},
			DOUBLE: {mask: '#0,0#', decimalChar: ',', options: {placeholder: '#0,0#', reverse: true, clearIfNotMatch: false}},
			MONEY: {mask: '9.999.999.999.990,00', decimalChar: ',', options: {placeholder: '#0,00', reverse: true, clearIfNotMatch: false}},
			MONEY3: {mask: '#.###.###.###.##0,000', decimalChar: ',', options: {placeholder: '#0,000', reverse: true, clearIfNotMatch: false}},
			MONEY5: {mask: '#.###.###.###.##0,00000', decimalChar: ',', options: {placeholder: '#0,00000', reverse: true, clearIfNotMatch: false}},
			MONEY8: {mask: '#.###.###.###.##0,00000000', decimalChar: ',', options: {placeholder: '#0,00000000', reverse: true, clearIfNotMatch: false}},
			FILE: {multiple: false},
			OBJECT: {},
			ARRAY: {}
		};

		var impl = {
			/**
				* Clone a DOM Element, if isRemoveAttr is true, remove all atribute
				* @param {type} dom
				* @param {type} isRemoveAttr
				* @return {unresolved}
				*/
			cloneDomNode: function (dom, isRemoveAttr = true) {
				var clone = dom.cloneNode(true);
				if (isRemoveAttr) {
					while (clone.attributes.length > 0)
						clone.removeAttribute(clone.attributes[0].name);
				}
				return clone;
			},
			createConvertConfig: function (dom, config) {
				var convertName = config.convert;
				if (convertName === true || !convertName) { //auto convert by type
					convertName = config.type;
				}
				var uniConvert = dom.getAttribute('uni-convert');
				var definedConvert = undefined;
				if (convertName && !uniConvert) {
					var defaultConvert = CONVERT[convertName.toUpperCase()];
					definedConvert = {type: convertName};
					for (var attrName in defaultConvert) {
						if (config.hasOwnProperty(attrName)) {
							definedConvert[attrName] = config[attrName];
						}
					}
				}
				return definedConvert;
			},
			/**
				* Return by reference NG Attribute only with ngShow and ngHiden directives
				* Return by reference DOM Attribute with other attribute directive
				* Return DOM with name attribute if is INPUT, SELECT or TEXTAREA
				* @param {type} element : NG Element
				* @param {type} attrs : NG Attributes
				* @param {type} compName : Directive Name
				* @return {undefined}
				*/
			processAllowAttributes: function (element, attrs, compName) {
				var dom = element[0];
				var notAllowNG = ['class', 'style', compName];
				var allowInputs = ['INPUT', 'TEXTAREA', 'SELECT'];
				var removeNglist = ['ngShow', 'ngHide', 'ngClick', 'ngIf'];
				angular.forEach(notAllowNG, function (name) {
					delete attrs[name];
					name = attrs.$attr[name] || name;
					dom.removeAttribute(name);
				});
				if (allowInputs.indexOf(dom.nodeName) > -1 && dom.type !== 'button') {
					var name = dom.getAttribute('name');
					var id = attrs.id;
					if (!name) {
						name = attrs.ngModel;
						if (!name) {
							name = 'uni-' + Math.floor((Math.random() * 1000) + 1);
						}
						dom.setAttribute('name', name);
					}
					if (!id) {
						id = 'uni-' + Math.random().toString(16).slice(2);
						dom.setAttribute('id', id);
					}
					attrs.id = 'uni-control-' + id;
				}
				//if (functionalityComp.indexOf(compName) === -1) {
				//}
				angular.forEach(attrs, function (value, name) {
					if (/^ng*/i.test(name)) {
						if (removeNglist.indexOf(name) > -1) {
							var attrName = attrs.$attr[name];
							dom.removeAttribute(attrName); //remove HTML Declaration
							if (name === 'ngIf') {
								delete attrs[name];
							}
						} else {
							delete attrs[name]; //remove NG Directive
						}
					}
				});
			},
			processComponentConfig: function (component, config, dom, attrs) {
				var __type = component.__type;
				var __default = component.__default;
				var __value = config[__type] = (config[__type] || attrs[__type] || dom.getAttribute(__type) || __default).underscore(true);
				//console.log('Config [', __type, ']: ', __value, ' in ', component);
				var defaultConfig = component[__value];
				if (!defaultConfig) {
					defaultConfig = component[__default] || {};
					config['_' + __type] = __value;
					config[__type] = __default;
					config.log = 'Componente ' + __value + ' NO definido! default: ' + __default;
					console.warn(config.log);
				}
				return angular.copy(defaultConfig, {});
			},
			convertConfig: function (element, attrs, directiveName, directiveConfig) {
				var config = element.data(directiveConfig);
				if (!config) {
					config = attrs[directiveName] || '{}';
					config = $rootScope.$eval(config);
					if (config.type === undefined) {
						config.type = element[0].getAttribute('type') || 'TEXT';
					}
					config.type = config.type.toUpperCase();
					var defaultConfig = CONVERT[config.type] || {};
					defaultConfig = angular.copy(defaultConfig, {});
					config = angular.merge(defaultConfig, config);
					if (config.type === 'FILE') {
						config.multiple = element[0].hasAttribute('multiple');
					}
					element.data(directiveConfig, config);
				}
				return config;
			},
			componentConfig: function (element, attrs, directiveName, directiveConfig) {
				var config = element.data(directiveConfig);
				if (config) {
					return config;
				}
				if (typeof attrs[directiveName] === "object") {
					config = attrs[directiveName];
				} else {
					config = $rootScope.$eval(attrs[directiveName] || '{}');
				}
				impl.processAllowAttributes(element, attrs, directiveName);
				var dom = element[0];
				element[1] = dom.cloneNode(true).outerHTML;
				if (!config.skip) {
					var __name = directiveName.underscore(true);
					var COMPONENT = UI_UNIKIT[__name] || FN_UNIKIT[__name];
					if (COMPONENT) {
						var __config = impl.processComponentConfig(COMPONENT, config, dom, attrs);
						config = angular.extend(__config, config);
					} else {
						config.skip = true;
						config.warn = 'Componente ' + directiveName + ' NO soportado';
						console.warn(config.warn);
					}
				}
				element.data(directiveConfig, config);
				return config;
			},
			iconConfig_r: function (element, attrs, directiveName, directiveConfig) {
				var config = attrs[directiveName] || '{}';
				config = $rootScope.$eval(config);
				if (config.icon !== undefined && config.level !== undefined) {
					return config;
				} else {
					config = {icon: '', level: 'default', position: 'left'};
				}
				var text = dom.innerText;
				if (text) {
					for (var i = 0; i < REGEX.length; i++) {
						var regexp = REGEX [i][0];
						if (text.match(regexp)) {
							var copy = angular.copy(REGEX [i][1]);
							return angular.merge(config, copy);
						}
					}
				}
				return config;
			},
			iconConfig: function (element, attrs, directiveName, directiveConfig) {
				var config = element.data(directiveConfig);
				if (!config) {
					config = $rootScope.$eval(attrs[directiveName] || '{}');
					impl.processAllowAttributes(element, attrs, directiveName);
					var dom = element[0];
					element[1] = impl.cloneDomNode(dom, true).outerHTML;
					if (!config.icon || !config.level || !config.position) {
						var text = dom.innerText;
						if (text && text !== '') {
							for (var i = 0; i < REGEX.length; i++) {
								var regexp = REGEX [i][0];
								if (regexp.test(text)) {
									var copy = angular.copy(REGEX [i][1]);
									config = angular.merge(copy, config);
									element.data(directiveConfig, config);
									return config;
								}
							}
						}
						config = angular.merge({icon: '', level: 'default', position: 'right'}, config);
					}
					element.data(directiveConfig, config);
				}
				return config;
			},
			validateConfig: function (element, attrs, directiveName) {
				var config = element.data(directiveName);
				if (angular.element.isEmptyObject(config)) {
					config = attrs[directiveName] || '{}';
					config = $rootScope.$eval(config);
					delete attrs[directiveName];
					element.removeAttr('uni-validator');
					var __name = directiveName.underscore(true);
					var COMPONENT = UI_UNIKIT[__name] || FN_UNIKIT[__name];
					if (COMPONENT) {
						if (config.type !== undefined) {
							config.type = config.type.toUpperCase();
						}
						var __config = COMPONENT[config.type] || COMPONENT[COMPONENT.__default];
						config = angular.extend(__config, config);
						element.data(directiveName, config);
					} else {
						config.skip = true;
						config.warn = 'Componente ' + directiveName + ' NO soportado';
						console.warn(config.warn);
					}
				}
				return config;
			},
			createID: function (element, prefix) {
				var id = element ? element.attr('id') : undefined;
				if (!id) {
					id = prefix + Math.random().toString(16).slice(2);
				}
				return id;
			},
			scrollConfig: function (element, attrs, directiveName) {
				var config = element.data(directiveName);
				if (angular.element.isEmptyObject(config)) {
					config = attrs[directiveName] || '{}';
					config = $rootScope.$eval(config);
					delete attrs[directiveName];
					element.removeAttr('uni-scroll');
					var __name = directiveName.underscore(true);
					var COMPONENT = UI_UNIKIT[__name];
					if (COMPONENT) {
						if (config.type !== undefined) {
							config.type = config.type.toUpperCase();
						} else {
							config.type = COMPONENT.__default;
						}
						var __config = COMPONENT[config.type] || COMPONENT[COMPONENT.__default];
						config = angular.extend({}, __config, config);
						element.data(directiveName, config);
					} else {
						config.skip = true;
						config.warn = 'Componente ' + directiveName + ' NO soportado';
						console.warn(config.warn);
					}
				}
				return config;
			}
		};
		return {
			createID: function (element, prefix) {
				return impl.createID(element, prefix || 'uni');
			},
			/**
				* Create Object Config for Convert Directive only all atribute declared in the type convert
				* Support for component listing:
				* - uni-convert
				* - uni-select
				* @param {type} element
				* @param {type} attrs
				* @param {type} config
				* @return {undefined}
				*/
			prepareUniConvert: function (element, attrs, config) {
				if (attrs.ngModel || element.attr('ng-model') || element.attr('x-ng-model')) {
					var dom = element[0];
					var convertConfig = impl.createConvertConfig(dom, config);
					if (convertConfig) {
						convertConfig = JSON.stringify(convertConfig).replace(/\"/g, "'");
						dom.setAttribute("uni-convert", convertConfig);
					}
				}
			},
			//Fix NodeJS+ECMAScript 6, NO SUPPORT SET DEFAULT VALUE TO FUNCTION PARAMETER
			/**
				* Return the config for to uni-badge directive for creating icons
				* @param {type} element 
				* @param {type} attrs
				* @param {type} directiveName
				* @param {type} directiveConfig
				* @returns {unresolved}
				*/
			iconConfig: function (element, attrs, directiveName, directiveConfig) {
				return impl.iconConfig(element, attrs, directiveName || 'uniIcon', directiveConfig || 'icon');
			},
			/**
				* Return the config for convert type declared
				* Support for component listing:
				* - uni-convert
				* @param {type} element
				* @param {type} attrs
				* @param {type} directiveName
				* @param {type} directiveConfig
				* @return {configL#1.impl.convertConfig.attrs|String}
				*/
			convertConfig: function (element, attrs, directiveName, directiveConfig) {
				return impl.convertConfig(element, attrs, directiveName || 'uniConvert', directiveConfig || 'convert');
			},
			/**
				* Return the config for componente by parameters and verify all inconsistences
				* Support for component listing:
				* - em-pager.js
				* - uni-table.js
				* - uni-select.js
				* - uni-panels.js
				* - uni-panel.js
				* - uni-input.js
				* - uni-image.js
				* - uni-group.js
				* - uni-grid.js
				* - uni-filter.js
				* - uni-editor.js
				* - uni-action.js
				* - uni-tree.js
				* - uni-plus.js
				* - uni-confirm.js
				* @param {type} element
				* @param {type} attrs
				* @param {type} directiveName
				* @param {type} directiveConfig
				* @return {unresolved}
				*/
			componentConfig: function (element, attrs, directiveName, directiveConfig) {
				return impl.componentConfig(element, attrs, directiveName || 'uniComponent', directiveConfig || 'component');
			},
			/**
				* Return the config for componente by parameters and verify all inconsistences for the "uni-validator" functionality
				* @param {type} element
				* @param {type} attrs
				* @param {type} directiveName
				* @returns {Object}
				*/
			validateConfig: function (element, attrs, directiveName) {
				return impl.validateConfig(element, attrs, directiveName);
			},
			/**
				* Return the config for componente by parameters and verify all inconsistences for the "uni-scroll" componente
				* @param {type} element
				* @param {type} attrs
				* @param {type} directiveName
				* @returns {Object}
				*/
			scrollConfig: function (element, attrs, directiveName) {
				return impl.scrollConfig(element, attrs, directiveName);
			},
			/**
				* Return the config for componente by parameters and verify all inconsistences for the "uni-confirm" functionality
				* @param {type} element
				* @param {type} attrs
				* @param {type} directiveName
				* @returns {Object}
				*/
			confirmConfig: function (element, attrs, directiveName) {
				var config = element.data(directiveName);
				if (!config) {
					config = $rootScope.$eval(attrs[directiveName] || '{}');
					var dom = element[0];
					delete attrs[directiveName];
					if (!config.skip) {
						var __name = directiveName.underscore(true);
						var COMPONENT = UI_UNIKIT[__name];
						if (COMPONENT) {
							var __config = impl.processComponentConfig(COMPONENT, config, dom, attrs);
							config = angular.extend(__config, config);
						}
					}
					element.data(directiveName, config);
				}
				return config;
			},
			buildIconClass: function (icon) {
				var className = "";
				if (icon) {
					className = DEFAUTL_CLASS_ICON + icon;
				}
				return className;
			},
			config: function () {
				return Object.freeze({
					FUNCTIONALITY: FN_UNIKIT,
					COMPONENT: UI_UNIKIT,
					CONVERT: CONVERT,
					REGEX: REGEX,
					ICON: DEFAUTL_CLASS_ICON
				});
			},
			VERSION: '1.0.2'
		};

	}]);
