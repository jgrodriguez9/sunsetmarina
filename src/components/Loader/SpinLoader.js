const SpinLoader = () => {
    return (
        <div className="p-3 text-center">
            <div
                className="spinner-border text-info m-1"
                role="status"
                >
                <span className="sr-only">Loading...</span>
            </div> 
        </div>
    )
}

export default SpinLoader