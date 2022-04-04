/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose" />
import { TodolistService } from './todolist.service';
import { CreateTodoDto } from './dto/create-todo.dto';
export declare class TodolistController {
    private readonly todolistService;
    constructor(todolistService: TodolistService);
    findAll(): Promise<(import("./entities/todo.entity").Todo & {
        _id: any;
    })[]>;
    findOne(todoId: number): Promise<(import("./entities/todo.entity").Todo & {
        _id: any;
    })[]>;
    create(createTodoDto: CreateTodoDto): Promise<import("./entities/todo.entity").Todo & {
        _id: any;
    }>;
    remove(todoId: number): Promise<import("./entities/todo.entity").Todo & {
        _id: any;
    }>;
    removeAll(): import("mongoose").Query<import("mongodb").DeleteResult, import("./entities/todo.entity").Todo & {
        _id: any;
    }, {}, import("./entities/todo.entity").Todo>;
}
