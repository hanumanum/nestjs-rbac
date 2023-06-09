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
import { hashCompare, hashMake } from '../../utils/encryption.utils';
import { CheckUserDto } from './dto/check.user.dto';
import { Role as RoleEntity } from '../role/entities/role.scheme';
import { ConfigService } from '@nestjs/config';
import { defaultRoleTitle } from '../common/default.role';

type searchKeys = keyof typeof Entity.prototype;

@Injectable()
export class UsersService implements IService {
    constructor(
        @InjectModel(Entity.name, "nestrbac") private readonly model: Model<MongoDocument>,
        @InjectModel(RoleEntity.name, "nestrbac") private readonly rolesModel: Model<MongoDocument>,
        private readonly configService: ConfigService
    ) { }

    async create(createDto: CreateDto): TupleErrorOrData<MongoDocument> {
        try {
            createDto.password = await hashMake(createDto.password);
            
            const document = new this.model(createDto);

            if (this.configService.get("IS_FIRST_RUN") === "true") {
                const count = await this.model.countDocuments().exec();
                if (count === 0) {
                    const roleSuperadmin = await this.rolesModel.create({
                        title: "superadmin",
                        isEmailVerifyed: true,
                        permissions: ["*"]
                    })
                    document.roles = [roleSuperadmin._id]

                    await this.rolesModel.create({
                        title: defaultRoleTitle,
                        permissions: []
                    })

                }
            }

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
        try {
            const user = await this.model.findOne({ username: username }).populate("roles").exec();
            return [null, user]
        }
        catch (err) {
            errorLogger(err)
            return [err, null]
        }
    }

    async oneByEmail(email: string): TupleErrorOrData<MongoDocument> {
        try {
            const user = await this.model.findOne({ email: email }).exec();
            return [null, user]
        }
        catch (err) {
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


    async oneByUUID(uuid: string): TupleErrorOrData<MongoDocument> {
        try {
            const user = await this.model.findOne({ emailVerificationUUID: uuid }).exec();
            if (!user)
                return [null, null]

            return [null, user]
        } catch (error) {
            errorLogger(error)
            return [error, null]
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
            if(updateDto.password){
                updateDto.password = await hashMake(updateDto.password);
            }

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
