let activeLayers = {};  // map from filename to layer handle

function initialize() {
  let map = new google.maps.Map(document.getElementById("map_canvas"), {
    center: {lat: 32.1656, lng: -82.9001},
    zoom: 7
  });

  // GA HOUSE
  let ga_house_picker = document.getElementById('ga-state-house-optgroup');
  for (let i = 1; i <= 180; i++) {  // 180 state house districts
    let elt = document.createElement('option');
    elt.value = 'ga-state-house-' + i;
    elt.innerText = 'GA House ' + i;
    elt.setAttribute('data-kmz', 'fart');
    ga_house_picker.appendChild(elt);
  }

  // GA SENATE
  let ga_senate_picker = document.getElementById('ga-state-senate-optgroup');
  for (let i = 1; i <= 56; i++) {  // 56 state senate districts
    let elt = document.createElement('option');
    elt.value = 'ga-state-senate-' + i;
    elt.innerText = 'GA Senate ' + i;
    ga_senate_picker.appendChild(elt);
  }

  // GA PSC
  let psc_picker = document.getElementById('ga-state-psc-optgroup');
  for (let i = 1; i <= 5; i++) {  // 5 PSC districts
    let elt = document.createElement('option');
    elt.value = 'ga-state-psc-' + i;
    elt.innerText = 'GA PSC ' + i;
    psc_picker.appendChild(elt);
  }

  // US HOUSE
  let us_house_picker = document.getElementById('ga-fed-house-optgroup');
  for (let i = 1; i <= 14; i++) {  // 14 US house districts
    let elt = document.createElement('option');
    elt.value = 'ga-fed-house-' + i;
    elt.innerText = 'US House GA-' + i;
    us_house_picker.appendChild(elt);
  }

  // handles both loads and unloads
  let handle = function(elementId, f) {
    let i = elementId.lastIndexOf('-');
    let prefix = elementId.substr(0, i);
    let suffix = elementId.substr(i+1);

    switch (prefix) {
      case 'ga-state-house':
        f(map, 'ga-house-district-' + suffix + '.kmz');
        break;
      case 'ga-state-senate':
        f(map, 'ga-senate-district-' + suffix + '.kmz');
        break;
      case 'ga-state-psc':
        f(map, 'psc-district-' + suffix + '.kmz');
        break;
      case 'ga-fed-house':
        f(map, 'us-house-district-' + suffix + '.kmz');
        break;
    }
  };

  $(document).ready(function() {
    $('#districts-sel').select2();
    $('#districts-sel').on('select2:select', function (e) {
      handle(e.params.data['id'], loadKmlLayer);
    });
    $('#districts-sel').on('select2:unselect', function (e) {
      handle(e.params.data['id'], unloadKmlLayer);
    });
  });
}

function loadKmlLayer(map, filename) {
  console.log('loading ' + filename);
  let src = 'https://storage.googleapis.com/georgia-maps/geo/' + filename;
	activeLayers[filename] = new google.maps.KmlLayer(src, {
	  suppressInfoWindows: false,
	  preserveViewport: false,
	  map: map
	});
}

function unloadKmlLayer(map, filename) {
  console.log('unloading ' + filename);
  let layer = activeLayers[filename];
  if (layer) {
    layer.setMap(null);
    delete activeLayers['filename'];
  } else {
    console.warn('filename "' + filename + '" does not seem to have an active layer');
  }
}
