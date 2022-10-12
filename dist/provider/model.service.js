"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../loaders/db"));
class ModelService {
    constructor(model) {
        this.Model = model;
    }
    async find() {
        return await (0, db_1.default)(this.Model).select("*");
    }
    async findOne(query) {
        return await (0, db_1.default)(this.Model).select("*").where(query);
    }
    async create(data) {
        return await (0, db_1.default)(this.Model).insert(data);
    }
    async customFind(field, identifier, options) {
        return await (0, db_1.default)(this.Model)
            .select(field)
            .orderBy(identifier, options)
            .limit(1);
    }
    async update(query, target) {
        return await (0, db_1.default)(this.Model).where(query).update(target);
    }
    async remove(target) {
        return await (0, db_1.default)(this.Model).where(target).delete();
    }
}
exports.default = ModelService;
