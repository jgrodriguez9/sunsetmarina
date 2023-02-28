import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { clearMessage } from "../../redux/messageSlice";
import Footer from "./Footer";
import Header from "./Header";
import Navbar from "./Navbar";

const AuthLayout = props => {
  const message = useSelector((state) => state.message)
  const dispatch = useDispatch();

  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const openMenu = () => {
    setIsMenuOpened(!isMenuOpened);
  }

  useEffect(() => {
    if(message.type){
      switch(message.type){
        case 'success':
          toast.success(message.message, {
            onClose: () => {
              dispatch(clearMessage())
            }
          })
          break;
        case 'error':
          toast.error(message.message, {
            onClose: () => {
              dispatch(clearMessage())
            }
          })
          break;
        case 'warning':
          toast.warning(message.message, {
            onClose: () => {
              dispatch(clearMessage())
            }
          })
          break;
        case 'info':
          toast.info(message.message, {
            onClose: () => {
              dispatch(clearMessage())
            }
          })
          break;
        default:
          return;
      }      
    } 
  }, [message])

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