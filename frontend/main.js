import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString.js';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Stroke } from 'ol/style';
// import {fromLonLat} from 'ol/proj.js';
import {useGeographic} from 'ol/proj.js';
import axios from 'axios';

useGeographic();

function showRoad() {
  axios.get('http://127.0.0.1:8000/api/v1/road/10094/').then(function (response) {
    var coordinates = response.data;

    const inputString = coordinates[0].coordinates;
    const trimmedString = inputString.slice(1, -1);
    const coordinatesArray = JSON.parse("[" + trimmedString + "]")

    const lineString = new LineString(coordinatesArray);

    const feature = new Feature({
      geometry: lineString
    });
    
    const lineStyle = new Style({
      stroke: new Stroke({
          color: 'blue',
          width: 3 
      })
    });
    
    const vectorLayer = new VectorLayer({
      source: new VectorSource({
          features: [feature]
      }),
      style: lineStyle
    });

    map.addLayer(vectorLayer);
  })
}

const view = new View({
  center: [0,0],
  zoom: 2,
})

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: view,
});

const sidebar = document.getElementById('sidebar');

// showRoad();
function onClick(id, callback) {
  document.getElementById(id).addEventListener('click', callback);
}

onClick('pan-to', function () {
  showRoad();
  view.animate({
    center: [43.8198579971354,43.5979421994245],
    duration: 2000,
    zoom: 10
  })
})

