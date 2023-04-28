
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
//import { ObjectId } from "typeorm"; //TODO: Not nessesary

@Injectable()
//TODO: fixthis
export class ValidateMongoId implements PipeTransform<string> {
    
    transform(value: string, metadata: ArgumentMetadata): string { // Optional casting into ObjectId if wanted!
        return value;
        /*     if (ObjectId.isValid(value)) {
            if ((String)(new ObjectId(value)) === value)
                return value;
            throw new BadRequestException
        }
        throw new BadRequestException
 */
    };
}