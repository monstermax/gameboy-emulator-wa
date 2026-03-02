#!/bin/bash


cd `dirname $0`

cd webassembly
npm run asbuild

cd ..

cd web
npm run build

