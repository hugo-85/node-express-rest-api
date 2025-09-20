"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var app = (0, express_1.default)();
var PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use((0, express_1.json)());
// Sample route
app.get("/", function (req, res) {
    res.send("Hello, World!");
});
// Start the server
app.listen(PORT, function () {
    console.log("Server is running on http://localhost:".concat(PORT));
});
