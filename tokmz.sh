#!/bin/bash

set -e

# usage: tokmz.sh INPUT_KML OUTPUT_KMZ

rm -f $2
rm -rf temp

mkdir temp
cp $1 temp/
zip -q -r $2 temp
rm -r temp
