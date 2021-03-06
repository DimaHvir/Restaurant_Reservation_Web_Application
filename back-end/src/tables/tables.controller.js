const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function checkTable(req, res, next) {
    const {table_id} = req.params;
    const found = await service.read(table_id);
    if (found) {
	res.locals.tableId = table_id;
	res.locals.table = found;
	next();
    }
    else next({status: 404, message: `No table with ID ${table_id}`});
	
}

async function checkTableDelete(req, res, next) {
    const {table_id} = req.params;
    const found = await service.read(table_id);
    if (found) {
	if(!found.reservation_id) next({status:400, message: "this table is not occupied"});
	res.locals.tableId = table_id;
	res.locals.table = found;
	next();
    }
    else next({status: 404, message: `No table with ID ${table_id}`});
	
}

async function checkCreateInput(req, res, next) {
    const {data} = req.body;
    if (!data) return next({status: 400, message: "No body for request"});
    if (data.table_name && data.capacity) {
	if (typeof data.capacity !== "number") next({status:400, message:"capacity is not a number"});
	if (data.table_name.length === 1) next({status:400, message:"table_name is only one character"});	
	res.locals.newTable = {table_name : data.table_name, capacity : data.capacity, reservation_id : data.reservation_id};
	return next();
    }
    return next({status: 400, message: `Invalid body for create request, table_name : ${data.table_name} , capacity: ${data.capacity}`});
}

async function checkReserveInput(req, res, next) {
    const {data} = req.body;
    if (data) {
	if (data.reservation_id) {
	    const resData = await service.checkReservation(data.reservation_id);
	    if (!resData) next({status:404, message:`The reservation_id ${data.reservation_id} does not exist`});
	    if (resData.people > res.locals.table.capacity) next({status:400, message: "the capacity of this table cannot accomodate this reservation"});
	    if (resData.status === "seated") next({status: 400, message: "Cannot seat a seated table"});
	    if(res.locals.table.reservation_id) next({status:400, message:"this table is occupied"});
	    res.locals.resId = data.reservation_id;
	    return next();
	}
    }
    return next({status: 400, message: "Invalid information send for reservation_id"});
}


async function list(req, res, next) {
    const data = await service.list();
    res.json({data});
}

async function create(req, res, next) {
    const data = await service.create(res.locals.newTable);
    res.status(201).json({data});
    
}

async function reserve(req, res) {
    const update = await service.addReservation(res.locals.resId, res.locals.tableId);
    const data = await service.read(res.locals.tableId);
    res.json({data});
}


async function dereserve(req, res, next) {
    const cur = await service.read(res.locals.tableId);
    if (cur === undefined) {
	res.status(400).json({data : "This table is not currently reserved"});
    }
    else {
	await service.deleteReservation(cur.reservation_id, res.locals.tableId)
	res.json({});
    }
}


module.exports = {
    list,
    create : [checkCreateInput, create],
    reserve : [checkTable, asyncErrorBoundary(checkReserveInput),reserve],
    dereserve: [checkTableDelete, dereserve]
};
