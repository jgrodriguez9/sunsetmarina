import { useEffect } from "react"
import { useState } from "react"
import { Button, Col, Offcanvas, OffcanvasBody, OffcanvasHeader, Row } from "reactstrap"
import { getChargeByReservation } from "../../helpers/marina/charges"
import TableCharges from "../Marina/Charge/TableCharges"
import { numberFormat } from "../../utils/numberFormat"
import SpinLoader from "../Loader/SpinLoader"

const getTotalToPay = (charges) => {
    return charges.filter(it=>it.status !== 'PAYED')
                .reduce((acc, cValue)=>(acc +cValue.amount+cValue.interest), 0)
}

const ChargesCanvas = ({reservationId, open, setOpen}) => {
    const [charge, setCharge] = useState([])
    const [total, setTotal] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fecthChargesByReservation = async () => {
            try {
                const response = await getChargeByReservation(reservationId)
                const list = response.list.map(it=>({
                    id: it.id, 
                    amount: it.amount, 
                    interest: it.interest, 
                    status: it.status, 
                    monthYear: it.monthYear,
                    checked: true,
                    disabled: it.status === 'PAYED',
                })) 
                setCharge(list)
                setTotal(getTotalToPay(list))
                setLoading(false)
            } catch (error) {
                setCharge([])
                setLoading(false)
            }
        }
        if(reservationId){
            setLoading(true)
            fecthChargesByReservation()
        }        
    }, [reservationId])


    const toggle = () => {
        setOpen(!open)
    }

    const onHandleChangeAll = (checked) => {
        const list = []
        charge.forEach(it=>{
            const obj = {...it}
            if(!obj.disabled){
                obj.checked = true
            }
            list.push(obj)
        })
        setCharge(list)
        setTotal(getTotalToPay(charge))
    }

    return (
        <Offcanvas
            isOpen={open}
            toggle={toggle}
            direction="end"
            style={{
                minWidth: '100%'
            }}
            >
                <OffcanvasHeader toggle={toggle} className="border-bottom">Cargos</OffcanvasHeader>
                <OffcanvasBody>
                    {
                        loading ? 
                            <SpinLoader /> :
                        <div className="d-flex flex-column mt-5">
                            <div>
                                <Row>
                                    <Col xs={12} md={{size: 8, offset: 2}}>
                                        <TableCharges items={charge} onHandleChangeAll={onHandleChangeAll}/>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    }                                    
                </OffcanvasBody>
                    <div className="py-4 px-2 border position-sticky bottom-0 w-100 bg-light ">
                        <Row>
                            <Col xs={12} md={{size: 4, offset: 4}}>
                                <div className="d-flex justify-content-center align-items-center">
                                    <div className="px-4"><span><strong>Total</strong></span></div>
                                    <div className="px-4">
                                        {
                                            total >= 0 ? <h3 className="text-primary m-0">{numberFormat(total)}</h3> :
                                            <SpinLoader />
                                        }
                                    </div>
                                        
                                </div>
                                <div className="text-center mt-3">
                                    <Button color="primary" className="fs-4 px-5" disabled={total <= 0}>Pagar</Button>
                                </div>
                            </Col>
                        </Row>
                    </div>
            </Offcanvas>
    )
}

export default ChargesCanvas