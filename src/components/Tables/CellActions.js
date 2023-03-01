import TooltipDescription from "../Common/TooltipDescription";

export default function CellActions({edit, row, del}){

    return (
        <>
            {edit.allow && <span onClick={() => edit.action(row)} className="pe-2" id="btn-span-editar">
                            <i className="fas fa-edit text-info" />
                            <TooltipDescription text="Editar" id="btn-span-editar" />
                           </span>}
            {del.allow && <span onClick={() => del.action(row)} id="btn-span-eliminar">
                            <i className="far fa-trash-alt text-danger" />
                            <TooltipDescription text="Eliminar" id="btn-span-eliminar" />
                          </span>}
        </>
    )
}