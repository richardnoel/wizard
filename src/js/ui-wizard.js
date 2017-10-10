
unikit.directive('uniPanels', ['$rootScope', '$unikit', '$compile', function ($rootScope, $unikit, $compile) {
		var CSS_TAB = {
			TAB: 'uni-tabs-top',
			RTAB: 'uni-tabs-right',
			LTAB: 'uni-tabs-left',
			BTAB: 'uni-tabs-bottom'
		};
		var evaluateNgVisibility = function (dom, elem) {
			var listNg = ['ng-show', 'ng-hide', 'ng-if'];
			for (var i = 0; i < listNg.length; i += 1) {
				var value = dom.getAttribute(listNg[i]);
				if (value) {
					elem.setAttribute(listNg[i], value);
				}
			}
		};
		var createPanelObject = function (dom) {
			var panel = {id: 0, item: []};
			panel.id = dom.id || Math.random().toString(16).slice(2);
			var itemList = dom.querySelectorAll(':scope > fieldset, :scope > div');
			angular.forEach(itemList, function (content, index) {
				content = content.cloneNode(true);
				var header = content.querySelector(':scope > legend, :scope > header');
				if (header) {
					content.removeChild(header);
				} else if (content.getAttribute('title')) {
					header = document.createElement("div");
					var title = content.getAttribute('title');
					title = document.createTextNode(title);
					header.appendChild(title);
				}
				evaluateNgVisibility(content, header);
				var footer = content.querySelector(':scope > footer');
				if (footer) {
					content.removeChild(footer);
				}
				panel.item[index] = {
					header: header === null ? undefined : header,
					content: content,
					footer: footer === null ? undefined : footer
				};
				var value = content.getAttribute('ng-repeat');
				if (value) {
					panel.item[index].ngRepeat = value;
				}
			});
			return panel;
		};
		var replaceTagName = function (element, val) {
			var tagName = element.tagName.toLowerCase();
			var resultHTML = element.outerHTML;
			var html;
			resultHTML = resultHTML.replace(tagName, val);
			resultHTML = resultHTML.replace(new RegExp(tagName + ".$"), val + '>');
			html = angular.element(resultHTML)[0];
			return html;
		};

		var createHTMLTabHeaderTemplate = function (id, itemList, config) {
			var justified = config.type === "TAB" || config.type === "BTAB" ? "nav-justified" : "";
			var htmlTemplate = '<ul	class="uni-tabs-list {componentClass}-list  nav nav-tabs ' + justified + '">{itemHTML}</ul>';
			var itemHTML = '';
			angular.forEach(itemList, function (item, index) {
				if (item.header) {
					var html = replaceTagName(item.header, 'li');
					html.setAttribute('data-toggle', 'tab');
					if (item.ngRepeat) {
						html.setAttribute('data-target', '#{idContent}-{{$index}}');
						html.setAttribute('class', "uni-tab-item a");
						var ngClass = item.header.getAttribute('ng-class');
						var ngActiveClass = "$index === 0?\'active\':\'\'";
						if (ngClass) {
							ngActiveClass = ngActiveClass + ";" + ngClass;
							item.header.setAttribute("ng-class", ngActiveClass);
							html.setAttribute('ng-class', ngActiveClass);
						} else {
							item.header.setAttribute('ng-class', ngActiveClass);
							html.setAttribute('ng-class', ngActiveClass);
						}
						html.setAttribute('ng-repeat', item.ngRepeat);
					} else {
						html.setAttribute('class', "uni-tab-item a {active}");
						html.setAttribute('data-target', '#{idContent}');
						html.setAttribute('data-toggle', 'tab');
					}
				}
				html = html ? html.outerHTML : '';
				//html = html.replace('{ngRepeat}', item.ngRepeat ? item.ngRepeat : '');
				html = html.replace('{active}', index === 0 ? 'active' : '');
				html = html.replace('{idContent}', id + '-' + index);
				html = html.replace('{headerHTML}', item && item.header ? item.header.innerHTML : '--Title--');
				itemHTML += html;
			});
			htmlTemplate = htmlTemplate.replace('{itemHTML}', itemHTML);
			return htmlTemplate;
		};

		var createHTMLTabContentTemplate = function (id, itemList) {
			var htmlTemplate = '<div	class="tab-content {componentClass}">{itemHTML}</div>';
			var itemHTML = '';
			angular.forEach(itemList, function (item, index) {
				var html = '<div class="tab-pane fade {active}" id="{idContent}">{itemContent} {htmlFooter}</div>';
				if (item.ngRepeat) {
					html = '<div {ngClass} class=" tab-pane" id="{idContent}-{{$index}}" {ngRepeat}>{itemContent} {htmlFooter}</div>';
					html = html.replace('{ngRepeat}', 'ng-repeat="' + item.ngRepeat + '"');
					html = html.replace('{ngClass}', 'ng-class="' + item.header.getAttribute('ng-class') + '"');
				}
				var content = item.content;
				var footer = item.footer;
				html = html.replace('{active}', index === 0 ? ' active in' : '');
				html = html.replace('{idContent}', id + '-' + index);
				html = html.replace('{itemContent}', content ? content.innerHTML : '--Content--');
				if (footer) {
					html = html.replace('{htmlFooter}', '<div class="panel-footer">{htmlFooter}</div>');
					html = html.replace('{htmlFooter}', footer.innerHTML);
				} else {
					html = html.replace('{htmlFooter}', '');
				}
				html = angular.element(html)[0];
				evaluateNgVisibility(item.content, html);
				itemHTML += html.outerHTML;
			});
			htmlTemplate = htmlTemplate.replace('{itemHTML}', itemHTML);
			return htmlTemplate;
		};

		var createHTMLTabTemplate = function (dom, config) {
			var panel = createPanelObject(dom);
			var templateHTML = '<div class="uni-panels {componentClass} {level} with-nav-tabs">{headerHTML} {contentHTML}</div>';
			if (config.type === 'BTAB') {
				templateHTML = '<div class="uni-panels {componentClass} with-nav-tabs">{contentHTML} {headerHTML}</div>';
			}
			var headerHTML = createHTMLTabHeaderTemplate(panel.id, panel.item, config);
			var contentHTML = createHTMLTabContentTemplate(panel.id, panel.item);
			templateHTML = templateHTML.replace('{headerHTML}', headerHTML);
			templateHTML = templateHTML.replace('{contentHTML}', contentHTML);
			templateHTML = templateHTML.replace(/{componentClass}/g, CSS_TAB [config.type]);
			templateHTML = templateHTML.replace(/{level}/g, config.level);
			return templateHTML;
		};

		var createHTMLAccTemplate = function (dom, config) {
			var panel = createPanelObject(dom);
			var templateHTML = '<div class="uni-panels uni-accordion panel-group" id="{idParent}">{contentHTML}</div>';
			var contentHTML = '';
			var itemHTML = '<div class="panel panel-{color}" {ngRepeat}>' +
											'<div class="panel-heading">' +
											'<div class="panel-title">{headHTML}</div>' +
											'</div>{bodyHTML}</div>';
			angular.forEach(panel.item, function (item, index) {
				var content = item.content;
				var footer = item.footer;
				var html = itemHTML;
				var bodyHTML = '<div class="panel-collapse collapse {active}" id="{idContent}"><div class="panel-body">{htmlContent}</div> {htmlFooter} </div>';
				var headHTML = item.header;
				headHTML.setAttribute('data-parent', "#{idParent}");
				headHTML.setAttribute('data-toggle', "collapse");
				headHTML.setAttribute('data-target', '#{idContent}');
				headHTML.setAttribute('class', "collapsed");
				headHTML = replaceTagName(headHTML, 'div');
				headHTML = headHTML.outerHTML;
				if (item.ngRepeat) {
					headHTML = headHTML.replace(/{idContent}/g, panel.id + '-' + "{{$index}}");
					bodyHTML = createDinamicHTMLACCItem(html, item, panel.id);
					html = html.replace('{ngRepeat}', 'ng-repeat="' + item.ngRepeat + '"');
					html = html.replace(/{bodyHTML}/g, bodyHTML);
					html = html.replace('{active}', '');
				} else {
					headHTML = headHTML.replace(/{idContent}/g, panel.id + '-' + index);
					bodyHTML = bodyHTML.replace(/{idContent}/g, panel.id + '-' + index);
					html = html.replace('{ngRepeat}', '');
					html = html.replace(/{bodyHTML}/g, bodyHTML);
					html = html.replace('{active}', index === 0 ? 'in' : '');
				}
				html = html.replace(/{headHTML}/g, headHTML);
				html = html.replace('{color}', config.level);
				html = html.replace('{idParent}', config.autoclose ? panel.id : '');
				html = html.replace('{htmlContent}', content ? content.innerHTML : '--Content--');
				if (footer) {
					html = html.replace('{htmlFooter}', '<div class="panel-footer">{htmlFooter}</div>');
					html = html.replace('{htmlFooter}', footer.innerHTML);
				} else {
					html = html.replace('{htmlFooter}', '');
				}
				html = angular.element(html)[0];
				evaluateNgVisibility(item.content, html);
				contentHTML += html.outerHTML;
			});
			templateHTML = templateHTML.replace('{contentHTML}', contentHTML);
			templateHTML = templateHTML.replace('{idParent}', panel.id);
			return templateHTML;
		};

		var createDinamicHTMLACCItem = function (html, item, idPanel) {
			var bodyHTML = '<div class="panel-collapse collapse" id="{idContent}" {ngClass}>' +
											'<div class="panel-body">{htmlContent}</div> {htmlFooter} </div>';
			var ngClass = item.header.getAttribute('ng-class');
			bodyHTML = bodyHTML.replace(/{ngClass}/g, ngClass ? 'ng-class="' + ngClass + '"' : '');
			bodyHTML = bodyHTML.replace(/{idContent}/g, idPanel + '-' + '{{$index}}');
			return bodyHTML;
			html = html.replace('{ngRepeat}', 'ng-repeat="' + item.ngRepeat + '"');
			return html;
		};
		var createHTMLSliceTemplate = function (dom, config) {
			var panel = createPanelObject(dom);
			var templateHTML = '<div class="carousel slide">{contentLINK}{contentHTML}{contentCTRL}</div>';
			var contentHTML = '';
			var itemHTML = '<div class="panel panel-{color}">' +
											'<div class="panel-heading">' +
											'<h4 class="panel-title"><div class="a" data-target="#{idContent}" data-parent="#{idParent}" data-toggle="collapse" class="collapsed"><span class="glyphicon glyphicon-th"></span> {htmlHeader}</div></h4>' +
											'</div>' +
											'<div class="panel-collapse collapse {active}" id="{idContent}"><div class="panel-body">{htmlContent}</div> {htmlFooter} </div>' +
											'</div>';
			itemHTML = itemHTML.replace('{idParent}', panel.id);
			itemHTML = itemHTML.replace('{color}', config.level);
			angular.forEach(panel.item, function (item, index) {
				var html = itemHTML;
				var header = item.header;
				var content = item.content;
				var footer = item.footer;
				html = html.replace('{active}', index === 0 ? 'in' : '');
				html = html.replace(/{idContent}/g, panel.id + '-' + index);
				html = html.replace('{htmlHeader}', header ? header.innerHTML : '--Header--');
				html = html.replace('{htmlContent}', content ? content.innerHTML : '--Content--');
				if (footer) {
					html = html.replace('{htmlFooter}', '<div class="panel-footer">{htmlFooter}</div>');
					html = html.replace('{htmlFooter}', footer.innerHTML);
				} else {
					html = html.replace('{htmlFooter}', '');
				}
				contentHTML += html;
			});
			templateHTML = templateHTML.replace('{contentHTML}', contentHTML);
			return templateHTML;
		};

		return {
			restrict: 'A',
			replace: true,
			scope: false,
			priority: 10,
			terminal: true,
			template: function (element, attrs) {
				var config = $unikit.componentConfig(element, attrs, 'uniPanels');
				if (config.skip) {
					return element[1];
				}
				var html = '<a>No support for template <b>' + config.type + '</b> type.</a>';
				var panelsDom = element[0];
				if (/TAB/.test(config.type)) {
					html = createHTMLTabTemplate(panelsDom, config);
				} else if (config.type === 'ACC' || config.type === 'ACCORDION') {
					html = createHTMLAccTemplate(panelsDom, config);
				} else if (config.type === 'SLIDE') {
					//Este componente no es oficial
					html = createHTMLSliceTemplate(panelsDom, config);
				}
				return html;
			},
			link: function (scope, element) {
				//var config = element.attr('uni-panels');
				element.removeAttr('uni-panels');
				$compile(element)(scope);
				//element.attr('uni-panel', config);
			}
		};
	}]);
