/**
 * Component Generator
 */

    //const componentExists = require('../utils/componentExists');

module.exports = {
    description: 'Добавить компоненту',
    prompts: [/*{
     type: 'list',
     name: 'type',
     message: 'Select the type of component',
     default: 'Stateless Function',
     choices: () => ['ES6 Class', 'Stateless Function']
     },*/ {
        type: 'input',
        name: 'name',
        message: 'Название компоненты',
        default: 'Button'
        //validate: function (value) {
        //if ((/.+/).test(value)) {
        //    return componentExists(value) ? 'A component or container with this name already exists' : true;
        //}
        //return 'The name is required';
        //}
    }, {
        type: 'list',
        name: 'app',
        message: 'Выберите приложение',
        default: 'front',
        choices: function () {
            return ['front', 'control', 'mobile']
        }
    }],
    actions: function (data) {
        var actions = [{
            type: 'add',
            path: '../../assets/app/{{app}}/components/{{name}}/{{name}}.js',
            templateFile: './component/component.front.js.hbs',
            abortOnFail: true
        }];

        actions.push({
            type: 'add',
            path: '../../assets/app/{{app}}/components/{{name}}/{{name}}.less',
            templateFile: './component/component.less.hbs',
            abortOnFail: true
        });

        actions.push({
            type: 'add',
            path: '../../assets/app/{{app}}/components/{{name}}/{{name}}.jinja',
            templateFile: './component/component.jinja.hbs',
            abortOnFail: true
        });

        return actions;
    }
};