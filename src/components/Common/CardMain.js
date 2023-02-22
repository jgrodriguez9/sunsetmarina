import { Card, CardBody } from "reactstrap";

export default function CardMain({title, children}){

    return (
        <Card>
            <CardBody className="p-0">
                <div className="accordion">
                    <div className="accordion-item bg-info bg-soft border-0 rounded-0">
                        <div className="d-flex justify-content-between p-2 align-items-center">
                            <h5 className="accordion-header m-0">
                                {title}
                            </h5>
                        </div>                        
                    </div>
                </div>
                <div className="accordion-body p-3">{children}</div>
            </CardBody>
        </Card>
    )
}