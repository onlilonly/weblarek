import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { ProductCard } from "./productCard";

interface ProductInBasketData {
    index: number;
}

export class ProductInBasket extends ProductCard<ProductInBasketData> {
    protected productIndexElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.productIndexElement = ensureElement<HTMLElement>(
            ".basket__item-index",
            this.container
        );
        this.deleteButton = ensureElement<HTMLButtonElement>(
            ".basket__item-delete",
            this.container
        );
        this.deleteButton.addEventListener("click", () => {
            this.events.emit("product:delete", this);
        });
    }

    set index(value: number) {
        this.productIndexElement.textContent = String(value);
    }
}
