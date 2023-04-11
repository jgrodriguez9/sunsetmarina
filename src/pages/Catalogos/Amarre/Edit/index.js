import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, withRouter } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import FormAmarre from "../../../../components/Catalogo/Amarre/FormAmarre";
import Breadcrumbs from "../../../../components/Common/Breadcrumbs";
import CardMain from "../../../../components/Common/CardMain";
import ErrorEntity from "../../../../components/Common/ErrorEntity";
import FormLoader from "../../../../components/Loader/FormLoader";
import { ERROR_SERVER } from "../../../../constants/messages";
import { getAmarre } from "../../../../helpers/catalogos/amarres";
import { addMessage } from "../../../../redux/messageSlice";
import extractMeaningfulMessage from "../../../../utils/extractMeaningfulMessage";

const fields = [
        {label: 'Descripción', width: 3}, {label: 'Habilitado', width: 2}, {label: null, width: 7},
        {label: 'Manga', width: 2},{label: 'Calado', width: 2},{label: 'Eslora', width: 2},{label: null, width: 6}
    ]
function EditAmarre(){
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
            const response = await getAmarre(id);
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
                    title={'Tipo de Slip'}
                    breadcrumbItem={"Tipo de Slip"} 
                />

                <Row className="pb-5">
                  <Col lg="12">
                    {states.loading && <FormLoader fields={fields} titleCard='Editar Tipo de Slip' />}
                    {states.success && <CardMain
                                            title='Editar Tipo de Slip'
                                            children={<FormAmarre item={item} btnTextSubmit="Actualizar"/>}
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

export default withRouter(EditAmarre)