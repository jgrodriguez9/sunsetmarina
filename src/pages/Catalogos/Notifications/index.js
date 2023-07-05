import { useEffect } from "react";
import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import { Badge, Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../components/Common/Breadcrumbs";
import CardMain from "../../../components/Common/CardMain";
import TableLoader from "../../../components/Loader/TablaLoader";
import { ERROR_SERVER } from "../../../constants/messages";
import { addMessage } from "../../../redux/messageSlice";
import extractMeaningfulMessage from "../../../utils/extractMeaningfulMessage";
import moment from "moment";
import { getMyNotifcations } from "../../../helpers/catalogos/notifications";
import { addNotifications } from "../../../redux/notificationsSlide";
import PaginateTable from "../../../components/Tables/PaginateTable";
import CellActions from "../../../components/Tables/CellActions";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function Notifications(){  
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true)
    const [items, setItems] = useState([]);
    const history = useHistory();

    const fetchList = async () => {
        setLoading(true)
        try {
            const response = await getMyNotifcations();
            setItems(response.list)
            dispatch(addNotifications(response))
            setLoading(false)
        } catch (error) {
            let message  = ERROR_SERVER;
            message = extractMeaningfulMessage(error, message)
            dispatch(addMessage({
                message: message,
                type: 'error'
            }))
            setItems([])
            setLoading(false)
        } 
    }

    useEffect(() => {
        fetchList();
    }, [])

    const editAction = (row) => {
        history.push(`/notification/edit/${row.original.id}`)
    }

    const columns = useMemo(
        () => [
          {
            Header: 'Concepto',
            accessor: 'concept',
            style: {
                width: '20%'
            }
          },
          {
            Header: 'Nota',
            accessor: 'comments',
            style: {
                width: '40%'
            }
          },  
          {
            Header: 'Estado',
            accessor: 'status',
            style: {
                width: '10%'
            },
            Cell: ({value}) => {
                if(value === 'PENDING'){
                    return <Badge color='warning'>Pendiente</Badge>
                }else if(value === 'DONE'){
                    return <Badge color='success'>Realizado</Badge>
                }else{
                    return <Badge color='danger'>Eliminado</Badge>
                }
            }
          },
          {
            Header: 'Fecha recordatorio',
            accessor: 'reminderDate',
            style: {
                width: '20%'
            },
            Cell: ({value}) => moment(value, 'YYYY-MM-DD').format('DD-MM-YYYY')
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

    const cardHandleList = (
        loading ?
        <Row>
            <Col xs="12" xl="12">
                <TableLoader columns={[{name: "Concepto", width: '30%'}, {name: "Nota", width: '40%'}, {name: "Estado", width: '10%'}, {name: "Fecha recordatorio", width: '20%'}]} />
            </Col>
        </Row> :
        <Row>
            <Col xl="12">
                <PaginateTable 
                    columns={columns}
                    data={items}
                    initialState={{pageSize: 10,pageIndex: 0}}
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
                title={'Notificaciones'}
                breadcrumbItem={"Notificaciones"}
                add={{
                    allow: false,
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

export default withRouter(Notifications)