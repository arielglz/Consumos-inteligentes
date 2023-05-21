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
  Card,
  CardHeader,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";

// core components

import Header from "components/Headers/Header.js";
import { useEffect } from "react";
import axios from '../api/axios'
import jwtDecode from "jwt-decode";

const Bills = (props) => {
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  const [clientDevices, setClientDevices] = useState([])
  const [bills, setBills] = useState([])

  const token = localStorage.getItem('auth-token');
  const decryptedToken = jwtDecode(token);

  useEffect (() => {
    //console.log(props.clientDevices)
    //setClientDevices(props.clientDevices)
    getBills()
  }, []) 

  const getBills = async () => {
    try {
            
      const dataResponse = await axios.get('/bills/' + decryptedToken.id, {
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        }
      })
    
        setBills(dataResponse.data)
        fillTable()
    
      } catch (error) {
        console.log(error)
      }
}

const fillTable = () => {
  return bills.map((bills, index) => {
    const { fecha, alias, habito, consumo, costo } = bills
    return (
      <tr key={index}>
        <td>{fecha}</td>
        <td>{alias}</td>
        <td>{habito}</td>
        <td>{consumo}</td>
        <td>{costo}</td>
      </tr>
    )
  })
}

  return (
    <>
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Mis facturas</h3>
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
                  </div>*/}
                </Row>
              </CardHeader>
             {/* <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    Accordion 1
                  </Accordion.Header>
                  <Accordion.Body>
                    Contenido del accordion
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>*/}
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Fecha</th>
                    <th scope="col">Localidad</th>
                    <th scope="col">Habito de consumo</th>
                    <th scope="col">Consumo</th>
                    <th scope="col">Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {fillTable()}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Bills;
