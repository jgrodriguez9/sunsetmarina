import { Col, Container, Row } from "reactstrap"
import Breadcrumbs from "../../../components/Common/Breadcrumbs"
import CardBasic from "../../../components/Common/CardBasic"
import FormFilter from "../../../components/Common/FormFilter"
import { useEffect, useState } from "react";
import { getClientList } from "../../../helpers/marina/client";
import CardMain from "../../../components/Common/CardMain";

function IncomeReport(){
    const [loading, setLoading] = useState(false)
    const [item, setItem] = useState(null);
    const [filters, setFilters] = useState([    
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
            valueDate:''
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
                <h6>Interfaz de report de cobranza</h6>
            </Col>      
        </Row>
    )

    return(
        <div className="page-content">
            <Container fluid>

                <Breadcrumbs
                    title={'Ingreso'}
                    breadcrumbItem={"Ingreso"} 
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
                        title='Reporte de ingresos'
                        children={carHandleEstadoCuenta}
                    />                                          
                  </Col>
              </Row> 
            </Container>
        </div>
    )
}

export default IncomeReport