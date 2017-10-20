/**
	* Directiva de diseño <b>uniPanel</b>, transforma un <code>html DIV o Fieldset a un </code>HTML Panel<code>
	* de </code> <a href='http://getbootstrap.com/css/#forms' target='_blank'>Bootstrap</a>.	
	* 
	* ```html
	* <div uni-panel></div>
	* <div uni-panel=""></div>
	* <div uni-panel="{type:'panel'}"></div>
	* <div uni-panel="{type:'modal'}"></div>
	* <div uni-panel="{type:'subpanel'}"></div>
	* ```
	*
	* @param {JavaScript Object} `$rootScope` Variable de ámbito raiz, propio de angularJS.
	* @param {JavaScript Object} `$unikit` Modulo principal de todos los componentes.
	* @param {JavaScript Object} `$compile` Compila una cadena HTML o DOM en una plantilla, propio de angularJS.
	* @api uniPanel
	*/
unikit.directive('uniPanel', ['$rootScope', '$unikit', '$compile', function ($rootScope, $unikit, $compile) {
		/**
			* Configura la partes <code>header, body, footer</code> del panel en un objeto JSON
			* 
			* ```js
			* var parts = createPanelObject(HTMLElement)
			* ```
			* @param {HTMLElement} `dom` HTML original sobre el cual se asigno la directiva 
			* @returns {JSON Object} `panel` Configuración de los elemento que componen al panel "header", "body" y "footer".
			* @api createPanelObject
			*/
		var createPanelObject = function (dom) {
			var panel = {header: undefined, content: undefined, footer: undefined};
			panel.header = querySelector(dom, 'legend, header');
			if (panel.header) {
				dom.removeChild(panel.header);
			} else if (dom.getAttribute('title')) {
				panel.header = document.createElement("div");
				var title = dom.getAttribute('title');
				title = document.createTextNode(title);
				panel.header.appendChild(title);
			}
			//panel.footer = dom.querySelector('#' + id + '> footer');
			//panel.footer = dom.querySelector(':scope > footer');
			panel.footer = querySelector(dom, 'footer');
			if (panel.footer) {
				dom.removeChild(panel.footer);
			}
			panel.content = dom;
			return panel;
		};
		/**
			* Crea un <code>HTML panel Bootstrap</code> 
			* 
			* ```js
			* var html = createHTMLPanelTemplate(htmlElement, config, css);
			* ```
			*
			* @param {htmlElement} `dom` Elemento HTML DOM clon del HTML al cual se adiciona la directiva "uni-input".
			* @param {Javascript Object} `config` Configuración de los atributos del componente.
			* @param {String} `css` Css class del componente
			* @returns {String} `html` Retorna una plantilla html, que contiene las estructura del componente.
			* @api Method createHTMLPanelTemplate()
			*/
		var createHTMLPanelTemplate = function (dom, config, css) {
			var panel = createPanelObject(dom);
			var templateHTML = '<div class="panel panel-{color} {css}">{headerHTML} {contentHTML} {footerHTML}</div>';
			var headerHTML = '';
			if (panel.header) {
				headerHTML = '<div class="panel-heading">{innerHTML}</div>'.replace('{innerHTML}', panel.header.innerHTML);
			}
			var contentHTML = '';
			if (panel.content) {
				contentHTML = '<div class="panel-body">{innerHTML}</div>'.replace('{innerHTML}', panel.content.innerHTML);
			}
			var footerHTML = '';
			if (panel.footer) {
				footerHTML = '<div class="panel-footer">{innerHTML}</div>'.replace('{innerHTML}', panel.footer.innerHTML);
			}
			templateHTML = templateHTML.replace('{color}', config.level);
			templateHTML = templateHTML.replace('{headerHTML}', headerHTML);
			templateHTML = templateHTML.replace('{contentHTML}', contentHTML);
			templateHTML = templateHTML.replace('{footerHTML}', footerHTML);
			templateHTML = templateHTML.replace(/{css}/g, css);
			return templateHTML;
		};
		/**
			* Crea un <code>HTML modeal Bootstrap</code> 
			* 
			* ```js
			* var html = createHTMLModalTemplate(htmlElement, config, css);
			* ```
			*
			* @param {htmlElement} `dom` Elemento HTML DOM clon del HTML al cual se adiciona la directiva "uni-input".
			* @param {Javascript Object} `config` Configuración de los atributos del componente.
			* @param {String} `css` Css class del componente
			* @returns {String} `html` Retorna una plantilla html, que contiene las estructura del componente.
			* @api Method createHTMLPanelTemplate()
			*/
		var createHTMLModalTemplate = function (dom, config, css) {
			var panel = createPanelObject(dom);
			var templateHTML = '<div class="uni-panel uni-modal"><div class="modal-backdrop fade in {css}"></div>' +
											'<div tabindex="-1" role="dialog" class="modal fade in {css}-content {cssScroll}" style="display: block; overflow:visible">' +
											'<div role="document" class="modal-dialog modal-{size}" style="width:{width}">' +
											'<div class="modal-content modal-{color}">{headerHTML} {contentHTML} {footerHTML}' +
											'</div></div></div></div>';
			var headerHTML = '';
			var contentHTML = '';
			var footerHTML = '';

			if (config.content === false) {
				if (panel.header) {
					headerHTML = '<div class="modal-header {css}-header">{innerHTML}</div>'.replace('{innerHTML}', panel.header.innerHTML);
				}
				if (panel.content) {
					contentHTML = '<div class="panel-body modal-body {css}-body" style="{height}; {overflow}">{innerHTML}</div>'.replace('{innerHTML}', panel.content.innerHTML);
				}
				if (panel.footer) {
					footerHTML = '<div class="modal-footer {css}-footer">{innerHTML}</div>'.replace('{innerHTML}', panel.footer.innerHTML);
				}
			} else {
				if (panel.header) {
					contentHTML += panel.header.innerHTML;
				}
				if (panel.content) {
					contentHTML += panel.content.innerHTML;
				}
				if (panel.footer) {
					contentHTML += panel.footer.innerHTML;
				}
			}
			templateHTML = templateHTML.replace('{headerHTML}', headerHTML);
			templateHTML = templateHTML.replace('{contentHTML}', contentHTML);
			templateHTML = templateHTML.replace('{footerHTML}', footerHTML);
			templateHTML = templateHTML.replace('{color}', config.level);
			templateHTML = templateHTML.replace('{size}', config.size);
			templateHTML = templateHTML.replace('{width}', config.width);
			templateHTML = templateHTML.replace('{cssScroll}', config.height !== 'none' ? 'modal-scrollbar' : '');
			templateHTML = templateHTML.replace('{height}', config.height !== 'none' ? 'height:' + config.height : '');
			templateHTML = templateHTML.replace('{overflow}', config.height !== 'none' ? 'overflow:auto' : '');
			templateHTML = templateHTML.replace(/{css}/g, css);
			return templateHTML;
		};
		return {
			restrict: 'A',
			replace: true,
			scope: false,
			priority: 10,
			terminal: true,
			template: function (element, attrs) {
				var config = $unikit.componentConfig(element, attrs, this.name);
				if (config.skip) {
					return element[1];
				}
				var html = '<a>No support for template <b>' + config.type + '</b> type.</a>';
				var dom = element[0];
				if (config.type === 'PANEL') {
					html = createHTMLPanelTemplate(dom, config, 'uni-panel');
				} else if (config.type === 'SUBPANEL') {
					html = createHTMLPanelTemplate(dom, config, 'uni-subpanel');
				} else if (config.type === 'MODAL') {
					html = createHTMLModalTemplate(dom, config, 'uni-modal');
				}
				return html;
			},
			link: function (scope, element) {
				$compile(element)(scope);
			}
		};
	}]);