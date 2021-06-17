(function (win, doc) {
    'use strict';

    function DOM(elements) {
        if (!(this instanceof DOM))
            return new DOM(elements);


        this.element = doc.querySelectorAll(elements);
    }

    // DOM type function
    DOM.isArray = function isArray(element) {
        return Object.prototype.toString(element) === '[object Array]';
    };

    DOM.isObject = function isObject(element) {
        return Object.prototype.toString(element) === '[object Object]';
    };

    DOM.isFunction = function isFunction(element) {
        return Object.prototype.toString(element) === '[object Function]';
    };

    DOM.isNumber = function isNumber(element) {
        return Object.prototype.toString(element) === '[object Number]';
    };

    DOM.isString = function isString(element) {
        return Object.prototype.toString(element) === '[object String]';
    };

    DOM.isBoolean = function isBoolean(element) {
        return Object.prototype.toString(element) === '[object Boolean]';
    };

    DOM.isNull = function isNull(element) {
        var toString = Object.prototype.toString(element);
        return (toString === '[object Null]') || (toString === '[object Undefined]');
    };
    // /DOM type function

    DOM.prototype.getDOMElements = function getDOMElements(elements) {
        return doc.querySelectorAll(elements);
    }

    DOM.prototype.get = function get(index) {
        if (!index)
            return this.element[0];
        return this.element[index];
    };

    // listeners
    DOM.prototype.on = function on(eventType, callback) {
        Array.prototype.forEach.call(this.element, (elem) => {
            elem.addEventListener(eventType, callback);
        }, false);
    };

    DOM.prototype.off = function off(eventType, callback) {
        Array.prototype.forEach.call(this.element, (elem) => {
            elem.removeEventListener(eventType, callback);
        })
    };
    // /listeners

    // Arraylike functions
    DOM.prototype.forEach = function forEach(args) {
        return Array.prototype.forEach.apply(this.element, args);
    };

    DOM.prototype.map = function map() {
        return Array.prototype.map.apply(this.element, args);
    };

    DOM.prototype.filter = function filter() {
        return Array.prototype.filter.apply(this.element, args);
    };

    DOM.prototype.reduce = function reduce() {
        return Array.prototype.reduce.apply(this.element, args);
    };

    DOM.prototype.reduceRight = function reduceRight() {
        return Array.prototype.reduceRight.apply(this.element, args);
    };

    DOM.prototype.every = function every() {
        return Array.prototype.every.apply(this.element, args);
    };

    DOM.prototype.some = function some() {
        return Array.prototype.map.apply(this.element, args);
    };
    // /Arraylike functions

    win.DOM = DOM;
})(window, document)