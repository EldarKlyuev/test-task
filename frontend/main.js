import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point.js';
import LineString from 'ol/geom/LineString.js';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Stroke, Icon } from 'ol/style';
import {useGeographic} from 'ol/proj.js';
import Overlay from 'ol/Overlay.js';
import axios from 'axios';

useGeographic();

// Инициализация тултипа
const toolTipElement = document.createElement('div');
toolTipElement.className = 'tooltip';
document.body.appendChild(toolTipElement);

var tooltip;
var vectorLayer;
var vectorPointLayer;
var vectorPointSource;
var featurePoint;

function showRoad(road_code) {
  axios.get(`http://127.0.0.1:8000/api/v1/road/${road_code}/`).then(function (response) {
    var data = response.data;

    const inputString = data[0].coordinates;
    const trimmedString = inputString.slice(1, -1);
    const coordinatesArray = JSON.parse("[" + trimmedString + "]")
    
    // Анимация перехода с одной дороги на другую
    const avgCorArray = avgCoordinates(coordinatesArray)
    view.animate({
      center: avgCorArray,
      duration: 2000,
      zoom: 13
    });

    let coordinatesPointsArray;
    getazs(road_code).then(result => {
      coordinatesPointsArray = result
    })

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

    if (vectorLayer) {
      map.removeLayer(vectorLayer)
    }

    vectorLayer = new VectorLayer({
      source: new VectorSource({
          features: [feature]
      }),
    });

    if (tooltip) {
      map.removeOverlay(tooltip)
    }

    tooltip = new Overlay({
      element: toolTipElement,
      offset: [0, 50],
      positioning: 'bottom-center',
    });

    // Событие на наводку дороги (показ тултипа)
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
    
    // Событие на нажатие дороги
    map.on('click', (event) => {
      const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature);
      
      if (feature) {
        if (vectorPointLayer) {
          map.removeLayer(vectorPointLayer)
        }
        vectorPointSource = new VectorSource();

        vectorPointLayer = new VectorLayer({
          source: vectorPointSource
        });

        map.addLayer(vectorPointLayer);
        
        coordinatesPointsArray.forEach(element => {
          const point = new Point(element);
          featurePoint = new Feature({
            geometry: point,
          });
          vectorPointSource.addFeature(featurePoint);
        })

        const markerStyle = new Style({
          image: new Icon({
            src: '/src/marker2.png',
            anchor: [0.5, 1],
          })
        })
    
        vectorPointLayer.setStyle(markerStyle)
      }
    })
    
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
      });
      sidebar.appendChild(button);
    });
  })
}

// Функция получения JSON от АЗС таблицы 
async function getazs(road_code) {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/v1/azs-for/${road_code}/`)
    const data = response.data
    // console.log(data)
    let coordinatesPointsArray = []

    data.forEach(element => {
      const inputString = element.coordinates;
      const trimmedString = inputString.slice(1, -1);
      const coordinatesArray = JSON.parse("[" + trimmedString + "]")
      coordinatesPointsArray.push(coordinatesArray);
    })

    return coordinatesPointsArray;
  } catch (error) {
    console.log("F?", error)
  }
}

// Фукция средней координаты
function avgCoordinates(coordinatesArray) {
  if (coordinatesArray.length === 0) {
  return null;
  }
  
  let sumX = 0;
  let sumY = 0;
  
  coordinatesArray.forEach(coordinate => {
    sumX += coordinate[0];
    sumY += coordinate[1];
  });
  
  const avgX = sumX / coordinatesArray.length;
  const avgY = sumY / coordinatesArray.length;
  
  return [avgX, avgY];
}

allroads();
