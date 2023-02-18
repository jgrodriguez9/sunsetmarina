import { useState } from "react";
import { Link } from "react-router-dom";

import logo from "../../assets/images/logo.png";
import logoLightSvg from "../../assets/images/logo-light.svg";
import ProfileMenu from "./ProfileMenu";

function Header(){
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
                      <img src={logo} alt="" height="22" />
                    </span>
                    <span className="logo-lg">
                      <img src={logo} alt="" height="70" />
                    </span>
                  </Link>
                </div>
    
                <button
                  type="button"
                  onClick={() => {}}
                  className="btn btn-sm px-3 font-size-16 d-lg-none header-item"
                  id="vertical-menu-btn"
                >
                  <i className="fa fa-fw fa-bars" />
                </button>
              </div>
              <div className="d-flex">
                <div className="dropdown d-inline-block d-lg-none ms-2">
                  <button
                    onClick={() => {
                      setsearch(!search);
                    }}
                    type="button"
                    className="btn header-item noti-icon "
                    id="page-header-search-dropdown"
                  >
                    <i className="mdi mdi-magnify" />
                  </button>
                  <div
                    className={
                      search
                        ? "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0 show"
                        : "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                    }
                    aria-labelledby="page-header-search-dropdown"
                  >
                    <form className="p-3">
                      <div className="form-group m-0">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search ..."
                            aria-label="Recipient's username"
                          />
                          <div className="input-group-append">
                            <button className="btn btn-primary" type="submit">
                              <i className="mdi mdi-magnify" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
    
                {/* <LanguageDropdown /> */}
    
                <div className="dropdown d-none d-lg-inline-block ms-1">
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
    
                {/* <NotificationDropdown /> */}
                <ProfileMenu />
                            
              </div>
            </div>
          </header>
        </>
      );
}

export default Header