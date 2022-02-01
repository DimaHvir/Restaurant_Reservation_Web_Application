const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function checkQuery(req, res, next) {
    if (req.query) {
	const {reservation_id, date, mobile_number} = req.query;
	res.locals.resId = reservation_id;
	res.locals.date = date;
	res.locals.mobile = mobile_number;
    }
    next();
}


function checkNewInput(req, res, next) {
    const {data} = req.body;
    if (!data) next({status: 400, message: "No body for request"});
    if (data.first_name && data.last_name && data.mobile_number && data.reservation_date && data.reservation_time && data.people) {
	res.locals.input = {first_name : data.first_name, last_name : data.last_name, mobile_number : data.mobile_number, reservation_date : data.reservation_date, reservation_time : data.reservation_time, people : data.people, status: data.status || "booked"};
	const resDate = new Date(data.reservation_date);
	if (isNaN(resDate.valueOf())) next({status:400, message: `reservation_date ${data.reservation_date} is not a date`})
	if(typeof data.people !== "number") next({status:400, message: `people ${data.people} is not a number`});
	if(data.reservation_time === "not-a-time") next({status:400, message: `reservation_time ${data.reservation_time} is not a time`});
	const date = new Date();
	if (resDate < date && resDate.getDate() + 1 !== date.getDate()) {
	    next({status:400, message : "the reservation date has already passed; you must pick a date and time in the future"});
	}
	if (resDate.getDay() === 1) next({status:400, message : "No reservations can be made for tuesday; the restuarant is closed"});
	if (data.reservation_time < "10:30" || data.reservation_time > "21:30") next({status:400, message : "The restuarant isn't open during this time"});
	const time = date.getHours() + ":" + date.getMinutes();
	if (resDate === date && reservation_time < time) next({status: 400, message: "the requested reservation time has already passed"});
	if (res.locals.input.status !== "booked") {
	    next({status:400, message:`status ${data.status} is not valid`});
	}
	next();
    }
    else next({status: 400, message : `Invalid input for reservation. first_name: ${data.first_name}, last_name : ${data.last_name}, mobile_number : ${data.mobile_number}, reservation_date : ${data.reservation_date} reservation_time : ${data.reservation_time}, people : ${data.people}`});
}

async function create(req, res) {
    const input = res.locals.input;
    input.status = "booked";
    const data = await service.create(res.locals.input);
    res.status(201).json({data});
}


async function checkUpdateInput(req, res, next) {
    const {data} = req.body;
    if (data.status) {
	if (data.status === "booked" || data.status === "seated" || data.status === "finished" || data.status === "cancelled") {
	    if (res.locals.reservation.status === "finished") next({status: 400, message: `Cannot update reservation with status ${res.locals.reservation.status}`});
	    res.locals.status = data.status;
	    return next();
	}
    }
    return next({status:400, message: `Status ${data.status} is not valid`});
}


async function list(req, res, next) {
    const data = await service.list(res.locals.resId, res.locals.date, res.locals.mobile);
    console.log(data);
    if (data) {
	res.status(200).json({data});
    }
    else {next({status: 400, message: `no result matching your query`})}
    
}


async function checkReservation(req, res,next) {
    const {reservation_id} = req.params;
    const data = await service.read(reservation_id);
    if (data) {
	res.locals.resId = reservation_id;
	res.locals.reservation = data;
	return next();
    }
    else {
	return next({status:404, message: `No reservation with ID ${reservation_id}`});
    }
}

async function read(req, res) {
    const data = await service.read(res.locals.resId);
    res.status(200).json({data});
}

function validateUpdate(req, res, next) {
    const {data} = req.body;
    if (data.first_name && data.last_name && data.reservation_date && data.reservation_time && data.people && data.mobile_number) {
	const resDate = new Date(data.reservation_date);
	if (typeof data.people !== "number") next({status:400, message:`${data.people} invalid input for people`});
	if (isNaN(resDate.valueOf())) next({status:400, message: `reservation_date ${data.reservation_date} is not a date`})
	if(data.reservation_time === "not-a-time") next({status:400, message: `reservation_time ${data.reservation_time} is not a time`});
	res.locals.input = data;
	next();
    }
    else next({status: 400, message: `Invalid input   first_name : ${data.first_name}, last_name : ${data.last_name}, mobile_number : ${data.mobile_number}, reservation_date : ${data.reservation_date}, reservation_time : ${data.reservation_time}, people : ${data.people}`});
}
async function updateReservation(req, res) {
    const {data} = req.body;
    const pre = await service.updateReservation(res.locals.resId, data);
    const found = await service.read(res.locals.resId);
    res.status(200).json({data : found});
}

async function updateStatus(req, res) {
    await service.updateStatus(res.locals.resId, res.locals.status);
    const data = await service.read(res.locals.resId);
    console.log(data);
    res.status(200).json({data});
}

//**I THINK THE ASYNCERRORBOUNDARY ERROR INVOLVED res.status().json() TYPE STATEMENTS, CONFIRM LATER
module.exports = {
    list: [checkQuery, list],
    read: [checkReservation, read],
    create: [asyncErrorBoundary(checkNewInput), create],
    updateReservation: [asyncErrorBoundary(checkReservation), validateUpdate,  updateReservation],
    updateStatus: [asyncErrorBoundary(checkReservation), asyncErrorBoundary(checkUpdateInput), updateStatus]
};
