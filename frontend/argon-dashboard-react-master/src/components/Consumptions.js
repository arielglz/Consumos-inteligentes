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

import Header from "./Headers/Header"
import Datetime from 'react-datetime'

import { useEffect, useState } from "react";
import { useOutletContext, useLocation } from "react-router-dom";
import axios from '../api/axios'
import jwtDecode from "jwt-decode";

const Consumptions = () => {
    const [clientDevices, setClientDevices] = useState([]);
    const [id, setId] = useState('');
    const token = localStorage.getItem('auth-token');
    const data = jwtDecode(token);
    const [consumptions, setConsumptions] = useState([]);
    const [initialDate, setInitialtDate] = useState('');
    const [finalDate, setFinalDate] = useState('');
    const [locationInitialDate, setLocationInitialtDate] = useState('');
    const [locationFinalDate, setLocationFinalDate] = useState('');
    const date = new Date();
    const [chartData, setChartData] = useState({
      labels: [],
      datasets: [{
        label: 'Consumos',
        data: [],
      }]
    })
    const [chartLocationData, setLocationChartData] = useState({
        labels: [],
        datasets: [{
          label: 'Consumos',
          data: [],
        }]
      })

    const getClientDevicesConsumptionsBetweenDates = async () => {
        console.log(date.toLocaleDateString)
       try {
        
          const toQuery = {
            id_cliente: localStorage.getItem('clientID'),
            fecha_inicio: initialDate,
            fecha_final: finalDate
          }
      
          console.log(toQuery)
      
          const dataResponse = await axios.post('/consumptions/client/' + localStorage.getItem('clientID'), toQuery, {
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
    
    const getClientLocationConsumptionsBetweenDates = async () => {
        try {
      
            const toQuery = {
              id_cliente: localStorage.getItem('clientID'),
              fecha_inicio: locationInitialDate,
              fecha_final: locationFinalDate
            }
        
            console.log(toQuery)
        
            const dataResponse = await axios.post('/consumptions/location/' + localStorage.getItem('clientID'), toQuery, {
              headers: {
                'Content-Type': 'application/json',
                'auth-token': token
              }
            })
        
            console.log(dataResponse.data)
            setConsumptions(dataResponse.data)
            fillTable()
            setLocationChartData({
              labels: dataResponse.data.map((location) => location.alias),
              datasets: [
              {
                label: 'Costos',
                data: dataResponse.data.map((location) => location.costo),
              }]
            })
        
          } catch (error) {
            console.log(error)
          }
    }

    const fillLocationTable = () => {
    return consumptions.map((consumption, index) => {
        const { alias, ubicacion, nombre, marca, consumo_t, consumo, costo_t, costo } = consumption
        return (
        <tr key={index}>
            <td>{alias}</td>
            <td>{consumo_t}</td>
            <td>{costo_t}</td>
        </tr>
        )
    })
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

    return(
        <>
        <Header />
        <Container className="mt--7" fluid>
        <Row >
            <Col className="mb-5 mb-xl-0" xl="6">
                <Card className="shadow">
                <CardHeader className="border-0">
                    <Row className="align-items-center">
                        <div className="col">
                            <h3 className="mb-0">Consumos de mis localidades</h3>
                            <br />
                        </div>
                    </Row>
                    <Row className="align-items-center">
                    <Col xs="6">
                        <Col md="12" xs="4">
                        <h3 className="mb-0">Fecha de inicio</h3>
                        </Col>
                        <Col md="12" xs="4">
                        <Datetime input={true} dateFormat={'DD/MM/YYYY'} onChange={(moment) => setLocationInitialtDate(moment.format('YYYY-MM-DD H:mm:ss'))}/>
                        </Col>
                    </Col>
                    <Col xs="6">
                        <Col md="12" xs="6">
                        <h3 className="mb-0">Fecha de final</h3>
                        </Col>
                        <Col md="12" xs="6">
                        <Datetime className="" input={true} dateFormat={'DD/MM/YYYY'} onClose={getClientLocationConsumptionsBetweenDates} onChange={(moment) => setLocationFinalDate(moment.format('YYYY-MM-DD H:mm:ss'))}/>
                        </Col>
                    </Col>
                    </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                    <tr>
                        <th scope="col">Localidad</th>
                        <th scope="col">Consumo</th>
                        <th scope="col">Costo</th>
                    </tr>
                    </thead>
                    <tbody>
                    {fillLocationTable()}
                    </tbody>
                    </Table>
                </Card>
            </Col>
            <Col xl="6">
            <Card className="shadow">
                <CardBody>
                {console.log(chartLocationData)}
                <Bar data={chartLocationData} />
                </CardBody>
            </Card>
            </Col>
            </Row>
            <br />
            <Row >
            <Col className="mb-5 mb-xl-0" xl="6">
                <Card className="shadow">
                <CardHeader className="border-0">
                    <Row className="align-items-center">
                        <div className="col">
                            <h3 className="mb-0">Consumos de mis dispositivos</h3>
                            <br />
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
                    </tbody>
                    </Table>
                </Card>
            </Col>
            <Col xl="6">
            <Card className="shadow">
                <CardBody>
                {console.log(chartData)}
                <Bar data={chartData} />
                </CardBody>
            </Card>
            </Col>
            </Row>
        </Container>
        </>
    )
}

export default Consumptions