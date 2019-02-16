#!/usr/bin/env node

const PATH = require("path");
const FS = require("fs");
const LIB_JSON = require("lib.json");


function ensureInterface (basePath) {
    ensureInterface._cache = ensureInterface._cache || {};

    if (!basePath) {
        basePath = process.cwd();
    } else {
        basePath = PATH.resolve(basePath);
    }

    if (!ensureInterface._cache[basePath]) {

        function makeAPI (packageBasePath) {

            const LIB = Object.create(LIB_JSON.forBaseDir(packageBasePath));
            /*
                "bin": {
                    "ls": "lscode"
                },
                "js": {
                    "LIB1": "./api1"
                }
            */
           LIB.forPackage = function (packageBasePath, stream) {
                // NOTE: Ignoring 'stream' for now.
                if (!packageBasePath) {
                    return makeAPI(basePath);
                }
                return ensureInterface(packageBasePath).forPackage();
            };
        
            return LIB;
        }

        ensureInterface._cache[basePath] = makeAPI(basePath);
    }
    return ensureInterface._cache[basePath];
}

module.exports = ensureInterface();


if (require.main === module) {
    const command = process.argv[2];
    const name = process.argv[3];

    if (command === "resolve.bin") {
        process.stdout.write(LIB_JSON.forBaseDir(process.cwd()).bin.resolve(name));
    } else
    if (command === "resolve.js") {
        process.stdout.write(LIB_JSON.forBaseDir(process.cwd()).js.resolve(name));
    }
}
