export default function ContentLoader({text="Cargando"}){
    return (
        <div className="text-center text-dark content-loader">
                <i className="bx bx-loader bx-spin fs-1 align-middle me-2" />
                {text}
        </div>
    )
}