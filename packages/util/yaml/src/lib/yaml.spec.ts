import path from 'node:path';

import {
  convertJsonToYaml,
  convertYamlFileToJson,
  convertYamlStringToJson,
  formatYaml,
  getSchemaErrors,
  getStringFromYamlFile,
  normalizeYaml,
  validateSchema,
} from './yaml';

describe('yaml', () => {
  describe(convertYamlStringToJson, () => {
    it('should convert a yaml string to json', () => {
      const yamlString = `
        name: test
        description: this is a test
      `;
      const expectedJson = {
        name: 'test',
        description: 'this is a test',
      };
      expect(convertYamlStringToJson(yamlString)).toEqual(expectedJson);
    });
  });
  describe(convertYamlFileToJson, () => {
    it('should convert a yaml file to json', () => {
      const yamlFilePath = path.join(__dirname, 'mocks', 'test.yaml');
      const expectedJson = {
        name: 'test',
        description: 'this is a test',
      };
      expect(convertYamlFileToJson(yamlFilePath)).toEqual(expectedJson);
    });
  });

  describe(convertJsonToYaml, () => {
    it('should convert a json object to yaml', () => {
      const jsonObject = {
        name: 'test',
        description: 'this is a test',
      };
      const expectedYamlString = `
name: test
description: this is a test`;
      expect(convertJsonToYaml(jsonObject)?.trim()).toBe(expectedYamlString.trim());
    });
  });
  describe(getStringFromYamlFile, () => {
    it('should read a yaml file and return its content as a string', () => {
      const yamlFilePath = path.join(__dirname, 'mocks', 'test.yaml');
      const expectedYamlString = `
name: test
description: this is a test
      `;
      expect(getStringFromYamlFile(yamlFilePath).trim()).toBe(expectedYamlString.trim());
    });
  });

  describe(validateSchema, () => {
    it('should validate a yaml file against a schema', () => {
      const schema = convertYamlFileToJson(path.join(__dirname, 'mocks', 'testSchema.yaml'));
      const validYaml = convertYamlFileToJson(path.join(__dirname, 'mocks', 'validTest.yaml'));
      expect(validateSchema(schema, validYaml)).toBe(true);
    });
    it('should throw an error for invalid yaml with non integer age', () => {
      const schema = convertYamlFileToJson(path.join(__dirname, 'mocks', 'testSchema.yaml'));
      const invalidYaml = convertYamlFileToJson(path.join(__dirname, 'mocks', 'invalidTest.yaml'));
      expect(() => validateSchema(schema, invalidYaml)).toThrowError('data/age must be integer');
    });
  });

  describe('getSchemaErrors', () => {
    const schema = `
type: object
properties:
  name:
    type: string
  age:
    type: integer
required:
  - name
  - age`;
    it('should return an empty array for valid yaml', () => {
      const validYaml = `
name: test
age: 30`;
      expect(getSchemaErrors(convertYamlStringToJson(schema), convertYamlStringToJson(validYaml), 'en')).toEqual([]);
    });
    it('should return an array of errors for invalid yaml', () => {
      const invalidYaml = `
name: test
age: "thirty"`;
      expect(getSchemaErrors(convertYamlStringToJson(schema), convertYamlStringToJson(invalidYaml), 'en')).toEqual([
        '/age must be integer',
      ]);
    });
  });

  describe('normalizeYaml', () => {
    it('normalizes different key orders to the same result', () => {
      const version1 = `c: 3
a: 1
b: 2`;

      const version2 = `a: 1
b: 2
c: 3`;

      const version3 = `b: 2
c: 3
a: 1`;

      const normalized1 = normalizeYaml(version1);
      const normalized2 = normalizeYaml(version2);
      const normalized3 = normalizeYaml(version3);

      // All should normalize to the same result
      expect(normalized1).toBe(normalized2);
      expect(normalized2).toBe(normalized3);
    });

    it('normalizes nested objects with different key orders', () => {
      const version1 = `parent:
  z: 3
  a: 1
  b: 2
other: value`;

      const version2 = `other: value
parent:
  a: 1
  b: 2
  z: 3`;

      const normalized1 = normalizeYaml(version1);
      const normalized2 = normalizeYaml(version2);

      expect(normalized1).toBe(normalized2);
    });

    it('preserves array order while normalizing object keys within array items', () => {
      // Same array order, different key orders within objects - should normalize to same result
      const version1 = `items:
  - name: third
    value: 3
  - name: first
    value: 1
  - name: second
    value: 2`;

      // Same array order, different key orders within objects (value and name swapped) - should normalize to same result
      const version2 = `items:
  - value: 3
    name: third
  - value: 1
    name: first
  - value: 2
    name: second`;

      // Different array order - should NOT normalize to same result
      const version3 = `items:
  - name: first
    value: 1
  - name: third
    value: 3
  - name: second
    value: 2`;

      const normalized1 = normalizeYaml(version1);
      const normalized2 = normalizeYaml(version2);
      const normalized3 = normalizeYaml(version3);

      // Same array order with different object key orders should normalize to same result
      expect(normalized1).toBe(normalized2);

      // Different array order should NOT normalize to same result
      expect(normalized1).not.toBe(normalized3);
      expect(normalized2).not.toBe(normalized3);
    });

    it('normalizes mixed data types with different key orders', () => {
      const version1 = `string: hello
number: 42
boolean: true
null_value: null
array: [1, 2, 3]
object:
  nested: value`;

      const version2 = `object:
  nested: value
array: [1, 2, 3]
null_value: null
boolean: true
number: 42
string: hello`;

      const normalized1 = normalizeYaml(version1);
      const normalized2 = normalizeYaml(version2);

      expect(normalized1).toBe(normalized2);
    });

    it('handles deeply nested objects with different key orders', () => {
      const version1 = `level1:
  level2:
    level3:
      level4:
        z: 3
        a: 1
        b: 2`;

      const version2 = `level1:
  level2:
    level3:
      level4:
        a: 1
        b: 2
        z: 3`;

      const normalized1 = normalizeYaml(version1);
      const normalized2 = normalizeYaml(version2);

      expect(normalized1).toBe(normalized2);
    });

    it('throws error for invalid YAML', () => {
      const invalidYaml = 'invalid: yaml: content: [';

      // Should throw an error when parsing fails
      expect(() => normalizeYaml(invalidYaml)).toThrow('Failed to normalize YAML:');
    });

    it('handles empty string', () => {
      const result = normalizeYaml('');

      expect(result).toBe('');
    });

    it('normalizes different quote styles to consistent format', () => {
      const version1 = `string1: "hello"
string2: 'world'
string3: unquoted`;

      const version2 = `string1: hello
string2: world
string3: unquoted`;

      const normalized1 = normalizeYaml(version1);
      const normalized2 = normalizeYaml(version2);

      expect(normalized1).toBe(normalized2);
    });
  });

  describe('formatYaml', () => {
    it('formats YAML with consistent multi-line string styling', () => {
      const yamlContent = {
        name: 'test',
        description: 'This is a\nmulti-line string',
        items: ['item1', 'item2'],
      };

      const result = formatYaml(yamlContent);

      expect(result).toContain(': |');
      expect(result).not.toContain(': >');
      expect(result).not.toContain(': >-');
    });

    it('should format simple objects correctly', () => {
      const input = {
        name: 'test',
        description: 'A test description',
      };

      const result = formatYaml(input);
      expect(result).toContain('name: test');
      expect(result).toContain('description: A test description');
    });

    it('should handle nested objects', () => {
      const input = {
        product: {
          name: 'nested-product',
          metadata: {
            version: '1.0',
          },
        },
      };

      const result = formatYaml(input);
      expect(result).toContain('product:');
      expect(result).toContain('name: nested-product');
      expect(result).toContain('metadata:');
      expect(result).toContain("version: '1.0'");
    });

    it('should handle arrays correctly', () => {
      const input = {
        tags: ['production', 'analytics', 'data'],
        numbers: [1, 2, 3],
      };

      const result = formatYaml(input);
      expect(result).toContain('tags:');
      expect(result).toContain('- production');
      expect(result).toContain('- analytics');
      expect(result).toContain('- data');
      expect(result).toContain('numbers:');
      expect(result).toContain('- 1');
      expect(result).toContain('- 2');
      expect(result).toContain('- 3');
    });

    it('handles objects with various data types', () => {
      const yamlContent = {
        string: 'hello',
        number: 42,
        boolean: true,
        array: [1, 2, 3],
        object: {
          nested: 'value',
        },
      };

      const result = formatYaml(yamlContent);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should handle empty objects and arrays', () => {
      expect(formatYaml({})).toBe('{}');
      expect(formatYaml([])).toBe('[]');
    });

    it('handles null and undefined values', () => {
      const yamlContent = {
        nullValue: null,
        undefinedValue: undefined,
      };

      const result = formatYaml(yamlContent);

      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });
  });
});
