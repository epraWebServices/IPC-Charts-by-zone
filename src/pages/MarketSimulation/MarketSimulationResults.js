import React, { useEffect, useState, useRef } from "react";
import { Panel } from "primereact/panel";
import { Divider } from "primereact/divider";

import { Chart } from "primereact/chart";
import { useParams } from "react-router-dom";
import { ProcessService } from "../../service/ProcessService";
import { MarketSimulationService } from "../../service/MarketSimulation/MarketSimulationService";
import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';

const MarketSimulationResults = (props) => {
  const processService = new ProcessService();
  let { id } = useParams();
  const [document,setDocument] =useState(null);
  const [process_type,setProcess_type] =useState();
  const [process_id,setProcess_id] =useState();
  const [annual_generation_data,setAnnualGenerationData] =useState();
  const [capacity_factor_data,setCapacityFactorData] =useState();
  const [MCP_monthly_data,setMCPMonthlyData] =useState();
  const [MCP_seasonal_data,setMCPSeasonalData] =useState();
  const toastBR = useRef(null);
  const marketSimulationService = new MarketSimulationService()
  useEffect(() => {
    const loadData = async () => {
      
      const res = await processService.getProcessById(id);
      if (res.success) {
        setProcess_id(res.object.processId)
        setProcess_type(res.object.processType)
        if (res.object.processType === "MS_Optimization" || res.object.processType === "MS_ML_Based" || res.object.processType === "MS_Optimization_MCP_Estimation" || res.object.processType === "MS_ML_Based_MCP_Estimation"){

          setAnnualGenerationData([
            res.object.marketSimulationAnnualGenerationResults[0].natural_gas, 
            res.object.marketSimulationAnnualGenerationResults[0].hydro_dam,
            res.object.marketSimulationAnnualGenerationResults[0].lignite,
            res.object.marketSimulationAnnualGenerationResults[0].imported_coal,
            res.object.marketSimulationAnnualGenerationResults[0].wind_onshore,
            res.object.marketSimulationAnnualGenerationResults[0].hydro_ror,
            res.object.marketSimulationAnnualGenerationResults[0].solar_pv,
            res.object.marketSimulationAnnualGenerationResults[0].geothermal,
            res.object.marketSimulationAnnualGenerationResults[0].other,
            res.object.marketSimulationAnnualGenerationResults[0].biomass,
            res.object.marketSimulationAnnualGenerationResults[0].local_coal,
            res.object.marketSimulationAnnualGenerationResults[0].wind_offshore,
            res.object.marketSimulationAnnualGenerationResults[0].nuclear
          ])

          setCapacityFactorData([
            res.object.marketSimulationCapacityFactorResults[0].natural_gas, 
            res.object.marketSimulationCapacityFactorResults[0].hydro_dam,
            res.object.marketSimulationCapacityFactorResults[0].lignite,
            res.object.marketSimulationCapacityFactorResults[0].imported_coal,
            res.object.marketSimulationCapacityFactorResults[0].wind_onshore,
            res.object.marketSimulationCapacityFactorResults[0].hydro_ror,
            res.object.marketSimulationCapacityFactorResults[0].solar_pv,
            res.object.marketSimulationCapacityFactorResults[0].geothermal,
            res.object.marketSimulationCapacityFactorResults[0].other,
            res.object.marketSimulationCapacityFactorResults[0].biomass,
            res.object.marketSimulationCapacityFactorResults[0].local_coal,
            res.object.marketSimulationCapacityFactorResults[0].wind_offshore,
            res.object.marketSimulationCapacityFactorResults[0].nuclear
          ])
          
        }
        if (res.object.processType === "MCP_Estimation" || res.object.processType === "MS_Optimization_MCP_Estimation" || res.object.processType === "MS_ML_Based_MCP_Estimation"){

          setMCPMonthlyData([
            res.object.mcpMonthlyEstimationResults[0].january, 
            res.object.mcpMonthlyEstimationResults[0].february,
            res.object.mcpMonthlyEstimationResults[0].march,
            res.object.mcpMonthlyEstimationResults[0].april,
            res.object.mcpMonthlyEstimationResults[0].may,
            res.object.mcpMonthlyEstimationResults[0].june,
            res.object.mcpMonthlyEstimationResults[0].july,
            res.object.mcpMonthlyEstimationResults[0].august,
            res.object.mcpMonthlyEstimationResults[0].september,
            res.object.mcpMonthlyEstimationResults[0].october,
            res.object.mcpMonthlyEstimationResults[0].november,
            res.object.mcpMonthlyEstimationResults[0].december,
          ])
          
          setMCPSeasonalData([
            res.object.mcpSeasonalEstimationResults[0].winter, 
            res.object.mcpSeasonalEstimationResults[0].spring,
            res.object.mcpSeasonalEstimationResults[0].summer,
            res.object.mcpSeasonalEstimationResults[0].fall,
          ])
        }
        
        const documentList = res.object.documentList;
        if(documentList){
            const documentData = documentList[0];
            setDocument(documentData)
        }
      
      } else {
        alert("Bu hata oluştu, admin ile iletişime geçiniz : "+res.message)
      }
    };

    loadData();
  }, [id]);
  
  const getDocument = async () => {
 
    // console.log(document)
     if(document && document.documentId)
     {
       window.open("http://emsp.epra.com.tr:8282/api/document/download/"+document.documentId);
     }
     else{
       alert("Document could not found! Please contact the admin.")
     }
 
   } 
  
  let label1 = []
  let label2 = []
  let label3 = []
  let label4 = []
  let data1 = []
  let data2 = []
  let data3 = []
  let data4 = []
  let dataset1label = ''
  let dataset2label = ''
  let dataset3label = ''
  let dataset4label = ''
  let ylabeltext1 = ''
  let ylabeltext2 = ''
  let ylabeltext3 = ''
  let ylabeltext4 = ''
  if (process_type === "MS_Optimization" || process_type === "MS_ML_Based"){
    data1 = annual_generation_data
    data2 = capacity_factor_data
    dataset1label = "Annual Generation in Technological Breakdown"
    dataset2label = "Annual Capacity Factors in Technological Breakdown"
    label1 = ['Natural Gas','Hydro Dam','Lignite','Imported Coal','Wind Onshore','Hydro RoR','Solar PV','Geothermal','Other','Biomass','Local Coal','Wind Offshore','Nuclear']
    label2 = ['Natural Gas','Hydro Dam','Lignite','Imported Coal','Wind Onshore','Hydro RoR','Solar PV','Geothermal','Other','Biomass','Local Coal','Wind Offshore','Nuclear']
    ylabeltext1 = "Annual Generation (TWh)"
    ylabeltext2 = "Capacity Factor (%)"
  }else if(process_type === "MCP_Estimation"){
    data1 = MCP_seasonal_data
    data2 = MCP_monthly_data
    dataset1label = "Market Clearing Price - Seasonal Estimation"
    dataset2label = "Market Clearing Price - Monthly Estimation"
    label1 = ['Winter', 'Spring', 'Summer', 'Fall']
    label2 = ['January','February','March','April','May','June','July','August','September','October','November','December']  
    ylabeltext1 = "MCP (EUR/MWh)"
    ylabeltext2 = "MCP (EUR/MWh)"              
  }else{
    data1 = annual_generation_data
    data2 = capacity_factor_data
    dataset1label = "Annual Generation in Technological Breakdown"
    dataset2label = "Annual Capacity Factors in Technological Breakdown"
    label1 = ['Natural Gas','Hydro Dam','Lignite','Imported Coal','Wind Onshore','Hydro RoR','Solar PV','Geothermal','Other','Biomass','Local Coal','Wind Offshore','Nuclear']
    label2 = ['Natural Gas','Hydro Dam','Lignite','Imported Coal','Wind Onshore','Hydro RoR','Solar PV','Geothermal','Other','Biomass','Local Coal','Wind Offshore','Nuclear']
    ylabeltext1 = "Annual Generation (TWh)"
    ylabeltext2 = "Capacity Factor (%)"
    data3 = MCP_seasonal_data
    data4 = MCP_monthly_data
    dataset3label = "Market Clearing Price - Seasonal Estimation"
    dataset4label = "Market Clearing Price - Monthly Estimation"
    label3 = ['Winter', 'Spring', 'Summer', 'Fall']
    label4 = ['January','February','March','April','May','June','July','August','September','October','November','December']  
    ylabeltext3 = "MCP (EUR/MWh)"
    ylabeltext4 = "MCP (EUR/MWh)"

  }
  const chart1 = {labels: label1,
  datasets: [
      {
          label: dataset1label,
          backgroundColor: '#ED7D31',
          data: data1
      }
  ]}

  const chart2 = {labels: label2,
  datasets: [
      {
          label: dataset2label,
          backgroundColor: '#42A5F5',
          data: data2
      }
  ]}

  const chart3 = {labels: label3,
    datasets: [
        {
            label: dataset3label,
            backgroundColor: '#ED7D31',
            data: data3
        }
    ]}

  const chart4 = {labels: label4,
    datasets: [
        {
            label: dataset4label,
            backgroundColor: '#42A5F5',
            data: data4
        }
    ]}

  const basicOptions = {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      title: {
        display: true,
        text: 'Annual Generation in Technological Breakdown',
        font:{size:18},
    },
      legend: {
        display: false,
        labels: {
          font:{size:15},
          color: "#495057",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#495057",
        },
        grid: {
          color: "#ebedef",
        },
      },
      y: {
        ticks: {
          color: "#495057",
        },
        grid: {
          color: "#ebedef",
        },
        title: {
          font:{size:14},
          display: true,
          text: ylabeltext1,
        },
      },
    },
  };

  const basicOptions2 = {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      title: {
        display: true,
        text: 'Annual Capacity Factors in Technological Breakdown',
        font:{size:18},
    },
      legend: {
        display: false,
        labels: {
          font:{size:15},
          color: "#495057",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#495057",
        },
        grid: {
          color: "#ebedef",
        },
      },
      y: {
        ticks: {
          color: "#495057",
        },
        grid: {
          color: "#ebedef",
        },
        title: {
          font:{size:14},
          display: true,
          text: ylabeltext2,
        },
      },
    },
  };

  const basicOptions3 = {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      title: {
        display: true,
        text: 'Market Clearing Price - Seasonal Estimation',
        font:{size:18},
    },
      legend: {
        display: false,
        labels: {
          font:{size:15},
          color: "#495057",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#495057",
        },
        grid: {
          color: "#ebedef",
        },
      },
      y: {
        ticks: {
          color: "#495057",
        },
        grid: {
          color: "#ebedef",
        },
        title: {
          font:{size:14},
          display: true,
          text: ylabeltext3,
        },
      },
    },
  };

  const basicOptions4 = {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      title: {
        display: true,
        text: 'Market Clearing Price - Monthly Estimation',
        font:{size:18},
    },
      legend: {
        display: false,
        labels: {
          font:{size:15},
          color: "#495057",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#495057",
        },
        grid: {
          color: "#ebedef",
        },
      },
      y: {
        ticks: {
          color: "#495057",
        },
        grid: {
          color: "#ebedef",
        },
        title: {
          font:{size:14},
          display: true,
          text: ylabeltext4,
        },
      },
    },
  };
  
  const mcp_estimation = async () => {
    
    const data = {
        mcp_estimation_process_id : process_id,
        }

    const response = await marketSimulationService.mcp_estimation(data);

    if (response.success) {
        toastBR.current.show({ severity: 'success', summary: 'Your request has been received. You will be informed via e-mail after the process completed.', detail: 'Success', life: 10000 });
    }
    else {
        toastBR.current.show({ severity: 'error', summary: 'Error Message', detail: response.message, life: 10000 });
    }

}

  
  let headertext = "";
  if(process_type === 'MS_Optimization')
  headertext = 'Market Simulation (Optimization)'
  else if(process_type === 'MS_ML_Based')
  headertext = 'Market Simulation (Machine Learning Based)'
  else if(process_type === 'MS_Optimization_MCP_Estimation')
  headertext = 'Market Simulation (Optimization) & MCP Estimation'
  else if(process_type === 'MS_ML_Based_MCP_Estimation')
  headertext = 'Market Simulation (Machine Learning Based) & MCP Estimation'
  return (
    <Panel header={headertext} style={{fontSize:"20px"}}>
       <Toast ref={toastBR} position="top-right" />
      <div className="grid">
        <div className="col-5 flex align-items-center justify-content-center">
          <Chart
            width="100%"
            height="400"
            type="bar"
            options={basicOptions}
            data = {chart1}
          />
        </div>
        <div className="col-1">
          <Divider layout="vertical"/>
        </div>
        <div className="col-5 flex align-items-center justify-content-center">
          <Chart
            width="100%"
            height="400"
            type="bar"
            options={basicOptions2}
            data = {chart2}
          />
        </div>
      </div>
      <div><br></br></div>
      
      {(process_type === "MS_Optimization_MCP_Estimation" || process_type === "MS_ML_Based_MCP_Estimation") &&
        <div className="grid">
          <Divider></Divider>
          <div className="col-5 flex align-items-center justify-content-center">
            <Chart
              width="100%"
              height="400"
              type="bar"
              options={basicOptions3}
              data = {chart3}
            />
            </div>
            <div className="col-1">
          <Divider layout="vertical"/>
        </div>
        <div className="col-5 flex align-items-center justify-content-center">
          <Chart
            width="100%"
            height="400"
            type="bar"
            options={basicOptions4}
            data = {chart4}
          />
        </div>
        </div>}
      <div><br></br></div>
      <Divider align="right">   
      {(process_type === "MS_Optimization" || process_type === "MS_ML_Based") && < Button
          style={{color:"white"}}
          label="MCP Estimation"
          icon="pi pi-search"
          className="p-button-outlined"
          onClick={mcp_estimation} > 
        </Button>
        }
        <Button 
          style={{color:"white"}}
          label="Export the Results"
          icon="pi pi-download"
          className="p-button-outlined"
          onClick={getDocument}>
        </Button>
        </Divider>
    </Panel>
  );
};

export default MarketSimulationResults;
