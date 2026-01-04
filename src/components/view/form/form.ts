import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

interface FormData {
    submitText: string;
    errors: HTMLElement[];
}

export abstract class Form<T> extends Component<T & FormData> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.submitButton = ensureElement<HTMLButtonElement>(
            "button[type=submit]",
            this.container
        );
        this.errorsElement = ensureElement<HTMLElement>(
            ".form__errors",
            this.container
        );
        this.submitButton.addEventListener("click", () => {
            this.events.emit(`${this.container.dataset.name}:submit`);
        });
    }

    set submitText(value: string) {
        this.submitButton.textContent = value;
    }
    
    set errors(items: HTMLElement[]) {
        this.errorsElement.replaceChildren(...items);
    }
}
