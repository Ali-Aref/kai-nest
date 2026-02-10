import { plainToInstance } from 'class-transformer';
import { EnvironmentVariables } from './config.validation.dto';
import { validateSync } from 'class-validator';

export function validate(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validateConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validateConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const errorMessages = errors
      .map((err) => {
        const constraints = Object.values(err.constraints || {});
        return `${err.property}: ${constraints.join(', ')}`;
      })
      .join('\n');

    throw new Error(
      `Enviornment variables validation failed: ${errorMessages}`,
    );
  }

  return validateConfig;
}
