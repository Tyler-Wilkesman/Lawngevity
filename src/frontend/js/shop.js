/* shop.js — product browsing: category tabs and search. Supports shop.html?category=Mulch */
(function(){
  var CATEGORIES = ['All','Mulch','Stone','Plants','Pavers','Sod','Soil'];
  var tabsEl = document.getElementById('shopTabs');
  var searchEl = document.getElementById('shopSearch');
  var resultsEl = document.getElementById('shopResults');
  if(!tabsEl || !searchEl || !resultsEl) return;

  var params = new URLSearchParams(location.search);
  var category = CATEGORIES.indexOf(params.get('category')) > -1 ? params.get('category') : 'All';
  var search = '';

  function renderTabs(){
    tabsEl.innerHTML = CATEGORIES.map(function(c){
      return '<button type="button" data-cat="' + c + '" class="' + (c === category ? 'selected' : '') + '" aria-pressed="' + (c === category) + '">' + c + '</button>';
    }).join('');
  }

  function card(p){
    return '<article class="product"><img src="' + p.image + '" alt="' + p.category + ' at Lawngevity" loading="lazy">' +
      '<div class="product-body"><span class="eyebrow">' + p.category + '</span><h3>' + p.name + '</h3><p>' + p.description + '</p>' +
      '<p class="fine">Sold by the ' + p.unit + '. Call for current pricing and availability.</p>' +
      '<a class="button outline" href="tel:9104061018">Call to order</a></div></article>';
  }

  function renderResults(){
    var q = search.toLowerCase();
    var list = LW.products.filter(function(p){
      return (category === 'All' || p.category === category) && (p.name + ' ' + p.description).toLowerCase().indexOf(q) > -1;
    });
    if(category === 'Pavers'){
      resultsEl.innerHTML = '<div class="help-strip"><div><h3>Pavers &amp; retaining walls</h3><p>Contact us for current styles, sizes, and availability.</p></div>' +
        '<a class="button" href="tel:9104061018">Call the landscape center</a></div>';
    }else if(list.length){
      resultsEl.innerHTML = '<div class="product-grid">' + list.map(card).join('') + '</div>';
    }else{
      resultsEl.innerHTML = '<div class="empty"><h3>No products found</h3><button type="button" class="button" data-reset>View all products</button></div>';
    }
  }

  function setCategory(c){
    category = c;
    var url = c === 'All' ? location.pathname : location.pathname + '?category=' + encodeURIComponent(c);
    try{ history.replaceState(null, '', url); }catch(e){}
    renderTabs(); renderResults();
  }

  tabsEl.addEventListener('click', function(e){
    var b = e.target.closest('button[data-cat]'); if(b) setCategory(b.getAttribute('data-cat'));
  });
  searchEl.addEventListener('input', function(){ search = searchEl.value; renderResults(); });
  resultsEl.addEventListener('click', function(e){
    if(e.target.closest('[data-reset]')){ searchEl.value = ''; search = ''; setCategory('All'); }
  });

  renderTabs(); renderResults();
})();
