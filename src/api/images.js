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
		const name = img.originalFilename;
		
		const newName = `${id}.${ext}` 
		const newPath = path.join(public, newName);
		const link = path.join('src/public/img', newName);
		
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
	const dir = __dirname;
	const currectDir = dir.slice(0, dir.length - 1);
	const newPath = path.join(currectDir, `../../${link}`);

	await fs.promises.unlink(newPath)
}


module.exports = {
	getExt,
	saveToDisc,
	removeFromDisc
}