import React from 'react'
import {Elements, CardElement} from '@stripe/react-stripe-js'
import {loadStripe} from '@stripe/stripe-js'
import { DropdownButton, Dropdown } from 'react-bootstrap';

const stripePromise = loadStripe('pk_test_51KggiDHUd8uD3rcyoAx1ZLnSmB0AwqYT4ksjCvTYb14lSgw48fbUiaAuVrOGnvPmKlMPP1y83H8n0ifCkM4w1PRD00GzbyJyvh');

export default function Coins() {
  const CARD_OPTIONS = {
    iconStyle: "solid",
    style: {
      base: {
        fontFamily: 'sans-serif',
        backgroundColor: 'white',
        fontSize: '17px',
        fontSmoothing: 'antialiased',
        '::placeholder': {
          color: '#999999',
        }
      },
    }
  };

  return (
    <div>
      <h1>Buy Coins</h1>
      <p>Don't wait to participate! Buy a bag of coins to use in our community library!</p>
      <DropdownButton id="coin-amount" title="Coin Options" className='pb-3'>
        <Dropdown.Item value="50">50 Coins</Dropdown.Item>
        <Dropdown.Item value="100">100 Coins</Dropdown.Item>
        <Dropdown.Item value="500">500 Coins</Dropdown.Item>
        <Dropdown.Item value="1000">1000 Coins</Dropdown.Item>
      </DropdownButton>
      <Elements stripe={stripePromise}>
        <div className='border rounded p-2' style={{backgroundColor: 'white'}}>
          <CardElement options={CARD_OPTIONS}/>
        </div>
        <small>* Powered by <a href='https://stripe.com/?utm_campaign=paid_brand-US_Search_Brand_Stripe-1803852691&utm_medium=cpc&utm_source=google&ad_content=448938759831&utm_term=kwd-94834400&utm_matchtype=e&utm_adposition=&utm_device=c&gclid=CjwKCAjwgr6TBhAGEiwA3aVuIZUBbamf8JyvfOvXVytx0Qzkah26l3BumrUUv8MNi-VpMKWG_h9CDxoC0mkQAvD_BwE'>Stripe</a></small>
      </Elements>
    </div>
  )
}
