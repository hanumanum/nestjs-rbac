import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class File {
    @Prop({ required: true, unique: true })
    file_name: string;

    @Prop({ required: true, unique: true })
    file_url: string
}

export type FileDocument = File & Document;
export const FileSchema = SchemaFactory.createForClass(File);