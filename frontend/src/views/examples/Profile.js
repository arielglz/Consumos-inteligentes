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

// reactstrap components
import {
  Alert,
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader.js";
import jwtDecode from "jwt-decode";
import axios from '../../api/axios'
import { useEffect, useState } from "react";

const Profile = () => {

  const token = localStorage.getItem('auth-token');
  const decryptedToken = jwtDecode(token);
  const [clientInfo, setClientInfo] = useState({
    id_cliente: '',
    nombres: '',
    apellidos: '',
    numero: '',
    email: ''
  })
  const [isDisabled, setIsDisabled] = useState(true)
  const [nombres, setNombres] = useState('');
  const [validNombres, setValidNombres] = useState();
  const [nombresFocus, setNombresFocus] = useState();

  const [apellidos, setApellidos] = useState('');
  const [validApellidos, setValidApellidos] = useState();
  const [apellidoFocus, setApellidosFocus] = useState();

  const [numero, setNumero] = useState('');
  const [validNumero, setValidNumero] = useState();
  const [numeroFocus, setNumeroFocus] = useState();

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState();
  const [emailFocus, setEmailFocus] = useState();

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState();
  const [pwdFocus, setPwdFocus] = useState();

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState();
  const [matchFocus, setMatchFocus] = useState();

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState();
  const [successResponse, setSuccessResponse] = useState('')

  useEffect(() => {
    getClientInfo()
  }, [])

  const getClientInfo = async () => {
    try {
      const clientInfoResponse = await axios.get(`/clients/data/${decryptedToken.id}`, {
        headers: { 
          'Content-Type': 'application/json',
          'auth-token': token
        }
      })
      console.log(clientInfoResponse.data[0])
      setNombres(clientInfoResponse.data[0].nombres)
      setApellidos(clientInfoResponse.data[0].apellidos)
      setNumero(clientInfoResponse.data[0].numero)
      setEmail(clientInfoResponse.data[0].email)
      setClientInfo({
        id_cliente: clientInfoResponse.data[0].id_cliente,
        nombres: clientInfoResponse.data[0].nombres,
        apellidos: clientInfoResponse.data[0].apellidos,
        numero: clientInfoResponse.data[0].numero,
        email: clientInfoResponse.data[0].email
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleEdit = (e) => {
    e.preventDefault();
    isDisabled ? setIsDisabled(false) : setIsDisabled(true)
    
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const client = {
          nombres: nombres,
          apellidos: apellidos,
          numero: numero,
          email: email,
          password: pwd
      }
      const response = await axios.put(`/clients/${decryptedToken.id}`, 
          client,
          {
              headers: {
                  'Content-Type': 'application/json'
              }
          })
      //console.log((response))
      setSuccessResponse(response.data.message)
      setSuccess(true);   
      //setTimeout(() => {console.log('something')}, 5000);
      //navigate('/login', { replace: true })
  } catch (error) {
      if (!error?.response) {
          setErrMsg('No Server Response')
      } else if (error.response?.status === 409) {
          console.log(error.response.data)
          setErrMsg(error.response.data.error)
      } else {
          console.log(error.response)
          setErrMsg('Update failed')
      }
      //errRef.current.focus();     
  }
  }
    useEffect(() => {
      //const result = PWD_REGEX.test(pwd);
      setValidPwd(true)
      const match = pwd === matchPwd;
      setValidMatch(match);
  }, [pwd, matchPwd])

  useEffect(() => {
      setErrMsg('');
      setSuccessResponse('');
  }, [email, pwd, matchPwd, numero])

  return (
    <>
      {/*<UserHeader />*/}
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          {/*<Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow">
              <Row className="justify-content-center">
                <Col className="order-lg-2" lg="3">
                  <div className="card-profile-image">
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      <img
                        alt="..."
                        className="rounded-circle"
                        src={
                          require("../../assets/img/theme/team-4-800x800.jpg")
                            .default
                        }
                      />
                    </a>
                  </div>
                </Col>
              </Row>
              <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                <div className="d-flex justify-content-between">
                  <Button
                    className="mr-4"
                    color="info"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    size="sm"
                  >
                    Connect
                  </Button>
                  <Button
                    className="float-right"
                    color="default"
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                    size="sm"
                  >
                    Message
                  </Button>
                </div>
              </CardHeader>
              <CardBody className="pt-0 pt-md-4">
                <Row>
                  <div className="col">
                    <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                      <div>
                        <span className="heading">22</span>
                        <span className="description">Friends</span>
                      </div>
                      <div>
                        <span className="heading">10</span>
                        <span className="description">Photos</span>
                      </div>
                      <div>
                        <span className="heading">89</span>
                        <span className="description">Comments</span>
                      </div>
                    </div>
                  </div>
                </Row>
                <div className="text-center">
                  <h3>
                    Jessica Jones
                    <span className="font-weight-light">, 27</span>
                  </h3>
                  <div className="h5 font-weight-300">
                    <i className="ni location_pin mr-2" />
                    Bucharest, Romania
                  </div>
                  <div className="h5 mt-4">
                    <i className="ni business_briefcase-24 mr-2" />
                    Solution Manager - Creative Tim Officer
                  </div>
                  <div>
                    <i className="ni education_hat mr-2" />
                    University of Computer Science
                  </div>
                  <hr className="my-4" />
                  <p>
                    Ryan — the name taken by Melbourne-raised, Brooklyn-based
                    Nick Murphy — writes, performs and records all of his own
                    music.
                  </p>
                  <a href="#pablo" onClick={(e) => e.preventDefault()}>
                    Show more
                  </a>
                </div>
              </CardBody>
            </Card>
          </Col>*/}
          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Mi cuenta</h3>
                  </Col>
                  <Col className="text-right" xs="4">
                    <Button
                      color="primary"
                      onClick={(e) => handleEdit(e)}
                      size="sm"
                    >
                      Editar
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className="heading-small text-muted mb-4">
                    Información del cliente
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label">
                            Nombres
                          </label>
                          <Input
                            className="form-control-alternative"
                            disabled={isDisabled}
                            type="text"
                            value={nombres}
                            onChange={(e) => setNombres(e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" >
                            Apellidos
                          </label>
                          <Input
                            className="form-control-alternative"
                            disabled={isDisabled}
                            type="text"
                            value={apellidos}
                            onChange={(e) => setApellidos(e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" >
                            Telefono
                          </label>
                          <Input
                            className="form-control-alternative"
                            disabled={isDisabled}
                            type="phone"
                            value={numero}
                            onChange={(e) => setNumero(e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label">
                            Email
                          </label>
                          <Input
                            className="form-control-alternative"
                            disabled={isDisabled}
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" >
                            Nueva Contraseña
                          </label>
                          <Input
                            className="form-control-alternative"
                            placeholder="Contraseña"
                            disabled={isDisabled}
                            type="password"
                            value={pwd}
                            onChange={(e) => setPwd(e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" >
                            Confirmar Contraseña
                          </label>
                          <Input
                            placeholder="Confirmar contraseña"
                            disabled={isDisabled}
                            type="password"
                            value={matchPwd}
                            className="form-control-alternative"
                            onChange={(e) => setMatchPwd(e.target.value)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xs='10'>
                      <Button 
                        className="mt-2 text-right" 
                        color="success" 
                        onClick={(e) => handleSubmit(e)}
                        disabled={!validMatch ? true : false}
                          >
                        Actualizar
                      </Button>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
          <Col className="order-xl-1" xl="4">
            <Alert color="danger" className={errMsg ? "alert alert-danger alert-shown" : "alert-hidden"} >
              <b>{errMsg}</b>
            </Alert>
            <Alert color="success" className={success ? "alert alert-success alert-shown" : "alert-hidden"} onTransitionEnd={() => setSuccess(false)}>
              <b>{successResponse}</b>
            </Alert>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
