#!/usr/bin/env sh
set -e
yarn build
git add dist -f
git commit -m "deploy"
git subtree push --prefix dist origin gh-pages