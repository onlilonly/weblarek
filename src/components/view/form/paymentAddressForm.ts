import { Form } from "./form";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";

interface PaymentAddressFormData {
    payment: "online" | "cash" | "";
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
            this.events.emit("payment:online");
        });
        this.paymentCashButton.addEventListener("click", () => {
            this.events.emit("payment:cash");
        });
        this.addressInputElement.addEventListener("input", () => {
            this.events.emit("address:input", {
                value: this.addressInputElement.value,
            });
        });
        this.submitButton.addEventListener("click", () => {
            this.events.emit("order:submit");
        });
    }

    set payment(value: "online" | "cash" | "") {
        if (value === "online") {
            this.paymentCashButton.classList.remove("button_alt-active");
            this.paymentOnlineButton.classList.add("button_alt-active");
        } else if (value === "cash") {
            this.paymentOnlineButton.classList.remove("button_alt-active");
            this.paymentCashButton.classList.add("button_alt-active");
        } else if (value === "") {
            this.paymentCashButton.classList.remove("button_alt-active");
            this.paymentOnlineButton.classList.remove("button_alt-active");
        }
    }

    set address(value: string) {
        this.addressInputElement.value = value;
    }
}
