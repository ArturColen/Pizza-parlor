// Initial data
let modalQt = 1;
let cart = [];
let modalKey = 0;

// Simplify the process
const c = (element) => document.querySelector(element);
const cs = (element) => document.querySelectorAll(element);

// Show the data of each pizza and the modal
pizzas.map((item, index) => {
    let pizzaItem = c('#models .pizza-item').cloneNode(true);

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item-img img').src = item.img;
    pizzaItem.querySelector('.pizza-item-price').innerHTML = `R&#36; ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item-name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item-desc').innerHTML = item.description;

    pizzaItem.querySelector('a').addEventListener('click', (e) => { 
        e.preventDefault();
        
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key;

        c('#pizza-big img').src = pizzas[key].img;
        c('#pizza-info h1').innerHTML = pizzas[key].name;
        c('#pizza-info-desc').innerHTML = pizzas[key].description;
        c('#pizza-info-actualprice').innerHTML = `R&#36; ${pizzas[key].price.toFixed(2)}`;
        c('.pizza-info-size.selected').classList.remove('selected');
        cs('.pizza-info-size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzas[key].sizes[sizeIndex];
        });

        c('#pizza-info-qt').innerHTML = modalQt;
        c('#modal-area').style.opacity = 0;
        c('#modal-area').style.display = 'flex';
        setTimeout(() => {
            c('#modal-area').style.opacity = 1;
        }, 200);
    });

    c('#pizza-area').append(pizzaItem);
});

// Effect when closing the modal
function closeModal() {
    c('#modal-area').style.opacity = 0;
    setTimeout(() => {
    c('#modal-area').style.display = 'none';
    }, 500);
}

// Configure the functionality of modal close and add/remove item from cart
cs('#pizza-info-cancel, #back-button').forEach((item) => {
    item.addEventListener('click', closeModal);
});

c('#pizza-info-qtless').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        c('#pizza-info-qt').innerHTML = modalQt;
    }
});

c('#pizza-info-qtmore').addEventListener('click', () => {
    modalQt++;
    c('#pizza-info-qt').innerHTML = modalQt;
});

// Choose the pizza size
cs('.pizza-info-size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        c('.pizza-info-size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

// Display the menu with the chosen products
c('#pizza-info-add').addEventListener('click', () => {
    let size = parseInt(c('.pizza-info-size.selected').getAttribute('data-key'));
    let identifier = pizzas[modalKey].id + '@' + size;
    let key = cart.findIndex((item) => item.identifier == identifier);

    if (key > -1) {
        cart[key].qt += modalQt;
    }
    else {
        cart.push({
            identifier,
            id: pizzas[modalKey].id,
            size,
            qt: modalQt
        });
    }
    
    updateCart();
    closeModal();
});

// Update the order data while the products are being chosen
function updateCart() {
    c('#menu-opener span').innerHTML = cart.length;

    if (cart.length > 0) {
        c('aside').classList.add('show');
        c('#cart').innerHTML = '';

        let subtotal = 0;
        let discount = 0;
        let total = 0;

        for (let i in cart) {
            let pizzaItem = pizzas.find((item) => item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = c('#models .cart-item').cloneNode(true);
        
            let pizzaSizeName;
            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart-item-name').innerHTML = pizzaName;
            cartItem.querySelector('.cart-item-qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart-item-qtless').addEventListener('click', () => {
                if (cart[i].qt > 1) {
                    cart[i].qt--;
                }
                else {
                    cart.splice(i, 1);
                }

                updateCart();
            });
            cartItem.querySelector('.cart-item-qtmore').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });

            c('#cart').append(cartItem);
        }

        discount = subtotal * 0.1;
        total = subtotal - discount;

        c('#subtotal span:last-child').innerHTML = `R&#36; ${subtotal.toFixed(2)}`;
        c('#discount span:last-child').innerHTML = `R&#36; ${discount.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R&#36; ${total.toFixed(2)}`;
    }
    else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}

// Open and close customer request on mobile
c('#menu-opener').addEventListener('click', () => {
    if (cart.length > 0) {
        c('aside').style.left = '0';
    }
});

c('#close-menu-mobile').addEventListener('click', () => {
    c('aside').style.left = '100vw';
});

// Warning after placing order
c('#cart-finish').addEventListener('click', () => {
    alert('Seu pedido está sendo realizado e será entregue em breve.');
});