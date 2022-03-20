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
import {React, useState, useEffect} from "react";
import { useLocation, Route, Routes, Navigate, Outlet } from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import Index from "views/Index";

import routes from "routes.js";
import jwtDecode from "jwt-decode";
import axios from '../api/axios'

const Admin = (props) => {
  //const mainContent = React.useRef(null);
  const location = useLocation();
  const [clientEmail, setClientEmail] = useState('');
  const [clientData, setClientData] = useState({});
  const [clientDevices, setClientDevices] = useState([]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    //mainContent.current.scrollTop = 0;

    const token = localStorage.getItem('auth-token');
    const data = jwtDecode(token);
    let clData = [];
    setClientEmail(data.name)

    const getClientDevices = async () => {
      try {
        const clientDataResponse = await axios.get('clients/'+ data.name, {
            headers: { 
              'Content-Type': 'application/json',
          }
        })
        setClientData(clientDataResponse.data[0])
        const clientDevicesResponse = await axios.get('/devices/client/'+ clientDataResponse.data[0].id_cliente, {
          headers: { 
            'Content-Type': 'application/json',
            'auth-token': token
        }
      })

       //setClientData(response.data[0].id_cliente)
       //clData = response.data[0]
       //console.log(clientData)
       //return response.data[0]
       //console.log(clientDevicesResponse.data)
       setClientDevices(clientDevicesResponse.data)
  
      } catch (error) {
        console.log(error)
      }
    }

    getClientDevices()

  }, [location]);
/*
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        props.location.pathname.indexOf(routes[i].layout + routes[i].path) !==
        -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };*/

  return (
    <>
      <Sidebar
        {...props}
        routes={routes}
        logo={{
          innerLink: "/admin/index",
          imgSrc: require("../assets/img/brand/argon-react.png").default,
          imgAlt: "...",
        }}
      />
      {/* ref={mainContent} */}
      <div className="main-content">
        <AdminNavbar
          {...props}
          clientEmail={clientEmail}
          brandText={'Brand'}
        />
        <Outlet />
        {/*<Index clientDevices={clientDevices}/>*/}
          {/*brandText={getBrandText(props.location.pathname)*/}
          {/*getRoutes(routes)*/}
          {/*<Navigate path="*" to="/admin/index" />*/}
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
};

export default Admin;
