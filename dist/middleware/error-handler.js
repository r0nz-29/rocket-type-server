"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function ErrorHandler(err, req, res, next) {
    console.log("================== CUSTOM ERROR HANDLER ===================");
    console.error(err);
    res.status(500).json({ name: err.name, message: err.message });
    console.log("===========================================================");
}
exports.default = ErrorHandler;
//# sourceMappingURL=error-handler.js.map