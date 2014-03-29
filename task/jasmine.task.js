;(function(module){
    var path            = require('path');
    var Stream          = require('stream');
    var Readable        = Stream.Readable;
    var express         = require('express');
    var phantomjs       = require('phantomjs');
    var binPath         = phantomjs.path;
    var childProcess    = require('child_process');
    var miniJasmineLib  = require('minijasminenode');
    var minimatch       = require("minimatch");
    var Q               = require("q");

    module.exports = function (aide) {
        aide.task("jasmine:server", function() {
            var deferred = Q.defer();

            aide.util.glob(["src/**/*.spec.js", "!src/**/*.browser.spec.js"]).then(
                function(files) {
                    var options = {
                        specs: files,
                        onComplete: function(runner, log) {
                            deferred.resolve(runner);
                        },
                        isVerbose: false,
                        showColors: true,
                        includeStackTrace: true,
                        defaultTimeoutInterval: 5000
                    };

                    miniJasmineLib.executeSpecs(options);
                }
            );

            return deferred.promise;
        });

        aide.task("jasmine:browser", ["browserify:specs"],  function() {
            var rs = Readable();
            rs._read = function () {
            };
            rs.pipe(process.stdout);

            var server, child, childArgs;

            server = createServer(1337);

            childArgs = [
                path.join(process.cwd(), 'test/run-jasmine.js'),
                'http://127.0.0.1:1337/SpecRunner.html'
            ];

            child = childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
                // close express server
                server.close();

                // Cleanup rs
                if (rs != null) {
                    rs.push(null);
                    rs.emit('end');
                    rs = null;
                }
            });

            child.stdout.on('data', function(data) {
                var str = data.toString();
                str = str.replace(/\n/, '');
                if (str != '') rs.push(str);
            });

            return rs;
        });

        function createServer (port) {
            var app, server;

            app = express();
            app.use(express.static(path.resolve('./test')));

            server = app.listen(port, function() {
                //console.log('Listening on', port);
            });

            return server;
        }
    };
}(module));