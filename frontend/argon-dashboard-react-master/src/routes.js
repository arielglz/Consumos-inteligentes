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
import Index from "views/Index.js";
import Devices from "components/Devices";
import Profile from "views/examples/Profile.js";
import Maps from "views/examples/Maps.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Tables from "views/examples/Tables.js";
import Icons from "views/examples/Icons.js";
import Locations from "components/Locations";
import Bills from "components/Bills";
import Consumptions from "components/Consumptions";
import Plugs from "components/Plugs";

var routes = [
  {
    path: "devices",
    name: "Dispositivos",
    icon: "ni ni-tv-2 text-primary",
    component: Devices,
    layout: "",
  },
  /*{
    path: "/icons",
    name: "Icons",
    icon: "ni ni-planet text-blue",
    component: Icons,
    layout: "/admin",
  }*/,
  {
    path: 'plugs',
    name: 'Plugs',
    icon: 'ni ni-button-power text-green',
    component: Plugs,
    layout: ""
  },
  {
    path: "locations",
    name: "Localidades",
    icon: "ni ni-pin-3 text-orange",
    component: Locations,
    layout: "",
  },
  {
    path: "bills",
    name: "Facturas",
    icon: "ni ni-money-coins text-yellow",
    component: Bills,
    layout: "",
  },
  /*{
    path: "/tables",
    name: "Tables",
    icon: "ni ni-bullet-list-67 text-red",
    component: Tables,
    layout: "/admin",
  }*/,
  {
    path: "consumptions",
    name: "Consumos",
    icon: "ni ni-chart-bar-32 text-info",
    component: Consumptions,
    layout: "",
  },
  /*{
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: Register,
    layout: "/auth",
  }*/,
];
export default routes;
