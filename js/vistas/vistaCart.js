var VistaCart = function(modelo, controlador) {
  this.modelo = modelo;
  this.controlador = controlador;
  var contexto = this;

  //suscripcion a eventos del modelo
  this.modelo.carritoLlenado.suscribir(function(modelo, carroObj) {
    contexto.refreshCart(carroObj);
    contexto.inicializarBotones(contexto)
  });

};

VistaCart.prototype = {
  inicializar: function() {
    //this.inicializarBotones(contexto);
    this.controlador.loadCart();
  },
  inicializarBotones: function(contexto){
    $(".cart-item > button.delete").each(function(){
      console.log($(this));
      var _this = $(this);
      _this.on('click', function () {
        console.log("click");
      });
    });
  },
  refreshCart: function(carroObj){
    $(".cart-list").empty();
    var cart = carroObj.cart;
    cart.forEach(function(element) {
      var template = $("#template-cart-item").clone();
      var id = element.id;
      template.removeClass("hide");
      template.addClass("cart-item");
      template.attr("id",id);
      template.find('img').attr('src', element.img);
      template.find('a').html(element.name);
      template.find('h4').html(`<span class="qty">${element.cant}x</span>$${element.price}`);
      $(".cart-list").append(template);
    });
    var $subTotal = $('.cart-summary');
    $subTotal.find('h5').html('Subtotal: $' + carroObj.subtotal); 
    
    /*
    $(document).on("click",".cart-item > button.delete",function(){
      console.log($(this));
    });
    */
    //this.inicializarBotones(this);
  }
};

