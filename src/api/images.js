const fs = require('fs'); 
const path = require('path');
const uuid = require('uuid');

const public = path.join(__dirname, '../public/img');


const getExt = (mimetype) => {
	const array = mimetype.split('/');
	const lastIndex = array.length - 1;
	const ext = array[lastIndex];

	return ext;
}

const showError = (error) => {
	console.log(`Что-то пошло не так: ${error}`)
}

const saveToDisc = async (img) => {
	return new Promise ((resolve, reject) => {
		const oldPath = img.filepath;
		const id = uuid.v4();
		const ext = getExt(img.mimetype);
		
		const newName = `${id}.${ext}` 
		const newPath = path.join(public, newName);
		const link = path.join('../public/img', newName);
		
		const readStream = fs.createReadStream(oldPath);
		const writeStream = fs.createWriteStream(newPath); 
	
		readStream.on('error', (error) => showError(error));
		writeStream.on('error', (error) => showError(error));

		readStream.on('close', async () => {
   		await fs.promises.unlink(oldPath);
   		resolve({id, link, ext});
  	});
		readStream.pipe(writeStream);
	})
}

const removeFromDisc = async (link) => {
	const newPath = path.join(__dirname, link);
	await fs.promises.unlink(newPath)
	
	return true;
}


module.exports = {
	getExt,
	saveToDisc,
	removeFromDisc
}