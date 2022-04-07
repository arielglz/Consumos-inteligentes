import { React, useState } from "react";

// reactstrap components
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

import { useEffect } from "react";
import axios from '../api/axios'
import jwtDecode from "jwt-decode";

const Locations = (props) => {
  const token = localStorage.getItem('auth-token');
  const decryptedToken = jwtDecode(token);
  const [clientLocations, setClientLocations] = useState([])

  const [locationAlias, setLocationAlias] = useState('');
  const [locationDireccion, setLocationDireccion] = useState('');
  const [locationMunicpio, setLocationMunicipio] = useState('');
  const [locationCiudad, setLocationCiudad] = useState('');
  const [locationProvincia, setLocationProvincia] = useState('');
  const [locationPais, setLocationPais] = useState('');
  
  const [errMsg, setErrMsg] = useState('');
  const [successResponse, setSuccessResponse] = useState('')
  const [willUpdate, setWillUpdate] = useState(false);
  const [locationID, setLocationID] = useState('')

  const [show, setShow] = useState(false);

  const handleShow = () => {
    setLocationAlias('')
    setLocationDireccion('')
    setLocationMunicipio('')
    setLocationCiudad('')
    setLocationProvincia('')
    setLocationPais('')
    setSuccessResponse('')
    setErrMsg('')
    setShow(!show);
  }

  useEffect (() => {
    getLocations()
  }, []) 

  
  const getLocations = async () => {
    try {

      const clientLocationsResponse = await axios.get('/locations/client/'+ decryptedToken.id, {
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

  const fillTable = () => {
    return clientLocations.map((location, index) => {
      const { id_localidad, alias, direccion, municipio, ciudad, provincia, pais } = location
      return (
        <tr key={id_localidad}>
          <td>{alias}</td>
          <td>{direccion}</td>
          <td>{municipio}</td>
          <td>{ciudad}</td>
          <td>{provincia}</td>
          <td>{pais}</td>
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
                    updateLocation(id_localidad)
                  }}
                >
                  Actualizar
                </DropdownItem>
                <DropdownItem
                  onClick={() => deleteLocation(id_localidad)}
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

    const location = {
      alias: locationAlias,
      pais: locationPais,
      provincia: locationProvincia,
      municipio: locationMunicpio,
      ciudad: locationCiudad,
      direccion: locationDireccion,
      id_cliente: decryptedToken.id
    }

    console.log(location)
    try {
      const registrationResponse = await axios.post('/locations', location, {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token
            }
      })
      console.log(registrationResponse.data.msg)
      setSuccessResponse(registrationResponse.data.msg)
      getLocations()
    } catch (error) {
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

  const deleteLocation = async (id) => {
      try {
        const deleteResponse = await axios.delete('/locations/' + id, {
          headers: {
            'Content-Type': 'application/json',
            'auth-token': token
          }
        })
        console.log(deleteResponse.data)
        getLocations()
      } catch (error) {
        console.log(error)
      }
    //}
  }

  const updateLocation = async (id) => {
    setLocationID(id)
    setWillUpdate(true)
    handleShow()
    try {
      const responseDeviceByID = await axios.get('/locations/' + id, {
        headers: {
         'Content-Type': 'application/json',
         'auth-token': token
       }
      })
      console.log('Get it from update: ', responseDeviceByID.data[0])
      setLocationAlias(responseDeviceByID.data[0].alias)
      setLocationPais(responseDeviceByID.data[0].pais)
      setLocationProvincia(responseDeviceByID.data[0].provincia)
      setLocationMunicipio(responseDeviceByID.data[0].municipio)
      setLocationCiudad(responseDeviceByID.data[0].ciudad)
      setLocationDireccion(responseDeviceByID.data[0].direccion)
    } catch (error) {
      console.log(error)
    }
  }

  const submitUpdate = async(id) => {
   const location = {
    alias: locationAlias,
    pais: locationPais,
    provincia: locationProvincia,
    municipio: locationMunicpio,
    ciudad: locationCiudad,
    direccion: locationDireccion,
    id_cliente: decryptedToken.id
  }
    
    try {
      console.log(location)
      const updateResponse = await axios.put('/locations/' + id, location, {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token
            }
      })
      setSuccessResponse(updateResponse.data.msg)
      getLocations()
    } catch (error) {
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
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="10">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Mis localidades</h3>
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
                              <h2>{willUpdate ? 'Actualizar localidad' : 'Añadir localidad'}</h2>
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
                                  placeholder="Alias"
                                  type="text"
                                  autoComplete="off"
                                  onChange={(e) => setLocationAlias(e.target.value)}
                                  value={locationAlias}
                                /> 
                              </FormGroup>
                              <FormGroup>
                                <Input
                                  className="form-control-alternative"
                                  placeholder="Pais"
                                  type="text"
                                  autoComplete="on"
                                  onChange={(e) => setLocationPais(e.target.value)}
                                  value={locationPais}
                                 /> 
                              </FormGroup>
                              <FormGroup>
                                <Input
                                  className="form-control-alternative"
                                  placeholder="Provincia"
                                  type="text"
                                  autoComplete="on"
                                  onChange={(e) => setLocationProvincia(e.target.value)}
                                  value={locationProvincia}
                                  /> 
                              </FormGroup>
                              <FormGroup>
                                <Input
                                  className="form-control-alternative"
                                  placeholder="Ciudad"
                                  type="text"
                                  autoComplete="on"
                                  onChange={(e) => setLocationCiudad(e.target.value)}
                                  value={locationCiudad}
                                  /> 
                              </FormGroup>
                              <FormGroup>
                                <Input
                                  className="form-control-alternative"
                                  placeholder="Municipio"
                                  type="text"
                                  autoComplete="on"
                                  onChange={(e) => setLocationMunicipio(e.target.value)}
                                  value={locationMunicpio}
                                /> 
                              </FormGroup>
                              <FormGroup>
                                <Input
                                  className="form-control-alternative"
                                  placeholder="Direccion"
                                  rows="2"
                                  type="textarea"
                                  autoComplete="on"
                                  onChange={(e) => setLocationDireccion(e.target.value)}
                                  value={locationDireccion}
                                /> 
                              </FormGroup>
                              <div className="text-center">
                                <Button color="primary" type="button" onClick={willUpdate 
                                  ? (e) => {
                                    e.preventDefault()
                                    submitUpdate(locationID)
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
                    <th scope="col">Alias</th>
                    <th scope="col">Direccion</th>
                    <th scope="col">Municipio</th>
                    <th scope="col">Ciudad</th>
                    <th scope="col">Provincia</th>
                    <th scope="col">Pais</th>
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

export default Locations;
