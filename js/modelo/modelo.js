/*
 * Modelo
 */
var Modelo = function() {
  this.whishList = [];
  this.cart = [];
  this.subtotal = 0;
contexto = this;
  //inicializacion de eventos
  this.itemAgregadoAWhishList = new Evento(this);
  this.itemEliminadoDeWhishList = new Evento(this);
  this.wishListReady = new Evento(this);
  this.carritoLlenado = new Evento(this);
  this.productListLoaded = new Evento(this);
  this.productListLoadFail = new Evento(this);
};

Modelo.prototype = {
  loadProductList: function() {
    var url = "http://ecommerce.casu-net.com.ar/api/products";
    $.ajax({
      method: "GET", 
      url: url
     }).done(function(body){
      contexto.productListLoaded.notificar(body);
     }).fail(function(error){
      contexto.productListLoadFail.notificar(error);
     });
    
  },

  addToWishlist: function(productID) {
    this.whishList.push(productID);
    this.itemAgregadoAWhishList.notificar(productID);
    this.guardar("wishListItems",this.whishList);
  },

  removeFromWishlist: function(productID){
    var index = this.whishList.indexOf(productID);
    if (index > -1) {
      this.whishList.splice(index, 1);
      this.itemEliminadoDeWhishList.notificar(productID);
      this.guardar("wishListItems",this.whishList);
    }
  },

  //se guardan en el local storage
  guardar: function(dest,element){
    localStorage.setItem(dest,JSON.stringify(element));
  },
  getWishList: function() {
    return this.whishList;
  },
  cargarWishList: function(){
    var lista = localStorage.getItem("wishListItems");
    if(lista) {
      this.whishList = JSON.parse(lista);
    }
    this.wishListReady.notificar(this.whishList);
  },
  cargarCart: function(){
    var listaCarro = localStorage.getItem("miCarrito");
    if(listaCarro){
      this.cart= JSON.parse(listaCarro);
    }
    this.calcularSubtotal();
    this.carritoLlenado.notificar({cart: this.cart, subtotal: this.subtotal});
  },
  addToCart: function(productObj){
    var carritoId = this.cart.map(function(elemento){
      return elemento.id;
    });
    var index = carritoId.indexOf(productObj.id);
    if(index < 0){
      this.cart.push(productObj);
    }
    else{
      this.cart[index].cant++;
    }
    this.calcularSubtotal();
    this.carritoLlenado.notificar({cart: this.cart, subtotal: this.subtotal})
    this.guardar("miCarrito",this.cart);
  },
  calcularSubtotal: function() {
    this.cart.forEach(function(element){
      contexto.subtotal = contexto.subtotal + (element.price * element.cant);
    });
  },
};

