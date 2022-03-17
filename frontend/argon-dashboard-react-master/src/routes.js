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
import Profile from "views/examples/Profile.js";
import Maps from "views/examples/Maps.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Tables from "views/examples/Tables.js";
import Icons from "views/examples/Icons.js";

var routes = [
  {
    path: "",
    name: "Dispositivos",
    icon: "ni ni-tv-2 text-primary",
    component: Index,
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
    path: "",
    name: "Direcciones",
    icon: "ni ni-pin-3 text-orange",
    component: Maps,
    layout: "",
  },
  {
    path: "",
    name: "Facturas",
    icon: "ni ni-money-coins text-yellow",
    component: Profile,
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
    path: "",
    name: "Consumos",
    icon: "ni ni-chart-bar-32 text-info",
    component: Login,
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
