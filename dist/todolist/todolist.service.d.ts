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
import { Task } from './entities/task.entity';
export declare class TodolistService {
    private readonly todoModel;
    private readonly taskModel;
    constructor(todoModel: Model<Todo>, taskModel: Model<Task>);
    findAll(): Promise<Omit<Todo & {
        _id: any;
    }, never>[]>;
    findOne(id: string): Promise<Omit<Todo & {
        _id: any;
    }, never>[]>;
    createTask(task_title: string): Promise<Task & {
        _id: any;
    }>;
    create(createTodoDto: CreateTodoDto): Promise<Todo & {
        _id: any;
    }>;
    update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo & {
        _id: any;
    }>;
    remove(id: string): Promise<Todo & {
        _id: any;
    }>;
    removeAll(): import("mongoose").Query<import("mongodb").DeleteResult, Todo & {
        _id: any;
    }, {}, Todo>;
}
