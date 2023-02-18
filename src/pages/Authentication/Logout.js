import { useHistory, withRouter } from "react-router-dom"

function Logout() {
    const history = useHistory();
    localStorage.removeItem("sunsetadmiralauth");
    history.push("/login");
    return <></>
}

export default withRouter(Logout)