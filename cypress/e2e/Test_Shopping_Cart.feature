Feature: Test Shopping Cart functionality

    Scenario: User can add product to cart
      Given user visit homepage
      When user click Add to cart button on product 1
      Then cart should contain product 1
      Then verify price of product 1 on cart is correct
      And user close the cart

    Scenario: User can add product to cart more than once
      Given user click Add to cart button on product 2
      Then cart should contain product 2
      Then verify price of product 2 on cart is correct

    Scenario: User can increase quantity of product on cart
      Given user click + button of product 1 on cart
      Then quantity of product 1 is increased

    Scenario: User can increase quantity of other product on cart
      Given user click + button of product 2 on cart
      Then quantity of product 2 is increased

    Scenario: User can decrease quantity of product on cart
      Given user click - button of product 1 on cart
      Then quantity of product 1 is decreased

    Scenario: Verify Sub Total cart is correct
      Given sub total on cart are correct

    Scenario: User can remove product from cart
      Given user click x button at product 1 on cart
      Then product 1 should be removed from cart

    Scenario: Verify Sub Total is on cart is correct
      Given sub total on cart are correct
