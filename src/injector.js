// Heavily inspired by Angular 2.0 dependency injection

'use strict';

var util = require('./util');
var annotations = require('./annotations');
var provider = require('./provider');

var Injector = function () {
    this._providers = this._createProviderStore();
    this._cache = Object.create(null);
};

Injector.prototype.get = function (token) {
    var tid, instance;

    if (util.isClass(token) || util.isFunction()) {
        tid = token.__tid__ || (token.__tid__ = util.getUID());
    } else {
        tid = token;
    }

    instance = this._cache[tid];

    if (instance != null) {
        return instance;
    }

    instance = this.instantiate(token);
    this._cache[tid] = instance;
    return instance;
};

Injector.prototype.instantiate = function (token) {
    var self, deps, args, provider, instance;

    self = this;

    provider = this._getProvider(token);
    if (provider != null) {
        token = provider.value;
    }

    deps = annotations.readAnnotations(token);
    args = deps.map(function (dep) {
        return self.get(dep);
    });

    if (util.isClass(token)) {
        instance = Object.create(token.prototype);
        token.apply(instance, args);
    } else if (util.isFunction(token)) {
        instance = token.apply(Object.create(null), args);
    } // Can only instantiate objects through classes and factory methods

    return instance;
};

Injector.prototype.provide = function (token, value) {
    provider.provide(token, value, this._providers);
};

Injector.prototype._createProviderStore = function () {
    var providers, toCopy;

    providers = Object.create(null);
    toCopy = provider.getProviders();
    Object.keys(toCopy).forEach(function(tid) {
        providers[tid] = new provider.Provider(toCopy[tid].token, toCopy[tid].value);
    });

    return providers;
};

Injector.prototype._getProvider = function (token) {
    var tid;

    if (util.isClass(token) || util.isFunction()) {
        tid = token.__tid__ ;
    } else {
        tid = token;
    }

    if (tid != null) {
        return this._providers[tid];
    }

    return undefined;
};

module.exports = {
    Injector: Injector
};