import { useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import marinaMap from '../../assets/images/dock/map.svg'
import DialogMain from "../Common/DialogMain";
import { ERROR_SERVER } from "../../constants/messages";
import extractMeaningfulMessage from "../../utils/extractMeaningfulMessage";
import { addMessage } from "../../redux/messageSlice";
import { useDispatch } from "react-redux";
import { getSlipList } from "../../helpers/marina/slip";
import { getClassSlipStatus } from "../../utils/getClassSlipStatus";

export default function DockImage(){
    const dispatch = useDispatch();
    const [slips, setSlips] =useState([])
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
    const showDialogInfo = (slip) => {
        console.log(slip)
        setSlipInfo({
            propietario: 'John Doe',
            embarcacion: 'Luciernaga',
            dimensiones: '150x255m'
        })
        setShowDialog(true);
    }

    const fecthSlipsAllApi = async () => {
        try {
            const response = await getSlipList();
            setSlips(response)
        } catch (error) {
            let message  = ERROR_SERVER;
            message = extractMeaningfulMessage(error, message)
            dispatch(addMessage({
                message: message,
                type: 'error'
            }))
            setSlips([])
        }
    }
    useEffect(() => {
        fecthSlipsAllApi();
    }, [])

    return(
        <>
            <Row>
                <Col>
                    <div className="dock-container">
                        <div className="position-relative">
                            {
                                slips.map((slip) => (
                                    <div 
                                        key={slip.id}
                                        className={`slip slip-1 ${getClassSlipStatus(slip.status)}`}
                                        style={{
                                            left: `${slip.xPosition}px`,
                                            top: `${slip.yPosition}px`,
                                            width: `${slip.width}px`,
                                            height: `${slip.height}px`
                                        }}
                                        title={slip.number} 
                                        onClick={e=>showDialogInfo(slip)}
                                    />        
                                ))
                            }
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