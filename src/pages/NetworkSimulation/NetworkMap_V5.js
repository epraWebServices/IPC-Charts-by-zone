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
import Lmap from "./Map";
const NetworkMap = () => {
  var busData = require('./substationData_2020.json')
  var lineData = require('./lineData_2020.json')
  useEffect( () => {


  },[busData])

  return(
    
      <Lmap busData={busData} lineData = {lineData}/>
    
  )


}

export default NetworkMap