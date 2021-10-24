// Endpoint para verificar Request URL

const express = require('express')
const app = express()
app.use(express.json())
app.post('/slack', (req, res) => {
  console.log(req.body)
  const ch = req.body.challenge
  res.status(200)
  res.setHeader('Content-Type', 'text/plain')
  res.send(ch)
})

app.listen(10000)