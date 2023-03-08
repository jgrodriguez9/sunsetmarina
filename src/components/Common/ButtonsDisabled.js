import { Button } from "reactstrap";

export default function ButtonsDisabled({buttons}){

    return (
        <div className="d-flex">
            {
                buttons.map((b, idx)=>(
                    <Button key={`btns_disabled_${idx}`} disabled color={b.color} type="button" className={b.className}>
                        {b.loader && <i className="bx bx-loader bx-spin font-size-16 align-middle" />} {b.text}
                    </Button>
                ))
            }
        </div>
    )
}