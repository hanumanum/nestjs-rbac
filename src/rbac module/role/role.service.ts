import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRoleDto as CreateDto } from './dto/create.role.dto';
import { UpdateRoleDto as UpdateDto } from './dto/update.role.dto';
import { IService, TupleErrorOrData } from '../../common/interfaces/service.interface';
import { PageOptionsDto, TypeErrorOrPageDtoTuple } from '../../common/dtos';
import { errorLogger } from '../../utils/logger.utils';
import { listMongoCollectionWithPagination } from '../../utils/mongo.utils';
import { Role as Entity, RoleDocument as MongoDocument } from './entities/role.scheme';
import { TypeMongoId } from '../../common/types.common';

type searchKeys = keyof typeof Entity.prototype;

@Injectable()
export class RoleService implements IService {
    constructor(
        @InjectModel(Entity.name, "nestrbac")
        private readonly model: Model<MongoDocument>
    ) { }

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
            const [error, data] = await listMongoCollectionWithPagination(this.model, pageOptionsDto, findFields);
            
            if (error)
                return [error, null]

            return [null, data]
        }
        catch (err) {
            errorLogger(err)
            return [err, null]
        }
    }

    async one(id: string): TupleErrorOrData<MongoDocument> {
        try {
            const document = await this.model.findById(id).exec();
            return [null, document]
        }
        catch (err) {
            errorLogger(err)
            return [err, null]
        }
    }

    async many(ids: TypeMongoId[]): TupleErrorOrData<MongoDocument[]> {
        try {
            const documents = await this.model.find({ "_id": { $in: ids } }).exec();
            return [null, documents]
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
