import {Ajv} from 'ajv';
import {load} from 'js-yaml';
import fs from 'node:fs';

export const ajv = new Ajv({
  strict: true,
});
export type JSONSchema = Record<string, unknown>;

export function validateSchema<T extends object>(schema: JSONSchema, yaml: T): boolean {
  const valid = ajv.validate(schema, yaml);
  if (!valid) {
    throw new Error(ajv.errorsText());
  }
  return true;
}

export function getStringFromYamlFile(filePath: string) {
  return fs.readFileSync(filePath, 'utf8');
}

export function convertYamlStringToJson(yamlString: string) {
  // json: true option will parse YAML into a JSON object where duplicate keys are merged instead of throwing an error
  return load(yamlString, {json: true});
}

export function convertYamlFileToJson(filePath: string) {
  return convertYamlStringToJson(getStringFromYamlFile(filePath));
}
