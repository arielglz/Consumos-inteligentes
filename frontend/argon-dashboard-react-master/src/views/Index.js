/*!

=========================================================
* Argon Dashboard React - v1.2.1
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import { useState } from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Badge,
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";

// core components
import Datetime from 'react-datetime'

import Header from "components/Headers/Header.js";
import { useEffect } from "react";
import { useOutletContext, useLocation } from "react-router-dom";
import axios from '../api/axios'
import jwtDecode from "jwt-decode";
import BarChart from "components/Charts/BarChart";
import {UserData} from './examples/Data'
import io from 'socket.io-client'
import moment from 'moment';


const Index = (props) => {
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");

  const token = localStorage.getItem('auth-token');
  const decryptedToken = jwtDecode(token);
  const [consumptions, setConsumptions] = useState([]);
  const [initialDate, setInitialtDate] = useState(moment().subtract(1, 'day').format('YYYY-MM-DD H:mm:ss'));
  const [finalDate, setFinalDate] = useState(moment().format('YYYY-MM-DD H:mm:ss'));
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Consumos',
      data: [],
    }]
  })
  const [chartLocationData, setChartLocationData] = useState({
    labels: [],
    datasets: [{
      label: 'Consumos',
      data: [],
    }]
  })
  const [realTimeChartData, setRealTimeChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Consumos',
      data: [],
    }]
  })

  const [realTimeLocationsData, setRealTimeLocationsData] = useState({
    labels: [],
    datasets: [{
      label: 'Consumos',
      data: [],
    }]
  })
  
  useEffect (() => {

    getClientDevicesConsumptionsBetweenDates()
    getClientLocationsConsumptionsBetweenDates()

    const socket = io('ws://localhost:5000')
    socket.emit('data-sended', { id_cliente: decryptedToken.id})
    socket.off('data-sended')
    socket.on('data-response', (...args) => {
      //console.log(args[0])
      const response = args
      setRealTimeChartData({
        labels: args[0].devices.map((device) => device.nombre),
        datasets: [
        {
          label: 'Costos',
          data: args[0].devices.map((device) => device.consumo),
        }]
      })
      setRealTimeLocationsData({
        labels: args[0].locations.map((location) => location.alias),
        datasets: [
        {
          label: 'Costos',
          data: args[0].devices.map((location) => location.consumo),
        }]
      })

    })
    
  }, [])

  const getClientLocationsConsumptionsBetweenDates = async () => {
    try {

      const toQuery = {
        id_cliente: decryptedToken.id,
        fecha_inicio: initialDate,
        fecha_final: finalDate
      }

      //console.log(toQuery)

      const dataResponse = await axios.post('/consumptions/location/' + decryptedToken.id, toQuery, {
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        }
      })

      setChartLocationData({
        labels: dataResponse.data.map((device) => device.alias),
        datasets: [
        {
          label: 'Costos',
          data: dataResponse.data.map((device) => device.costo),
        }]
      })

    } catch (error) {
      console.log(error)
    }

  }
  
  const getClientDevicesConsumptionsBetweenDates = async () => {
    try {

      const toQuery = {
        id_cliente: decryptedToken.id,
        fecha_inicio: initialDate,
        fecha_final: finalDate
      }

      //console.log(toQuery)

      const dataResponse = await axios.post('/consumptions/client/' + decryptedToken.id, toQuery, {
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        }
      })

      //console.log(dataResponse.data)
      setConsumptions(dataResponse.data)
      fillTable()
      setChartData({
        labels: dataResponse.data.map((device) => device.nombre),
        datasets: [
        {
          label: 'Costos',
          data: dataResponse.data.map((device) => device.costo),
        }]
      })

    } catch (error) {
      console.log(error)
    }

  }

  const fillTable = () => {
    return consumptions.map((consumption, index) => {
      const { alias, ubicacion, nombre, marca, consumo_t, consumo, costo_t, costo } = consumption
      return (
        <tr key={index}>
          <td>{alias}</td>
          <td>{ubicacion}</td>
          <td>{nombre}</td>
          <td>{marca}</td>
          <td>{consumo_t}</td>
          <td>{costo_t}</td>
        </tr>
      )
    })
  }

  return (
    <>
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-3" xl="5">
            <Card className="shadow">
              <CardHeader>
                <h3>Consumo de mis dispositivos en tiempo real</h3>
              </CardHeader>
              <CardBody>
                <Bar data={realTimeChartData} />
              </CardBody>
            </Card>
          </Col>
          <Col className="mb-5 mb-xl-3" xl="5">
            <Card className="shadow">
              <CardHeader>
                <h3>Consumo de mis localidades en tiempo real</h3>
              </CardHeader>
              <CardBody>
                <Bar data={realTimeLocationsData} />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row >
          <Col className="mb-5 mb-xl-3" xl="5">
          {/*<Col xl="6">*/}
          <Card className="shadow">
            <CardHeader>
              <h3>Consumos de las localidades en las ultimas 24h</h3>
            </CardHeader>
            <CardBody>
              <Bar data={chartLocationData} />
            </CardBody>
          </Card>
          </Col>
          <Col className="mb-5 mb-xl-3" xl="5">
          <Card className="shadow">
            <CardHeader>
              <h3>Consumos de los dispositivos en las ultimas 24h</h3>
            </CardHeader>
            <CardBody>
              <Bar data={chartData} />
            </CardBody>
          </Card> 
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
