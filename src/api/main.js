const fs = require('fs');;

const { getExt, saveToDisc, removeFromDisc } = require('./images.js');
const { getListImages, addImgToList,	upgImgToList,	delImgFromList } = require('./database.js');

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
				res.data = await saveImg(body.name, files.file);
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

const saveImg = async (name, img) => {
	const newImg = await saveToDisc(img);
	newImg.name = name;

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
	
	if (!await removeFromDisc(link)) {
		return false;
	}

	return id;
}

const getImages = async() => {
	const fullImages = await getListImages()
	
	if(!fullImages) {
		return false;
	}

	return fullImages;
}


module.exports = { processingRequest }