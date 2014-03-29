"use strict";

// Borrowed from Angular 2.0 di module
function isClass(fn) {
    if (fn.name) {
        return isUpperCase(fn.name.charAt(0));
    }

    return Object.keys(fn.prototype).length > 0;
}

function isFunction(value) {
    return typeof value === 'function';
}

module.exports = {
    isClass: isClass,
    isFunction: isFunction
};
