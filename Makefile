all:
	./mungekml.py Georgia_House_of_Representatives_Districts_2012.kml Georgia_Senate_Districts_2012.kml us_house_districts_ga.kml
	./tokmz.sh psc-district-1.kml districts/psc-district-1.kmz
	./tokmz.sh psc-district-2.kml districts/psc-district-2.kmz
	./tokmz.sh psc-district-3.kml districts/psc-district-3.kmz
	./tokmz.sh psc-district-4.kml districts/psc-district-4.kmz
	./tokmz.sh psc-district-5.kml districts/psc-district-5.kmz
	./upload.sh
