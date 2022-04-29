import React, {ReactNode, UIEventHandler, useEffect, useMemo, useRef, useState} from "react";
import styles from "@/styles/list.module.scss";

type RenderProps = {
    data: any,
    index: number,
    style: React.CSSProperties
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
    className?: string
}

const List: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLDivElement>> = React.forwardRef<HTMLDivElement, Props>((props, ref) => {

    const listRef = ref as React.RefObject<HTMLDivElement> || useRef<HTMLDivElement>(null);

    const listHeader = useMemo(() => {
        if (props.header) return <props.header />
    }, []);

    const checkEndReached = (event: Event) => {
        if (props.onEndReached) {
            const {scrollHeight, scrollTop, offsetHeight} = event.target as HTMLDivElement;
            const threshold = props.thresholdEnd || 0;
            if (scrollHeight - scrollTop - offsetHeight <= threshold) {
                props.onEndReached();
            }
        }
    }

    useEffect(() => {
        const listElement = listRef.current;
        if (listElement) {
            listElement.addEventListener("scroll", checkEndReached)
            return () => {
                listElement.removeEventListener("scroll", checkEndReached)
            }
        }

    }, [listRef])

    return (
        <div className={styles.list + (props.className ? " " + props.className : "")} ref={listRef}>
            {listHeader}
            <ListElements
                ref={listRef}
                prerenderCount={props.prerenderCount}
                componentHeight={props.componentHeight}
                keyExtractor={props.keyExtractor}
                data={props.data}
                render={props.render}
            />
        </div>
    );
});

type ListElementsProps = {
    prerenderCount: number,
    componentHeight: number,
    keyExtractor: (data: any) => any,
    data: any[],
    render: React.FC<RenderProps>
}

const ListElements: React.ForwardRefExoticComponent<ListElementsProps & React.RefAttributes<HTMLDivElement>> = React.forwardRef<HTMLDivElement, ListElementsProps>((props, ref) => {

    const {prerenderCount, componentHeight} = props;
    const listRef = ref as React.RefObject<HTMLDivElement>;
    const listElementsRef = useRef<HTMLDivElement>(null);

    const [verticalPosition, setVerticalPosition] = useState(0);
    const [listHeight, setListHeight] = useState(0);

    useEffect(() => {
        const listElement = listRef.current;

        const updateListHeight = () => {
            if (listElement) {
                const clientHeight = listElement.clientHeight;
                if (clientHeight) setListHeight(clientHeight);
            }
        }

        updateListHeight();
        window.addEventListener("resize", updateListHeight);
        return () => {
            window.removeEventListener("resize", updateListHeight);
        }
    }, [listRef]);

    useEffect(() => {
        const listElement = listRef.current;
        if (listElement) {
            listElement.addEventListener("scroll", updateVerticalPosition)
            return () => {
                listElement.removeEventListener("scroll", updateVerticalPosition)
            }
        }

    }, [listRef])

    const updateVerticalPosition = (event: Event) => {
        const offsetTop = listElementsRef.current?.offsetTop || 0;
        const scrollTop = (event.target as HTMLDivElement).scrollTop;
        const position = scrollTop - offsetTop;
        setVerticalPosition(position);
    }

    const lowestBoundaryPixel = verticalPosition - (prerenderCount * componentHeight);
    const highestBoundaryPixel = verticalPosition + listHeight + (prerenderCount * componentHeight);
    const elements = props.data.map((data, index) => {

        const topPosition = index * componentHeight;

        if (topPosition >= lowestBoundaryPixel && topPosition <= highestBoundaryPixel) {
            return (
                <props.render
                    key={props.keyExtractor(data)}
                    data={data}
                    index={index}
                    style={{
                        top: topPosition,
                        position: "absolute"
                    }}
                />
            )
        }
    });

    return (
        <div className={styles.listElements} ref={listElementsRef} style={{height: props.data.length * componentHeight}}>
            {elements}
        </div>
    )
});

export default List;