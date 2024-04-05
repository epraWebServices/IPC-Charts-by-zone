
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
import "./MarketSimulationList.css"
Chart.register(...registerables);
Chart.register(ChartDataLabels);

const MarketSimulationList = () => {
    const processService = new ProcessService();
    const [loading,setLoading] = useState(false);
    const [values,setValues] = useState(null);
    const history = useHistory();
    const [globalFilter, setGlobalFilter] = useState(null);
    const [selected, setSelected] = useState(null);
    const [visible, setVisible] = useState(false)
    const [ComparisonPage, setComparisonPage] = useState()
    function HideDialog(){
        setVisible(false)
        setSelected(null)
    }
    useEffect(() => {
        setLoading(true);
        const dataLoad = async () => {
            const response = await processService.getMarketProcessList();
            if(response.success) {
                setValues(response.object);
            }
        }

        dataLoad().then(res => {
            setLoading(false);
        }
        );


    }, [ComparisonPage]); // eslint-disable-line react-hooks/exhaustive-deps
    async function compareResults(selected){
        var data = selected.selected
        var non_comleted = []
        for (var i=0; i<Object.keys(data).length; i++){
            if(data[i].processStatus !== "COMPLETED"){
                non_comleted.push(i)
            }
        }
        for (i = non_comleted.length -1; i >= 0; i--){
            data.splice(non_comleted[i],1);
        }
            
        for (i=0; i<Object.keys(data).length; i++){
            const id = data[Object.keys(data)[i]].id
            const res = await processService.getProcessById(id);
            if (res.success) {
                data[Object.keys(data)[i]]['annual_generation'] = res.object.marketSimulationAnnualGenerationResults[0]
                data[Object.keys(data)[i]]['capacity_factor'] = res.object.marketSimulationCapacityFactorResults[0]
                data[Object.keys(data)[i]]['seasonal_mcp'] = res.object.mcpSeasonalEstimationResults ? res.object.mcpSeasonalEstimationResults[0] : 0
                data[Object.keys(data)[i]]['monthly_mcp'] = res.object.mcpMonthlyEstimationResults? res.object.mcpMonthlyEstimationResults[0] : 0
                if(res.object.mcpSeasonalEstimationResults){
                    data[Object.keys(data)[i]]['mcp_estimation'] = true
                }
            }else{
                alert("Bu hata oluştu, admin ile iletişime geçiniz : " + res.message)
            }
        }
        var labels = []
        var datasets = []
        var natural_gas = []
        var total_coal = []
        var total_hydro = []
        var nuclear = []
        var total_renewable = []
        for (i=0; i<Object.keys(data).length; i++){
            const id = data[Object.keys(data)[i]].id
            const label = data[Object.keys(data)[i]].processname
            labels.push(String(id) + "_" + label)
            natural_gas.push(data[Object.keys(data)[i]].annual_generation.natural_gas)
            total_coal.push(data[Object.keys(data)[i]].annual_generation.imported_coal + data[Object.keys(data)[i]].annual_generation.local_coal + data[Object.keys(data)[i]].annual_generation.lignite)
            total_hydro.push(data[Object.keys(data)[i]].annual_generation.hydro_dam + data[Object.keys(data)[i]].annual_generation.hydro_ror)
            nuclear.push(data[Object.keys(data)[i]].annual_generation.nuclear)
            total_renewable.push(data[Object.keys(data)[i]].annual_generation.solar_pv + data[Object.keys(data)[i]].annual_generation.wind_onshore)
        }
        datasets.push({
            type: 'bar',
            label: "Natural Gas",
            backgroundColor: '#7030A0',
            data: natural_gas,
            datalabels:{
                display: false
            },
            barPercentage: 0.5
        },
        {
            type: 'bar',
            label: "Total Coal",
            backgroundColor: '#7F7F7F',
            data: total_coal,
            datalabels:{
                display: false
            },
            barPercentage: 0.5
        },
        {
            type: 'bar',
            label: "Total Hydro",
            backgroundColor: '#0066FF',
            data: total_hydro,
            datalabels:{
                display: false
            },
            barPercentage: 0.5
        },
        {
            type: 'bar',
            label: "Nuclear",
            backgroundColor: '#C00000',
            data: nuclear,
            datalabels:{
                display: false
            },
            barPercentage: 0.5
        },
        {
            type: 'bar',
            label: "Total Renewable",
            backgroundColor: '#70AD47',
            data: total_renewable,
            datalabels:{
                display: false
            },
            barPercentage: 0.5
        })
        const stackedData1 ={labels, datasets}
        let stackedOptions = {
            maintainAspectRatio: false,
            aspectRatio: .8,
            plugins: {
                title: {
                    display: true,
                    text: 'Annual Generation Comparison',
                    font:{size:16},
                },
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                legend: {
                    
                    labels: {
                        color: '#495057'
                    }
                }
            },
            
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    },
                    title: {
                        font:{size:14},
                        display: true,
                        text: "Scenario",
                      },
                },
                y: {
                    stacked: true,
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    },
                    title: {
                        font:{size:14},
                        display: true,
                        text: "Annual Generation (TWh)",
                      },
                }
            }
        };
        var datasets2 = []
        var colors = ["#CC66FF","#6699FF","#000000","#009900","#A6A6A6","#FFC000","#FF0000","#990099","#F4B183","#33CCFF","#767171","#000099"]
        for (i=0; i<Object.keys(data).length; i++){
            var x = []
            x.push(
                data[Object.keys(data)[i]].capacity_factor.natural_gas,
                data[Object.keys(data)[i]].capacity_factor.imported_coal,
                data[Object.keys(data)[i]].capacity_factor.lignite,
            )
            if(i>11){
                const randomColor = Math.floor(Math.random()*16777215).toString(16);
                colors.push("#"+ randomColor)
            }
            
            datasets2.push({
                type: 'bar',
                label: labels[i],
                backgroundColor: colors[i],
                data: x,
                datalabels:{
                    formatter: function(value, context) {
                        return Math.round(value*100)/100
                    },
                    display: true,
                    anchor: "end",
                    align: 'end',
                    offset:-5
                },
                barPercentage: 0.5,
            })
        }
        const labels2 = ["Natural Gas", "Import Coal", "Lignite"]
        const multiaxisData1 ={labels:labels2, datasets:datasets2}

        let multiAxisOptions1 = {
            maintainAspectRatio: false,
            aspectRatio: .8,
            
            plugins: {
                title: {
                    display: true,
                    text: 'Capacity Factor Comparison',
                    font:{size:16},
                },
                legend: {
                    display:true,
                    labels: {
                        color: '#495057'
                    }
                },
                tooltip: {
                    enabled: false,
                },
                
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    },
                    title: {
                        font:{size:14},
                        display: true,
                        text: "Generation Type",
                      },
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    grid: {
                        color: '#ebedef'
                    },
                    title: {
                        font:{size:14},
                        display: true,
                        text: "Capacity Factor (%)",
                      },
                    min: 0,
                    max: 100
                    
                },
            }
        };
        
        var datasets3 = []
        for (i=0; i<Object.keys(data).length; i++){
            x = []
            if(data[Object.keys(data)[i]]['mcp_estimation']){
                x.push(
                    data[Object.keys(data)[i]].seasonal_mcp.winter,
                    data[Object.keys(data)[i]].seasonal_mcp.spring,
                    data[Object.keys(data)[i]].seasonal_mcp.summer,
                    data[Object.keys(data)[i]].seasonal_mcp.fall,
    
                )
                datasets3.push({
                    type: 'bar',
                    label: labels[i],
                    
                    backgroundColor: colors[i],
                    data: x,
                    datalabels:{
                        display: true,
                        formatter: function(value, context) {
                            return Math.round(value*100)/100
                        },
                        display: true,
                        anchor: "end",
                        align: 'end',
                        offset:-5
                    },
                    barPercentage: 0.5,
                })
            }
            

        }
        const labels3 = ["Winter", "Spring", "Summer", "Fall"]
        const multiaxisData2 ={labels:labels3, datasets:datasets3}

        let multiAxisOptions2 = {
            maintainAspectRatio: false,
            aspectRatio: .8,
            plugins: {
                
                title: {
                    display: true,
                    text: 'Seasonal MCP Comparison',
                    font:{size:16},
                },
                legend: {
                    display:true,
                    labels: {
                        color: '#495057'
                    }
                },
                tooltip: {
                    enabled:true
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    },
                    title: {
                        font:{size:14},
                        display: true,
                        text: "Season",
                      },
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    ticks: {
                        min: 0,
                        max: 100,
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    },
                    title: {
                        font:{size:14},
                        display: true,
                        text: "MCP (EURO/MWh)",
                      },
                },

            }
        };

        var datasets4 = []
        for (i=0; i<Object.keys(data).length; i++){
            x = []
            if(data[Object.keys(data)[i]]['mcp_estimation']){
                x.push(
                    data[Object.keys(data)[i]].monthly_mcp.january,
                    data[Object.keys(data)[i]].monthly_mcp.february,
                    data[Object.keys(data)[i]].monthly_mcp.march,
                    data[Object.keys(data)[i]].monthly_mcp.april,
                    data[Object.keys(data)[i]].monthly_mcp.may,
                    data[Object.keys(data)[i]].monthly_mcp.june,
                    data[Object.keys(data)[i]].monthly_mcp.july,
                    data[Object.keys(data)[i]].monthly_mcp.august,
                    data[Object.keys(data)[i]].monthly_mcp.september,
                    data[Object.keys(data)[i]].monthly_mcp.october,
                    data[Object.keys(data)[i]].monthly_mcp.november,
                    data[Object.keys(data)[i]].monthly_mcp.december,
                )
                datasets4.push({
                    type: 'bar',
                    label: labels[i],
                    backgroundColor: colors[i],
                    data: x,
                    datalabels:{
                        display: false
                    },
                    barPercentage: 0.5
                })
            }
            

        }
        const labels4 = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        const multiaxisData3 ={labels:labels4, datasets:datasets4}

        let multiAxisOptions3 = {
            maintainAspectRatio: false,
            aspectRatio: .8,
            plugins: {
                title: {
                    display: true,
                    text: 'Monthly MCP Comparison',
                    font:{size:16},
                },
                legend: {
                    display:true,
                    labels: {
                        color: '#495057'
                    }
                },
                tooltip: {
                    enabled: true
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    },
                    title: {
                        font:{size:14},
                        display: true,
                        text: "Month",
                      },
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    ticks: {
                        min: 0,
                        max: 100,
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    },
                    title: {
                        font:{size:14},
                        display: true,
                        text: "MCP (EURO/MWh)",
                      },
                },

            }
        };

        const labels5 = []
        x = []
        var colors5 = []
        for (i=0; i<Object.keys(data).length; i++){
            if(data[Object.keys(data)[i]]['mcp_estimation']){
                x.push(
                    (data[Object.keys(data)[i]].seasonal_mcp.winter +
                    data[Object.keys(data)[i]].seasonal_mcp.spring +
                    data[Object.keys(data)[i]].seasonal_mcp.summer +
                    data[Object.keys(data)[i]].seasonal_mcp.fall) / 4
                )
                labels5.push(labels[i])
                colors5.push(colors[i])
            }
        }
        const datasets5 = [{
            data: x,
            
            type: 'bar',
                    backgroundColor: colors5,
                    datalabels:{
                        display: true,
                        formatter: function(value, context) {
                            return Math.round(value*100)/100
                        },
                        display: true,
                        anchor: "end",
                        align: 'end',
                        offset:-5
                    },
                    barPercentage: 0.5
        }]
        const multiaxisData4 ={labels:labels5, datasets:datasets5}
        let multiAxisOptions4 = {
            maintainAspectRatio: false,
            aspectRatio: .8,
            plugins: {
                title: {
                    display: true,
                    text: 'Yearly MCP Comparison',
                    font:{size:16},
                },
                legend: {
                    display:false,
                    labels: {
                        color: '#495057'
                    }
                },
                tooltip: {
                    enabled: true
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    },
                    title: {
                        font:{size:14},
                        display: true,
                        text: "Scenario",
                      },
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    ticks: {
                        min: 0,
                        max: 100,
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    },
                    title: {
                        font:{size:14},
                        display: true,
                        text: "MCP (EURO/MWh)",
                      },
                },

            }
        };
        setComparisonPage(
            <div>
                <div className="card">
                    <Bar type="bar" data={stackedData1} options={stackedOptions} width="100%" height="800"/>
                </div>
                <br></br><br></br>
                <div className="card">
                    <Bar type="bar" data={multiaxisData1} options={multiAxisOptions1} width="100%" height="800"/>
                </div>
                <br></br><br></br>
                {datasets5[0].data.length >= 2 && <div className="card">
                    <Bar type="bar" data={multiaxisData4} options={multiAxisOptions4} width="100%" height="800"/>
                </div>} {datasets3.length >= 2 && <div><br></br><br></br></div>}
                {datasets3.length >= 2 && <div className="card">
                    <Bar type="bar" data={multiaxisData2} options={multiAxisOptions2} width="100%" height="800"/>
                </div>} {datasets3.length >= 2 && <div><br></br><br></br></div>}
                {datasets4.length >= 2 && <div className="card">
                    <Bar type="bar" data={multiaxisData3} options={multiAxisOptions3} width="100%" height="800"/>
                </div>}
            </div> 
        )
        setVisible(true)
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
    const showResult = async (data) => {
        //console.log(data);
        if(data.processStatus !== "CONVERGENCE_ERROR" && data.processType !== "Network_Simulation"){
            history.push({pathname:"/MarketSimulationResults/"+data.id})
        }
        else if(data.processStatus !== "CONVERGENCE_ERROR" && data.processType === "Network_Simulation"){
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
    const compareBodyTemplate = () => {
        return (
            <React.Fragment>
               <Button label="Compare" disabled={selected == null || selected.length < 2} style={{width:"9rem"}} className="p-button-warning" onClick={() => compareResults({selected})}/>
            </React.Fragment>
        );
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

    const isRowSelectable = (event) => {
        const data = event.data
        return (data.processStatus === "PROCESS_START" || data.processStatus === "CONVERGENCE_ERROR" || data.processType ==="Network_Simulation") ? false : true
    }
    const rowClassName = (data) => {
        return data.processStatus === "PROCESS_START" ? 'p-disabled': ''
    }
    return (
        <div>
            <div className="card" style={{height:"85vh"}}>
                <DataTable header={header} scrollable scrollDirection='vertical' scrollHeight="flex" value={values} responsiveLayout="scroll" loading={loading}
                className="datatable-responsive"
                globalFilter={globalFilter}
                emptyMessage="No result found."
                sortField="id" sortOrder={-1}
                dataKey="id"
                selection={selected}
                isDataSelectable = {isRowSelectable}
                rowClassName={rowClassName}
                onSelectionChange={(e) => setSelected(e.value)}>
                    <Column selectionMode="multiple" style={{flex:'0 0 5%', overflow:"auto"}} exportable={false}></Column>
                    <Column field="id" sortable header="ID" style={{flex:'0 0 8%', overflow:"auto"}}></Column>
                    <Column field="userName" sortable header="User" style={{flex:'0 0 15%', overflow:"auto"}}></Column>
                    <Column field="processname" sortable header="Process Name" style={{flex:'0 0 20%', overflow:"auto"}}></Column>
                    <Column field="processStatus" sortable header="Process Status" style={{flex:'0 0 15%', overflow:"auto"}}></Column>
                    <Column field="createDate" header="Process Start" style={{flex:'0 0 12%', overflow:"auto"}}></Column>
                    <Column field="updateDate" header="Process End" style={{flex:'0 0 12%', overflow:"auto"}}></Column>
                    <Column header= {compareBodyTemplate} body={actionBodyTemplate} style={{flex:'0 0 13%', overflow:"auto"}} exportable={false}></Column>
                </DataTable>
            </div>
            <Dialog header="Result Comparison" visible={visible} style={{width:"50%",height:"80%"}} modal onHide={HideDialog}>
                {ComparisonPage}
            </Dialog>
        </div>
    );
}


export default MarketSimulationList;