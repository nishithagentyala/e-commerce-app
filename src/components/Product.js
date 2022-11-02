import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import Ratings from './Ratings'
const Product = ({ product }) => {
  var nf = new Intl.NumberFormat()

  return (
    <Card className='my-2 py-3 rounded'>
      <Card.Body>
        <Link to={`/products/${product._id}`}>
          <Card.Img src={product.image} variant='top' />
        </Link>
        <Link to={`/products/${product._id}`}>
          <Card.Title as='div'>
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>
        <Card.Text>
          <Ratings
            value={product.rating}
            text={`${product.numReviews} Reviews`}
            color='yellow'
          />
        </Card.Text>
        <Card.Text as='h3'>&#8377;{nf.format(product.price)}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Product
