import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, Version } from '@nestjs/common';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { UsersService } from './user.service';
import { CheckUserDto } from './dto/check.user.dto';
import { PageOptionsDto } from '../common/dtos';
import { ResponseHandlerService } from '../utils/response.handler.utils';
import { ApiTags } from '@nestjs/swagger';
import { ValidateMongoIdPipe, documentToPureJSON } from '../utils/mongo.utils';
import { hashMake } from '../utils/encryption.utils';
import { EnumFieldsFilterMode, ObjectTransformerLib } from '../utils/object.transformers.lib';


@Controller('user')
@ApiTags('User Management')
export class UserController {
    private readonly entityTitle = 'user';
    constructor(private readonly service: UsersService, private readonly mh: ResponseHandlerService) { }

    @Get()
    @Version("1")
    async list(@Res() res, @Query() pageOptionsDto: PageOptionsDto) {
        const [error, pageDto] = await this.service.list(pageOptionsDto, ['name', 'username']);

        pageDto.data = documentToPureJSON(pageDto.data)
        const data = new ObjectTransformerLib(pageDto.data)
        pageDto.data = data.filterFields(EnumFieldsFilterMode.remove, ['password']).getData()

        if (error)
            return this.mh.errorHandler(res, error, `cannot get ${this.entityTitle}s list`);

        return this.mh.dataPaginatedHandler(res, pageDto)
    }

    @Get(':id')
    @Version("1")
    async one(@Res() res, @Param('id', ValidateMongoIdPipe) id: string) {
        const [error, user] = await this.service.one(id);

        const _user = documentToPureJSON(user)
        delete _user.password

        if (error)
            return this.mh.errorHandler(res, error, `cannot get ${this.entityTitle} details`);

        return this.mh.dataHandler(res, user);
    }

    @Post()
    @Version("1")
    async create(@Res() res, @Body() createDto: CreateUserDto) {
        createDto.password = await hashMake(createDto.password);

        const [error] = await this.service.create(createDto);
        if (error)
            return this.mh.errorHandler(res, error, `cannot create ${this.entityTitle}`);

        return this.mh.createdHandler(res, `${this.entityTitle} created successfully`);
    }

    @Delete()
    @Version("1")
    async delete(@Res() res, @Query('id', ValidateMongoIdPipe) id: string) {
        const [error] = await this.service.remove(id);

        if (error)
            return this.mh.errorHandler(res, error, `cannot delete ${this.entityTitle}`);

        return this.mh.deletedHandler(res, `${this.entityTitle} deleted successfully`);
    }

    @Patch()
    @Version("1")
    async update(@Res() res, @Query('id', ValidateMongoIdPipe) id: string, @Body() updateDto: UpdateUserDto) {
        if (updateDto.password)
            updateDto.password = await hashMake(updateDto.password);

        const [error] = await this.service.update(id, updateDto);

        if (error)
            return this.mh.errorHandler(res, error, `cannot update ${this.entityTitle}`);

        return this.mh.updatedHandler(res, `${this.entityTitle} updated successfully`);
    }

    @Post('checkuser')
    @Version("1")
    async checkUser(@Res() res, @Body() checkUserDto: CheckUserDto) {
        const [error, user] = await this.service.checkPassowrd(checkUserDto);
        if (error)
            return this.mh.errorHandler(res, error, `cannot get ${this.entityTitle} details`);

        return this.mh.dataHandler(res, user);
    }

}