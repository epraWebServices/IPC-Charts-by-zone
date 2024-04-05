import React, { useEffect, useState, useRef } from "react";
import { Panel } from "primereact/panel";
import { Dialog } from "primereact/dialog";
import moment from "moment";
import { useParams } from "react-router-dom";
import { ProcessService } from "../../service/ProcessService";
import { Toast } from 'primereact/toast';
import NetworkSimulationResultCharts from "./NetworkSimulationResultCharts"
import { apiPath } from "../../environments/ApiPath";
import { Row, Col, Select, Button, DatePicker, Tag, Dropdown} from 'antd';
import NetworkMap from "./NetworkMap_ResultsPage_V1";
import NetworkSimulationContingencyResult from "./NetworkSimulationContingencyResult";
import NetworkCongestionHoursResult from "./NetworkCongestionHoursResult";
import { Accordion, AccordionTab } from "primereact/accordion";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
const NetworkSimulationResults = (props) => {
  const processService = new ProcessService()
  let { id } = useParams()
  const [document,setDocument] =useState(null)
  const [processInput, setProcessInput] = useState(null)
  const [processName, setProcessName] = useState(null)
  const [processType, setProcessType] = useState(null)
  const [zoneResult, setZoneResult] = useState(null)
  const [lineResult, setLineResult] = useState(null)
  const [marketGeneration, setMarketGeneration] = useState(null)
  const [networkGeneration, setNetworkeneration] = useState(null)
  const [lineCapacities, setLineCapacities] = useState(null)
  const [lineLoadingResult, setLineLoadingResult] = useState(null)
  const [contingencyDefinition, setContingencyDefinition] = useState()
  const [contingencyResult, setContingencyResult] = useState()
  const [congestionHoursResult , setCongestionHoursResult] = useState()
  const [zoneGeneration, setZoneGeneration] = useState(null)
  const [visible, setVisible] = useState(false)
  const [visibleContingencyDialog, setVisibleContingencyDialog] = useState(false)
  const [visibleCongestionHoursDialog, setVisibleCongestionHoursDialog] = useState(false)
  const [date, setDate] = useState(null)
  const toastBR = useRef(null);
  const [busResults, setBusResults] = useState(["load", "generation", "curtailment", "redispatch_up" , "redispatch_down"])

  const colors = {
    "load": "rgb(255,180,80)",
    "generation": "rgb(25,100,80)",
    "curtailment": "rgb(255, 70, 10)",
    "redispatch_up": "rgb(43, 84, 154)",
    "redispatch_down": "rgb(104,40,96)",
  }
  useEffect(() => {
    
    const loadData = async () => {
      
      const res = await processService.getNWProcessById(id);
      if (res.success) {
        setProcessInput(res.object.inputs)
        setProcessName(res.object.processName)
        setProcessType(res.object.processType)
        setZoneResult(res.object.zoneResults)
        setLineResult(res.object.lineResult)
        setLineLoadingResult(res.object.lineLoadingResult)
        setMarketGeneration(res.object.marketGeneration)
        setNetworkeneration(res.object.networkGeneration)
        setLineCapacities(res.object.lineCapacities)
        setZoneGeneration(res.object.zoneGeneration)
        setContingencyDefinition(res.object.contingencyDefinition)
        setCongestionHoursResult(res.object.congestionHoursResult)
        setContingencyResult(res.object.contingencyResult)
        setDate(moment(new Date(res.object.inputs[0].base_year,0,res.object.inputs[0].from_hour/24 + 1)))
        const documentList = res.object.documentList;
        if(documentList){
            const documentData = documentList[0];
            setDocument(documentData)
        }
      }else{
        alert("Bu hata oluştu, admin ile iletişime geçiniz : "+res.message)
        //console.log(res.message);
      }

    }
    loadData();
  }, [id]);
  
  const getDocument = async () => {
 
     if(document && document.documentId)
     {
       window.open(apiPath.API_BASE_PATH + "/document/download/"+ document.documentId)
     }
     else{
       alert("Document could not found! Please contact the admin.")
     }
 
   } 

  const busOptions = [
    {label: "Load (MW)", value: "load"}, 
    {label: "Generation (MW)", value: "generation"}, 
    {label: "Curtailment (MW)", value: "curtailment"}, 
    {label: "Redispatch Up (MW)", value: "redispatch_up"},
    {label: "Redispatch Down (MW)", value: "redispatch_down"}
  ];

   let f = new Date(processInput && processInput[0].base_year, 0, 1);
   var userTimezoneOffset = f.getTimezoneOffset() * 60000;
   let startDate = new Date(f.getTime() - userTimezoneOffset) 
   const disabledDate = (e) => {
    let f = new Date(e._d)
    var userTimezoneOffset = f.getTimezoneOffset() * 60000;
    let date = new Date(f.getTime() - userTimezoneOffset) 
    var diff = date - startDate;
    var oneDay = 1000 * 60 * 60 * 24;
    return diff/oneDay < 0 || diff/oneDay >= processInput[0].to_hour / 24 
  }
  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color={colors[value]}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  };
  const defaultValueConfig =[]
  if (busResults.includes("load")){
    defaultValueConfig[0] = "load"
  }
  if (busResults.includes("generation")){
    defaultValueConfig[1] = "generation"
  }
  if (busResults.includes("curtailment")){
    defaultValueConfig[2] = "curtailment"
  }
  if (busResults.includes("redispatch_up")){
    defaultValueConfig[3] = "redispatch_up"
  }
  if (busResults.includes("redispatch_down")){
    defaultValueConfig[4] = "redispatch_down"
  }
  const items = [
    {
      key: '1',
      label: (
        <div onClick={() => setVisible(true)}>
          Total Generation And Capacity Factor Results
        </div>
      ),
    },
    {
      type: 'divider',
    },
    /*{
      key: '2',
      label: (
        <div onClick={() => setVisibleContingencyDialog(true)}>
          Contingency Results
        </div>
      ),
    },
    {
      type: 'divider',
    },
    */
    {
      key: '3',
      label: (
        <div onClick={() => setVisibleCongestionHoursDialog(true)}>
          Line Congestion Hour Results
        </div>
      ),
    },
  ];
  let date1 = processInput ? moment(new Date(processInput[0].base_year,0,1,processInput[0].from_hour - 1)).format('DD/MM/YYYY') : ""
  let date2 = processInput ? moment(new Date(processInput[0].base_year,0,1,processInput[0].to_hour - 1)).format('DD/MM/YYYY') : ""
  const zoneBodyTemplate = (data) => {
    return <b>{data.zoneName}</b>
  };
  return (
    (processName && <Panel style={{fontSize:"20px"}}>
      <Toast ref={toastBR} position="top-right" />
      <Accordion>
          <AccordionTab header="Analysis Input" style={{fontSize:"20px"}}>
              <DataTable header={"Generation Fleet (" + date1 + " - " + date2 + ")"} scrollable scrollDirection='horizontal' value={zoneGeneration} responsiveLayout="scroll"
                 
                className="datatable-responsive"
                sortField="zone_id" sortOrder={1}
                emptyMessage="No result found.">
                <Column header="Zone" frozen body={zoneBodyTemplate} style={{minWidth:"13rem"}}></Column>
                <Column field="gas" header="Natural Gas (MW)" style={{minWidth:"12rem"}}></Column>
                <Column field="lignite" header="Lignite (MW)" style={{minWidth:"10rem"}}></Column>
                <Column field="import_coal" header="Import Coal (MW)" style={{minWidth:"12rem"}}></Column>
                <Column field="coal" header="Local Coal (MW)" style={{minWidth:"10rem"}}></Column>
                <Column field="wind" header="Wind (MW)" style={{minWidth:"10rem"}}></Column>
                <Column field="pv" header="Solar (MW)" style={{minWidth:"10rem"}}></Column>
                <Column field="hydro" header="Hydro (MW)" style={{minWidth:"10rem"}}></Column>
                <Column field="ror" header="RoR (MW)" style={{minWidth:"10rem"}}></Column>
                <Column field="geothermal" header="Geothermal (MW)" style={{minWidth:"12rem"}}></Column>
                <Column field="biomass" header="Biomass (MW)" style={{minWidth:"10rem"}}></Column>
                <Column field="other" header="Other (MW)" style={{minWidth:"10rem"}}></Column>
                <Column field="nuclear" header="Nuclear (MW)" style={{minWidth:"10rem"}}></Column>
                <Column field="entsoe" header="ENTSOE (MW)" style={{minWidth:"10rem"}}></Column>
                <Column field="georgia" header="Georgia (MW)" style={{minWidth:"10rem"}}></Column>
                <Column field="consumption" header="Consumption (TWh)" style={{minWidth:"12rem"}}></Column>
              </DataTable>
          </AccordionTab>
        </Accordion>
      <Panel header={processName + " Result"} style={{fontSize:"16px"}}>
        <Row>
          <Col span={6}>
            <label style={{ fontFamily:"Arial" , fontWeight:"bold"}}>Select Date: </label>
            <DatePicker  defaultPickerValue= {moment(new Date(processInput[0].base_year,0,processInput[0].from_hour/24 + 1))} showTime={true} showNow={false} disabledDate={disabledDate} format="yyyy-MM-DD HH" value={date} onChange={(e) => setDate(e)}></DatePicker>
          </Col>
          <Col span={14} offset={1}>
            <Select
              mode="multiple"
              allowClear
              style={{ minWidth: '80%' }}
              placeholder="Select which bus results to show on the map"
              onChange={(e) => setBusResults(e)}
              defaultValue = {["load" , "generation" , "curtailment" ,"redispatch_up" , "redispatch_down"]}
              options={busOptions}
              
              tagRender={tagRender}
            />
          </Col>
          <Col span={3}>
            <Dropdown menu={{ items }} placement="bottomLeft" trigger={['click']}>
              <Button type="primary">Show Results</Button>
            </Dropdown>
          </Col>
        </Row>
        {/*<br></br>
        <Row>
            <Col offset={2}>
              <Button style={{borderRadius:"10px"}} type="primary"  onClick={() => {setVisible(true)}} > Show Total Generation And Capacity Factor Results</Button>
            </Col>
            <Col offset={3}>
              <Button style={{borderRadius:"10px"}} type="primary"  onClick={() => {setVisibleContingencyDialog(true)}}> Show Contingency Results</Button>
            </Col>
            <Col offset={4}>
              <Button style={{borderRadius:"10px"}} type="primary"  onClick={() => {setVisibleCongestionHoursDialog(true)}}> Show Congestion Hours</Button>
            </Col>
        </Row>*/}
        
      </Panel>

      <NetworkMap zoneResult = {zoneResult} date={date} processInput={processInput} busResults={busResults} lineResult={lineResult} networkGeneration = {networkGeneration} lineLoadingResult={lineLoadingResult}></NetworkMap>
      <Dialog header="Total Generation And Capacity Factor Results" visible={visible} onHide={()=>{setVisible(false)}} style={{width:"55%", height:"100%"}}>
        <NetworkSimulationResultCharts 
          processInput={structuredClone(processInput)} 
          marketGeneration={structuredClone(marketGeneration)} 
          networkGeneration={structuredClone(networkGeneration)}
          zoneGeneration = {structuredClone(zoneGeneration)}
          networkDate={date}
          />
      </Dialog>  
      <Dialog visible={visibleContingencyDialog} onHide={()=>{setVisibleContingencyDialog(false)}} style={{width:"80%", height:"100%"}}>
        <NetworkSimulationContingencyResult contingencyDefinition={contingencyDefinition} contingencyResult={contingencyResult}></NetworkSimulationContingencyResult>
      </Dialog>
      <Dialog header="Line Congestion Hours (400 kV) "visible={visibleCongestionHoursDialog} onHide={()=>{setVisibleCongestionHoursDialog(false)}} style={{width:"80%", height:"100%"}}>
        <NetworkCongestionHoursResult congestionHoursResult={congestionHoursResult} input={processInput}></NetworkCongestionHoursResult>
      </Dialog>
    </Panel>)
  );
};

export default NetworkSimulationResults;