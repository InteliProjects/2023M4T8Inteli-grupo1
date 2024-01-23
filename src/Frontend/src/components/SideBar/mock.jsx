import { MdMessage } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { FaHome } from "react-icons/fa";
import { BsFileBarGraphFill } from "react-icons/bs";

export const routes = [
    {
      path: "/dash/",
      name: "Home",
      icon: <FaHome />,
    },
    
    {
      path: "/dash/graphs",
      name: "Gráficos",
      icon:<BsFileBarGraphFill />
    },

  ];
