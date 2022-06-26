import Observable from '@/services/Observable';

export type OutletServiceStateProps = {
    route: string
}

class OutletService extends Observable<OutletServiceStateProps> {

    private routes = ['search', 'library'];
    private route: string = this.routes[0];

    public navigate = (route: string): void => {
        if (this.routes.includes(route) && this.route != route) {
            this.route = route;
            this.notify(this.getState());
        }
    };

    public getState = (): OutletServiceStateProps => {
        return {
            route: this.route
        };
    };
}

export default new OutletService();