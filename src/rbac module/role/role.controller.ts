import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Res, Version } from '@nestjs/common';
import { CreateRoleDto as CreateDto } from './dto/create.role.dto';
import { UpdateRoleDto as UpdateDto } from './dto/update.role.dto';
import { RoleService as PrimaryService } from './role.service';
import { PageOptionsDto } from '../../common/dtos';
import { ResponseHandlerService } from '../../utils/response.handler.utils';
import { ApiTags } from '@nestjs/swagger';
import { ValidateMongoIdPipe } from '../../utils/mongo.utils';
import { ConfigService } from '@nestjs/config';
import { EnumFieldsFilterMode } from '../../utils/object.utils';
import { ObjectTransformerLib } from '../../utils/object.transformers.lib';

@Controller('role')
@ApiTags('Role Management')
export class RoleController {
    private readonly entityTitle = 'role';
    constructor(
        private readonly configService: ConfigService,
        private readonly service: PrimaryService,
        private readonly rhService: ResponseHandlerService
    ) { }

    @Get('page')
    @Version("1")
    async list(@Res() res, @Query() pageOptionsDto: PageOptionsDto) {
        const [error, pageDto] = await this.service.list(pageOptionsDto, ['title']);

        if (error)
            return this.rhService.errorHandler(res, error, `cannot get ${this.entityTitle}s list`);

        return this.rhService.dataPaginatedHandler(res, pageDto)
    }

    @Get('routes')
    @Version("1")
    async routes(@Res() res) {
        return res.json(global.routesList)
    }

    @Get(':id')
    @Version("1")
    async one(@Res() res, @Param('id', ValidateMongoIdPipe) id: string) {
        const [error, user] = await this.service.one(id);

        if (error)
            return this.rhService.errorHandler(res, error, `cannot get ${this.entityTitle} details`);

        if (!user) {
            return this.rhService.notFoundHandler(res, `${this.entityTitle}`)
        }

        const _user = new ObjectTransformerLib(user)
            .mongoToPureJSON()
            .filterFields(EnumFieldsFilterMode.remove, ['password'])
            .getData()

        return this.rhService.dataHandler(res, _user);
    }

    @Put()
    @Version("1")
    async create(@Res() res, @Body() createDto: CreateDto) {
        const [error] = await this.service.create(createDto);
        if (error)
            return this.rhService.errorHandler(res, error, `cannot create ${this.entityTitle}`);

        return this.rhService.createdHandler(res, `${this.entityTitle} created successfully`);
    }

    @Delete(':id')
    @Version("1")
    async delete(@Res() res, @Param('id', ValidateMongoIdPipe) id: string) {
        const [error] = await this.service.remove(id);

        if (error)
            return this.rhService.errorHandler(res, error, `cannot delete ${this.entityTitle}`);

        return this.rhService.deletedHandler(res, `${this.entityTitle}`);
    }

    @Patch(':id')
    @Version("1")
    async update(@Res() res, @Param('id', ValidateMongoIdPipe) id: string, @Body() updateDto: UpdateDto) {
        const [error] = await this.service.update(id, updateDto);

        if (error)
            return this.rhService.errorHandler(res, error, `cannot update ${this.entityTitle}`);

        return this.rhService.updatedHandler(res, `${this.entityTitle} updated successfully`);
    }

}