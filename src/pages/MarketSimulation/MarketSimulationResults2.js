import React, { useEffect, useState, useRef } from "react";
import { Panel } from "primereact/panel";
import { Divider } from "primereact/divider";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Chart } from "primereact/chart";
import { useParams } from "react-router-dom";
import { ProcessService } from "../../service/ProcessService";
import { MarketSimulationService } from "../../service/MarketSimulation/MarketSimulationService";
import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';
import { BaseYearService } from "../../service/BaseYearService";

  const label_dic = {
    natural_gas: "Natural Gas",
    hydro_dam: "Hydro Dam",
    imported_coal: "Imported Coal",
    wind_onshore: "Wind Onshore",
    lignite: "Lignite",
    solar_pv: "Solar PV",
    nuclear: "Nuclear",
    geothermal: "Geothermal",
    biomass: "Biomass",
    hydro_ror: "Hydro RoR",
    local_coal: "Local Coal"
  }

  const color_dic = {
    natural_gas: "#CC66FF",
    hydro_dam: "#6699FF",
    imported_coal: "#000000",
    wind_onshore: "#009900",
    lignite: "#A6A6A6",
    solar_pv: "#FFC000",
    nuclear: "#FF0000",
    geothermal: "#990099",
    biomass: "#F4B183",
    hydro_ror: "#33CCFF",
    local_coal: "#767171"
    }

const MarketSimulationResults = (props) => {
  const processService = new ProcessService();
  let { id } = useParams();
  const [baseYear, setBaseYear] = useState('');
  const [analysisInput, setAnalysisInput] = useState('');
  const [document,setDocument] =useState(null);
  const [process_type,setProcess_type] =useState();
  const [process_id,setProcess_id] =useState();
  const [annual_generation_data,setAnnualGenerationData] =useState();
  const [capacity_factor_data,setCapacityFactorData] =useState();
  const [MCP_monthly_data,setMCPMonthlyData] =useState();
  const [MCP_seasonal_data,setMCPSeasonalData] =useState();
  const [C1label1,setC1label1]=useState();
  const [C2label1,setC2label1]=useState();
  const [C1color,setC1color]=useState();
  const [C2color,setC2color]=useState();
  const toastBR = useRef(null);
  const marketSimulationService = new MarketSimulationService()
  const baseYearService = new BaseYearService()
  useEffect(() => {
    const loadData = async () => {
      
      const res = await processService.getProcessById(id);
      if (res.success) {
        setProcess_id(res.object.processId)
        const base_year_id = res.object.marketSimulationInput[0].base_year_id
        const res2 = await baseYearService.getAll()
        if (res.success) {
          for(var i=0;i<res2.object.length;i++){
            if (res2.object[i].id == res.object.marketSimulationInput[0].base_year_id)
              setBaseYear(res2.object[i].base_year)          
          }

          baseYearService.getGenerationFleet(base_year_id).then(res3=>{
            if (res3.success) {

              if(res.object.marketSimulationInput[0].fleet){
                const analysisInput = {"natural_gas": res3.object['natural_gas'],
                "lignite": res3.object['lignite'],
                "biomass": res3.object['biomass'],
                "geothermal": res3.object['geothermal'],
                "hydro_dam": res3.object['hydro_dam'],
                "hydro_ror": res3.object['hydro_ror'],
                "imported_coal": res3.object['imported_coal'],
                "local_coal": res3.object['local_coal'],
                "nuclear": res3.object['nuclear'],
                "other": res3.object['other'],
                "solar_pv": res3.object['solar_pv'],
                "wind_onshore": res3.object['wind_onshore'],
              }
                
                  setAnalysisInput(analysisInput)
              }else{
                const analysisInput = {
                  "natural_gas": res.object.marketSimulationInput[0].natural_gas,
                  "lignite": res.object.marketSimulationInput[0].coal_lignite,
                  "biomass": res3.object['biomass'],
                  "geothermal": res3.object['geothermal'],
                  "hydro_dam": res.object.marketSimulationInput[0].hydro_dam,
                  "hydro_ror": res3.object['hydro_ror'],
                  "imported_coal": res.object.marketSimulationInput[0].coal_imported,
                  "local_coal": res.object.marketSimulationInput[0].coal_local,
                  "nuclear": res3.object['nuclear'],
                  "other": res3.object['other'],
                  "solar_pv": res.object.marketSimulationInput[0].renewable_solar,
                  "wind_onshore": res.object.marketSimulationInput[0].renewable_wind_on,
                                    }
              setAnalysisInput(analysisInput)
              }
            }
          })
        }

        setProcess_type(res.object.processType)
        if (res.object.processType === "MS_Optimization" || res.object.processType === "MS_ML_Based" || res.object.processType === "MS_Optimization_MCP_Estimation" || res.object.processType === "MS_ML_Based_MCP_Estimation"){
          delete res.object.marketSimulationAnnualGenerationResults[0]['other']
          delete res.object.marketSimulationAnnualGenerationResults[0]['wind_offshore']
          const chart1_keys = Object.keys(res.object.marketSimulationAnnualGenerationResults[0])
          const values = Object.values(res.object.marketSimulationAnnualGenerationResults[0])
          var updated_values = values;
          var test_with_index = [];
          for (i=0; i<updated_values.length; i++) {
              test_with_index.push([updated_values[i], i]);
          }
          test_with_index.sort(function(left, right) {
            return left[0] > right[0] ? -1 : 1;
          });
          var indexes = [];
          updated_values = [];
          for (var j=0; j<test_with_index.length; j++) {
            updated_values.push(test_with_index[j][0]);
              indexes.push(Number(test_with_index[j][1]));
          }
          var updated_keys = [];
          for(i=0; i<indexes.length; i++){
            updated_keys.push(label_dic[chart1_keys[indexes[i]]])
          }
          var colors1 = [];
          for (i=0; i<indexes.length; i++){
            colors1.push(color_dic[chart1_keys[indexes[i]]])
          }
          setAnnualGenerationData(updated_values)
          setC1label1(updated_keys)
          setC1color(colors1)
          delete res.object.marketSimulationCapacityFactorResults[0]['other']
          delete res.object.marketSimulationCapacityFactorResults[0]['wind_offshore']
          const chart2_keys = Object.keys(res.object.marketSimulationCapacityFactorResults[0])
          const values2 = Object.values(res.object.marketSimulationCapacityFactorResults[0])
          updated_values = values2;
          test_with_index = [];
          for (i=0; i<updated_values.length; i++) {
              test_with_index.push([updated_values[i], i]);
          }
          test_with_index.sort(function(left, right) {
            return left[0] > right[0] ? -1 : 1;
          });
          indexes = [];
          updated_values = [];
          for (j=0; j<test_with_index.length; j++) {
            updated_values.push(test_with_index[j][0]);
              indexes.push(Number(test_with_index[j][1]));
          }
          updated_keys = [];
          for(i=0; i<indexes.length; i++){
            updated_keys.push(label_dic[chart2_keys[indexes[i]]])
          }
          var colors2 = [];
          for (i=0; i<indexes.length; i++){
            colors2.push(color_dic[chart2_keys[indexes[i]]])
          }
          setC2color(colors2)
          setCapacityFactorData(updated_values)
          setC2label1(updated_keys)
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
    
    ylabeltext1 = "Annual Generation (TWh)"
    ylabeltext2 = "Capacity Factor (%)"
  }else if(process_type === "MCP_Estimation"){
    data1 = MCP_seasonal_data
    data2 = MCP_monthly_data
    dataset1label = "Market Clearing Price - Seasonal Estimation"
    dataset2label = "Market Clearing Price - Monthly Estimation"
    ylabeltext1 = "MCP (EUR/MWh)"
    ylabeltext2 = "MCP (EUR/MWh)"              
  }else{
    data1 = annual_generation_data
    data2 = capacity_factor_data
    dataset1label = "Annual Generation in Technological Breakdown"
    dataset2label = "Annual Capacity Factors in Technological Breakdown"
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
  const chart1 = {labels: C1label1,
  datasets: [
      {
          label: dataset1label,
          backgroundColor: C1color,
          data: data1,
          datalabels:{
            display: false
          },
      }
  ]}

  const chart2 = {labels: C2label1,
  datasets: [
      {
          label: dataset2label,
          backgroundColor: C2color,
          data: data2,
          datalabels:{
            display: false
          },
      }
  ]}

  const chart3 = {labels: label3,
    datasets: [
        {
            label: dataset3label,
            backgroundColor: ['#ED7D31'],
            data: data3,
            datalabels:{
              display: false
            },
        }
    ]}

  const chart4 = {labels: label4,
    datasets: [
        {
            label: dataset4label,
            backgroundColor: ['#42A5F5'],
            data: data4,
            datalabels:{
              display: false
            },
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
    labels:{
      render: "value",
    },
    tooltip:{
      enabled: true
    }
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
    <Panel style={{fontSize:"20px"}}>
       <Toast ref={toastBR} position="top-right" />
       <Accordion>
          <AccordionTab header={headertext} style={{fontSize:"20px"}}>
              <p style={{fontSize:"18px"}}>Year = {baseYear}</p>
              <p style={{fontSize:"18px"}}>Fleet (MW) = Natural Gas: {analysisInput.natural_gas}; Hydro Dam: {analysisInput.hydro_dam}; Hydro RoR: {analysisInput.hydro_ror}; Imported Coal: {analysisInput.imported_coal}; Local Coal: {analysisInput.local_coal}; Lignite: {analysisInput.lignite}; Wind Onshore: {analysisInput.wind_onshore}; Solar PV: {analysisInput.solar_pv}; Geothermal: {analysisInput.geothermal}; Biomass: {analysisInput.biomass}; Nuclear: {analysisInput.nuclear}</p>
          </AccordionTab>
        </Accordion>
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
