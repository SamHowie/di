;(function(module){
    var Readable        = require('stream').Readable;
    var fs              = require('fs');
    var browserify      = require('browserify');
    var path            = require('path');
    var File            = require('vinyl');
    var vfs             = require('vinyl-fs');
    var es              = require('event-stream');

    module.exports = function (aide) {
        aide.task("browserify:specs", function() {
            return createEntryFile(["src/**/*.spec.js", "!src/**/*.server.spec.js"])
                .pipe(aideBrowserify())
                .pipe(vfs.dest('test/spec'));
        });

        aide.task("browserify:ludograph", function() {
            return vfs.src('src/ludograph.js')
                .pipe(aideBrowserify())
                .pipe(vfs.dest('dist'));
        });

        function aideBrowserify (opts) {
            var queued = 0;
            var transformed = 0;
            var ended = false;

            if (!opts) opts = {};

            return es.through(transform, end);

            function transform (file) {
                var self = this;
                var bundler = browserify(file);

                queued++;

                bundler.bundle(opts, function (err, src) {
                    transformed++;
                    if (!err) {
                        file.contents = new Buffer(src);
                        self.push(file);
                    } else {
                        self.emit('error', err);
                    }

                    if (transformed === queued) {
                        self.queue(null);
                    }
                });
            }

            function end () {
                ended = true;

                if (queued === 0) {
                    this.queue(null);
                }
            }
        }

        function createEntryFile (patterns) {
            var through = es.through(transform, end);

            var file = new File({
                cwd: process.cwd(),
                //base: "/",
                path: "specs.js"
            });

            var content = "";

            aide.util.glob(patterns)
                .then(
                function(files) {
                    files.forEach(function(src) {
                        content += "require('./" + src + "');\n";
                    });
                    file.contents = new Buffer(content);

                    try {
                        through.push(file);
                    } catch (e) {
                        console.log(e);
                    }
                },
                function(err) {
                    console.log(err.message);
                    through.emit('error', err);
                }
            );

            function transform (file) {
                this.queue(file);
                this.queue(null);
            }

            function end () {

            }

            return through;
        }
    };
}(module));