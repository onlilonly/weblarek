import { IBuyer } from "../../../types/index.ts";

interface ErrorsBuyer {
    payment?: "Не указан вид оплаты";
    email?: "Введите емэйл";
    phone?: "Введите номер телефона";
    address?: "Укажите адрес";
}

export class BuyerInfo {
    payment: "online" | "cash" | "";
    email: string;
    phone: string;
    address: string;

    constructor() {
        this.payment = "";
        this.email = "";
        this.phone = "";
        this.address = "";
    }

    setPayment(payment: "online" | "cash" | ""): void {
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
        this.payment = "";
        this.email = "";
        this.phone = "";
        this.address = "";
    }

    validateBuyerInfo(): ErrorsBuyer | null {
        let errors: ErrorsBuyer = {};
        let hasErrors: boolean = false;
        if (!this.payment) {
            errors.payment = "Не указан вид оплаты";
            hasErrors = true;
        }

        if (!this.email) {
            errors.email = "Введите емэйл";
            hasErrors = true;
        }

        if (!this.phone) {
            errors.phone = "Введите номер телефона";
            hasErrors = true;
        }

        if (!this.address) {
            errors.address = "Укажите адрес";
            hasErrors = true;
        }

        if (hasErrors) {
            return errors;
        }

        return null;
    }
}
