import React, {useEffect, useCallback, useMemo, useState, useRef} from "react";

import "leaflet/dist/leaflet.css";
import "./LeafletMap.css"
import L, { tooltip } from "leaflet";
import { Toast } from 'primereact/toast';
import { Dialog } from "primereact/dialog";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import SubstationDialog from "./SubstationDialog";
import { set } from "rsuite/esm/utils/dateUtils";
const NetworkMap = () => {
    var busData = require('./substationData.json')
    var lineData = require('./lineData.json')
    const toast = useRef(null);
    const [visible, SetVisible] = useState(false)
    const [header, setHeader] = useState('')
    const [adata, setData] = useState('a')
    const [dialogContent, SetDialogContent] = useState()
    const [center, setCenter] = useState([39.2, 35.5])
    const [zoom, setZoom] = useState(6)
    function HideDialog(){
      SetVisible(false)
      SetDialogContent('')
    }
    function getStatus(generation){
      if(Object.keys(generation) == 0){
        return 0  // No generation
      }else{
        const length = Object.keys(generation).length
        var checked_length = 0
        for (var k=0; k<length; k++){
          if(generation[Object.keys(generation)[k]].checked == false){
            checked_length += 1
          }
        }
        if(checked_length == 0){
          return 1  // All in service
        }
        else if(length == checked_length){
          return 2  //All out of service
        }
        else{
          return 3  // A part is out of service
        }
      }
      
    }
    function getDialogContent(e){ 
      SetDialogContent(
      <div>
        {Object.keys(e.options.generation)[0] && <div className="field-checkbox">
          <Checkbox id={e.options.id + "-" + Object.keys(e.options.generation)[0]} checked={e.options.generation[Object.keys(e.options.generation)[0]].checked} onChange={onCheckboxChange}/>
          <label>{Object.keys(e.options.generation)[0]} : {e.options.generation[Object.keys(e.options.generation)[0]].capacity} MW</label>
        </div>}
        {Object.keys(e.options.generation)[1] && <div className="field-checkbox">
          <Checkbox id={e.options.id + "-" + Object.keys(e.options.generation)[1]} checked={e.options.generation[Object.keys(e.options.generation)[1]].checked} onChange={onCheckboxChange}/>
          <label>{Object.keys(e.options.generation)[1]} : {e.options.generation[Object.keys(e.options.generation)[1]].capacity} MW</label>
        </div>}
        {Object.keys(e.options.generation)[2] && <div className="field-checkbox">
          <Checkbox id={e.options.id + "-" + Object.keys(e.options.generation)[2]} checked={e.options.generation[Object.keys(e.options.generation)[2]].checked} onChange={onCheckboxChange}/>
          <label>{Object.keys(e.options.generation)[2]} : {e.options.generation[Object.keys(e.options.generation)[2]].capacity} MW</label>
        </div>}
        {Object.keys(e.options.generation)[3] && <div className="field-checkbox">
          <Checkbox id={e.options.id + "-" + Object.keys(e.options.generation)[3]} checked={e.options.generation[Object.keys(e.options.generation)[3]].checked} onChange={onCheckboxChange}/>
          <label>{Object.keys(e.options.generation)[3]} : {e.options.generation[Object.keys(e.options.generation)[3]].capacity} MW</label>
        </div>}
        {Object.keys(e.options.generation)[4] && <div className="field-checkbox">
          <Checkbox id={e.options.id + "-" + Object.keys(e.options.generation)[4]} checked={e.options.generation[Object.keys(e.options.generation)[4]].checked} onChange={onCheckboxChange}/>
          <label>{Object.keys(e.options.generation)[4]} : {e.options.generation[Object.keys(e.options.generation)[4]].capacity} MW</label>
        </div>}
      </div>
      ) 
    }
    
    function onCheckboxChange(){
      const id = Number(this.id.split('-')[0])
      const unit = this.id.split('-')[1]
      
      const row = busData.data.find(data => data.id === id)
      const bus_data_key = Object.keys(busData.data).find(key => busData.data[key] === row)
      if(row.generation[unit].checked){
        busData.data[bus_data_key].generation[unit].checked = false
      }else{
        busData.data[bus_data_key].generation[unit].checked = true
      }
    }
    function execute(){
      var out_of_service = []
      for(var i=0; i<Object.keys(busData.data).length;i++){
        const gen_unit = busData.data[Object.keys(busData.data)[i]].generation
        for (var j=0; j<Object.keys(gen_unit).length; j++){
          if(gen_unit[Object.keys(gen_unit)[j]].checked == false){
            out_of_service.push(busData.data[Object.keys(busData.data)[i]].id + "_" + Object.keys(gen_unit)[j])
          }
        }
      }
    }

    function showBusToolTip(id, name, generation){
      var div = document.createElement("div")
      div.id = id
      var label = document.createElement("label")
      label.innerHTML = name
      div.appendChild(label)
      for(var k=0; k< Object.keys(generation).length; k++){
        var br = document.createElement("br")
        div.appendChild(br)
        var checkbox = document.createElement("input")
        checkbox.type = "checkbox"
        if(generation[Object.keys(generation)[k]].checked){
          checkbox.checked = true
        }
        div.appendChild(checkbox)
        var i = document.createElement("i")
        i.innerHTML = Object.keys(generation)[k] + " : " + generation[Object.keys(generation)[k]].capacity + " MW"
        div.appendChild(i)
      }
      return(div)
    }
    useEffect(() => {
  
    function clickCircle(e) {
      if(this.options.color !== "purple"){
        setHeader(this.options.name)
        SetVisible(true)
        getDialogContent(this)
        setData(this)
      }
      else{
        toast.current.show({severity: 'warn', summary: 'No Generation Unit', detail: 'There is no generation unit in this substation. Please select green substations.', life: 5000});
        
      }
      
    }

    var container = L.DomUtil.get('map');
        if(container != null){
        container._leaflet_id = null;
        }

    var map = L.map('map',{
        center: center,
        zoom: zoom,
        dragging:true,
    }).addEventListener("mousemove", function(){setCenter(map.getCenter()); setZoom(map.getZoom())});
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function(map){
        var div = L.DomUtil.create('div', 'info legend');
        var labels = ['<strong>Legend</strong>'],
        categories = ['Substations (with generation unit(s))', 'Substations (without generation unit)', 'Substations (all generation units are out of service)'],
        colors = ['green', 'purple', 'red']
        for (var i = 0; i < categories.length; i++) {
                div.innerHTML += 
                labels.push('<i class="colorcircle" style="background:' + colors[i] + '"></i> ' + categories[i] );
            }
            div.innerHTML = labels.join('<br>');
        labels.push('<i class="colorcircle2"></i> ' + 'Substations (some generation units are out of service)')
        var categories = ['Transmission Line (400 kV)','Transmission Line (154 kV)'],
        colors = ['black', 'gray']
        labels.push('<i class="line-1"></i> ' + categories[0] );
        labels.push('<i class="line-2"></i> ' + categories[1] );
        
        div.innerHTML = labels.join('<br>');

        return div;
    }
    legend.addTo(map)

    const OSMUrl = "https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png";
    L.tileLayer(OSMUrl,{noWrap:true}).addTo(map);
    
    busData.data.forEach(({id, name, coordinates, generation}) => {
      L.circle(coordinates, {
        id: id,
        color: getStatus(generation)== 1 ? "green": getStatus(generation) == 0 ? "purple" : "red",
        opacity: 0.5,
        fillColor: getStatus(generation)== 1 ? "green": getStatus(generation) == 0 ? "purple" : getStatus(generation) == 2 ? "red": "green",
        fillOpacity: 0.5,
        radius: 10000,
        weight:getStatus(generation) == 3 ? 4: 1,
        checked: getStatus(generation),
        name:name,
        generation:generation,
      }).bindTooltip(showBusToolTip(id, name, generation)).on("click", clickCircle).addTo(map)
    });

    lineData.data.forEach(({id, name, coordinates, voltage}) => {
      L.polyline(coordinates, {
        color: voltage==400 ? "black": "gray",
      }).addTo(map)
    });

},[dialogContent]);

    return (
        
        <div id="leaflet-container" class="right-sidebar-container">
            <Toast ref={toast}></Toast>
            <div id="map" style={{ height: "85vh", width: "82vw" }}>
            </div>  
            <SubstationDialog busData={busData}></SubstationDialog>
            <Button onClick={execute}>Execute</Button>
            
        </div>
    
);
}
export default NetworkMap