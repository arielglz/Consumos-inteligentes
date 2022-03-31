import {
    Alert,
    Button,
    Badge,
    Card,
    CardBody,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    CardHeader,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    UncontrolledDropdown,
    Table,
    Container,
    Row,
    Col,
    Modal,
    Form,
    FormGroup
  } from "reactstrap";
  
import Select from 'react-select'

import { useState, useEffect } from "react";
import axios from '../api/axios'
import Header from "./Headers/Header"

const Plugs = () => {
    const clientID = localStorage.getItem('clientID')
    const token = localStorage.getItem('auth-token')

    const [clientLocations, setClientLocations] = useState([])

    const [clientPlugs, setClientPlugs] = useState([])
    const [plugLocalidad, setPlugLocalidad] = useState('')
    const [plugUbicacion, setPlugUbicacion] = useState('')
    const [plugCntPuertos, setPlugCntPuertos] = useState(0)
    const [plugEstado, setPlugEstado] = useState('')

    const [errMsg, setErrMsg] = useState('');
    const [successResponse, setSuccessResponse] = useState('')
    const [willUpdate, setWillUpdate] = useState(false);
    const [plugID, setPlugID] = useState('')
  
    const [show, setShow] = useState(false);

    const handleShow = () => {
        setPlugLocalidad('')
        setPlugUbicacion('')
        setPlugCntPuertos('')
        setPlugEstado('')
        setSuccessResponse('')
        setErrMsg('')
        setShow(!show);
      }

    useEffect(() => {
        getPlugsByClientID()
        getLocationsByClientID()
    }, [])

    const getPlugsByClientID = async() => {
        try {
            const plugsResponse = await axios.get(`/plugs/client/${clientID}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            })
           setClientPlugs(plugsResponse.data)
        } catch (error) {
            console.log(error)
        }
    }

    const getLocationsByClientID = async () => {
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

    const handleSubmit = async (e) => {
        e.preventDefault()

        const plug = {
        ubicacion: plugUbicacion,
        cant_puerto: plugCntPuertos,
        estado: plugEstado,
        id_localidad: plugLocalidad
        }

        try {
        const registrationResponse = await axios.post('/plugs', plug, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
        })
        console.log(registrationResponse.data.msg)
        setSuccessResponse(registrationResponse.data.msg)
        getPlugsByClientID()
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

    const deletePlug = async (id) => {
        //if(alert('¿Usted está seguro que desar eliminar el dispositivo?')){
          try {
            const deleteResponse = await axios.delete('/plugs/' + id, {
              headers: {
                'Content-Type': 'application/json',
                'auth-token': token
              }
            })
            console.log(deleteResponse.data)
            //setSuccessResponse(registrationResponse.data.msg)
            getPlugsByClientID()
          } catch (error) {
            console.log(error)
          }
        //}
      }
    
      const updatePlug = async (id) => {
        //e.preventDefault()
        setPlugID(id)
        setWillUpdate(true)
        handleShow()
        try {
          const responseDeviceByID = await axios.get('/plugs/' + id, {
            headers: {
             'Content-Type': 'application/json',
             'auth-token': token
           }
          })
          console.log(responseDeviceByID.data[0])
          setPlugUbicacion(responseDeviceByID.data[0].ubicacion)
          setPlugCntPuertos(responseDeviceByID.data[0].cant_puerto)
          setPlugEstado(responseDeviceByID.data[0].estado)
        } catch (error) {
          console.log(error)
        }
      }
    
      const submitUpdate = async(id_plug) => {
       // e.preventDefault()
       const plug = {
        ubicacion: plugUbicacion,
        cant_puerto: plugCntPuertos,
        estado: plugEstado,
        id_localidad: plugLocalidad
        }
        
        try {
          console.log(plug)
          const updateResponse = await axios.put('/plugs/' + id_plug, plug, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
          })
          setSuccessResponse(updateResponse.data.msg)
          getPlugsByClientID()
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

    const fillTable = () => {
        return clientPlugs.map((plug, index) => {
          const { alias, ubicacion, cant_puerto, estado, id_plug } = plug
          return (
            <tr key={id_plug}>
              <td>{alias}</td>
              <td>{ubicacion}</td>
              <td>{cant_puerto}</td>
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
                        updatePlug(id_plug)
                      }}
                    >
                      Actualizar
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => deletePlug(id_plug)}
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

    return(
        <>
        <Header />
        <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Mis plugs</h3>
                  </div>
                  <div className="col text-right">
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
                              <h2>{willUpdate ? 'Actualizar plug' : 'Añadir plug'}</h2>
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
                                  placeholder="Ubicacion"
                                  type="text"
                                  autoComplete="off"
                                  onChange={(e) => setPlugUbicacion(e.target.value)}
                                  value={plugUbicacion}
                                /> 
                              </FormGroup>
                              <FormGroup>
                                <Input
                                    className="form-control-alternative"
                                    placeholder="Cantidad de Puertos"
                                    type="number"
                                    autoComplete="off"
                                    onChange={(e) => setPlugCntPuertos(e.target.value)}
                                    value={plugCntPuertos}
                                  /> 
                              </FormGroup>
                              <FormGroup>
                                <Select
                                  className="form-control-alternative"
                                  placeholder='Estado'
                                  options={[{label: 'ON', value: 'ON'}, {label: 'OFF', value: 'OFF'}]}
                                  onChange={res => setPlugEstado(res.value)}
                                  />
                              </FormGroup>
                              <FormGroup>
                              <Select
                                className="form-control-alternative" 
                                placeholder='Localidad'
                                options={clientLocations.map(location => ({ label: location.alias, value: location.id_localidad}))}
                                onChange={res => setPlugLocalidad(res.value)} 
                              />
                              </FormGroup>
                              <div className="text-center">
                                <Button color="primary" type="button" onClick={willUpdate 
                                  ? (e) => {
                                    e.preventDefault()
                                    submitUpdate(plugID)
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
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Localidad</th>
                    <th scope="col">Ubicacion</th>
                    <th scope="col">Cantidad de puertos</th>
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
    )
}

export default Plugs