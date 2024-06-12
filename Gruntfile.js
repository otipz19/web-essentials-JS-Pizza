/**
 * Created by Andriy on 10.03.2015.
 */
module.exports = function (grunt) {
    //Налаштування збірки Grunt
    var config = {
        //Інформацію про проект з файлу package.json
        pkg: grunt.file.readJSON('package.json'),

        //Конфігурація для модуля browserify (перетворює require(..) в код
        browserify: {
            //Загальні налаштування (grunt-browserify)
            options: {

                //brfs замість fs.readFileSync вставляє вміст файлу
                transform: [require('brfs')],
                browserifyOptions: {
                    //Папка з корнем джерельних кодів javascript
                    basedir: "Frontend/src/js/"
                }
            },

            index: {
                src: 'Frontend/src/js/index.js',
                dest: 'Frontend/www/assets/js/index.js'
            },

            stats: {
                src: 'Frontend/src/js/stats.js',
                dest: 'Frontend/www/assets/js/stats.js'
            }
        },

        ts: {
            default: {
                tsconfig: './tsconfig.json',
                src: ["Frontend/src/ts/*.ts"],
                outDir: "Frontend/src/js",  
            }
        },
    };

    //Налаштування відстежування змін в проекті
    var watchDebug = {
        options: {
            'no-beep': true
        },
        //Назва завдання будь-яка
        scripts: {
            //На зміни в яких файлах реагувати
            files: ['Frontend/src/**/*.js', 'Frontend/**/*.ejs'],
            //Які завдання виконувати під час зміни в файлах
            tasks: ['browserify:pizza']
        }
    };


    //Ініціалузвати Grunt
    config.watch = watchDebug;
    grunt.initConfig(config);

    //Сказати які модулі необхідно виокристовувати
    grunt.loadNpmTasks('grunt-ts');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    //Список завданнь по замовчування
    grunt.registerTask('default',
        [
            'ts',
            'browserify:index',
            'browserify:stats',
            //Інші завдання які необхідно виконати
        ]
    );

};