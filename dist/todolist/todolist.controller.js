"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodolistController = void 0;
const common_1 = require("@nestjs/common");
const todolist_service_1 = require("./todolist.service");
const create_todo_dto_1 = require("./dto/create-todo.dto");
const http_exception_filter_1 = require("../common/filters/http-exception.filter");
const update_todo_dto_1 = require("./dto/update-todo.dto");
let TodolistController = class TodolistController {
    constructor(todolistService) {
        this.todolistService = todolistService;
    }
    findAll() {
        console.log(`\n Récupération de toutes les TODO`);
        return this.todolistService.findAll();
    }
    findOne(todoId) {
        console.log("\n Récupération de la todo d'id : " +
            todoId +
            ' type(' +
            typeof todoId +
            ')');
        return this.todolistService.findOne(todoId);
    }
    create(createTodoDto) {
        console.log(`\n Création d'une todo -- `);
        return this.todolistService.create(createTodoDto);
    }
    update(todoId, updateTodoDto) {
        console.log(`\n Modification de la TODO de todoId : ${todoId} `);
    }
    remove(todoId) {
        console.log(`\n Suppression de la TODO de todoId : ${todoId} `);
        return this.todolistService.remove(todoId);
    }
    removeAll() {
        console.log(`\n Suppression de toutes les TODO`);
        return this.todolistService.removeAll();
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TodolistController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':todoId'),
    __param(0, (0, common_1.Param)('todoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TodolistController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseFilters)(http_exception_filter_1.HttpExceptionFilter),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_todo_dto_1.CreateTodoDto]),
    __metadata("design:returntype", void 0)
], TodolistController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':todoId'),
    __param(0, (0, common_1.Param)('todoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_todo_dto_1.UpdateTodoDto]),
    __metadata("design:returntype", void 0)
], TodolistController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':todoId'),
    __param(0, (0, common_1.Param)('todoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], TodolistController.prototype, "remove", null);
__decorate([
    (0, common_1.Delete)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TodolistController.prototype, "removeAll", null);
TodolistController = __decorate([
    (0, common_1.Controller)('todolist'),
    __metadata("design:paramtypes", [todolist_service_1.TodolistService])
], TodolistController);
exports.TodolistController = TodolistController;
//# sourceMappingURL=todolist.controller.js.map