import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import type { ZodSchema } from "zod";


@Injectable()
export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodSchema) {}

    transform(value: any) {
        const result = this.schema.safeParse(value);
        
        if(!result.success) {
            const messages = result.error.issues.map((err) => ({
                field: err.path.join('.'),
                message: err.message,
              }));
            throw new BadRequestException(messages);
        }

        return result.data;
    }
}