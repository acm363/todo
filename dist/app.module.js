"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const mongoose_1 = require("@nestjs/mongoose");
const todolist_module_1 = require("./todolist/todolist.module");
const config_1 = require("@nestjs/config");
const common_module_1 = require("./common/common.module");
const tasklist_service_1 = require("./tasklist/tasklist.service");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            todolist_module_1.TodolistModule,
            mongoose_1.MongooseModule.forRoot('mongodb://localhost:27018/todo-list'),
            config_1.ConfigModule.forRoot(),
            common_module_1.CommonModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, tasklist_service_1.TaskListService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map