import React, { useEffect, useState, useRef } from "react";
import { Panel } from "primereact/panel";
import { Divider } from 'primereact/divider';
import { Divider as DivAntd } from 'antd';
import { Accordion, AccordionTab } from 'primereact/accordion';
import {
  Chart,
  registerables
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";
import { useParams } from "react-router-dom";
import { ProcessService } from "../../service/ProcessService";
import { MarketSimulationService } from "../../service/MarketSimulation/MarketSimulationService";
import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';
import { BaseYearService } from "../../service/BaseYearService";
import annotationPlugin from "chartjs-plugin-annotation";
import ReactApexCharts from "react-apexcharts";
import { apiPath } from "../../environments/ApiPath";
var summary = require('summary');
Chart.register(...registerables);
Chart.register(ChartDataLabels);
Chart.register(annotationPlugin);
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
  const [boxplotData1, setboxplotData1] = useState();
  const [boxplotData2, setboxplotData2] = useState();
  const [options, setoptions] = useState();
  const toastBR = useRef(null);
  const [weekly, setIsWeekly] = useState(true)
  const marketSimulationService = new MarketSimulationService()
  const baseYearService = new BaseYearService()
  useEffect(() => {
    
    const loadData = async () => {
      
      const res = await processService.getProcessById(id);
  
      if (res.success) {
        setIsWeekly(res.object.marketSimulationInput[0].startweek !== null ? true : false)
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
                "entsoe": res3.object['entsoe'],
                "georgia": res3.object['georgia']
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
                  "nuclear": res.object.marketSimulationInput[0].nuclear,
                  "other": res3.object['other'],
                  "solar_pv": res.object.marketSimulationInput[0].renewable_solar,
                  "wind_onshore": res.object.marketSimulationInput[0].renewable_wind_on,
                  "entsoe": res.object.marketSimulationInput[0].entsoe,
                  "georgia": res.object.marketSimulationInput[0].georgia,
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
          data3_s = summary([
            res.object.mcpSeasonalEstimationResults[0].winter, 
            res.object.mcpSeasonalEstimationResults[0].spring,
            res.object.mcpSeasonalEstimationResults[0].summer,
            res.object.mcpSeasonalEstimationResults[0].fall,
          ])
          data4_s = summary([
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
          setboxplotData1([
            {
              type: "boxPlot",
              data: [
                {
                  x: "Seasonal MCP",
                  y: data3_s ? [data3_s.min().toFixed(2), data3_s.quartile(0.25).toFixed(2), data3_s.median().toFixed(2), data3_s.quartile(0.75).toFixed(2), data3_s.max().toFixed(2)]: [0,0,0,0,0]
                }
              ]
            }
          ])
          setboxplotData2([
            {
              type: "boxPlot",
              data: [
                {
                  x: "Monthly MCP",
                  y: data4_s ? [data4_s.min().toFixed(2), data4_s.quartile(0.25).toFixed(2), data4_s.median().toFixed(2), data4_s.quartile(0.75).toFixed(2), data4_s.max().toFixed(2)]: [0,0,0,0,0]
                }
              ]
            }
          ])
          setoptions({
            chart: {
              type: "boxPlot",
              toolbar:{
                show: false
              },
              zoom:{
                enabled: false
              },
            },

            yaxis:{
              title:{
                text:"MCP (EUR/MWh)",
                style: {
                  color: undefined,
                  fontSize: '13px',
                  fontFamily: 'Segoe SD',
                  fontWeight: 500,
              },
              }
            },
            plotOptions: {
              boxPlot: {
                colors: {
                  upper: "rgba(0,0,255,0.5)",
                  lower: "rgba(255,0,0,0.5)"
                }
              }
            }
          })
        }
        
        const documentList = res.object.documentList;
        if(documentList){
            const documentData = documentList[0];
            setDocument(documentData)
        }
      
      } else {
        alert("Bu hata oluştu, admin ile iletişime geçiniz : "+res.message)
        //console.log(res.message);
      }
    };

 
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
          data: data1
      }
  ]}

  const chart2 = {labels: C2label1,
  datasets: [
      {
          label: dataset2label,
          backgroundColor: C2color,
          data: data2
      }
  ]}
  const chart3 = {labels: label3,
    datasets: [
      {
        type: "bar",
        backgroundColor: ['#ED7D31'],
        data: data3,
        datalabels:{
          display: true
        },
        barPercentage: 0.5
      } 
    ]}

  const chart4 = {labels: label4,
    datasets: [
      {
        label: dataset4label,
        backgroundColor: ['#42A5F5'],
        data: data4,
        datalabels:{
          display: true
        }
      }
    ]}
    function sum(ctx) {
      const values = ctx.chart.data.datasets[0].data;
      return values.reduce((a, b) => a + b, 0);
    }
    function max(ctx) {
      const values = ctx.chart.data.datasets[0].data;
      return values.reduce((a, b) => Math.max(a, b), -Infinity);
    }
    const annotation7 = {
      type: 'box',
      backgroundColor: 'rgba(255, 99, 132, 0.25)',
      xMin: 8,
      xMax: 10.2,
      yMin: (ctx) => (max(ctx)),
      yMax: (ctx) => (max(ctx))*0.8,
      label:{
        display: true,
        content: (ctx) => ["Total Generation", sum(ctx).toFixed(2) + ' TWh'],
        position: "center",
        textAlign: "center"
      }
    }
  const basicOptions = {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      datalabels: {
        formatter: function(value, context) {
          return Math.round(value*100)/100
        },
        anchor: 'end',
        align: 'end',
        offset: -5
      },
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
    tooltip:{
      enabled: false
    },
    annotation:{
      clip: false,
      drawTime: 'afterDatasetsDraw',
      annotations:{
        annotation7
      }
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
      datalabels: {
        formatter: function(value, context) {
          return Math.round(value*100)/100
        },
        anchor: 'end',
        align: 'end',
        offset: -5
      },
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
    tooltip:{
      enabled: false
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
          text: ylabeltext2,
        },
      },
    },
  };

  function average(ctx) {
    const values = ctx.chart.data.datasets[0].data;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }
  function standardDeviation(ctx) {
    const values = ctx.chart.data.datasets[0].data;
    const n = values.length;
    const mean = average(ctx);
    return Math.sqrt(values.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
  }
  const annotation1 = {
    type: 'line',
    borderColor: 'green',
    borderDash: [6, 12],
    borderDashOffset: 0,
    borderWidth: 3,
    
    label: {
      display: true,
      position:'end',
      xAdjust: 80,
      backgroundColor: 'green',
      content: (ctx) => 'Mean: ' + average(ctx).toFixed(2),
    },
    scaleID: 'y',
    value: (ctx) => average(ctx),
  };
  
  const annotation2 = {
    type: 'line',
    borderColor: 'rgba(102,102,102,1)',
    borderDash: [6, 12],
    borderDashOffset: 0,
    borderWidth: 3,
    label: {
      display: true,
      backgroundColor: 'rgba(102,102,102,1)',
      content: (ctx) => (average(ctx) + standardDeviation(ctx)).toFixed(2),
      position: 'end',
      xAdjust: 42,
    },
    scaleID: 'y',
    value: (ctx) => average(ctx) + standardDeviation(ctx)
  };
  const annotation3 = {
    type: 'line',
    borderColor: 'rgba(102,102,102,1)',
    borderDash: [6, 12],
    borderDashOffset: 0,
    borderWidth: 3,
    label: {
      display: true,
      backgroundColor: 'rgba(102,102,102,1)',
      content: (ctx) => (average(ctx) - standardDeviation(ctx)).toFixed(2),
      position: 'end',
      xAdjust: 42,
    },
    scaleID: 'y',
    value: (ctx) => average(ctx) - standardDeviation(ctx)
  };
  const annotation4 = {
    type: 'label',
    yValue: (ctx) => (average(ctx)),
    backgroundColor: 'rgba(245,245,245)',
    content: (ctx) => 'Average: '  + average(ctx).toFixed(2) + " EUR/MWh",
    font: {
      size: 12
    },
    xAdjust : 210,
};
const annotation5 ={
  type: 'box',
  xScaleID: 'x',
  yScaleID: 'y',
  yMin: (ctx) => average(ctx),
  backgroundColor: 'rgba(200, 200, 200, 0.6)',
  borderColor: '#ccc',
}
const annotation6 ={
  type: 'box',
  xScaleID: 'x',
  yScaleID: 'y',
  yMax: (ctx) => average(ctx),
  backgroundColor: 'rgba(255, 99, 132, 0.25)',
  borderColor: '#ccc',
}

  const basicOptions3 = {
    layout:{
      padding:{
        right:75
      }
    },
    pointRadius: 0,
    pointHoverRadius: 0,
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      datalabels: {
        formatter: function(value, context) {
          return Math.round(value*100)/100
        },
        anchor: 'start',
        align: 'end',
        offset: 150
        
      },
      title: {
        display: false,
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
      
      tooltip:{
        enabled: false,
      },
      annotation: {
        clip: false,
        drawTime: 'afterDatasetsDraw',
        annotations: {
            annotation1
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: "#495057",
        },
      },
      
      y:{
        type:"linear",
        position:"left",
        title: {
          font:{size:14},
          display: true,
          text: ylabeltext3,
        },
      },
      
      
    },
  };
  const basicOptions4 = {
    layout:{
      padding:{
        right:75
      }
    },
    pointRadius: 0,
    pointHoverRadius: 0,
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      datalabels: {
        formatter: function(value, context) {
          return Math.round(value*100)/100
        },
        anchor: 'start',
        align: 'end',
        offset: 150
      },
      title: {
        display: false,
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
      tooltip:{
        enabled: false
      },
      annotation: {
        clip:false,
        annotations: {
          annotation1
        }
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
          text: ylabeltext4,
        },
      },
    },
  };
  if(data3){
    var data3_s = summary(data3)
    var data4_s = summary(data4)
  }
  //var data3_s = summary(data3)
  //[data3_s.min(), data3_s.quartile(0.25), data3_s.median(), data3_s.quartile(0.75), data3_s.max()]

  const mcp_estimation = async () => {
    
    const data = {
        mcp_estimation_process_id : process_id,
        }

    const response = await marketSimulationService.mcp_estimation(data);

    if (response.success) {
        toastBR.current.show({ severity: 'success', summary: 'Success', detail: 'Your request has been received. You will be informed via e-mail after the process completed.', life: 10000 });
    }
    else {
        toastBR.current.show({ severity: 'error', summary: 'Error', detail: response.message, life: 10000 });
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
              <p style={{fontSize:"18px"}}>Fleet (MW) = Natural Gas: {analysisInput.natural_gas}; Hydro Dam: {analysisInput.hydro_dam}; Hydro RoR: {analysisInput.hydro_ror}; Imported Coal: {analysisInput.imported_coal}; Local Coal: {analysisInput.local_coal}; Lignite: {analysisInput.lignite}; Wind Onshore: {analysisInput.wind_onshore}; Solar PV: {analysisInput.solar_pv}; Geothermal: {analysisInput.geothermal}; Biomass: {analysisInput.biomass}; Nuclear: {analysisInput.nuclear}; ENTSOE: {analysisInput.entsoe}; Georgia: {analysisInput.georgia}</p>
          </AccordionTab>
        </Accordion>
      <div className="grid" style={{paddingTop:"1rem"}}>
        <div style={{width:"48%", height:"400"}}>
          <Bar
            width="100%"
            height="400"
            type="bar"
            options={basicOptions}
            data = {chart1}
          />
        </div>
        <div>
          <DivAntd type="vertical" style={{height:"400px", backgroundColor:"#BDBDBD"}}/>
        </div>
        <div style={{width:"48%", height:"400"}}>
          <Bar
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
          <Divider></Divider><br></br>
          <div style={{width:"48%", height:"400px"}}>
            <div style={{textAlign:"center"}}>Market Clearing Price - Seasonal Estimation</div>
            <div style={{width:"75%", height:"400px", float:"left"}}>
              <Bar
                width="100%"
                height="400"
                type="bar"
                options={basicOptions3}
                data = {chart3}
              />
            </div>
            <div style={{width:"25%", height:"400px", float:"left"}}>
              {boxplotData1 && <ReactApexCharts
                  type="boxPlot"
                  width="100%"
                  height="400"
                  series={boxplotData1}
                  options={options}
                />}
            </div>
          </div>
          
        <div>
          <DivAntd type="vertical" style={{height:"400px", backgroundColor:"#BDBDBD"}}/>
        </div>
        <div style={{width:"48%", height:"400px"}}>
            <div style={{textAlign:"center"}}>Market Clearing Price - Monthly Estimation</div>
            <div style={{width:"75%", height:"400px", float:"left"}}>
              <Bar
                width="100%"
                height="400"
                type="bar"
                options={basicOptions4}
                data = {chart4}
              />
            </div>
            <div style={{width:"25%", height:"400px", float:"left"}}>
              {boxplotData2 && <ReactApexCharts
                  type="boxPlot"
                  width="100%"
                  height="400"
                  series={boxplotData2}
                  options={options}
                />}
            </div>
          </div>
          
        </div>}
      <div><br></br></div>
      
      <div>
      </div>
      <Divider align="right">   
      {(process_type === "MS_Optimization" || process_type === "MS_ML_Based") && !weekly && < Button
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
