var http = require("http");
http.createServer(function(request, response) {
	// HTTP 状态 200 和 HTTP 头的内容类型
	response.writeHead(200, {
		"Content-Type": "text/plain"
	});
	response.write("Hello World");
	// 调用 response.end() 完成响应
	response.end();
}).listen(8888);