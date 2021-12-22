const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function checkQuery(req, res, next) {
    const {occupied} = req.query;
    if (occupied) {
	res.locals.occupied = occupied;
    }
    return next();
}

async function checkTable(req, res, next) {
    const {table_id} = req.params;
    const found = await service.read(table_id);
    if (found.table_id !== undefined) {
	res.locals.tableId = table_id;
	next();
    }
    else next({status: 400, message: `No table with ID ${table_id}`});
	
}

async function checkCreateInput(req, res, next) {
    const {table_name, capacity} = req.body.data;
    if (table_name && capacity) {
	res.locals.newTable = {table_name, capacity};
	return next();
    }
    return next({status: 400, message: `Invalid body for create request, table_name : ${table_name} , capacity: ${capacity}`});
}

async function checkReserveInput(req, res, next) {
    const {data} = req.body;
    if (data) {
	if (data.reservation_id) {
	    res.locals.resId = data.reservation_id;
	    return next();
	}
    }
    return next({status: 404, message: "Invalid information send for reservation_id"});
}


async function list(req, res, next) {
    const data = await service.list(res.locals.occupied);
    res.json({data});
}

async function create(req, res, next) {
    const data = await service.create(res.locals.newTable);
    res.json({data});
    
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
    list : [checkQuery, list],
    create : [checkCreateInput, create],
    reserve : [checkTable, asyncErrorBoundary(checkReserveInput),reserve],
    dereserve: [checkTable, dereserve]
};
