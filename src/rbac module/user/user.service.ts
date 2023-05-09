import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User as Entity, UserDocument as MongoDocument, UserDocument } from './entities/user.scheme';
import { CreateUserDto as CreateDto } from './dto/create.user.dto';
import { UpdateUserDto as UpdateDto } from './dto/update.user.dto';
import { IService, TupleErrorOrData } from '../../common/interfaces/service.interface';
import { PageOptionsDto, TypeErrorOrPageDtoTuple } from '../../common/dtos';
import { errorLogger } from '../../utils/logger.utils';
import { listMongoCollectionWithPagination } from '../../utils/mongo.utils';
import { hashCompare } from '../../utils/encryption.utils';
import { CheckUserDto } from './dto/check.user.dto';

type searchKeys = keyof typeof Entity.prototype;

@Injectable()
export class UsersService implements IService {
    constructor(@InjectModel(Entity.name, "nestrbac") private readonly model: Model<MongoDocument>) { }

    async create(createDto: CreateDto): TupleErrorOrData<MongoDocument> {
        try {
            const document = new this.model(createDto);
            const userDoc = await document.save();
            return [null, userDoc];
        }
        catch (err) {
            errorLogger(err)
            return [err, null];
        }
    }

    async list(pageOptionsDto: PageOptionsDto, findFields: searchKeys[] = []): TypeErrorOrPageDtoTuple<MongoDocument> {
        try {
            const [error, data] = await listMongoCollectionWithPagination(this.model, pageOptionsDto, findFields, ["roles"]);
            if (error)
                return [error, null]

            return [null, data]

        }
        catch (err) {
            errorLogger(err)
            return [err, null]
        }
    }

    async oneByUsername(username: string): TupleErrorOrData<MongoDocument> {
        try{
            const user = await this.model.findOne({username: username}).populate("roles").exec();
            return [null, user]
        }
        catch(err){
            errorLogger(err)
            return [err, null]
        }
    }

    async one(id: string): TupleErrorOrData<MongoDocument> {
        try {
            const document = await this.model.findById(id).populate("roles").exec();
            return [null, document]
        }
        catch (err) {
            errorLogger(err)
            return [err, null]
        }
    }

    //TODO: probably not needed
    async checkPassowrd(checkPassowrd: CheckUserDto): TupleErrorOrData<boolean> {
        try {
            const document = await this.model.findOne({ username: checkPassowrd.username }).exec();
            if (!document)
                return [null, false]

            const isSame = await hashCompare(checkPassowrd.password, document.password)
            return [null, isSame]
        }
        catch (error) {
            errorLogger(error)
            return [error, false]
        }

    }

    async checkUserPassword(checkPassowrd: CheckUserDto): TupleErrorOrData<UserDocument> {
        try {
            const document = await this.model
                .findOne({ username: checkPassowrd.username })
                .populate("roles")
                .exec();

            if (!document)
                return [null, null]

            const isSame = await hashCompare(checkPassowrd.password, document.password)
            
            return (isSame) ? [null, document] : [null, null]
        }
        catch (error) {
            errorLogger(error)
            return [error, null]
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

    async update(id: string, updateDto: UpdateDto): TupleErrorOrData<MongoDocument> {
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
