const products = [
  {id:1,name:"Wireless Headphones",category:"Tech",price:1499,emoji:"🎧",bg:"#e9e5f2"},
  {id:2,name:"Everyday Backpack",category:"Lifestyle",price:999,emoji:"🎒",bg:"#f3e9dc"},
  {id:3,name:"Smart Watch",category:"Tech",price:2199,emoji:"⌚",bg:"#e2eceb"},
  {id:4,name:"Classic Sunglasses",category:"Accessories",price:699,emoji:"🕶️",bg:"#eee9df"},
  {id:5,name:"Travel Tumbler",category:"Lifestyle",price:499,emoji:"🥤",bg:"#e5eee1"},
  {id:6,name:"Minimal Desk Lamp",category:"Accessories",price:1199,emoji:"💡",bg:"#f2e9df"}
];
let cart = JSON.parse(localStorage.getItem("aexcart-cart") || "[]");
let activeCategory = "All";
const grid = document.getElementById("productGrid");
const money = n => "₹" + n.toLocaleString("en-IN");

function renderProducts(){
  const term = document.getElementById("searchInput").value.toLowerCase();
  const visible = products.filter(p => (activeCategory==="All" || p.category===activeCategory) && p.name.toLowerCase().includes(term));
  grid.innerHTML = visible.length ? visible.map(p => `
    <article class="product-card">
      <div class="product-art" style="background:${p.bg}">${p.emoji}</div>
      <div class="product-info"><span class="product-category">${p.category}</span><h3>${p.name}</h3>
      <div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-btn" onclick="addToCart(${p.id})">+ Add to cart</button></div></div>
    </article>`).join("") : "<p>No products found. Try another search.</p>";
}
function saveCart(){localStorage.setItem("aexcart-cart",JSON.stringify(cart));renderCart();}
function addToCart(id){const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({id,qty:1});saveCart();openCart();}
function changeQty(id,delta){const item=cart.find(x=>x.id===id);if(!item)return;item.qty+=delta;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);saveCart();}
function renderCart(){
  document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);
  const items=document.getElementById("cartItems");
  if(!cart.length){items.innerHTML='<p class="empty-cart">Your cart is empty.</p>';}
  else items.innerHTML=cart.map(x=>{const p=products.find(y=>y.id===x.id);return `<div class="cart-item"><div class="cart-emoji">${p.emoji}</div><div class="cart-detail"><strong>${p.name}</strong><small>${money(p.price)} each</small><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><span>${x.qty}</span><button onclick="changeQty(${p.id},1)">+</button></div></div><strong>${money(p.price*x.qty)}</strong></div>`}).join("");
  document.getElementById("cartTotal").textContent=money(cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0));
}
function openCart(){document.getElementById("cartPanel").classList.add("open");document.getElementById("scrim").classList.add("show");}
function closeCart(){document.getElementById("cartPanel").classList.remove("open");document.getElementById("scrim").classList.remove("show");}
document.getElementById("cartToggle").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
document.getElementById("scrim").addEventListener("click",closeCart);
document.getElementById("searchInput").addEventListener("input",renderProducts);
document.getElementById("filters").addEventListener("click",e=>{if(!e.target.matches("button"))return;document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));e.target.classList.add("active");activeCategory=e.target.dataset.category;renderProducts();});
document.getElementById("checkoutBtn").addEventListener("click",()=>{if(!cart.length){alert("Your cart is empty. Add a product first.");return;}alert("Thank you! This is a demo checkout. No payment was processed.");cart=[];saveCart();closeCart();});
renderProducts();renderCart();