import React from "react"
import { ISocket } from "."

export default function UserMouse({ loginUser, loginId, path }: any) {
    console.log(1)
    return loginUser.map((v: { userId: string, workInfo: ISocket }) => {
        if (v.userId !== loginId && path === v.workInfo.workingPath && v.workInfo.userMouse !== undefined) {
            let realX = v.workInfo.userMouse.x / v.workInfo.userMouse.screenSize.x * window.innerWidth;
            let realY = v.workInfo.userMouse.y / v.workInfo.userMouse.screenSize.y * window.innerHeight;

            return <div
                style={{
                    position: "absolute",
                    top: realY > window.innerHeight - 15 ? window.innerHeight - 15 : realY,
                    left: realX > window.innerWidth - 15 ? window.innerWidth - 15 : realX,
                    width: "15px",
                    height: "15px",
                    zIndex: 99,
                    background: "red",
                    borderRadius: "7.5px"
                }} />
        }
    })
}