import Observable from '@/services/Observable';

type StateProps = {
    route: string
}

class OutletService extends Observable<StateProps> {

    private routes = ['search', 'library'];
    private route: string = this.routes[0];

    public navigate = (route: string): void => {
        if (this.routes.includes(route) && this.route != route) {
            this.route = route;
            this.notify(this.getState());
        }
    };

    public getState = (): StateProps => {
        return {
            route: this.route
        };
    };
}

export default new OutletService();