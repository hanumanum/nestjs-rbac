import { Types } from "mongoose";

export type TypeAvliableMethods = 'get' | 'post' | 'put' | 'delete' | 'patch';

export type TypeRoutePersmission = {
    route: string;
    method: TypeAvliableMethods;
}

export type TypeMongoId = Types.ObjectId; 