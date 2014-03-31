'use strict';

// Borrowed from Angular 2.0 di module

var id = 0;

function isClass(fn) {
    if (!isFunction(fn)) {
        return false;
    }

    if (fn.name) {
        return isUpperCase(fn.name.charAt(0));
    }

    return Object.keys(fn.prototype).length > 0;
}

function isFunction(value) {
    return typeof value === 'function';
}

function getUID() {
    return id += 1;
}

module.exports = {
    isClass: isClass,
    isFunction: isFunction,
    getUID: getUID
};
