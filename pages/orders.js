import Layout from '@/components/Layout'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    axios.get('/api/orders').then(res => {
      setOrders(res.data);
    })
  }, [])

  return (
    <Layout>
      <h1>Orders</h1>
      <table className='basic m-4'>
    <thead>
        <tr>
            <th>Date</th>
            <th>Recipient</th>
            <th>Products</th>
        </tr>
    </thead>
    <tbody>
{orders.length > 0 && orders.map((order) => (
  <tr key={order._id}>
    <td>{order.createdAt}</td>
    <td>
      {order.name} {order.email} <br/>
      {order.city} {order.postalCode} {order.country} <br/>
      {order.streetAddress}
    </td>
    <td>
      {order.line_items.map((l) => (
        <>
        {l?.product_data?.name} x {l?.quantity} <br/>
          {JSON.stringify(l)}<br/>
        </>
      ))}
    </td>
  </tr>
))}
    </tbody>
      </table>
    </Layout>
  )
}
