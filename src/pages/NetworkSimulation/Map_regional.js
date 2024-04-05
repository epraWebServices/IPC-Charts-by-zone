
import { MapContainer, TileLayer, Tooltip, Polygon, Circle, CircleMarker} from "react-leaflet";
import 'leaflet/dist/leaflet.css'
import "react-leaflet-fullscreen/dist/styles.css";
import React, { useEffect, useState, useRef } from "react";
import { Grid, Header } from "semantic-ui-react";
import { Dialog } from 'primereact/dialog';
import 'antd/dist/antd.css';
import RegionData from "./RegionData";

const Lmap = (props) => {
  const { regions, base_year } = props;
  const [Updatedregions, Setregions] = useState(regions)
  const [year, Setyear] = useState(base_year)
  const [Dialogheader, setDialogHeader] = useState('')
  const [DialogContent, setDialogContent] = useState('')
  const [visible, setVisible] = useState(false)
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
  /*const zones = {
    1: {
      'name': 'Trakya Yük Tevzi İşletme Müdürlüğü - İstanbul',
      'color': 'red'
    },
    2: {
      'name': 'Batı Anadolu Yük Tevzi İşletme Müdürlüğü - İzmir',
      'color': 'blue'
    },
    3: {
      'name': 'Kuzeybatı Anadolu Yük Tevzi İşletme Müdürlüğü - Sakarya',
      'color': 'green'
    },
    4: {
      'name': 'Orta Karadeniz Yük Tevzi İşletme Müdürlüğü - Samsun',
      'color': 'orange'
    },
    5: {
      'name': 'Doğu Anadolu Yük Tevzi İşletme Müdürlüğü - Erzurum',
      'color': 'purple'
    },
    6: {
      'name': 'Orta Anadolu Yük Tevzi İşletme Müdürlüğü - Ankara',
      'color': 'brown'
    },
    7: {
      'name': 'Batı Akdeniz Yük Tevzi İşletme Müdürlüğü - Antalya',
      'color': 'pink'
    },
    8: {
      'name': 'Güneydoğu Anadolu Yük Tevzi İşletme Müdürlüğü - Elazığ',
      'color': 'gray'
    },
    9: {
      'name': 'Doğu Akdeniz Yük Tevzi İşletme Müdürlüğü - Adana',
      'color': 'black'
    }
  }*/
  
  const onMouseEvent = (event, type) => {
    switch (type) {
      case 'over':
        event.target.setStyle({ fillOpacity: 0.95 })
        break
      case 'out':
        event.target.setStyle({ fillOpacity: 0.55 })
        break
      default:
        break
    }
  }
  function HideDialog(){
    setVisible(false)
  }
  function Clickregion(){
    setDialogHeader(<div> <div style={{textAlign:"center"}}>{zones[this.options.region].name}</div> <div style={{textAlign:"center"}}>Generation Fleet</div></div>)
    const map_year = year.name
    const clicked_zone_name = zones[this.options.region].name
    
    const a = <RegionData zones={zones} year= {Number(map_year)} zone_name = {clicked_zone_name}/>
    setDialogContent(a)
    
    setVisible(true)
  }


  useEffect(()=>{
    Setregions(regions)
  },[DialogContent])

  return (
    <div>
    <div style={{fontSize:"18px", color:"red"}}>Click the zones on the map to see and change fleet!</div>
    <div style={{paddingTop:"5px"}}>
    <Grid columns={2}>
      <Grid.Column>
        <div style={{ height: '75vh', width: '70vw'}}>
            <MapContainer
            center={[39, 35.5]} 
            zoom={6} 
            doubleClickZoom={false}
            style={{ height: '100%', width: '100%'}}
            dragging={true}
            >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              //url='https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png'
              attributionControl={false}
              noWrap = {true}
            />
            {Updatedregions.features.map((data) =>{
              return(
                <Polygon 
                  positions={data.geometry.coordinates} 
                  pathOptions={{color:'#41434B', weight: 1 ,fillColor: zones[data.properties.region].color, fillOpacity:0.55}}
                  region = {data.properties.region}
                  eventHandlers={{
                    mouseover: (event) => onMouseEvent(event, 'over'),
                    mouseout: (event) => onMouseEvent(event, 'out'),
                    click: Clickregion
                  }}
                >
                  <Tooltip sticky>
                    <h6>{zones[data.properties.region].name}</h6>
                  </Tooltip>
                
                </Polygon>     
              )
            })}
          </MapContainer>
        </div>  
        <Dialog header={Dialogheader} visible={visible} style={{width:"30%",height:"68%"}} modal onHide={HideDialog}>{DialogContent}</Dialog>
      </Grid.Column>
      <Grid.Column>
        <div id = "Generation Fleet" style={{ width: '25vw', paddingLeft:"20px"}}></div>
      </Grid.Column>
    </Grid>
    </div>        
  </div>  
  );
}
export default Lmap