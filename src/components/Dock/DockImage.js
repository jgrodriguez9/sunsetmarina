import { useState } from "react";
import { Col, Row } from "reactstrap";
import marinaMap from '../../assets/images/dock/MarinaMap.jpg'
import DialogMain from "../Common/DialogMain";

export default function DockImage(){
    const [showDialog, setShowDialog] = useState(false)
    const [slipInfo, setSlipInfo] = useState(null)
    const children = (
        <Row>
            <Col>
                <ul className="list-unstyled fs-5">
                    <li><strong>Propietario: </strong>{slipInfo?.propietario}</li>
                    <li><strong>Embarcación: </strong>{slipInfo?.embarcacion}</li>
                    <li><strong>Dimensiones: </strong>{slipInfo?.dimensiones}</li>
                </ul>
            </Col>
        </Row>
    )
    const showDialogInfo = () => {
        setSlipInfo({
            propietario: 'John Doe',
            embarcacion: 'Luciernaga',
            dimensiones: '150x255m'
        })
        setShowDialog(true);
    }

    return(
        <>
            <Row>
                <Col>
                    <div className="dock-container">
                        <div className="position-relative">
                            <div className="slip slip-white slip-1" onClick={showDialogInfo}/>
                            <img src={marinaMap} alt="imagen  del muelle" className="dock-map"/>
                        </div>                    
                    </div>
                </Col>
            </Row>
            <DialogMain
                open={showDialog}
                setOpen={setShowDialog} 
                title="Datos del slip"
                children={children}
            />
        </>
        
    )

}