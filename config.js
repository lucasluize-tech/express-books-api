/** Common config for bookstore. */


let DB_URI = `postgresql:///book_db`;

if (process.env.NODE_ENV === "test") {
  DB_URI = `postgresql:///book_db_test`;
} else {
  DB_URI = process.env.DATABASE_URL || DB_URI;
}


module.exports = { DB_URI };