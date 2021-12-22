const knex = require("../db/connection");

const tableName = "reservations";

function list(resId, date, mobile) {
    if(resId) {
	return knex("reservations").select("*").where({reservation_id : resId});
    }
    if (date) {
	return knex("reservations").select("*").whereNot({status : "finished"}).whereNot({status : "cancelled"}).andWhere({reservation_date : date});
    }
    if (mobile) {
	return knex("reservations").select("*").where({mobile_number : mobile});
    }
    return knex(tableName).select("*");
    
}

function read(resId) {
    return knex("reservations").select("*").where({reservation_id: resId}).first();
}

function updateStatus(resId, status) {
    return knex("reservations")
	.where({reservation_id : resId})
	.update({status : status});
}

function updateReservation(resId, data) {
    return knex("reservations")
	.where({reservation_id : resId})
	.update(data);
}

function create(data) {
    return knex("reservations")
	.insert(data)
	.returning("*")
	.then((createdRecords) => createdRecords[0]);
}

module.exports = {
    list,
    create,
    read,
    updateStatus,
    updateReservation
}
