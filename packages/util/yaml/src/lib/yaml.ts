import {Ajv} from 'ajv';
import addFormats from 'ajv-formats';
import localizeEn from 'ajv-i18n/localize/en';
import localizeJa from 'ajv-i18n/localize/ja';
import {dump, load} from 'js-yaml';
import fs from 'node:fs';

export const ajv = new Ajv({
  allErrors: true,
  strict: 'log',
});

addFormats(ajv);

export function isValidYaml(yaml: string): boolean {
  try {
    load(yaml);
    return true;
  } catch {
    return false;
  }
}

export type JSONSchema = Record<string, unknown>;

export function validateSchema<T extends object>(schema: JSONSchema, yaml: T): boolean {
  const valid = ajv.validate(schema, yaml);
  if (!valid) {
    throw new Error(ajv.errorsText());
  }
  return true;
}

export function getSchemaErrors<T extends object>(schema: JSONSchema, yaml: T, language: string): readonly string[] {
  const validate = ajv.compile(schema);
  const valid = validate(yaml);
  if (valid) {
    return [];
  }
  switch (language) {
    case 'ja':
      localizeJa(validate.errors);
      break;
    default:
      localizeEn(validate.errors);
  }
  return validate.errors?.map((error) => `${error.instancePath} ${error.message}`) ?? [];
}

export function getStringFromYamlFile(filePath: string): string {
  return fs.readFileSync(filePath, 'utf8');
}

export function convertYamlStringToJson<T = JSONSchema>(yamlString: string): T {
  return load(yamlString) as T;
}

export function convertYamlFileToJson(filePath: string) {
  return convertYamlStringToJson(getStringFromYamlFile(filePath));
}

export function convertJsonToYaml(jsonObject: object) {
  try {
    return dump(jsonObject);
  } catch (error) {
    throw new Error(`Error converting JSON to YAML: ${error}`);
  }
}

/**
 * Recursively sorts object keys alphabetically, but preserves array order
 */
function sortKeysRecursively(obj: unknown): unknown {
  if (obj === null || typeof obj !== 'object' || obj instanceof Date) {
    return obj;
  }

  if (Array.isArray(obj)) {
    // For arrays, only sort the keys of objects within the array, don't reorder the array itself
    return obj.map(sortKeysRecursively);
  }

  const sortedObj: Record<string, unknown> = {};
  const keys = Object.keys(obj as Record<string, unknown>).sort();

  for (const key of keys) {
    sortedObj[key] = sortKeysRecursively((obj as Record<string, unknown>)[key]);
  }

  return sortedObj;
}

/**
 * Normalizes a YAML string to have ordered keys and consistent indentation and quoting.
 *
 * @param yamlString - The YAML string to normalize
 * @returns The normalized YAML string with sorted keys and consistent formatting
 * @throws {Error} If the YAML string is invalid and cannot be parsed
 */
export function normalizeYaml(yamlString: string): string {
  try {
    // Parse the YAML
    const parsed = load(yamlString);

    // Sort keys recursively
    const sorted = sortKeysRecursively(parsed);

    // Re-serialize with consistent formatting
    const normalized = dump(sorted, {
      indent: 2,
      noRefs: true, // Don't use references
      sortKeys: false, // We already sorted manually
    });

    return normalized;
  } catch (error) {
    // If parsing fails, throw the error for the caller to handle
    throw new Error(`Failed to normalize YAML: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Utility function to format YAML with consistent styling
 * @param yamlContent - The YAML content to format
 * @returns Formatted YAML string
 */
export function formatYaml(yamlContent: unknown): string {
  const yamlString = convertJsonToYaml(yamlContent as object);
  return yamlString.replace(/: >-?\n/g, ': |\n').trim();
}
