import { useState } from "react";
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
import {
  Alert,
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
  Input,
  FormGroup,
  Modal,
  Form,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown
} from "reactstrap";

// core components

import Header from "components/Headers/Header.js";
import Select from 'react-select'
import { useEffect } from "react";
import { useOutletContext, useLocation } from "react-router-dom";
import axios from '../api/axios'
import jwtDecode from "jwt-decode";

const Index = (props) => {
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  const [clientDevices, setClientDevices] = useState([]);
  const token = localStorage.getItem('auth-token');
  //const clientDevices = useOutletContext();
  const {state} = useLocation();
  const [clientLocations, setClientLocations] = useState([])
  const [clientPlugs, setClientPlugs] = useState([])
  const [selectedLocation, setSelectedLocation] = useState(1)

  const [deviceName, setDeviceName] = useState('');
  const [deviceSerial, setDeviceSerial] = useState('');
  const [deviceMarca, setDeviceMarca] = useState('');
  const [deviceVoltaje, setDeviceVoltaje] = useState(0);
  const [deviceIDPlug, setDeviceIDPlug] = useState('');

  const [errMsg, setErrMsg] = useState('');
  const [successResponse, setSuccessResponse] = useState('')
  const [willUpdate, setWillUpdate] = useState(false);
  const [deviceID, setDeviceID] = useState('');

  const [show, setShow] = useState(false);

  //const handleClose = () => setShow(false);
  const handleShow = () => {
    setDeviceName('')
    setDeviceSerial('')
    setDeviceVoltaje(0)
    setDeviceMarca('')
    setDeviceIDPlug('')
    setSuccessResponse('')
    setErrMsg('')
    setShow(!show);
  }

  useEffect (() => {
    getClientDevices()
  }, [])

  const getClientDevices = async () => {
    //console.log('From getClientDevices', localStorage.getItem('clientID'))
    if(localStorage.getItem('clientID') == null){return console.log('Error, clientID empty')}
    try {
      const clientDevicesResponse = await axios.get('/devices/client/'+ localStorage.getItem('clientID'), {
        headers: { 
          'Content-Type': 'application/json',
          'auth-token': token
      }
    })
     //console.log('From getClientDevices:', clientDevicesResponse.data)
     setClientDevices(clientDevicesResponse.data)

    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    const getLocationsByUserID = async () => {
      try {
  
        const clientLocationsResponse = await axios.get('/locations/client/'+ localStorage.getItem('clientID'), {
          headers: { 
            'Content-Type': 'application/json',
            'auth-token': token
        }
      })
       setClientLocations(clientLocationsResponse.data)
  
      } catch (error) {
        console.log(error)
      }
    }
  
    getLocationsByUserID()
  }, [show])

  useEffect(() => {

     getPlugsByLocations()
  }, [selectedLocation])

  const getPlugsByLocations = async () => {
    console.log('Inside the function to obtain the plugs, the location selected is: ', selectedLocation)
    try {
  
      const clientPlugsResponse = await axios.get('/plugs/location/'+ selectedLocation, {
        headers: { 
          'Content-Type': 'application/json',
          'auth-token': token
      }
    })
     //console.log(clientPlugsResponse.data)
     setClientPlugs(clientPlugsResponse.data)

    } catch (error) {
      console.log(error)
    }
   }
/*
  useEffect(() => {
    getClientDevices()
    fillTable()
  }, [])*/

  const fillTable = () => {
    return clientDevices.map((device, index) => {
      const { alias, ubicacion, nombre, marca, voltaje, estado, id_dispositivo } = device
      return (
        <tr key={id_dispositivo}>
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
          <td className="text-right">
            <UncontrolledDropdown>
              <DropdownToggle
                className="btn-icon-only text-light"
                role="button"
                size="sm"
                color=""
                onClick={e => e.preventDefault()}
              >
                <i className="fas fa-ellipsis-v" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow" right>
                <DropdownItem
                  onClick={(e) => {
                    e.preventDefault()
                    updateDevice(id_dispositivo)
                  }}
                >
                  Actualizar
                </DropdownItem>
                <DropdownItem
                  onClick={() => deleteDevice(id_dispositivo)}
                >
                  Eliminar
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </td>
        </tr>
      )
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const device = {
      nombre: deviceName,
      serial: deviceSerial,
      voltaje: deviceVoltaje,
      marca: deviceMarca,
      id_plug: deviceIDPlug
    }

    try {
      const registrationResponse = await axios.post('/devices', device, {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token
            }
      })
      console.log(registrationResponse.data.msg)
      setSuccessResponse(registrationResponse.data.msg)
      getClientDevices()
    } catch (error) {
      //console.log(error)
      if (!error?.response) {
          setErrMsg('No Server Response')
      } else if (error.response?.status === 400) {
          console.log(error.response.data)
          setErrMsg(error.response.data.error)
      } else {
          console.log(error.response)
          setErrMsg('Registration failed')
    }
    }
  }

  const deleteDevice = async (id) => {
    //if(alert('¿Usted está seguro que desar eliminar el dispositivo?')){
      try {
        const deleteResponse = await axios.delete('/devices/' + id, {
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token
          }
        })
        console.log(deleteResponse.data)
        //setSuccessResponse(registrationResponse.data.msg)
        getClientDevices()
      } catch (error) {
        console.log(error)
      }
    //}
  }

  const updateDevice = async (id) => {
    //e.preventDefault()
    setDeviceID(id)
    setWillUpdate(true)
    handleShow()
    try {
      const responseDeviceByID = await axios.get('/devices/' + id, {
        headers: {
         'Content-Type': 'application/json',
         'auth-token': token
       }
      })
      console.log(responseDeviceByID.data[0])
      setDeviceName(responseDeviceByID.data[0].nombre)
      setDeviceSerial(responseDeviceByID.data[0].serial)
      setDeviceVoltaje(responseDeviceByID.data[0].voltaje)
      setDeviceMarca(responseDeviceByID.data[0].marca)
    } catch (error) {
      console.log(error)
    }
  }

  const submitUpdate = async(id_device) => {
   // e.preventDefault()
    const device = {
      nombre: deviceName,
      serial: deviceSerial,
      voltaje: deviceVoltaje,
      marca: deviceMarca,
      id_plug: deviceIDPlug
    }
    
    try {
      console.log(device)
      const updateResponse = await axios.put('/devices/' + id_device, device, {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token
            }
      })
      setSuccessResponse(updateResponse.data.msg)
      getClientDevices()
    } catch (error) {
      //console.log(error)
      if (!error?.response) {
          setErrMsg('No Server Response')
      } else if (error.response?.status === 400) {
          console.log(error.response.data)
          setErrMsg(error.response.data.error)
      } else {
          console.log(error.response)
          setErrMsg('Update failed')
    }
    }
  }

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="14">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Mis dispositivos</h3>
                  </div>
                  <Button
                      color="success"
                      onClick={handleShow}
                      size="sm"
                    >
                      Añadir
                    </Button>
                    <Modal
                      className="modal-dialog-centered"
                      size="sm"
                      isOpen={show}
                      toggle={handleShow}
                    >
                      <div className="modal-body p-0">
                        <Card className="bg-secondary shadow border-0">
                          <CardBody className="px-lg-5 py-lg-5">
                            <div className="text-center text-muted mb-4">
                              <h2>{willUpdate ? 'Actualizar dispositivo' : 'Añadir dispositivo'}</h2>
                            </div>
                            <Row>
                            <Alert color="danger" className={errMsg ? "alert alert-danger" : "offscreen"}>
                              {errMsg}
                            </Alert>
                            <Alert color="success" className={successResponse ? "alert alert-success" : "offscreen"}>
                              {successResponse}
                            </Alert>
                            </Row>
                            <Form role="form">
                              <FormGroup className="mb-3">
                                <Input
                                  className="form-control-alternative"
                                  placeholder="Nombre"
                                  type="text"
                                  autoComplete="off"
                                  onChange={(e) => setDeviceName(e.target.value)}
                                  value={deviceName}
                                /> 
                              </FormGroup>
                              <FormGroup>
                                <Input
                                    className="form-control-alternative"
                                    placeholder="Serial"
                                    type="text"
                                    autoComplete="off"
                                    onChange={(e) => setDeviceSerial(e.target.value)}
                                    value={deviceSerial}
                                 /> 
                              </FormGroup>
                              <FormGroup>
                                <Input
                                    className="form-control-alternative"
                                    placeholder="Voltaje"
                                    type="number"
                                    autoComplete="off"
                                    onChange={(e) => setDeviceVoltaje(e.target.value)}
                                    value={deviceVoltaje}
                                  /> 
                              </FormGroup>
                              <FormGroup>
                                <Input
                                    className="form-control-alternative"
                                    placeholder="Marca"
                                    type="text"
                                    autoComplete="off"
                                    onChange={(e) => setDeviceMarca(e.target.value)}
                                    value={deviceMarca}
                                  /> 
                              </FormGroup>
                              <FormGroup>
                                <Select
                                  className="form-control-alternative"
                                  placeholder='Localidad'
                                  options={clientLocations.map(location => ({ label: location.alias, value: location.id_localidad}))}
                                  onChange={res => setSelectedLocation(res.value)}
                                  />
                              </FormGroup>
                              <FormGroup>
                              <Select
                                className="form-control-alternative" 
                                placeholder={'Plug'}
                                options={clientPlugs.map(plugs => ({ label: plugs.ubicacion, value: plugs.id_plug}))}
                                onChange={res => setDeviceIDPlug(res.value)} 
                              />
                              </FormGroup>
                              <div className="text-center">
                                <Button color="primary" type="button" onClick={willUpdate 
                                  ? (e) => {
                                    e.preventDefault()
                                    submitUpdate(deviceID)
                                  } 
                                  : handleSubmit}>
                                {willUpdate ? 'Actualizar' : 'Añadir'}
                                </Button>
                              </div>
                            </Form>
                          </CardBody>
                        </Card>
                      </div>
                    </Modal>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Localidad</th>
                    <th scope="col">Ubicacion</th>
                    <th scope="col">Dispositivo</th>
                    <th scope="col">Marca</th>
                    <th scope="col">Voltaje</th>
                    <th scope="col">Estado</th>
                    <th scope="col"></th>
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

export default Index;
