import { Badge } from "reactstrap";

export default function CellFormatEnable({value, okText, failText, badge=true}){

    return badge ? <Badge color={value ? 'success' : 'danger '}>{value ? okText : failText}</Badge> :
                   <Badge color={'light'}>{value ? okText : failText}</Badge>
}