const fs = require('fs/promises')
const path = require('path');
const listImgs = path.join(__dirname, '../db/imageList.json');

const readListImgs = async () => {

	const imagesJSON = await fs.readFile(listImgs, 'utf8');
	const images = imagesJSON ? JSON.parse(imagesJSON) : [ ];

	return images;
}

const writeListImgs = async (images) => {
	try {
		const imagesJSON = JSON.stringify(images);
		await fs.writeFile(listImgs, imagesJSON);

	} catch (err) {
		return "База данных временно недоступна";
	}
}

const getListImages = async () => {
	const images = await readListImgs();

	// images.forEach(item => {
	// 	const tempLink = item.link;
	// 	item.link = path.join(__dirname, tempLink);
	// })

	return images;
}

const addImgToList = async (newImg) => {
	const images = await readListImgs();
	
	images.push(newImg);
	writeListImgs(images);

	return newImg;
}

const upgImgToList = async (id, newName) => {
	const images = await readListImgs();
	const img = images.find(item => item.id === id);
	img.name = newName;

	await writeListImgs(images);

	return img;
}

const delImgFromList = async (id) => {
	const images = await readListImgs();
	const img = images.find(item => item.id === id);
	const indexImg = images.indexOf(img);
	const link = img.link;
	
	images.splice(indexImg, 1);
	await writeListImgs(images)
	return link;
}

module.exports = {
	getListImages,
	addImgToList,
	upgImgToList,
	delImgFromList	
}