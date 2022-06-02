import Observable from "@/services/Observable";

class OutletService extends Observable{

    private routes = ["search", "library"];
    private route: string = this.routes[0];

    public navigate = (route: string) => {
        if (this.routes.includes(route) && this.route != route) {
            this.route = route;
            this.notify(this.getState());
        }
    };

    public getState = () => {
        return {
            route: this.route
        };
    };
}

export default new OutletService();
