import { Button, Col, Row } from "reactstrap"

function Breadcrumbs({breadcrumbItem, title, add=null}){

    return (
        <Row>
          <Col xs="12">
            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
              <h4 className="mb-0 font-size-18">{breadcrumbItem}</h4>
              <div className="page-title-right">
                {add && add.allow && <Button color="primary" size="sm" className="fw-bold">{add.text}</Button>}                
              </div>
            </div>
          </Col>
        </Row>
      )
}

export default Breadcrumbs