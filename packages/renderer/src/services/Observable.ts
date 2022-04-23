class Observable {

    private observers: Function[] = [];

    public attach = (observer: Function) => {
        this.observers.push(observer);
    }

    public detach = (observer: Function) => {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }

    public notify = (state: {}) => {
        console.log(`${this.constructor.name} notified ${this.observers.length} observer(s)`)
        for (let observer of this.observers) {
            observer(state);
        }
    }
}

export default Observable;