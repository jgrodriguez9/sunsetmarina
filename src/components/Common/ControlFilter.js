import Select from "react-select";
import { Input, Label } from "reactstrap";
import { SELECT_OPTION } from "../../constants/messages";
import SimpleDate from "../DatePicker/SimpleDate";

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
        case 'date':
            return (
                <>
                    <Label htmlFor={field.field} className="mb-0">{field.label}</Label>
                    <SimpleDate 
                        date={field.valueDate}
                        setDate={value=>handleChange(field.field, value, 'date')}
                        placeholder="dd-MM-YYYY"
                    />
                </>
            );
        case 'select':
            return (
                <>
                    <Label htmlFor={field.field} className="mb-0">{field.label}</Label>
                    <Select
                        value={field.valueSelect}
                        onChange={(value) => handleChange(field.field, value, 'select')}
                        options={field.options}
                        classNamePrefix="select2-selection"
                        placeholder={SELECT_OPTION}
                        isClearable
                    />
                </>
            );
        default:
            return;
    }


}