import { Input, Label } from "reactstrap";

export default function ControlFilter({field}){


    switch(field.control){
        case 'input':
            return (
                <>
                    <Label htmlFor={field.field} className="mb-0">{field.label}</Label>
                    <Input
                        id={field.field}
                        className={`form-control`}
                        onChange={() => {}}
                        value={field.value}  
                    />
                </>
            );
        default:
            return;
    }


}