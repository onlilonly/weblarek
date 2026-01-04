import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { ProductCard } from "./productCard";
import { categoryMap } from "../../../utils/constants";

interface ProductPreviewData {
    category: string;
    text: string;
    image: string;
}

export class ProductPreview extends ProductCard<ProductPreviewData> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected textElement: HTMLElement;
    protected cardButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.categoryElement = ensureElement<HTMLElement>(
            ".card__category",
            this.container
        );
        this.imageElement = ensureElement<HTMLImageElement>(
            ".card__image",
            this.container
        );
        this.textElement = ensureElement<HTMLElement>(
            ".card__text",
            this.container
        );
        this.cardButton = ensureElement<HTMLButtonElement>(
            ".card__button",
            this.container
        );
        this.cardButton.addEventListener("click", () => {
            this.events.emit("product:choose");
        });
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        this.categoryElement.className = ".card__category";
        const categoryClass = Object.entries(categoryMap).find(
            ([key]) => key === value
        );
        if (categoryClass) {
            this.categoryElement.classList.add(`${categoryClass?.[1]}`);
        }
    }

    set image(value: string) {
        this.setImage(this.imageElement, value);
    }

    set text(value: string) {
        this.textElement.textContent = value;
    }
}
