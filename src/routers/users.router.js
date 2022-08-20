const { Router } = require('express');

const router = Router();

router.post('/', (req, res, next) => {
    try {
        return res.status(201).send({
            id: 1,
            name: 'user',
        })
    } catch (e) {
        next(e);
    }
});

router.all('/:id/*', (req, res, next) => {
    req['user'] = {
        id: req.params.id,
        name: 'user',
        fromParentRoute: true,
    }
    next();
})

router.patch('/:id', (req, res, next) => {
    try {
        if (!req.params.id) throw new Error(`Id is required`);
        return res.status(200).send({
            id: req.params.id,
            name: 'user',
        })
    } catch (e) {
        next(e);
    }
});


router.delete('/:id', (req, res, next) => {
    try {
        if (!req.params.id) throw new Error(`Id is required`);
        return res.status(200).send({
            id: req.params.id,
            name: 'user',
        })
    } catch (e) {
        next(e);
    }
});

router.get('/', (req, res, next) => {
    try {
        return res.status(200).send([{
            id: 1,
            name: 'user',
        }])
    } catch (e) {
        next(e);
    }
});

router.get('/:id', (req, res, next) => {
    try {
        if (!req.params.id) throw new Error(`Id is required`);

        return res.status(200).send({
            id: req.params.id,
            name: 'user',
        })
    } catch (e) {
        next(e);
    }
});


module.exports = router;