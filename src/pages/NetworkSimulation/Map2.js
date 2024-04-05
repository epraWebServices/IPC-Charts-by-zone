
import { MapContainer, Circle, TileLayer, Tooltip, Popup, Polyline, Marker, Polygon, SVGOverlay} from "react-leaflet";
import { icon } from "leaflet"
import {useMapEvents} from "react-leaflet";
import 'leaflet/dist/leaflet.css'
import L from "leaflet";
import { Toast } from 'primereact/toast';
import "react-leaflet-fullscreen/dist/styles.css";
import { Checkbox } from "primereact/checkbox";
import Legend from "./MapLegend";
import React, { useEffect, useState, useRef } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { Grid } from "semantic-ui-react";
import { InputNumber, InputGroup } from 'rsuite';
const Lmap = (props) => {

  const { regions } = props;
  const toast = useRef(null);
  const timerRef = useRef()
  const [dashOffset, setDashOffset] = useState(0)
  const zones = {
    1: {
      'name': 'Trakya Yük Tevzi İşletme Müdürlüğü - İstanbul',
      'color': '#7986CB'
    },
    2: {
      'name': 'Batı Anadolu Yük Tevzi İşletme Müdürlüğü - İzmir',
      'color': '#1a237e'
    },
    3: {
      'name': 'Kuzeybatı Anadolu Yük Tevzi İşletme Müdürlüğü - Sakarya',
      'color': '#06a9f4'
    },
    4: {
      'name': 'Orta Karadeniz Yük Tevzi İşletme Müdürlüğü - Samsun',
      'color': '#4cb6ac'
    },
    5: {
      'name': 'Doğu Anadolu Yük Tevzi İşletme Müdürlüğü - Erzurum',
      'color': '#33691d'
    },
    6: {
      'name': 'Orta Anadolu Yük Tevzi İşletme Müdürlüğü - Ankara',
      'color': '#26c6da'
    },
    7: {
      'name': 'Batı Akdeniz Yük Tevzi İşletme Müdürlüğü - Antalya',
      'color': '#00579b'
    },
    8: {
      'name': 'Doğu Akdeniz Yük Tevzi İşletme Müdürlüğü - Adana',
      'color': '#009588'
    },
    9: {
      'name': 'Güneydoğu Anadolu Yük Tevzi İşletme Müdürlüğü - Elazığ',
      'color': '#006064'
      
    }
  }

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setDashOffset((r) => r + 1)
    }, 1000)
    return () => {
      clearInterval(timerRef.current)
    }
  }, [])


  return (
    
    <div>
    <div>
        <div>
          <div style={{ height: '80vh', width: '95vw'}}>
          <MapContainer
            center={[39, 35]} 
            zoom={7} 
            doubleClickZoom={false}
            style={{ height: '100%', width: '100%'}}
            dragging={true}
            >
            {regions.features.map((data) =>{
              return(
                <Polygon 
                  positions={data.geometry.coordinates} 
                  pathOptions={{color:"", weight: 1 ,fillColor: zones[data.properties.region].color, fillOpacity:0.3}}
                >
                </Polygon>     
              )
            })}
            <Circle
                  center = {[37.003663451, 35.324724016]}
                  radius = {20000}
                  opacity= {0.5}
                  fillOpacity= {0.5}
                  id = {1}
                  pathOptions={{
                    color: "red",
                    fillColor: "red"
                  }}  
            ></Circle>
            <Circle
                  center = {[39.933961061, 41.280893375]}
                  radius = {20000}
                  opacity= {0.5}
                  fillOpacity= {0.5}
                  id = {1}
                  pathOptions={{
                    color: "red",
                    fillColor: "red"
                  }}  
            ></Circle>
            <Circle
                  center = {[39.810733247, 32.808206144]}
                  radius = {20000}
                  opacity= {0.5}
                  fillOpacity= {0.5}
                  id = {1}
                  pathOptions={{
                    color: "red",
                    fillColor: "red"
                  }}  
            ></Circle>
            <Circle
                  center = {[41.236538709, 36.183816036]}
                  radius = {20000}
                  opacity= {0.5}
                  fillOpacity= {0.5}
                  id = {1}
                  pathOptions={{
                    color: "red",
                    fillColor: "red"
                  }}  
            ></Circle>
            <Circle
                  center = {[40.783368512, 30.406868672]}
                  radius = {20000}
                  opacity= {0.5}
                  fillOpacity= {0.5}
                  id = {1}
                  pathOptions={{
                    color: "red",
                    fillColor: "red"
                  }}  
            ></Circle>
            <Circle
                  center = {[38.691536124, 39.212166437]}
                  radius = {20000}
                  opacity= {0.5}
                  fillOpacity= {0.5}
                  id = {1}
                  pathOptions={{
                    color: "red",
                    fillColor: "red"
                  }}  
            ></Circle>
            <Circle
                  center = {[41.017109957, 28.80721997]}
                  radius = {20000}
                  opacity= {0.5}
                  fillOpacity= {0.5}
                  id = {1}
                  pathOptions={{
                    color: "red",
                    fillColor: "red"
                  }}  
            ></Circle>
            <Circle
                  center = {[38.429138971, 27.225884505]}
                  radius = {20000}
                  opacity= {0.5}
                  fillOpacity= {0.5}
                  id = {1}
                  pathOptions={{
                    color: "red",
                    fillColor: "red"
                  }}  
            ></Circle>
            <Circle
                  center = {[37.003313111, 30.722423484]}
                  radius = {20000}
                  opacity= {0.5}
                  fillOpacity= {0.5}
                  id = {1}
                  pathOptions={{
                    color: "red",
                    fillColor: "red"
                  }}  
            ></Circle>
            <Polyline
              positions = {[[37.003313111, 30.722423484], [36.9, 30.45], [38.2, 27.225884505], [38.429138971, 27.225884505]]}
              pathOptions = {{
                width: 5,
                fill : "",
                color: "black",
                dashArray: '2, 20', 
                dashOffset: {dashOffset},
              }}
              >
            </Polyline>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution= '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              noWrap = {true}
            />
            <SVGOverlay attributes={{ stroke: 'red', }} bounds = {[[36,26],[42, 45]] }>
              <polyline points="20 20, 40 25, 60 40, 80 120, 120 140, 200 180" vectorEffect="non-scaling-stroke" strokeWidth={4.2} strokeDasharray="2 20" fill="none" strokeLinecap="round"> </polyline>
            </SVGOverlay>
          </MapContainer>
          </div>
        </div>  
    </div>
    
    <Toast ref={toast} position="top-right" />     
  </div>  
    




  );
}
export default Lmap