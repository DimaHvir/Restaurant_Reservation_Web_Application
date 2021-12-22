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
    const {first_name, last_name, mobile_number, reservation_date, reservation_time, people} = req.body.data;
    if (first_name && last_name && mobile_number && reservation_date && reservation_time && people) {
	res.locals.input = {first_name, last_name, mobile_number, reservation_date, reservation_time, people};
	const resDate = new Date(reservation_date);
	const date = new Date();
	if (resDate.getDate() + 1 < date.getDate()) {
	    next({status:400, message : "the reservation date has already passed; you must pick a date and time in the future"});
	}
	if (resDate.getDay() === 1) next({status:400, message : "No reservations can be made for tuesday; the restuarant is closed"});
	if (reservation_time < "10:30" || reservation_time > "21:30") next({status:400, message : "The restuarant isn't open during this time"});
	const time = date.getHours() + ":" + date.getMinutes();
	if (resDate === date && reservation_time < time) next({status: 400, message: "the requested reservation time has already passed"});
	next();
    }
    else next({status: 400, message : `Invalid input for reservation. first_name: ${first_name}, last_name : ${last_name}, mobile_number : ${mobile_number}, reservation_date : ${reservation_date} reservation_time : ${reservation_time}, people : ${people}`});
}

async function create(req, res) {
    const input = res.locals.input;
    input.status = "booked";
    const data = await service.create(res.locals.input);
    res.status(201).json({data});
}


async function checkUpdateInput(req, res, next) {
    const {data} = req.body;
    const result = await service.read(res.locals.resId);
    if (result.status === "finished") {
	return next({status: 400, message : "cannot update a finished reservation"});
    }
    if (result.status === "seated" && data.status === "seated") {
	return next({status:400, message: `this table is already seated`});
    }
    if (data) {
	if (data.status !== "booked" && data.status !== "seated" && data.status !== "finished") {
	    res.locals.status = data.status;
	    return next();
	}
    }
    next({status:400, message: "Invalid body for this put request"});
}


async function list(req, res, next) {
    console.log(res.locals)
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
	next();
    }
    else {
	next({status:404, message: `No reservation with ID ${reservation_id}`});
    }
}

async function read(req, res) {
    const data = await service.read(res.locals.resId);
    res.status(200).json({data});
}

function validateUpdate(req, res, next) {
    const {data} = req.body;
    if (data.first_name && data.last_name && data.reservation_date && data.reservation_time && data.people && data.mobile_number) {
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
    const pre = await service.updateStatus(res.locals.resId, res.locals.status);
    const data = await service.read(res.locals.resId);
    res.status(200).json({data});
}

//**I THINK THE ASYNCERRORBOUNDARY ERROR INVOLVED res.status().json() TYPE STATEMENTS, CONFIRM LATER
module.exports = {
    list: [checkQuery, list],
    read: [checkReservation, read],
    create: [asyncErrorBoundary(checkNewInput), create],
    updateReservation: [asyncErrorBoundary(checkReservation), validateUpdate,  updateReservation],
    updateStatus: [asyncErrorBoundary(checkUpdateInput), asyncErrorBoundary(checkReservation), updateStatus]
};
