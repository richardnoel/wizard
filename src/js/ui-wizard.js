
unikit.directive("uniWizard", ["$rootScope", "$unikit", "$compile", function ($rootScope, $unikit, $compile) {
		var CSS_STEPS = {
			TRIANGULAR: "uni-wizard-triangular",
			CIRCULAR: "uni-wizard-circular"
		};
		var evaluateNgVisibility = function (dom, elem) {
			var listNg = ["ng-show", "ng-hide", "ng-if"];
			for (var i = 0; i < listNg.length; i += 1) {
				var value = dom.getAttribute(listNg[i]);
				if (value) {
					elem.setAttribute(listNg[i], value);
				}
			}
		};

		var replaceTagName = function (element, val) {
			var tagName = element.tagName.toLowerCase();
			var resultHTML = element.outerHTML;
			var html;
			resultHTML = resultHTML.replace(tagName, val);
			resultHTML = resultHTML.replace(new RegExp(tagName + ".$"), val + ">");
			html = angular.element(resultHTML)[0];
			return html;
		};

		var createPanelObject = function (dom) {
			var panel = {id: 0, items: []};
			panel.id = dom.id || Math.random().toString(16).slice(2);
			var itemList = dom.get(0).querySelectorAll(":scope > fieldset, :scope > div");
			angular.forEach(itemList, function (content, index) {
				var item;
				content = content.cloneNode(true);
				var header = content.querySelector(":scope > legend, :scope > header");
				if (header) {
					content.removeChild(header);
				} else if (content.getAttribute("title")) {
					header = document.createElement("div");
					var title = content.getAttribute("title");
					title = document.createTextNode(title);
					header.appendChild(title);
				}
				evaluateNgVisibility(content, header);
				var footer = content.querySelector(":scope > footer");
				if (footer) {
					content.removeChild(footer);
				}
				item = {
					header: header === null ? undefined : header,
					content: content,
					footer: footer === null ? undefined : footer
				};
				panel.items.push(item);
				var value = content.getAttribute("ng-repeat");
				if (value) {
					panel.item[index].ngRepeat = value;
				}
			});
			return panel;
		};

		var createHTMLHeader = function (panel, config) {
			var itemList = panel.items;
			var id = panel.id;
			var htmlTemplate = "<div	class='f1-steps'>{itemHTML}</div>";
			var itemHTML = "";
			var progressBar = "<div class='f1-progress'>{line}</div>";
			var progressLine = "<div class='f1-progress-line' data-now-value='16.66' data-number-of-steps='3' style='width:33%'></div>";
			progressBar = progressBar.replace(/{line}/g, progressLine);
			itemHTML += progressBar;
			angular.forEach(itemList, function (item, index) {
				if (item.header) {
					var html = item.header.cloneNode(true);
					html = replaceTagName(item.header, "div");
					html.innerHTML = null;
					if (item.ngRepeat) {
						//to do
					} else {
						html.setAttribute("class", "f1-step {active}");
					}
				}
				var icon;
				var buttons = item.header.querySelectorAll(":scope > button, :scope > span, :scope > a");
				for (var i = 0; i < buttons.length; i += 1) {
					if (buttons[i].getAttribute('uni-badge')) {
						item.header.removeChild(buttons[i]);
						icon = buttons[i].outerHTML;
						break;
					}
				}
				if (!icon) {
					icon = "<span uni-badge='{level:\"danger\"}'>{index}</span>";
					icon = icon.replace(/{index}/g, index + 1);
				}
				var contentLegend = "<div class='f1-legend-content'>{legend}</div>";
				var contentIcon = "<div class='f1-icon-content'>{badge}</div>";
				var contentLegend = contentLegend.replace(/{legend}/g, item.header.innerHTML);
				contentIcon = contentIcon.replace(/{badge}/g, icon);
				html.innerHTML = contentIcon + contentLegend;
				html = html ? html.outerHTML : "";
				html = html.replace("{active}", index === 0 ? "active" : "");
				itemHTML += html;
			});
			htmlTemplate = htmlTemplate.replace("{itemHTML}", itemHTML);
			if (panel.header.length) {
				angular.element(panel.header).append(htmlTemplate);
				htmlTemplate = panel.header[0].outerHTML;
			} else {
				var header = "<header>{content}</header>";
				htmlTemplate = header.replace(/{content}/g, htmlTemplate);
			}
			return htmlTemplate;
		};


		var createHTMLContent = function (panel) {
			var id = panel.id;
			var itemList = panel.items;
			var htmlTemplate = "<div	class='wizard-content {componentClass}'>{itemHTML}</div>";
			var itemHTML = "";
			angular.forEach(itemList, function (item, index) {
				var html = "<div class='tab-pane fade {active}' id='{idContent}'>{itemContent}</div>";
				if (item.ngRepeat) {
					html = "<div {ngClass} class='wizard-panel' id='{idContent}-{{$index}} {ngRepeat}>{itemContent} {htmlFooter}</div>";
					html = html.replace("{ngRepeat}", "ng-repeat='" + item.ngRepeat + "'");
					html = html.replace("{ngClass}", "ng-class='" + item.header.getAttribute("ng-class") + "'");
				}
				var content = item.content;
				html = html.replace("{active}", index === 0 ? " active in" : "");
				html = html.replace("{idContent}", id + "-" + index);
				html = html.replace("{itemContent}", content ? content.innerHTML : "--Content--");
				html = angular.element(html)[0];
				evaluateNgVisibility(item.content, html);
				itemHTML += html.outerHTML;
			});
			htmlTemplate = htmlTemplate.replace("{itemHTML}", itemHTML);
			return htmlTemplate;
		};
		var createHTMLFooter = function (panel) {
			var itemList = panel.items;
			var htmlTemplate = "<footer	class='f1-footer-steps'><div class='wizard-btn-prev'>{prevButton}</div>" +
											"<div class='wizard-btn-items'>{itemHTML}</div><div class='wizard-btn-next'>{nextButton}</div></footer>";
			var itemHTML = "";
			angular.forEach(itemList, function (item, index) {
				if (item.footer) {
					var html = replaceTagName(item.footer, "div");
					if (item.ngRepeat) {
						//to do
					} else {
						var elements = html.querySelectorAll(":scope > button");
						html.innerHTMl = null;
						var buttons = '';
						for (var i = 0; i < elements.length; i += 1) {
							buttons += elements[i].outerHTML;
						}
						var contenFooter = '';
						if (buttons) {
							contenFooter = "<div uni-action>{htmlFooter}</div>";
							contenFooter = contenFooter.replace(/{htmlFooter}/g, buttons);
						}
						html.setAttribute("class", "f1-step-footer {active}");
						html.innerHTML = contenFooter;
					}
				}
				html = html ? html.outerHTML : "";
				html = html.replace("{active}", index === 0 ? "active" : "");
				itemHTML += html;
			});
			if (panel.footer.length) {
				var buttons = panel.footer[0].querySelectorAll(':scope > button');
				if (buttons.length === 2) {
					var prevButton = buttons[0];
					if (prevButton) {
						prevButton = prevButton.outerHTML;
					}
					var nextButton = buttons[1];
					if (nextButton) {
						nextButton = nextButton.outerHTML;
					}
				} else {
					console.warn("se esperaba solo dos botones");
				}
			} else {
				var prevButton = "<button ng-click='console.log(1)' uni-badge='{icon:\"arrow-left\"}'></button>";
				var nextButton = "<button ng-click='console.log(1)' uni-badge='{icon:\"arrow-left\"}'></button>";
			}
			htmlTemplate = htmlTemplate.replace(/{prevButton}/g, prevButton);
			htmlTemplate = htmlTemplate.replace(/{nextButton}/g, nextButton);
			htmlTemplate = htmlTemplate.replace("{itemHTML}", itemHTML);
			return htmlTemplate;
		};
		var creteTemplate = function (panel, config) {
			var template = "<div class='uni-wizard f1 {componentClass}'> {header} {stepContent} {footer}</div>";
			var stepHeader = createHTMLHeader(panel, config);
			var stepContent = createHTMLContent(panel);
			var stepFooter = createHTMLFooter(panel);
			template = template.replace("{header}", stepHeader);
			template = template.replace("{stepContent}", stepContent);
			template = template.replace("{footer}", stepFooter);
			template = template.replace(/{componentClass}/g, CSS_STEPS[config.type]);
			template = template.replace(/{level}/g, config.level);
			return template;
		};
		var createHTMLTemplate = function (dom, config) {
			var panel = createPanelObject(dom);
			panel.header = dom.get(0).querySelectorAll(":scope > header, :scope > legend");
			panel.footer = dom.get(0).querySelectorAll(":scope > footer");
			var templateHTML = creteTemplate(panel, config, dom);
			return templateHTML;
		};

		return {
			restrict: "A",
			replace: true,
			scope: false,
			priority: 10,
			terminal: true,
			template: function (element, attrs) {
				var config = $unikit.componentConfig(element, attrs, "uniWizard");
				if (config.skip) {
					return element[1];
				}
				var html = "<a>No support for template <b>" + config.type + "</b> type.</a>";
				if (config.type === "TRIANGULAR" || config.type === "CIRCULAR") {
					var panelsDom = element.eq(0);
					html = createHTMLTemplate(panelsDom, config);
				}
				return html;
			},
			link: function (scope, element) {
				element.removeAttr("uni-panels");
				$compile(element)(scope);
			}
		};
	}]);
