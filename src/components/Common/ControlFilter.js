import { Input, Label } from "reactstrap";

export default function ControlFilter({field, handleChange, handleFilter}){


    switch(field.control){
        case 'input':
            return (
                <>
                    <Label htmlFor={field.field} className="mb-0">{field.label}</Label>
                    <Input
                        id={field.field}
                        className={`form-control`}
                        onChange={(e) => handleChange(field.field, e.target.value)}
                        value={field.value}  
                        onBlur={handleFilter}
                    />
                </>
            );
        default:
            return;
    }


}