import React, {
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import styles from '@/styles/list.module.scss';
import classNames from '@/utils/ClassNames';

type RenderProps<T> = {
    data: T,
    index: number,
    style: React.CSSProperties,
}

type ListProps<T> = {
    prerenderCount: number,
    componentHeight: number,
    header?: React.FC,
    footer?: React.FC,
    keyExtractor: (data: T) => string | number,
    data: T[],
    render: React.FC<RenderProps<T>>,
    onEndReached?: () => void,
    thresholdEnd?: number,
    className?: string,
    listElementsClassName?: string,
    spaceBetween?: number,
}

type ListElementsProps<T> = {
    prerenderCount: number,
    componentHeight: number,
    keyExtractor: (data: T) => string | number,
    data: T[],
    render: React.FC<RenderProps<T>>,
    className?: string,
    spaceBetween: number,
}

const List = React.forwardRef(<T,>(props: ListProps<T>, ref: React.ForwardedRef<HTMLDivElement>) => {

    const listRef = ref as React.RefObject<HTMLDivElement> || useRef<HTMLDivElement>(null);

    const listHeader = useMemo(() => {
        if (props.header) return <props.header />;
    }, []);

    const listFooter = useMemo(() => {
        if (props.footer) return <props.footer />;
    }, []);

    const checkEndReached = (event: Event): void => {
        if (props.onEndReached) {
            const { scrollHeight, scrollTop, offsetHeight } = event.target as HTMLDivElement;
            const threshold = props.thresholdEnd || 0;
            if (scrollHeight - scrollTop - offsetHeight <= threshold) {
                props.onEndReached();
            }
        }
    };

    useEffect(() => {
        const listElement = listRef.current;
        if (listElement) {
            listElement.addEventListener('scroll', checkEndReached);
            return () => {
                listElement.removeEventListener('scroll', checkEndReached);
            };
        }

    }, [listRef]);

    return (
        <div className={classNames({
            [styles.list]: true,
            [props.className || '']: props.className != undefined
        })} ref={listRef}>
            {listHeader}
            <ListElements
                ref={listRef}
                prerenderCount={props.prerenderCount}
                componentHeight={props.componentHeight}
                keyExtractor={props.keyExtractor}
                data={props.data}
                render={props.render}
                className={props.listElementsClassName}
                spaceBetween={props.spaceBetween || 0}
            />
            {listFooter}
        </div>
    );
});

const ListElements = React.forwardRef(<T,>(props: ListElementsProps<T>, ref: React.ForwardedRef<HTMLDivElement>) => {
    const { prerenderCount, componentHeight, spaceBetween } = props;
    const listRef = ref as React.RefObject<HTMLDivElement>;
    const listElementsRef = useRef<HTMLDivElement>(null);

    const [verticalPosition, setVerticalPosition] = useState(0);
    const [listHeight, setListHeight] = useState(0);

    const [listElementComponents, setListElementComponents] = useState<(JSX.Element | null)[]>([]);

    const listTotalHeight = props.data.length * (componentHeight + (props.spaceBetween || 0)) + (props.spaceBetween || 0);

    useEffect(() => {
        const listElement = listRef.current;

        const updateListHeight = (): void => {
            if (listElement) {
                const clientHeight = listElement.clientHeight;
                if (clientHeight) setListHeight(clientHeight);
            }
        };

        updateListHeight();
        window.addEventListener('resize', updateListHeight);

        return () => {
            window.removeEventListener('resize', updateListHeight);
        };
    }, [listRef]);

    useEffect(() => {
        const listElement = listRef.current;
        if (listElement) {
            listElement.addEventListener('scroll', updateVerticalPosition);
            return () => {
                listElement.removeEventListener('scroll', updateVerticalPosition);
            };
        }

    }, [listRef]);

    useEffect(() => {
        const elements = props.data.map((data, index) => {
            return (
                <props.render
                    data={data}
                    index={index}
                    key={props.keyExtractor(data)}
                    style={{
                        top: index * componentHeight + (spaceBetween * (index + 1)),
                        position: 'absolute'
                    }}
                />
            );
        });
        setListElementComponents(elements);

    }, [props.data]);

    const updateVerticalPosition = (event: Event): void => {
        const offsetTop = listElementsRef.current?.offsetTop || 0;
        const scrollTop = (event.target as HTMLDivElement).scrollTop;
        const position = scrollTop - offsetTop;
        setVerticalPosition(position);
    };

    const getElementsInWindow = (): (JSX.Element | null)[] => {
        const componentHeightWithSpacing = listTotalHeight / props.data.length;
        const numberOfComponentsInWindow = Math.round(listHeight / componentHeightWithSpacing);

        const start = verticalPosition / componentHeightWithSpacing - prerenderCount;
        const end = verticalPosition / componentHeightWithSpacing + numberOfComponentsInWindow + prerenderCount;

        return listElementComponents.slice(
            Math.max(0, Math.round(start)),
            Math.round(end)
        );
    };

    return (
        <div className={classNames({
            [styles.listElements]: true,
            [props.className || '']: props.className != undefined
        })} ref={listElementsRef} style={{ height: listTotalHeight }}>
            {getElementsInWindow()}
        </div>
    );
});

declare module 'react' {
    function forwardRef<T, P = unknown>(
        render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
    ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

export default List;