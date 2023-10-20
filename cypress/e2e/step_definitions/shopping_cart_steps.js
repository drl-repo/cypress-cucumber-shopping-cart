import { 
  Given,
  When,
  Then,
  And 
} from "cypress-cucumber-preprocessor/steps";

let products = [];

function findItemOnCart(number){
  return cy.get('img[alt="'+products[number].name+'"]')
           .parent('.sc-11uohgb-0')
}

Given('user visit homepage', () => {
  cy.visit('/')
  cy.get('main.sc-ebmerl-4').scrollTo('top', {ensureScrollable: false})
})

Given('user click Add to cart button on product {int}', function(number){
  cy.get('.sc-124al1g-2').eq(number-1).as('addedProduct')

  cy.get('@addedProduct').then((el)=>{
      /* remember this is jquery */
      let name = el.find('p.sc-124al1g-4').text()
      let price = el.find('p.sc-124al1g-6').text()

      products[number] = { name: name, price: price }
    })
  
  cy.get('@addedProduct')
    .find('button.sc-124al1g-0')
    .click({ scrollBehavior: false })
  
})


Then('cart should contain product {int}', function(number){

  cy.get('div.sc-7th5t8-0')
    .should('contain', products[number].name)
})


Then('verify price of product {int} on cart is correct', function(number){
  
  findItemOnCart(number)
    .find('.sc-11uohgb-4 > p')
    .then((as)=>{
      return as.text().split(" ").join("")
    })
    .should('eq', products[number].price)
  
})

And('user close the cart',()=>{
  cy.get('.sc-1h98xa9-1 > button')
    .click()
})

Given('user click + button of product {int} on cart', function(number){
  
  findItemOnCart(number)
    .find('.sc-11uohgb-4 button.sc-11uohgb-6:nth-child(2)')
    .click()
})

Then('quantity of product {int} is increased', function(number){
  
  findItemOnCart(number)
    .find('.sc-11uohgb-3')
    //dan berikut hasil elementnya
    //<p class="sc-11uohgb-3 gKtloF">X | White T-shirt <br>Quantity: 11</p>
    //waaduh nyampur, sementara kita cuma butuh angka quantitynya saja
    .invoke('text') //X | White T-shirt <br>Quantity: 11
    .then((text)=>{
      //but don't worry mari kita parsing-parsing dulu biar dapet nilai quantity
      return parseInt(text.split(":")[1].trim())
    })
    .should('eq', 2)// done :)
})

Given('user click - button of product {int} on cart', function(number){
  
  findItemOnCart(number)
    .find('.sc-11uohgb-4 button.sc-11uohgb-6:first-child')
    .click()
})

Then('quantity of product {int} is decreased', function(number){
  
  findItemOnCart(number)
    .find('.sc-11uohgb-3')
    .invoke('text') //X | White T-shirt <br>Quantity: 11
    .then((text)=>{
      return parseInt(text.split(":")[1].trim())
    })
    .as('quantity')


  cy.get('@quantity')
    .should('eq', 1)// done :)
})

Given('sub total on cart are correct', function(){

  let subTotal = 0;
  cy.get('.sc-11uohgb-0')
    .then(($elPrices) => {
      Cypress._.map($elPrices, function(elPrice){
        //This area is DOM, so we use vanilla.js
        const rawQty   = elPrice.querySelector('.sc-11uohgb-3').textContent
        const rawPrice = elPrice.querySelector('.sc-11uohgb-4 > p').textContent
        
        const qty   = Number(rawQty.split(":")[1].trim())
        const price = Number(rawPrice.split(" ")[2])
      
        subTotal += price * qty
      })
      
      cy.get('p.sc-1h98xa9-9')
        .then(($subTotal)=>{
            return Number($subTotal.text().split(" ")[1])
        })
        .should((theSubTotal)=>{
          expect(theSubTotal).to.equal(subTotal)
        })
    })
   
})


Given('user click x button at product {int} on cart', function(number){
  findItemOnCart(number)
    .find('button[title="remove product from cart"]')
    .click()
})

Then('product {int} should be removed from cart', function(number){
    cy.get('div.sc-7th5t8-0')
    .should('not.contain', products[number].name)
})
