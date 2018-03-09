var mysql = require('mysql');
var q = require('q');

function getConnection() {
    var deferred = q.defer();
 
    var connection = mysql.createConnection({
 		   host: 'localhost',
		   user: 'root',
		   password: 'my_root',
		   database: 'eidd_resultados_16_17_test',
		   port: 3306
    });
 
    connection.connect(function (err) {
        if (err) {
            console.error(err);
            deferred.reject(err);
        }
        console.log('[CONN] – Connection created with id:'+ connection.threadId);
        deferred.resolve(connection);
    });
    return deferred.promise;
}
 
function prepareQuery(query, parameters){
    if(!query || !parameters) {
        throw  new Error('query and parameters function parameters should be specified.');
    }
    return mysql.format(query, parameters);
}

module.exports = {
    getConnection : getConnection, 
    prepareQuery: prepareQuery
};

