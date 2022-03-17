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
import {useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthLayout from "../../layouts/Auth.js";
import useAuth from '../../hooks/useAuth';
import axios from '../../api/axios'

const LOGIN_URL = '/login';

const Login = () => {

  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = "/dashboard"

  //const userRef = useRef();
  //const errRef = useRef();

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [successResponse, setSuccessResponse] = useState('')

  useEffect(() => {
      //userRef.current.focus();
  }, []);

  useEffect(() => {
      setErrMsg('');
  }, [email, pwd])

  const handleSubmit = async (e) => {
      e.preventDefault();
      
      try {

          const response = await axios.post(LOGIN_URL, 
              JSON.stringify({email: email, password: pwd}),
              {
                  headers: { 
                      'Content-Type': 'application/json',
                  }
              }
          )
          console.log(JSON.stringify(response))

          const accessToken = response.data.token
          setAuth({ email, pwd, accessToken })
          setEmail('');
          setPwd('');
          setSuccessResponse(response.data.msg)
          localStorage.setItem('auth-token', accessToken)
          setTimeout(50000)
          navigate(from, { replace: true })
          //setSucess(true);
      } catch (error) {
          console.log(error)
          if (!error?.response) {
              setErrMsg('No server response');
          } else if (error.response?.status === 400) {
              setErrMsg('El usuario o clave no existe');
          } else if (error.response?.status === 401) {
              setErrMsg('Acceso denegado, favor de verificar password');
          } else {
              setErrMsg('Login fallido');
          }
          //errRef.current.focus();
      }
  }

  return (
    <>
    <Col lg="5" md="7">
      <Card className="bg-secondary shadow border-0">
        <CardBody className="px-lg-5 py-lg-5">
          <div className="text-center text-muted mb-4">
            {/*ref={errRef}*/}
            <Alert color="danger" className={errMsg ? "alert alert-danger" : "offscreen"}>
              {errMsg}
            </Alert>
            <Alert color="success" className={successResponse ? "alert alert-success" : "offscreen"}>
              {successResponse}
            </Alert>
            <h2>Acceder con credenciales</h2>
          </div>
          <Form role="form">
            <FormGroup className="mb-3" onSubmit={handleSubmit}>
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-email-83" />
                  </InputGroupText>
                </InputGroupAddon>
                {/*ref={userRef}*/}
                <Input
                  placeholder="Email"
                  type="email"
                  autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required />
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
                  autoComplete="off"
                  onChange={(e) => setPwd(e.target.value)}
                  value={pwd}
                  required />
              </InputGroup>
            </FormGroup>
            {/*<div className="custom-control custom-control-alternative custom-checkbox">
              <input
                className="custom-control-input"
                id=" customCheckLogin"
                type="checkbox" />
              <label
                className="custom-control-label"
                htmlFor=" customCheckLogin"
              >
                <span className="text-muted">Remember me</span>
              </label>
            </div>*/}
            <div className="text-center">
              <Button className="my-4" color="primary" type="submit" onClick={handleSubmit}>
                Sign in
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
      <Row className="mt-3">
        <Col xs="6">
          <a
            className="text-light"
            href="#pablo"
            onClick={(e) => e.preventDefault()}
          >
            <small>Olvide mi contraseña</small>
          </a>
        </Col>
        <Col className="text-right" xs="6">
          {/*<a
            className="text-light"
            href="#pablo"
            onClick={(e) => e.preventDefault()}
          >
            <small>Crear nueva cuenta</small>
          </a>*/}
          <Link to="/auth/register" className="text-light"><small>Crear nueva cuenta</small></Link>
        </Col>
      </Row>
    </Col></>
  );
};

export default Login;
