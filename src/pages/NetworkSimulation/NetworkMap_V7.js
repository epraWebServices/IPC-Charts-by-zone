import React, {useEffect, useCallback, useMemo, useState, useRef, ReactDOM} from "react";

import "leaflet/dist/leaflet.css";
import "./LeafletMap.css"
import L from "leaflet";
import { Toast } from 'primereact/toast';
import { Dialog } from "primereact/dialog";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Grid } from "semantic-ui-react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { render } from "react-dom";
import "./NetworkMapStyle.css"
//import Lmap from "./Map2";
import tr_svg from "./tr.svg";
const NetworkMap = () => {

  

  return(
    
      <div className="mainpage">
        <img src={tr_svg} width="100%" height="100%"></img>
        <svg viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}>
          <circle cx="1700" cy="600" r="50" fill="red"></circle>
          <polyline className="line" points="20 20, 40 25, 60 40, 80 120, 120 140, 200 180" vectorEffect="non-scaling-stroke" strokeWidth={4.2} strokeDasharray="2 20" fill="none" stroke="red" strokeLinecap="round"> </polyline>
        </svg>
      </div>
    
  )


}

export default NetworkMap