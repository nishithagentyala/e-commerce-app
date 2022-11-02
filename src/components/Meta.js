import React from 'react'
import { Helmet } from 'react-helmet'
const Meta = (title, description, keywords) => {
  return (
    <Helmet>
      <title>ProShop </title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />
    </Helmet>
  )
}

export default Meta
