import Container from "./Container";
import TemplateType from "./enums/TemplateType";

/**
 * Card Template data.
 * 
 * @author Abhishek Kumar
 * @since 1.0.0
 */
class Template {

    /**
     * Type of Template.
     * @since 1.0.0
     */
    templateType: TemplateType;

    /**
     * Containers in the template.
     * @since 1.0.0
     */
    containers: Array<Container>;

    /**
     * Additional data associated to the template
     * @since 1.0.0
     */
    kvPairs: { [k: string]: any };

    constructor(templateType: TemplateType, containers: Array<Container>, kvPairs: { [k: string]: any }) {
        this.templateType = templateType;
        this.containers = containers;
        this.kvPairs = kvPairs;
    }
}

export default Template;