
import Component from './component.js'

Lampa.Lang.add({
    title_craftorio: {
        ru: 'Craftorio',
        en: 'Craftorio',
        uk: 'Craftorio',
        be: 'Craftorio',
        zh: 'Craftorio',
        pt: 'Craftorio',
        bg: 'Craftorio',
    }
})

let manifest = {
    type: 'video',
    version: '0.1.0',
    name: Lampa.Lang.translate('title_craftorio'),
    description: '',
    component: 'craftorio',
}

Lampa.Manifest.plugins = manifest

Lampa.Component.add('craftorio', Component)

let button = $(`<li class="menu__item selector">
    <div class="menu__ico">
        <svg width="38" height="31" viewBox="0 0 38 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="17.613" width="3" height="16.3327" rx="1.5" transform="rotate(63.4707 17.613 0)" fill="currentColor"/>
            <circle cx="13" cy="19" r="6" fill="currentColor"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0 11C0 8.79086 1.79083 7 4 7H34C36.2091 7 38 8.79086 38 11V27C38 29.2091 36.2092 31 34 31H4C1.79083 31 0 29.2091 0 27V11ZM21 19C21 23.4183 17.4183 27 13 27C8.58173 27 5 23.4183 5 19C5 14.5817 8.58173 11 13 11C17.4183 11 21 14.5817 21 19ZM30.5 18C31.8807 18 33 16.8807 33 15.5C33 14.1193 31.8807 13 30.5 13C29.1193 13 28 14.1193 28 15.5C28 16.8807 29.1193 18 30.5 18Z" fill="currentColor"/>
        </svg>
    </div>
    <div class="menu__text">${manifest.name}</div>
</li>`)

button.on('hover:enter', function () {
    Lampa.Activity.push({
        url: '',
        title: manifest.name,
        component: 'craftorio',
        page: 1
    })
})

$('.menu .menu__list').eq(0).append(button)

