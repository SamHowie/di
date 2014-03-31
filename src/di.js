// Heavily inspired by Angular 2.0 dependency injection

'use strict';

var annotations = require('./annotations');
var injector =  require('./injector');
var provider = require('./provider');

var di = {};

di.Injector = injector.Injector;
di.annotate = annotations.annotate;
di.readAnnotations = annotations.readAnnotations;
di.provide = provider.provide;

module.exports = di;