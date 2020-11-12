#include "crow_all.h"

int main()
{
	crow::SimpleApp app;

	CROW_ROUTE(app, "/")([](){
		return "Hello world";
	});
	
	CROW_ROUTE(app, "/json")([](){
		crow::json::wvalue x;
		x["array"] = "{\"a\":\"23\"}";
		x["message"] = "Hello, World!";
		return x;
	});
	

	app.port(1880).multithreaded().run();
}