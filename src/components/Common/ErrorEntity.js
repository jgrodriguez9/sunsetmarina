import { Button } from "reactstrap";

export default function ErrorEntity({text, setReload}){
    const refresh = () => {
        setReload(prev=>({
            ...prev,
            reload: true,
            loading: true
        }))
    }
    return(
        <div className="d-flex justify-content-center">
            <div className="h-100 p-5 bg-light border">
                <div className="w-75 text-center m-auto">
                    <h4 className="text-muted">{text}</h4>
                    <Button onClick={refresh} color="link">Volver a intentar</Button>
                </div>
                
                
            </div>
        </div>
    )
}