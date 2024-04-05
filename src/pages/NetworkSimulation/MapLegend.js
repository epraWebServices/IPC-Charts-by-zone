import { useMap } from "react-leaflet/hooks";
import L from "leaflet";
import { useEffect } from "react";

const Legend = () => {
  const map = useMap();
  useEffect(() => {
    
    const legend = L.control({ position: "bottomleft"});

    legend.onAdd = () => {
      var div = L.DomUtil.create('div', 'info legend');
      var labels = ['<strong>Legend</strong>'],
      categories = ['400 kV Substations (with generation unit(s))', '154 kV Substations (with generation unit(s))', 'Substations (without generation unit)'],
      colors = ['green', 'blue', 'red']
      for (var i = 0; i < categories.length; i++) {
              div.innerHTML += 
              labels.push('<i class="colorcircle" style="background:' + colors[i] + '"></i> ' + categories[i] );
          }
          div.innerHTML = labels.join('<br>');
      //labels.push('<i class="colorcircle2"></i> ' + 'Substations (some generation units are out of service)')
      //var categories = ['Transmission Line (400 kV)', 'Transmission Line (154 kV)', 'Transmission Line (Out of Service)'],
      var categories = ['Transmission Line (400 kV)', 'Transmission Line (154 kV)', 'Transmission Line (Out of Service)'],
      colors = ['red', 'blue', 'gray']
      labels.push('<i class="line-1"></i> ' + categories[0] );
      labels.push('<i class="line-2"></i> ' + categories[1] );
      labels.push('<i class="line-3"></i> ' + categories[2] );
      div.innerHTML = labels.join('<br>');

      return div;
    };


    if(document.getElementsByClassName('info legend').length == 0){
      legend.addTo(map);
    }
    
  });
  return null;
};

export default Legend;
