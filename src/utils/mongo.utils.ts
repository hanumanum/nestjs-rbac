
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { PageDto, PageMetaDto } from '../common/dtos';
import { errorLogger } from "./logger.utils";
import mongoose from "mongoose";

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

export const listMongoCollectionWithPagination = async (model, pageOptionsDto, findFields = [], relations: string[] = []) => {
    try {

        const whereConditionOr = {
            $or: findFields.map((field) => {
                return { [field]: { $regex: pageOptionsDto.filter, $options: 'i' } }
            })
        }

        const itemCount = await model.count(whereConditionOr).exec();
        const dongoDocumentsList = await model
            .find()
            .populate(relations)
            .where(whereConditionOr)
            .skip(pageOptionsDto.skip)
            .limit(pageOptionsDto.take)
            .sort({ createdAt: pageOptionsDto.order })
            .exec();


        const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
        const pageDto = new PageDto(dongoDocumentsList, pageMetaDto);

        return [null, pageDto];

    }
    catch (error) {
        errorLogger(error)
        return [error, null]
    }

}