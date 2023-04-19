import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, withRouter } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import FormCliente from "../../../../components/Cliente/FormCliente";
import Breadcrumbs from "../../../../components/Common/Breadcrumbs";
import CardMain from "../../../../components/Common/CardMain";
import ErrorEntity from "../../../../components/Common/ErrorEntity";
import FormLoader from "../../../../components/Loader/FormLoader";
import { ERROR_SERVER } from "../../../../constants/messages";
import { getClient } from "../../../../helpers/marina/client";
import { addMessage } from "../../../../redux/messageSlice";
import extractMeaningfulMessage from "../../../../utils/extractMeaningfulMessage";

const fields = [
        {label: '.', width: 3, height: '88px'}, {label: '.', width: 3, height: '88px'}, {label: '.', width: 3, height: '88px'}, {label: '.', width: 3, height: '88px'},
        {label: 'Nombre', width: 5, height: '80px'}, {label: null, width: 7},
        {label: 'Nombre', width: 5}, {label: null, width: 2}, {label: 'Teléfono', width: 5},
        {label: 'Apellidos', width: 5}, {label: null, width: 2}, {label: 'RFC', width: 5},
        {label: 'Identificación', width: 5}, {label: null, width: 2}, {label: 'Fecha nacimiento', width: 5},
        {label: 'Correo electrónico', width: 5}, {label: null, width: 2}, {label: 'Categoría del cliente', width: 5},
        
    ]
function EditCliente(){
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
            const response = await getClient(id);
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
                    title={'Cliente'}
                    breadcrumbItem={"Cliente"} 
                />

                <Row className="pb-5">
                  <Col lg="12">
                    {states.loading && <FormLoader fields={fields} titleCard='Editar Cliente' />}
                    {states.success && <CardMain
                                            title='Editar Cliente'
                                            children={<FormCliente item={item} btnTextSubmit="Actualizar"/>}
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

export default withRouter(EditCliente)