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
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";

import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from '../../api/axios';

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const PHONE_REGEX = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/
const REGISTER_URL = '/clients';

const Register = () => {

  const navigate = useNavigate();

  const emailRef = useRef();
  const nombresRef = useRef();
  const apellidosRef = useRef();
  const numeroRef = useRef();
  const errRef = useRef()

  const [nombres, setNombres] = useState('');
  const [validNombres, setValidNombres] = useState(false);
  const [nombresFocus, setNombresFocus] = useState(false);

  const [apellidos, setApellidos] = useState('');
  const [validApellidos, setValidApellidos] = useState(false);
  const [apellidoFocus, setApellidosFocus] = useState(false);

  const [numero, setNumero] = useState('');
  const [validNumero, setValidNumero] = useState(false);
  const [numeroFocus, setNumeroFocus] = useState(false);

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [successResponse, setSuccessResponse] = useState('')

  useEffect(() => {
      //emailRef.current.focus();
  }, [])

  useEffect(() => {
      nombres.length >= 4  ? setValidNombres(true): setValidNombres(false)

  }, [nombres])

  useEffect(() => {
      apellidos.length >= 4 ? setValidApellidos(true): setValidApellidos(false)

  }, [apellidos])

  useEffect(() => {
      numero.length == 10 ? setValidNumero(true): setValidNumero(false)

  }, [numero])

  useEffect(() => {
      const result = EMAIL_REGEX.test(email);
      setValidEmail(result)
  }, [email])
  
  useEffect(() => {
      const result = PHONE_REGEX.test(numero);
      setValidNumero(result)
  }, [numero])

  useEffect(() => {
      const result = PWD_REGEX.test(pwd);
      setValidPwd(true)
      const match = pwd === matchPwd;
      setValidMatch(match);
  }, [pwd, matchPwd])

  useEffect(() => {
      setErrMsg('');
      setSuccessResponse('');
  }, [email, pwd, matchPwd, numero])

  const handleSubmit = async (e) => {
      e.preventDefault();
     /* const v1 = EMAIL_REGEX.test(email)
      const v2 = PWD_REGEX.test(pwd);
      if (!v1 || !v2) {
          setErrMsg('Entradas invalidas')
          return;
      }*/

      try {
          const client = {
              nombres: nombres,
              apellidos: apellidos,
              numero: numero,
              email: email,
              password: pwd
          }
          const response = await axios.post(REGISTER_URL, 
              client,
              {
                  headers: {
                      'Content-Type': 'application/json'
                  }
              })
          //console.log((response))
          setSuccessResponse(response.data.msg)
          setSuccess(true);   
          setTimeout(500)
          navigate('/login', { replace: true })
      } catch (error) {
          if (!error?.response) {
              setErrMsg('No Server Response')
          } else if (error.response?.status === 409) {
              console.log(error.response.data)
              setErrMsg(error.response.data.error)
          } else {
              console.log(error.response)
              setErrMsg('Registration failed')
          }
          errRef.current.focus();     
      }
  }

  return (
    <>
      <Col lg="6" md="8">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <Alert color="danger" className={errMsg ? "alert alert-danger" : "offscreen"}>
                {errMsg}
              </Alert>
              <Alert color="success" className={successResponse ? "alert alert-success" : "offscreen"}>
                {successResponse}
              </Alert>
              <h1>Registro</h1>
            </div>
            <Form role="form">
              <FormGroup onSubmit={handleSubmit}>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-single-02" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input 
                    placeholder="Nombres" 
                    type="text"
                    id="nombres"
                    className={validNombres ? "form-control is-valid" : "form-control is-invalid"}
                    ref={nombresRef}
                    autoComplete="off"
                    onChange={(e) => setNombres(e.target.value)}
                    required
                    aria-invalid={validNombres ? "false" : true}
                    aria-describedby="nomnote"
                    onFocus={() => setNombresFocus(true)}
                    onBlur={() => setNombresFocus(false)}
                    value={nombres}
                    />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-single-02" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input 
                    placeholder="Apellidos" 
                    type="text"
                    id="apellidos" 
                    className={validApellidos ? "form-control is-valid" : "form-control is-invalid"}
                    ref={apellidosRef}
                    autoComplete="off"
                    onChange={(e) => setApellidos(e.target.value)}
                    required
                    aria-invalid={validApellidos ? "false" : true}
                    aria-describedby="apnote"
                    onFocus={() => setApellidosFocus(true)}
                    onBlur={() => setApellidosFocus(false)}
                    value={apellidos}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-mobile-button" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input 
                    placeholder="Numero" 
                    type="tel" 
                    id="numero" 
                    className={validNumero ? "form-control is-valid" : "form-control is-invalid"}
                    ref={numeroRef}
                    autoComplete="off"
                    onChange={(e) => setNumero(e.target.value)}
                    required
                    aria-invalid={validNumero ? "false" : true}
                    aria-describedby="numnote"
                    onFocus={() => setNumeroFocus(true)}
                    onBlur={() => setNumeroFocus(false)}
                    value={numero}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    id="email" 
                    className={validEmail ? "form-control is-valid" : "form-control is-invalid"}
                    ref={emailRef}
                    autoComplete="off"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    aria-invalid={validEmail ? "false" : true}
                    aria-describedby="uidnote"
                    onFocus={() => setEmailFocus(true)}
                    onBlur={() => setEmailFocus(false)}
                    value={email}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Contraseña"
                    type="password"
                    id="password" 
                    className={validPwd ? "form-control is-valid" : "form-control is-invalid"}
                    onChange={(e) => setPwd(e.target.value)}
                    required
                    aria-invalid={validPwd ? "false" : true}
                    aria-describedby="pwdnote"
                    onFocus={() => setPwdFocus(true)}
                    onBlur={() => setPwdFocus(false)}
                    value={pwd}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Confirmar Contraseña"
                    type="password"
                    id="confirm_password" 
                    className={validMatch && matchPwd != '' ? "form-control is-valid" : "form-control is-invalid"}
                    onChange={(e) => setMatchPwd(e.target.value)}
                    required
                    aria-invalid={validMatch ? "false" : true}
                    aria-describedby="confirmnote"
                    onFocus={() => setMatchFocus(true)}
                    onBlur={() => setMatchFocus(false)}
                    value={matchPwd}
                  />
                </InputGroup>
              </FormGroup>
              {/*<div className="text-muted font-italic">
                <small>
                  password strength:{" "}
                  <span className="text-success font-weight-700">strong</span>
                </small>
              </div>
              <Row className="my-4">
                <Col xs="12">
                  <div className="custom-control custom-control-alternative custom-checkbox">
                    <input
                      className="custom-control-input"
                      id="customCheckRegister"
                      type="checkbox"
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customCheckRegister"
                    >
                      <span className="text-muted">
                        I agree with the{" "}
                        <a href="#pablo" onClick={(e) => e.preventDefault()}>
                          Privacy Policy
                        </a>
                      </span>
                    </label>
                  </div>
                </Col>
              </Row>*/}
              <div className="text-center">
                <Button className="mt-4" color="primary" type="submit" onClick={handleSubmit}>
                  Create account
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default Register;
