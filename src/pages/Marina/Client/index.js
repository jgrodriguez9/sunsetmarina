import { useEffect } from "react";
import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, withRouter } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumbs";
import CardBasic from "../../../components/Common/CardBasic";
import CardMain from "../../../components/Common/CardMain";
import DeleteDialog from "../../../components/Common/DeleteDialog";
import FormFilter from "../../../components/Common/FormFilter";
import TableLoader from "../../../components/Loader/TablaLoader";
import CellActions from "../../../components/Tables/CellActions";
import Paginate from "../../../components/Tables/Paginate";
import SimpleTable from "../../../components/Tables/SimpleTable";
import { DELETE_SUCCESS, ERROR_SERVER } from "../../../constants/messages";
import { addMessage } from "../../../redux/messageSlice";
import extractMeaningfulMessage from "../../../utils/extractMeaningfulMessage";
import { Country, State }  from 'country-state-city';
import { deleteClient, getClientListPaginado } from "../../../helpers/marina/client";

function Client(){  
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)
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
            label: 'Código',
            field: 'code',
            width: 3,
            control: 'input',
            type: 'text',
            value: ''
        },
        {
            label: 'Nombre',
            field: 'name',
            width: 3,
            control: 'input',
            type: 'text',
            value: ''
        },
        {
            label: 'Apellido',
            field: 'lastName',
            width: 3,
            control: 'input',
            type: 'text',
            value: ''
        },
        {
            label: 'País',
            field: 'country',
            width: 3,
            control: 'select',
            type: '',
            value: '',
            valueSelect: null,
            options: [
                {
                    label: Country.getCountryByCode('MX').name,
                    value: Country.getCountryByCode('MX').name
                }
            ]
        },
        {
            label: 'Estado',
            field: 'state',
            width: 3,
            control: 'select',
            type: '',
            value: '',
            valueSelect: null,
            options: State.getStatesOfCountry('MX').map(s=> (
                {
                    label: s.name,
                    value: s.name
                }
            ))
        }
    ]);

    const fetchList = async () => {
        setLoading(true)
        let q = Object.keys(query).map(key=>`${key}=${query[key]}`).join("&")
        try {
            const response = await getClientListPaginado(`?${q}`);
            setItems(response.list)
            setTotalPaginas(response.pagination.totalPages)
            setTotalRegistros(response.pagination.totalCount)
            setLoading(false)
        } catch (error) {
            let message  = ERROR_SERVER;
            message = extractMeaningfulMessage(error, message)
            dispatch(addMessage({
                message: message,
                type: 'error'
            }))
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
        history.push(`/client/edit/${row.original.id}`)
    }

    const columns = useMemo(
        () => [
            {
                Header: 'Código',
                accessor: 'code',            
                style: {
                    width: '15%'
                }
            },
            {
                Header: 'Nombre',
                accessor: 'name',
                Cell: ({row}) => (
                    <>
                      <div className="d-flex align-items-center">
                        <div className="flex-shrink-0">
                          {row.original.profilePicture ? <img
                            src={row.original.profilePicture}
                            alt=""
                            className="avatar-xxs rounded-circle"
                          /> :
                            <div className="flex-shrink-0 avatar-xs me-2">
                              <div className="avatar-title bg-soft-success text-success rounded-circle fs-13">
                                {row.original.name.charAt(0)}
                              </div>
                            </div>
                          }
                        </div>
                        <div className="flex-grow-1 ms-2 name">
                          {`${row.original.name} ${row.original.lastName}`}
                        </div>
                      </div>
                    </>
                  ),
                style: {
                    width: '30%'
                }
            },
            {
                Header: 'Correo electrónico',
                accessor: 'email',            
                style: {
                    width: '17%'
                }
            },
            {
                Header: 'Teléfono',
                accessor: 'phone',
                style: {
                    width: '10%'
                }
            },
            {
                Header: 'Estado',
                accessor: 'state',
                style: {
                    width: '10%'
                }
            },
            {
                Header: 'País',
                accessor: 'country',
                style: {
                    width: '10%'
                }
            },          
            {
                id: 'acciones',
                Header: "Acciones",
                Cell: ({row}) => (
                    <>
                        <CellActions
                            edit={{"allow": true, action: editAction}} 
                            del={{"allow": false, action: handleShowDialogDelete}}
                            row={row}
                        />
                    </>
                ), 
                style: {
                    width: '8%'
                }         
            }
        ],
        []
    );

    const handleShowDialogDelete = (row) => {
        setShowDeleteDialog(true)
        setSelectedIdDeleted(row.original.id)
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
          console.log(obj)

          setQuery(prev=>({
            max: prev.max,
            page: 1,
            ...obj
        }))        
    }

    const goPageCreate = () => {
        history.push("/client/create")
    }

    const handleDelete = async () => {
        setDeleting(true)   
        try {
            await deleteClient(selectedIdDelete);
            fetchList()
            setDeleting(false)
            setShowDeleteDialog(false)
            dispatch(addMessage({
                message: DELETE_SUCCESS,
                type: 'success'
            }))
        } catch (error) {
            let message  = ERROR_SERVER;
            message = extractMeaningfulMessage(error, message)
            dispatch(addMessage({
                message: message,
                type: 'error'
            }))
            setDeleting(false)
        }      
    }

    const cardHandleList = (
        loading ?
        <Row>
            <Col xs="12" xl="12">
                <TableLoader columns={[{name: "Código", width: '15%'}, {name: "Nombre", width: '25%'}, {name: 'Correo electrónico', with: '20%'}, {name: "Teléfono", width: '10%'}, {name: "Estado", width: "10%" }, {name: "País", width: "10%" }, {name: "Acciones", width: '10%'}]} />
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
                title={'Cliente'}
                breadcrumbItem={"Cliente"}
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
  
  export default withRouter(Client)