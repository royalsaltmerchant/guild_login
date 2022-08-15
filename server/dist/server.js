"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const users_1 = __importDefault(require("./src/api/routes/users"));
const projects_1 = __importDefault(require("./src/api/routes/projects"));
const packs_1 = __importDefault(require("./src/api/routes/packs"));
const entries_1 = __importDefault(require("./src/api/routes/entries"));
const contributions_1 = __importDefault(require("./src/api/routes/contributions"));
const tracks_1 = __importDefault(require("./src/api/routes/tracks"));
const s3_1 = __importDefault(require("./src/api/routes/s3"));
var app = (0, express_1.default)();
//Set CORS
app.use((0, cors_1.default)());
//Set JSON parser
app.use(express_1.default.json());
// Have Node serve the files for our built React app
app.use(express_1.default.static(path_1.default.resolve(__dirname, '../build')));
// Routes
app.use('/api', users_1.default);
app.use('/api', projects_1.default);
app.use('/api', packs_1.default);
app.use('/api', entries_1.default);
app.use('/api', contributions_1.default);
app.use('/api', tracks_1.default);
app.use('/api', s3_1.default);
//Error
app.use((error, req, res, next) => {
    console.error(error);
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message || "Internal Server Error"
        }
    });
});
// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, '../build', 'index.html'));
});
//Run
var PORT = 4000;
app.listen({ port: PORT }, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server Running at http://localhost:${PORT}`);
}));
