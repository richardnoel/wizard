unikit.directive('uniZoom', ['$unikit', '$rootScope', '$compile', '$timeout', function ($unikit, $rootScope, $compile, $timeout) {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				var clickExpand = 'uni' + Math.random().toString(16).slice(2);
				var clickCompress = 'uni' + Math.random().toString(16).slice(2);
				var showContainer = 'uni' + Math.random().toString(16).slice(2);
				element.removeAttr('uni-zoom');
				var htmlExpand = "<button ng-hide='{showContainer}' uni-badge='{icon:\"expand\"}' ng-click='{clickExpand}()'></button>";
				var htmlCompress = "<button uni-badge='{icon:\"compress\"}' ng-click='{clickCompress}()'></button>";
				var zoomContent = "<div ng-show='{showContainer}' class='zoom-container'><div uni-panel='{type:\"modal\"}'><header>{compress}</header><div class='zoom-body'></div></div></div>";
				var html = "<div class='expand-content'>{expand}</div>";
				html = html.replace(/{expand}/g, htmlExpand);
				html = html.replace(/{clickExpand}/g, clickExpand);
				html = html.replace(/{showContainer}/g, showContainer);
				zoomContent = zoomContent.replace(/{showContainer}/g, showContainer);
				zoomContent = zoomContent.replace(/{compress}/g, htmlCompress);
				zoomContent = zoomContent.replace(/{clickCompress}/g, clickCompress);
				var id = element.prop("id");
				if (!id) {
					id = "uni" + Math.random().toString(16).slice(2);
					element.prop("id", id);
				}

				var style = "<style>#" + id + ":hover{border: 1px solid#c0c0c0;border-style: dotted;padding-top: 1px;} #" + id + ":hover>.expand-content{opacity:1}</style>";

				angular.element("body").append(style);
				var contentExpand = angular.element(html);
				var zoomContent = angular.element(zoomContent);
				scope[showContainer] = false;
				scope[clickExpand] = function () {
					zoomContent.find('.zoom-body').append(element.children());
					zoomContent.find('.modal-dialog').css({
						width: "100%"
					});
					zoomContent.find('.modal-content').css({
						height: angular.element(document).outerHeight()
					});
					scope[showContainer] = true;
				};
				scope[clickCompress] = function () {
					element.append(zoomContent.find('.zoom-body').children());
					scope[showContainer] = false;
				};
				angular.element(document.body).append(zoomContent);
				element.prepend(contentExpand);
				$compile(contentExpand)(scope);
				$compile(zoomContent)(scope);
			}
		};
	}]);