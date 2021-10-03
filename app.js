const express = require('express');
const cors = require('cors');
const { body,validationResult} = require('express-validator');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mailer = require('./nodemailer')
require('dotenv').config()
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const corsOptions = {
  origin: ['http://localhost:8080', 'http://localhost:8080/', 'https://feihoa.github.io', 'https://feihoa.github.io/', 'https://api.sovet-consult.tk/', 'https://api.sovet-consult.tk/', 'http://api.sovet-consult.tk/', 'http://api.sovet-consult.tk'],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: true,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'x-requested-with', 'origin', 'accept', 'x-access-token', 'Authorization'],
  credentials: true,
};
app.use('*', cors(corsOptions));


app.use(helmet());
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.post('/form',
body('name', 'Invalid name.').trim().escape().exists({checkFalsy: true}).isLength({ min: 1 }),
body('email', 'Invalid email.').trim().escape().exists({checkFalsy: true}).isEmail().normalizeEmail(),
body('tel', 'Invalid mobile number.').trim().escape()
.exists({checkFalsy: true})
.isLength({min: 5})
.custom((val) => (/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g).test(val)),
body('text', 'Invalid text.').trim().escape(),
(req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
        success: false,
        errors: errors.array()
    });
}
  const {
    name, tel, email, text
  } = req.body;

  try {
    const message = {
      from: `Form <${process.env.EMAIL}>`,
      subject: 'Form submitted',
      text: `Заявка с сайта.
      Имя: ${name},
      Телефон: ${tel},
      Почта: ${email}.
      ${text ? text : ''}`

    }
    sendmail= async(req)=>{
      let resp= await mailer(message);
      if(resp){
        return res.status(200).json({
          success: true,
          message: 'Форма отправлена',
      })
      }else{
        res.send({data: 'Произошла ошибка'})

      }
    }
    sendmail()
  }catch(err){
    res.send({data: 'Произошла ошибка'})
  }
})
const port = 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});