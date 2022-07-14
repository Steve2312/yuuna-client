import Observable from '@/services/Observable';
import Beatconnect from '@/utils/Beatconnect';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import Beatmap from '@/types/Beatmap';

export type SearchServiceStateProps = {
    input: {
        query: string,
        status: string
    },
    request: {
        timeout: NodeJS.Timeout | null,
        instance: Promise<AxiosInstance | void> | null,
        error: AxiosError | null
    },
    results: {
        beatmaps: Beatmap[],
        page: number,
        lastPage: boolean
    }
}

class SearchService extends Observable<SearchServiceStateProps> {

    private query: string;
    private status: string;

    private timeout: NodeJS.Timeout | null = null;
    private instance: Promise<AxiosInstance | void> | null = null;
    private error: AxiosError | null = null;

    private beatmaps: Beatmap[] = [];
    private beatmapIds: Set<number> = new Set<number>();

    private page = 0;
    private lastPage = false;

    private cancelToken = axios.CancelToken;
    private source = this.cancelToken.source();

    public search(query: string, status: string): void {

        this.clearTimeout();
        this.cancel();

        this.timeout = setTimeout(() => {
            this.query = query;
            this.status = status;
            this.page = 0;
            this.lastPage = false;
            this.error = null;

            this.instance = Beatconnect.get('/search', this.getRequestConfig())
                .then(response => {
                    this.handleSearch(response);
                }).catch(error => {
                    this.handleError(error);
                }
                );

            this.notify(this.getState());

        }, 1000);

        this.notify(this.getState());
    }

    public searchNext = (): void => {
        if (!this.instance && !this.lastPage) {
            this.instance = Beatconnect.get('/search', this.getRequestConfig())
                .then(response => {
                    this.handleSearchNext(response);
                }).catch(error => {
                    this.handleError(error);
                });

            this.notify(this.getState());
        }
    };

    private cancel = (): void => {
        if (this.instance) {
            this.source.cancel();
            this.cancelToken = axios.CancelToken;
            this.source = this.cancelToken.source();
            this.instance = null;
        }
    };

    private clearTimeout = (): void => {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    };

    private handleSearch = (response: AxiosResponse): void => {
        this.instance = null;
        this.beatmapIds.clear();
        this.beatmaps = [...this.filterDuplicateBeatmaps(response.data.beatmaps)];
        this.lastPage = response.data.beatmaps.length < 50;
        this.timeout = null;
        this.page++;
        this.notify(this.getState());
    };

    private handleSearchNext = (response: AxiosResponse): void => {
        this.instance = null;
        this.beatmaps = [...this.beatmaps, ...this.filterDuplicateBeatmaps(response.data.beatmaps)];
        this.lastPage = response.data.beatmaps.length < 50;
        this.timeout = null;
        this.page++;

        this.notify(this.getState());
    };

    private filterDuplicateBeatmaps(beatmaps: Beatmap[]): Beatmap[] {
        return beatmaps.filter((beatmap) => {
            if (this.beatmapIds.has(beatmap.id)) {
                return false;
            } else {
                this.beatmapIds.add(beatmap.id);
                return true;
            }
        });
    }

    private handleError = (error: AxiosError): void => {
        this.instance = null;
        this.timeout = null;

        if (!axios.isCancel(error)) {
            this.error = error;
            this.notify(this.getState());
        }
    };

    private getRequestConfig = (): AxiosRequestConfig => {
        return {
            cancelToken: this.source.token,
            params: {
                q: this.query,
                s: this.status,
                p: this.page
            }
        };
    };

    public getState = (): SearchServiceStateProps => {
        return {
            input: {
                query: this.query,
                status: this.status
            },
            request: {
                timeout: this.timeout,
                instance: this.instance,
                error: this.error
            },
            results: {
                beatmaps: this.beatmaps,
                page: this.page,
                lastPage: this.lastPage
            }
        };
    };
}

export default new SearchService();