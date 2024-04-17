const http = require('http');

const Koa = require('koa');
const { koaBody } = require('koa-body');
const koaStatic = require('koa-static');
const cors = require('@koa/cors');

const path = require('path');
const fs = require('fs');
const uuid = require('uuid');

const app = new Koa();
const public = path.join(__dirname, '/public');

const { processingRequest } = require('./src/api/processingRequest.js');

app.use(koaBody({
	text: true,
	urlencoded: true,
	multipart: true,
	json: true,
}))
	.use(koaStatic(public))
	.use(cors())
	.use(async ctx => {
		try {
			const resp = await processingRequest(ctx.request.querystring, ctx.request.body)

			ctx.response.body = resp;
		} catch (err) {

			console.log(err)
			ctx.response.status = 500;
			ctx.response.body = "Сайт временно недоступен"
		}
	})

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback()).listen(port)

