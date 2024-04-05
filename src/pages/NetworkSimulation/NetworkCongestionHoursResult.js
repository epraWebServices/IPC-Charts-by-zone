import React, {useState } from "react";
import {Marker, MapContainer, TileLayer, Polyline} from "react-leaflet";
import 'leaflet/dist/leaflet.css'
import { Card } from 'primereact/card';
import { Row, Col, Select, Button, DatePicker, Tag} from 'antd';
import { InputNumber } from 'antd';
import { ColorPicker } from 'primereact/colorpicker';
import { Dropdown } from "primereact/dropdown";


const NetworkCongestionHoursResult = (props) => {
  const {congestionHoursResult, input} = props
  const [number,setNumber] = useState([5,10,20])
  const [colors,setColors] = useState(['2cba00','a3ff00','fff400','ffa700','ff0000'])
  const [selected, setSelected] = useState("congestionHoursBase")
  let total_hour = input[0].to_hour - input[0].from_hour + 1
  let congestions = []
  congestionHoursResult.map((data)=>{
    let color = ""
    if(data[selected] === 0){
      color = colors[0]
    }
    else if(data[selected] <= total_hour * number[0] / 100){
      color = colors[1]
    }
    else if(data[selected] <= total_hour * number[1] / 100){
      color = colors[2]
    }
    else if(data[selected] <= total_hour * number[2] / 100){
      color = colors[3]
    }
    else{
      color = colors[4]
    }
    congestions.push({
      from: [data.x1, data.y1],
      to: [data.x2, data.y2],
      color : "#" + color
    })
  })

  function updateColor(e, index){
    setColors(colors =>({...colors,[index]:e}))
  }
  function updateNumber(e,index){
    let values = number
    if(index===1 && e >= values[index+1]){
      setNumber(number =>({...number,[index]:e, [index+1]:e+1}))
    }
    else if(index===0 && e >= values[index+1] && e >= values[index+2]-2){
      setNumber(number =>({...number,[index]:e, [index+1]:e+1,[index+2]:e+2}))
    }
    else if(index===0 && e >= values[index+1]){
      setNumber(number =>({...number,[index]:e, [index+1]:e+1}))
    }
    else if(index===1 && e <= values[index-1]){
      setNumber(number =>({...number,[index]:e, [index-1]:e-1}))
    }
    else if(index===2 && e <= values[index-1] && e <= values[index-2]+2){
      setNumber(number =>({...number,[index]:e, [index-1]:e-1, [index-2]:e-2}))
    }
    else if(index===2 && e <= values[index-1]){
      setNumber(number =>({...number,[index]:e, [index-1]:e-1}))
    }
    else{
      setNumber(number =>({...number,[index]:e}))
    }

  }

  let options = [{"value":"congestionHoursBase", "label":"Base"},{"value":"congestionHoursCtgc", "label":"Contingency"}]


  return(
    <div style={{height: '100%', width: "100%", paddingTop:"10px"}} className="congestionMap">


      <MapContainer
        center={[39.15, 37.25]} 
        zoom={6} 
        doubleClickZoom={false}
        style={{ height: "90%", width: "100%"}}
        dragging={true}
        zoomControl = {true}
        attributionControl={false}>


        <TileLayer
        url='https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png'
        //url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        //url='https://api.tiles.mapbox.com/v4/mapbox.light/{z}/{x}/{y}.png'
        //attribution= '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        noWrap = {true}
        />
        {congestions.map((result)=>{
          return(
            <Polyline positions={[result.from, result.to]} pathOptions={{color:result.color}}>

            </Polyline>
          )
        })}
        <Card   style={{zIndex:"1" ,  float:"right",marginRight:"20px" , marginTop:"10px", borderTop:"30px" , fontFamily:"Arial", position:"relative" ,width:"340px" , height:"340px", padding:"3px"}}>

          <div>
            <div style={{textAlign:"center", marginBottom:"10px"}}>
              <Dropdown options={options} optionLabel="label" value={selected} onChange={(e) => setSelected(e.value)} style={{width:"200px", height:"40px"}}></Dropdown>
            </div>
            
            <Row >
              <Col offset={6} >No Congestions  </Col>
              <Col offset={5}> <ColorPicker value={colors[0]}   onChange={(e) => updateColor(e.value,0)}    /></Col>
            </Row>
            <br></br>
            <Row>

              <Col offset={2}><InputNumber onKeyDown={(event) => { event.preventDefault();}} style={{width:"200px"}} keyboard={false} onChange={(e) => updateNumber(e,0)} min={1} max = {97} formatter={(value) => `${value}% (${Math.round(value*total_hour/100)} hours)`} prefix="<"  value={number[0]}></InputNumber></Col>
              <Col offset={1}> <ColorPicker value={colors[1]} onChange={(e) => updateColor(e.value,1)} /></Col>
            </Row>
            <br></br>
            <Row>

              <Col offset={2}><InputNumber  style={{width:"200px"}} prefix= "< " onKeyDown={(event) => { event.preventDefault();}} keyboard={false} onChange={(e) => updateNumber(e,1)} min={2} max = {98} formatter={(value) => `${value}% (${Math.round(value*total_hour/100)} hours) `}  value={number[1]}></InputNumber></Col>
              <Col offset={1}> <ColorPicker value={colors[2]} onChange={(e) => updateColor(e.value,2)} /></Col>
            </Row>
            <br></br>
            <Row>

              <Col offset={2}><InputNumber style={{width:"200px"}} prefix= "< " onKeyDown={(event) => { event.preventDefault();}} keyboard={false} onChange={(e) => updateNumber(e,2)} min={3} max = {99} formatter={(value) => `${value}% (${Math.round(value*total_hour/100)} hours)`}  value={number[2]}></InputNumber></Col>
              <Col offset={1}> <ColorPicker value={colors[3]} onChange={(e) => updateColor(e.value,3)} /></Col>
            </Row>
            <br></br>
            <Row>
              <Col offset={2}><InputNumber  controls={false} prefix= "> " style= {{width:"200px" , color:"black" }} formatter={(value) => `${value}% (${Math.round(value*total_hour/100)} hours)`} value={number[2]}   ></InputNumber></Col>

              <Col offset={1}> <ColorPicker value={colors[4]} onChange={(e) => updateColor(e.value,4)} /></Col>        
            </Row>
          </div>
          </Card>
        </MapContainer>
      </div>
  )
}

export default NetworkCongestionHoursResult;