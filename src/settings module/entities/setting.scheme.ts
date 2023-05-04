import { Prop, Schema, SchemaFactory }from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Setting extends Document {
    @Prop({ required: true, unique: true })
    setting_name: string;

    @Prop({ required: true, type: mongoose.Schema.Types.Mixed})
    setting_value: any

    @Prop({ required: true})
    setting_type: string
}

export type SettingDocument = Setting & Document;
export const SettingSchema = SchemaFactory.createForClass(Setting);