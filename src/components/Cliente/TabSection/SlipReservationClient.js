import { Badge, Col, Row } from "reactstrap";
import TabActionHeader from "../Common/TabActionHeader";
import DialogMain from "../../Common/DialogMain";
import { useEffect, useMemo, useState } from "react";
import SimpleTable from "../../Tables/SimpleTable";
import { DELETE_SUCCESS, ERROR_SERVER } from "../../../constants/messages";
import extractMeaningfulMessage from "../../../utils/extractMeaningfulMessage";
import { addMessage } from "../../../redux/messageSlice";
import { useDispatch } from "react-redux";
import TableLoader from "../../Loader/TablaLoader";
import moment from "moment";
import CellActions from "../../Tables/CellActions";
import DeleteDialog from "../../Common/DeleteDialog";
import { deleteDocument } from '../../../helpers/marina/document'
import { getSlipReservationByClient } from "../../../helpers/marina/slipReservation";
import FormSlipReservationClient from "../../Marina/SlipReservation/FormSlipReservationClient";
import { numberFormat } from "../../../utils/numberFormat";
import ChargesCanvas from "../ChargesCanvas";

export default function SlipReservationClient({formik}){
    const dispatch = useDispatch();
    const [loadingItems, setLoadingItems] = useState(true)
    const [openModalAdd, setOpenModalAdd] = useState(false)
    const [items, setItems] = useState([])
    const [refetch, setRefetch] = useState(true)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [isDeleting, setDeleting] = useState(false)
    const [selectedIdDelete, setSelectedIdDeleted] = useState(null)
    const [openCharges, setOpenCharges] = useState(false)
    const [item, setItem] = useState({
        customer: {id: formik.values.id}
    })
    const addNewModal = () => {
        setItem({customer: {id: formik.values.id}})
        setOpenModalAdd(true)
    }

    const editAction = (row) => {
        const slip = row.original
        setItem((prev) => ({
            ...prev,
            id: slip.id,
            price: slip.price, 
            observations: slip.observations, 
            customer: {id: formik.values.id},
            boat: slip.boat,
            slip: slip.slip, 
            arrivalDate: slip.arrivalDate,
            departureDate: slip.departureDate,
            status: slip.status
        }))
        setOpenModalAdd(true)
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
            Header: 'Slip',
            accessor: 'slip.code',
            style: {
                width: '10%'
            }
          },
          {
            Header: 'Embarcación',
            accessor: 'boat.name',
            style: {
                width: '15%'
            }
          },
          {
            Header: 'Fecha llegada',
            accessor: 'arrivalDate',
            style: {
                width: '15%'
            },
            Cell: ({value}) => moment(value, 'YYYY-MM-DD').format('DD-MM-YYYY')
          },
          {
            Header: 'Fecha salida',
            accessor: 'departureDate',
            style: {
                width: '15%'
            },
            Cell: ({value}) => moment(value, 'YYYY-MM-DD').format('DD-MM-YYYY')
          },
          {
            Header: 'Precio diario',
            accessor: 'price',
            style: {
                width: '10%'
            },
            Cell: ({value}) => numberFormat(value)
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
                }else if(value === 'CONFIRMED'){
                    return <Badge color='success'>Confirmada</Badge>
                }else{
                    return <Badge color='danger'>Cancelada</Badge>
                }
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
                        charge={{allow: true, action: handleShowDialogCharge}}
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
        setSelectedIdDeleted(row.original.id)
    }

    const handleShowDialogCharge = (row) => {
        setSelectedIdDeleted(row.original.id)
        setOpenCharges(true)
    }
    

    const fetchItemsForClientApi = async () => {
        try {
            const query = `?page=1&max=100`
            const response = await getSlipReservationByClient(formik.values.id, query)
            setItems(response.list)
            setLoadingItems(false)
        } catch (error) {
            setItems([])
            setLoadingItems(false)
        }
    }

    useEffect(() => {
        if(refetch){
            setLoadingItems(true)
            fetchItemsForClientApi();
            setRefetch(false)
        }        
    }, [refetch]);

    const handleDelete = async () => {
        setDeleting(true)   
        try {
            await deleteDocument(selectedIdDelete);
            setRefetch(true)
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


    return (
        <>
            <TabActionHeader
                add={{
                    allow: true,
                    handleAction: addNewModal
                }}
            />
            <Row className="mt-2">
                <Col xs="12" md="12">
                    {
                        loadingItems ?
                        <TableLoader 
                            columns={[{name: "Tipo documento", width: '30%'}, {name: "Comentario", width: '40%'}, {name: "Fecha recordatorio", width: '20%'}, {name: "Acciones", width: '10%'}]} 
                        /> : 
                        <SimpleTable 
                            columns={columns}
                            data={items} 
                        />
                    }
                    
                </Col>
            </Row>

            {/*agregar modal boat for client*/}
            <DialogMain 
                open={openModalAdd}
                setOpen={setOpenModalAdd}
                title={item?.id ? "Actualizar reservación" : "Agregar reservación"}
                size="xl"
                children={<FormSlipReservationClient 
                            item={item}
                            setOpenModalAdd={setOpenModalAdd}
                            setRefetch={setRefetch}
                        />}
            />

            <DeleteDialog 
                handleDelete={handleDelete}
                show={showDeleteDialog}
                setShow={setShowDeleteDialog}
                isDeleting={isDeleting}
            />

            <ChargesCanvas 
                reservationId={selectedIdDelete}
                open={openCharges}
                setOpen={setOpenCharges}
            />
        </>
    )
}