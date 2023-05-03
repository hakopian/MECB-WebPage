var http = require('http');     
var fs = require('fs');         
var url = require('url');       
var path = require('path');     
var mysql = require("mysql");
var fileExtensions = {
     ".html":    "text/html",
     ".css":     "text/css",
     ".js":      "text/javascript",
     ".jpeg":    "image/jpeg",
     ".jpg":     "image/jpeg",
     ".png":     "image/png"
 };



var con = mysql.createConnection({
    host: "sql.wpc-is.online",
    user: "hhakopi1",
    password: "hhak0533",
    database: "db_test_hhakopi1"
});
con.connect();

var server = http.createServer(function(request, response) { 
var base = "http://" + request.headers.host;
var completeurl = new URL(request.url, base);
var table = completeurl.searchParams.get("tableName");
if (table == "Products_Project") {
    
    var myQuery = "SELECT * from Products_Project";
    con.query(myQuery, function(err, result, fields){
    
        response.end(JSON.stringify(result));

    });



}
else {

    var pathname = url.parse(request.url).pathname;
    var filename;
    if(pathname === "/") {
        filename = "homePage.html"; 
    }
    else
        filename = path.join(process.cwd(), pathname);

    try {
        fs.accessSync(filename, fs.F_OK);
        var fileStream = fs.createReadStream(filename);
        var typeAttribute = fileExtensions[path.extname(filename)];
        response.writeHead(200, {'Content-Type': typeAttribute});
        fileStream.pipe(response);
    }
    catch(e) {
            console.log("\n\n");
            console.log('File does not exist: ' + filename);
            response.writeHead(404, {'Content-Type': 'text/plain'});
            response.write('404 - File Not Found (' + filename + ')');
            response.end();
    }
} 
}); 

server.listen(8000);
console.log("\nThe Web server is alive!!!\n"  + 
    "It's listening on http://127.0.0.1:8000 or http://localhost:8000");