import { useEffect } from "react";
import { useState } from "react";
import { useParams, withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { Col, Container, Row } from "reactstrap";
import FormTipoEmbarcacion from "../../../../components/Catalogo/TipoEmbarcacion/FormTipoEmbarcacion";
import Breadcrumbs from "../../../../components/Common/Breadcrumbs";
import CardMain from "../../../../components/Common/CardMain";
import ErrorEntity from "../../../../components/Common/ErrorEntity";
import FormLoader from "../../../../components/Loader/FormLoader";
import { ERROR_SERVER } from "../../../../constants/messages";
import { getBoadType } from "../../../../helpers/catalogos/boadType";
import extractMeaningfulMessage from "../../../../utils/extractMeaningfulMessage";

const fields = [{label: 'Nombre', width: 4}, {label: 'Tiene motor', width: 2}, {label: 'Habilitado', width: 2}]
function EditTipoBarco(){
    const {id} = useParams();
    const [item, setItem] = useState(null)
    const [states, setStates] = useState({
        reload: true,
        loading: true,
        error: false,
        success: false
    })

    const fetchItem = async () => {
        try {
            const response = await getBoadType(id);
            console.log(response)
            //setItem(response)            
            setStates(prev=>({...prev, loading: false, error: false, success: true}))
        } catch (error) {
            let message  = ERROR_SERVER;
            message = extractMeaningfulMessage(error, message)
            toast.error(message)            
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
                    title={'Tipo de embarcación'}
                    breadcrumbItem={"Tipo de embarcación"} 
                />

                <Row className="pb-5">
                  <Col lg="12">
                    {states.loading && <FormLoader fields={fields} titleCard='Editar Tipo de Embarcación' />}
                    {states.success && <CardMain
                                            title='Editar Tipo de Embarcación'
                                            children={<FormTipoEmbarcacion item={item} btnTextSubmit="Actualizar"/>}
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

export default withRouter(EditTipoBarco)