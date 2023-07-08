const express = require('express');
const router = express.Router();

// importing APIs 
const userAPI = require('../api/users');
const settingsAPI = require('../api/settings');
const categoriesAPI = require('../api/categories');

router.get('/test', (req, res) => {
    res.send("Variables Data");
});

router.get('/auth', (req, res) => {
    const authData = userAPI.getAuth();
    console.log('requesting auth ', authData);
    res.send({'auth':authData});
});


router.get('/user', (req, res)=> {
    const userData = userAPI.getUserLoggedIn();
    console.log('requesting user ', userData);
    res.send({'user':userData});
})


const functionMap = {
    'auth': userAPI.getAuth,
    'user': userAPI.getUserLoggedIn,
    'settings': settingsAPI.getSettings,
    'allCategories': categoriesAPI.getAllCategories
};

router.get('/data/:varPath', async (req, res) => {
    const varPath = req.params.varPath;
    const func = functionMap[varPath];
    if (!func) {
        // handle invalid varPath value
        res.status(400).send('Invalid varPath value');
        return;
    }

    const data = await func();
    // console.log(`requesting ${varPath} `, data);
    res.send({ [varPath]: data });
});

module.exports = router;

