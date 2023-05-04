import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TypeRoutePersmission } from '../../../common/types.common';

@Schema({ timestamps: true })
export class Role extends Document {
    @Prop({ required: true, unique: true })
    title: string;

    @Prop({ required: true})
    permissions: TypeRoutePersmission[]
}

export type RoleDocument = Role & Document;
export const RoleSchema = SchemaFactory.createForClass(Role);