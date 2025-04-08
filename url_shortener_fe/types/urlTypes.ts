export interface UrlInterface {
    id: number;
    short_code: string;
    long_url: string;
    clicks: number;
    createdAt: Date;
}

export interface CreateUrlPayload {
    long_url: string;
}

export interface UrlsStatistics {
    totalUrls: number,
    totalClicks: number,
    activeUrls: number,
}

export interface PaginationInfo {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PaginatedUrlsResponse {
    urls: UrlInterface[];
    pagination: PaginationInfo;
}