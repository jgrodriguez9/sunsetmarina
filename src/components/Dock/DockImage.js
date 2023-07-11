import { useEffect, useState } from "react";
import { Badge, Col, ListGroup, ListGroupItem, Row } from "reactstrap";
import marinaMap from '../../assets/images/dock/map.svg'
import DialogMain from "../Common/DialogMain";
import { ERROR_SERVER } from "../../constants/messages";
import extractMeaningfulMessage from "../../utils/extractMeaningfulMessage";
import { addMessage } from "../../redux/messageSlice";
import { useDispatch } from "react-redux";
import { getSlipList } from "../../helpers/marina/slip";
import { getClassSlipStatus } from "../../utils/getClassSlipStatus";
import { slipStatus } from "../../constants/constants";

export default function DockImage(){
    const dispatch = useDispatch();
    const [slips, setSlips] =useState([])
    const [showDialog, setShowDialog] = useState(false)
    const [slipInfo, setSlipInfo] = useState(null)
    const children = (
        <Row>
            <Col>
                <ListGroup flush className="fs-5">
                    <ListGroupItem className="d-flex justify-content-between">
                        <h5 className="m-0">No. Slip</h5>
                        <Badge color="secondary">{slipInfo?.slip}</Badge>
                    </ListGroupItem>
                    <ListGroupItem className="d-flex justify-content-between">
                        <h5 className="m-0">Estado</h5>
                        <Badge color="success">{slipStatus(slipInfo?.estado)}</Badge>
                    </ListGroupItem>
                    {slipInfo?.propietario && 
                    <ListGroupItem className="d-flex justify-content-between">
                        <h5 className="m-0">Propietario</h5>
                        <span>{slipInfo?.propietario}</span>
                    </ListGroupItem>}
                    {slipInfo?.embarcacion &&
                    <ListGroupItem className="d-flex justify-content-between">
                        <h5 className="m-0">Embarcación</h5>
                        <span>{slipInfo?.embarcacion}</span>
                    </ListGroupItem>}
                    <ListGroupItem className="d-flex justify-content-between">
                        <h5 className="m-0">Dimensiones</h5>
                        <span>{slipInfo?.dimensiones}</span>
                    </ListGroupItem>
                </ListGroup>                
            </Col>
        </Row>
    )
    const showDialogInfo = (slip) => {
        setSlipInfo({
            slip: slip.code,
            propietario: slip?.reservation ? `${slip?.reservation?.customer?.name} ${slip?.reservation?.customer?.lastName}` : null,
            embarcacion: slip?.reservation?.boat?.name ?? null,
            dimensiones: `${slip.width}x${slip.height}`,
            estado: slip.status
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
                size="md"
            />
        </>
        
    )

}