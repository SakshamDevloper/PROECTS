


export default class Validator {
    private ruleMessages: Record<string, string> = {
        required: ':field is required',
        string: ':field field must be of type string',
        number: ':field field must be of type number',
        boolean: ':field field must be of type boolean',
        array: ':field field must be of type array',
        date: ':field field must be date',
        min: ':field field min/min-length is :min',
        max: ':field field max/max-length is :max',
        size: ':field field size must be :size'
    }

    private data: Record<string, any> = {};
    private rules: Record<string, Array<string>> = {};
    private messages: Record<string, Array<string>> = {};


    static make(data: object, rules: Record<string, Array<string>>) {
        const validator = new Validator();
        validator.data = data;
        validator.rules = rules;

        return validator;
    }

    validate() {
        let ruleArg = null;
        outer: for (let [field, rules] of Object.entries(this.rules)) {
            if (rules.includes('nullable') && this.input(field) === null) {
                continue outer;
            }

            for (let rule of rules) {
                if (this.messages[field] && this.messages[field].length !== 0) {
                    continue outer;
                }

                rule = rule.at(0)?.toUpperCase() + rule.slice(1);
                [rule, ruleArg] = rule.split(':');
                const methodName = `_validate${rule}` as keyof Validator;

                if (typeof this[methodName] === 'function' && !this[methodName](field, ruleArg)) {
                    rule = rule.toLowerCase();
                    if ((field in this.messages)) {
                        this.messages[field].push(this.getRuleMessage(rule, field, ruleArg));
                    } else {
                        this.messages[field] = [this.getRuleMessage(rule, field, ruleArg)];
                    }
                }
            }
        }

        return Object.keys(this.messages).length === 0;
    }

    input(field: string) {
        return this.data[field];
    }

    getMessages() {
        return this.messages
    }

    getRuleMessage(rule: string, field: string, ruleArg: string | null = null) {
        return this.ruleMessages[rule].replace(':field', field).replace(`:${rule}`, ruleArg ?? '');
    }

    _validateRequired(field: string) {
        return field in this.data;
    }

    _validateNullable() {
        return true;
    }

    _validateBoolean(field: string) {
        return typeof this.input(field) === 'boolean';
    }

    _validateString(field: string) {
        return typeof this.input(field) === 'string';
    }

    _validateNumber(field: string) {
        return typeof this.input(field) === 'number';
    }

    _validateArray(field: string) {
        return Array.isArray(this.input(field));
    }

    _validateDate(field: string) {
        return !Number.isNaN(Date.parse(this.input(field)));
    }

    _validateMin(field: string, min: string) {
        if (typeof this.input(field) === 'number') {
            return this.input(field) >= min;
        }
        return this.input(field)?.length >= min;
    }

    _validateMax(field: string, max: string) {
        if (typeof this.input(field) === 'number') {
            return this.input(field) <= max;
        }

        return this.input(field)?.length <= max;
    }

    _validateSize(field: string, size: string) {
        if (typeof this.input(field) === 'number') {
            return this.input(field) === Number(size);
        }

        return this.input(field)?.length === Number(size);
    }
}