import jwtDecode from "jwt-decode"
import { useEffect, useState } from "react"

export default function useLoguedUser(){
    const [userLogued, setUserLogued] = useState(null)

    useEffect(() => {
        if(localStorage.getItem("sunsetadmiralauth")){
            const obj = JSON.parse(localStorage.getItem("sunsetadmiralauth"))
            const decode = jwtDecode(obj.token)
            setUserLogued(decode.user)
        }
    }, [])


    return userLogued;
}