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



var createID = function (element, prefix) {
	var id = element ? element.attr('id') : undefined;
	if (!id) {
		id = prefix + Math.random().toString(16).slice(2);
	}
	return id;
};
/**
 * Construye el criterio de busqueda de elementos para un nodo.
	* @param {HTMLElement} element, Elemento HTMLElement
	* @param {array|string} args, criterios de busqueda de elementos
	* @returns {String} criteria, construcción del criterio de busqueda general.
 */
var createQuerySelectorCriteria = function (element, args) {
	var id;
	if (!angular.isArray(args)) {
		args = args.split(',');
	}
	if (element.id) {
		id = element.id;
	} else {
		var id = "uni" + Math.random().toString(16).slice(2);
		element.id = id;
	}
	var criteria = "";
	for (var i = 0; i < args.length; i += 1) {
		criteria += '#' + id + ' > ' + args[i];
		if (i + 1 < args.length) {
			criteria += ",";
		}
	}
	return criteria;
};
/**
	* realiza la busqueda de elementos hijos dentro del contexto del nodo Element
 * Debido a que no se soporta querySelectorAll(':scope > childElement') para la busqueda de elementos en IE EGE 
	* @param {HTMLElement } element, Elemendo DOM HTMLElement 
	* @param {type} args, argumentos para la busqueda
	* @returns {HTMLElement} retorna un conuntos de elementos HTML DOM
 */
var querySelectorAll = function (element, args) {
	var criteria = createQuerySelectorCriteria(element, args);
	return element.querySelectorAll(criteria);
};
/**
	* realiza la busqueda de elementos hijos dentro del contexto del nodo Element
 * Debido a que no se soporta querySelector(':scope > childElement') para la busqueda de elementos en IE EGE 
	* @param {HTMLElement } element, Elemendo DOM HTMLElement 
	* @param {type} args, argumentos para la busqueda
	* @returns {HTMLElement} retorna un elemento HTML DOM
 */
var querySelector = function (element, args) {
	var criteria = createQuerySelectorCriteria(element, args);
	return element.querySelector(criteria);
};