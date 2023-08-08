import moment from "moment";
import { useMemo } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import extractMeaningfulMessage from "../../../utils/extractMeaningfulMessage";
import { ERROR_SERVER } from "../../../constants/messages";
import { addMessage } from "../../../redux/messageSlice";
import { getPaymentByClient } from "../../../helpers/marina/payment";
import TabActionHeader from "../Common/TabActionHeader";
import { Badge, Col, Row } from "reactstrap";
import TableLoader from "../../Loader/TablaLoader";
import SimpleTable from "../../Tables/SimpleTable";
import Paginate from "../../Tables/Paginate";
import { numberFormat } from "../../../utils/numberFormat";
import { getFormaPago } from "../../../utils/getFormaPago";
import { getTipoPago } from "../../../utils/getTipoPago";

export default function PaymentClient({formik}){
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true)
    const [items, setItems] = useState([])
    
    //paginar
    const [totalPaginas, setTotalPaginas] = useState(0)
    const [totalRegistros, setTotalRegistros]   =useState(10)
    const [query, setQuery] = useState({
        max: totalRegistros,
        page: 1,       
    })

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
            Header: 'Referencia',
            accessor: 'reference',
            style: {
                width: '25%'
            }
          },
          {
            Header: 'Fecha',
            accessor: 'dateCreated',
            style: {
                width: '15%'
            },
            Cell: ({value}) => moment(value, 'YYYY-MM-DD').format('DD-MM-YYYY')
          },  
          {
            Header: 'Monto',
            accessor: 'amount',
            style: {
                width: '10%'
            },
            Cell: ({value}) => numberFormat(value)
          }, 
          {
            Header: 'Forma de pago',
            accessor: 'paymentForm',
            style: {
                width: '10%'
            },
            Cell: ({value}) => getFormaPago(value)
          },  
          {
            Header: 'Tipo de pago',
            accessor: 'systemPayment',
            style: {
                width: '15%'
            },
            Cell: ({value}) => getTipoPago(value)
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
                }else if(value === 'APPROVED'){
                    return <Badge color='success'>Aprovado</Badge>
                }else{
                    return <Badge color='danger'>Cancelado</Badge>
                }
            }
          },     
        ],
        []
    );

    useEffect(() => {
        const fecthApiPaymentForClient = async () => {
            try {
                let q = Object.keys(query).map(key=>`${key}=${query[key]}`).join("&")
                const response = await getPaymentByClient(formik.values.id, `?${q}`)
                setItems(response.list)
                setTotalPaginas(response.pagination.totalPages)
                setTotalRegistros(response.pagination.totalCount)
                setLoading(false)
            } catch (error) {
                let message  = ERROR_SERVER;
                message = extractMeaningfulMessage(error, message)
                dispatch(addMessage({
                    type: 'error',
                    message: message
                }))
                setItems([])
                setLoading(false)
            }
        }
        setLoading(true)
        fecthApiPaymentForClient();       
    }, [JSON.stringify(query)]);

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

    return (
        <>
            <TabActionHeader
                add={{
                    allow: false,
                }}
            />
            <Row className="mt-2">
                <Col xs="12" md="12">
                    {
                        loading ?
                        <TableLoader 
                            columns={[
                                {name: "Código", width: '15%'}, 
                                {name: "Referencia", width: '25%'}, 
                                {name: "Fecha", width: '15%'},
                                {name: "Monto", width: '10%'},
                                {name: "Forma de pago", width: '10%'},
                                {name: "Tipo de pago", width: '15%'},
                                {name: "Estado", width: '10%'}
                            ]} 
                        /> :
                        <>
                            <SimpleTable 
                            columns={columns}
                            data={items} 
                        />
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
                        </> 
                        
                    }
                    
                </Col>
            </Row>            
        </>
    )
}