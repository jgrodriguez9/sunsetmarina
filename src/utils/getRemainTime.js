import moment from "moment"

const getRemainTime = (reminderDate) => {
    const currentDate = moment();
    const rDate = moment(reminderDate, "YYYY-MM-DDTHH:mm")

    const daysReamin = rDate.diff(currentDate, 'days')
    const hoursReamin = rDate.diff(currentDate, 'hours')
    const minutsReamin = rDate.diff(currentDate, 'minutes')

    if(daysReamin > 0){
        return (
            <>
                <i className={`mdi mdi-clock-outline me-1 fs-6 ${daysReamin <= 2 ? 'text-danger' : 'text-warning'}`} />
                {`${daysReamin} ${daysReamin > 1 ? 'días' : 'día'}`}
            </>
        )
    }else if(hoursReamin > 0){
        return (
            <>
                <i className={`mdi mdi-clock-outline me-1 fs-6 text-danger`} />
                {`${hoursReamin} ${hoursReamin > 1 ? 'horas' : 'hora'}`}
            </>
        )
    }else{
        return (
            <>
                <i className={`mdi mdi-clock-outline me-1 fs-6 text-danger`} />
                {`${minutsReamin} ${minutsReamin > 1 ? 'minutos' : 'minuto'}`}
            </>
        )
    }
}

export default getRemainTime