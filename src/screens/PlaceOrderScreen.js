import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Card, Image } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import CheckOutSteps from '../components/CheckOutSteps.js'
import Message from '../components/Message.js'
import { Link } from 'react-router-dom'
import { createOrder } from '../actions/orderActions'

const PlaceOrderScreen = () => {
  var nf = new Intl.NumberFormat()
  const cart = useSelector((state) => state.cart)
  const history = useNavigate()
  const dispatch = useDispatch()
  cart.itemPrice = cart.cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  )

  cart.shippingPrice = cart.itemPrice >= 1000 ? 50 : 0
  cart.taxPrice = Number((0.01 * cart.itemPrice).toFixed(2))
  cart.totalPrice = Math.round(
    Number(cart.itemPrice) + Number(cart.shippingPrice) + Number(cart.taxPrice)
  )
  const orderCreate = useSelector((state) => state.orderCreate)
  const { order, success, error } = orderCreate

  useEffect(() => {
    if (success) history(`/order/${order._id}`)
  }, [dispatch, history, success])

  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemPrice: cart.itemPrice,
        shippingPrice: cart.shippingPrice,
        totalPrice: cart.totalPrice,
        taxPrice: cart.taxPrice,
      })
    )
  }
  return (
    <>
      <CheckOutSteps step1 step2 step3 step4 />
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping </h2>
              <p>
                <strong>Address: </strong>
                {cart.shippingAddress.address},{cart.shippingAddress.city},
                {cart.shippingAddress.postalCode},{cart.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Method</h2>
              <strong>Method: </strong>
              {cart.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Ordered Items </h2>
              {cart.cartItems.length === 0 ? (
                <Message>Your Cart is Empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {cart.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          ></Image>
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={8}>
                          {item.qty} x &#8377;{nf.format(item.price)}=&#8377;
                          {nf.format(item.qty * item.price)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items </Col>
                  <Col>&#8377; {nf.format(cart.itemPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col> &#8377; {nf.format(cart.shippingPrice)}</Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>&#8377; {nf.format(cart.taxPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>&#8377; {nf.format(cart.totalPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <Message variant='danger'>{error}</Message>}
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block'
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default PlaceOrderScreen
