import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function StringNotContains(
  prop: string[],
  validationOptions?: ValidationOptions,
) {
  return function(object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'stringNotContains',
      async: true,
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          return new Promise(ok => {
            for (const word of prop) {
              const match = value.toLowerCase().includes(word.toLowerCase());

              if (match) {
                return ok(false);
              }
            }

            return ok(true);
          });
        },
      },
    });
  };
}
