const express = require('express');

const usersRouter = require('./routers/users.router');
const carsRouter = require('./routers/cars.router');

const app = express();
const port = process.env.PORT || 3333;

const authMiddleware = (req, res, next) => {
    return next(req.headers['token'] ? undefined : new Error('Authorization required'));
}

app.use((req, res, next) => {
    // req - это тело запроса + его метаданные
    // res - объект который обладаем методами для ответа на запрос
    // next - функция которая передает обязанности следующему обработчику ...
    // next может принимать как аргумент ошибку
    console.log('Request with payload', req.query);
    
    next();
});

app.use('/users', usersRouter);
app.use('/users/:id/cars', authMiddleware, carsRouter);

app.use((req, res, next)  => {
    return res.status(404).send({
        message: 'Route not found',
        code: 123,
        stack: 'app.js'
    });
});

app.use((err, req, res, next) => {
    return res.status(500).send({
        message: err.message,
        code: 333,
        stack: err.stack || null,
    });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})