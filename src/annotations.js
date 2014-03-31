// Heavily inspired by Angular 2.0 dependency injection

'use strict';

var annotations = {};

annotations.annotate = function (fn, annotations) {
    fn.__annotations__ = annotations;
};

annotations.readAnnotations = function (fn) {
    var i, length, annotations;

    annotations = [];

    if (fn.__annotations__ != null && fn.__annotations__.length) {
        for (i = 0, length = fn.__annotations__.length; i < length; i += 1) {
            annotations.push(fn.__annotations__[i]);
        }
    }

    return annotations;
};

module.exports = annotations;