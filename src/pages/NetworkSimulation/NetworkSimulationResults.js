import React, { useEffect, useState, useRef } from "react";
import { Panel } from "primereact/panel";

import { Dialog } from "primereact/dialog";
import moment from "moment";


import { useParams } from "react-router-dom";
import { ProcessService } from "../../service/ProcessService";
import { Toast } from 'primereact/toast';
import NetworkSimulationResultCharts from "./NetworkSimulationResultCharts"
import { apiPath } from "../../environments/ApiPath";
import { Row, Col, Select, Button, DatePicker, Tag} from 'antd';

import NetworkMap from "./NetworkMap_ResultsPage";
import NetworkSimulationContingencyResult from "./NetworkSimulationContingencyResult";

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
  const [zoneGeneration, setZoneGeneration] = useState(null)
  const [visible, setVisible] = useState(false)
  const [visibleContingencyDialog, setVisibleContingencyDialog] = useState(false)
  const [date, setDate] = useState(null)
  const toastBR = useRef(null);
  const [busResults, setBusResults] = useState(["load", "generation", "curtailment", "redispatch_up"])

  const colors = {
    "load": "rgb(255,180,80)",
    "generation": "rgb(25,100,80)",
    "curtailment": "rgb(255, 70, 10)",
    "redispatch_up": "rgb(43, 84, 154)"
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
        setContingencyResult(res.object.contingencyResult)
        setDate(moment(new Date(res.object.inputs[0].base_year,0,res.object.inputs[0].from_hour/24 + 1)))
        const documentList = res.object.documentList;
        if(documentList){
            const documentData = documentList[0];
            setDocument(documentData)
        }
      }else{
        alert("Bu hata oluştu, admin ile iletişime geçiniz : "+res.message)
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
    {label: "Load", value: "load"}, 
    {label: "Generation", value: "generation"}, 
    {label: "Curtailment", value: "curtailment"}, 
    {label: "Redispatch Up", value: "redispatch_up"}, 
    {label: "Redispatch Down", value: "redispatch_down"}, 
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
  return (
    (processName && <Panel style={{fontSize:"20px"}}>
      <Toast ref={toastBR} position="top-right" />
      <Panel header={processName + " Result"} style={{fontSize:"16px"}}>
        <Row>
          <Col span={6}>
            <label>Select Date: </label>
            <DatePicker defaultPickerValue= {moment(new Date(processInput[0].base_year,0,processInput[0].from_hour/24 + 1))} showTime={true} showNow={false} disabledDate={disabledDate} format="yyyy-MM-DD HH" value={date} onChange={(e) => setDate(e)}></DatePicker>
          </Col>
          <Col span={7}>
            <Select
              mode="multiple"
              allowClear
              style={{ width: '90%' }}
              placeholder="Select which bus results to show on the map"
              onChange={(e) => setBusResults(e)}
              defaultValue = {["load", "generation", "curtailment", "redispatch_up"]}
              options={busOptions}
              tagRender={tagRender}
            />
          </Col>
          <Col span={7}>
            <Button type="primary" onClick={() => {setVisible(true)}}> Show Total Generation And Capacity Factor Results</Button>
          </Col>
          <Col span={4}>
            <Button type="primary" onClick={() => {setVisibleContingencyDialog(true)}}> Show Contingency Results</Button>
          </Col>
        </Row>
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
    </Panel>)
  );
};

export default NetworkSimulationResults;
