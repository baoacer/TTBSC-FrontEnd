import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import routers from "./routers";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCartPlus, faEye } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons"; // Import the angle-left and angle-right icons
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { faEye as faEyeSolid } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import {
  faHouseChimney,
  faMagnifyingGlass,
  faStore,
  faAngleDown,
  faBagShopping,
  faCaretDown,
  faBookmark as faCart,
} from "@fortawesome/free-solid-svg-icons";
import { faUser, faBookmark } from "@fortawesome/free-regular-svg-icons"; // For regular icons

library.add(
  faCartPlus,
  faTrashCan,
  faAngleLeft,
  faAngleRight,
  faCircleXmark,
  faStar,
  faUserCircle,
  faShoppingCart,
  faEyeSolid,
  faEyeSlash,
  faCaretRight,
  faHouseChimney,
  faMagnifyingGlass,
  faStore,
  faAngleDown,
  faArrowLeft,
  faLocationDot,
  faBagShopping,
  faUser,
  faCaretDown,
  faBookmark,
  faCart
);

createApp(App)
  .use(routers)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
