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

function addChildren(children, $container, parent) {
    let color = Colors.random();
    $container.append(`<ul style="--stroke-color: ${color};"></ul>`);
    children.forEach((child) => {
        let $childrenCont = $('#' + parent + ' > ul');
        let $childCont = $('#' + child);
        $childrenCont.append($childCont);
    });
};

const container = $('#app');

for (const name in data.people) {
    // console.log(`${name}: ${data.people[name]}`);
    let fullname = data.people[name].fullname ? data.people[name].fullname : '';
    let dateBorn = data.people[name].born ? '*' + data.people[name].born : '';
    let dateDied = data.people[name].died ? '&#10013;' + data.people[name].born : '';
    let sep = data.people[name].born && data.people[name].died ? '&mdash;' : '';
    let ul = `
        <ul class="flow-dendrogram">
            <li id="${name}">
                <div class="parents couple">
                    <div class="parents-item" data-id="${name}">
                        <div class="parents-item-name">${data.people[name].name}</div>
                        <div class="parents-item-fullname">${fullname}</div>
                        <div class="parents-item-dates">${dateBorn} ${sep} ${dateDied}</div>
                    </div>
                </div>
            </li>
        </ul>`;
    container.append(ul);
}

data.families.forEach((el) => {
    let $father = $('#' + el.parents[0]);
    let $mother = $('#' + el.parents[1]);

    let hasChildren = $('#' + el.parents[0] + ' > ul').length;
    if (!hasChildren) {
        let $fatherCont = $father.find(' > .parents');
        let $motherItem = $mother.find('.parents-item');
        $fatherCont.append($motherItem);

        if (el.children.length) {
            addChildren(el.children, $father, el.parents[0]);
        }
    } else {
        let line = '<span class="line"></span>';
        $father.append(line);
        $mother.addClass('parent2').append(line);
        $father.after($mother);

        if (el.children.length) {
            addChildren(el.children, $mother, el.parents[1]);
        }
    }
});

$('.flow-dendrogram').each(function(index) {
    if ($(this).find('.parents-item').length == 0) {
        $(this).remove();
    }
});

fs.writeFile('./index.html', $.html(), {encoding: 'utf8'}, function(err) {
    if (err) {
        return console.log(err);
    }
    console.log('HTML file was saved!');
});
