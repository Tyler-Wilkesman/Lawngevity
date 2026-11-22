/* calculator.js — material calculator (mulch, stone, soil, sod). */
(function(){
  var form = document.getElementById('calcForm');
  var out = document.getElementById('calcResult');
  if(!form || !out) return;

  var $ = function(id){ return document.getElementById(id); };
  var materialEl = $('material'), shapeEl = $('shape'), lengthEl = $('length'), widthEl = $('width'),
      areaEl = $('area'), depthEl = $('depth'), wasteEl = $('waste');

  // Populate material list: bulk products + sod
  materialEl.innerHTML = LW.products.filter(function(p){ return p.bulk || p.id === 'sod'; })
    .map(function(p){ return '<option value="' + p.id + '">' + p.name + '</option>'; }).join('');

  function syncFields(){
    var shape = shapeEl.value, sod = materialEl.value === 'sod';
    $('areaField').hidden = shape !== 'area';
    $('lengthField').hidden = shape === 'area';
    $('widthField').hidden = shape !== 'rectangle';
    $('depthField').hidden = sod;
    $('lengthLabel').textContent = (shape === 'circle' ? 'Diameter' : 'Length') + ' (feet)';
  }

  function render(){
    syncFields();
    var shape = shapeEl.value, sod = materialEl.value === 'sod';
    var len = Number(lengthEl.value), wid = Number(widthEl.value), area = Number(areaEl.value);
    var size = shape === 'rectangle' ? len * wid : shape === 'circle' ? Math.PI * Math.pow(len / 2, 2) : area;
    var dimsOk = shape === 'area' ? area > 0 : shape === 'circle' ? len > 0 : (len > 0 && wid > 0);
    var depth = sod ? 1 : Number(depthEl.value);
    var waste = Number(wasteEl.value);
    var r = dimsOk ? LW.calculate(size, depth, waste, sod) : null;
    

    var head = lwIcon('calculator', 30) + '<span class="eyebrow light">YOUR ESTIMATED ORDER</span>';
    if(!r){
      var one = r.order === 1;
    var unitShort = sod ? (one ? 'pallet' : 'pallets') : (one ? 'cubic yard' : 'cubic yards');
    out.innerHTML = head + '<p>Please enter positive dimensions and an allowance between 0% and 30%.</p>';
      return;
    }
    var one = r.order === 1;
    var unitShort = sod ? (one ? 'pallet' : 'pallets') : (one ? 'cubic yard' : 'cubic yards');
    out.innerHTML = head +
      '<div class="big-result">' + r.order.toLocaleString() + '<span>' + unitShort + '</span></div>' +
      row('Project area', size.toFixed(1) + ' sq ft') +
      row('Calculated quantity', r.raw.toFixed(2) + ' ' + (sod ? (r.raw === 1 ? 'pallet' : 'pallets') : 'yd\u00b3')) +
      row('Extra allowance', waste + '%') +
      '<a class="button yellow" href="tel:9104061018">Call to order: (910) 406-1018</a>' +
      '<p class="fine">' + (sod ? 'Preview coverage: 450 sq ft per pallet. Confirm coverage with Lawngevity.' :
        'Rounded up to the next half cubic yard. Actual order increments must be confirmed.') +
      ' Estimate only; tax and delivery excluded. ' + (r.order > 1000 ? 'Call for large project quantities.' : '') + '</p>';
  }
  function row(label, value){ return '<div class="result-row"><span>' + label + '</span><strong>' + value + '</strong></div>'; }

  form.addEventListener('input', render);
  form.addEventListener('change', render);
  form.addEventListener('submit', function(e){ e.preventDefault(); });
  render();
})();
