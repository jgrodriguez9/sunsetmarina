export const existsRole = (roles, rolesToCheck) => {
    const rolesList = [
        'ROLE_ADMIN', 
        'ROLE_COMPANY_ADMIN', 
        'ROLE_OPERATIONS', 
        'ROLE_ACCOUNTING', 
        'ROLE_MANAGER',
        'ROLE_TOUR'
    ]

    if(!rolesToCheck)  return true;
    if(!roles) return true;

    return roles.every(r => {
        if(rolesToCheck.includes(r)){
            return true;
        }
        return false;
    })
}