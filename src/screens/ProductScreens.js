import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Row, Col, ListGroup, Card, Button, Image, Form } from 'react-bootstrap'
import Ratings from '../components/Ratings'
import Meta from '../components/Meta'
import {
  listProductDetails,
  createReviewProduct,
} from '../actions/productAction'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'

const ProductScreens = () => {
  var nf = new Intl.NumberFormat()

  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const history = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams()
  const productDetail = useSelector((state) => state.productDetail)
  const { loading, error, product } = productDetail

  const productCreateReview = useSelector((state) => state.productCreateReview)
  const { error: errorCreateReview, success: successCreateReview } =
    productCreateReview

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (successCreateReview) {
      alert('Review Submitted!')
      setRating(0)
      setComment('')
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
    }

    dispatch(listProductDetails(id))
  }, [dispatch, id, successCreateReview])

  const addToCartHandler = () => {
    history(`/cart/${id}?qty=${qty}`)
  }
  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(createReviewProduct(id, { rating, comment }))
  }
  return (
    <>
      <Link className='btn btn-dark my-3' to='/'>
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Meta title={product.name} />
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Ratings
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                    color='yellow'
                  />
                </ListGroup.Item>
                <ListGroup.Item>
                  Price: &#8377; {nf.format(product.price)}
                </ListGroup.Item>
                <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>&#8377; {product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status</Col>
                      <Col>
                        {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control
                            as='select'
                            value={qty}
                            onChange={(e) => {
                              setQty(e.target.value)
                            }}
                          >
                            {[...Array(product.countInStock).keys()].map(
                              (x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              )
                            )}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}
                  <ListGroup.Item>
                    <Button
                      onClick={addToCartHandler}
                      className='btn-block'
                      type='button'
                      disabled={product.countInStock === 0}
                    >
                      Add to Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <h2>Reviews</h2>
              {product.reviews.length === 0 && <Message>No Reviews </Message>}
              <ListGroup variant='flush'>
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Ratings value={review.rating} color='yellow' />
                    <p>{review.createdAt}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Write a customer Review</h2>
                  {errorCreateReview && (
                    <Message variant='danger'>{errorCreateReview}</Message>
                  )}
                  {userInfo ? (
                    <Form onSubmit={submitHandler}>
                      <Form.Group controlId='rating' className='my-3'>
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as='select'
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value=''>Select...</option>
                          <option value='1'>Poor</option>
                          <option value='2'>Fair</option>
                          <option value='3'>Good</option>
                          <option value='4'>Very Good</option>
                          <option value='5'>Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group controlId='comment' className='my-3'>
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as='textarea'
                          row='3'
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button type='submit' variant='primary'>
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <Message>
                      Please <Link to='/'>Sign In</Link>to write a review
                    </Message>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

export default ProductScreens
