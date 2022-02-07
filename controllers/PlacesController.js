const Place = require("../models/PlaceModel");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
var mongoose = require("mongoose");
// mongoose.set("useFindAndModify", false);

// Book Schema
// function BookData(data) {
// 	this.id = data._id;
// 	this.title= data.title;
// 	this.description = data.description;
// 	this.isbn = data.isbn;
// 	this.createdAt = data.createdAt;
// }

/**
 * Place List.
 * 
 * @returns {Object}
 */
exports.placeList = [
	
	function (req, res) {
		try {
			Place.find({}).then((places)=>{
				if(places.length > 0){
					return apiResponse.successResponseWithData(res, "Operation success", places);
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", []);
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Place List by co-ordinates and distance
 * 
 * @returns {Object}
 */
 exports.placeListByDistanceFromGeopoint = [
	
	function (req, res) {
		console.log('hi')
		let {long, lat} = req.body.geoPoints;
		console.log('ff',long, lat)
			let distance = 10000;
		try {
			
			
			Place.find({
				location: {
				 $near: {
				  $maxDistance: distance,
				  $geometry: {
				   type: "Point",
				   coordinates: [long, lat]
				  }
				 }
				}
			   }).find((error, places) => {
				if(places.length > 0){
					return apiResponse.successResponseWithData(res, "Operation success", places);
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", []);
				}
			   });
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

/**
 * Book Detail.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
// exports.bookDetail = [

// 	function (req, res) {
// 		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
// 			return apiResponse.successResponseWithData(res, "Operation success", {});
// 		}
// 		try {
// 			Book.findOne({_id: req.params.id,user: req.user._id},"_id title description isbn createdAt").then((book)=>{                
// 				if(book !== null){
// 					let bookData = new BookData(book);
// 					return apiResponse.successResponseWithData(res, "Operation success", bookData);
// 				}else{
// 					return apiResponse.successResponseWithData(res, "Operation success", {});
// 				}
// 			});
// 		} catch (err) {
// 			//throw error in json response with status 500. 
// 			return apiResponse.ErrorResponse(res, err);
// 		}
// 	}
// ];

/**
 * Book store.
 * 
 * @param {string}      title 
 * @param {string}      description
 * @param {string}      isbn
 * 
 * @returns {Object}
 */
// exports.bookStore = [
	
// 	body("title", "Title must not be empty.").isLength({ min: 1 }).trim(),
// 	body("description", "Description must not be empty.").isLength({ min: 1 }).trim(),
// 	body("isbn", "ISBN must not be empty").isLength({ min: 1 }).trim().custom((value,{req}) => {
// 		return Book.findOne({isbn : value,user: req.user._id}).then(book => {
// 			if (book) {
// 				return Promise.reject("Book already exist with this ISBN no.");
// 			}
// 		});
// 	}),
// 	sanitizeBody("*").escape(),
// 	(req, res) => {
// 		try {
// 			const errors = validationResult(req);
// 			var book = new Book(
// 				{ title: req.body.title,
// 					user: req.user,
// 					description: req.body.description,
// 					isbn: req.body.isbn
// 				});

// 			if (!errors.isEmpty()) {
// 				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
// 			}
// 			else {
// 				//Save book.
// 				book.save(function (err) {
// 					if (err) { return apiResponse.ErrorResponse(res, err); }
// 					let bookData = new BookData(book);
// 					return apiResponse.successResponseWithData(res,"Book add Success.", bookData);
// 				});
// 			}
// 		} catch (err) {
// 			//throw error in json response with status 500. 
// 			return apiResponse.ErrorResponse(res, err);
// 		}
// 	}
// ];

/**
 * Book update.
 * 
 * @param {string}      title 
 * @param {string}      description
 * @param {string}      isbn
 * 
 * @returns {Object}
 */
// exports.bookUpdate = [
	
// 	body("title", "Title must not be empty.").isLength({ min: 1 }).trim(),
// 	body("description", "Description must not be empty.").isLength({ min: 1 }).trim(),
// 	body("isbn", "ISBN must not be empty").isLength({ min: 1 }).trim().custom((value,{req}) => {
// 		return Book.findOne({isbn : value,user: req.user._id, _id: { "$ne": req.params.id }}).then(book => {
// 			if (book) {
// 				return Promise.reject("Book already exist with this ISBN no.");
// 			}
// 		});
// 	}),
// 	sanitizeBody("*").escape(),
// 	(req, res) => {
// 		try {
// 			const errors = validationResult(req);
// 			var book = new Book(
// 				{ title: req.body.title,
// 					description: req.body.description,
// 					isbn: req.body.isbn,
// 					_id:req.params.id
// 				});

// 			if (!errors.isEmpty()) {
// 				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
// 			}
// 			else {
// 				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
// 					return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
// 				}else{
// 					Book.findById(req.params.id, function (err, foundBook) {
// 						if(foundBook === null){
// 							return apiResponse.notFoundResponse(res,"Book not exists with this id");
// 						}else{
// 							//Check authorized user
// 							if(foundBook.user.toString() !== req.user._id){
// 								return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
// 							}else{
// 								//update book.
// 								Book.findByIdAndUpdate(req.params.id, book, {},function (err) {
// 									if (err) { 
// 										return apiResponse.ErrorResponse(res, err); 
// 									}else{
// 										let bookData = new BookData(book);
// 										return apiResponse.successResponseWithData(res,"Book update Success.", bookData);
// 									}
// 								});
// 							}
// 						}
// 					});
// 				}
// 			}
// 		} catch (err) {
// 			//throw error in json response with status 500. 
// 			return apiResponse.ErrorResponse(res, err);
// 		}
// 	}
// ];

/**
 * Book Delete.
 * 
 * @param {string}      id
 * 
 * @returns {Object}
 */
// exports.bookDelete = [

// 	function (req, res) {
// 		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
// 			return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
// 		}
// 		try {
// 			Book.findById(req.params.id, function (err, foundBook) {
// 				if(foundBook === null){
// 					return apiResponse.notFoundResponse(res,"Book not exists with this id");
// 				}else{
// 					//Check authorized user
// 					if(foundBook.user.toString() !== req.user._id){
// 						return apiResponse.unauthorizedResponse(res, "You are not authorized to do this operation.");
// 					}else{
// 						//delete book.
// 						Book.findByIdAndRemove(req.params.id,function (err) {
// 							if (err) { 
// 								return apiResponse.ErrorResponse(res, err); 
// 							}else{
// 								return apiResponse.successResponse(res,"Book delete Success.");
// 							}
// 						});
// 					}
// 				}
// 			});
// 		} catch (err) {
// 			//throw error in json response with status 500. 
// 			return apiResponse.ErrorResponse(res, err);
// 		}
// 	}
// ];