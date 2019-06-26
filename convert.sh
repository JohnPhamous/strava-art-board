#!/bin/sh

# A script that converts .gpx and .tcx.gz to .geojson
# Strava export returns both file types
# This script depends on 2 Node utilities
# 1. togeojson: https://github.com/mapbox/togeojson
# 2. tcx: https://github.com/mapbox/tcx

# Convert .gpx to .geojson
for gpx in ./raw-data/*.gpx;
do
togeojson $gpx > $gpx.geojson;
mv $gpx.geojson ./data/;
done

# Unzip and convert .tcx.gz to .geojson
for tcx in ./raw-data/*.tcx.gz
do
gunzip -k $tcx
# Remove the .gz extenstion
tcx_file_name=${tcx::${#tcx}-3}
tcx < $tcx_file_name > $tcx.geojson
mv $tcx.geojson ./data/
done

# Copy file names to clipboard
list=''
for geojson in ./data/*.geojson;
do
list="$list'$geojson',"
done;

echo $list | pbcopy