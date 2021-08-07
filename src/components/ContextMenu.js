import React, {createRef, useEffect, useState} from 'react';
import ContextMenuHandler from '../helpers/ContextMenuHandler';
import { preventDefault } from '../helpers/utils';
import "../styles/contextMenu.css";

function ContextMenu() {

    const [data, setData] = useState(ContextMenuHandler.getData());
    const menuRef = createRef();

    useEffect(() => {
        ContextMenuHandler.addObserver(setData);
        return () => {
            ContextMenuHandler.removeObserver(setData);
        }
    }, []);

    useEffect(() => {
        console.log(data)

        if (data.buttons.length > 0) {
            document.getElementsByClassName("appLayout")[0].addEventListener("mousedown", ContextMenuHandler.clear);
            document.getElementsByClassName("appLayout")[0].addEventListener("contextmenu", ContextMenuHandler.clear);
            document.getElementsByClassName("appLayout")[0].addEventListener("mousewheel", preventDefault);
            window.addEventListener("resize", ContextMenuHandler.clear);
        } else {
            document.getElementsByClassName("appLayout")[0].removeEventListener("mousedown", ContextMenuHandler.clear);
            document.getElementsByClassName("appLayout")[0].removeEventListener("contextmenu", ContextMenuHandler.clear);
            document.getElementsByClassName("appLayout")[0].removeEventListener("mousewheel", preventDefault);
            window.removeEventListener("resize", ContextMenuHandler.clear);
        }
    }, [data]);

    useEffect(() => {
        if (menuRef.current != null) {
            const menuHeight = menuRef.current.clientHeight;
            const menuWidth = menuRef.current.clientWidth;

            const windowHeight = window.innerHeight;
            const windowWidth = window.innerWidth;

            var translateX = data.top + menuHeight > windowHeight ? (data.top + menuHeight - windowHeight) / menuHeight  * -100 - 5 : 0;
            var translateY = data.left + menuWidth > windowWidth ? -100 : 0;

            menuRef.current.style.transform = 'translate(' + translateY + '%, ' + translateX + '%)'
            menuRef.current.style.opacity = 1
        }
    }, [menuRef])

    const contextButtons = data.buttons.map((buttonData, index) => {
        if (buttonData.buttons) {
            const subButtons = buttonData.buttons.map((subButton, subIndex) => <ContextButton key={index + '' + subIndex} buttonData={subButton}/>)
            const left = data.left + 180 * 2 > window.innerWidth ? "-180px" : "100%";
            return (
                <ContextButton key={index} buttonData={buttonData}>
                    <ContextMenuWrapper style={{left: left}} id="subContextMenu">
                        {subButtons}
                    </ContextMenuWrapper>
                </ContextButton>
            )
        }
        return(
            <ContextButton key={index} buttonData={buttonData}/>
        );
    });

    
    const contextMenu = () => {
        if (contextButtons.length > 0) {
            return (
                <ContextMenuWrapper reference={menuRef} style={{top: data.top, left: data.left, opacity: 0}} id="contextMenu">
                    {contextButtons}
                </ContextMenuWrapper>
            );
        }
        return null;
    };

    return (contextMenu());
}

function ContextButton(props) {

    function buttonFunction() {
        if (props.buttonData.function) props.buttonData.function();
        if (!props.buttonData.buttons) ContextMenuHandler.clear();
    }

    return (
        <div onClick={buttonFunction}>
            <span>{props.buttonData.name}</span>
            {props.buttonData.buttons ? <i className="fas fa-chevron-right"></i> : null}
            {props.children}
        </div>
    );
}

function ContextMenuWrapper(props) {
    return <div ref={props.reference} style={props.style} id={props.id}>{props.children}</div> 
}

export default ContextMenu;