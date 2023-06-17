const fs = require('fs');
const http = require('http');
const url = require ('url');
const replaceTemplate = require('./modules/replace_Template');
// const text = fs.readFileSync('./txt/input.txt', 'utf-8');

// const newFile = text + 'hahah'
// fs.writeFileSync('./txt/output.txt', newFile);
// // console.log('done!');

// // Asynchronous

// fs.readFile('./txt/input.txt', 'utf-8', (err, data) => {
//     console.log('data: ', data);
// })
// console.log('\n Reading File input follows ... \n');

// // starting a server 

// const server = http.createServer((req, res)=> {
//     res.end('Hello From server!')
// })

//////////////////
// Routing
//////////////////
const apiData = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const productData = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');
const overviewData = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const cardData = fs.readFileSync(`${__dirname}/templates/cart-templete.html`, 'utf-8');
const data = JSON.parse(apiData);

const page = http.createServer((req, res) => {
    const {query, pathname} = url.parse(req.url, true);

    if(pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        })
        const cardsHtml = data.map(el => replaceTemplate(cardData, el)).join('');  
        const output = overviewData.replace('{%PRODUCTS_CARDS%}', cardsHtml);
        res.end(output);
    } else if (pathname === '/product') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        })
        const product = data[query.id];
        const output = replaceTemplate(productData, product);
        res.end(output);
    } else if (pathname === '/api') {
        res.writeHead(200, {
            'Content-type': 'application/json'
        })
        res.end(JSON.stringify(data));
        // res.end('this the api page')
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
        });
        res.end('<h1>Not Found !</h1>')
    }
})

page.listen(8000);
