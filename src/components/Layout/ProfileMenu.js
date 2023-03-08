import { useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
  } from "reactstrap"

function ProfileMenu(){
    const [menu, setMenu] = useState(false)
    const user = useSelector((state) => state.user)
    return (
        <>
          <Dropdown
            isOpen={menu}
            toggle={() => setMenu(!menu)}
            className="d-inline-block"
          >
            <DropdownToggle
              className="btn header-item "
              id="page-header-user-dropdown"
              tag="button"
            >
              <span className="d-xl-inline-block ms-2 me-1">{user?.name}</span>
              <i className="mdi mdi-chevron-down d-none d-xl-inline-block"/>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end">              
              <Link to="/logout" className="dropdown-item">
                <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger"/>
                <span>Logout</span>
              </Link>
            </DropdownMenu>
          </Dropdown>
        </>
      )
}

export default ProfileMenu