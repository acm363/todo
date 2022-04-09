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
import { UpdateTodoDto } from './dto/update-todo.dto';
export declare class TodolistController {
    private readonly todolistService;
    constructor(todolistService: TodolistService);
    findAll(): Promise<Omit<import("./entities/todo.entity").Todo & {
        _id: any;
    }, never>[]>;
    findOne(id: string): Promise<Omit<import("./entities/todo.entity").Todo & {
        _id: any;
    }, never>[]>;
    create(createTodoDto: CreateTodoDto): Promise<import("./entities/todo.entity").Todo & {
        _id: any;
    }>;
    update(id: string, updateTodoDto: UpdateTodoDto): Promise<import("./entities/todo.entity").Todo & {
        _id: any;
    }>;
    remove(id: string): Promise<import("./entities/todo.entity").Todo & {
        _id: any;
    }>;
    removeAll(): import("mongoose").Query<import("mongodb").DeleteResult, import("./entities/todo.entity").Todo & {
        _id: any;
    }, {}, import("./entities/todo.entity").Todo>;
}
