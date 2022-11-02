import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const SearchBox = () => {
  const history = useNavigate()
  const [keyword, setKeyword] = useState('')
  const submitHandler = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      history(`/search/${keyword}`)
    } else {
      history('/')
    }
  }
  return (
    <Form onSubmit={submitHandler} className='search'>
      <Form.Control
        type='text'
        name='q'
        onChange={(e) => setKeyword(e.target.value)}
        placeholder='search products...'
        className='mr-sm-2 ml-sm-5 '
      ></Form.Control>
      <Button type='submit' className='p-2' variant='outline-success'>
        Search
      </Button>
    </Form>
  )
}

export default SearchBox
