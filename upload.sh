#!/bin/bash

set -e

gcloud auth login ianrose14@gmail.com

gsutil cp index.html gs://georgia-maps/
gsutil -m cp districts/*.kmz gs://georgia-maps/geo/
gsutil -m cp -r static/* gs://georgia-maps/static/

gcloud auth login ianrose@fullstory.com
