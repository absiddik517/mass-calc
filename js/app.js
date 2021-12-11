// buttons default prevention
$(document).on('click', 'button', function(event){
  event.preventDefault()
})

// add people to form
$('.peoples').on('click', '.btn-add', function(){
  $('.peoples').append(template)
  storage.num_of_people++
})

// remove useless form from peoples
$('.peoples').on('click', '.btn-remove', function(){
  let number_of_peoples = $('.peoples').children().length
  if(number_of_peoples > 1){
    $(this).closest('.people').remove()
    storage.num_of_people--
  }else{
    alert('Cannot remove the last element')
  }
})

// storage 
let storage = {}


// peoples form submit function
$('.peoples_form').submit(function(e) {
  e.preventDefault()
  storage.peoples_data = validate_peoples_form()
  console.log(storage)
  $('.peoples_form_container').hide()
  $('.cost_form_container').show()
});

function validate_peoples_form(){
  let peoples_data = []
  $('.people').each(function(index, item){
    let person_data = {
      name : $(item).find('.name')[0].value,
      discount : +$(item).find('.discount')[0].value,
      meals : +$(item).find('.meals')[0].value,
      joma : +$(item).find('.joma')[0].value,
    }
    peoples_data.push(person_data)
  })
  return peoples_data
}

// cost form submit function 
$('.cost_form').submit(function(e) {
  e.preventDefault()
  storage.cost = {
    fixed_cost : $('.fixed_cost').val(),
    meal_cost : $('.meal_cost').val(),
    meal_rate : $('.meal_rate').val(),
    other_cost : $('.other_cost').val(),
  }
  calculate()
})

function calculate() {
  console.log(storage)
  total_meals = 0;
  total_discount = 0
  discount_count = 0
  total_people = 0
  for (var i = 0; i < storage.peoples_data.length; i++) {
    total_people++
    total_meals += storage.peoples_data[i].meals 
    if(storage.peoples_data[i].discount > 0){
      total_discount += storage.peoples_data[i].discount 
      discount_count++
    }
  }
  let meal_rate = storage.cost.meal_cost / total_meals
  let discount_rate = total_discount / (total_people - discount_count)
  let fixed_cost_rate = storage.cost.fixed_cost / total_people
  let temp = []
  for (var i = 0; i < storage.peoples_data.length; i++) {
    let p = storage.peoples_data[i]
    let pfixed_cost = fixed_cost_rate
    if(p.discount > 0){
      pfixed_cost = fixed_cost_rate - p.discount
    }
    let pdata = {
      name : p.name,
      joma : p.joma,
      meal_cost : meal_rate * p.meals,
      fixed_cost : pfixed_cost
    }
    temp.push(pdata)
  }
  storage.data = temp 
  console.log(storage)
  display_data();
}

function display_data() {
  let html = ''
  for (var i = 0; i < storage.data.length; i++) {
    let data = storage.data[i]
    html += `
      <tr>
        <td>${data.name}</td>
        <td>${data.joma}</td>
        <td>${Math.round(data.meal_cost)}</td>
        <td>${Math.round(data.fixed_cost)}</td>
        <td>${Math.round(data.joma - data.meal_cost - data.fixed_cost)}</td>
      </tr>
    `
  }
  $('.cost_form_container').hide()
  $('.table_container').show()
  $('.table tbody').html(html)
}














const template = `
  <div class="people">
        <div class="form-group">
          <div class="row">
            <div class="col-xs-8">
              <input type="text" class="name form-control" name="name[]" placeholder="Jhon Doe" required>
            </div>
            
            <div class="col-xs-4 text-right">
              <input class="discount form-control" type="number" name="discount[]" placeholder="Discount">
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <div class="row">
             <div class="col-xs-4">
                <input type="number" class="joma form-control" placeholder="Joma" required>
             </div>
             <div class="col-xs-4">
                <input type="number" class="meals form-control" placeholder="Meal" required>
             </div>
             <!-- Buttons -->
             <div class="col-xs-4 text-right">
               <button class="btn btn-success btn-sm btn-add"><i class="fa fa-plus"></i></button>
               <button class="btn btn-danger btn-sm btn-remove"><i class="fa fa-times"></i></button>
             </div>
          </div>
        </div>
      </div>
`;