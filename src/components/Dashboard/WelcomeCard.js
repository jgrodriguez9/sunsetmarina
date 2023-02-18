import { Row, Col, Card, CardBody } from "reactstrap"

import avatar1 from "../../assets/images/users/avatar-1.jpg"
import profileImg from "../../assets/images/profile-img.png"
import useLoguedUser from "../../hooks/useLoguedUser"

const WelcomeCard = () => {
  const userLogued  = useLoguedUser();

  return (
    <>
      <Card className="overflow-hidden">
        <div className="bg-primary bg-soft">
          <Row>
            <Col xs="7">
              <div className="text-primary p-3">
                <h5 className="text-primary">Alejandro Perez</h5>
                {/* <h5 className="font-size-15 mb-0">{userLogued?.name ?? '----'}</h5> */}
                <p>{userLogued?.Role?.name ?? '-'}</p>
              </div>
            </Col>
            <Col xs="5" className="align-self-end">
              <img src={profileImg} alt="" className="img-fluid" />
            </Col>
          </Row>
        </div>        
      </Card>
    </>
  )
}
export default WelcomeCard
