import React from 'react'
import '../register.css'
import { Link } from 'react-router-dom'
import 'react-dropdown/style.css'
import HomeIcon from '@material-ui/icons/Home'
import { Container, Form } from 'react-bootstrap'
import Logo from '../assets/img/Logo.png'
import { toast } from 'react-toastify'
import axios from 'axios'

function loadScript(src) {
  const script = document.createElement('script')
  script.src = src
  document.body.appendChild(script)
  return script
}

export default class AddMoney extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cname: '',
      sign: JSON.parse(localStorage.getItem('data1')),
    }
  }
  handleChange1 = (a) => {
    this.setState({ cname: a.target.value })
    console.log(this.state.cname)
  }
  addMoneyToWallet = async (balance, razorRes) => {
    const reqData = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        signature: razorRes.razorpay_signature,
        order_id: razorRes.razorpay_order_id,
        payment_id: razorRes.razorpay_payment_id,
        amount: balance,
        user: {
          u_id: this.state.sign.u_id,
          wallet: Number(balance),
        },
      }),
    }

    let data = {
      signature: razorRes.razorpay_signature,
      order_id: razorRes.razorpay_order_id,
      payment_id: razorRes.razorpay_payment_id,
      amount: balance,
      user: {
        u_id: this.state.sign.u_id,
        wallet: Number(balance),
      },
    }

    const url = process.env.REACT_APP_BASE_URL + '/user/addMoney'

    axios
      .post(url, data)
      // await fetch(url, reqData)
      .then((response) => response.json())
      .then((data) => {
        let sign = JSON.parse(localStorage.getItem('data1'))
        sign.wallet = data.wallet
        localStorage.setItem('data1', JSON.stringify(sign))
        window.location.href = '/wallet'
      })
      .catch((error) => {
        console.log(error)
      })
  }

  displayRazorpay = async (e) => {
    e.preventDefault()
    const res = loadScript('https://checkout.razorpay.com/v1/checkout.js')

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?')
      return
    }

    const data = await fetch(
      process.env.REACT_APP_BASE_URL +
        '/payment/razorpay/' +
        this.state.cname * 100,
      {
        method: 'POST',
      },
    ).then((t) => t.json())

    console.log(data)
    let sign = JSON.parse(localStorage.getItem('data1'))

    const options = {
      key: process.env.RAZORPAY_KEY_ID,
      currency: data.currency,
      amount: data.amount.toString(),
      order_id: data.id,
      name: 'Donation',
      description: 'Thank you for nothing. Please give us some money',
      image: process.env.REACT_APP_BASE_URL + '/files/Logo.png',
      handler: async (response) => {
        // alert(response.razorpay_payment_id)
        // alert(response.razorpay_order_id)
        // alert(response.razorpay_signature)
        this.addMoneyToWallet(data.amount / 100, response)
        toast('Payment SuccessFul.....')
      },
      prefill: {
        name: sign.u_fname,
        email: sign.u_email,
        phone_number: sign.u_phone,
      },
    }
    const paymentObject = new window.Razorpay(options)
    paymentObject.open()
  }

  render() {
    return (
      <Container>
        <div className="register">
          <div style={{ textAlign: 'center' }}>
            <Link to="/">
              <img className="login_img" src={Logo} alt="logo" />
            </Link>
          </div>
          <div className="register_container">
            <form>
              <h5>Add Amount</h5>
              {/* <input type="number" name="cname" value={this.state.cname} onChange={this.handleChange1} /> */}
              <Form.Group className="mb-2 mt-3" controlId="formBasicEmail">
                <Form.Label>Enter Amount</Form.Label>
                <Form.Control
                  type="number"
                  name="cname"
                  value={this.state.cname}
                  onChange={this.handleChange1}
                />
              </Form.Group>
              <br />
              <button
                className="innerbutton"
                //   onClick={this.submitForm}

                onClick={(e) => {
                  this.displayRazorpay(e)
                }}
              >
                Ok
              </button>
              <br />
            </form>
          </div>
        </div>
      </Container>
    )
  }
}
