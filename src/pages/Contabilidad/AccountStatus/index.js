import { Button, Col, Container, Row } from "reactstrap"
import Breadcrumbs from "../../../components/Common/Breadcrumbs"
import CardBasic from "../../../components/Common/CardBasic"
import FormFilter from "../../../components/Common/FormFilter"
import { useEffect, useMemo, useState } from "react";
import { getClientList } from "../../../helpers/marina/client";
import CardMain from "../../../components/Common/CardMain";
import CellActions from "../../../components/Tables/CellActions";
import SimpleTable from "../../../components/Tables/SimpleTable";
import { listClientAccounsStatus } from "../../../data/testData";
import TableLoader from "../../../components/Loader/TablaLoader";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ReportAccountStatus from "../../../components/Contabilidad/ReportAccountStatus";

function AccountStatus(){
    const [loading, setLoading] = useState(false)
    const [items, setItems] = useState([]);
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
       setItems(listClientAccounsStatus)
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

    const columns = useMemo(
        () => [
            {
                Header: 'No. Slip',
                accessor: 'slip',            
                style: {
                    width: '80%'
                }
            },                
            {
                id: 'acciones',
                Header: "Acciones",
                Cell: ({row}) => (
                    <>
                        <CellActions
                            edit={{"allow": false}} 
                            del={{"allow": false}}
                            report={{"allow": true, action: report}}
                            row={row}
                        />
                    </>
                ), 
                style: {
                    width: '20%'
                }         
            }
        ],
        []
    );

    const carHandleEstadoCuenta = (
        loading ? 
        <Row>
            <Col xs="12" xl="12">
                <TableLoader columns={[{name: "No. Slip", width: '80%'}, {name: "Acciones", width: '20%'}]} />
            </Col>
        </Row> :
        items.length === 0 ?
        <Row>
            <Col xs="12" xl="12">
                <p>No hay información disponible</p>
            </Col>
        </Row> :
        <Row>
            <Col xs="12" xl="12">
                <PDFDownloadLink document={<ReportAccountStatus pdfData={null} />} fileName={`test.pdf`}>
                      {({ blob, url, loading, error }) =>
                        loading ? <Button color="secondary" outline disabled type="button" size="sm"><i className="far fa-file-pdf" /> Cargando documento</Button> : 
                        <Button color="info" outline className="mb-2" size="sm">
                            <i className="far fa-file-pdf" /> Descargar Reporte general
                        </Button>
                      }
                </PDFDownloadLink>  
            </Col>
            <Col xs="12" xl="12">                                    
                <SimpleTable
                    columns={columns}
                    data={items} 
                />
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