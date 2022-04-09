import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export declare class Todo extends Document {
    title: string;
    task: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
}
export declare const TodoSchema: mongoose.Schema<Todo, mongoose.Model<Todo, any, any, any>, {}, {}>;
