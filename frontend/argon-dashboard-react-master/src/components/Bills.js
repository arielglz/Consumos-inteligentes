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

const Bills = (props) => {
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  const [clientDevices, setClientDevices] = useState([])

  useEffect (() => {
    //console.log(props.clientDevices)
    //setClientDevices(props.clientDevices)
  }) 

  const fillTable = (devices) => {
    return devices.map((device, index) => {
      const { alias, ubicacion, nombre, marca, voltaje, estado } = device
      return (
        <tr key={index}>
          <td>{alias}</td>
          <td>{ubicacion}</td>
          <td>{nombre}</td>
          <td>{marca}</td>
          <td>{voltaje}</td>
          <td>
            <Badge color="" className="badge-dot mr-4">
              <i className={estado == 'OFF' ? "bg-warning" : 'bg-success'} />
                {estado}
            </Badge>
          </td>
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
                  {/*fillTable(props.clientDevices)*/}
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
