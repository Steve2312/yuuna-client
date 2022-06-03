import {Dispatch, SetStateAction} from "react";

class Observable {

    private observers: Dispatch<SetStateAction<any>>[] = [];

    public attach = (observer: Dispatch<SetStateAction<any>>) => {
        this.observers.push(observer);
    };

    public detach = (observer: Dispatch<SetStateAction<any>>) => {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    };

    public notify = (state: any) => {
        console.log(`${this.constructor.name} notified ${this.observers.length} observer(s)`);
        for (const observer of this.observers) {
            observer(state);
        }
    };
}

export default Observable;