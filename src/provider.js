// Heavily inspired by Angular 2.0 dependency injection

'use strict';

var util = require('./util');

var providers = Object.create(null);

var Provider = function(token, value) {
    return {
        token: token,
        value: value
    }
};

function provide (token, value, store) {
    var tid;

    tid = undefined;

    store = store || providers;
    if (util.isClass(token) || util.isFunction(token)) {
        tid = token.__tid__ || (token.__tid__ = util.getUID());
    } else if (typeof token === 'string') {
        tid = token;
    }

    store[tid] = new Provider(token, value);
}

function getProviders () {
    return providers;
}

module.exports = {
    provide: provide,
    Provider: Provider,
    getProviders: getProviders
};