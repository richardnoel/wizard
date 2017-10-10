if (String.prototype.capitalize === undefined) {
	String.prototype.capitalize = function (allWords) {
		return (allWords) ?
										this.split(' ').map(word => word.capitalize()).join(' ') :
										this.charAt(0).toUpperCase() + this.slice(1);
	};
}
if (String.prototype.underscore === undefined) {
	String.prototype.underscore = function (upper = false) {
		var under = this.replace(/([a-z])([A-Z])/g, '$1_$2').replace(/\-|\s/g, '_');
		return upper ? under.toUpperCase() : under.toLowerCase();
	};
}