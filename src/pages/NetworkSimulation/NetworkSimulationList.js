
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProcessService} from '../../service/ProcessService';
import { Button } from 'primereact/button';
import { useHistory } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Bar } from "react-chartjs-2";
import 'primeicons/primeicons.css';
import {
    Chart,
    registerables
  } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { apiPath } from '../../environments/ApiPath';
Chart.register(...registerables);
Chart.register(ChartDataLabels);
const NetworkSimulationList = () => {
    const processService = new ProcessService();
    const [loading,setLoading] = useState(false);
    const [values,setValues] = useState(null);
    const history = useHistory();
    const [globalFilter, setGlobalFilter] = useState(null);
    useEffect(() => {
        setLoading(true);
        const dataLoad = async () => {
            const response = await processService.getNetworkProcessList();
            if(response.success) {
                setValues(response.object);
            }
        }

        dataLoad().then(res => {
            setLoading(false);
        }
        );


    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Results</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );
    const showResult = async (data) => {
        //console.log(data);
        if(data.processStatus !== "CONVERGENCE_ERROR" && data.processType === "Network_Simulation"){
            history.push({pathname:"/NetworkSimulationResults/"+data.id})
        }
        else{
            const res = await processService.getProcessById(data.id);
            if (res.success) {
                const documentList = res.object.documentList;
                let document = null
                if(documentList){
                    document = documentList[0];
                }
                if(document && document.documentId)
                {
                    window.open(apiPath.API_BASE_PATH + "/document/download/"+ document.documentId)
                }
                else{
                alert("Document could not found! Please contact the admin.")
                }
            }
        }
        
    }

    /*
    const processTypeBodyTemplate = (rowData) => {

        if(rowData.processType === 'MS_Optimization')
          return <span>Market Simulation (Optimization)</span>;
        else if(rowData.processType === 'MS_ML_Based')
            return <span>Market Simulation (Machine Learning Based)</span>;
        else if(rowData.processType === 'MS_Optimization_MCP_Estimation')
            return <span>Market Simulation (Optimization) & MCP Estimation</span>;
        else if(rowData.processType === 'MS_ML_Based_MCP_Estimation')
            return <span>Market Simulation (Machine Learning Based) & MCP Estimation</span>;
        else if(rowData.processType === 'Network_Simulation'){
            return <span>Network Simulation</span>;
        }
        else if(rowData.processType === 'Network_Simulation_LMP'){
            return <span>Network Simulation and LMP Estimation</span>;
        }
    }
    */


    const rowClassName = (data) => {
        return data.processStatus === "PROCESS_START" ? 'p-disabled': ''
    }
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
               <Button disabled={rowData.processStatus === 'PROCESS_START'}
                style={{width:"9rem"}}
                 label={rowData.processStatus === 'COMPLETED'? "Show Result" : rowData.processStatus === 'PROCESS_START' ? "Show Result" : rowData.processStatus === 'CONVERGENCE_ERROR'? "Download Error File" : ""}
                  className={rowData.processStatus === 'CONVERGENCE_ERROR'? "p-button-danger" : "p-button-success"}
                  onClick={() => showResult(rowData)} />
            </React.Fragment>
        );
    }
    return (
        <div>
            <div className="card" style={{height:"85vh"}}>
                <DataTable header={header} value={values} responsiveLayout="scroll" loading={loading}
                className="datatable-responsive"
                globalFilter={globalFilter}
                emptyMessage="No result found."
                sortField="id" sortOrder={-1}
                dataKey="id"
                rowClassName={rowClassName}
                scrollable scrollDirection='vertical' scrollHeight="flex">
                    <Column field="id" sortable header="ID" style={{flex:'0 0 10%', overflow:"auto"}}></Column>
                    <Column field="userName" sortable header="User" style={{flex:'0 0 14%', overflow:"auto"}}></Column>
                    <Column field="processname" sortable header="Process Name" style={{flex:'0 0 20%', overflow:"auto"}}></Column>
                    <Column field="processStatus" sortable header="Process Status" style={{flex:'0 0 14%', overflow:"auto"}}></Column>
                    <Column field="createDate" header="Process Start" style={{flex:'0 0 14%', overflow:"auto"}}></Column>
                    <Column field="updateDate" header="Process End" style={{flex:'0 0 14%', overflow:"auto"}}></Column>
                    <Column header="" body={actionBodyTemplate} style={{flex:'0 0 14%', overflow:"auto"}} exportable={false} ></Column>
                </DataTable>
            </div>
        </div>
    );
}


export default NetworkSimulationList;