import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument, UserSchema } from './entities/user.scheme';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { IService, TupleErrorOrData } from '../common/interfaces/service.interface';
import { PageDto, PageMetaDto, PageOptionsDto, TypeErrorOrPageDtoTuple } from '../common/dtos';
import { errorLogger } from '../utils/logger.utils';

type searchKeys = keyof typeof User.prototype;

@Injectable()
export class UsersService implements IService {
    constructor(@InjectModel(User.name, "nestrbam") private readonly model: Model<UserDocument>) { }

    async create(createDto: CreateUserDto): TupleErrorOrData<UserDocument> {
        try {
            const createdUser = new this.model(createDto);
            const userDoc = await createdUser.save();
            return [null, userDoc];
        }
        catch (err) {
            errorLogger(err)
            return [err, null];
        }
    }

    async list(pageOptionsDto: PageOptionsDto, findFields: searchKeys[] = []): TypeErrorOrPageDtoTuple<UserDocument> {
        try {
            const whereConditionOr = {
                $or: findFields.map((field) => {
                    return { [field]: { $regex: pageOptionsDto.filter, $options: 'i' } }
                })
            }

            const itemCount = await this.model.count(whereConditionOr).exec();
            const usersList = await this.model
                .find()
                .where(whereConditionOr)
                .skip(pageOptionsDto.skip)
                .limit(pageOptionsDto.take)
                .sort({ createdAt: pageOptionsDto.order })
                .exec();

            const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
            const pageDto = new PageDto(usersList, pageMetaDto);

            return [null, pageDto]
        }
        catch (err) {
            errorLogger(err)
            return [err, null]
        }

    }

    async one(id: string): TupleErrorOrData<UserDocument> {
        try {
            const document = await this.model.findById(id).exec();
            return [null, document]
        }
        catch (err) {
            errorLogger(err)
            return [err, null]
        }
    }

    async remove(id: string): TupleErrorOrData<boolean> {
        try {
            await this.model.findByIdAndDelete(id).exec();
            return [null, true]
        }
        catch (err) {
            errorLogger(err)
            return [err, null]
        }
    }

    async update(id: string, updateDto: UpdateUserDto): TupleErrorOrData<UserDocument> {
        try {
            const document = await this.model.findById(id).exec();
            await document.updateOne(updateDto);
            return [null, document]
        }
        catch (error) {
            errorLogger(error)
            return [error, null]
        }
    }

}
