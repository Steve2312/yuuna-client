import React, {useEffect, useMemo, useRef, useState} from "react";
import styles from "@/styles/list.module.scss";

type RenderProps = {
    data: any,
    index: number
}

type Props = {
    prerenderCount: number,
    componentHeight: number,
    header?: React.FC,
    keyExtractor: (data: any) => any,
    data: any[],
    render: React.FC<RenderProps>,
    onEndReached?: Function,
    thresholdEnd?: number,
}

const List: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLDivElement>> = React.forwardRef<HTMLDivElement, Props>((props, ref) => {

    const {prerenderCount, componentHeight} = props;

    const listRef = ref as React.RefObject<HTMLDivElement> || useRef<HTMLDivElement>(null);
    const listElementsRef = useRef<HTMLDivElement>(null);

    const [verticalPosition, setVerticalPosition] = useState(0);
    const [listHeight, setListHeight] = useState(0);

    useEffect(() => {
        const listElement = listRef.current;

        if (listElement) {
            updateListHeight();
            listElement.addEventListener("scroll", updateVerticalPosition);
            listElement.addEventListener("scroll", checkEndReached);
            window.addEventListener("resize", updateListHeight);
            return () => {
                listElement.removeEventListener("scroll", updateVerticalPosition);
                listElement.removeEventListener("scroll", checkEndReached);
                window.removeEventListener("resize", updateListHeight);
            }
        }
    }, [listRef]);

    const updateListHeight = () => {
        const clientHeight = listRef.current?.clientHeight;
        if (clientHeight) setListHeight(clientHeight);
    }

    const updateVerticalPosition = (event: Event) => {
        const offsetTop = listElementsRef.current?.offsetTop || 0;
        const scrollTop = (event.target as HTMLDivElement).scrollTop;
        setVerticalPosition(scrollTop - offsetTop);
    }

    const checkEndReached = (event: Event) => {
        if (props.onEndReached) {
            const {scrollHeight, scrollTop, offsetHeight} = event.target as HTMLDivElement;
            const threshold = props.thresholdEnd || 0;
            if (scrollHeight - scrollTop - offsetHeight <= threshold) {
                props.onEndReached();
            }
        }
    }

    const lowestBoundaryPixel = verticalPosition - (prerenderCount * componentHeight);
    const highestBoundaryPixel = verticalPosition + listHeight + (prerenderCount * componentHeight);
    const elements = props.data.map((data, index) => {

        const topPosition = index * componentHeight;

        if (topPosition >= lowestBoundaryPixel && topPosition <= highestBoundaryPixel) {
            return (
                <div className={styles.listElement} key={props.keyExtractor(data)} style={{top: topPosition}}>
                    <props.render data={data} index={index}/>
                </div>
            )
        }
    });

    const listHeader = useMemo(() => {
        if (props.header) return <props.header />
    }, []);

    const listElements = useMemo( () => {
        return (
            <div className={styles.listElements} ref={listElementsRef} style={{height: props.data.length * componentHeight}}>
                {elements}
            </div>
        )
    }, [props.data, verticalPosition, listHeight]);

    return (
        <div className={styles.list} ref={listRef}>
            {listHeader}
            {listElements}
        </div>
    );
});

export default List;