import { Badge } from "reactstrap";

export default function CellFormatEnable({value}){

    return <Badge color={value ? 'success' : 'danger '}>{value ? 'Habilitado' : 'No Habilitado'}</Badge>
}