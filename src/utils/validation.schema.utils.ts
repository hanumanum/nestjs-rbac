import { targetConstructorToSchema } from 'class-validator-jsonschema';
//const validationSchemas = validationMetadatasToSchemas();

export const getValidationSchemaJSON = (dto?: Function) => {
    const schema = targetConstructorToSchema(dto)
    return schema
} 
