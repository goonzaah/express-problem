
//     const multer = require('multer');
//     const path = require('path');

//     const storage = multer.diskStorage({
//         destination: path.join(__dirname, '../public/uploads'),
//         filename:  (req, file, cb) => {
//             cb(null, file.originalname);
//         }
//     })
//     const uploadImage = multer({
//         storage,
//         limits: {fileSize: 1000000}
//     }).single('image');

       
// module.exports = {
//     uploadImage(req, res, (err) => {
//         if (err) {
//             err.message = 'The file is so heavy for my service';
//             return res.send(err);
//         }
//         console.log(req.file);
//         res.send('uploaded');
//     }); 
// }