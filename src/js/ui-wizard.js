
unikit.directive("uniWizard", ["$rootScope", "$unikit", "$compile", function ($rootScope, $unikit, $compile) {
		var CSS_STEPS = {
			TRIANGULAR: "uni-wizard-triangular",
			CIRCULAR: "uni-wizard-circular"
		};
		var wizardIndex = 'uni' + Math.random().toString(16).slice(2);
		var sizeSteps = 0;
		var detectedSteps = 'uni' + Math.random().toString(16).slice(2);
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
			sizeSteps = itemList.length || 0;
			return panel;
		};

		var createHTMLHeader = function (panel, config) {
			var itemList = panel.items;
			var htmlTemplate = "<div	class='wizard-steps'>{itemHTML}</div>";
			var itemHTML = "";
			var progressBar = "<div class='wizard-progress'>{line}</div>";
			var progressLine = "<div class='wizard-progress-line'></div>";
			progressBar = progressBar.replace(/{line}/g, progressLine);
			itemHTML += progressBar;
			angular.forEach(itemList, function (item, index) {
				if (item.header) {
					var html = item.header.cloneNode(true);
					html = replaceTagName(item.header, "div");
					html.innerHTML = null;
					if (item.ngRepeat) {
						console.log("to do");
					} else {
						html.setAttribute("class", "wizard-step tab-pane ");
						//html.setAttribute("ng-class", "{wizardIndex}== '" + index + "' ? \"tab-pane active\": \"tab-pane disable\"");
						html.setAttribute("ng-class", "{'active': {wizardIndex}== '" + index + "', 'disable': {detectedSteps}.indexOf(" + index + ") == -1}");
						//html.setAttribute("ng-class", "{class1 : {wizardIndex}== '" + index + "' ? \"tab-pane active\": \"tab-pane disable\", class2: {detectedSteps}.indexOf(" + index + ") > -1 ? \"dirty\":\"\" }");
						html.style.width = 100 / (itemList.length) + "%";
					}
				}
				var button = item.header.querySelector(":scope > button, :scope > span, :scope > a");
				if (button) {
					item.header.removeChild(button);
					if (!button.getAttribute("uni-badge")) {
						button.setAttribute("uni-badge");
					}
					var click = "";
					if (button.getAttribute("ng-click")) {
						click = button.getAttribute("ng-click");
					}
					button.setAttribute("ng-click", click + "___clickStep({index}, {totalSteps})");
					button = button.outerHTML;
				} else {
					button = "<span ng-click='___clickStep({index}, {totalSteps})' uni-badge='{level:\"danger\"}'>{index}</span>";
				}
				button = button.replace(/{index}/g, index);
				var contentLegend = "<div class='wizard-legend-content'>{legend}</div>";
				var contentIcon = "<div class='wizard-icon-content'>{badge}</div>";
				var contentLegend = contentLegend.replace(/{legend}/g, item.header.innerHTML);
				contentIcon = contentIcon.replace(/{badge}/g, button);
				html.innerHTML = contentIcon + contentLegend;
				html = html ? html.outerHTML : "";
				html = html.replace(/{wizardIndex}/g, wizardIndex);
				html = html.replace(/{index}/g, index);
				html = html.replace(/{totalSteps}/g, itemList.length);
				html = html.replace(/{detectedSteps}/g, detectedSteps);
				itemHTML += html;
			});
			htmlTemplate = htmlTemplate.replace(/{itemHTML}/g, itemHTML);
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
			var itemList = panel.items;
			var htmlTemplate = "<div class='wizard-content {componentClass}'>{itemHTML}</div>";
			var itemHTML = "";
			angular.forEach(itemList, function (item, index) {
				var html = "<div ng-class='{wizardIndex} == {index} ? \"tab-pane fade active in\": \"tab-pane fade\"'>{itemContent}</div>";
				if (item.ngRepeat) {
					console.log('to do');
				}
				var content = item.content;
				html = html.replace("{itemContent}", content ? content.innerHTML : "--Content--");
				html = html.replace("{wizardIndex}", wizardIndex);
				html = html.replace("{index}", index);
				html = angular.element(html)[0];
				evaluateNgVisibility(item.content, html);
				itemHTML += html.outerHTML;
			});
			htmlTemplate = htmlTemplate.replace("{itemHTML}", itemHTML);
			return htmlTemplate;
		};
		var createHTMLFooter = function (panel) {
			var itemList = panel.items;
			var htmlTemplate = "<footer	class='wizard-footer-steps'><div class='wizard-btn-prev'>{prevButton}</div>" +
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
						html.setAttribute("ng-class", "{wizardIndex}== '" + index + "' ? \"tab-pane fade active in\": \"tab-pane fade\"");
						html.innerHTML = contenFooter;
					}
				}
				html = html ? html.outerHTML : "";
				html = html.replace("{wizardIndex}", wizardIndex);
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
				var prevButton = "<button ng-click='__clickPrev()' uni-badge='{icon:\"arrow-left\"}'  ng-hide='{wizardIndex} == 0'></button>";
				var nextButton = "<button ng-click='__clickNext()' uni-badge='{icon:\"arrow-right\"}' ng-hide='{wizardIndex} == ({sizeSteps}-1)'></button>";
			}
			htmlTemplate = htmlTemplate.replace(/{prevButton}/g, prevButton);
			htmlTemplate = htmlTemplate.replace(/{nextButton}/g, nextButton);
			htmlTemplate = htmlTemplate.replace(/{itemHTML}/g, itemHTML);
			htmlTemplate = htmlTemplate.replace(/{wizardIndex}/g, wizardIndex);
			htmlTemplate = htmlTemplate.replace(/{sizeSteps}/g, sizeSteps);
			return htmlTemplate;
		};
		var creteTemplate = function (panel, config) {
			var template = "<div class='uni-wizard wizard {componentClass}'> {header} {stepContent} {footer}</div>";
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
				var resizeBar = function (index, total) {
					var width = ((index + 1) * 100) / total;
					element.find('.wizard-progress-line').width(width + "%");
				};
				scope[wizardIndex] = 0;
				scope[detectedSteps] = [0];
				scope.___clickStep = function (index, total) {
					if (scope[detectedSteps].indexOf(index) > -1) {
						scope[wizardIndex] = index;
					}
				};
				scope.__clickNext = function () {
					scope[wizardIndex] += 1;
					resizeBar(scope[wizardIndex], sizeSteps);
					if (scope[detectedSteps].indexOf(scope[wizardIndex]) === -1) {
						scope[detectedSteps].push(scope[wizardIndex]);
					}
				};
				scope.__clickPrev = function () {
					var index = scope[detectedSteps].indexOf(scope[wizardIndex]);
					if (index > -1) {
						scope[detectedSteps].splice(index, 1);
					}
					scope[wizardIndex] -= 1;
					resizeBar(scope[wizardIndex], sizeSteps);
				};
				resizeBar(0, sizeSteps);
				$compile(element)(scope);
			}
		};
	}]);
