#!/bin/bash


cd `dirname $0`

cd webassembly
npm run build

cd ..

cd web
npm run build

cd ..

#cd cli
#npm run build

