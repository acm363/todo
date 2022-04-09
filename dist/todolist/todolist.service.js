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
exports.TodolistService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const todo_entity_1 = require("./entities/todo.entity");
const task_entity_1 = require("./entities/task.entity");
let TodolistService = class TodolistService {
    constructor(todoModel, taskModel) {
        this.todoModel = todoModel;
        this.taskModel = taskModel;
    }
    findAll() {
        return this.todoModel.find().populate('task').exec();
    }
    async findOne(id) {
        const todo = await this.todoModel.find({ id_: id }).populate('task').exec();
        if (!todo) {
            throw new common_1.NotFoundException(`Todo #${id} not found in the database!`);
        }
        return todo;
    }
    async createTask(task_title) {
        console.log('création des tâches');
        const task = new this.taskModel({
            title: task_title,
            status: task_entity_1.TaskStatus.TODO,
        });
        return task.save();
    }
    async create(createTodoDto) {
        console.log('tentative de création');
        const task = await this.createTask(createTodoDto.task);
        console.log(`task : ${task}`);
        const todo = new this.todoModel({
            title: createTodoDto.title,
            task: task._id,
            createdAt: new Date().toISOString(),
        });
        if (todo) {
            console.log(`\t création ok!`);
        }
        return todo.save();
    }
    async update(id, updateTodoDto) {
        console.log(`existing : ${updateTodoDto}`);
        const existingTodo = await this.todoModel
            .findByIdAndUpdate({ _id: id }, { $set: updateTodoDto }, { new: true })
            .exec();
        if (!existingTodo) {
            throw new common_1.NotFoundException(`Todo #${id} not found in the database`);
        }
        return existingTodo;
    }
    async remove(id) {
        const todo = await this.todoModel.findOneAndDelete({ id_: id }).exec();
        if (!todo) {
            throw new common_1.NotFoundException(`Todo #${id} not found in the database`);
        }
        return todo;
    }
    removeAll() {
        return this.todoModel.deleteMany();
    }
};
TodolistService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(todo_entity_1.Todo.name)),
    __param(1, (0, mongoose_1.InjectModel)(task_entity_1.Task.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], TodolistService);
exports.TodolistService = TodolistService;
//# sourceMappingURL=todolist.service.js.map