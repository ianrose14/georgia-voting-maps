#!/usr/bin/env python
# -*- coding: utf-8 -*-

#
# IMPORTS
#
import os
import sys
import xml.etree.ElementTree as ET

#
# CONSTANTS
#
outdir = 'districts'

#
# MAIN
#
def createNewTree(placemark):
	root = ET.Element('kml')
	doc = ET.Element('Document')
	folder = ET.Element('Folder')
	name = ET.Element('name')
	name.text = 'OGRGeoJSON'
	root.append(doc)
	folder.append(name)
	doc.append(folder)
	folder.append(placemark)
	return ET.ElementTree(root)


def main():
	files = sys.argv[1:]
	for filename in files:
		if 'georgia_house' in filename.lower():
			chamber = 'GA House'
		elif 'georgia_senate' in filename.lower():
			chamber = 'GA Senate'
		elif 'us_house' in filename.lower():
			chamber = 'US House'
		else:
			raise StandardError('Could not determine house/senate for %s' % filename)

		tree = ET.parse(filename)
		root = tree.getroot()
		for doc in root:
			if doc.tag != 'Document':
				raise StandardError('expected Document, got tag="%s"' % doc.tag)

			for placemark in doc.findall('Folder/Placemark'):
				if placemark.find('name') is not None:
					district = int(placemark.find('name').text.split('-')[-1])
				else:
					district = None
					for simpledata in placemark.iter('SimpleData'):
						if simpledata.attrib.get('name') == 'DISTRICT':
							district = int(simpledata.text)

					if not district:
						raise StandardError('could not determine district for ' + str(placemark))

					name_elt = ET.Element('name')
					name_elt.text = '%s District %d' % (chamber, district)
					placemark.append(name_elt)

				if placemark.find('description') is None:
					desc_elt = ET.Element('description')
					desc_elt.text = '&nbsp;'#%s District %d' % (chamber, district)
					placemark.append(desc_elt)


				newtree = createNewTree(placemark)
				filename = '%s/%s-district-%d.kml' % (outdir, chamber.lower().replace(' ', '-'), district)
				newtree.write(filename, encoding='utf-8')
				print 'wrote', filename

				os.system('./tokmz.sh %s %s' % (filename, filename.replace('.kml', '.kmz')))

		print('done!')


if __name__ == '__main__':
	main()
