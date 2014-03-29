// Heavily inspired by Angular 2.0 dependency injection

"use strict";

var util = require("./util");
var annotations = require("./annotations");

var tid = 0;

var Injector = function () {
    this._cache = Object.create(null);
}

Injector.prototype.get = function (token) {
    var tid, instance;

    tid = token.__tid__ || (token.__tid__ = this._nextTokenId());
    instance = this._cache[tid];

    if (instance != null) {
        return instance;
    }

    instance = this.instantiate(token);
    this._cache[tid] = instance;
    return instance;
};

Injector.prototype.instantiate = function (service) {
    var self, deps, args, instance;

    self = this;
    deps = annotations.readAnnotations(service);

    args = deps.map(function (dep) {
        return self.get(dep);
    });

    if (util.isClass(service)) {
        instance = Object.create(service.prototype);
        service.apply(instance, args);
    } else if (util.isFunction(service)) {
        instance = service.apply({}, args);
    } else {
        instance = service;
    }

    return instance;
};

Injector.prototype._nextTokenId = function () {
    return tid += 1;
};

module.exports = {
    Injector: Injector
};