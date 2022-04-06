import Observable from "@/services/Observable";
import Beatconnect from "@/utils/Beatconnect";
import axios, {AxiosError, AxiosInstance, AxiosResponse} from "axios";

class SearchService extends Observable{

    private query: string;
    private status: string;

    private timeout: NodeJS.Timeout | null = null;
    private instance: Promise<AxiosInstance | void> | null = null;
    private errorStatus: number | null = null;

    private beatmaps: any[] = [];
    private page: number = 0;
    private lastPage: boolean = false;

    private cancelToken = axios.CancelToken;
    private source = this.cancelToken.source();

    public search(query: string, status: string) {

        this.clearTimeout();
        this.cancel();

        this.timeout = setTimeout(() => {
            this.query = query;
            this.status = status;
            this.page = 0;
            this.lastPage = false;
            this.errorStatus = null;

            this.instance = Beatconnect.get("/search", this.getRequestConfig())
                .then(response => {
                    this.handleSearch(response);
                }).catch(error => {
                    this.handleError(error);
                }
            );
        }, 1000);
    }

    public searchNext = () => {
        if (!this.instance && !this.lastPage) {
            this.instance = Beatconnect.get("/search", this.getRequestConfig())
                .then(response => {
                    this.handleSearchNext(response);
                }).catch(error => {
                        this.handleError(error);
                    }
                );
        }
    }

    private cancel = () => {
        if (this.instance) {
            this.source.cancel();
            this.cancelToken = axios.CancelToken;
            this.source = this.cancelToken.source();
            this.instance = null;
        }
    }

    private clearTimeout = () => {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    }

    private handleSearch = (response: AxiosResponse) => {
        this.instance = null;
        this.beatmaps = [...response.data.beatmaps]
        this.lastPage = response.data.beatmaps.length < 50;
        this.timeout = null;
        this.page++;
        this.notify(this.getState());
    }

    private handleSearchNext = (response: AxiosResponse) => {
        this.instance = null;
        this.beatmaps = [...this.beatmaps, ...response.data.beatmaps]
        this.lastPage = response.data.beatmaps.length < 50;
        this.timeout = null;
        this.page++;
        this.notify(this.getState());
    }

    private handleError = (error: AxiosError) => {
        this.instance = null;

        if (!axios.isCancel(error)) {
            this.errorStatus = error.request.status;
            this.notify(this.getState());
        }
    }

    private getRequestConfig = () => {
        return {
            cancelToken: this.source.token,
            params: {
                q: this.query,
                s: this.status,
                p: this.page
            }
        }
    }

    public getState = () => {
        return {
            input: {
                query: this.query,
                status: this.status,
            },
            request: {
                timeout: this.timeout,
                instance: this.instance,
                errorStatus: this.errorStatus,
            },
            results: {
                beatmaps: this.beatmaps,
                page: this.page,
                lastPage: this.lastPage,
            }
        }
    }

}

export default new SearchService();