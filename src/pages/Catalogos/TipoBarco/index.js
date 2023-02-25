import { useEffect } from "react";
import { useMemo, useState } from "react";
import { useHistory, withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumbs";
import CardBasic from "../../../components/Common/CardBasic";
import CardMain from "../../../components/Common/CardMain";
import DeleteDialog from "../../../components/Common/DeleteDialog";
import FormFilter from "../../../components/Common/FormFilter";
import TableLoader from "../../../components/Loader/TablaLoader";
import CellActions from "../../../components/Tables/CellActions";
import CellFormatEnable from "../../../components/Tables/CellFormatEnable";
import Paginate from "../../../components/Tables/Paginate";
import SimpleTable from "../../../components/Tables/SimpleTable";
import { DELETE_SUCCESS, ERROR_SERVER } from "../../../constants/messages";
import { deleteBoadType, getBoadTypeListPaginado } from "../../../helpers/catalogos/boadType";
import extractMeaningfulMessage from "../../../utils/extractMeaningfulMessage";

function TipoBarco(){  
    const [loading, setLoading] = useState(true)
    const [items, setItems] = useState([]);
    const [totalPaginas, setTotalPaginas] = useState(0)
    const [totalRegistros, setTotalRegistros]   =useState(10)
    const history = useHistory();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [isDeleting, setDeleting] = useState(false)
    const [selectedIdDelete, setSelectedIdDeleted] = useState(null)
    const [query, setQuery] = useState({
        max: totalRegistros,
        page: 1,       
    })
    const [filters, setFilters] = useState([
        {
            label: 'Descripción',
            field: 'description',
            width: 3,
            control: 'input',
            type: 'text',
            value: ''
        },
        {
            label: 'Tiene motor',
            field: 'hasEngine',
            width: 2,
            control: 'checkbox',
            type: 'text',
            value: ''
        },
        {
            label: 'Habilitado',
            field: 'enabled',
            width: 2,
            control: 'checkbox',
            type: 'text',
            value: ''
        }
    ]);

    const fetchList = async () => {
        let q = Object.keys(query).map(key=>`${key}=${query[key]}`).join("&")
        try {
            const response = await getBoadTypeListPaginado(`?${q}`);
            //console.log(response)
            setItems(response.list)
            setTotalPaginas(response.pagination.totalPages)
            setTotalRegistros(response.pagination.totalCount)
            setLoading(false)
        } catch (error) {
            let message  = ERROR_SERVER;
            message = extractMeaningfulMessage(error, message)
            toast.error(message) 
            setItems([])
            setTotalPaginas(0)
            setTotalRegistros(10)
            setLoading(false)
        } 
    }

    useEffect(() => {
        fetchList();
    }, [JSON.stringify(query)])

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
                        del={{"allow": true, action: handleShowDialogDelete}}
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

    const handleShowDialogDelete = (row) => {
        setShowDeleteDialog(true)
        setSelectedIdDeleted(row.original.idi)
    }

    const handlePageClick = page => {
        setQuery(prev=>({
            ...prev,
            page: page
        }))
    }

    const handleChangeLimit = limit => {
        setQuery(prev=>({
            ...prev,
            max: limit,
            page: 1            
        }))
    }
    
    const fireSearch = (filts) => {
        const activeFilters = filts.filter(fl => fl.value).map(field => ({name: field.field, value: field.value}))
        const obj = activeFilters.reduce((accumulator, value) => {
            return {...accumulator, [value.name]: value.value};
          }, {});

          setQuery(prev=>({
            max: prev.max,
            page: 1,
            ...obj
        }))        
    }

    const goPageCreate = () => {
        history.push("/boadtype/create")
    }

    const handleDelete = async (row) => {
        setDeleting(true)   
        try {
            await deleteBoadType(row.original.id);
            fetchList()
            setDeleting(false)
            setShowDeleteDialog(false)
            toast.success(DELETE_SUCCESS)
        } catch (error) {
            let message  = ERROR_SERVER;
            message = extractMeaningfulMessage(error, message)
            toast.error(message) 
            setDeleting(false)
        }      
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
                        fireSearch={fireSearch}
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
                    text: 'Crear Nuevo',
                    goPageCreate: goPageCreate
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
                <span onClick={() => setShowDeleteDialog(true)}>test delete</span>
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
          <DeleteDialog 
            handleDelete={handleDelete}
            show={showDeleteDialog}
            setShow={setShowDeleteDialog}
            isDeleting={isDeleting}
          />
        </>
      );
  }
  
  export default withRouter(TipoBarco)