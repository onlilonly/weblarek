export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(
        uri: string,
        data: object,
        method?: ApiPostMethods
    ): Promise<T>;
}

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: "online" | "cash" | "";
    email: string;
    phone: string;
    address: string;
}

export type IProductFromApi = IProduct[];

type IBuyerFromApiSuccess = IBuyer & {
    items: string[];
    total: number;
};

type IBuyerFromApiError = {
    error: string;
};

export type IBuyerFromApi = IBuyerFromApiSuccess | IBuyerFromApiError;
