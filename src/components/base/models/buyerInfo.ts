import { IBuyer } from "../../../types/index.ts";

interface ErrorsBuyer {
    payment?: "Не указан вид оплаты";
    email?: "Введите емэйл";
    phone?: "Введите номер телефона";
    address?: "Укажите адрес";
}

export class BuyerInfo {
    payment: "online" | "cash";
    email: string;
    phone: string;
    address: string;

    constructor() {
        this.payment = "online";
        this.email = "";
        this.phone = "";
        this.address = "";
    }

    setPayment(payment: "online" | "cash"): void {
        this.payment = payment;
    }

    setEmail(email: string): void {
        this.email = email;
    }

    setPhone(phone: string): void {
        this.phone = phone;
    }

    setAddress(address: string): void {
        this.address = address;
    }

    getBuyerInfo(): IBuyer {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address,
        };
    }

    deleteBuyerInfo(): void {
        this.payment = "online";
        this.email = "";
        this.phone = "";
        this.address = "";
    }

    validateBuyerInfo(
        payment: "online" | "cash",
        email: string,
        phone: string,
        address: string
    ): ErrorsBuyer | null {
        let errors: ErrorsBuyer = {};
        let hasErrors: boolean = false;
        if (!payment) {
            errors.payment = "Не указан вид оплаты";
            hasErrors = true;
        }

        if (!email) {
            errors.email = "Введите емэйл";
            hasErrors = true;
        }

        if (!phone) {
            errors.phone = "Введите номер телефона";
            hasErrors = true;
        }

        if (!address) {
            errors.address = "Укажите адрес";
            hasErrors = true;
        }

        if (hasErrors) {
            return errors;
        }

        return null;
    }
}
