import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
//import { Exclude } from 'class-transformer';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true })
    //TODO: @Exclude()
    password: string;

    @Prop()
    name: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);