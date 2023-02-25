export default function CellActions({edit, row, del}){

    return (
        <>
            {edit.allow && <span onClick={() => edit.action(row)} className="pe-2"><i className="fas fa-edit text-info" /></span>}
            {del.allow && <span onClick={() => del.action(row)}><i className="far fa-trash-alt text-danger" /></span>}
        </>
    )
}