const fs = require('fs');
const data = require('./simpsons.json');
const cheerio = require('cheerio');
const $ = cheerio.load(`
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Family tree</title>
            <link rel="stylesheet" href="css/index.css">
            <script src="js/scrollbooster.min.js"></script>
            <script src="js/main.js"></script>
        </head>
        <body>
            <div class="viewport">
                <div class="content" id="app"></div>
            </div>
        </body>
    </html>`, { decodeEntities: false });

// $('#app').text('Hello there!');
// $('#app').addClass('welcome');
// $.html();

var Colors = {};
Colors.names = [
    '#D25252',
    '#CCDF32',
    '#629755',
    '#CC7832',
    '#6897BB',
    '#BBB529',
    '#9876AA',
    '#EFC090'
];

Colors.random = function() {
    return this.names[Math.floor(Math.random() * this.names.length)];
};

const container = $('#app');

function buildParent(container, name) {
    // console.log(name);
    if (data.people) {
        let fullname = data.people[name].fullname ? data.people[name].fullname : '';
        let dateBorn = data.people[name].born ? '*' + data.people[name].born : '';
        let dateDied = data.people[name].died ? '&#10013;' + data.people[name].born : '';
        let sep = data.people[name].born && data.people[name].died ? '&mdash;' : '';
        var parentItem = `
            <div class="parents-item" data-id="${name}">
                <div class="parents-item-name">${data.people[name].name}</div>
                <div class="parents-item-fullname">${fullname}</div>
                <div class="parents-item-dates">${dateBorn} ${sep} ${dateDied}</div>
            </div>
        `;
    } else {
        var parentItem = `<div class="parents-item" data-id="${name}">${name}</div>`;
    }

    container.append(parentItem);
}

function buildItem($container, el) {
    if (el.length) {
        let color = Colors.random();
        $container.append(`<ul style="--stroke-color: ${color};"></ul>`);
        let $children = $container.find(' > ul');
        el.forEach((child) => {
            let $existing = $('[data-id="'+child+'"]').parents('li');
            let $existingUl = $('[data-id="'+child+'"]').parents('ul');
            if ($existing.length) {
                $existing.attr('id', child);
                $children.append($existingUl.html());
                $existingUl.remove();
            } else {
                $children.append(`<li id="${child}"></li>`);
                $('#' + child).append('<div class="parents"></div>');
                let $parentsCont = $('#' + child + ' > .parents');
                buildParent($parentsCont, child);
            }
        });
    }
};

data.families.forEach((el) => {
    let $father = $('#' + el.parents[0]);
    let mother = el.parents[1];

    if ($father.length) {
        buildItem($father, el.children);
        if (mother) {
            let motherCont = $father.find(' > .parents');
            motherCont.addClass('couple');
            buildParent(motherCont, mother);
        }

        if (el.parents2) {
            $father.append('<span class="line"></span>');
            $father.after(`<li id="${el.parents2[1]}" class="parent2"><div class="parents"></div><span class="line"></span></li>`);
            let $parentsCont = $('#' + el.parents2[1] + ' > .parents');
            buildParent($parentsCont, el.parents2[1]);
            buildItem($('#' + el.parents2[1]), el.children2);
        }

    } else {
        let ul = `<ul class="flow-dendrogram" id="${el.key}"><li><div class="parents couple"></div></li></ul>`;
        container.append(ul);
        let $li = $('#'+el.key + '> li');
        let $parentsCont = $('#'+el.key + '> li > .parents');
        el.parents.forEach((parent) => {
            buildParent($parentsCont, parent);
        });
        buildItem($li, el.children);

        if(el.parents2) {
            let $li = $('#'+el.key + '> li');
            $li.append('<span class="line"></span>');
            $li.after('<li class="parent2"><div class="parents"></div><span class="line"></span></li>');
            let $parentsCont = $('#'+el.key + '> li.parent2 .parents');
            buildParent($parentsCont, el.parents2[1]);
            buildItem($('#'+el.key + '> li.parent2'), el.children2);
        }
    }
});


fs.writeFile('./index.html', $.html(), {encoding: 'utf8'}, function(err) {
    if (err) {
        return console.log(err);
    }
    console.log('HTML file was saved!');
});
