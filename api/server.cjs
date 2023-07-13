
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User.cjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const Todo = require('./models/Todo.cjs');

const secret = 'secret123';


async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/auth-todo', {useNewUrlParser:true, useUnifiedTopology:true});
    const db = mongoose.connection;
    db.on('error',console.log);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

connectToDatabase();


const app = express();
app.use(cookieParser());
app.use(bodyParser.json({extended:true}));
app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000',
}));


app.get('/', (req, res) => {
    res.send('ok');
  });

  app.get('/user',(req, res) => {
    const payload = jwt.verify(req.cookies.token, secret);
    User.findById(payload.id).then(userInfo => {
      res.json({id:userInfo._id,email:userInfo.email});
    })
  })


  app.post('/Register', (req, res) => {
    const {email, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password,10);
    const user = new User({password:hashedPassword,email});
    user.save().then(userInfo =>{
      jwt.sign({id:userInfo._id, email:userInfo.email}, secret, (err, token) => {
        if(err){
          console.log(err);
          res.sendStatus(500);
        } else{
          res.cookie('token', token).json({id:userInfo._id,email:userInfo.email});
        }
      })
    });

  });


  app.post('/login', (req, res) => {
    const {email,password} = req.body;
    User.findOne({ email }).then(userInfo => {
      const passOk = bcrypt.compareSync(password, userInfo.password);
      if (passOk) {
        jwt.sign({ id: userInfo._id, email }, secret, (err,token) => { // Corrected parameter
          if (err) {
            console.log(err);
            res.sendStatus(500);
          } else {
            res.cookie('token', token).json({ id: userInfo._id, email: userInfo.email });
          }
        });
      } else {
        res.sendStatus(401);
      }
    });
  })

  app.post('/logout', (req, res) => {
    res.cookie('token', '').send();
  })

  app.get('/todos', async (req, res) => {
    try {
      const payload = jwt.verify(req.cookies.token, secret);
      const todos = await Todo.find({ user: new mongoose.Types.ObjectId(payload.id) });
      res.json(todos);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  });
  

  app.put('/todos', (req,res) => {
    const payload = jwt.verify(req.cookies.token, secret);
    const todo = new Todo({
      text:req.body.text,
      done: false,
      user:new mongoose.Types.ObjectId(payload.id),
    });
    todo.save().then(todo => {
      res.json(todo);
    }) 
  });

  app.post('/todos', (req,res) => {
    const payload = jwt.verify(req.cookies.token, secret);
    Todo.updateOne({
      _id:new mongoose.Types.ObjectId(req.body.id),
      user:new mongoose.Types.ObjectId(payload.id)
    },{
      done:req.body.done,
    }).then(() => {
      res.sendStatus(200);
    })
    
  });

app.listen(4000);