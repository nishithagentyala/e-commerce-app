import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Row, Col, ListGroup, Card, Image, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message.js'
import Loader from '../components/Loader.js'
import { Link } from 'react-router-dom'
import {
  deliverOrder,
  getOrderDetails,
  payOrder,
} from '../actions/orderActions'
import axios from 'axios'
import { PayPalButton } from 'react-paypal-button-v2'
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from '../constants/orderConstants.js'

const OrderScreen = () => {
  const { id } = useParams()
  const history = useNavigate()
  var nf = new Intl.NumberFormat()
  const [sdkReady, setSdkReady] = useState(false)
  const dispatch = useDispatch()
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin
  const orderDetails = useSelector((state) => state.orderDetails)
  const { order, loading, error } = orderDetails

  const orderPay = useSelector((state) => state.orderPay)
  const { success: successPay, loading: loadingPay } = orderPay
  const orderDeliver = useSelector((state) => state.orderDeliver)
  const { success: successDeliver, loading: loadingDeliver } = orderDeliver

  useEffect(() => {
    if (!userInfo) history('/login')
    const addPayPalScript = async () => {
      const { data: clientId } = await axios.get(
        'http://localhost:8000/api/config/paypal'
      )
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
      script.async = true
      script.onload = () => {
        setSdkReady(true)
      }
      document.body.appendChild(script)
    }
    if (successPay || !order || successDeliver) {
      dispatch({ type: ORDER_PAY_RESET })
      dispatch({ type: ORDER_DELIVER_RESET })
      dispatch(getOrderDetails(id))
    } else if (!order.isPaid) {
      if (!window.paypal) {
        addPayPalScript()
      } else {
        setSdkReady(true)
      }
    }
  }, [dispatch, id, successPay, successDeliver, order])

  if (!loading) {
    order.itemPrice = order.orderItems.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    )
  }
  const successPaymentHandler = (paymentResult) => {
    dispatch(payOrder(id, paymentResult))
  }
  const deliverHandler = () => {
    dispatch(deliverOrder(order))
  }
  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message>{error}</Message>
      ) : (
        <>
          <h2>Order {order._id}</h2>
          <Row>
            <Col md={8}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h2>Shipping </h2>
                  <p>
                    <strong>Name: </strong>
                    {order.user.name}
                  </p>
                  <p>
                    <strong>Mail: </strong>
                    <a href={`mail to:${order.user.email}`}>
                      {order.user.email}
                    </a>
                  </p>
                  <p>
                    <strong>Address: </strong>
                    {order.shippingAddress.address},{order.shippingAddress.city}
                    ,{order.shippingAddress.postalCode},
                    {order.shippingAddress.country}
                  </p>
                  {order.isDelivered ? (
                    <Message variant='success'>
                      Delivered on {order.deliveredAt}
                    </Message>
                  ) : (
                    <Message variant='danger '>Not Delivered</Message>
                  )}
                </ListGroup.Item>

                <ListGroup.Item>
                  <h2>Payment Method</h2>
                  <p>
                    <strong>Method: </strong>
                    {order.paymentMethod}
                  </p>
                  {order.isPaid ? (
                    <Message variant='success'>Paid on {order.paidAt}</Message>
                  ) : (
                    <Message variant='danger '>Not Paid</Message>
                  )}
                </ListGroup.Item>

                <ListGroup.Item>
                  <h2>Ordered Items </h2>
                  {order.orderItems.length === 0 ? (
                    <Message>Your order is Empty</Message>
                  ) : (
                    <ListGroup variant='flush'>
                      {order.orderItems.map((item, index) => (
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
                              {item.qty} x &#8377;{nf.format(item.price)}
                              =&#8377;
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
                      <Col>&#8377; {nf.format(order.itemPrice)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Shipping</Col>
                      <Col> &#8377; {nf.format(order.shippingPrice)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Tax</Col>
                      <Col>&#8377; {nf.format(order.taxPrice)}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Total</Col>
                      <Col>&#8377; {nf.format(order.totalPrice)}</Col>
                    </Row>
                  </ListGroup.Item>
                  {!order.isPaid && (
                    <ListGroup.Item>
                      {loadingPay && <Loader />}
                      {!sdkReady ? (
                        <Loader />
                      ) : (
                        <PayPalButton
                          amount={order.totalPrice}
                          onSuccess={successPaymentHandler}
                        />
                      )}
                    </ListGroup.Item>
                  )}
                  {loadingDeliver && <Loader />}
                  {userInfo &&
                    userInfo.isAdmin &&
                    order.isPaid &&
                    !order.isDelivered && (
                      <ListGroup.Item>
                        <Button
                          type='button'
                          className='btn btn-block center'
                          onClick={deliverHandler}
                        >
                          Mark as Delivered
                        </Button>
                      </ListGroup.Item>
                    )}
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </>
  )
}
export default OrderScreen
