#!/usr/bin/env bash

echo -e "\n==> 01-Minimal\n"
pushd "01-Minimal" > /dev/null
    ./main.sh
popd > /dev/null

echo -e "\n==> 02-Minimal-Transitive\n"
pushd "02-Minimal-Transitive" > /dev/null
    ./main.sh
popd > /dev/null
