import { Col, Row } from "reactstrap";
import ControlFilter from "./ControlFilter";

export default function FormFilter({filters, setFilters}){

    return (
        <Row>
            {
                filters.map(filter => (
                    <Col xs="12" md={filter.width} key={filter.field}>
                        <ControlFilter
                            field={filter} 
                        />
                    </Col>
                ))
            }
        </Row>
    )
}