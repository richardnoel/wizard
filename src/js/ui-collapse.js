unikit.directive('uniCollapse', ['$unikit', '$rootScope', '$compile', '$timeout', function ($unikit, $rootScope, $compile, $timeout) {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				var realParent = element.parent();
				var detail = attrs.detail || "collapsible items";
				var collapse = "uni" + Math.random().toString(16).slice(2);
				var buttonClick = "uni" + Math.random().toString(16).slice(2);
				var id = element.prop("id");
				var config = $rootScope.$eval(attrs.uniCollapse) || {};
				scope[collapse] = true;
				scope[buttonClick] = function () {
					var className = realParent.prop("className");
					var result = className.search(/col-md|col-lg/g);
					if (scope[collapse]) {
						if (config.expandWidth) {
							if (result > -1) {
								realParent.addClass('col-md-12');
							}
						}
						scope[collapse] = false;
					} else {
						scope[collapse] = true;
						if (config.expandWidth) {
							if (result > -1) {
								realParent.removeClass('col-md-12');
							}
						}
					}
				};
				if (!id) {
					id = "uni" + Math.random().toString(16).slice(2);
					element.prop("id", id);
				}
				var btnCollapse = "<span ng-click='{buttonClick}()' data-toggle='collapse' data-target='#" + id + "' {ngclass}></span>";
				var ngclass = "ng-class='{model}?\"fa fa-plus-square\":\"fa fa-minus-square\"'";
				btnCollapse = btnCollapse.replace(/{ngclass}/g, ngclass);
				btnCollapse = btnCollapse.replace(/{buttonClick}/g, buttonClick);
				btnCollapse = btnCollapse.replace(/{model}/g, collapse);
				var headerTpl;
				if (element.hasClass("uni-panel")) {
					element.prop("id", "");
					headerTpl = element.find('.panel-heading');
					var body = element.find('.panel-body');
					body.prop("id", id);
					body.addClass("collapse");
					btnCollapse = angular.element(btnCollapse);
					headerTpl.prepend(btnCollapse);
					$compile(btnCollapse)(scope);
				} else {
					element.addClass("collapse");
					var container = angular.element("<fieldset class='uni-collapse'></fieldset>");
					headerTpl = "<legend class='uni-collapse-header'><div>{btnCollapse}<span class='uni-collapse-title'>{detail}</span></div></legend>";
					headerTpl = headerTpl.replace(/{btnCollapse}/g, btnCollapse);
					headerTpl = headerTpl.replace(/{detail}/g, detail);
					var actionBtn = angular.element(headerTpl);
					angular.element(container).insertBefore(element);
					container.append(actionBtn);
					container.append(element);
					$compile(actionBtn)(scope);
					$compile(headerTpl)(scope);
				}
			}
		};
	}]);