const http = require('http');
const Koa = require('koa');
const { koaBody } = require('koa-body');
const koaStatic = require('koa-static'); 
const cors = require('@koa/cors');
const path = require('path'); 
const fs = require('fs');;
const app = new Koa();
const public = path.join(__dirname, 'src/public/img');

const { getExt, saveToDisc, removeFromDisc } = require('./src/api/images.js');
const { getListImages, addImgToList,	upgImgToList,	delImgFromList } = require('./src/api/database.js');

// app.use(async (ctx, next) => {
// 	console.log(1)
//   const origin = ctx.request.get('Origin');
//   if (!origin) {
//     return await next();
//   }

//   const headers = { 'Access-Control-Allow-Origin': '*', };

//   if (ctx.request.method !== 'OPTIONS') {
//     ctx.response.set({...headers});
//     try {
//       return await next();
//     } catch (e) {
//       e.headers = {...e.headers, ...headers};
//       throw e;
//     }
//   }

//   if (ctx.request.get('Access-Control-Request-Method')) {
//     ctx.response.set({
//       ...headers,
//       'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
//     });

//     if (ctx.request.get('Access-Control-Request-Headers')) {
//       ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
//     }

//     ctx.response.status = 204;
//   }
// });

app.use(cors())
app.use(koaStatic(public))
	.use(koaBody({
	text: true,
	urlencoded: true,
	multipart: true,
	json: true,
}))
	.use(async ctx => {
		try {
			const resp = await processingRequest(ctx.request.querystring, ctx.request.body, ctx.request.files)

			ctx.response.body = resp;
		} catch (err) {

			ctx.response.status = 500;
			ctx.response.body = "Сайт временно недоступен"
		}
	})


const processingRequest = async (query, body, files = null) => {
	const res = {
		success: false,
		data: null, 
	}

	const queryArray = query.split('&');
	const actString = queryArray[0];
	const actArray = actString.split('=');
	const act = actArray[1];

	try{
		switch(act) {
			case 'getAllImg':
				res.data = await getImages();
				if(res.data) {
					res.success = true;
				}
				break;

			case 'saveImg':
				res.data = await saveImg(files.file);
				if(res.data) {
					res.success = true;
				}
				break;

			case 'upgImg':
				res.data = await upgImg(body.id, body.newName);
				if(res.data) {
					res.success = true;
				}
				break;

			case 'delImg':
				res.data = await delImg(body.id);
				if(res.data) {
					res.success = true;
				}
				break;

			case 'sortImg':
				console.log('sor');
				break;

			default:
				res.success = true;
				res.body = "Ошибка в запросе"
		}
		
	} catch (err) {
		res.body = "База данных сейчас недоступна"
	}
	return res;
}

const showError = (error) => {
	console.log(`Что-то пошло не так: ${error}`)
}

const saveImg = async (img) => {

	const newImg = await saveToDisc(img);

	if(!await addImgToList(newImg)) {
		return false;
	}

	return newImg;
}

const upgImg = async (id, name) => {
	const updatedImg = await upgImgToList(id, name)
	
	if(!updatedImg) {
		return false;
	}

	return updatedImg;
}

const delImg = async (id) => {
	const link = await delImgFromList(id);
	
	await removeFromDisc(link)

	return id;
}

const getImages = async() => {
	const fullImages = await getListImages()
	
	if(!fullImages) {
		return false;
	}

	return fullImages;
}

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback()).listen(port)

