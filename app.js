const { sequelize,User} = require('./models')

const express = require('express')

const app = express()
app.use(express.json())

app.post('/users', async (req, res) => {
  const { first_name, username, last_name,password } = req.body

  try {
    const user = await User.create({first_name, username, last_name,password})

    return res.json(user)
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
})

app.get('/healthz', async (req, res) => {
    res.sendStatus(200);
  })
app.get('/users/:id', async (req, res) => {
    const id = req.params.id
    try {
      const user = await User.findOne({
        where: { id },
        attributes: {
            exclude: ['password']
        }
         })
         if (!user){
            return res.status(400).json({ error: 'ID NOT PRESENT' })
         }
      return res.json(user)
    } catch (err) {
      console.log(err)
      return res.status(500).json({ error: 'Something went wrong' })
    }
  })

  app.put('/users/:id', async (req, res) => {
    const id = req.params.id
    const { first_name, last_name, password } = req.body
    try {
      const user = await User.findOne({ where: { id } })
  
      user.first_name = first_name
      user.last_name = last_name
      user.password = password
  
      await user.save()
  
      return res.json(user)
    } catch (err) {
      console.log(err)
      return res.status(500).json({ error: 'Something went wrong' })
    }
  })



//Listening 
app.listen({ port: 8000 }, async () => {
    console.log('Server up on http://localhost:8000')
    await sequelize.authenticate()
    console.log('Database Connected!')
    await sequelize.sync();
  })

