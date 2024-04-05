import React, {useEffect, useCallback, useMemo, useState, useRef} from "react";

import "leaflet/dist/leaflet.css";
import "./LeafletMap.css"
import L from "leaflet";
import { Toast } from 'primereact/toast';
import busData from "./substationData";
import lineData from "./lineData"

const NetworkMap = () => {

    const toast = useRef(null);
    const changeChecked = (e) => {
        alert(1)
    }
    if(document.getElementById("leaflet-container")){
        var a = document.createElement('input')
        a.type = "checkbox"
        a.addEventListener('click', changeChecked)
        document.getElementById("leaflet-container").appendChild(a)
    }
    
    function getContent(id, name, generation){
        const content = document.createElement('div')
        content.appendChild(document.createTextNode(name))

        for (var k=0; k<Object.keys(generation).length; k++){
            const gen = Object.keys(generation)[k]
            const capacity = generation[gen].capacity
            const checked = generation[gen].checked

            var div = document.createElement('div')
            var checkbox = '<input id="' + id + gen + '" type="checkbox"></input>'
            checkbox = (new DOMParser().parseFromString(checkbox,"text/xml")).documentElement
            if(checked){
                checkbox.setAttribute('checked',true)
            }
            checkbox.addEventListener('click', changeChecked)
            div.appendChild(checkbox)
            div.appendChild(document.createTextNode(gen + ':' + capacity + 'MW'))
            content.appendChild(div)
            

        }
        
        return content.outerHTML
            
        
            
            
    }
    useEffect(() => {
    
    
    var selected = []
    function clickCircle(e) {
        
      if(this.options.color !== "purple"){
        if(this.options.checked == 0){
          this.setStyle({fillColor:"red",color:"red",checked:1})
          selected.push(this.options.id)
        }else{
          this.setStyle({fillColor:"green",color:"green",checked:0})
          var index = selected.indexOf(this.options.id);
            if (index !== -1) {
              selected.splice(index, 1);
            }
        }
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
        center: [39.2, 35.5],
        zoom: 6,
        dragging:true,
    });
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function(map){
        var div = L.DomUtil.create('div', 'info legend');
        var labels = ['<strong>Legend</strong>'],
        categories = ['Substations (Generation)','Substations (No Generation)','Substations (Out of Service)'],
        colors = ['green', 'purple', 'red']
        for (var i = 0; i < categories.length; i++) {
                div.innerHTML += 
                labels.push('<i class="colorcircle" style="background:' + colors[i] + '"></i> ' + categories[i] );
            }
            div.innerHTML = labels.join('<br>');
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
        color: Object.keys(generation).length>0 ? "green": "purple",
        opacity: 0.5,
        fillColor: Object.keys(generation).length>0 ? "green": "purple",
        fillOpacity: 0.5,
        radius: 10000,
        checked: 0,
        name:name,
        generation:generation,
      }).on("click", clickCircle).on("mouseover", function(e){L.popup()
        .setLatLng(e.latlng) 
        .setContent(getContent(id, name, generation))
        .openOn(map);}).addTo(map)
    });
    
    lineData.data.forEach(({id, name, coordinates, voltage}) => {
      L.polyline(coordinates, {
        color: voltage==400 ? "black": "gray",
      }).addTo(map)
    });

},[]);

    return (
        
        <div id="leaflet-container" class="right-sidebar-container">
            <Toast ref={toast}></Toast>
            <div id="map" style={{ height: "85vh", width: "82vw" }}>
            </div>  
            
        </div>
    
);
}
export default NetworkMap