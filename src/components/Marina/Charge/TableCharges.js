import { Badge } from "reactstrap"
import { getMonth } from "../../../utils/getMonth"
import { numberFormat } from "../../../utils/numberFormat"
import { classBadge } from "../../../utils/classBadge"
import { getTranslateAction } from "../../../utils/getTranslateAction"

const rowTotal = (a, b) => {
    return a+b
}

const TableCharges = ({items, onHandleChangeAll}) => {

    return (
        <div className="table-responsive">
            <table className="table table-nowrap align-middle mb-0">
                <thead>
                    <tr>
                        <th style={{width: '10%'}}>
                        <div className="form-check font-size-16 m-0">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id='todos'
                                    onChange={e=>onHandleChangeAll(e.target.checked)}
                                />
                                <label
                                    className="form-check-label m-0"
                                    htmlFor={'todos'}
                                />
                            </div>
                        </th>
                        <th style={{width: '15%'}}>Mes</th>
                        <th style={{width: '15%'}}>Año</th>
                        <th style={{width: '15%'}}>Estado</th>
                        <th style={{width: '15%'}}>Interés</th>
                        <th style={{width: '15%'}}>Monto</th>
                        <th style={{width: '15%'}}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        items.map(it=>(
                            <tr key={it.id}>
                                <td>
                                    <div className="form-check font-size-16 m-0">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id={it.id}
                                            disabled={it.disabled}
                                            checked={it.checked}
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor={it.id}
                                        />
                                    </div>
                                </td>
                                <td>{getMonth(parseInt(it.monthYear.split('-')[1]))}</td>
                                <td>{it.monthYear.split('-')[0]}</td>
                                <td><Badge 
                                        className={"font-size-12 badge-soft-"+classBadge(it.status)}
                                        color={classBadge(it.status)}
                                        pill
                                    >{getTranslateAction(it.status)}</Badge></td>
                                <td>{numberFormat(it.interest)}</td>
                                <td>{numberFormat(it.amount)}</td>
                                <td><strong>{numberFormat(rowTotal(it.interest, it.amount))}</strong></td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default TableCharges