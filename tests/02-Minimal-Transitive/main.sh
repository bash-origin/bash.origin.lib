#!/usr/bin/env bash

echo "TEST_MATCH_IGNORE>>>"

rm -Rf .~* node_modules package-lock.json || true
unset ${!npm*} INIT_CWD


# TODO: Add another 'sub' package that uses a different 'stream' to ensure two streams can co-exist

#pushd "sub" > /dev/null
#    npm pack
#popd > /dev/null


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
    let LIB = require("sub").LIB;

    let basedir = require("path").dirname(require.resolve("sub"));

    console.log("LIB", LIB);
    console.log("LIB.version", LIB.version);
    console.log("LIB.binPath", LIB.binPath);
    console.log("LIB.nodeModulesPath", LIB.nodeModulesPath);
    console.log("LIB.nodeModulesPaths", LIB.nodeModulesPaths);
    console.log("LIB.resolve(\"lodash\")", LIB.resolve("lodash"));
    console.log("LIB.resolve(\"bash.origin.modules\")", LIB.resolve("bash.origin.modules"));
    console.log("LIB.forPackage(basedir)", LIB.forPackage(basedir));
    console.log("LIB.forPackage(basedir).version", LIB.forPackage(basedir).version);
    console.log("LIB.forPackage(basedir).nodeModulesPath", LIB.forPackage(basedir).nodeModulesPath);
    console.log("LIB.forPackage(basedir).nodeModulesPaths", LIB.forPackage(basedir).nodeModulesPaths);
'

echo "OK"
