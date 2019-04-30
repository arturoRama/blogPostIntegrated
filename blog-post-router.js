const uuidv4 = require('uuid/v4');
const express = require('express');
const router = express.Router();
const {blogList} = require('./blog-post-model');

router.get('/blog-posts', (req,res,next) =>{
	
	blogList.get()
	.then(blog => {
		res.status(200).json({
			message : 'Successsfully sent all the blogs',
			status : 200,
			post : blog
		});
	})
	.catch(err => {
		res.status(500).json({
			message : "Internal server error",
			status : 500
		});
		return next();
	});
});

router.get('/blog-posts/:author', (req,res,next) => {
	if(!('author' in req.params)){
		res.status(406).json({
			message : "Missing parameter",
			status : 406
		});
		return next();
	}

	let sAuthor = req.params.author;
	blogList.getAuthor(sAuthor)
	.then(blog => {
		res.status(200).json({
			message : `Successsfully found the posts of ${sAuthor}`,
			status :200,
			post : blog
		});
	})
	.catch(err => {
		res.status(404).json({
			message : `There are no posts from ${sAuthor}`,
			status : 404
		});
		return next();
	});
});

router.post('/blog-posts', (req,res,next) => {
	let requiredFields = ['title','content','author','publishDate'];

	for(let i = 0; i < requiredFields.length; i++){
		let currentField = requiredFields[i];
		if (! (currentField in req.body)){
			res.status(406).json({
				message : `Missing field ${currentField} in body.`,
				status : 406
			});
			return next();
		}
	}

	console.log(req.body);
	let objectToAdd = {
		id: uuidv4(),
		title: req.body.title,
		content:req.body.content,
		author:req.body.author,
		publishDate:req.body.publishDate
	}
	
	blogList.add(objectToAdd)
		.then(blog => {
			res.status(201).json({
				message : "Successsfully added the post",
				status: 201,
				post : blog
			});
		})
		.catch(err => {
			res.status(400).json({
				message : `${err}`,
				status : 400
			});
			return next();
		});
});

router.delete('/blog-posts/:id', (req,res,next) => {
	let requiredFields = ['id'];

	for(let i = 0; i < requiredFields.length; i++) {
		let currentField = requiredFields[i];

		if (!(currentField in req.body)){
			res.status(406).json({
				message: `Missing field ${currentField} in body`,
				status : 406
			});
			return next();
		}
	}

	let delID = req.body.id;

	if (delID){
		if(delID == req.body.id){
			blogList.delete(delID)
				.then(blog => {
					res.status(204).json({
						message : "Post succesfully deleted",
						status : 204
					});
				})
				.catch(err => {
					res.status(404).json({
						message : "Post not found",
						status : 404
					})
				})
		}
		else{
			res.status(400).json({
				message : "Param and body do not match",
				status : 400
			});
			return next();
		}
	}else{
		res.status(406).json({
			message : "Missing param id",
			status : 406
		});
		return next();
	}
});

router.put('/blog-posts/:id', (req,res,next) => {
	
	if (!('id' in req.params))
	{
		res.status(406).json({
			message : "Missing id in parameter",
			status : 406
		});
		return next();
	}
	
	let putID = req.params.id;
	let bodyID = req.body;
	blogList.place(putID,bodyID)
		.then(blog => {
			res.status(200).json({
				message: "Post modified successfully",
				status : 200,
				post :blog
			})
		})
		.catch(err => {
			res.status(404).json({
				message : "No parameters in the body",
				status : 404		
			})
			return next();
		})
});


module.exports = router;