import { Col, Row } from "reactstrap";
import ControlFilter from "./ControlFilter";

export default function FormFilter({filters, setFilters, fireSearch}){

    const handleChange = (fieldId, value) => {
        const filterCopy = [...filters];
        const idx = filterCopy.findIndex(f=>f.field===fieldId)
        filterCopy[idx].value = value
        setFilters(filterCopy);
    }

    const handleFilter = () => {
        fireSearch(filters)
    }

    return (
        <Row>
            {
                filters.map(filter => (
                    <Col xs="12" md={filter.width} key={filter.field}>
                        <ControlFilter
                            field={filter}
                            handleChange={handleChange} 
                            handleFilter={handleFilter}
                        />
                    </Col>
                ))
            }
        </Row>
    )
}