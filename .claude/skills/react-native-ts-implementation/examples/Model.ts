// Filename: src/model/<ModelName>.ts  — one file per entity from contract protos
/**
 * @since 1.0.0
 * @author <Your Name>
 */
class <ModelName> {
    <fieldName>: <Type>;
    // ... all fields from proto definition

    constructor(<fieldName>: <Type> /*, ...*/) {
        this.<fieldName> = <fieldName>;
    }
}

export default <ModelName>;
