
const PATH = require("path");
const FS = require("fs");

function ensureInterface (basePath) {
    if (!basePath) {
        basePath = process.cwd();
    } else {
        basePath = PATH.resolve(basePath);
    }
    if (!ensureInterface._cache[basePath]) {

        const aspectCachePath = PATH.join(__dirname, "../..");

        function makeLIB (packageBasePath) {
            const code = [
                'LIB = {'
            ];
            var usedAliases = {};
            function addGetter (name, path) {
                if (usedAliases[name]) {
                    return;
                }
                usedAliases[name] = true;
                code.push([
                    '"_path_' + PATH.basename(path) + '": "' + path + '",',
                    'get ' + name + '() {',
                    '    delete this.' + name + ';',
                    '    return (this.' + name + ' = require("' + path + '"));',
                    '},'
                ].join("\n"));
            }
            var basePaths = [
                PATH.join(packageBasePath, "node_modules"),
                PATH.join(aspectCachePath, "node_modules")
            ];
            basePaths.forEach(function (basePath) {
                if (!FS.existsSync(basePath)) {
                    return;
                }
                FS.readdirSync(basePath).map(function (filename) {
                    var name = filename.toUpperCase().replace(/[\.-]/g, "_");
                    if (!/^[A-Z0-9_]+$/.test(name)) {
                        return;
                    }
                    addGetter(name, PATH.join(basePath, filename));
                });
            });
            addGetter('PATH', 'path');
            addGetter('FS', 'fs');
            addGetter('URI', 'uri');
            addGetter('HTTP', 'http');
            addGetter('HTTPS', 'https');
            addGetter('CRYPTO', 'crypto');
            code.push('};');
            var LIB = null;
            eval(code.join("\n"));
            return LIB;
        }

        function makeAPI (packageBasePath) {

            var API = {

                get version () {
                    return JSON.parse(FS.readFileSync(PATH.join(aspectCachePath, "package.json"), "utf8")).version;
                },

                get nodeModulesPath () {
                    return PATH.join(aspectCachePath, "node_modules");
                },

                get nodeModulesPaths () {
                    return [
                        PATH.join(packageBasePath, "node_modules"),
                        PATH.join(aspectCachePath, "node_modules")
                    ];
                },

                get binPath () {
                    return PATH.join(aspectCachePath, "node_modules/.bin");
                },

                resolve: function (uri) {
                    return API.LIB.resolve(uri);
                },

                require: function (uri) {
                    return API.LIB.require(uri);
                },

                get LIB () {
                    delete this.LIB;
                    const LIB = (this.LIB = makeLIB(packageBasePath));
                    
                    LIB.resolve = function (uri) {
                        var uri_parts = uri.split("/");
                        if (!LIB["_path_" + uri_parts[0]]) {
                            throw new Error("Cannot resolve uri '" + uri + "'!");
                        }
                        return PATH.join(LIB["_path_" + uri_parts[0]], uri_parts.slice(1).join("/"));
                    };

                    LIB.require = function (uri) {
                        return require(LIB.resolve(uri));
                    };

                    return LIB;
                },

                forPackage: function (packageBasePath) {
                    if (
                        !packageBasePath
                    ) {
                        return makeAPI(installedInfo.declaringPackagePath);
                    }
                    return ensureInterface(packageBasePath).forPackage();
                }
            };
        
            return API;
        }
        
        ensureInterface._cache[basePath] = makeAPI(installedInfo.declaringPackagePath);
    }
    return ensureInterface._cache[basePath];
}
ensureInterface._cache = {};


module.exports = {

    get version () {
        return ensureInterface().version;
    },

    get nodeModulesPath () {
        return ensureInterface().nodeModulesPath;
    },

    get nodeModulesPaths () {
        return ensureInterface().nodeModulesPaths;
    },

    get binPath () {
        return ensureInterface().binPath;
    },

    resolve: function (uri) {
        return ensureInterface().resolve(uri);
    },

    require: function (uri) {
        return ensureInterface().require(uri);
    },

    get LIB () {
        return ensureInterface().LIB;
    },

    forPackage: function (packageBasePath, stream) {
        // NOTE: Ignoring 'stream' for now.
        return ensureInterface(packageBasePath).forPackage();
    }
};
