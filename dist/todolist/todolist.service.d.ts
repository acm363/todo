/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/schemaoptions" />
import { Model } from 'mongoose';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
export declare class TodolistService {
    private readonly todoModel;
    constructor(todoModel: Model<Todo>);
    findAll(): Promise<(Todo & {
        _id: any;
    })[]>;
    findOne(id: number): Promise<(Todo & {
        _id: any;
    })[]>;
    create(createTodoDto: CreateTodoDto): Promise<Todo & {
        _id: any;
    }>;
    update(id: number, updateTodoDto: UpdateTodoDto): Promise<Todo & {
        _id: any;
    }>;
    remove(id: number): Promise<Todo & {
        _id: any;
    }>;
    removeAll(): import("mongoose").Query<import("mongodb").DeleteResult, Todo & {
        _id: any;
    }, {}, Todo>;
}
