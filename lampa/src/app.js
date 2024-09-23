import Define from './utils/define'
import PromisePolyfill from './utils/promise-polyfill'
import Manifest from './utils/manifest'
import Lang from './utils/lang'
import Platform from './utils/platform'
import Orsay from './utils/orsay'
import Render from './interaction/render'
import Keypad from './interaction/keypad'
import Activity from './interaction/activity'
import Controller from './interaction/controller'
import Layer from './utils/layer'
import Select from './interaction/select'
import Favorite from './utils/favorite'
import Background from './interaction/background'
import Notice from './interaction/notice'
import NoticeClass from './interaction/notice/class'
import NoticeClassLampa from './interaction/notice/lampa'
import Head from './components/head'
import Menu from './components/menu'
import Utils from './utils/math'
import Console from './interaction/console'
import Params from './components/settings/params'
import Input from './components/settings/input'
import Screensaver from './interaction/screensaver'
import Android from './utils/android'
import Subscribe from './utils/subscribe'
import Storage from './utils/storage'
import Template from './interaction/template'
import Component from './interaction/component'
import Reguest from './utils/reguest'
import Filter from './interaction/filter'
import Files from './interaction/files'
import Explorer from './interaction/explorer'
import Scroll from './interaction/scroll'
import Empty from './interaction/empty'
import Arrays from './utils/arrays'
import Noty from './interaction/noty'
import Player from './interaction/player'
import PlayerVideo from './interaction/player/video'
import PlayerPanel from './interaction/player/panel'
import PlayerInfo from './interaction/player/info'
import PlayerIPTV from './interaction/player/iptv'
import PlayerPlaylist from './interaction/player/playlist'
import Timeline from './interaction/timeline'
import Settings from './components/settings'
import SettingsApi from './components/settings/api'
import Modal from './interaction/modal'
import Api from './interaction/api'
import Cloud from './utils/cloud'
import Info from './interaction/info'
import Card from './interaction/card'
import Account from './utils/account'
import Plugins from './utils/plugins'
import Socket from './utils/socket'
import Recomends from './utils/recomend'
import VideoQuality from './utils/video_quality'
import TimeTable from './utils/timetable'
import Broadcast from './interaction/broadcast'
import Helper from './interaction/helper'
import Tizen from './utils/tizen'
import InteractionMain from './interaction/items/main'
import InteractionCategory from './interaction/items/category'
import InteractionLine from './interaction/items/line'
import Status from './utils/status'
import LangChoice from './interaction/lang'
import Extensions from './interaction/extensions'
import Iframe from './interaction/iframe'
import Parser from './utils/api/parser'
import TMDB from './utils/tmdb'
import Base64 from './utils/base64'
import Loading from './interaction/loading'
import YouTube from './interaction/youtube'
import WebOSLauncher from './utils/webos_launcher'
import Event from './utils/event'
import Search from './components/search'
import Developer from './interaction/developer'
import DeviceInput from './utils/device_input'
import AppWorker from './utils/worker'
import Theme from './utils/theme'
import AdManager from './interaction/ad/manager'
import DB from './utils/db'
import NavigationBar from './interaction/navigation_bar'
import Endless from './interaction/endless'
import Color from './utils/color'
import Cache from './utils/cache'
import Demo from './utils/demo'
import Torrent from './interaction/torrent'
import Torserver from './interaction/torserver'
import Speedtest from './interaction/speedtest'
import VPN from './utils/vpn'
import Processing from './interaction/processing'
import ParentalControl from './interaction/parental_control'
import Personal from './utils/personal'

/**
 * Настройки движка
 */
if(typeof window.lampa_settings == 'undefined'){
    window.lampa_settings = {}
}

// let appletv = navigator.userAgent.toLowerCase().indexOf("ipad") > -1 && window.innerWidth == 1920 && window.innerHeight == 1080
let appletv = false;

Arrays.extend(window.lampa_settings,{
    socket_use: true,
    socket_url: 'wss://cub.red:8010',
    socket_methods: true,

    account_use: true,
    account_sync: true,

    plugins_use: true,
    plugins_store: true,

    torrents_use: appletv ? false : true,
    white_use: false,

    lang_use: true,

    read_only: false,

    dcma: false
})

/**
 * Для вебось маркета и других маркетов, демо режим, задрали черти.
 */

//window.lampa_settings.demo = window.lampa_settings.white_use && typeof webOS !== 'undefined' && webOS.platform.tv === true

if(window.localStorage.getItem('remove_white_and_demo')){
    window.lampa_settings.demo         = false
    window.lampa_settings.white_use    = false
}

window.Lampa = {
    Listener: Subscribe(),
    Lang,
    Subscribe,
    Storage,
    Platform,
    Utils,
    Params,
    Menu,
    Head,
    Notice,
    NoticeClass,
    NoticeClassLampa,
    Background,
    Favorite,
    Select,
    Controller,
    Activity,
    Keypad,
    Template,
    Component,
    Reguest,
    Filter,
    Files,
    Explorer,
    Scroll,
    Empty,
    Arrays,
    Noty,
    Player,
    PlayerVideo,
    PlayerInfo,
    PlayerPanel,
    PlayerIPTV,
    PlayerPlaylist,
    Timeline,
    Modal,
    Api,
    Cloud,
    Settings,
    SettingsApi,
    Android,
    Card,
    Info,
    Account,
    Socket,
    Input,
    Screensaver,
    Recomends,
    VideoQuality,
    TimeTable,
    Broadcast,
    Helper,
    InteractionMain,
    InteractionCategory,
    InteractionLine,
    Status,
    Plugins,
    Extensions,
    Tizen,
    Layer,
    Console,
    Iframe,
    Parser,
    Manifest,
    TMDB,
    Base64,
    Loading,
    YouTube,
    WebOSLauncher,
    Event,
    Search,
    DeviceInput,
    Worker: AppWorker,
    DB,
    NavigationBar,
    Endless,
    Color,
    Cache,
    Torrent,
    Torserver,
    Speedtest,
    Processing,
    ParentalControl,
    VPN
}

function closeApp(){
    if(Platform.is('apple_tv')) window.location.assign('exit://exit');
    if(Platform.is('tizen')) tizen.application.getCurrentApplication().exit()
    if(Platform.is('webos') && typeof window.close == 'function') window.close()
    if(Platform.is('android')) Android.exit()
    if(Platform.is('orsay')) Orsay.exit()
    if(Platform.is('netcast')) window.NetCastBack()
}

function popupCloseApp(){
    let controller = Controller.enabled().name

    Modal.open({
        title: '',
        align: 'center',
        zIndex: 300,
        html: $('<div class="about">'+Lang.translate('close_app_modal')+'</div>'),
        buttons: [
            {
                name: Lang.translate('settings_param_no'),
                onSelect: ()=>{
                    Modal.close()

                    Controller.toggle(controller)
                }
            },
            {
                name: Lang.translate('settings_param_yes'),
                onSelect: ()=>{
                    Modal.close()

                    Controller.toggle(controller)

                    closeApp()
                }
            }
        ]
    })
}

function prepareApp(){
    if(window.prepared_app) return

    $('body').append(Noty.render())

    DeviceInput.init()

    Platform.init()

    Params.init()

    Controller.observe()

    Console.init()

    Keypad.init()

    Layer.init()

    Storage.init()

    /** Передаем фокус в контроллер */

    Navigator.follow('focus', (event)=>{
        Controller.focus(event.elem)
    })

    /** Выход в начальном скрине */

    Keypad.listener.follow('keydown',(e)=>{
        if(window.appready || Controller.enabled().name == 'modal') return

        if (e.code == 8 || e.code == 27 || e.code == 461 || e.code == 10009 || e.code == 88) popupCloseApp()
    })

    /** Отключаем правый клик */
    if(window.innerWidth > 1280) window.addEventListener("contextmenu", e => e.preventDefault())

    /** Если это тач дивайс */

    if(!Platform.screen('tv')) $('body').addClass('touch-device')

    /** Start - для orsay одни стили, для других другие */
    let old_css = $('link[href="css/app.css"]')

    if(Platform.is('orsay')){
        let urlStyle = 'http://lampa.mx/css/app.css?v'
        //Для нового типа виджета берем сохраненный адрес загрузки
        if (Orsay.isNewWidget()) {
            //Для фрейм загрузчика запишем полный url
            if (location.protocol != 'file:') {
                let newloaderUrl = location.href.replace(/[^/]*$/, '')
                if (newloaderUrl.slice(-1) == '/') {
                    newloaderUrl = newloaderUrl.substring(0, newloaderUrl.length - 1);
                }
                if (Orsay.getLoaderUrl() != newloaderUrl) {
                    Orsay.setLoaderUrl(newloaderUrl)
                }
            }
            console.log('Loader', 'start url: ', Orsay.getLoaderUrl());
            urlStyle = Orsay.getLoaderUrl() + '/css/app.css?v'
        }
        Utils.putStyle([
            urlStyle + Manifest.css_version
        ],()=>{
            old_css.remove()
        })
    }
    else if(old_css.length){
        Utils.putStyle([
            'https://yumata.github.io/lampa/css/app.css?v' + Manifest.css_version
        ],()=>{
            old_css.remove()
        })
    }

    Layer.update()

    window.prepared_app = true
}

function developerApp(proceed){
    let expect  = true
    let pressed = 0

    let timer   = setTimeout(()=>{
        expect  = false

        proceed()
    }, 1000)

    let check = ()=>{
        pressed++

        if(pressed === 3){
            clearTimeout(timer)

            expect = false

            Keypad.enable()

            Developer.open(()=>{
                Keypad.disable()

                proceed()
            })

            console.log('Developer mode','on')
        }
    }

    let keydown = (event)=>{
        if(expect){
            if(event.keyCode === 38||event.keyCode === 29460||event.keyCode === 50400012) check()
        }
        else{
            document.removeEventListener('keydown', keydown)
        }
    }

    $('.welcome').on('click', (e)=>{
        if(expect && DeviceInput.canClick(e.originalEvent)) check()
    })

    window.addEventListener("keydown", keydown)
}

function startApp(){
    if(window.appready) return

    let start_time = 0

    /** Стартуем */

    Lampa.Listener.send('app',{type:'start'})

    /** Инициализируем классы */

    Personal.init()
    Settings.init()
    Select.init()
    Favorite.init()
    Background.init()
    Head.init()
    Notice.init()
    Menu.init()
    Activity.init()
    Screensaver.init()
    Cloud.init()
    Socket.init()
    Account.init()
    Extensions.init()
    Plugins.init()
    Recomends.init()
    TimeTable.init()
    Helper.init()
    Tizen.init()
    Player.init()
    Iframe.init()
    Parser.init()
    WebOSLauncher.init()
    Theme.init()
    AdManager.init()
    NavigationBar.init()
    Demo.init()
    Speedtest.init()
    VPN.init()
    Processing.init()
    ParentalControl.init()

    /** Надо зачиcтить, не хорошо светить пароль ;) */

    Storage.set('account_password','')

    /** Чтоб не писали по 100 раз */

    Storage.set('parser_torrent_type', Storage.get('parser_torrent_type') || 'jackett')

    /** Инфа */

    let ratio = window.devicePixelRatio || 1

    console.log('App','screen size:', (window.innerWidth * ratio) + ' / ' + (window.innerHeight * ratio))
    console.log('App','interface size:', window.innerWidth + ' / ' + window.innerHeight)
    console.log('App','pixel ratio:', window.devicePixelRatio)
    console.log('App','user agent:', navigator.userAgent)
    console.log('App','is tv:', Platform.screen('tv'))
    console.log('App','is mobile:', Platform.screen('mobile'))
    console.log('App','is touch:', Utils.isTouchDevice())
    console.log('App','is PWA:', Utils.isPWA())
    console.log('App','platform:', Storage.get('platform', 'noname'))

    /** Выход из приложения */

    Activity.listener.follow('backward',(event)=>{
        if(!start_time) start_time = Date.now()

        if(event.count == 1 && Date.now() > start_time + (1000 * 2)){
            let enabled = Controller.enabled()

            Select.show({
                title: Lang.translate('title_out'),
                items: [
                    {
                        title: Lang.translate('title_out_confirm'),
                        out: true
                    },
                    {
                        title: Lang.translate('cancel')
                    }
                ],
                onSelect: (a)=>{
                    if(a.out){
                        Activity.out()

                        Controller.toggle(enabled.name)

                        closeApp()
                    }
                    else{
                        Controller.toggle(enabled.name)
                    }
                },
                onBack: ()=>{
                    Controller.toggle(enabled.name)
                }
            })
        }
    })


    /** Ренедрим лампу */

    Render.app()

    /** Проверяем уведомления */

    Notice.drawCount()

    /** Обновляем слои */

    Layer.update()

    /** Активируем последнию активность */

    setTimeout(Activity.last.bind(Activity),500)

    /** Гасим свет :D */

    setTimeout(()=>{
        Keypad.enable()

        Screensaver.enable()

        $('.welcome').fadeOut(500,()=>{
            $(this).remove()
        })
    },1000)


    /** End */

    /** Start - если это андроид */

    if(Platform.is('android')){
        Params.listener.follow('button',(e)=>{
            if(e.name === 'reset_player'){
                Android.resetDefaultPlayer()
            }
        })

        Favorite.listener.follow('add,added,remove', (e)=>{
            Android.updateChannel(e.where)
        })
    }

    /** End */

    /** Start - записываем популярные фильмы */

    Favorite.listener.follow('add,added',(e)=>{
        if(e.where == 'history' && e.card.id){
            $.get(Utils.protocol() + 'tmdb.'+Manifest.cub_domain+'/watch?id='+e.card.id+'&cat='+(e.card.original_name ? 'tv' : 'movie'))
        }
    })

    /** End */

    /** Start - следим за переключением в лайт версию и обновляем интерфейс */

    Storage.listener.follow('change',(e)=>{
        if(e.name == 'light_version'){
            $('body').toggleClass('light--version',Storage.field('light_version'))

            Layer.update()
        }

        if(e.name == 'keyboard_type'){
            $('body').toggleClass('system--keyboard',Storage.field('keyboard_type') == 'lampa' ? false : true)
        }
    })

    /** End */

    /** Start - проверка статуса для торрента */

    let torrent_net = new Reguest()

    function check(name) {
        if(Platform.is('android') && !Storage.field('internal_torrclient')) return

        let item = $('[data-name="'+name+'"]').find('.settings-param__status').removeClass('active error wait').addClass('wait')
        let url  = Storage.get(name)

        if(url){
            torrent_net.timeout(10000)

            let head = {dataType: 'text'}
            let auth = Storage.field('torrserver_auth')

            if(auth){
                head.headers = {
                    Authorization: "Basic " + Base64.encode(Storage.get('torrserver_login')+':'+Storage.get('torrserver_password'))
                }
            }

            torrent_net.native(Utils.checkEmptyUrl(Storage.get(name)), ()=>{
                item.removeClass('wait').addClass('active')
            }, (a, c)=> {
                if(a.status == 401){
                    item.removeClass('wait').addClass('active')

                    Noty.show(Lang.translate('torrent_error_check_no_auth') + ' - ' + url, {time: 5000})
                }
                else{
                    item.removeClass('wait').addClass('error')

                    Noty.show(torrent_net.errorDecode(a, c) + ' - ' + url, {time: 5000})
                }
            }, false, head)
        }
    }

    Storage.listener.follow('change', function (e) {
        if (e.name == 'torrserver_url') check(e.name)
        if (e.name == 'torrserver_url_two') check(e.name)
        if (e.name == 'torrserver_use_link') check(e.value == 'one' ? 'torrserver_url' : 'torrserver_url_two')
    })

    Settings.listener.follow('open', function (e){
        if(e.name == 'more' && window.location.protocol == 'https:'){
            $('[data-name="protocol"]',e.body).remove()
        }

        if(e.name == 'server'){
            let name = Storage.field('torrserver_use_link') == 'one' ? 'torrserver_url' : 'torrserver_url_two'

            check(name)

            if(!Account.hasPremium() && Lang.selected(['ru','be','uk']) && !Personal.confirm()){
                let ad = $(`
                    <div class="ad-server">
                        <div class="ad-server__text">
                            Арендовать ссылку на сервер без установки и настроек.
                        </div>
                        <img src="https://i.ibb.co/MRLKBBf/qr-code-2.png" class="ad-server__qr">
                        <div class="ad-server__label">Реклама - https://tsarea.us</div>
                    </div>
                `)

                $('[data-name="torrserver_use_link"]',e.body).after(ad)
            }
        }
        else torrent_net.clear()

        if(e.name == 'interface' && window.lampa_settings.lang_use){
            $('.settings-param:eq(0)',e.body).on('hover:enter',()=>{
                LangChoice.open((code)=>{
                    Modal.open({
                        title: '',
                        html: $('<div class="about"><div class="selector">'+Lang.translate('settings_interface_lang_reload')+'</div></div>'),
                        onBack: ()=>{
                            window.location.reload()
                        },
                        onSelect: ()=>{
                            window.location.reload()
                        }
                    })

                    Storage.set('language', code, true)
                    Storage.set('tmdb_lang',code, true)
                },()=>{
                    Controller.toggle('settings_component')
                })
            }).find('.settings-param__value').text(Lang.translate(Lang.codes()[Storage.get('language','ru')]))
        }
    })

    /** End */

    /** Добавляем класс платформы */

    $('body').addClass('platform--'+(Platform.get() || 'noname'))

    /** Включаем лайт версию если было включено */

    $('body').toggleClass('light--version',Storage.field('light_version')).toggleClass('system--keyboard',Storage.field('keyboard_type') == 'lampa' ? false : true)

    /** Добавляем hls и dash плагин */

    let video_libs = ['hls/hls.js', 'dash/dash.js']

    video_libs = video_libs.map(lib=>{
        return window.location.protocol == 'file:' ? 'https://yumata.github.io/lampa/vender/' + lib : './vender/' + lib
    })

    Utils.putScript(video_libs,()=>{})

    /** Сообщаем о готовности */

    Lampa.Listener.send('app',{type:'ready'})

    /** Меню готово */

    Menu.ready()

    /** Лампа полностью готова */

    window.appready = true

    /** Start - активация режима GOD, жмем 🠔🠔 🠕🠕 🠖🠖 🠗🠗 */

    let mask = [37,37,38,38,39,39,40,40],
        psdg = -1

    Keypad.listener.follow('keydown',(e)=>{
        if(e.code == 37 && psdg < 0){
            psdg = 0
        }

        if(psdg >= 0 && mask[psdg] == e.code) psdg++
        else psdg = -1

        if(psdg == 8){
            psdg = -1

            console.log('God','enabled')

            Noty.show('God enabled')

            window.god_enabled = true
        }
    })

    /** Start - активация полной лампы, жмем 🠔🠔 🠕🠕 🠔🠔 🠕🠕 */

    let mask_full = [37,37,38,38,37,37,38,38],
        psdg_full = -1

    Keypad.listener.follow('keydown',(e)=>{
        if(e.code == 37 && psdg_full < 0){
            psdg_full = 0
        }

        if(psdg_full >= 0 && mask_full[psdg_full] == e.code) psdg_full++
        else psdg_full = -1

        if(psdg_full == 8){
            psdg_full = -1

            Noty.show('Full enabled')

            window.localStorage.setItem('remove_white_and_demo','true')

            let controller = Controller.enabled().name

            Modal.open({
                title: '',
                align: 'center',
                zIndex: 300,
                html: $('<div class="about">'+Lang.translate('settings_interface_lang_reload')+'</div>'),
                buttons: [
                    {
                        name: Lang.translate('settings_param_no'),
                        onSelect: ()=>{
                            Modal.close()

                            Controller.toggle(controller)
                        }
                    },
                    {
                        name: Lang.translate('settings_param_yes'),
                        onSelect: ()=>{
                            window.location.reload()
                        }
                    }
                ]
            })
        }
    })

    /** Быстрый доступ к закладкам через кнопки */

    let color_keys = {
        '406':'history',
        '405':'wath',
        '404':'like',
        '403':'book',
    }

    Keypad.listener.follow('keydown',(e)=>{
        if(!Player.opened()){
            if(color_keys[e.code]){
                let type = color_keys[e.code]

                Activity.push({
                    url: '',
                    title: type == 'book' ? Lang.translate('title_book') : type == 'like' ? Lang.translate('title_like'): type == 'history' ? Lang.translate('title_history') : Lang.translate('title_wath'),
                    component: 'favorite',
                    type: type,
                    page: 1
                })
            }
        }
    })

    /** Обновление состояния карточек каждые 5 минут */

    let last_card_update = Date.now()
    let lets_card_update = ()=>{
        if(last_card_update < Date.now() - 1000 * 60 * 5){
            last_card_update = Date.now()

            Activity.renderLayers(true).forEach((layer)=>{
                let cards = Array.from(layer.querySelectorAll('.card'))

                cards.forEach((card)=>{
                    Utils.trigger(card, 'update')
                })
            })
        }
    }

    setInterval(()=>{
        if(!Player.opened()) lets_card_update()
    },1000 * 60)

    Player.listener.follow('destroy',()=>{
        setTimeout(lets_card_update, 1000)
    })

    Lampa.Listener.follow('activity',(e)=>{
        if(e.type == 'archive' && e.object.activity){
            let cards = Array.from(e.object.activity.render(true).querySelectorAll('.card.focus'))

            cards.forEach((card)=>{
                Utils.trigger(card, 'update')
            })
        }
    })

    /** End */
}

function loadLang(){
    let code = window.localStorage.getItem('language') || 'ru'
    let call = ()=>{
        /** Принудительно стартовать */
        setTimeout(startApp,1000*5)

        /** Загружаем плагины и стартуем лампу */
        Plugins.load(startApp)
    }


    if(['ru','en'].indexOf(code) >= 0) call()
    else{
        $.ajax({
            url: (location.protocol == 'file:' || Platform.is('nw') ? 'https://yumata.github.io/lampa/' : './') + 'lang/' + code + '.js',
            dataType: 'text',
            timeout: 10000,
            success: (data)=>{
                let translate = {}

                try{
                    eval((data + '').replace(/export default/g,'translate = ').trim())
                }
                catch(e){}

                Lang.AddTranslation(code, translate)

                call()
            },
            error: call
        })
    }
}

function loadApp(){
    prepareApp()


    if(window.localStorage.getItem('language') || !window.lampa_settings.lang_use){
        developerApp(loadLang)
    }
    else{
        LangChoice.open((code)=>{
            Storage.set('language', code, true)
            Storage.set('tmdb_lang',code, true)

            Keypad.disable()

            loadLang()
        })

        Keypad.enable()
    }
}

if(navigator.userAgent.toLowerCase().indexOf('crosswalk') > -1){
    function checkReady(){
        if(window.innerWidth > 0) loadApp()
        else{
            setTimeout(checkReady,100)
        }
    }

    checkReady()
}
else loadApp()
