// state
let shoppingCart = [];
let search = "";
let category = "todos";

const productTemplate = document.getElementById("product-template");
productTemplate.removeAttribute("id");
productTemplate.remove();

const cartProductTemplate = document.getElementById("cart-product-template");
cartProductTemplate.removeAttribute("id");
cartProductTemplate.remove();

render();
addEventListeners();

function render() {
  renderProducts();
  renderFilters();
  renderShoppingCart();
}

function renderProducts() {
  const productsList = document.getElementById("products-grid");
  productsList.innerHTML = "";

  products
    .filter((p) => category === "todos" || p.category === category)
    .filter((p) => p.name.includes(search))
    .forEach((product) => {
      const productDOM = productTemplate.cloneNode();
      productDOM.innerHTML = productTemplate.innerHTML;

      // fill product data
      const productImg = productDOM.querySelector("img");
      productImg.src = product.image;

      const productTitle = productDOM.querySelector("h3");
      productTitle.innerText = product.name;

      const productDescription = productDOM.querySelector("p");
      productDescription.innerText = product.description;

      const productCost = productDOM.querySelector(".product-cost");
      productCost.innerText = `${product.price}€`;

      productDOM.querySelector("button").addEventListener("click", (event) => {
        const productInCart = shoppingCart.find((p) => p.id === product.id);
        if (productInCart) {
          productInCart.quantity++;
        } else {
          shoppingCart.push({
            id: product.id,
            quantity: 1,
          });
        }

        render();
      });

      productsList.appendChild(productDOM);
    });
}

function renderFilters() {
  const buttons = document.querySelectorAll(".filter-btn");

  buttons.forEach((button) => {
    if (button.dataset.category === category) {
      button.classList.add("bg-blue-500", "text-white", "active");
      button.classList.remove("bg-gray-200", "text-gray-700");
    } else {
      button.classList.add("bg-gray-200", "text-gray-700");
      button.classList.remove("bg-blue-500", "text-white", "active");
    }
  });

  const searchInput = document.getElementById("search-input");
  searchInput.value = search;
}

function renderShoppingCart() {
  const empty = document.getElementById("cart-empty");

  if (shoppingCart.length === 0) {
    empty.classList.remove("hidden");
  } else {
    empty.classList.add("hidden");
  }

  const shoppingCartList = document.getElementById("cart-items");
  shoppingCartList.innerHTML = "";

  let total = 0;

  shoppingCart.forEach((shoppingCartProduct) => {
    const productDOM = cartProductTemplate.cloneNode();
    productDOM.innerHTML = cartProductTemplate.innerHTML;

    const product = products.find((p) => p.id === shoppingCartProduct.id);

    const title = productDOM.querySelector("h4");
    title.innerText = product.name;

    const img = productDOM.querySelector("img");
    img.src = product.image;

    const cost = productDOM.querySelector("p");
    cost.innerText = product.price;

    const qty = productDOM.querySelector("span");
    qty.innerText = shoppingCartProduct.quantity;

    productDOM.querySelector(".qty-sub").addEventListener("click", (e) => {
      shoppingCartProduct.quantity = Math.max(
        shoppingCartProduct.quantity - 1,
        0
      );

      if (shoppingCartProduct.quantity === 0) {
        shoppingCart = shoppingCart.filter((p) => p !== shoppingCartProduct);
      }

      render();
    });

    productDOM.querySelector(".qty-add").addEventListener("click", (e) => {
      shoppingCartProduct.quantity++;

      render();
    });

    productDOM.querySelector(".qty-remove").addEventListener("click", (e) => {
      shoppingCart = shoppingCart.filter((p) => p !== shoppingCartProduct);

      render();
    });

    shoppingCartList.append(productDOM);

    total += shoppingCartProduct.quantity * product.price;
  });

  const totalDOM = document.getElementById("cart-subtotal");
  totalDOM.innerText = total.toFixed(2) + " €";

  const totalFinal = total + 5.99;
  const totalFinalDOM = document.getElementById("cart-total");
  totalFinalDOM.innerText = totalFinal.toFixed(2) + " €";

  const headerCount = document.getElementById("cart-count");
  headerCount.innerText = shoppingCart.length;
}

function addEventListeners() {
  document
    .getElementById("search-input")
    .addEventListener("input", function (event) {
      search = event.target.value;

      render();
    });

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", function (event) {
      category = event.target.dataset.category;

      render();
    });
  });

  document.getElementById("clear-cart").addEventListener("click", () => {
    shoppingCart = [];

    render();
  });
}
