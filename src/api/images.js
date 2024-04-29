const fs = require('fs'); 
const path = require('path');
const uuid = require('uuid');
const host = 'https://ahj-lesson7-task2-backend-production.up.railway.app';
const public = path.join(host, __dirname, '../public/img');


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
		const name = img.originalFilename;
		
		const newName = `${id}.${ext}` 
		const newPath = path.join(public, newName);
		const link = path.join('../public/img', newName);
		
		const readStream = fs.createReadStream(oldPath);
		const writeStream = fs.createWriteStream(newPath); 
	
		readStream.on('error', (error) => showError(error));
		writeStream.on('error', (error) => showError(error));

		readStream.on('close', async () => {
   		await fs.promises.unlink(oldPath);
   		resolve({id, link, ext, name});
  	});
		readStream.pipe(writeStream);
	})
}

const removeFromDisc = async (link) => {
	const newPath = path.join(__dirname, link);
	await fs.promises.unlink(newPath)
}


module.exports = {
	getExt,
	saveToDisc,
	removeFromDisc
}