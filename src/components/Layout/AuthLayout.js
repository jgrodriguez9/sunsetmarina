import { useState } from "react";
import { withRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Footer from "./Footer";
import Header from "./Header";
import Navbar from "./Navbar";

const AuthLayout = props => {

  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const openMenu = () => {
    setIsMenuOpened(!isMenuOpened);
  }

    return (
        <>      
          <div id="layout-wrapper">
            <Header 
              openMenu={openMenu} 
              isMenuOpened={isMenuOpened}
            />
            <Navbar 
              isMenuOpened={isMenuOpened}               
            />
            {/* <Sidebar /> */}
            <div className="main-content">{props.children}</div>
            <Footer />
          </div>
          <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable={false}
              pauseOnHover
              theme="colored"
          />
        </>
      );
}

export default withRouter(AuthLayout);