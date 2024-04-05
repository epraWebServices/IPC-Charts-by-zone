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
import Lmap from "./Map_regional";
const NetworkMap = (props) => {
  var regions = require('./TEIASRegions_V1.json')
  const { base_year } = props;
  useEffect( () => {


  },[regions])

  return(
    
      <Lmap regions={regions} base_year={base_year}/>
    
  )


}

export default NetworkMap