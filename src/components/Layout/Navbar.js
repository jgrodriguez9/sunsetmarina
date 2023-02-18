import React, { useState, useEffect } from "react";
import { Row, Col, Collapse } from "reactstrap";
import { Link, withRouter } from "react-router-dom";
import classname from "classnames";


const Navbar = props => {

  const [dashboard, setdashboard] = useState(false);
  const [ui, setui] = useState(false);
  const [app, setapp] = useState(false);
  const [email, setemail] = useState(false);
  const [ecommerce, setecommerce] = useState(false);
  const [crypto, setcrypto] = useState(false);
  const [project, setproject] = useState(false);
  const [task, settask] = useState(false);
  const [contact, setcontact] = useState(false);
  const [blog, setBlog] = useState(false);
  const [component, setcomponent] = useState(false);
  const [form, setform] = useState(false);
  const [table, settable] = useState(false);
  const [chart, setchart] = useState(false);
  const [icon, seticon] = useState(false);
  const [map, setmap] = useState(false);
  const [extra, setextra] = useState(false);
  const [invoice, setinvoice] = useState(false);
  const [auth, setauth] = useState(false);
  const [utility, setutility] = useState(false);

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
              isOpen={props.leftMenu}
              className="navbar-collapse"
              id="topnav-menu-content"
            >
              <ul className="navbar-nav">
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle arrow-none"
                    to="/inicio"
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
                    <i className="bx bx-customize me-2"></i>
                    Apps <div className="arrow-down"></div>
                  </Link>
                  <div className={classname("dropdown-menu", { show: app })}>
                    <Link to="/calendar" className="dropdown-item">
                      Calendar
                    </Link>
                    <Link to="/chat" className="dropdown-item">
                      Chat
                    </Link>
                    <Link to="/apps-filemanager" className="dropdown-item">
                      File Manager
                    </Link>
                    <div className="dropdown">
                      <Link
                        to="/#"
                        className="dropdown-item dropdown-toggle arrow-none"
                        onClick={e => {
                          e.preventDefault();
                          setemail(!email);
                        }}
                      >
                        Email <div className="arrow-down"></div>
                      </Link>
                      <div
                        className={classname("dropdown-menu", { show: email })}
                      >
                        <Link to="/email-inbox" className="dropdown-item">
                          Inbox
                        </Link>
                        <Link to="/email-read" className="dropdown-item">
                          Read Email
                        </Link>
                        <div className="dropdown">
                          <Link
                            className="dropdown-item dropdown-toggle arrow-none"
                            to="/#"
                            onClick={e => {
                              e.preventDefault();
                              setemail(!email);
                            }}
                          >
                            <span key="t-email-templates">Templates</span>{" "}
                            <div className="arrow-down"></div>
                          </Link>
                          <div
                            className={classname("dropdown-menu", {
                              show: email,
                            })}
                          >
                            <Link
                              to="/email-template-basic"
                              className="dropdown-item"
                            >
                              Basic Action
                            </Link>
                            <Link
                              to="/email-template-alert"
                              className="dropdown-item"
                            >
                              Alert Email
                            </Link>
                            <Link
                              to="/email-template-billing"
                              className="dropdown-item"
                            >
                              Billing Email
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="dropdown">
                      <Link
                        to="/#"
                        className="dropdown-item dropdown-toggle arrow-none"
                        onClick={e => {
                          e.preventDefault();
                          setecommerce(!ecommerce);
                        }}
                      >
                         Ecommerce{" "}
                        <div className="arrow-down"></div>
                      </Link>
                      <div
                        className={classname("dropdown-menu", {
                          show: ecommerce,
                        })}
                      >
                        <Link to="/ecommerce-products" className="dropdown-item">
                          Products
                        </Link>
                        <Link
                          to="/ecommerce-product-detail/1"
                          className="dropdown-item"
                        >
                          Product Detail
                        </Link>
                        <Link to="/ecommerce-orders" className="dropdown-item">
                          Orders
                        </Link>
                        <Link
                          to="/ecommerce-customers"
                          className="dropdown-item"
                        >
                          Customers
                        </Link>
                        <Link to="/ecommerce-cart" className="dropdown-item">
                          Cart
                        </Link>
                        <Link to="/ecommerce-checkout" className="dropdown-item">
                          Checkout
                        </Link>
                        <Link to="/ecommerce-shops" className="dropdown-item">
                          Shops
                        </Link>
                        <Link
                          to="/ecommerce-add-product"
                          className="dropdown-item"
                        >
                          Add Product
                        </Link>
                      </div>
                    </div>

                    <div className="dropdown">
                      <Link
                        to="/#"
                        className="dropdown-item dropdown-toggle arrow-none"
                        onClick={e => {
                          e.preventDefault();
                          setcrypto(!crypto);
                        }}
                      >
                        Crypto <div className="arrow-down"></div>
                      </Link>
                      <div
                        className={classname("dropdown-menu", { show: crypto })}
                      >
                        <Link to="/crypto-wallet" className="dropdown-item">
                          Wallet
                        </Link>
                        <Link to="/crypto-buy-sell" className="dropdown-item">
                          Buy/Sell
                        </Link>
                        <Link to="/crypto-exchange" className="dropdown-item">
                          Exchange
                        </Link>
                        <Link to="/crypto-lending" className="dropdown-item">
                          Lending
                        </Link>
                        <Link to="/crypto-orders" className="dropdown-item">
                          Orders
                        </Link>
                        <Link
                          to="/crypto-kyc-application"
                          className="dropdown-item"
                        >
                          KYC Application
                        </Link>
                        <Link to="/crypto-ico-landing" className="dropdown-item">
                          ICO Landing
                        </Link>
                      </div>
                    </div>

                    <div className="dropdown">
                      <Link
                        to="/#"
                        className="dropdown-item dropdown-toggle arrow-none"
                        onClick={e => {
                          e.preventDefault();
                          setproject(!project);
                        }}
                      >
                        Projects <div className="arrow-down"></div>
                      </Link>
                      <div
                        className={classname("dropdown-menu", {
                          show: project,
                        })}
                      >
                        <Link to="/projects-grid" className="dropdown-item">
                          Projects Grid
                        </Link>
                        <Link to="/projects-list" className="dropdown-item">
                          Projects List
                        </Link>
                        <Link to="/projects-overview" className="dropdown-item">
                          Project Overview
                        </Link>
                        <Link to="/projects-create" className="dropdown-item">
                          Create New
                        </Link>
                      </div>
                    </div>
                    <div className="dropdown">
                      <Link
                        to="/#"
                        className="dropdown-item dropdown-toggle arrow-none"
                        onClick={e => {
                          e.preventDefault();
                          settask(!task);
                        }}
                      >
                        Tasks <div className="arrow-down"></div>
                      </Link>
                      <div
                        className={classname("dropdown-menu", { show: task })}
                      >
                        <Link to="/tasks-list" className="dropdown-item">
                          Task List
                        </Link>
                        <Link to="/tasks-kanban" className="dropdown-item">
                          Kanban Board
                        </Link>
                        <Link to="/tasks-create" className="dropdown-item">
                          Create Task
                        </Link>
                      </div>
                    </div>
                    <div className="dropdown">
                      <Link
                        to="/#"
                        className="dropdown-item dropdown-toggle arrow-none"
                        onClick={e => {
                          e.preventDefault();
                          setcontact(!contact);
                        }}
                      >
                        Contacts <div className="arrow-down"></div>
                      </Link>
                      <div
                        className={classname("dropdown-menu", {
                          show: contact,
                        })}
                      >
                        <Link to="/contacts-grid" className="dropdown-item">
                          User Grid
                        </Link>
                        <Link to="/contacts-list" className="dropdown-item">
                          User List
                        </Link>
                        <Link to="/contacts-profile" className="dropdown-item">
                          Profile
                        </Link>
                      </div>
                    </div>
                    <div className="dropdown">
                      <Link
                        to="/#"
                        className="dropdown-item dropdown-toggle arrow-none"
                        onClick={e => {
                          e.preventDefault();
                          setBlog(!blog);
                        }}
                      >
                        Blog <div className="arrow-down" />
                      </Link>
                      <div
                        className={classname("dropdown-menu", {
                          show: blog,
                        })}
                      >
                        <Link to="/blog-list" className="dropdown-item">
                          Blog List
                        </Link>
                        <Link to="/blog-grid" className="dropdown-item">
                          Blog Grid
                        </Link>
                        <Link to="/blog-details" className="dropdown-item">
                          Blog Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </li> */}
              </ul>
            </Collapse>
          </nav>
        </div>
      </div>
    </React.Fragment>
  );
};

export default withRouter(Navbar);
