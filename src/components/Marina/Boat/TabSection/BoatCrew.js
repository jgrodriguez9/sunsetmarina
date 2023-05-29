import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import CellActions from "../../../Tables/CellActions";
import { deleteBoatCrew, getBoatCrewByBoat } from "../../../../helpers/marina/boatCrew";
import { DELETE_SUCCESS, ERROR_SERVER } from "../../../../constants/messages";
import extractMeaningfulMessage from "../../../../utils/extractMeaningfulMessage";
import { addMessage } from "../../../../redux/messageSlice";
import TabActionHeader from "../../../Cliente/Common/TabActionHeader";
import { Col, Row } from "reactstrap";
import TableLoader from "../../../Loader/TablaLoader";
import SimpleTable from "../../../Tables/SimpleTable";
import DialogMain from "../../../Common/DialogMain";
import DeleteDialog from "../../../Common/DeleteDialog";
import FormBoatCrewBoat from "../../BoatCrew/FormBoatCrewBoat";

export default function BoatCrew({formik}){
    const dispatch = useDispatch();
    const [loadingBoatCrew, setLoadingBoatCrew] = useState(true)
    const [openModalAdd, setOpenModalAdd] = useState(false)
    const [boatCrews, setBoatCrews] = useState([])
    const [refetch, setRefetch] = useState(true)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [isDeleting, setDeleting] = useState(false)
    const [selectedIdDelete, setSelectedIdDeleted] = useState(null)
    const [item, setItem] = useState({
        boat: {id: formik.values.id}
    })
    const addNewBoatModal = () => {
        setItem({boat: {id: formik.values.id}})
        setOpenModalAdd(true)
    }

    const editAction = (row) => {
        const boat = row.original
        setItem((prev) => ({
            ...prev,
            id: boat.id,
            name: boat.name, 
            lastName: boat.lastName, 
            identification: boat.identification,
            country: boat.country,
            state: boat.state,
            city: boat.city,
            phone: boat.phone, 
            isCaptain: boat.isCaptain
        }))
        setOpenModalAdd(true)
    }

    const columns = useMemo(
        () => [
          {
            Header: 'Nombre',
            accessor: 'name',
            style: {
                width: '30%'
            }
          },
          {
            Header: 'Identificación',
            accessor: 'identification',
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
    

    const fetchBoatCrewByBoatApi = async () => {
        try {
            const response = await getBoatCrewByBoat(formik.values.id)
            setBoatCrews(response.list)
            setLoadingBoatCrew(false)
        } catch (error) {
            let message  = ERROR_SERVER;
            message = extractMeaningfulMessage(error, message)
            dispatch(addMessage({
                type: 'error',
                message: message
            }))
            setBoatCrews([])
            setLoadingBoatCrew(false)
        }
    }

    useEffect(() => {
        if(refetch){
            setLoadingBoatCrew(true)
            fetchBoatCrewByBoatApi();
            setRefetch(false)
        }        
    }, [refetch]);

    const handleDelete = async () => {
        setDeleting(true)   
        try {
            await deleteBoatCrew(selectedIdDelete);
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
                    handleAction: addNewBoatModal
                }}
            />
            <Row className="mt-2">
                <Col xs="12" md="12">
                    {
                        loadingBoatCrew ?
                        <TableLoader 
                            columns={[{name: "Nombre", width: '20%'}, {name: "Número de registro", width: '20%'}, {name: "Fecha expiración seguro", width: '20%'}]} 
                        /> : 
                        <SimpleTable 
                            columns={columns}
                            data={boatCrews} 
                        />
                    }
                    
                </Col>
            </Row>

            {/*agregar modal boat for client*/}
            <DialogMain 
                open={openModalAdd}
                setOpen={setOpenModalAdd}
                title={item?.id ? "Actualizar tripulación" : "Agregar tripulación"}
                size="xl"
                children={<FormBoatCrewBoat
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