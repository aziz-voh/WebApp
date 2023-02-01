const { sequelize,User} = require('./models')
const express = require('express')
const app = express()
app.use(express.json())
const bcrypt = require('bcrypt');
const auth=require('./auth/auth')


///POSTING USER INFORMATION
app.post('/users', async (req, res) => {
  const { first_name, username, last_name,password } = req.body

  try {
  //email should be valid
   const emailRegex =/^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)$/
   if (!emailRegex.test(username)){
    return res.status(400).json({ error: 'Enter your Email ID in correct format. Example: abc@xyz.com' })
   }
    // Validation for ID
  if (req.body.id){
    return res.status(400).json({ error: 'Invalid request body for user object: ID cannot be provided by the user' })
  }

  //All four fields should be present
  if (!username ||
    !password ||
    !first_name ||
    !last_name)
    {
      return res.status(400).json({ error: 'username, password, first_name, last_name fields are required in the request body' })
    }
  
    const getUser = await User.findOne({
      where: {
          username: username,
      },
  }).catch((err) => {
    return res.status(500).json({ error: 'Some error occurred while creating the user' })
  })
  if (getUser) {
    return res.status(400).json({ error: 'User already exists!,Please try a different email address' })
  }
  else{
    const salt = await bcrypt.genSalt(10);
    const securedPassword = await bcrypt.hash(password, salt)
    const user = await User.create({first_name, username, last_name,password:securedPassword})
    res.status(201).json(user)
}
  } catch (err) {
    console.log(err)
    return res.status(500).json({ error: 'Some error occurred while creating the user' })
  }
})

app.get('/healthz', async (req, res) => {
    res.sendStatus(200);
  })


app.get('/users/:id',auth ,async (req, res) => {
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


//UPDATING USER

  app.put('/users/:id',auth, async (req, res) => {
    const { first_name, last_name, password,username } = req.body
    
    try {
      
      // req.body is empty
      if (!req.body) {
        return res.status(400).json({ error: 'Request body cant empty' })
      }

      // req.body is present but doesn't have any of
      // first_name, last_name, password, username
      if (!req.body.first_name && !req.body.last_name && !req.body.password && !req.body.username) 
      {
        return res.status(400).json({ error: 'Request body doesnt have any of first_name, last_name, password' })
      }
      // if user_id is not present in the request
      const id = req.params.id;
      if (!id) 
      {
        return res.status(400).json({ error: 'User id is not present in the request' })
      }
       // check if account_created_at is present in the request body
    if (req.body.account_created) {
        return res.status(400).json({ error: 'account_created cant be updated' })
    }
    // check if account_updated_at is present in the request body
    if (req.body.account_updated) {
      return res.status(400).json({ error: 'account_updated cant be updated' })
    }

    var DBUserObj = await User.findByPk(id);
        // check if username is present in the request body
        // if present, verify it matches the username in the db
//         if (req.body.username) {
//             if (DBUserObj.username !== req.body.username) {
//               return res.status(400).json({ error: 'Username cant be updated' })
//             }
//         }
        // check if id is present in the request body and if it matches the id in the request
        if (req.body.id) {
            if (DBUserObj.id !== req.body.id) {
              return res.status(400).json({ error: 'ID cant be updated' })
            }
        }
      
      const salt = await bcrypt.genSalt(10);
      const securedPassword = await bcrypt.hash(password, salt)
      
      const user = await User.findOne({ where: { id } })
      user.first_name = first_name
      user.last_name = last_name
      user.password = securedPassword
      user.username=username;
  
      await user.save()
  
      return res.status(204).json()
    } catch (err) {
      console.log(err)
      return res.status(500).json({ error: 'Something went wrong' })
    }
  })



//Listening 
app.listen({ port: 8000 }, async () => {
  console.log('Server up on http://localhost:8000')
  console.log('Database Connected!')
  
})

module.exports = app;

