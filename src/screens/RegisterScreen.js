import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader.js'
import Message from '../components/Message.js'
import { register } from '../actions/userActions'
import FormContainer from '../components/FormContainer.js'

const RegisterScreen = () => {
  const { search } = useLocation()
  const history = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmpassword, setconfirmPassword] = useState('')
  const [message, setMessage] = useState(null)

  const dispatch = useDispatch()
  const userRegister = useSelector((state) => state.userRegister)
  const { loading, error, userInfo } = userRegister
  const redirect = search ? search.split('=')[1] : '/'

  useEffect(() => {
    if (userInfo) {
      history(redirect)
    }
  }, [history, userInfo, redirect])
  const submitHandler = (e) => {
    e.preventDefault()
    if (password !== confirmpassword) setMessage('passwords does not match')
    else dispatch(register(name, email, password))
  }

  return (
    <FormContainer>
      <h1>Sign In</h1>
      {message && <Message variant='danger'>{message}</Message>}
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='name'>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type='name'
            placeholder='enter username'
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='password'>
          <Form.Label>Passowrd</Form.Label>
          <Form.Control
            type='password'
            placeholder='enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='confirm password'>
          <Form.Label>Confirm Passowrd</Form.Label>
          <Form.Control
            type='password'
            placeholder='confirm password'
            value={confirmpassword}
            onChange={(e) => setconfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type='submit' variant='primary' className='my-3'>
          Register
        </Button>
      </Form>
      <Row className='py-3'>
        <Col>
          Already have an account ?
          <Link to={redirect ? `/login?redirect=${redirect}` : `/login`}>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default RegisterScreen
