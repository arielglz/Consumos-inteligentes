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
import { useNavigate, Link } from "react-router-dom";
import axios from '../../api/axios';

const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const PHONE_REGEX = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/
const REGISTER_URL = '/clients';

const ForgotPwd = () => {

  const navigate = useNavigate();

  const errRef = useRef()

  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState();

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState();

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState();

  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState();
  const [failed, setFailed] = useState();
  const [successResponse, setSuccessResponse] = useState('')

  useEffect(() => {
      const result = EMAIL_REGEX.test(email);
      setValidEmail(result)
  }, [email])
  
  useEffect(() => {
      const result = PWD_REGEX.test(pwd);
      setValidPwd(true)
      const match = pwd === matchPwd;
      setValidMatch(match);
  }, [pwd, matchPwd])

  useEffect(() => {
      setErrMsg('');
      setSuccessResponse('');
  }, [email, pwd, matchPwd])

  const handleSubmit = async (e) => {
      e.preventDefault();

      try {
          const client = {
              email: email,
              password: matchPwd
          }
          const response = await axios.put('/clients/', 
              client,
              {
                  headers: {
                      'Content-Type': 'application/json'
                  }
              })
          //console.log((response))
          setSuccessResponse(response.data.message)
          setSuccess(true);   
      } catch (error) {
          if (!error?.response) {
              setErrMsg('No Server Response')
              setFailed(true)
          } else if (error.response?.status === 409) {
              setErrMsg(error.response.data.error)
              setFailed(true)
          } else {
              console.log(error.response)
              setErrMsg('Ha fallado la actualización de la contraseña')
              setFailed(true)
          }   
      }
  }

  return (
    <>
      <Col lg="8" md="8">
        <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="5">
                    <h2 className="mb-0">Restablecer clave</h2>
                  </Col>
                  <Col xs="6">
                    <Row className="align-items-center">
                      <Alert color="danger" className={failed ? "alert alert-danger alert-shown" : "alert-hidden"} onTransitionEnd={() => setFailed(false)} >
                          <b>{errMsg}</b>
                      </Alert>
                      <Alert color="success" className={success ? "alert alert-success alert-shown" : "alert-hidden"} onTransitionEnd={() => setSuccess(false)}>
                        <b>{successResponse}</b>
                      </Alert>
                    </Row>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label">
                            Email
                          </label>
                          <Input
                            placeholder="micorreo@ejemplo.com"
                            id="email" 
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            value={email}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup >
                          <label
                            className="form-control-label"
                            htmlFor="input-password"
                          >
                            Contraseña
                          </label>
                          <Input
                            placeholder="Contraseña"
                            type="password"
                            id="password" 
                            className="form-control"
                            onChange={(e) => setPwd(e.target.value)}
                            required
                            value={pwd}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup className={validMatch && matchPwd != ''  ? "has-success" : "has-danger"}>
                          <label
                            className="form-control-label"
                            htmlFor="input-confirmpassword"
                          >
                            Confirmar Contraseña
                          </label>
                          <Input
                            placeholder="Confirmar Contraseña"
                            type="password"
                            id="confirm_password" 
                            className={validMatch && matchPwd != '' ? "form-control is-valid" : "form-control is-invalid"}
                            onChange={(e) => setMatchPwd(e.target.value)}
                            required
                            value={matchPwd}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Button className="mt-4" color="primary" 
                            type="submit" onClick={handleSubmit}
                            disabled={!validMatch || !validEmail || matchPwd === '' ? true : false} >
                      Resetear contraseña
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
        <Row className="mt-3">
          <Col className="text-left" xs="6">
            <Link to="/auth/login"><small className="text-light">Ir al Login</small></Link>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default ForgotPwd;
