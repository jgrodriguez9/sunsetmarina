import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap";
import SimpleBar from "simplebar-react";

//Import images
import avatar4 from "../../assets/images/users/avatar-4.jpg";
import { getMyNotifcations } from "../../helpers/catalogos/notifications";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { addNotifications } from "../../redux/notificationsSlide";
import getRemainTime from "../../utils/getRemainTime";


function NotificationDropdown() {
    const [menu, setMenu] = useState(false)
    const dispatch = useDispatch();
    const {items, loading, page} = useSelector(state=>state.notification);

    
    useEffect(() => {
        const fecthApiNotifications = async () => {
            try {
                const response = await getMyNotifcations();
                dispatch(addNotifications(response))
                console.log(response)
            } catch (error) {
                console.log(error)
            }
        }
        if(page !== 'home'){
            fecthApiNotifications();
        }        
    }, [dispatch])
    
    return (
      <>
        <Dropdown
          isOpen={menu}
          toggle={() => setMenu(!menu)}
          className="dropdown d-inline-block"
          tag="li"
        >
          <DropdownToggle
            className="btn header-item noti-icon"
            tag="button"
            id="page-header-notifications-dropdown"
          >
            <i className={`bx bx-bell ${items.length > 0 ? 'bx-tada' : ''}`} />
            <span className="badge bg-danger rounded-pill">{items.length}</span>
          </DropdownToggle>

          {
            loading ? 
            <DropdownMenu className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0">
                <div className="p-3 text-center">
                    <div
                        className="spinner-border text-info m-1"
                        role="status"
                        >
                        <span className="sr-only">Loading...</span>
                    </div> 
                </div>
            </DropdownMenu> : 
            <DropdownMenu className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0">
                <div className="p-3">
                    <Row className="align-items-center">
                        <Col>
                        <h6 className="m-0">{`${items.length === 0 ? 'No hay notificaciones' : 'Notificaciones'}`}</h6>
                        </Col>
                    </Row>
                </div>
                {
                    items.length > 0 &&
                    <>
                        <SimpleBar style={{ height: "230px" }}>
                            <ul class="list-group list-group-flush text-reset notification-item">
                                {
                                    items.slice(0,5).map(item => (
                                        <li class="list-group-item" key={item.id}>
                                            <div>
                                                <h6 className="mt-0 mb-1">{item.concept}</h6>
                                                <div className="font-size-12 text-muted">
                                                <p className="mb-1">
                                                    {item.comments}
                                                </p>
                                                <p className="mb-0">                                                
                                                    {getRemainTime(item.reminderDate)}
                                                </p>
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                }                            
                            </ul>                        
                        </SimpleBar>
                        <div className="p-2 border-top d-grid">
                            <Link className="btn btn-sm btn-link font-size-14 text-center" to="/notifications">
                                <i className="mdi mdi-arrow-right-circle me-1"></i> <span key="t-view-more">Ver todas</span>
                            </Link>
                        </div>
                    </>
                }
            </DropdownMenu>
          }
        </Dropdown>
      </>
    )
  }

export default React.memo(NotificationDropdown)
