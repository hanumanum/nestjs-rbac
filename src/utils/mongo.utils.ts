
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { PageDto, PageMetaDto } from '../common/dtos';
import { errorLogger } from "./logger.utils";
import mongoose from "mongoose";
//import { ObjectId } from "typeorm"; //TODO: Not nessesary

const isValidMongoId = (v) => mongoose.Types.ObjectId.isValid(v)
@Injectable()
export class ValidateMongoIdPipe implements PipeTransform<string> {
    transform(value: string, metadata: ArgumentMetadata): string { // Optional casting into ObjectId if wanted!
        if (isValidMongoId(value)) {
            return value;
        }
        
        throw new BadRequestException
        
    };
}

export const listMongoCollection = async (model, pageOptionsDto, findFields = []) => {
    try {
        const whereConditionOr = {
            $or: findFields.map((field) => {
                return { [field]: { $regex: pageOptionsDto.filter, $options: 'i' } }
            })
        }

        const itemCount = await model.count(whereConditionOr).exec();
        const usersList = await model
            .find()
            .where(whereConditionOr)
            .skip(pageOptionsDto.skip)
            .limit(pageOptionsDto.take)
            .sort({ createdAt: pageOptionsDto.order })
            .exec();

        const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
        const pageDto = new PageDto(usersList, pageMetaDto);

        return [null, pageDto];

    }
    catch (error) {
        errorLogger(error)
        return [error, null]
    }

}