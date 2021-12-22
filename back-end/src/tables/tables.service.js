const knex = require("../db/connection");

function list(occupied) {
    if (occupied) {
	return knex("tables").select("*").whereNotNull("reservation_id");
    }
    return knex("tables").select("*");
}

function read(tableId) {
    return knex("tables").select("*").where({table_id : tableId}).first();
}

function create(newTable) {
    return knex("tables")
	.insert(newTable)
	.returning("*")
	.then((createdRecords) => createdRecords[0]);
}

function addReservation(resId, tableId) {
    knex("reservations")
	.where({reservation_id : resId})
	.update({status: "seated"})
	.then();
    
    return knex("tables")
	.where({table_id: tableId})
	.update({reservation_id: resId});
}

function deleteReservation(resId, tableId) {
    knex("reservations")
	.where({reservation_id : resId})
	.update({status: "finished"})
	.then();
    return knex("tables")
	.where({table_id: tableId})
	.update({reservation_id : null});
}

module.exports = {
    list,
    read,
    create,
    addReservation,
    deleteReservation
}
