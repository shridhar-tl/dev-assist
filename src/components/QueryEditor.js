/* eslint-disable no-fallthrough */
import React, { PureComponent } from 'react';
import parser from 'js-sql-parser';
import { allowedFuncInQuery } from '../content-scripts/shared';

class QueryEditor extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { sql: props.sql, value: props.sql || '' };
    }

    static getDerivedStateFromProps(props, state) {
        if (state.sql !== props.sql) {
            return { sql: props.sql, value: props.sql };
        };

        return null;
    }

    valueChanged = ({ currentTarget: { value } }) => {
        this.setState({ value });
    }

    keyPress = (e) => {
        if (e.charCode === 13 && (e.ctrlKey || e.altKey)) {
            e.preventDefault();
            this.parseSQL();
        }
    }

    parseSQL = () => {
        try {
            const { value } = this.state;
            const ast = parser.parse(value);
            const output = this.simplifyAST(ast.value);
            this.props.onExecute(output);
        }
        catch (err) {
            this.props.onError(err);
            console.error(err);
        }
    }

    simplifyAST = (ast) => {
        const { selectItems, from, where, limit, orderBy } = ast;

        const tableName = from.value[0].value.value.value;

        const result = { tableName };

        let select = selectItems.value.map(this.prepareValue);

        if (select.length === 1 && select[0].field === '*') {
            select = null;
        }

        if (select) {
            result.select = select;
        }

        const maxRows = parseInt(limit?.value[0] || 0);
        if (maxRows) {
            result.maxRows = maxRows;
        }

        if (orderBy?.value[0]) {
            const { sortOpt, value: { value: field } } = orderBy.value[0];

            result.sortBy = { field, isDesc: sortOpt === 'desc' };
        }

        const filter = this.parseWhere(where);

        if (filter) {
            result.filter = filter;
        }

        return result;
    }

    parseWhere = (where) => {
        if (!where) {
            return where;
        }

        const { left, right, type, operator = type, hasNot } = where;

        let notFilter = !!hasNot;

        const generateResult = (arg) => {
            const result = arg || {};

            result.left = this.prepareValue(left);

            if (!result.right) {
                result.right = this.prepareValue(right);
            }

            return result;
        }

        switch (operator) {
            case '!=': case '=': case '>': case '>=': case '<': case '<=':
                return generateResult({ operator });
            case 'LikePredicate':
                return generateResult({ notFilter, likeMatch: true });
            case 'InExpressionListPredicate':
                let value = right.value.map(this.prepareValue);
                let oper = notFilter ? 'not' : 'in';

                if (value.length === 1) {
                    value = value[0];
                    oper = notFilter ? '!=' : '=';
                }

                return generateResult({ right: { value }, operator: oper });
            case 'and':
            case 'or':
                return { [operator]: [this.parseWhere(left), this.parseWhere(right)] };
            case 'SimpleExprParentheses':
                return this.parseWhere(where.value.value[0]);
            default: break;
        }
    }

    prepareValue = (arg) => {
        const { value, type, alias } = arg;

        switch (type?.toLowerCase()) {
            case 'number': return { value: parseFloat(value), alias };
            case 'boolean': return { value: value.toLowerCase() === 'true', alias };
            case 'string':
                if (value[0] === "'" && value[value.length - 1] === "'") {
                    return { value: value.substring(1, value.length - 1), alias };
                }

                return value;
            case 'identifier':
                return { field: arg.value, alias };
            case 'functioncall':
                const func = allowedFuncInQuery[arg.name];
                if (!func) {
                    throw Error('Unknown function "' + arg.name + '"');
                }

                const params = arg.params.map(this.prepareValue);

                if (params.some(({ func, field }) => func || field)) {
                    return { func: arg.name, params, alias };
                } else {
                    return { value: func.apply(this, params), alias };
                }
            default:
                throw Error(`"${arg.name || value}" of type "${type}" are not supported in this context`);
        }
    }

    render() {
        const { value } = this.state;
        const { disabled } = this.props;

        return (
            <div className="sql-query-editor">
                <textarea value={value} disabled={disabled} onChange={this.valueChanged} onKeyPress={this.keyPress} />
            </div>
        );
    }
}

export default QueryEditor;