
import React, { useState, useEffect} from 'react';

import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Divider } from 'primereact/divider';
import { Divider as DivAntd } from 'antd';
import "rsuite/dist/rsuite.css"
import "./EpiasData.css"
import { DateRangePicker } from 'rsuite';
import isAfter from 'date-fns/isAfter';
import ApexChart from 'react-apexcharts'
import { ProgressSpinner } from 'primereact/progressspinner';
const EpiasData = () => {
    const [isGenBreak, SetisGenBreak] = useState(false);
    const [isMCP, SetisMCP] = useState(false);
    const [isIDM, SetisIDM] = useState(false);
    /*
    const [isBileteral, SetisBileteral] = useState(false);
    const [isUnlicensed, SetisUnlicensed] = useState(false);
    const [isRESForecast, SetisRESForecast] = useState(false);
    */
    const [isLoadEstimation, SetisLoadEstimation] = useState(false);
    const [data_selected, SetData] = useState([]);
    const [results, SetResults] = useState()
    const [LastDate, setLastDate] = useState()
    const [type, SetType] = useState()
    const [options_genBreak, SetOptions_genBreak] = useState('')
    const [series_genBreak, SetSeries_genBreak] = useState('')
    const [options_MCP, SetOptions_MCP] = useState('')
    const [series_MCP, SetSeries_MCP] = useState('')
    const [options_IDM, SetOptions_IDM] = useState('')
    const [series_IDM, SetSeries_IDM] = useState('')
    const [isloading, Setisloading] = useState(false)
    /*
    const [options_Bileteral, SetOptions_Bileteral] = useState('')
    const [series_Bileteral, SetSeries_Bileteral] = useState('')
    const [options_Unlicensed, SetOptions_Unlicensed] = useState('')
    const [series_Unlicensed, SetSeries_Unlicensed] = useState('')
    const [options_RESForecast, SetOptions_RESForecast] = useState('')
    const [series_RESForecast, SetSeries_RESForecast] = useState('')
    */
    const [options_LoadEstimation, SetOptions_LoadEstimation] = useState('')
    const [series_LoadEstimation, SetSeries_LoadEstimation] = useState('')
    useEffect(() => {
        if(document.getElementById('Date-Range')){
            document.getElementById('Date-Range').setAttribute('autocomplete','off');
        }
        SetData(data_selected)
        SetResults(results)
        if(data_selected.code === 'generation'){
            if(typeof results!="undefined" && type === 'generation'){
                const length =Object.keys(results.date).length
                if(typeof results.last_unlicensed_date!='undefined'){
                    var last_date = results.last_unlicensed_date[0].substr(0, results.last_unlicensed_date[0].lastIndexOf(":")).replace('T', ' ')
                    if(document.getElementById("Date-Range").value.split("~")[1].substring(1) === last_date.substring(0,10)){
                      setLastDate('')
                    }else{
                      setLastDate('*There is no data from YEKDEM after ' + last_date)
                    }
                    
                }
                else{
                    setLastDate('*There is no data from YEKDEM for the selected date range')
                }
                var naturalGas = []
                var totalCoal = []
                var biomass = []
                var geothermal = []
                var dammedHydro = []
                var river = []
                var sun = []
                var wind = []
                var nucklear = []
                //var other = []
                
                if(typeof results.sun_un!="undefined"){
                    for (var i=0; i<length; i++){
                        var date = results.date[i]
                        date = setCharAt(date,25,'0')
                        
                        naturalGas.push([date,results.naturalGas[i]])
                        totalCoal.push([date, (results.lignite[i] + results.importCoal[i] + results.blackCoal[i]).toFixed(2)])
                        biomass.push([date,(results.biomass[i] + results.biomass_un[i]).toFixed(2)])
                        geothermal.push([date,results.geothermal[i]])
                        dammedHydro.push([date,results.dammedHydro[i]])
                        river.push([date,results.river[i]])
                        sun.push([date,(results.sun[i] + results.sun_un[i]).toFixed(2)])
                        wind.push([date,(results.wind[i] + results.wind_un[i]).toFixed(2)])
                        nucklear.push([date,results.nucklear[i]])
                        //other.push([date,(results.asphaltiteCoal[i] + results.fueloil[i] + results.gasOil[i] + results.importExport[i] + results.lng[i] + results.naphta[i] + results.wasteheat[i] + results.canalType_un[i] + results.others_un[i]).toFixed(2)])
    
                    }
                }
                else{
                    for (i=0; i<length; i++){
                        date = results.date[i]
                        date = setCharAt(date,25,'0')
                        
                        naturalGas.push([date,results.naturalGas[i]])
                        totalCoal.push([date, (results.lignite[i] + results.importCoal[i] + results.blackCoal[i]).toFixed(2)])
                        biomass.push([date,(results.biomass[i]).toFixed(2)])
                        geothermal.push([date,results.geothermal[i]])
                        dammedHydro.push([date,results.dammedHydro[i]])
                        river.push([date,results.river[i]])
                        sun.push([date,(results.sun[i]).toFixed(2)])
                        wind.push([date,(results.wind[i]).toFixed(2)])
                        nucklear.push([date,results.nucklear[i]])
                        //other.push([date,(results.asphaltiteCoal[i] + results.fueloil[i] + results.gasOil[i] + results.importExport[i] + results.lng[i] + results.naphta[i] + results.wasteheat[i]).toFixed(2)])
    
                    }
                }
                
                
                SetSeries_genBreak([
                    {
                        name: 'Nuclear',
                        data: nucklear,
                    },
                    {
                        name: 'Solar',
                        data: sun,
                    },
                    {
                        name: 'Wind',
                        data: wind,
                    },
                    {
                        name: 'Hydro (Dam)',
                        data: dammedHydro,
                    },
                    {
                        name: 'Hydro (RoR)',
                        data: river,
                    },
                    {
                        name: 'Geothermal',
                        data: geothermal,
                    },
                    {
                        name: 'Biomass',
                        data: biomass,
                    },
                    {
                        name: 'Total Coal',
                        data: totalCoal,
                    },
                    {
                        name: 'Natural Gas',
                        data: naturalGas,
                    },
                    /*{
                        name: 'Other',
                        data: other,
                    },*/   
                ])
                SetOptions_genBreak({
                    chart: {
                    type: 'area',
                    height: 400,
                    stacked: true,
                    toolbar: {
                      export: {
                        csv: {
                          filename: "Generation Breakdown",
                          columnDelimiter: ',',
                          headerCategory: 'Date',
                          headerValue: 'value',
                          dateFormatter (date){
                            return new Date(date).toISOString().replace('T', ' ').substring(0, 16)
                          }
                        },
                        svg: {
                          filename: "Generation Breakdown",
                        },
                        png: {
                          filename: "Generation Breakdown",
                        }
                      }
                    }
                    },
                    colors: ["#FF0000", "#FFC000", "#009900", "#6699FF", "#33CCFF", "#990099", "#F4B183", "#A6A6A6", "#CC66FF", "#000099"],
                    dataLabels: {
                    enabled: false
                    },
                    stroke: {
                    curve: 'smooth',
                    width: 2
                    },
                    fill: {
                    type: 'gradient',
                    gradient: {
                        opacityFrom: 0.8,
                        opacityTo: 1,
                    }
                    },
                    legend: {
                    position: 'bottom',
                    horizontalAlign: 'left'
                    },
                    xaxis: {
                    type: 'datetime',
                    labels: {
                        format: 'dd/MM/yyyy'
                    },
                    max: new Date(date.split('T')[0]).getTime() + 24*60*60*1000,
                    min: new Date(date.split('T')[0]).getTime()
                    },
                    yaxis: {
                        title:{
                            text:"MWh",
                            style: {
                                fontSize:  '14px',
                                fontWeight:  'normal',
                                color:  '#263238',
                                fontFamily: 'Arial'
                            },
                        },
                        min:0
                    },
                    title: {
                        text: "Generation Breakdown",
                        align: 'center',
                        margin: 10,
                        offsetX: 0,
                        offsetY: 0,
                        floating: true,
                        style: {
                        fontSize:  '20px',
                        fontWeight:  'bold',
                        fontFamily: 'Arial',
                        color:  '#263238'
                        },
                    },
                    tooltip: {
                      x: {
                        format:'dd/MM/yyyy HH:mm'
                      },
                    }
                
                })
                SetisMCP(false)
                SetisIDM(false)
                SetisLoadEstimation(false)
                SetisGenBreak(true)   
            }     
        }
        else if(data_selected.code === 'MCP'){
            if(typeof results!="undefined" && type === 'MCP'){
                var MCP_TL = []
                var MCP_USD = []
                var MCP_EURO = []
                const length =Object.keys(results.date).length
                for (i=0; i<length; i++){
                    date = results.date[i]
                    date = setCharAt(date,25,'0')
                    MCP_TL.push([date,results.price[i]])
                    MCP_USD.push([date,results.priceUsd[i]])
                    MCP_EURO.push([date,results.priceEur[i]])
                }
                SetSeries_MCP([
                    {
                        name: 'TL/MWh',
                        data: MCP_TL,
                    },
                    {
                        name: 'USD/MWh',
                        data: MCP_USD,
                    },
                    {
                        name: 'EURO/MWh',
                        data: MCP_EURO,
                    }
                  ])
                  SetOptions_MCP({
                    chart: {
                      type: 'area',
                      height: 400,
                      stacked: false,
                      toolbar: {
                        export: {
                          csv: {
                            filename: "Day Ahead Market Price (MCP)",
                            columnDelimiter: ',',
                            headerCategory: 'Date',
                            headerValue: 'value',
                            dateFormatter (date){
                              return new Date(date).toISOString().replace('T', ' ').substring(0, 16)
                            }
                          },
                          svg: {
                            filename: "Day Ahead Market Price (MCP)",
                          },
                          png: {
                            filename: "Day Ahead Market Price (MCP)",
                          }
                        }
                      }
                    },
                    colors: ["#219BFF", "#FF6621", "#51CF60"],
                    dataLabels: {
                      enabled: false
                    },
                    stroke: {
                      curve: 'smooth',
                      width: 2
                    },
                    fill: {
                      type: 'gradient',
                      gradient: {
                        opacityFrom: 0.8,
                        opacityTo: 1,
                      }
                    },
                    legend: {
                      position: 'bottom',
                      horizontalAlign: 'left'
                    },
                    xaxis: {
                      type: 'datetime',
                      labels: {
                        format: 'dd/MM/yyyy'
                      },
                    },
                    yaxis: {
                        title:{
                            text:"MCP",
                            style: {
                                fontSize:  '14px',
                                fontWeight:  'normal',
                                color:  '#263238',
                                fontFamily: 'Arial'
                              },
                        },
                      },
                    title: {
                        text: "MCP",
                        align: 'center',
                        margin: 10,
                        offsetX: 0,
                        offsetY: 0,
                        floating: true,
                        style: {
                          fontSize:  '20px',
                          fontWeight:  'bold',
                          fontFamily: 'Arial',
                          color:  '#263238'
                        },
                    },
                    tooltip: {
                      x: {
                        format:'dd/MM/yyyy HH:mm'
                      },
                    }
                    
                  })
                  
                SetisGenBreak(false)
                SetisIDM(false)
                SetisLoadEstimation(false)
                SetisMCP(true)  
            }          
        }
        else if(data_selected.code === 'IDM'){
            if(typeof results!="undefined" && type === 'IDM'){
                var IDM_TL = []
                const length =Object.keys(results.date).length
                for (i=0; i<length; i++){
                    date = results.date[i]
                    date = setCharAt(date,25,'0')
                    IDM_TL.push([date,results.price[i]])
                }
                SetSeries_IDM([
                    {
                        name: 'TL/MWh',
                        data: IDM_TL,
                    },
                  ])
                  SetOptions_IDM({
                    chart: {
                      type: 'area',
                      height: 400,
                      stacked: false,
                      toolbar: {
                        export: {
                          csv: {
                            filename: "Intraday Market Price (MCP)",
                            columnDelimiter: ',',
                            headerCategory: 'Date',
                            headerValue: 'value',
                            dateFormatter (date){
                              return new Date(date).toISOString().replace('T', ' ').substring(0, 16)
                            }
                          },
                          svg: {
                            filename: "Intraday Market Price (MCP)",
                          },
                          png: {
                            filename: "Intraday Market Price (MCP)",
                          }
                        }
                      }
                    },
                    colors: ["#219BFF"],
                    dataLabels: {
                      enabled: false
                    },
                    stroke: {
                      curve: 'smooth',
                      width: 2
                    },
                    fill: {
                      type: 'gradient',
                      gradient: {
                        opacityFrom: 0.8,
                        opacityTo: 1,
                      }
                    },
                    legend: {
                      position: 'bottom',
                      horizontalAlign: 'left'
                    },
                    xaxis: {
                      type: 'datetime',
                      labels: {
                        format: 'dd/MM/yyyy'
                      },
                      
                    },
                    yaxis: {
                        title:{
                            text:"Intraday MCP (TL/MWh)",
                            style: {
                                fontSize:  '14px',
                                fontWeight:  'normal',
                                color:  '#263238',
                                fontFamily: 'Arial'
                              },
                        },
                      },
                    title: {
                        text: "Intraday MCP",
                        align: 'center',
                        margin: 10,
                        offsetX: 0,
                        offsetY: 0,
                        floating: true,
                        style: {
                          fontSize:  '20px',
                          fontWeight:  'bold',
                          fontFamily: 'Arial',
                          color:  '#263238'
                        },
                    },
                    tooltip: {
                      x: {
                        format:'dd/MM/yyyy HH:mm'
                      },
                    }
                    
                  })
                  
                SetisGenBreak(false)
                SetisMCP(false)
                SetisLoadEstimation(false)
                SetisIDM(true)
            }
        }
        
        /*else if(data_selected.code === 'bileteral_buy'){
            if(typeof results!="undefined" && type === 'bileteral_buy'){
                var bileteral = []
                const length =Object.keys(results.date).length
                for (var i=0; i<length; i++){
                    var date = results.date[i]
                    date = setCharAt(date,25,'0')
                    bileteral.push([date,results.quantity[i]])
                }
                SetSeries_Bileteral([
                    {
                        name: 'Bid Quantity',
                        data: bileteral,
                    },
                  ])
                  SetOptions_Bileteral({
                    chart: {
                      type: 'area',
                      height: 400,
                      stacked: false,
                    },
                    colors: ["#219BFF"],
                    dataLabels: {
                      enabled: false
                    },
                    stroke: {
                      curve: 'smooth',
                      width: 2
                    },
                    fill: {
                      type: 'gradient',
                      gradient: {
                        opacityFrom: 0.8,
                        opacityTo: 1,
                      }
                    },
                    legend: {
                      position: 'bottom',
                      horizontalAlign: 'left'
                    },
                    xaxis: {
                      type: 'datetime',
                      labels: {
                        format: 'dd/MM/yyyy HH:mm'
                      },
                    },
                    yaxis: {
                        title:{
                            text:"Bid Quantity (MWh)",
                            style: {
                                fontSize:  '14px',
                                fontWeight:  'normal',
                                color:  '#263238',
                                fontFamily: 'Arial'
                              },
                        },
                      },
                    title: {
                        text: "Bileteral Buy",
                        align: 'center',
                        margin: 10,
                        offsetX: 0,
                        offsetY: 0,
                        floating: true,
                        style: {
                          fontSize:  '20px',
                          fontWeight:  'bold',
                          fontFamily: 'Arial',
                          color:  '#263238'
                        },
                    }
                    
                  })
                  
                SetisGenBreak(false)
                SetisMCP(false)
                SetisIDM(false)
                SetisUnlicensed(false)
                SetisRESForecast(false)
                SetisLoadEstimation(false)
                SetisBileteral(true)
            }
        }
        */
        /*else if(data_selected.code === 'yekdem_unlicenced'){
            if(typeof results!="undefined" && type === 'yekdem_unlicenced'){
                var biogas_un = []
                var biomass_un = []
                var canalType_un = []
                var others_un = []
                var sun_un = []
                var wind_un = []
                const length =Object.keys(results.date).length
                for (var i=0; i<length; i++){
                    var date = results.date[i]
                    date = setCharAt(date,25,'0')
                    biogas_un.push([date,results.biogas[i]])
                    biomass_un.push([date,results.biomass[i]])
                    canalType_un.push([date,results.canalType[i]])
                    others_un.push([date,results.others[i]])
                    sun_un.push([date,results.sun[i]])
                    wind_un.push([date,results.wind[i]])
                }
                SetSeries_Unlicensed([
                    {
                        name: 'Sun',
                        data: sun_un,
                    },
                    {
                        name: 'Wind',
                        data: wind_un,
                    },
                    {
                        name: 'Biomass',
                        data: biomass_un,
                    },
                    {
                        name: 'Biogas',
                        data: biogas_un,
                    },
                    {
                        name: 'Canal Type',
                        data: canalType_un,
                    },
                    {
                        name: 'Other',
                        data: others_un,
                    },
                  ])
                  SetOptions_Unlicensed({
                    chart: {
                      type: 'area',
                      height: 400,
                      stacked: true,
                    },
                    colors: ["#FFC000","#009900","#F4B183","#990099","#33CCFF","#000099"],
                    dataLabels: {
                      enabled: false
                    },
                    stroke: {
                      curve: 'smooth',
                      width: 2
                    },
                    fill: {
                      type: 'gradient',
                      gradient: {
                        opacityFrom: 0.8,
                        opacityTo: 1,
                      }
                    },
                    legend: {
                      position: 'bottom',
                      horizontalAlign: 'left'
                    },
                    xaxis: {
                      type: 'datetime',
                      labels: {
                        format: 'dd/MM/yyyy HH:mm'
                      },
                      max: new Date(date.split('T')[0]).getTime() + 24*60*60*1000,
                      min: new Date(date.split('T')[0]).getTime()
                    },
                    yaxis: {
                        title:{
                            text:"MWh",
                            style: {
                                fontSize:  '14px',
                                fontWeight:  'normal',
                                color:  '#263238',
                                fontFamily: 'Arial'
                              },
                        },
                      },
                    title: {
                        text: "Unlicensed Generetion",
                        align: 'center',
                        margin: 10,
                        offsetX: 0,
                        offsetY: 0,
                        floating: true,
                        style: {
                          fontSize:  '20px',
                          fontWeight:  'bold',
                          fontFamily: 'Arial',
                          color:  '#263238'
                        },
                    }
                    
                  })
                  
                SetisGenBreak(false)
                SetisMCP(false)
                SetisIDM(false)
                SetisBileteral(false)
                SetisRESForecast(false)
                SetisLoadEstimation(false)
                SetisUnlicensed(true)
            }
        }
        */
        /*else if(data_selected.code === 'res_forecast'){
            if(typeof results!="undefined" && type === 'res_forecast'){
                var res_forecast = []
                var res_generation = []
                const length =Object.keys(results.effectiveDate).length
                for (var i=0; i<length; i++){
                    var date = results.effectiveDate[i]
                    date = setCharAt(date,25,'0')
                    res_forecast.push([date,results.forecast[i]])
                    res_generation.push([date,results.generation[i]])
                }
                SetSeries_RESForecast([
                    {
                        name: 'Forecast',
                        data: res_forecast,
                    },
                    {
                        name: 'Generation',
                        data: res_generation,
                    }
                  ])
                  SetOptions_RESForecast({
                    chart: {
                      type: 'area',
                      height: 400,
                      stacked: false,
                    },
                    colors: ["#219BFF", "#51CF60"],
                    dataLabels: {
                      enabled: false
                    },
                    stroke: {
                      curve: 'smooth',
                      width: 2
                    },
                    fill: {
                      type: 'gradient',
                      gradient: {
                        opacityFrom: 0.8,
                        opacityTo: 1,
                      }
                    },
                    legend: {
                      position: 'bottom',
                      horizontalAlign: 'left'
                    },
                    xaxis: {
                      type: 'datetime',
                      labels: {
                        format: 'dd/MM/yyyy HH:mm'
                      },
                    },
                    yaxis: {
                        title:{
                            text:"MWh",
                            style: {
                                fontSize:  '14px',
                                fontWeight:  'normal',
                                color:  '#263238',
                                fontFamily: 'Arial'
                              },
                        },
                      },
                    title: {
                        text: "RES Generation and Forecast",
                        align: 'center',
                        margin: 10,
                        offsetX: 0,
                        offsetY: 0,
                        floating: true,
                        style: {
                          fontSize:  '20px',
                          fontWeight:  'bold',
                          fontFamily: 'Arial',
                          color:  '#263238'
                        },
                    }
                    
                  })
                  
                SetisGenBreak(false)
                SetisIDM(false)
                SetisBileteral(false)
                SetisUnlicensed(false)
                SetisMCP(false)  
                SetisLoadEstimation(false)
                SetisRESForecast(true)
            }          
        }
        */
        else if(data_selected.code === 'load_estimation'){
            if(typeof results!="undefined" && type === 'load_estimation'){
                var load_estimation = []
                var real_consumption = []
                const length1 =Object.keys(results.date_1).length
                for (i=0; i<length1; i++){
                    var date1 = results.date_1[i]
                    date1 = setCharAt(date1,25,'0')
                    load_estimation.push([date1,results.lep_1[i]])
                }
                const length2 =Object.keys(results.date_2).length
                for (i=0; i<length2; i++){
                    var date2 = results.date_2[i]
                    date2 = setCharAt(date2,25,'0')
                    real_consumption.push([date2,results.consumption_2[i]])
                }
                SetSeries_LoadEstimation([
                    {
                        name: 'Load Estimation',
                        data: load_estimation,
                    },
                    {
                        name: 'Real Consumption',
                        data: real_consumption,
                    }
                  ])
                  SetOptions_LoadEstimation({
                    chart: {
                      type: 'area',
                      height: 400,
                      stacked: false,
                      toolbar: {
                        export: {
                          csv: {
                            filename: "Load Estimation and Real Consumption",
                            columnDelimiter: ',',
                            headerCategory: 'Date',
                            headerValue: 'value',
                            dateFormatter (date){
                              return new Date(date).toISOString().replace('T', ' ').substring(0, 16)
                            }
                          },
                          svg: {
                            filename: "Load Estimation and Real Consumption",
                          },
                          png: {
                            filename: "Load Estimation and Real Consumption",
                          }
                        }
                      }
                    },
                    colors: ["#219BFF", "#51CF60"],
                    dataLabels: {
                      enabled: false
                    },
                    stroke: {
                      curve: 'smooth',
                      width: 2
                    },
                    fill: {
                      type: 'gradient',
                      gradient: {
                        opacityFrom: 0.8,
                        opacityTo: 1,
                      }
                    },
                    legend: {
                      position: 'bottom',
                      horizontalAlign: 'left'
                    },
                    xaxis: {
                      type: 'datetime',
                      labels: {
                        format: 'dd/MM/yyyy'
                      },
                    },
                    yaxis: {
                        title:{
                            text:"MWh",
                            style: {
                                fontSize:  '14px',
                                fontWeight:  'normal',
                                color:  '#263238',
                                fontFamily: 'Arial'
                              },
                        },
                      },
                    title: {
                        text: "Load Estimation",
                        align: 'center',
                        margin: 10,
                        offsetX: 0,
                        offsetY: 0,
                        floating: true,
                        style: {
                          fontSize:  '20px',
                          fontWeight:  'bold',
                          fontFamily: 'Arial',
                          color:  '#263238'
                        },
                    },
                    tooltip: {
                      x: {
                        format:'dd/MM/yyyy HH:mm'
                      },
                    }
                    
                  })
                  
                SetisGenBreak(false)
                SetisIDM(false)
                SetisMCP(false)  
                SetisLoadEstimation(true)
            }          
        }
    },[data_selected, results]);
    
    function setCharAt(str,index,chr) {
        if(index > str.length-1) return str;
        return str.substring(0,index) + chr + str.substring(index+1);
    }

    Array.prototype.remove = function() {
        var what, a = arguments, L = a.length, ax;
        while (L && this.length) {
            what = a[--L];
            while ((ax = this.indexOf(what)) !== -1) {
                this.splice(ax, 1);
            }
        }
        return this;
    };
    

    const which_data = [
        {name:'Day Ahead Market Price (MCP)', code:'MCP'},
        //{name:'Day a head market volume response', code:'DAM_volume'},
        {name:'Intraday Market Price (MCP)', code:'IDM'},
        //{name:'Bilateral Contracts (Bid Quantity)', code:'bileteral_buy'},
        {name:'Generation Breakdown', code:'generation'},
        //{name:'YEKDEM Unlicenced Generation Breakdown', code:'yekdem_unlicenced'},
        //{name:'RES Generation and Forecast', code:'res_forecast'},
        //{name:'Installed generation capacity (YEKDEM & Others)', code:'installed_cap'},
        //{name:'Generation type based installed RES capacity (MW)', code:'installed_res'},
        //{name:'Load Estimation', code:'load_estimation'},
        {name:'Load Estimation and Real Consumption', code:'load_estimation'},
        //{name:'Real Consumption', code:'real_consumption'},
    ]

    const changeData = data_selected => {
        SetData(data_selected)
    }

    /*
    const result_graphs = () => {
        if (data_selected.code == "generation"){
            return (
                <Chart
                    width="100%"
                    height="400"
                    type="bar"
                />
                <div></div>
            )
        }
        else{
            return(
                <div></div>
            )
        }
    }
    */
    


    const execute = async () => {
      SetisGenBreak(false)
      SetisMCP(false)
      SetisIDM(false)
      SetisLoadEstimation(false)
      Setisloading(true)
      SetType(data_selected.code)
      const dates = document.getElementById("Date-Range").value.split("~")
      const start_date = dates[0].substring(0, dates[0].length - 1)
      const end_date = dates[1].substring(1)
      const data = {
          which_data: data_selected.code, 
          start_date: start_date,
          end_date: end_date
      }
      const url = 'http://192.168.1.89:3000/exportData'
      fetch(url,{
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
              'Content-type': 'application/json; charset=UTF-8'
          }}).then(res => res.json()).then(data => {   
          SetResults(JSON.parse(data.result))   
          Setisloading(false)     
          })

    }

    

    return (
    <div className="col-12">
    <div className="card">
        <h4>Export Data from EPİAŞ Transparency Platform</h4>
        <div className='grid' >
          <div style={{width:"30%", height:"500"}}>
            <div className="p-fluid">
              <div className="field" style={{paddingBottom:"10px", paddingTop:"20px"}}>
                <label style={{fontSize:"20px"}}>Data <img src="./info_V1.png" title="Info if necessary"/></label>
                <Dropdown value={data_selected} onChange={(e) => changeData(e.value)} options={which_data} optionLabel="name" placeholder="Select Data Type" style={{width:"75%"}}></Dropdown> 
              </div>
              <div> 
                <label style={{fontSize:"20px"}}> Date Range <img src="./info_V1.png" title="Info if necessary"/></label>
                <br></br>
                <DateRangePicker id="Date-Range" size='lg' placeholder="Select Date Range" ranges={[{}]} disabledDate={date => isAfter(date, new Date())} showOneCalendar style={{width:"75%"}}/>
              </div> 
              <div style={{paddingTop:"250px"}}>
                <Divider align='right'>
                    <Button label="Execute" style={{color:"white"}}  icon="pi pi-search" className="p-button-outlined" onClick={execute}></Button>
                </Divider>
              </div>                    
            </div>   
          </div> 
        <div>
            <DivAntd type="vertical" style={{height:"500px", backgroundColor:"#BDBDBD"}}/>
        </div>
          <div style={{width:"65%", height:"500"}}>
          {isloading && 
            <div style={{textAlign:"center", position:"relative", top:"20%"}}>
              <h5>Loading...</h5>
              <ProgressSpinner />
            </div>}
            {isGenBreak && 
            <div>
                <div id="chart">
                    <ApexChart options={options_genBreak} series={series_genBreak} type="area" height={400} width="100%" />
                    <h6 style={{textAlign:"center", fontStyle:"italic"}}>{LastDate}</h6>
                </div>
            </div>
            }
            {isMCP && 
            <div>
                <div id="chart">
                    <ApexChart options={options_MCP} series={series_MCP} type="line" height={400} width="100%" />
                </div>
            </div>
            }
            {isIDM && 
            <div>
                <div id="chart">
                    <ApexChart options={options_IDM} series={series_IDM} type="line" height={400} width="100%" />
                </div>
            </div>
            }
            {isLoadEstimation && 
            <div>
                <div id="chart">
                    <ApexChart options={options_LoadEstimation} series={series_LoadEstimation} type="line" height={400} width="100%" />
                </div>
            </div>}
          </div>
            
        </div>
        
        
        
    </div>
    
    </div>
    );
}


export default EpiasData;