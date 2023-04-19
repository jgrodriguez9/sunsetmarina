import { Col, Label, Row } from "reactstrap";
import CardMain from "../Common/CardMain";

export default function FormLoader({fields, titleCard}){

    const renderForm = (
        <Row>
            {
                fields.map((field, index) => (
                    <Col xs="12" md={field.width} key={`form-loader-${index}`}>
                        {
                            field.label &&
                            <>
                                <Label className="mb-0 d-block">{field.label}</Label>
                                <span className="placeholder-glow w-100">
                                    <span className="placeholder w-100" style={{height: field.height || '36px'}}></span>
                                </span>
                            </>
                        }                        
                    </Col>
                ))
            }
        </Row>
    )
    return(
        <CardMain
            title={titleCard}
            children={renderForm}
        />
    )
}