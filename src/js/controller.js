unikit.controller("controller", function ($scope) {
	$scope.object = {a: 1, b: 2, c: 3};

	$scope.data = {
		labels: [
			"Download Sales",
			"In-Store Sales",
			"Mail-Order Sales"
		],
		values: [
			300,
			500,
			100
		],
		colors: [
			"#FF0000",
			"#F4FA58",
			"#04B404"
		],
		click: function (x) {
			console.log(x[0])
		},
		hover: function (x) {
			console.log(x);
		}
	}
});