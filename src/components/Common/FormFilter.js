import { Col, Row } from "reactstrap";
import ControlFilter from "./ControlFilter";

export default function FormFilter({filters, setFilters, fireSearch}){

    const handleChange = (fieldId, value, controlType) => {
        const filterCopy = [...filters];
        const idx = filterCopy.findIndex(f=>f.field===fieldId)
        switch(controlType){
            case 'input':
                filterCopy[idx].value = value
                break;
            case 'checkbox':
                    if(value){
                        filterCopy[idx].value = value
                    }else{
                        filterCopy[idx].value = ''
                    }                    
                    break;
            default:
                break;
        }
        
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