bash.origin.lib
===============

The `bash.origin.lib` package provides a stable set of `npm` packages that are used as dependencies by the **bash.origin** ecosystem.

Usage
-----

```
const BO_CTX = require("bash.origin.lib").forPackage(__dirname);

// See `./package.json : dependencies` for available packages
const LODASH = BO_CTX.LIB.LODASH;
const LODASH = BO_CTX.require("lodash");
```

Development
===========

Run tests:

    npm test

Update dependencies:

    npm outdated

    npm install -g npm-check-updates
    ncu --upgrade

Release to all:

    npm install -g sm.bump

    sm.bump
