import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
//import { Exclude } from 'class-transformer';
import { Document } from 'mongoose';
import { RoleDocument, Role } from '../../role/entities/role.scheme';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true })
    //TODO: @Exclude()
    password: string;

    @Prop()
    name: string;

    @Prop({
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: Role.name }],
    })
    @Type(() => Role)
    roles: Role[];
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);