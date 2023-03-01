import { Input, Label } from "reactstrap";

export default function ControlFilter({field, handleChange}){


    switch(field.control){
        case 'input':
            return (
                <>
                    <Label htmlFor={field.field} className="mb-0">{field.label}</Label>
                    <Input
                        id={field.field}
                        className={`form-control`}
                        onChange={(e) => handleChange(field.field, e.target.value, 'input')}
                        value={field.value}  
                    />
                </>
            );
        case 'checkbox':
            return (
                <>
                    <Label className="mb-0 d-block opacity-0">placeholder</Label>
                    <Input
                        id={field.field}
                        name="activo"
                        type="checkbox"
                        className={`form-check-Input form-check-input`}
                        onChange={(e) => {
                            handleChange(field.field, e.target.checked, 'checkbox')
                        }}
                        checked={field.value || false}  
                    />
                    <Label htmlFor={field.field} className="mb-0 ms-2">{field.label}</Label>
                </>
            );
        default:
            return;
    }


}