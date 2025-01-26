import moment from "moment"

const CellDate = ({value}) => {

    return value ? moment.utc(value).local().format('DD-MM-YYYY') : ''
}

export default CellDate