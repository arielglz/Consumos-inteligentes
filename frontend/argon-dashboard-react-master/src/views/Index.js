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
  const [realTimeChartData, SetRealTimeChartData] = useState({
    labels: [],
    datasets: [{
      label: 'Consumos',
      data: [],
    }]
  })
  
  useEffect (() => {

    getClientDevicesConsumptionsBetweenDates()
    getClientLocationsConsumptionsBetweenDates()
  }, [])

  const getClientLocationsConsumptionsBetweenDates = async () => {
    try {

      const toQuery = {
        id_cliente: decryptedToken.id,
        fecha_inicio: initialDate,
        fecha_final: finalDate
      }

      console.log(toQuery)

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

      console.log(toQuery)

      const dataResponse = await axios.post('/consumptions/client/' + decryptedToken.id, toQuery, {
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        }
      })

      console.log(dataResponse.data)
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

 /* useEffect(() => {
    setChartData({})
    setChartData({
      labels: consumptions.map((device) => device.nombre),
      datasets: [{
        label: 'Consumos',
        data: consumptions.map((device) => device.consumo),
      }]
    })
    console.log(chartData)
  }, [consumptions])*/

 /* const fillChart = () => {
    return consumptions.map((consumption))
  }*/
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
      {/*  <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="bg-gradient-default shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-light ls-1 mb-1">
                      Overview
                    </h6>
                    <h2 className="text-white mb-0">Sales value</h2>
                  </div>
                  <div className="col">
                    <Nav className="justify-content-end" pills>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 1,
                          })}
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 1)}
                        >
                          <span className="d-none d-md-block">Month</span>
                          <span className="d-md-none">M</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 2,
                          })}
                          data-toggle="tab"
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 2)}
                        >
                          <span className="d-none d-md-block">Week</span>
                          <span className="d-md-none">W</span>
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart 
                <div className="chart">
                  <Line
                    data={chartExample1[chartExample1Data]}
                    options={chartExample1.options}
                    getDatasetAtEvent={(e) => console.log(e)}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">
                      Performance
                    </h6>
                    <h2 className="mb-0">Total orders</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart
                <div className="chart">
                  <Bar
                    data={chartExample2.data}
                    options={chartExample2.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>*/}
        <Row>
          <Col className="mb-5 mb-xl-3" xl="5">
            <Card className="shadow">
              <CardHeader>
                <h3>Consumo de mis dispositivos en tiempo real</h3>
              </CardHeader>
              <CardBody>
                {console.log(realTimeChartData)}
                <Bar data={realTimeChartData} />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row >
          <Col className="mb-5 mb-xl-3" xl="5">
            {/*<Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Dispositivos con mayor consumo</h3>
                  </div>
                  {/*<div className="col text-right">
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      See all
                    </Button>
                  </div>
                </Row>
                <Row className="align-items-center">
                  <Col xs="6">
                    <Col md="12" xs="4">
                      <h3 className="mb-0">Fecha de inicio</h3>
                    </Col>
                    <Col md="12" xs="4">
                      <Datetime input={true} dateFormat={'DD/MM/YYYY'} onChange={moment => setInitialtDate(moment.format('YYYY-MM-DD H:mm:ss'))}/>
                    </Col>
                  </Col>
                  <Col xs="6">
                    <Col md="12" xs="6">
                      <h3 className="mb-0">Fecha de final</h3>
                    </Col>
                    <Col md="12" xs="6">
                      <Datetime className="" input={true} dateFormat={'DD/MM/YYYY'} onClose={getClientDevicesConsumptionsBetweenDates} onChange={(moment) => setFinalDate(moment.format('YYYY-MM-DD H:mm:ss'))}/>
                    </Col>
                  </Col>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Localidad</th>
                    <th scope="col">Ubicacion</th>
                    <th scope="col">Dispositivo</th>
                    <th scope="col">Marca</th>
                    <th scope="col">Consumo</th>
                    <th scope="col">Costo</th>
                  </tr>
                </thead>
                <tbody>
                  {fillTable()}
                  {/*<tr>
                    <th scope="row">/argon/</th>
                    <td>4,569</td>
                    <td>340</td>
                    <td>
                      <i className="fas fa-arrow-up text-success mr-3" /> 46,53%
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">/argon/index.html</th>
                    <td>3,985</td>
                    <td>319</td>
                    <td>
                      <i className="fas fa-arrow-down text-warning mr-3" />{" "}
                      46,53%
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">/argon/charts.html</th>
                    <td>3,513</td>
                    <td>294</td>
                    <td>
                      <i className="fas fa-arrow-down text-warning mr-3" />{" "}
                      36,49%
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">/argon/tables.html</th>
                    <td>2,050</td>
                    <td>147</td>
                    <td>
                      <i className="fas fa-arrow-up text-success mr-3" /> 50,87%
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">/argon/profile.html</th>
                    <td>1,795</td>
                    <td>190</td>
                    <td>
                      <i className="fas fa-arrow-down text-danger mr-3" />{" "}
                      46,53%
                    </td>
                  </tr>
                </tbody>
                </Table>
            </Card>
          </Col>*/}
          {/*
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Social traffic</h3>
                  </div>
                  <div className="col text-right">
                    <Button
                      color="primary"
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                      size="sm"
                    >
                      See all
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Referral</th>
                    <th scope="col">Visitors</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Facebook</th>
                    <td>1,480</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">60%</span>
                        <div>
                          <Progress
                            max="100"
                            value="60"
                            barClassName="bg-gradient-danger"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Facebook</th>
                    <td>5,480</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">70%</span>
                        <div>
                          <Progress
                            max="100"
                            value="70"
                            barClassName="bg-gradient-success"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Google</th>
                    <td>4,807</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">80%</span>
                        <div>
                          <Progress max="100" value="80" />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Instagram</th>
                    <td>3,678</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">75%</span>
                        <div>
                          <Progress
                            max="100"
                            value="75"
                            barClassName="bg-gradient-info"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">twitter</th>
                    <td>2,645</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="mr-2">30%</span>
                        <div>
                          <Progress
                            max="100"
                            value="30"
                            barClassName="bg-gradient-warning"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </Table>
              </Card>
          </Col>
          */}
          {/*<Col xl="6">*/}
          <Card className="shadow">
            <CardHeader>
              <h3>Consumos de las localidades en las ultimas 24h</h3>
            </CardHeader>
            <CardBody>
              {console.log(chartLocationData)}
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
              {console.log(chartData)}
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
