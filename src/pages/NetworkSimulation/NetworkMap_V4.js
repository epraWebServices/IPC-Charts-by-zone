import React, {useEffect, useCallback, useMemo, useState, useRef} from "react";

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
import Map from './Map'
const NetworkMap = () => {
  var busData = require('./substationData.json')
  var lineData = require('./lineData.json')
    const [footerGroup, setfooterGroup] = useState()
    const [generation_fleet, SetGenerationFleet] = useState()

    const toast = useRef(null);
    const toast2 = useRef(null);
    const [visible, SetVisible] = useState(false)
    const [header, setHeader] = useState('')
    const [dialogContent, SetDialogContent] = useState()
    const [center, setCenter] = useState([39.2, 35.5])
    const [zoom, setZoom] = useState(6)
    const [x, setX] = useState(0)
    function HideDialog(){
      SetVisible(false)
      SetDialogContent('')
    }

    
    
    
    function execute(){
      var out_of_service = []
      for(var i=0; i<Object.keys(busData.data).length;i++){
        const gen_unit = busData.data[Object.keys(busData.data)[i]].generation
        for (var j=0; j<Object.keys(gen_unit).length; j++){
          if(gen_unit[Object.keys(gen_unit)[j]].checked === false){
            out_of_service.push(busData.data[Object.keys(busData.data)[i]].id + "_" + Object.keys(gen_unit)[j])
          }
        }
      }
      toast.current.show({severity: 'success', summary: 'Saved', detail: 'Your choices has been saved', life: 5000});
    }
    useEffect(() => {
    setfooterGroup (
      <ColumnGroup>
        <Row>
          <Column footer="Total" colSpan={1}/>
          <Column footer={20} />
        </Row>
      </ColumnGroup>
    )
},[dialogContent, x]);


    return (
      <div className="col-12">
        <h4>Select generation units ...</h4>
        <Grid columns={2} relaxed='very' stackable>
          <Grid.Column>
            <Map busData = {busData} lineData = {lineData}></Map>
            
          </Grid.Column>
          <Grid.Column style={{paddingLeft:"20px"}}>
            <div className="card">
                <DataTable header="Generation Fleet" value={generation_fleet} footerColumnGroup={footerGroup} responsiveLayout="scroll" style={{alignItems:"center", textAlign:"center", fontSize:"16px"}}>
                    <Column field="type" header="Type" headerStyle={{minWidth:'10rem'}} style={{alignItems:"center", fontSize:"14px"}}></Column>
                    <Column field="fleet" header="Fleet (MW)" headerStyle={{minWidth:'10rem'}} style={{alignItems:"center", fontSize:"14px"}}></Column>
                </DataTable>
            </div>       
          </Grid.Column>
        </Grid>
        <Toast ref={toast} position="top-right" />
        <Toast ref={toast2} position="top-right" />
        <Dialog header={header} visible={visible} modal onHide={HideDialog} style={{width: '20vw'}}> {dialogContent}</Dialog>
        <div style={{paddingTop:"10px"}}>
          <Button onClick={execute}>Save</Button>
        </div>
      </div>  



        
    
);
}
export default NetworkMap