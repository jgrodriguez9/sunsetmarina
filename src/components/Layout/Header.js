import { useState } from "react";
import { Link } from "react-router-dom";

import logo from "../../assets/images/logo.png";
import logoXs from "../../assets/images/logo-xs.png";
import ProfileMenu from "./ProfileMenu";
import NotificationDropdown from "./NotificationDropdown";

function Header({openMenu}){
    const [search, setsearch] = useState(false);

    function toggleFullscreen() {
        if (
          !document.fullscreenElement &&
          /* alternative standard method */ !document.mozFullScreenElement &&
          !document.webkitFullscreenElement
        ) {
          // current working methods
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
          } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
          } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(
              Element.ALLOW_KEYBOARD_INPUT
            );
          }
        } else {
          if (document.cancelFullScreen) {
            document.cancelFullScreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
          }
        }
    }

    return (
        <>
          <header id="page-topbar">
            <div className="navbar-header">
              <div className="d-flex">
    
                <div className="navbar-brand-box">
                  <Link to="/" className="logo logo-dark">
                    <span className="logo-sm">
                      <img src={logoXs} alt="" height="60" />
                    </span>
                    <span className="logo-lg">
                      <img src={logo} alt="" height="70" />
                    </span>
                  </Link>
                </div>
    
                <button
                  type="button"
                  onClick={openMenu}
                  className="btn btn-sm px-3 font-size-16 d-lg-none header-item"
                  id="vertical-menu-btn"
                >
                  <i className="fa fa-fw fa-bars" />
                </button>
              </div>
              <div className="d-flex">
    
                {/* <LanguageDropdown /> */}
    
                <div className="dropdown d-lg-inline-block ms-1">
                  <button
                    type="button"
                    onClick={() => {
                      toggleFullscreen();
                    }}
                    className="btn header-item noti-icon "
                    data-toggle="fullscreen"
                  >
                    <i className="bx bx-fullscreen" />
                  </button>
                </div>
    
                <NotificationDropdown />
                <ProfileMenu />
                            
              </div>
            </div>
          </header>
        </>
      );
}

export default Header