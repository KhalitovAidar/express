const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { makeExecutableSchema } = require("@graphql-tools/schema");

const usersRouter = require('./routers/users.router');
const carsRouter = require('./routers/cars.router');

const app = express();
const port = process.env.PORT || 3333;

const authMiddleware = (req, res, next) => {
    return next(req.headers['token'] ? undefined : new Error('Authorization required'));
}

const o = {
    name: 'Aidar',
    nickname: 'Loh',
    id: 1,
}

// Construct a schema, using GraphQL schema language
const typeDefs = buildSchema(`
    type Query {
        aidar: Aidar!
    }

    type Mutation {
        kek(age: Int!): Int!
        kok(id: Int!): [Aidar!]!
    }

    type Aidar {
        name: String!
        nickname: String!
        id: Int!
        kik: Int
    }
`);

// n + 1
const resolvers = {
    Query: {
        aidar: () => {
            return o;
        },
    },
    Mutation: {
        kek(_, { age })  {
            return age * 2;
        },
        kok(_, { id })  {
            return [{...o, id}, {...o, id}, {...o, id}, {...o, id}];
        },
    },
    Aidar: {
        kik(aidar) {
            console.log(aidar);
            // Иду в базу, забираю данные и возвращаю результат.
            return aidar.id * 2;
        },
    }
};


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

app.use('/graphql', graphqlHTTP({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    graphiql: true,
}));

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