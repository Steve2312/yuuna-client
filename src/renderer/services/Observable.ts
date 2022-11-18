import { Dispatch, SetStateAction } from 'react'

class Observable<StateProps> {

    private observers: Dispatch<SetStateAction<StateProps>>[] = []

    public attach = (observer: Dispatch<SetStateAction<StateProps>>): void => {
        this.observers.push(observer)
    }

    public detach = (observer: Dispatch<SetStateAction<StateProps>>): void => {
        const index = this.observers.indexOf(observer)
        if (index > -1) {
            this.observers.splice(index, 1)
        }
    }

    public notify = (state: StateProps): void => {
        console.log(`${this.constructor.name} notified ${this.observers.length} observer(s)`)
        for (const observer of this.observers) {
            observer(state)
        }
    }
}

export default Observable