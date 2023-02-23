import { useEffect } from "react";
import { useMemo, useState } from "react";
import { useHistory, withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumbs";
import CardBasic from "../../../components/Common/CardBasic";
import CardMain from "../../../components/Common/CardMain";
import FormFilter from "../../../components/Common/FormFilter";
import TableLoader from "../../../components/Loader/TablaLoader";
import CellActions from "../../../components/Tables/CellActions";
import CellFormatEnable from "../../../components/Tables/CellFormatEnable";
import Paginate from "../../../components/Tables/Paginate";
import SimpleTable from "../../../components/Tables/SimpleTable";
import { ERROR_SERVER } from "../../../constants/messages";
import { getBoadTypeListPaginado } from "../../../helpers/catalogos/boadType";

function TipoBarco(){  
    const [loading, setLoading] = useState(true)
    const [items, setItems] = useState([]);
    const [totalPaginas, setTotalPaginas] = useState(0)
    const [totalRegistros, setTotalRegistros]   =useState(10)
    const history = useHistory();
    const [query, setQuery] = useState({
        page: 1,
        max: totalRegistros
    })
    const [filters, setFilters] = useState([
        {
            label: 'Descripción',
            field: 'description',
            width: 3,
            control: 'input',
            type: 'text',
            value: ''
        }
    ]);
    
    useEffect(() => {
        const getBoadTypeListPaginadoApi = async () => {
            let q = Object.keys(query).map(key=>`${key}=${query[key]}`).join("&")
            try {
                const response = await getBoadTypeListPaginado(`?${q}`);
                console.log(response)
                setItems(response.list)
                setTotalPaginas(response.pagination.totalPages)
                setTotalRegistros(response.pagination.totalCount)
                setLoading(false)
            } catch (error) {
                toast.error(ERROR_SERVER)
                setItems([])
                setTotalPaginas(0)
                setTotalRegistros(10)
                setLoading(false)
            } 
        }
        getBoadTypeListPaginadoApi()
    }, [query])

    const editAction = (row) => {
        history.push(`/boadtype/edit/${row.original.id}`)
    }

    const columns = useMemo(
        () => [
          {
            Header: 'Descripción',
            accessor: 'description',
            style: {
                width: '60%'
            }
          },
          {
            Header: 'Tiene motor',
            accessor: 'hasEngine',
            Cell: ({row, value}) => <CellFormatEnable 
                                        value={value} 
                                        okText="Tiene motor" 
                                        failText="No tiene motor"
                                        badge={false}/>,
            style: {
                width: '15%'
            }
          },
          {
            Header: 'Habilitado',
            accessor: 'enabled',
            Cell: ({row, value}) => <CellFormatEnable value={value} okText="Habilitado" failText="No habilitado"/>,
            style: {
                width: '15%'
            }
          },
          {
            id: 'acciones',
            Header: "Acciones",
            Cell: ({row}) => (
                <>
                    <CellActions
                        edit={{"allow": true, action: editAction}} 
                        row={row}
                    />
                </>
            ), 
            style: {
                width: '10%'
            }         
          }
        ],
        []
    );

    const handlePageClick = page => {
        setQuery(prev=>({
            ...prev,
            page: page
        }))
    }

    const handleChangeLimit = limit => {
        setQuery(prev=>({
            ...prev,
            page: 1,
            max: limit
        }))
    }

    const cardHandleList = (
        loading ?
        <Row>
            <Col xs="12" xl="12">
                <TableLoader columns={[{name: "Descripción", width: '60%'}, {name: "Tiene motor", with: '15%'}, {name: "Habilitado", width: '15%'}, {name: "Acciones", width: '10%'}]} />
            </Col>
        </Row> :
        <Row>
            <Col xl="12">                                    
                <SimpleTable
                    columns={columns}
                    data={items} 
                />
            </Col>
            {
                items.length > 0 &&
                <Paginate
                    page={query.page}
                    totalPaginas={totalPaginas}
                    totalRegistros={totalRegistros}
                    handlePageClick={handlePageClick}
                    limit={query.limite}
                    handleChangeLimit={handleChangeLimit}
                />
            }            
        </Row>
    )

    
    const handleFilter = (
            <Row>
                <Col>
                    <FormFilter 
                        filters={filters}
                        setFilters={setFilters}
                    />
                </Col>
            </Row>
    )
    
    return (
        <>
          <div className="page-content">
            <Container fluid>
              {/* Render Breadcrumb */}
              <Breadcrumbs
                title={'Embarcación'}
                breadcrumbItem={"Tipo de embarcación"}
                add={{
                    allow: true,
                    text: 'Crear Nuevo Tipo de Embarcación'
                }}
              />

              <Row>
                <Col xs="12" lg="12">
                    <CardBasic 
                        title="Filtros"
                        children={handleFilter}
                    />                    
                </Col>
              </Row>

              <Row className="pb-5">
                  <Col lg="12">
                    <CardMain
                        title='Listado'
                        children={cardHandleList}
                    />                                          
                  </Col>
              </Row>  
            </Container>
          </div>
        </>
      );
  }
  
  export default withRouter(TipoBarco)