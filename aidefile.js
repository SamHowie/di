"use strict";

var path = require("path");
var aide = require("aide");

var files;

files = aide.util.globSync(['task/**/*.task.js'], process.cwd());
files.forEach(function(file) {
    aide.loadTasks(require(path.join(process.cwd(), file)));
});

aide.task("test", function() {
    return aide.util.runSequentialTasks(["jasmine:server", "jasmine:browser"]);
});

aide.task("build", function() {
    return aide.util.runSequentialTasks(["test", "browserify:ludograph"]);
});
