import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProcessService } from '../service/ProcessService';
import { Button } from 'primereact/button';
import { useHistory } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
const Dashboard = () => {
    const processService = new ProcessService();
    const [processList, setProcessList] = useState([]);
    const [loading,setLoading] = useState(false);
    const history = useHistory();
    const [globalFilter, setGlobalFilter] = useState(null);
    
    useEffect(() => {
        setLoading(true);
        const dataLoad = async () => {
            const response = await processService.getProcessList();
             
            if(response.success) {
                 
                setProcessList(response.object);
            }
        }

        dataLoad().then(res => {
            setLoading(false);
        }
        );


    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const showResult =(data) => {
        //console.log(data);
        history.push({pathname:"/MarketSimulationResults/"+data.id})
    }

    const statusBodyTemplate = (rowData) => {
        
        return <span> {rowData.processStatus}</span>;
    }
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
               <Button disabled={rowData.processStatus !== 'COMPLETED'} label="Show Result" className="p-button-success" onClick={() => showResult(rowData)} />
            </React.Fragment>
        );
    }

    
    const processTypeBodyTemplate = (rowData) => {

    if(rowData.processType === 'MS_Optimization')
        return <span>Market Simulation (Optimization)</span>;
    else if(rowData.processType === 'MS_ML_Based')
        return <span >Market Simulation (Machine Learning Based)</span>;
    else if(rowData.processType === 'MS_Optimization_MCP_Estimation')
        return <span >Market Simulation (Optimization) & MCP Estimation</span>;
    else if(rowData.processType === 'MS_ML_Based_MCP_Estimation')
        return <span >Market Simulation (Machine Learning Based) & MCP Estimation</span>;
    }
    
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Results</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );
    
    return (
        <div>
            <div className="card" >
                <DataTable header={header} value={processList} responsiveLayout="scroll" loading={loading} paginator rows={10} rowsPerPageOptions={[5, 10, 25]} 
                className="datatable-responsive" globalFilter={globalFilter} 
                emptyMessage="No result found."
                sortField="id" sortOrder={-1}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} results">
                    <Column field="id" sortable header="ID"></Column>
                    <Column field="userName" sortable header="User"></Column>
                    <Column field="processType" sortable header="Process" body={processTypeBodyTemplate}></Column>
                    <Column field="processStatus" sortable header="Status" body={statusBodyTemplate}></Column>
                    <Column field="createDate" header="Process Start"></Column>
                    <Column field="updateDate" header="Process End"></Column>
                    <Column body={actionBodyTemplate} exportable={false}></Column>
                </DataTable>
            </div>
        </div>
    );
}


export default Dashboard;