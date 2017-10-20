/**
	* Directiva de funcionaliad <b>uni-validator</b>, que permite validar los campos de un formulario.
	* La validación  se muestra en una ventana modal listando todos los errores de validación o en un 
	* "tooltip" poniendo el foco en el campo invalido.
	* 
	* ```html
	* <form uni-validator>
	*		<div uni-grid>
	*			<!-- aca tu HTML para el cuerpo -->
	*		</div>
	* </form>
	* ```
	*
	* @param {JavaScript Object} `$unikit` Modulo principal de todos los componentes.
	* @param {JavaScript Object} `$rootScope` Variable de ámbito raiz, propio de angularJS.
	* @param {JavaScript Object} `$compile` Compila una cadena HTML o DOM en una plantilla, propio de angularJS.
	* @api uniValidator
	*/
unikit.directive('uniValidator', ['$unikit', '$rootScope', '$compile', function ($unikit, $rootScope, $compile) {
		var SEPARATOR_MSG = '$';
		var elementTooltipAttached = null;
		/**
			* Obtiene los elementos "controles " de un HTML Form y adiciona una configuración a los elementos encontrados.
			* 
			* @param {HTMLElement} `form` Elemento HTML 
			* @returns {Array} `elements` Elementos que son parte del HTML Form 
			* @api metodo getFormElements()
			*/
		var getFormElements = function (form) {
			var elements = {};
			angular.forEach(form[0].elements, function (item, index) {
				if (item.name) {
					item = angular.element(item);
					var uniParentControl = item.closest('.uni-field');
					try {
						var component = uniParentControl[0] && uniParentControl.data()['component'] ? uniParentControl.data()['component'] : {};
						elements[item.attr('name')] = {
							name: item.attr('name'),
							id: item.attr('id') || '',
							model: item.attr('ng-Model') || '',
							type: component['type'] ? component['type'].toLowerCase() : item.attr('type'),
							controlElement: item,
							isUniField: uniParentControl[0] ? true : false,
							uniParentControl: uniParentControl[0] ? uniParentControl : item.parent(),
							index: index,
							isUniGroupChild: item.closest('.uni-mainGroup')[0] ? true : false
						};
					} catch (err) {
						console.log('-->', item, ' - ', index, ' Error: ', err);
					}
				}
			});
			return elements;
		};
		/**
			* Realiza una busqueda de los errores registrados en "allMessages" para un tipo de dato, 
			* recoriendo "ngErrors" que son los errores de validacion de angular, si lo encuentra fija el mensage y el mensaje i18n.
			* 
			* @param {javascrip Object} `ngErrors`  Errores que angular obtiene del formulario
			* @param {HTMLElement} `item`  HTMLElemet del cual se quiere identificar el error
			* @param {JSON Object} `allMessages` Todos los mensajes de validacion que estan registrados en el archivo config.js
			* @returns {Array} `resultMessage` conjunto de errores encontrados en elemnto
			* @api metodo getElementErrorMessages()
			*/
		var getElementErrorMessages = function (ngErrors, item, allMessages) {
			var resultMessage = [];
			for (var error in ngErrors) {
				var key = error + SEPARATOR_MSG + item.type;
				var messaje = "";
				if (allMessages[key]) {
					messaje = allMessages[key];
				} else if (allMessages[error]) {
					messaje = allMessages[error];
				} else {
					console.warn(key, ": error is not registered in config file");
				}
				resultMessage.push({
					'message': messaje,
					'i18n': allMessages[key] ? key : error
				});
			}
			return resultMessage;
		};
		/**
			* Busca la etiqueta "label" relacionado para el HTMl control.
			* 
			* @param {HTMLElement} `item` Elemento HTLM control evaluado 
			* @param {HTMLElement} `form` Element HTML Form, contexto de validación
			* @returns {Object} `Object` resultado de la busqueda, retorna el texto de la etiqueta "label" y internacionalización i18n 
			* @api metodo findLabelsInform()
			*/
		var findLabelsInform = function (item, form) {
			var result;
			if (item.isUniGroupChild) {
				var itemContainer = item.uniParentControl.closest('.uni-mainGroup').parent();
				result = itemContainer.prev().find('label');
			} else {
				result = form.find("label[for='" + item.id + "']");
			}
			return {
				i18n: result ? result.attr('i18n') : '',
				text: result.text()
			};
		};
		/**
			* Construye el conjunto configuraciones para mostrar el error de un HTML control del contexto del formulario.
			* 
			* @param {javascript Object} `ngErrors` Errores que angular obtiene del formulario
			* @param {HTMLElement} `item` Elemento HTLM control evaluado 
			* @param {javascript Object} `allMessages` Todos los mensajes de validacion que estan registrados en el archivo config.js
			* @param {HTMLElement} `form` Element HTML Form, contexto de validación
			* @returns {Object} `attributes` Retorna el conjunto de propiedades de validacion para un el elemento HTML control.
			* @api metodo buildErrorItem();
			*/
		var buildErrorItem = function (ngErrors, item, allMessages, form) {
			var atributes = {};
			if (item) {
				var labels = findLabelsInform(item, form);
				atributes = {
					id: item.id,
					model: item.name,
					messages: getElementErrorMessages(ngErrors, item, allMessages),
					label: labels.text || item.name,
					i18n: labels.i18n,
					element: item.controlElement,
					indexInForm: item.index
				};
			}
			return atributes;
		};
		/**
			* Obtiene el listado de errores de validación de angular en el contexto del formulario y los relaciona al 
			* elemento HTML control correspodiente, generando un objeto que mapea los errores por elemento HTML control.
			* 
			* @param {javascript Object} `ngErros`  Errores que angular obtiene del formulario
			* @param {javascript Object} `config` Configuración del componente definido por el usuario y unidos con la configuracion por defecto de "unikit" config.  
			* @param {HTMLElement} `form` Elemento HTML Form que se esta validando
			* @returns {Object} `messageList` Conjunto de elementos que contienen la validación para cada elemento invalido. 
			* @api metodo getListErrors()
			*/
		var getListErrors = function (ngErros, config, form) {
			var item;
			var messageList = {};
			for (item in ngErros) {
				var ngErrorList = ngErros[item];
				for (var i = 0; i < ngErrorList.length; i += 1) {
					var ngError = ngErrorList[i];
					if (!messageList[ngError.$name]) {
						item = getFormElements(form)[ngError.$name];
						if (item) {
							var result = buildErrorItem(ngError.$error, item, config.validationsMessage, form);
							messageList[result.label] = result;
						}
					}
				}
			}
			return messageList;
		};
		/**
			* Ordena los elementos invalidos en secuancia de creacion en el DOM del formulario validado.
			* 
			* 
			* @param {javascript Object} `mapErrosMessages` Errores de validación del formulario
			* @returns {OBject} `Object` Elmentos invalidos ordenado por indice de creacion en el DOM.
			*/
		var sortErrorListMessages = function (mapErrosMessages) {
			var listMessages = [];
			var removeEmptyItem = function (messagesArray) {
				var result = [];
				for (var i = 0; i < messagesArray.length; i += 1) {
					if (messagesArray[i]) {
						result.push(messagesArray[i]);
					}
				}
				return result;
			};
			for (var itemMessage in mapErrosMessages) {
				var message = mapErrosMessages[itemMessage];
				listMessages[message.indexInForm] = message;
			}
			return removeEmptyItem(listMessages);
		};
		/**
			* Adiciona estilo de interaccion con el elemento invalido
			* 
			* @param {Array} `errorList` Lista de errores de validación
			* @api metodo setErrorCssClass();
			*/
		var setErrorCssClass = function (errorList) {
			var element, i;
			for (i = 0; i < errorList.length; i += 1) {
				if (errorList[i].element.closest('.bootstrap-select')[0]) {
					element = errorList[i].element.closest('.bootstrap-select');
				} else {
					element = errorList[i].element;
				}
				element.addClass('ng-touched');
			}
		};
		/**
			* Valida el fomulario, este metodo es llamdo por el "scope" del HTML form, 
			* que ejecuta los metodos de validacion de los controle del formulario.
			* 
			* 
			* @param {javascript Object} `scope` Es un objeto que se refiere al alcance del modelo en la aplicación
			* @param {javascript Object} `ngCtrol` Es un objeto que se refiere al alcance del modelo en la aplicación
			* @param {javascript Object} `config` Enlaza un objeto FormControl a un elemento DOM Form.
			* @param {HTMLElement} `form` Elemento HTMl Form validado
			* @param {String} `model` Modelo relacionado al para visualizar la ventana de lista de validación con "ng-show"
			* @param {event} `e` Evento asociado a la ejecución a la acción de validación.
			* @api metodo validate();
			*/
		var validate = function (scope, ngCtrol, config, form, model, e) {
			var errosObject;
			if (!ngCtrol.$valid) {
				errosObject = getListErrors(ngCtrol.$error, config, form);
				scope.errorList = sortErrorListMessages(errosObject);
				setErrorCssClass(scope.errorList);
				if (scope.errorList.length) {
					if (config.type === "TOOLTIP") {
						validateTooltip(scope, form, e);
					} else {
						scope[model] = true;
					}
				}
				if (e) {
					e.stopPropagation();
					e.preventDefault();
				}
			}
		};
		/**
			* Fija el foco en el "HTML Control"	que tiene el error de validacion y muestra los errores de validación en "tooltip".
			* 
			* @param {javascript Object} `scope` Es un objeto que se refiere al alcance del modelo en la aplicación
			* @param {HTMLElement} `form` Elemento HTMl Form validado
			* @param {event} `e` Evento asociado a la ejecución a la acción de validación.
			* @api metodo validate();
			*/
		var validateTooltip = function (scope, form, e) {
			var $element = scope.errorList[0].element;
			var messages = scope.errorList[0].messages;
			var listItems = '';
			var position = 'bottom';
			if (elementTooltipAttached) {
				elementTooltipAttached.removeAttr('title');
				elementTooltipAttached.removeAttr('data-toggle');
				elementTooltipAttached.removeAttr('data-placement');
				elementTooltipAttached.removeAttr('data-html');
			}
			elementTooltipAttached = $element;
			for (var i = 0; i < messages.length; i += 1) {
				listItems = listItems + '<li>' + messages[i].message + '</li>';
			}
			if (/date|time/i.test($element[0].className)) {
				position = 'top';
			}
			$element.addClass('ng-touched');
			if ($element[0].type === "file") {
				$element = $element.closest('div').find('input').eq(0);
			} else if ($element[0].tagName === "SELECT") {
				$element = $element.closest('.uni-field').find('button');
			}
			$element.attr('title', listItems);
			$element.attr('data-content', listItems);
			$element.attr('data-html', 'true');
			$element.attr('data-trigger', "focus");
			$element.attr('data-placement', position);
			$element.focus();
		};
		/**
			* Crea un Template HTML para mostrar la lista de errores de validacion del fomulario.
			* 
			* @param {String} `nameForm` Nombre del formulaio que esta siendo validado
			* @param {String} `model` Modelo relacionado al para visualizar la ventana de lista de validación con "ng-show"
			* @param {String} `idModel` un identificador randomico para adicionar al modelo.
			* @api metodo createModalErros();
			*/
		var createModalErros = function (nameForm, model, idModel) {
			var configPanel = {type: 'MODAL', level: 'warning', width: 450};
			var title = "El formulario contiene errores";
			var closeIconConfig = {level: 'danger', icon: 'close'};
			var ModalTemplate = "<div class='uni-validator-modal'><fieldset id='{idModel}' uni-panel='{configPanel}' ng-click='__clickModal($event)' ng-show='{model}'>" +
											"<legend><span>{title}<span style='float:right'>" +
											"<button class='' uni-badge='{closeIconConfig}' ng-click='{model}=false;__setFocus({nameForm});$event.preventDefault();'>" +
											"</button>\n\</span></span>" +
											"</legend>" +
											"<ul class='error-main list-unstyled'>" +
											"<li ng-repeat='menssage in errorList'><i class='icon fa fa-window-close-o'></i><b class='main-message'> {{menssage.label}}</b>" +
											"<ul class='error-child list-unstyled'>" +
											"<li ng-repeat='error in menssage.messages' i18n='{{error.i18n}}'>- {{error.message}}</li>" +
											"</ul>" +
											"</li>" +
											"</ul>" +
											"</fieldset><div>";
			ModalTemplate = ModalTemplate.replace(/{idModel}/g, idModel);
			ModalTemplate = ModalTemplate.replace(/{configPanel}/g, JSON.stringify(configPanel));
			ModalTemplate = ModalTemplate.replace(/{model}/g, model);
			ModalTemplate = ModalTemplate.replace(/{title}/g, title);
			ModalTemplate = ModalTemplate.replace(/{closeIconConfig}/g, JSON.stringify(closeIconConfig));
			ModalTemplate = ModalTemplate.replace(/{nameForm}/g, nameForm);
			return ModalTemplate;
		};
		return {
			restrict: 'A',
			require: '^?form',
			link: function (scope, element, attrs, ngCtrol) {
				var config = $unikit.validateConfig(element, attrs, this.name);
				var model = 'uni' + Math.random().toString(16).slice(2);
				scope[model] = false;
				ngCtrol.$validate = function (e) {
					element.data('elements', getFormElements(element));
					if (ngCtrol.$invalid) {
						validate(scope, ngCtrol, config, element, model, e);
						element.removeClass('uni-valid-form');
					} else {
						element.addClass('uni-valid-form');
					}
					return ngCtrol.$valid;
				};
				scope.__setFocus = function () {
					if (scope.errorList) {
						scope.errorList[0].element.focus();
					}
				};
				if (config.type === "TOOLTIP") {
					$(element).tooltip({
						selector: "[title]",
						trigger: "focus",
						'data-html': "true"
					});
				} else {
					var idModel = 'uni' + Math.random().toString(16).slice(2);
					scope.__clickModal = function (event) {
						if (event.target.parentNode.id === idModel) {
							scope[model] = false;
							scope.__setFocus();
						}
					};
					var modal = createModalErros(attrs.name, model, idModel);
					modal = angular.element(modal, model);
					$compile(modal)(scope);
					element.after(modal);
				}
			}
		};
	}]);
