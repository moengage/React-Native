// Filename: src/internal/utils/JsonToModelMapper.ts
// Converts raw JSON objects (from parsed bridge payloads) into typed model instances.
import <ModelClass> from '../../model/<ModelClass>';
import <EnumName> from '../../model/enums/<EnumName>';

export function get<ModelClass>FromJson(json: { [k: string]: any }): <ModelClass> {
    const <field1> = json["<contractField1>"] as <Type1>;
    const <field2> = get<NestedModel>FromJson(json["<contractField2>"]);
    return new <ModelClass>(<field1>, <field2>);
}

export function get<EnumName>ByValue(value: string): <EnumName> {
    return (Object.values(<EnumName>) as string[]).includes(value)
        ? value as <EnumName>
        : <EnumName>.<DEFAULT_VALUE>;
}
