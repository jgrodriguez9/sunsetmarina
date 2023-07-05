import { Col, Row } from "reactstrap";
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

export default function SlipReservationClient({formik}){
    const dispatch = useDispatch();
    const [loadingItems, setLoadingItems] = useState(true)
    const [openModalAdd, setOpenModalAdd] = useState(false)
    const [items, setItems] = useState([])
    const [refetch, setRefetch] = useState(true)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [isDeleting, setDeleting] = useState(false)
    const [selectedIdDelete, setSelectedIdDeleted] = useState(null)
    const [item, setItem] = useState({
        customer: {id: formik.values.id}
    })
    const addNewModal = () => {
        setItem({customer: {id: formik.values.id}})
        setOpenModalAdd(true)
    }

    const editAction = (row) => {
        const boat = row.original
        setItem((prev) => ({
            ...prev,
            id: boat.id,
            comments: boat.comments, 
            reminderDate: boat.reminderDate,
        }))
        setOpenModalAdd(true)
    }

    const columns = useMemo(
        () => [
          {
            Header: 'Tipo documento',
            accessor: 'documentType.description',
            style: {
                width: '30%'
            },
            Cell: ({row, value}) => (
                <a href={row.original.urlPath} target="_blank" rel="noreferrer">
                    <span className="me-2">{value}</span>
                    <i className="bx bx-link-external" />
                </a>
            )
          },
          {
            Header: 'Comentario',
            accessor: 'comments',
            style: {
                width: '40%'
            }
          },
          {
            Header: 'Fecha recordatorio',
            accessor: 'reminderDate',
            style: {
                width: '20%'
            },
            Cell: ({row, value}) => value ? moment(value, 'YYYY-MM-DD').format('DD-MM-YYYY') : 'Sin fecha'
          },
          {
            id: 'acciones',
            Header: "Acciones",
            Cell: ({row}) => (
                <>
                    <CellActions
                        edit={{"allow": false, action: editAction}} 
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
        setSelectedIdDeleted(row.original.id)
    }
    

    const fetchItemsForClientApi = async () => {
        try {
            const query = `?page=1&max=50`
            const response = await getSlipReservationByClient(formik.values.id, query)
            //console.log(response)
            //setItems(response.list)
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
        </>
    )
}