import React, { useState, useEffect } from "react";
import { Collapse } from "reactstrap";
import { Link, withRouter } from "react-router-dom";
import classname from "classnames";


const Navbar = props => {
  const [app, setapp] = useState(false);

  useEffect(() => {
    var matchingMenuItem = null;
    var ul = document.getElementById("navigation");
    var items = ul.getElementsByTagName("a");
    for (var i = 0; i < items.length; ++i) {
      if (props.location.pathname === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  });

  function activateParentDropdown(item) {
    item.classList.add("active");
    const parent = item.parentElement;
    if (parent) {
      parent.classList.add("active"); // li
      const parent2 = parent.parentElement;
      parent2.classList.add("active"); // li
      const parent3 = parent2.parentElement;
      if (parent3) {
        parent3.classList.add("active"); // li
        const parent4 = parent3.parentElement;
        if (parent4) {
          parent4.classList.add("active"); // li
          const parent5 = parent4.parentElement;
          if (parent5) {
            parent5.classList.add("active"); // li
            const parent6 = parent5.parentElement;
            if (parent6) {
              parent6.classList.add("active"); // li
            }
          }
        }
      }
    }
    return false;
  }

  return (
    <React.Fragment>
      <div className="topnav">
        <div className="container-fluid">
          <nav
            className="navbar navbar-light navbar-expand-lg topnav-menu"
            id="navigation"
          >
            <Collapse
              isOpen={props.isMenuOpened}
              className="navbar-collapse"
              id="topnav-menu-content"
            >
              <ul className="navbar-nav">
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle arrow-none"
                    to="/dashboard"
                  >
                    <i className="bx bx-home-circle me-2"></i> Inicio
                  </Link>
                </li>

                {/* <li className="nav-item dropdown">
                  <Link
                    to="/#"
                    onClick={e => {
                      e.preventDefault();
                      setui(!ui);
                    }}
                    className="nav-link dropdown-toggle arrow-none"
                  >
                    <i className="bx bx-tone me-2"></i>
                    UI Elements <div className="arrow-down"></div>
                  </Link>
                  <div
                    className={classname(
                      "dropdown-menu mega-dropdown-menu dropdown-menu-left dropdown-mega-menu-xl",
                      { show: ui }
                    )}
                  >
                    <Row>
                        <Col lg={4}>
                          <div>
                            <Link to="/ui-alerts" className="dropdown-item">
                              Alerts
                            </Link>
                            <Link to="/ui-buttons" className="dropdown-item">
                              Buttons
                            </Link>
                            <Link to="/ui-cards" className="dropdown-item">
                              Cards
                            </Link>
                            <Link to="/ui-carousel" className="dropdown-item">
                              Carousel
                            </Link>
                            <Link to="/ui-dropdowns" className="dropdown-item">
                              Dropdowns
                            </Link>
                            <Link to="/ui-grid" className="dropdown-item">
                              Grid
                            </Link>
                            <Link to="/ui-images" className="dropdown-item">
                              Images
                            </Link>
                            <Link to="/ui-lightbox" className="dropdown-item">
                              Lightbox
                            </Link>
                          </div>
                        </Col>
                        <Col lg={4}>
                          <div>
                            <Link to="/ui-modals" className="dropdown-item">
                              Modals
                            </Link>
                            <Link to="/ui-offcanvas" className="dropdown-item">
                              Offcanvas
                            </Link>
                            <Link to="/ui-rangeslider" className="dropdown-item">
                              Range Slider
                            </Link>
                            <Link
                              to="/ui-session-timeout"
                              className="dropdown-item"
                            >
                              Session Timeout
                            </Link>
                            <Link to="/ui-progressbars" className="dropdown-item">
                              Progress Bars
                            </Link>
                            <Link to="/ui-placeholders" className="dropdown-item">
                              Placeholders
                            </Link>
                            <Link to="/ui-sweet-alert" className="dropdown-item">
                              Sweet-Alert
                            </Link>
                            <Link
                              to="/ui-tabs-accordions"
                              className="dropdown-item"
                            >
                              Tabs & Accordions
                            </Link>
                          </div>
                        </Col>
                        <Col lg={4}>
                          <div>
                            <Link to="/ui-typography" className="dropdown-item">
                              Typography
                            </Link>
                            <Link to="/ui-toasts" className="dropdown-item">
                              Toasts
                            </Link>
                            <Link to="/ui-video" className="dropdown-item">
                              Video
                            </Link>
                            <Link to="/ui-general" className="dropdown-item">
                              General
                            </Link>
                            <Link to="/ui-colors" className="dropdown-item">
                              Colors
                            </Link>
                            <Link to="/ui-rating" className="dropdown-item">
                              Rating
                            </Link>
                            <Link to="/ui-notifications" className="dropdown-item">
                              Notifications
                            </Link>
                            <Link to="/ui-breadcrumb" className="dropdown-item">
                              Breadcrumb
                            </Link>
                          </div>
                        </Col>
                      </Row>
                  </div>
                </li> */}

                {/* <li className="nav-item dropdown">
                  <Link
                    to="/#"
                    onClick={e => {
                      e.preventDefault();
                      setapp(!app);
                    }}
                    className="nav-link dropdown-togglez arrow-none"
                  >
                    <i className="fas fa-align-justify me-2"></i>
                    Slips <div className="arrow-down"></div>
                  </Link>
                  <div className={classname("dropdown-menu", { show: app })}>
                    <Link to="/slip" className="dropdown-item">
                      Ver muelle
                    </Link>
                  </div>
                </li> */}
                <li className="nav-item dropdown">
                  <Link
                    to="/#"
                    onClick={e => {
                      e.preventDefault();
                      setapp(!app);
                    }}
                    className="nav-link dropdown-togglez arrow-none"
                  >
                    <i className="fas fa-th me-2"></i>
                    Catálogos <div className="arrow-down"></div>
                  </Link>
                  <div className={classname("dropdown-menu", { show: app })}>
                    <Link to="/boadtype" className="dropdown-item">
                      Tipo de embarcación
                    </Link>
                  </div>
                </li>
              </ul>
            </Collapse>
          </nav>
        </div>
      </div>
    </React.Fragment>
  );
};

export default withRouter(Navbar);
