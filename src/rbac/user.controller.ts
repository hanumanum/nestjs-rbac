import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, Version } from '@nestjs/common';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { UsersService } from './user.service';
import { PageOptionsDto } from '../common/dtos';
import { ResponseHandlerService } from '../utils/response.handler.utils';
import { ApiTags } from '@nestjs/swagger';
import {ValidateMongoIdPipe} from '../utils/mongo.utils';

@Controller('user')
@ApiTags('User Management')
export class UserController {
    private readonly entityTitle = 'user';
    constructor(private readonly service: UsersService, private readonly messageHandler: ResponseHandlerService) { }

    @Get()
    @Version("1")
    async list(@Res() res, @Query() pageOptionsDto: PageOptionsDto) {
        const [error, pageDto] = await this.service.list(pageOptionsDto, ['name', 'username']);

        if (error)
            return this.messageHandler.errorHandler(res, error, `cannot get ${this.entityTitle}s list`);

        return this.messageHandler.dataPaginatedHandler(res, pageDto)
    }

    @Get(':id')
    @Version("1")
    async one(@Res() res, @Param('id', ValidateMongoIdPipe) id: string) {
        const [error, user] = await this.service.one(id);
        if (error)
            return this.messageHandler.errorHandler(res, error, `cannot get ${this.entityTitle} details`);

        return this.messageHandler.dataHandler(res, user);
    }

    @Post()
    @Version("1")
    async create(@Res() res, @Body() createDto: CreateUserDto) {
        const [error] = await this.service.create(createDto);
        if (error)
            return this.messageHandler.errorHandler(res, error, `cannot create ${this.entityTitle}`);

        return this.messageHandler.createdHandler(res, `${this.entityTitle} created successfully`);
    }

    @Delete()
    @Version("1")
    async delete(@Res() res, @Query('id', ValidateMongoIdPipe) id: string) {
        const [error] = await this.service.remove(id);

        if (error)
            return this.messageHandler.errorHandler(res, error, `cannot delete ${this.entityTitle}`);

        return this.messageHandler.deletedHandler(res, `${this.entityTitle} deleted successfully`);
    }

    @Patch()
    @Version("1")
    async update(@Res() res, @Query('id', ValidateMongoIdPipe) id: string, @Body() updateDto: UpdateUserDto) {
        const [error] = await this.service.update(id, updateDto);

        if (error)
            return this.messageHandler.errorHandler(res, error, `cannot update ${this.entityTitle}`);

        return this.messageHandler.updatedHandler(res, `${this.entityTitle} updated successfully`);
    }

}