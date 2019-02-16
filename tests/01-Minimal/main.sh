#!/usr/bin/env bash

echo "TEST_MATCH_IGNORE>>>"

rm -Rf .~* node_modules package-lock.json || true
unset ${!npm*} INIT_CWD

cmdPath="../../index.js"

echo "<<<TEST_MATCH_IGNORE"

echo "-----"

echo "bash.origin.lib resolve.bin uuid: $(${cmdPath} resolve.bin uuid)"
echo "bash.origin.lib resolve.js uuid: $(${cmdPath} resolve.js uuid)"

echo "-----"

node --eval '
    let LIB = require("../..").forPackage(__dirname);

    console.log("LIB", LIB);
    console.log("LIB.bin.resolve(\"uuid\")", LIB.bin.resolve("uuid"));
    console.log("LIB.js.resolve(\"lodash\")", LIB.js.resolve("lodash"));
    console.log("LIB.js.resolve(\"bash.origin.modules\")", LIB.js.resolve("bash.origin.modules"));
    console.log("LIB.js.forPackage(__dirname).resolve(\"lodash\")", LIB.forPackage(__dirname).js.resolve("lodash"));
'

echo "OK"
