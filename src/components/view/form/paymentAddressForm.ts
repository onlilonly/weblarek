import { Form } from "./form";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

interface PaymentAddressFormData {
    address: string;
}

export class PaymentAddressForm extends Form<PaymentAddressFormData> {
    protected paymentOnlineButton: HTMLButtonElement;
    protected paymentCashButton: HTMLButtonElement;
    protected addressInputElement: HTMLInputElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container, events);
        this.paymentOnlineButton = ensureElement<HTMLButtonElement>(
            "button[name=card]",
            this.container
        );
        this.paymentCashButton = ensureElement<HTMLButtonElement>(
            "button[name=cash]",
            this.container
        );
        this.addressInputElement = ensureElement<HTMLInputElement>(
            "input[name=address]",
            this.container
        );
        this.paymentOnlineButton.addEventListener("click", () => {
            this.paymentCashButton.classList.remove("button_alt-active");
            this.paymentOnlineButton.classList.add("button_alt-active");
            this.events.emit("payment:online");
        });
        this.paymentCashButton.addEventListener("click", () => {
            this.paymentOnlineButton.classList.remove("button_alt-active");
            this.paymentCashButton.classList.add("button_alt-active");
            this.events.emit("payment:cash");
        });
        this.addressInputElement.addEventListener("input", () => {
            this.events.emit("address:input");
        });
    }

    set address(value: string) {
        this.addressInputElement.value = value;
    }
}
