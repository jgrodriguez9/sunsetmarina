import { Button } from "reactstrap";

export default function TabActionHeader({add}){

    return (
        <div className="f-flex">
            {add.allow && 
            <div className="pe-2">
                <Button 
                    color="light" 
                    type="button" 
                    onClick={add.handleAction}
                > Agregar</Button>
            </div>
            }
        </div>
    )
}