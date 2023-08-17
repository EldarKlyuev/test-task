import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point.js';
import LineString from 'ol/geom/LineString.js';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Stroke } from 'ol/style';
import {useGeographic} from 'ol/proj.js';
import Overlay from 'ol/Overlay.js';
import axios from 'axios';

useGeographic();

const toolTipElement = document.createElement('div');
toolTipElement.className = 'tooltip';
document.body.appendChild(toolTipElement);

var tooltip;
var vectorLayer;
var vectorPointLayer;
var vectorPointSource;
var featurePoint;
// var road_code;

function showRoad(road_code) {
  axios.get(`http://127.0.0.1:8000/api/v1/road/${road_code}/`).then(function (response) {
    var data = response.data;
    console.log(road_code)
    const inputString = data[0].coordinates;
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

    const boldLineStyle = new Style({
      stroke: new Stroke({
          color: 'red',
          width: 5
      })
    });


    var road_code_local = road_code
    if (vectorLayer) {
      map.removeLayer(vectorLayer)
    }

    vectorLayer = new VectorLayer({
      source: new VectorSource({
          features: [feature]
      }),
    });

    map.on('pointermove', (event) => {
      const features = map.getFeaturesAtPixel(event.pixel);
      

      if (features.length > 0) {

        vectorLayer.setStyle(boldLineStyle)
        const coordinates = event.coordinate;

        toolTipElement.innerHTML = `Наименование: ${data[0].name}<br/>Протяженность: ${data[0].length_km}`;
        tooltip.setPosition(coordinates);
        toolTipElement.style.display = 'block';
      } else {
        vectorLayer.setStyle(lineStyle)
        tooltip.setPosition(undefined);
        toolTipElement.style.display = 'none'
      }
    });

    // map.on('click', (event) => {
    //   const feature = map.getFeaturesAtPixel(event.pixel, (feature) => feature);

    //   if (feature) {
    //     map.removeLayer(vectorPointLayer);
    //     getazs(road_code_local);
    //   }
      
    // })
    
    if (tooltip) {
      map.removeOverlay(tooltip)
    }

    tooltip = new Overlay({
      element: toolTipElement,
      offset: [0, 50],
      positioning: 'bottom-center',
    });

    map.addOverlay(tooltip);
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

function allroads() {
  axios.get('http://127.0.0.1:8000/api/v1/allroads/').then(function (response) {
    const data = response.data;

    data.forEach(element => {
      const button = document.createElement('button');
      button.textContent = element.name;
      button.setAttribute('id', `button-${element.road_code}`);
      button.addEventListener('click', () => {

        showRoad(element.road_code);
        
        view.animate({
          center: [43.8198579971354,43.5979421994245],
          duration: 2000,
          zoom: 13
        });
      });
      sidebar.appendChild(button);

    });
  })
}

function getazs(road_code) {
  axios.get(`http://127.0.0.1:8000/api/v1/azs-for/${road_code}/`).then(function (response) {
    const data = response.data

    // if (vectorPointLayer) {
    //   map.removeLayer(vectorPointLayer);
    //   vectorPointSource.clear();
    // }
    // console.log(road_code)
    vectorPointSource = new VectorSource();

    vectorPointLayer = new VectorLayer({
      source: vectorPointSource
    });
    
    map.addLayer(vectorPointLayer);
    
    data.forEach(element => {
      const inputString = element.coordinates;
      const trimmedString = inputString.slice(1, -1);
      const coordinatesArray = JSON.parse("[" + trimmedString + "]");

      const point = new Point(coordinatesArray);
      featurePoint = new Feature({
        geometry: point,
      });
      vectorPointSource.addFeature(featurePoint);
    });

    

  })
}

allroads();

