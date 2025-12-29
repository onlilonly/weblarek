import { IProductFromApi, IBuyerFromApi } from "../../../types/index.ts";
import { Api } from "../Api.ts";

export class Communication {
    api: Api;

    constructor(api: Api) {
        this.api = api;
    }

    getItems(): Promise<IProductFromApi> {
        return this.api.get("/product/");
    }

    postOrder(orderInfo: IBuyerFromApi): void {
        this.api.post("/order/", orderInfo);
    }
}
