import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { ProductCard } from "./productCard";
import { categoryMap } from "../../../utils/constants";
import { CDN_URL } from "../../../utils/constants";

interface ProductInGalleryData {
    category: string;
    image: string;
}

export class ProductInGallery extends ProductCard<ProductInGalleryData> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

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
        this.container.addEventListener("click", () => {
            this.events.emit("product:select", this);
        });
    }

    set category(value: string) {
        this.categoryElement.textContent = value;
        this.categoryElement.className = "card__category";
        const categoryClass = Object.entries(categoryMap).find(
            ([key]) => key === value
        );
        if (categoryClass) {
            this.categoryElement.classList.add(`${categoryClass?.[1]}`);
        }
    }

    set image(value: string) {
        this.setImage(this.imageElement, CDN_URL + value);
    }
}
