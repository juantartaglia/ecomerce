var VistaItems = function(modelo, controlador) {
  this.modelo = modelo;
  this.controlador = controlador;
  var contexto = this;

  // suscripción de observadores
  this.modelo.itemAgregadoAWhishList.suscribir(function(modelo, productID) {
    contexto.prenderCorazon(productID);
  });

  this.modelo.itemEliminadoDeWhishList.suscribir(function(modelo, productID) {
    contexto.apagarCorazon(productID);
  });

  this.modelo.wishListReady.suscribir(function(modelo,whishList){
    for (var x = 0; x < whishList.length; x++){
      contexto.prenderCorazon(whishList[x]);
    }
  });
  
  this.modelo.productListLoaded.suscribir(function(modelo,productsList){
    contexto.renderizarProductos(productsList);
  });

  this.modelo.productListLoadFail.suscribir(function(modelo,error){
    contexto.handleError(error);
  });
};

function loaderToggle(status){
  

  if (status) { 
    $("#loadMe").modal({
      show: true
    });
  }
  else {
    $("#loadMe").modal("hide");
  }
}


VistaItems.prototype = {
  inicializar: function() {
    loaderToggle(true);
    this.controlador.loadProductList();
    //this.configuracionDeBotones();
    //this.controlador.loadWishList();
  },
  handleError: function(error){
    var wellAlert = "<div class='well'><span class='label label-danger'> Error ! </span><br/>Ops! No hemos podido cargar la lista de productos.</div>";
    $("#product-list").html(wellAlert);
    console.log(error);
  },
  configuracionDeBotones: function(){
    var contexto = this;

    $("button.add-to-wishlist").click(function() {
      var id = $(this).closest("div.product").attr("id");
      contexto.controlador.addToWishlist(id);
    });
    $("button.add-to-cart-btn").click(function() {
      var id = $(this).closest("div.product").attr("id");
      var productName = $("div#"+id).find("a").text();
      var productImg = $("div#"+id).find("img").attr("src");
      var productPrice = $("div#"+id).find("h4").text();
      productPrice = productPrice.substr(0,productPrice.indexOf(" "));
      var productObj = { id: id, name: productName, price: productPrice, img: productImg };
      contexto.controlador.addToCart(productObj);
    });
  },

  renderizarProductos: function(productsList){
    console.log(productsList);
    productsList.forEach(function(element){
      var vistaProductElement = $("#template-product").clone();
      vistaProductElement.removeClass("hide");
      vistaProductElement.find(".product").attr("id",element._id);
      vistaProductElement.find(".product-img > img").attr("src",element.pictureUrl);
      vistaProductElement.find(".product-name > a").html(element.name);
      vistaProductElement.find("h4").html("$ "+element.price+" <del class='product-old-price'> "+element.oldPrice+"</del>");
      $("#product-list").append(vistaProductElement);
    });
    this.configuracionDeBotones();
    this.controlador.loadWishList();
    loaderToggle(false);
  },

  prenderCorazon: function(productID){
    $("div#" + productID).find("button.add-to-wishlist i").addClass('fa-heart').removeClass('fa-heart-o');
    $("div#" + productID).find("span.tooltipp").html('remove from wishlist');
  },

  apagarCorazon: function(productID){
    $("div#" + productID).find("button.add-to-wishlist i").addClass('fa-heart-o').removeClass('fa-heart');
    $("div#" + productID).find("span.tooltipp").html('add to wishlist');
  }
};