"use strict";
const request = require('request');
const cheerio = require('cheerio');
const pool = require('./mysql');
const bloomFilter = require('bloom-filter-x');
const url = 'http://news.ifeng.com';

function crawler(){
    pool.query('select url from news order by id desc limit 5000',(err,result)=>{
        result.forEach(v=>{
            bloomFilter.add(v.url)
        });
    });
    request.get(url, (err, header, body) => {
        let data = getData(body);
        insertData(parseData(data))
    });
};
 function getData(body){
    let $ = cheerio.load(body);
    let ent = $('.left_co3').nextAll('script').eq(0).html().trim();
        ent = JSON.parse(ent.slice(ent.indexOf('[')));
    let list = $('.left_co3').nextAll('script').eq(1).html().trim().slice(0, -1);
        list = JSON.parse(list.slice(list.indexOf('[')));
        list.splice(2, 0, ent);
    return list;
};

function parseData(data){
    const r = [];
    data.forEach((v, i) => {
        v.forEach(item => {
           let t= Array.isArray(item.thumbnail) ? item.thumbnail[0] : item.thumbnail;
            if(bloomFilter.add(item.url)){
               r.push([item.title,item.url,t,i+1]);
            }
        })
    });
    return r;
};

function insertData(data){
    if(data.length){
        let sql = 'insert into news (title,url,thumbnail,cate) values ?';
        pool.query(sql,[data], (err, result) => {
            if (err) {
                console.log(err.message);
            } else {
                console.log(result.affectedRows);
                // pool.end()
            }
        })
    }else{
        console.log('not news')
    }
};

module.exports=crawler;