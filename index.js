#!/usr/bin/env node

const PATH = require("path");
const FS = require("fs");

/*
// TODO: Run this from 'cwd' after install is complete. (Maybe do this as part of a first-run hook.)
const CHILD_PROCESS = require("child_process");
if (!FS.existsSync(PATH.join(__dirname, '.~lib.json'))) {
    if (FS.existsSync(PATH.join(__dirname, 'node_modules/.bin/lib.json'))) {
        CHILD_PROCESS.execSync('lib.json from node_modules > .~lib.json', {
            cwd: __dirname
        });
    } else {
        CHILD_PROCESS.execSync('lib.json from node_modules > .~lib.json', {
            cwd: __dirname
        });
    }
}
*/

const LIB_JSON = require("lib.json");


function ensureLib (basePath) {
    ensureLib._cache = ensureLib._cache || {};
    if (!ensureLib._cache[basePath]) {
        ensureLib._cache[basePath] = LIB_JSON.forBaseDirs([
            basePath,
            __dirname
        ]);
    }
    return ensureLib._cache[basePath];
}

function ensureInterface (basePath) {
    ensureInterface._cache = ensureInterface._cache || {};

    if (!basePath) {
        basePath = process.cwd();
    } else {
        basePath = PATH.resolve(process.cwd(), basePath);
    }

    if (!ensureInterface._cache[basePath]) {

        function makeAPI (packageBasePath) {

            const lib = ensureLib(packageBasePath);
            const LIB = Object.create(lib);

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

module.exports = ensureInterface(process.cwd());


if (require.main === module) {
    const command = process.argv[2];
    const name = process.argv[3];

    if (command === "resolve.bin") {
        process.stdout.write(ensureLib(process.cwd()).bin.resolve(name));
    } else
    if (command === "resolve.js") {
        process.stdout.write(ensureLib(process.cwd()).js.resolve(name));
    }
}
