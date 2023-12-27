"use client"
import {slide as Menu} from "react-burger-menu"
import HeaderBtn from "@/app/_components/HeaderBtn";

const HamburgerMenu = () => {


    return (
        <Menu right noOverlay width={150}>
            <HeaderBtn content={"Click"} className={""} redirectPath={""}/>
            <HeaderBtn content={"Click"} className={""} redirectPath={""}/>
        </Menu>
    )
};

export default HamburgerMenu;