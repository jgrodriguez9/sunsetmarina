import { Col, Container, Row } from "reactstrap"
import Breadcrumbs from "../../../components/Common/Breadcrumbs"
import CardBasic from "../../../components/Common/CardBasic"
import FormFilter from "../../../components/Common/FormFilter"
import { useEffect, useState } from "react";
import { getClientList } from "../../../helpers/marina/client";
import moment from "moment";
import CardMain from "../../../components/Common/CardMain";

function AccountStatus(){
    const [loading, setLoading] = useState(false)
    const [item, setItem] = useState(null);
    const [filters, setFilters] = useState([
        {
            label: 'Cliente',
            field: 'name',
            width: 4,
            control: 'select',
            type: '',
            value: '',
            valueSelect: null,
            options: []
        },     
        {
            label: 'Fecha inicio',
            field: 'startDate',
            width: 3,
            control: 'date',
            type: '',
            value: '',
            valueDate: ''
        },
        {
            label: 'Fecha fin',
            field: 'endDate',
            width: 3,
            control: 'date',
            type: '',
            value: '',
            valueDate: ''
        },   
    ]);
    const fetchClientsApi = async () => {
        try {
            const response = await getClientList();
            const copyFilters = [...filters]
            copyFilters[0].options = response.map(c=> (
                {
                    label: `${c.name} ${c.lastName}`,
                    value: c.id
                }
            ))
            setFilters(copyFilters)
        } catch (error) {
            
        }
    }

    useEffect(() => {
        fetchClientsApi();
    }, [])

    const fireSearch = (filts) => {
       console.log(filts)
    }

    const report = (row) => {
        console.log(row)
    }

    const handleFilter = (
        <Row>
            <Col>
                <FormFilter 
                    filters={filters}
                    setFilters={setFilters}
                    fireSearch={fireSearch}
                />
            </Col>
        </Row>
    )
    const carHandleEstadoCuenta = (
        (loading || !item) ?
        <Row>
            <Col xs="12" xl="12">
                <p>No hay información disponible</p>
            </Col>
        </Row> :
        <Row>
            <Col xl="12">                                    
                <h6>Interfaz d estado de cuenta</h6>
            </Col>      
        </Row>
    )

    return(
        <div className="page-content">
            <Container fluid>

                <Breadcrumbs
                    title={'Estado de cuenta'}
                    breadcrumbItem={"Estado de cuenta"} 
                />

                <Row className="pb-5">
                  <Col lg="12">
                    <CardBasic 
                        title="Filtros"
                        children={handleFilter}
                    />                             
                  </Col>
                </Row>
                <Row className="pb-5">
                  <Col lg="12">
                    <CardMain
                        title='Estado de cuenta'
                        children={carHandleEstadoCuenta}
                    />                                          
                  </Col>
              </Row> 
            </Container>
        </div>
    )
}

export default AccountStatus