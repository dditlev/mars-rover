/**
 * There is no bundling, the React dependency is loaded through unpkg
 * via the html file. To allow Jest to test, we bind React to 
 * window, like when loading through unpkg.
 */
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