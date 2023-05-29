import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, withRouter } from "react-router-dom";
import { getBoatCrew } from "../../../../helpers/marina/boatCrew";
import { ERROR_SERVER } from "../../../../constants/messages";
import extractMeaningfulMessage from "../../../../utils/extractMeaningfulMessage";
import { addMessage } from "../../../../redux/messageSlice";
import { Col, Container, Row } from "reactstrap";
import Breadcrumbs from "../../../../components/Common/Breadcrumbs";
import FormLoader from "../../../../components/Loader/FormLoader";
import CardMain from "../../../../components/Common/CardMain";
import FormBoatCrew from "../../../../components/Marina/BoatCrew/FormBoatCrew";
import ErrorEntity from "../../../../components/Common/ErrorEntity";


const fields = [
        {label: 'Nombre', width: 3}, {label: 'Apellido', width: 3}, {label: 'Identificación', width: 3},{label: 'Teléfono', width: 3},
        {label: 'País', width: 3}, {label: 'Estado', width: 3}, {label: 'Ciudad', width: 3},{label: 'Es Capitán', width: 2},
        {label: 'Bote', width: 3}
    ]
function EditBoatCrew(){
    const {id} = useParams();
    const dispatch = useDispatch();
    const [item, setItem] = useState(null)
    const [states, setStates] = useState({
        reload: true,
        loading: true,
        error: false,
        success: false
    })

    const fetchItem = async () => {
        try {
            const response = await getBoatCrew(id);
            setItem(response)            
            setStates(prev=>({...prev, loading: false, error: false, success: true}))
        } catch (error) {
            let message  = ERROR_SERVER;
            message = extractMeaningfulMessage(error, message)
            dispatch(addMessage({
                type: 'error',
                message: message
            }))          
            setStates(prev=>({...prev, loading: false, error: true, success: false}))
        } 
    }

    useEffect(()=>{
        if(states.reload){
            fetchItem()
            setStates({
                reload: false,
                loading: true,
                error: false,
                success:false
            })
        }        
    },[states.reload])

    return(
        <div className="page-content">
            <Container fluid>

                <Breadcrumbs
                    title={'Tripulación'}
                    breadcrumbItem={"Tripulación"} 
                />

                <Row className="pb-5">
                  <Col lg="12">
                    {states.loading && <FormLoader fields={fields} titleCard='Editar Tripulación' />}
                    {states.success && <CardMain
                                            title='Editar Tripulación'
                                            children={<FormBoatCrew item={item} btnTextSubmit="Actualizar"/>}
                                        />}
                    {states.error && <ErrorEntity 
                                        text='En estos momentos no podemos obtener la información' 
                                        setReload={setStates}
                                     />}                              
                  </Col>
                </Row>
            </Container>
        </div>
    )

}

export default withRouter(EditBoatCrew)