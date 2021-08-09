import React from "react"
import {Home as H, Single as S} from "./app"
export function Home(props) {
    window.React = React
    return <H {...props} />
}
export function Single(props) {
    window.React = React
    return <S {...props} />
}