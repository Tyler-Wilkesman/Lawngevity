/* catalog.js — product list and material calculator math.
   Product list shown on shop.html and in the calculator. Edit here to change the products. (No prices or cart for now.) */
(function(){
  var products = [
    {id:'mulch',  name:'Triple Shredded Mulch',  category:'Mulch',  unit:'cubic yard', image:'images/mulch.jpg',  description:'A clean finish for garden beds. Choose your mulch color when arranging pickup or delivery.', bulk:true},
    {id:'stone',  name:'Decorative River Rock',  category:'Stone',  unit:'cubic yard', image:'images/stone.jpg',  description:'Natural texture for beds, borders, and landscape accents.', bulk:true},
    {id:'soil',   name:'Soil & Compost Blend',   category:'Soil',   unit:'cubic yard', image:'images/soil.jpg',   description:'Build a better foundation for planting and landscape projects.', bulk:true},
    {id:'plants', name:'Coastal Shrub \u2014 3 Gallon', category:'Plants', unit:'plant', image:'images/plants.jpg', description:'Explore nursery plants suited to our coastal environment. Call for current varieties.', bulk:false},
    {id:'sod',    name:'Centipede Sod',          category:'Sod',    unit:'pallet',     image:'images/sod.jpg',    description:'Fresh turf for a new lawn. Calculator assumes 450 square feet per pallet; confirm coverage with us.', bulk:false}
  ];

  // area in sq ft, depth in inches, waste in percent. Returns null for invalid input.
  function calculate(area, depth, waste, sod){
    if(!isFinite(area) || area <= 0 || !isFinite(depth) || depth <= 0 || !isFinite(waste) || waste < 0 || waste > 30) return null;
    var raw = sod ? area / 450 : area * depth / 324;       // 324 = sq ft * inches per cubic yard
    var adjusted = raw * (1 + waste / 100);
    return {
      raw: raw,
      adjusted: adjusted,
      order: sod ? Math.ceil(adjusted) : Math.ceil((adjusted - 1e-10) * 2) / 2   // round up to next half yard
    };
  }

  window.LW = window.LW || {};
  window.LW.products = products;
  window.LW.calculate = calculate;
  window.LW.productById = function(id){ for(var i=0;i<products.length;i++){ if(products[i].id===id) return products[i]; } return null; };
})();
