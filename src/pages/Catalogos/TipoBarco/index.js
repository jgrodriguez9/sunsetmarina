import { useEffect } from "react";
import { useMemo, useState } from "react";
import { useHistory, withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumbs";
import CardMain from "../../../components/Common/CardMain";
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
            Header: 'Habilitado',
            accessor: 'enabled',
            Cell: ({row, value}) => <CellFormatEnable value={value}/>,
            style: {
                width: '30%'
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
                <TableLoader columns={[{name: "Descripción", width: '60%'}, {name: "Activo", width: '30%'}, {name: "Acciones", width: '10%'}]} />
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