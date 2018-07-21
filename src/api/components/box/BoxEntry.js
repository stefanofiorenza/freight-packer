import { SupportsStacking, RotationConstraint, TranslationConstraint } from "./PackingProperty";
import Dimensions from "./Dimensions";
import TextField from "../common/TextField";
import CargoEntry from "../common/CargoEntry";

/**
 * @typedef {Object} BoxEntryProperties
 * @property {SupportsStacking} stacking
 * @property {RotationConstraint} rotation
 * @property {TranslationConstraint} translation
 */

var numEntries = 0;
function getDefaultLabel(){
    return 'Box ' + numEntries.toString();
}

class BoxEntry extends CargoEntry {
    constructor(){
        numEntries++;

        super();
        this.type = 'BoxEntry';

        this.dimensions = new Dimensions(0, 0, 0);

        this.weight = 0;
        this.quantity = 1;
        
        /**
         * @type {BoxEntryProperties}
         */
        this.properties;

        this.properties.stacking    = new SupportsStacking();
        this.properties.rotation    = new RotationConstraint();
        this.properties.translation = new TranslationConstraint();
        
        this.descriptions.set('label', new TextField('label', getDefaultLabel()));
    }

    Reset(){
        this.active = false;

        this.weight = 0;
        this.quantity = 1;

        this.properties.stacking.Reset();
        this.properties.rotation.Reset();
        this.properties.translation.Reset();

        var label = this.descriptions.get('label');
        label.content = TextField.defaultContent;
        this.descriptions.clear();
        this.descriptions.set('label', label);
    }

    /**
     * @param {BoxEntry} entry 
     */
    Copy(entry){
        this.active = entry.active;
        this.dimensions.Copy(entry.dimensions);
        this.weight = entry.weight;
        this.quantity = entry.quantity;

        this.properties.stacking.Copy(entry.properties.stacking);
        this.properties.rotation.Copy(entry.properties.rotation);
        this.properties.translation.Copy(entry.properties.translation);

        for(var [key, field] of entry.descriptions){
            let own = this.descriptions.get(key);
            if(own)
                own.Copy(field);
            else
                this.descriptions.set(key, field.Clone());
        }
    }

    Clone(){
        var entry = new BoxEntry();
        entry.active = this.active;
        
        entry.dimensions = this.dimensions.Clone();

        entry.weight = this.weight;
        entry.quantity = this.quantity;

        entry.properties.stacking      = this.properties.stacking.Clone();
        entry.properties.rotation       = this.properties.rotation.Clone();
        entry.properties.translation    = this.properties.translation.Clone();

        for(var [key, field] of this.descriptions){
            entry.descriptions.set(key, field.Clone());
        }

        return entry;
    }

    /**
     * @returns {string}
     */
    get label(){
        var field = this.descriptions.get('label');
        return field ? field.content : undefined;
    }

    set label(value){
        var field = this.descriptions.get('label');
        if(field)
            field.content = value;
        else
            this.descriptions.set('label', new TextField('label', value));
    }

    ToString(){
        return '\'' + this.descriptions.get('label').content + '\': ' + this.dimensions.ToString();
    }
}

export default BoxEntry;