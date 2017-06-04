"use strict";
const express = require('express');
const server = express();
const path = require('path');
const pool = require('./mysql');
const crawler = require('./crawler');
setInterval(crawler, 5 * 1000 * 60);
// 配置ejs(只需要在server,js中配置一次)
const ejs = require('ejs');
server.set('view-engine', 'html');
server.engine('html', ejs.renderFile);


server.use('/',express.static('./public'));
server.use('/static',express.static('./static'));
server.get('/cate',(req,res)=>{
    let id = req.query.id || 1;
    pool.query('select * from category', (err, cate) => {
        pool.query('select * from news where cate=? order by id desc limit 20', [id],
            (err, news) => {
                res.end()
            })
    })
});
server.get('/news', (req, res) => {
    let limit = 20;
    let sql = `select * from news where cate=? order by id desc limit ? offset ?`;
    pool.query(sql, [req.query.id, limit, (req.query.page - 1) * limit], (err, result) => {
        if (err){
            res.json(err.message);
        }else{
            if (!result.length) {
                res.json({state: 400})
            } else {
                res.json({state: 200, data: result})
            }
        }
    })
});
server.get('/*', (req, res) => {
    res.sendFile(path.resolve('./views/index.html'))
    // let id = req.query.id || 1;
    // pool.query('select * from category', (err, cate) => {
    //     pool.query('select * from news where cate=? order by id desc limit 20', [id],
    //         (err, news) => {
    //             res.end()
    //         })
    // })

});
server.listen(18080, (err) => {
    if (err) throw err.message;
    console.log('server is listening @ 18080');
});


