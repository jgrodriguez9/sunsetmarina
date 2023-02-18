export const classBadge = value => {
    switch(value){
        case 'pagado':
            return 'success';
        case 'pendiente':
                return 'warning';
        case 'cancelado':
                return 'danger';
        default:
            return 'light';
    }
}