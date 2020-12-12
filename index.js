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
        let $childCont = $('#' + child).parent().children();
        $childrenCont.append($childCont);
    });
};

const container = $('#app');

for (const name in data.people) {
    // console.log(`${name}: ${data.people[name]}`);
    let className = data.people[name].class ? data.people[name].class : '';
    let fullname = data.people[name].fullname ? data.people[name].fullname : '';
    let dateBorn = data.people[name].born ? '*' + data.people[name].born : '';
    let dateDied = data.people[name].died ? '&#10013;' + data.people[name].died : '';
    let sep = data.people[name].born && data.people[name].died ? '&mdash;' : '';
    let ul = `
        <ul class="flow-dendrogram">
            <li id="${name}">
                <div class="parents couple">
                    <div class="parents-item ${className}" data-id="${name}">
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

    // move another husband to daughter
    let motherHasHusband = $('[data-id="' + el.parents[1] + '"]');
    if (motherHasHusband.siblings().length) {
        // console.log(motherHasHusband.closest('li').attr('id'));
        let line = '<span class="line"></span>';
        $father.append(line).addClass('parent2');
        motherHasHusband.closest('li').after($father);
    }

    let fatherHasChildren = $('#' + el.parents[0] + ' > ul').length;

    if (!fatherHasChildren) {
        let $fatherCont = $father.find(' > .parents');
        let $motherItem = $mother.find('.parents-item');

        $fatherCont.attr('id', el.key);
        $fatherCont.append($motherItem);

        if (el.children) {
            addChildren(el.children, $father, el.parents[0]);
        }

    } else {
        let line = '<span class="line"></span>';
        $mother.addClass('parent2').append(line);
        $father.after($mother);

        if (el.children) {
            addChildren(el.children, $mother, el.parents[1]);
        }
    }
});

$('.parents').each(function(index) {
    if ($(this).find('.parents-item').length == 0) {
        let wifeId = $(this).parent('li').attr('id');
        let $wife = $('#' + wifeId);
        // console.log(wifeId);
        let $content = $('[data-id="' + wifeId + '"]').closest('.flow-dendrogram').children();
        $wife.after($content);
        $wife.remove();
    }
});

$('.flow-dendrogram').each(function(index) {
    if ($(this).find('.parents-item').length == 0) {
        $(this).remove();
    }
});

const html = $.html().replace(/^\s*[\r\n]/gm,"");

fs.writeFile('./index.html', html, {encoding: 'utf8'}, function(err) {
    if (err) {
        return console.log(err);
    }
    console.log('HTML file was saved!');
});
