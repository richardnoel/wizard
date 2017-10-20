/**
	* Directiva de Funcionalidad <b>uniConvert</b>, transforma o convierte valores de entrada para el 
	* uso en un determinado modelo.
	* 
	* ```html
	* <input  uni-convert type='text' uni-input=""/>
	* <input  uni-convert type='number' uni-input=""/>
	* <input  uni-convert type='email' uni-input=""/>
	* <input  uni-convert type='file' uni-input=""/>
	* <input  uni-convert type='datetime' uni-input=""/>
	* ```
	*
	* @param {JavaScript Object} `$rootScope` Variable de ámbito raiz, propio de angularJS.
	* @param {JavaScript Object} `$unikit` Modulo principal de todos los componentes.	
	* @api uniConvert
	*/
unikit.directive('uniConvert', ['$unikit', '$rootScope', function ($unikit, $rootScope) {
		/**
			* Funciones de evaluación de valores de tipo cadena
			* 
			* @api STRING_VALUE
			*/
		var STRING_VALUE = {
			//isInteger: function (value) {
			//	return typeof value === 'string' && /^-?\d+$/.test(value);
			//},
			//isDouble: function (value) {
			//	return typeof value === 'string' && /^-?\d+$/.test(value);
			//},
			/**
				* Verificar si el valor evaluado es un Obeto JSON
				* 
				* @returns {boolean} `value` Retorna verdadero si el valor evaluado es un Objeto JSON 
				* @api isObject
				*/
			isObject: function (value) {
				return typeof value === 'string' && /^\{?.*\}$/.test(value);
			},
			/**
				* Verificar si el valor evaluado es un Obeto Array
				* 
				* @returns {boolean} `value` Retorna verdadero si el valor evaluado es un Objeto Array 
				* @api isArray
				*/
			isArray: function (value) {
				return typeof value === 'string' && /^\[?.*\]$/.test(value);
			},
			/**
				* Verificar si el valor evaluado es un Obeto JSON
				* 
				* @returns {boolean} `value` Retorna verdadero si el valor evaluado es un tipo de filtro (>, <, =, %) 
				* @api isFilter
				*/
			isFilter: function (value) {
				return typeof value === 'string' && /^(\s|=|<|>|%|\!)\[?.*\]$/.test(value);
			}
		};
		/**
			* Verifica si la etiqueta es un "HTML INPUT"
			* 
			* @returns {boolean} `value` Retorna verdadero si la etiqueta es un "HTML input".
			* @api isInput
			*/
		var isInput = function (tag) {
			var result = false;
			if (tag && tag.tagName === "INPUT") {
				result = true;
			}
			return result;
		};
		/**
			* Verificar si el valor del modelo es requerido
			* 
			* @param {HTMLElement} `element` Elemento HTML input evaluado
			* @param {String} `modelValue` modelo declarado relacioando al valor de la etiqueta input 
			* @returns {boolean} `value` Retorna verdadero si la etiqueta es un "HTML input".
			* @api modelValueIsNoRequiredEmpty()
			*/
		var modelValueIsNoRequiredEmpty = function (element, modelValue) {
			if (!modelValue && !element[0].hasAttribute('required')) {
				return true;
			}
			return false;
		};
		/**
			* Objeto que almacena el conjunto de funciones de conversion o transformacion de valores
			* 
			* @api map FN_CONVERT
			*/
		var FN_CONVERT = {};
		/**
			* Define TEXT dentro de las funciones de conversion, esta propiedad almacenara todas las funciones de transformación
			* de una Cadena
			* 
			* @api map FN_CONVERT.TEXT
			*/
		FN_CONVERT.TEXT = {
			option: 'transform'
		};
		/**
			* Transforma el valor de la etiqueta input en texto mayuscula
			* 
			* @param {javscript Object} `config` configuración para la conversion del valor resive el valor: {transform: "upper", type: "TEXT"}
			* @param {javscript Object} `scope` propiedad angular Alcance del enla ce de datos
			* @param {HTMLElement} `element` Elemento HTML input evaluado
			* @param {javscript Object} `ngCtrlForm` controlador de modelo angular relacionado al formulario
			* @param {javscript Object} `ngCtrlModel` controlador de modelo angular relacionado al la etiqueta 
			* @returns {String} `modelValue` Retorna verdadero si la etiqueta es un "HTML input".
			* @api FN_CONVERT.TEXT.UPPER()
			*/
		FN_CONVERT.TEXT.UPPER = function (config, scope, element, ngCtrlForm, ngCtrlModel) {
			return {
				parser: function (viewValue) {
					var modelValue = viewValue.toUpperCase();
					ngCtrlModel.$setViewValue(modelValue);
					ngCtrlModel.$render();
					return modelValue;
				}
			};
		};
		/**
			* Transforma el valor de la etiqueta input en texto minusculas
			* 
			* @param {javscript Object} `config` configuración para la conversion del valor resive el valor: {transform: "upper", type: "TEXT"}
			* @param {javscript Object} `scope` propiedad angular Alcance del enla ce de datos
			* @param {HTMLElement} `element` Elemento HTML input evaluado
			* @param {javscript Object} `ngCtrlForm` controlador de modelo angular relacionado al formulario
			* @param {javscript Object} `ngCtrlModel` controlador de modelo angular relacionado al la etiqueta 
			* @returns {String} `modelValue` Retorna verdadero si la etiqueta es un "HTML input".
			* @api FN_CONVERT.TEXT.LOWER()
			*/
		FN_CONVERT.TEXT.LOWER = function (config, scope, element, ngCtrlForm, ngCtrlModel) {
			return {
				parser: function (viewValue) {
					var modelValue = viewValue.toLowerCase();
					ngCtrlModel.$setViewValue(modelValue);
					ngCtrlModel.$render();
					return modelValue;
				}
			};
		};
		/**
			* Transforma la primera letra del valor de la etiqueta input en mayuscula
			* 
			* @param {javscript Object} `config` configuración para la conversion del valor resive el valor: {transform: "upper", type: "TEXT"}
			* @param {javscript Object} `scope` propiedad angular Alcance del enla ce de datos
			* @param {HTMLElement} `element` Elemento HTML input evaluado
			* @param {javscript Object} `ngCtrlForm` controlador de modelo angular relacionado al formulario
			* @param {javscript Object} `ngCtrlModel` controlador de modelo angular relacionado al la etiqueta 
			* @returns {String} `modelValue` Retorna verdadero si la etiqueta es un "HTML input".
			* @api FN_CONVERT.TEXT.CAPITAL()
			*/
		FN_CONVERT.TEXT.CAPITAL = function (config, scope, element, ngCtrlForm, ngCtrlModel) {
			return {
				parser: function (viewValue) {
					var modelValue = viewValue.capitalize(false);
					ngCtrlModel.$setViewValue(modelValue);
					ngCtrlModel.$render();
					return modelValue;
				}
			};
		};
		/**
			* Transforma la primera letra de cada palabra en mayuscula
			* 
			* @param {javscript Object} `config` configuración para la conversion del valor resive el valor: {transform: "upper", type: "TEXT"}
			* @param {javscript Object} `scope` propiedad angular Alcance del enla ce de datos
			* @param {HTMLElement} `element` Elemento HTML input evaluado
			* @param {javscript Object} `ngCtrlForm` controlador de modelo angular relacionado al formulario
			* @param {javscript Object} `ngCtrlModel` controlador de modelo angular relacionado al la etiqueta 
			* @returns {boolean} `modelValue` Retorna verdadero si la etiqueta es un "HTML input".
			* @api FN_CONVERT.TEXT.CAPITAL_ALL()
			*/
		FN_CONVERT.TEXT.CAPITAL_ALL = function (config, scope, element, ngCtrlForm, ngCtrlModel) {
			return {
				parser: function (viewValue) {
					var modelValue = viewValue.capitalize(true);
					ngCtrlModel.$setViewValue(modelValue);
					ngCtrlModel.$render();
					//preventCursorPosition(element[0], modelValue);
					return modelValue;
				}
			};
		};
		/**
			* Define DATE dentro de las funciones de conversión, esta propiedad almacenara todas las funciones de conversión
			* de una campo de tipo fecha
			* 
			* @api map FN_CONVERT.DATE
			*/
		FN_CONVERT.DATE = function (config, scope, element, ngCtrlForm, ngCtrlModel) {
			element.attr('type', 'text');
			element.attr('title', 'Formato: ' + config.format);
			return {
//				changeListener: function (a, b) {
//					console.log('changeListener a->', a, ' b->', b, ngCtrlModel);
//				},
				/**
					* Transforma el valor a una fecha valida y evalua si el valor es requerido
					* 
					* @param {Date} `modelValue` Valor en formato "Fecha" GTM
					* @param {String} `viewValue` Valor literal de la fecha
					* @returns {boolean} `flag` si el valor es valido retorn "true" de lo contrario "false"
					* @api FN_CONVERT.DATE.validator()
					*/
				validator: function (modelValue, viewValue) {
					var isString = angular.isString(modelValue);
					var isNumber = angular.isNumber(modelValue);
					if (isString || isNumber) {
						try {
							ngCtrlModel.$$rawModelValue = ngCtrlModel.$modelValue = modelValue = new Date(modelValue);
							ngCtrlModel.$$writeModelToScope();
						} catch (e) {
						}
					}
					//console.log('validator::: ', modelValue, '--->', angular.isDate(modelValue), ngCtrlModel);
					return modelValueIsNoRequiredEmpty(element, modelValue) || angular.isDate(modelValue);
				},
				/**
					* Analiza el valor formato y lo transforma en un valor de tipo fecha
					* la transformación se con el uso de la libreria <a href="https://momentjs.com/">momens js</a>
					* 
					* @param {String|String} `modelValue` Valor en formato "Fecha" GTM
					* @returns {Date} `viewValue` El valor en formato "Fecha" GTM
					* @api FN_CONVERT.DATE.validator()
					*/
				formatter: function (modelValue) {
					//console.log(ngCtrlModel.$name, ' ==>formatter::: ', modelValue, '--->', ngCtrlModel);
					var viewValue;
					try {
						var isString = angular.isString(modelValue);
						var isNumber = angular.isNumber(modelValue);
						if (isString || isNumber) {
							modelValue = new Date(modelValue);
						}
						var isDate = angular.isDate(modelValue);
						if (isDate && moment) {
							viewValue = moment(modelValue).format(config.format);
						}
						//console.log('formatter isDate: ', isDate, ' modelValue:', molValue, ' viewValue:', viewValue, ' format:', config.format);
					} catch (e) {
						console.error(e);
					}
					return viewValue;
				},
				/**
					* Analiza el valor introducido y lo transforma en un valor de tipo fecha
					* la transformación se con el uso de la libreria <a href="https://momentjs.com/">momens js</a>
					* 
					* @param {String} `viewValue` Valor literal de la fecha
					* @returns {Date} `modelValue` retorna el valor transformado en una fecha GMT
					* @api FN_CONVERT.DATE.validator()
					*/
				parser: function (viewValue) {
					var modelValue = undefined;
					try {
						var isString = angular.isString(viewValue);
						if (isString && viewValue !== '' && moment) {
							var temp = moment(viewValue, config.format, true);
							if (temp.isValid()) {
								modelValue = temp.toDate();
							}
						}
						//console.log('parser isString: ', isString, ' modelValue:', modelValue, ' viewValue:', viewValue, ' format:', config.format);
					} catch (e) {
						console.error(e);
					}
					return modelValue;
				}
			};
		};
		FN_CONVERT.DATETIME = FN_CONVERT.DATE;
		FN_CONVERT.TIME = FN_CONVERT.DATE;
		FN_CONVERT.DATETIME_LOCAL = FN_CONVERT.DATE;
		/**
			* Define NUMBER dentro de las funciones de conversión, esta propiedad almacenara todas las funciones de conversión
			* de una campo de tipo number
			* 
			* @api map FN_CONVERT.NUMBER
			*/
		FN_CONVERT.NUMBER = function (config, scope, element, ngCtrlForm, ngCtrlModel) {
			element.attr('type', 'text');
			return {
				/**
					* Evalua y valida si el valor es requerido
					* 
					* @param {Number} `modelValue` Valor de tipo "Number"
					* @param {String} `viewValue` Valor del elemento HTML input
					* @returns {boolean} `flag` si el valor es valido retorn "true" de lo contrario "false"
					* @api FN_CONVERT.NUMBER.validator()
					*/
				validator: function (modelValue, viewValue) {
					return modelValueIsNoRequiredEmpty(element, modelValue) || angular.isNumber(modelValue);
				},
				/**
					* Analiza el valor introducido y lo transforma en un valor de tipo numerico
					* 
					* @param {String} `viewValue` Valor literal del campo input
					* @returns {boolean} `modelValue` retorna el valor transformado en un valor numerico
					* @api FN_CONVERT.NUMBER.parser()
					*/
				parser: function (viewValue) {
					var char = config.decimalChar || '.';
					if (config.mask) {
						viewValue = element.masked(viewValue);
						viewValue = viewValue.replace(/[^(0-9.,)*]/gi, '');
					}
					try {
						if (char === '.') {
							viewValue = viewValue.replace(/\,/gi, '');
						} else if (char === ',') {
							viewValue = viewValue.replace(/\./gi, '').replace(/\,/gi, '.');
						} else {
							viewValue = viewValue.replace(/\,|\./gi, '');
						}
					} catch (e) {
						console.warn(e.message);
					}
					var modelValue = Number(viewValue);
					modelValue = modelValue || modelValue === 0 ? modelValue : undefined;
					return modelValue;
				},
				/**
					* Convierte el valor introducido en un valor Numerico valido
					* 
					* @param {String} `modelValue` Valor en numerico del modelo
					* @returns {Date} `viewValue` El valor de tipo number
					* @api FN_CONVERT.NUMBER.formatter()
					*/
				formatter: function (modelValue) {
					var viewValue;
					var char = config.decimalChar || '.';
					if (config.mask) {
						viewValue = element.masked(modelValue);
					} else if (char && char === ',') {
						modelValue = angular.isNumber(modelValue) ? modelValue : parseFloat(modelValue);
						viewValue = modelValue.replace('.', char);
					} else {
						viewValue = angular.isNumber(modelValue) ? modelValue : parseInt(modelValue);
					}
					if (viewValue || viewValue === 0) {
						viewValue = '' + viewValue;
					}
					return viewValue;
				}
			};
		};
		FN_CONVERT.MONEY = FN_CONVERT.NUMBER;
		FN_CONVERT.MONEY2 = FN_CONVERT.NUMBER;
		FN_CONVERT.MONEY3 = FN_CONVERT.NUMBER;
		FN_CONVERT.MONEY5 = FN_CONVERT.NUMBER;
		FN_CONVERT.DOUBLE = FN_CONVERT.NUMBER;
		FN_CONVERT.INTEGER = FN_CONVERT.NUMBER;
		/**
			* Define OBJECT dentro de las funciones de conversión, esta propiedad almacenara todas las funciones de conversión
			* de una campo de tipo json object 
			* 
			* @param {javscript Object} `config` configuración para la conversion del valor resive el valor: {transform: "upper", type: "TEXT"}
			* @param {javscript Object} `scope` propiedad angular Alcance del enla ce de datos
			* @param {HTMLElement} `element` Elemento HTML input evaluado
			* @param {javscript Object} `ngCtrlForm` controlador de modelo angular relacionado al formulario
			* @param {javscript Object} `ngCtrlModel` controlador de modelo angular relacionado al la etiqueta 
			* @returns {String} `modelValue` Retorna verdadero si la etiqueta es un "HTML input".
			* @api FN_CONVERT.TEXT.UPPER()
			*/
		FN_CONVERT.OBJECT = function (config, scope, element, ngCtrlForm, ngCtrlModel) {
			element.attr('type', 'text');
			return {
				/**
					* Evalua y valida si el valor es requerido
					* 
					* @param {Number} `modelValue` Valor de tipo Object json
					* @param {String} `viewValue` Valor del elemento HTML input
					* @returns {boolean} `flag` si el valor es valido retorn "true" de lo contrario "false"
					* @api FN_CONVERT.OBJECT.validator()
					*/
				validator: function (modelValue, viewValue) {
					return modelValueIsNoRequiredEmpty(element, modelValue) || (angular.isObject(modelValue) && STRING_VALUE.isObject(viewValue));
				},
				/**
					* Analiza el valor introducido y lo transforma en un objeto JSON
					* 
					* @param {String} `viewValue` Valor literal del campo input
					* @returns {boolean} `modelValue` retorna el valor transformado en un objeto JSON
					* @api FN_CONVERT.OBJECT.parser()
					*/
				parser: function (viewValue) {
					var valueModel;
					try {
						if (angular.isObject(viewValue)) {
							valueModel = viewValue;
						} else if (STRING_VALUE.isObject(viewValue)) {
							valueModel = $rootScope.$eval(viewValue);
						}
					} catch (e) {
						console.error('Error conver to object: ', e.message);
					}
					return valueModel;
				},
				/**
					* Convierte el valor introducido en un valor Numerico valido
					* 
					* @param {String} `modelValue` Valor en numerico del modelo
					* @returns {Date} `viewValue` El valor de tipo number
					* @api FN_CONVERT.NUMBER.formatter()
					*/
				formatter: function (modelValue) {
					var viewValue;
					try {
						if (angular.isObject(modelValue)) {
							viewValue = JSON.stringify(modelValue);
						} else if (STRING_VALUE.isObject(modelValue)) {
							viewValue = modelValue;
						}
					} catch (e) {
						console.error('Error conver to object: ', e.message);
					}
					return viewValue;
				}
			};
		};
		/**
			* Define ARRAY dentro de las funciones de conversión, esta propiedad almacenara todas las funciones de conversión
			* de una campo de tipo ARRAY
			* 
			* @param {javscript Object} `config` configuración para la conversion del valor resive el valor: {transform: "upper", type: "TEXT"}
			* @param {javscript Object} `scope` propiedad angular Alcance del enla ce de datos
			* @param {HTMLElement} `element` Elemento HTML input evaluado
			* @param {javscript Object} `ngCtrlForm` controlador de modelo angular relacionado al formulario
			* @param {javscript Object} `ngCtrlModel` controlador de modelo angular relacionado al la etiqueta 
			* @returns {String} `modelValue` Retorna verdadero si la etiqueta es un "HTML input".
			* @api FN_CONVERT.TEXT.UPPER()
			*/
		FN_CONVERT.ARRAY = function (config, scope, element, ngCtrlForm, ngCtrlModel) {
			element.attr('type', 'text');
			return {
				/**
					* Evalua y valida si el valor es requerido
					* 
					* @param {Number} `modelValue` Valor de tipo Object Array
					* @param {String} `viewValue` Valor del elemento HTML input
					* @returns {boolean} `flag` si el valor es valido retorn "true" de lo contrario "false"
					* @api FN_CONVERT.OBJECT.validator()
					*/
				validator: function (modelValue, viewValue) {
					return modelValueIsNoRequiredEmpty(element, modelValue) || (angular.isArray(modelValue) && STRING_VALUE.isArray(viewValue));
				},
				/**
					* Analiza el valor introducido y lo transforma en un objeto JSON
					* 
					* @param {String} `viewValue` Valor literal del campo input ['a','c']
					* @returns {boolean} `valueModel` retorna el valor transformado en un objeto ARRAY
					* @api FN_CONVERT.OBJECT.parser()
					*/
				parser: function (viewValue) {
					var valueModel;
					try {
						if (angular.isArray(viewValue)) {
							valueModel = viewValue;
						} else if (STRING_VALUE.isArray(viewValue)) {
							valueModel = $rootScope.$eval(viewValue);
						}
					} catch (e) {
						console.error('Error convert to array: ', e.message);
					}
					return valueModel;
				},
				/**
					* Convierte el valor introducido en un valor Numerico valido
					* 
					* @param {String} `modelValue` Valor Objeto Array del modelo ['a','b']
					* @returns {Date} `viewValue` El valor de tipo number
					* @api FN_CONVERT.NUMBER.formatter()
					*/
				format: function (modelValue) {
					var viewValue;
					if (angular.isArray(modelValue)) {
						viewValue = JSON.stringify(modelValue);
					} else if (STRING_VALUE.isArray(modelValue)) {
						viewValue = modelValue;
					}
					return viewValue;
				}
			};
		};
		/**
			* Define SPLIT dentro de las funciones de conversión, esta propiedad almacenara todas las funciones de conversión
			* de una campo de tipo ARRAY
			* 
			* @param {javscript Object} `config` configuración para la conversion del valor resive el valor: {transform: "upper", type: "TEXT"}
			* @param {javscript Object} `scope` propiedad angular Alcance del enla ce de datos
			* @param {HTMLElement} `element` Elemento HTML input evaluado
			* @param {javscript Object} `ngCtrlForm` controlador de modelo angular relacionado al formulario
			* @param {javscript Object} `ngCtrlModel` controlador de modelo angular relacionado al la etiqueta 
			* @returns {function} `function` retorna las funciones de evaluación para el tipo SPLIT 
			* @api FN_CONVERT.SPLIT()
			*/
		FN_CONVERT.SPLIT = function (config, scope, element, ngCtrlForm, ngCtrlModel) {
			element.attr('type', 'text');
			return {
				/**
					* Evalua y valida si el valor es requerido
					* 
					* @param {Number} `modelValue` Valor de tipo Object Array
					* @param {String} `viewValue` Valor del elemento HTML input
					* @returns {boolean} `flag` si el valor es valido retorn "true" de lo contrario "false"
					* @api FN_CONVERT.SPLIT.validator()
					*/
				validator: function (modelValue, viewValue) {
					return modelValueIsNoRequiredEmpty(element, modelValue) || angular.isArray(modelValue);
				},
				/**
					* Analiza el valor introducido y lo transforma en un objeto ARRAY
					* 
					* @param {String} `viewValue` Valor literal del campo input, los criterios de division son (",","|" y ";")
					* @returns {boolean} `valueModel` retorna el valor transformado en un objeto ARRAY
					* @api FN_CONVERT.SPLIT.parser()
					*/
				parser: function (viewValue) {
					var valueModel;
					try {
						if (angular.isArray(viewValue)) {
							valueModel = viewValue;
						} else if (viewValue) {
							valueModel = viewValue.split(/\,|\;|\|/);
						}
					} catch (e) {
						console.error('Error convert to split: ', e.message);
					}
					return valueModel;
				}
			};
		};
		/**
			* Define FILE dentro de las funciones de conversión, esta propiedad almacenara todas las funciones de conversión
			* de una campo de tipo FILE
			* 
			* @param {javscript Object} `config` configuración para la conversion del valor resive el valor: {transform: "upper", type: "TEXT"}
			* @param {javscript Object} `scope` propiedad angular Alcance del enla ce de datos
			* @param {HTMLElement} `element` Elemento HTML input evaluado
			* @param {javscript Object} `ngCtrlForm` controlador de modelo angular relacionado al formulario
			* @param {javscript Object} `ngCtrlModel` controlador de modelo angular relacionado al la etiqueta 
			* @returns {function} `function` retorna las funciones de evaluación  para el campo file.
			* @api FN_CONVERT.FILE()
			*/
		FN_CONVERT.FILE = function (config, scope, element, ngCtrlForm, ngCtrlModel) {
			var parent = $(element[0].parentNode);
			element.bind('change', function (e) {
				var domViewFile = (e.srcElement || e.target).files;
				var ngViewFile = [];
				var fn = {
					init: function () {
						ngViewFile = [];
						angular.forEach(domViewFile, function (file, i) {
							ngViewFile[i] = {name: file.name, size: file.size, type: file.type, value: '', state: 0};
						});
					},
					apply: function () {
						scope.$apply(function () {
							ngCtrlModel.$setViewValue(ngViewFile);
						});
					},
					/**
						*  Evalua el "FileList" cuando se adiciona un archivo modificando ngViewFile adicionando valores como {name:"",size:0,type:"",value:""}
						*  
						* @api readBase64()
						*/
					readBase64: function () {
						parent.addClass('uni-init-file');
						angular.forEach(domViewFile, function (file, i) {
							var reader = new FileReader();
							reader.readAsBinaryString(file);
							reader.onload = function () {
								ngViewFile[i].state = 1;
								ngViewFile[i].value = btoa(reader.result);
								reader = null;
							};
							reader.onerror = function () {
								ngViewFile[i].state = 2;
								ngViewFile[i].value = '';
								reader = null;
							};
						});
					},
					/**
						*  Evalua el "FileList" cuando se adiciona un archivo modificando ngViewFile adicionando valores como {name:"",size:0,type:"",value:""}
						*  
						* @api readBase64()
						*/
					applyIfComplete: function () {
						var isComplete = fn.isComplete();
						if (isComplete === true) {
							parent.removeClass('uni-init-file');
							ngViewFile = angular.copy(ngViewFile, []); //FIX NG-CHANGE COMPLETE
							fn.apply();
							fn = undefined;
							ngViewFile = undefined;
							domViewFile = undefined;
						} else {
							setTimeout(fn.applyIfComplete, 30);
						}
					},
					/**
						*  Evalua el estado del archivo adjunto
						*  @returns {boolean} `boolean` si termino de adjuntase el archivo retorna true
						* @api readBase64()
						*/
					isComplete: function () {
						for (var i = 0; i < ngViewFile.length; i++) {
							var file = ngViewFile[i];
							if (file.state === 0) {
								return false;
							}
						}
						return true;
					}
				};
				fn.init();
				fn.apply();
				setTimeout(fn.readBase64, 10);
				setTimeout(fn.applyIfComplete, 10);
			});
			return {
				parser: function (viewFile) {
					return config.multiple ? viewFile : viewFile[0];
				}
			};
		};
		FN_CONVERT.FILTER = function (config, scope, element, ngCtrlForm, ngCtrlModel) {
			element.attr('type', 'text');
			var ALL = {
				'=': 'eq', '!': 'ne', '!=': 'ne',
				'%': 'li', '!%': 'nl',
				'>': 'gt', '>=': 'ge',
				'<': 'lt', '<=': 'le'
			};

			function createFilterValue(value = '') {
				var re = /(=|<=|>=|<|>|!|~)(.*)/g;
				var match = re.exec(value || '');
				var filter = {};
				if (match && match.length === 2) {
					filter.oper = ALL[match[0] || '='];
					filter.value = (match[1] || '').split(/\,|\;|\|/);
				} else {
					filter.oper = 'eq';
					filter.value = (value || '').split(/\,|\;|\|/);
				}
				return filter;
			}

			return {
				/**
					* Evalua y valida si el valor es requerido
					* 
					* @param {String} `modelValue` 
					* @param {String} `viewValue` Valor del elemento HTML input
					* @returns {boolean} `flag` si el valor es valido retorn "true" de lo contrario "false"
					* @api FN_CONVERT.FILTER.validator()
					*/
				validator: function (modelValue, viewValue) {
					return modelValueIsNoRequiredEmpty(element, modelValue) || angular.isObject(modelValue);
				},
				parser: function (viewValue) {
					var valueModel = {};
					if (viewValue) {
						valueModel = createFilterValue(viewValue);
					}
					return valueModel;
				}
			};
		};

		/**
			* Agrega el complemento "DateTimePicker" para crear campos de tipo fecha y hora.
			* 
			* @param {javscript Object} `config` configuración del la funcionalidad date convert
			* @param {HTMLElement} `element` Objetivo "HTML Input" el cual sera afectado con la fucionalidad de  "DateTimePicker"
			**/
		var createTimePicker = function (config, element) {
			var dateConfig = {
				TIME: {
					format: config.format,
					formatTime: config.format,
					timepicker: /TIME/gi.test(config.type),
					datepicker: /DATE/gi.test(config.type)
				},
				DATE: {
					format: config.format,
					formatDate: config.format,
					timepicker: false,
					datepicker: true
				},
				DATETIME: {
					format: config.format,
					formatDate: config.format.split(" ")[0],
					formatTime: config.format.split(" ")[1],
					timepicker: true,
					datepicker: true
				}
			};
			element.datetimepicker(dateConfig[config.type]);
		};
		return  {
			restrict: 'A',
			require: ['^?form', '?ngModel'],
			link: function (scope, element, attrs, ngCtrl) {
				var ngCtrlForm = ngCtrl[0];
				var ngCtrlModel = ngCtrl[1];
				if (!ngCtrlModel) {
					console.warn('Directive: uniConvert required ng-model or ng-value attribute!.');
					return;
				}
				var config = $unikit.convertConfig(element, attrs, 'uniConvert');
				var fnCallback = FN_CONVERT[config.type];
				if (angular.isObject(fnCallback)) {
					var option = config[fnCallback.option];
					option = option.underscore(true);
					fnCallback = fnCallback[option];
				}
				if (angular.isFunction(fnCallback)) {
					var convert = fnCallback.apply(this, [config, scope, element, ngCtrlForm, ngCtrlModel]);
					ngCtrlModel.$parsers.length = 0;
					ngCtrlModel.$formatters.length = 0;
					if (convert.validator) {
						ngCtrlModel.$validators.convertTo = convert.validator;
					}
					if (convert.parser) {
						ngCtrlModel.$parsers.unshift(convert.parser);
					}
					if (convert.formatter) {
						ngCtrlModel.$formatters.push(convert.formatter);
					}
					if (convert.changeListener) {
						ngCtrlModel.$viewChangeListeners.push(convert.changeListener);
					}
				}
				if (config.mask && isInput(element[0])) {
					config.options = config.options || {};
					config.options.placeholder = config.mask.replace(/[a-z0-9]/gi, '_').replace(/[\#]*/gi, '');
					if (/TIME|DATE/gi.test(config.type)) {
						element.mask(config.mask, config.options);
					} else if (/NUM|INT|DOUBL|CURREN|MONEY/gi.test(config.type)) {
						element.mask(config.mask, config.options);
					} else if (/TEXT|STRIN/gi.test(config.type)) {
						element.mask(config.mask, config.options);
					} else {
						config.mask = undefined;
					}
					if (config.mask) {
						ngCtrlModel.$parsers.unshift(function (value) {
							return element.masked(value);
						});
					}
				}
				if ((config.format || /TIME|DATE/gi.test(config.type)) && isInput(element[0])) {
					createTimePicker(config, element);
				}
			}
		};
	}]);
