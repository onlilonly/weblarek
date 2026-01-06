import "./scss/styles.scss";
import { Catalog } from "./components/models/catalog.ts";
import { Basket } from "./components/models/basket.ts";
import { BuyerInfo } from "./components/models/buyerInfo.ts";
import { Communication } from "./components/models/communication.ts";
import { Api } from "./components/base/Api.ts";
import { API_URL } from "./utils/constants.ts";
import { Header } from "./components/view/header.ts";
import { Gallery } from "./components/view/gallery.ts";
import { ModalWindow } from "./components/view/modalWindow.ts";
import { OrderSuccess } from "./components/view/orderSuccess.ts";
import { BasketModal } from "./components/view/basketModal.ts";
import { ProductInBasket } from "./components/view/productCards/productInBasket.ts";
import { ProductInGallery } from "./components/view/productCards/productInGallery.ts";
import { ProductPreview } from "./components/view/productCards/productPreview.ts";
import { EmailPhoneForm } from "./components/view/form/emailPhoneForm.ts";
import { PaymentAddressForm } from "./components/view/form/paymentAddressForm.ts";
import { EventEmitter } from "./components/base/Events.ts";
import { ensureElement, cloneTemplate } from "./utils/utils.ts";
import { IProduct, IOrderRequest } from "./types/index.ts";

const events = new EventEmitter();

const productsModel = new Catalog(events);
const productsToBuyModel = new Basket(events);
const buyerInfoModel = new BuyerInfo(events);
const apiModel = new Communication(new Api(API_URL));

const headerModel = new Header(ensureElement(".header"), events);
const galleryModel = new Gallery(ensureElement(".page__wrapper"), events);
const modalWindowModel = new ModalWindow(ensureElement(".modal"), events);
const basketModalModel = new BasketModal(
    cloneTemplate<HTMLElement>("#basket"),
    events
);
const paymentAddressFormModel = new PaymentAddressForm(
    cloneTemplate<HTMLElement>("#order"),
    events
);
const emailPhoneFormModel = new EmailPhoneForm(
    cloneTemplate<HTMLElement>("#contacts"),
    events
);
const orderSuccessModel = new OrderSuccess(
    cloneTemplate<HTMLElement>("#success"),
    events
);

events.on("catalog:setProducts", () => {
    const products = productsModel.getProducts();

    const cards = products.map((product) => {
        const element = cloneTemplate<HTMLTemplateElement>("#card-catalog");
        const card = new ProductInGallery(element, events);
        Object.assign(card as object, product);
        return card.render();
    });
    galleryModel.gallery = cards;
});

events.on("basket:open", () => {
    modalWindowModel.content = basketModalModel.render();
});

events.on("product:select", (product: IProduct) => {
    productsModel.setSelectedProduct(product);
    console.log(productsModel.getSelectedProduct());
});

events.on("catalog:setSelectedProduct", () => {
    const product = productsModel.getSelectedProduct();
    if (!product) return;
    const productSelected = productsModel.getProductById(product.id);
    if (!productSelected) return;
    const previewCard = new ProductPreview(
        cloneTemplate<HTMLElement>("#card-preview"),
        events
    );
    const isInBusket = productsToBuyModel.isProductInBasket(productSelected.id);
    previewCard.buttonText = isInBusket ? "Удалить из корзины" : "Купить";
    if (productSelected.price === null) {
        previewCard.buttonText = "Недоступно";
        previewCard.buttonProhibited();
    }
    Object.assign(previewCard as object, productSelected);
    modalWindowModel.content = previewCard.render();
});

events.on("product:choose", () => {
    const product = productsModel.getSelectedProduct();
    if (!product) return;
    const productToBuy = productsModel.getProductById(product.id);
    if (!productToBuy) return;
    const previewCard = new ProductPreview(
        cloneTemplate<HTMLElement>("#card-preview"),
        events
    );
    const isInBusket = productsToBuyModel.isProductInBasket(product.id);
    if (isInBusket) {
        productsToBuyModel.deleteProductsToBuy(productToBuy);
    } else {
        productsToBuyModel.addProductsToBuy(productToBuy);
    }
    previewCard.buttonText = isInBusket ? "Купить" : "Удалить из корзины";
    Object.assign(previewCard as object, productToBuy);
    modalWindowModel.content = previewCard.render();
});

events.on("basket:addProduct", () => {
    const products = productsToBuyModel.getProductsToBuy();
    let basketCounter = 0;
    let arrProducts: HTMLElement[] = [];

    products.forEach((product) => {
        const productToBuy = productsModel.getProductById(product.id);
        const element = cloneTemplate<HTMLElement>("#card-basket");
        const basketCard = new ProductInBasket(element, events);
        Object.assign(basketCard as object, productToBuy);
        basketCounter++;
        basketCard.index = basketCounter;
        arrProducts.push(basketCard.render());
    });

    headerModel.counter = basketCounter;
    basketModalModel.totalPrice = productsToBuyModel.getCostProductsToBuy();
    basketModalModel.item = arrProducts;
});

events.on("product:delete", (product: IProduct) => {
    const productToDelete = productsModel.getProductById(product.id);
    if (!productToDelete) return;
    productsToBuyModel.deleteProductsToBuy(productToDelete);
});

events.on("basket:deleteProduct", () => {
    const products = productsToBuyModel.getProductsToBuy();
    let basketCounter = 0;
    let arrProducts: HTMLElement[] = [];

    products.forEach((product) => {
        const productToDelete = productsModel.getProductById(product.id);
        const element = cloneTemplate<HTMLElement>("#card-basket");
        const basketCard = new ProductInBasket(element, events);
        Object.assign(basketCard as object, productToDelete);
        basketCounter++;
        basketCard.index = basketCounter;
        arrProducts.push(basketCard.render());
    });
    basketModalModel.item = arrProducts;
    headerModel.counter = basketCounter;
    basketModalModel.totalPrice = productsToBuyModel.getCostProductsToBuy();
});

events.on("busket:submit", () => {
    modalWindowModel.content = paymentAddressFormModel.render();
});

events.on("payment:online", () => {
    buyerInfoModel.setPayment("online");
});

events.on("payment:cash", () => {
    buyerInfoModel.setPayment("cash");
});

events.on("buyer:changePayment", () => {
    const paymentWay = buyerInfoModel.getBuyerInfo();
    paymentAddressFormModel.payment = paymentWay.payment;
    const errors = buyerInfoModel.validateBuyerInfo();
    let validate: string = "";
    if (errors.payment) {
        validate = `${errors.payment}`;
    } else if (errors.address) {
        validate = `${errors.address}`;
    }
    paymentAddressFormModel.errors = validate;
    if (!errors.payment && !errors.address) {
        paymentAddressFormModel.allowedButton();
    }
});

events.on("address:input", (data: { value: string }) => {
    buyerInfoModel.setAddress(data.value);
});

events.on("buyer:changeAddress", () => {
    const address = buyerInfoModel.getBuyerInfo().address;
    paymentAddressFormModel.address = address;
    const errors = buyerInfoModel.validateBuyerInfo();
    let validate: string = "";
    if (errors.payment) {
        validate = `${errors.payment}`;
    } else if (errors.address) {
        validate = `${errors.address}`;
    }
    paymentAddressFormModel.errors = validate;
    if (!errors.payment && !errors.address) {
        paymentAddressFormModel.allowedButton();
    }
});

events.on("order:submit", () => {
    modalWindowModel.content = emailPhoneFormModel.render();
});

events.on("email:input", (data: { value: string }) => {
    buyerInfoModel.setEmail(data.value);
});

events.on("buyer:changeEmail", () => {
    const email = buyerInfoModel.getBuyerInfo().email;
    emailPhoneFormModel.email = email;
    const errors = buyerInfoModel.validateBuyerInfo();
    let validate: string = "";
    if (errors.email) {
        validate = `${errors.email}`;
    } else if (errors.phone) {
        validate = `${errors.phone}`;
    }
    emailPhoneFormModel.errors = validate;
    if (!errors.phone && !errors.email) {
        emailPhoneFormModel.allowedButton();
    }
});

events.on("phone:input", (data: { value: string }) => {
    buyerInfoModel.setPhone(data.value);
});

events.on("buyer:changePhone", () => {
    const phone = buyerInfoModel.getBuyerInfo().email;
    emailPhoneFormModel.email = phone;
    const errors = buyerInfoModel.validateBuyerInfo();
    let validate: string = "";
    if (errors.email) {
        validate = `${errors.email}`;
    } else if (errors.phone) {
        validate = `${errors.phone}`;
    }
    emailPhoneFormModel.errors = validate;
    if (!errors.phone && !errors.email) {
        emailPhoneFormModel.allowedButton();
    }
});

events.on("contacts:submit", () => {
    const buyerInfo = buyerInfoModel.getBuyerInfo();
    const sum = productsToBuyModel.getCostProductsToBuy();
    orderSuccessModel.totalSum = sum;
    const products = productsToBuyModel.getProductsToBuy();
    const ids = products.map((elem) => elem.id);
    const orderRequest: IOrderRequest = {
        payment: buyerInfo.payment,
        email: buyerInfo.email,
        address: buyerInfo.address,
        phone: buyerInfo.phone,
        total: sum,
        items: ids,
    };
    console.log(orderRequest);
    apiModel.postOrder(orderRequest);
    productsToBuyModel.clearBusket();
    buyerInfoModel.deleteBuyerInfo();
    modalWindowModel.content = orderSuccessModel.render();
});

events.on("basket:clear", () => {
    const productsInBasket: HTMLElement[] = [];
    const basketCounter = 0;

    headerModel.counter = basketCounter;
    basketModalModel.totalPrice = productsToBuyModel.getCostProductsToBuy();
    basketModalModel.item = productsInBasket;
});

events.on("buyer:clear", () => {
    paymentAddressFormModel.payment = "";
    paymentAddressFormModel.address = "";
    emailPhoneFormModel.email = "";
    emailPhoneFormModel.phone = "";
});

events.on("orderSucces:close", () => {
    modalWindowModel.close();
});

events.on("modal:close", () => {
    modalWindowModel.close();
});

const response = await apiModel.getItems();
productsModel.setProducts(response.items);
