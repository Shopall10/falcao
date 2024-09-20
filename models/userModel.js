const db = require('../config/bd');

const getPendingRegistrations = (callback) => {
    const sql = 'SELECT * FROM pending_registrations';
    db.query(sql, callback);
};

const approveRegistration = (email, hashedPassword, phone, storeOrSale, callback) => {
    const insertUserSql = `
        INSERT INTO users (email, password, phone, store_or_sale, is_approved)
        SELECT ?, ?, ?, ?, TRUE 
        FROM pending_registrations 
        WHERE email = ?`;
    const deletePendingSql = 'DELETE FROM pending_registrations WHERE email = ?';

    db.beginTransaction((err) => {
        if (err) return callback(err);

        db.query(insertUserSql, [email, hashedPassword, phone, storeOrSale, email], (err, results) => {
            if (err) return db.rollback(() => callback(err));

            db.query(deletePendingSql, [email], (err) => {
                if (err) return db.rollback(() => callback(err));

                db.commit((err) => {
                    if (err) return db.rollback(() => callback(err));
                    callback(null, results);
                });
            });
        });
    });
};

const rejectRegistration = (email, callback) => {
    const sql = 'DELETE FROM pending_registrations WHERE email = ?';
    db.query(sql, [email], callback);
};

module.exports = {
    getPendingRegistrations,
    approveRegistration,
    rejectRegistration
};
