#!/usr/bin/env bash

echo "TEST_MATCH_IGNORE>>>"

rm -Rf .~* node_modules package-lock.json || true
unset ${!npm*} INIT_CWD


npm install --only=prod

echo "<<<TEST_MATCH_IGNORE"


PATH="node_modules/.bin:$PATH"

echo "-----"

which bash.origin.lib

echo "-----"

echo "binPath: $(bash.origin.lib binPath)"
echo "nodeModulesPath: $(bash.origin.lib nodeModulesPath)"

echo "-----"


node --eval '
    let LIB = require("bash.origin.lib").forPackage(__dirname);

    console.log("LIB", LIB);
    console.log("LIB.version", LIB.version);
    console.log("LIB.binPath", LIB.binPath);
    console.log("LIB.nodeModulesPath", LIB.nodeModulesPath);
    console.log("LIB.nodeModulesPaths", LIB.nodeModulesPaths);
    console.log("LIB.resolve(\"lodash\")", LIB.resolve("lodash"));
    console.log("LIB.resolve(\"bash.origin.modules\")", LIB.resolve("bash.origin.modules"));
    console.log("LIB.forPackage(__dirname)", LIB.forPackage(__dirname));
    console.log("LIB.forPackage(__dirname).version", LIB.forPackage(__dirname).version);
    console.log("LIB.forPackage(__dirname).nodeModulesPath", LIB.forPackage(__dirname).nodeModulesPath);
    console.log("LIB.forPackage(__dirname).nodeModulesPaths", LIB.forPackage(__dirname).nodeModulesPaths);
'

echo "OK"
