#!/usr/bin/env bash

echo "TEST_MATCH_IGNORE>>>"

rm -Rf .~* node_modules package-lock.json || true
unset ${!npm*} INIT_CWD

cmdPath="../../index.js"

# TODO: Add another 'sub' package that uses a different 'stream' to ensure two streams can co-exist

#pushd "sub" > /dev/null
#    npm pack
#popd > /dev/null

echo "<<<TEST_MATCH_IGNORE"

echo "-----"

echo "bash.origin.lib resolve.bin uuid: $(${cmdPath} resolve.bin uuid)"
echo "bash.origin.lib resolve.js uuid: $(${cmdPath} resolve.js uuid)"

echo "-----"

node --eval '
    let LIB = require("../..").forPackage(__dirname);

    function normalizePath (path) {
        const parts = process.cwd().split("/");
        for (let i=parts.length; i>0; i--) {
            let subPath = parts.slice(0, i).join("/");
            if (path.indexOf(subPath) === 0) {
                return "..." + path.substring(subPath.length);
            }
        }
        throw new Error("We should never get here!");
    }

    console.log("LIB", LIB);
    console.log("LIB.bin.resolve(\"uuid\")", normalizePath(LIB.bin.resolve("uuid")));
    console.log("LIB.js.resolve(\"lodash\")", normalizePath(LIB.js.resolve("lodash")));
    console.log("LIB.js.resolve(\"bash.origin.modules\")", normalizePath(LIB.js.resolve("bash.origin.modules")));
    console.log("LIB.js.forPackage(__dirname).resolve(\"lodash\")", normalizePath(LIB.forPackage(__dirname).js.resolve("lodash")));
'

echo "OK"
