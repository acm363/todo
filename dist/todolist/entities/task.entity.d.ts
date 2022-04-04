/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/schemaoptions" />
import { Document } from 'mongoose';
export declare class Task extends Document {
    taskId: number;
    title: string;
    description: string;
    status: TaskStatus;
}
export declare const TaskSchema: import("mongoose").Schema<Task, import("mongoose").Model<Task, any, any, any>, {}, {}>;
export declare enum TaskStatus {
    Active = "Active",
    NotStarted = "Not Started",
    Completed = "Completed"
}
