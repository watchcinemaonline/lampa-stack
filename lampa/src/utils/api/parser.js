import Storage from '../storage'
import Utils from '../math'
import Reguest from '../reguest'
import Account from '../account'
import Lang from '../lang'
import Search from '../../components/search'
import Activity from '../../interaction/activity'
import Torrent from '../../interaction/torrent'
import Modal from '../../interaction/modal'

let url
let network = new Reguest()

function init(){
    let source = {
        title: Lang.translate('title_parser'),
        search: (params, oncomplite)=>{
            get({
                search: decodeURIComponent(params.query),
                other: true,
                from_search: true
            },(json)=>{
                json.title   = Lang.translate('title_parser')
                json.results = json.Results.slice(0,20)
                json.Results = null

                json.results.forEach((element)=>{
                    element.Title = Utils.shortText(element.Title,110)
                })

                oncomplite(json.results.length ? [json] : [])
            },()=>{
                oncomplite([])
            })
        },
        onCancel: ()=>{
            network.clear()
        },
        params: {
            align_left: true,
            isparser: true,
            card_events: {
                onMenu: ()=>{}
            }
        },
        onMore: (params, close)=>{
            close()

            Activity.push({
                url: '',
                title: Lang.translate('plugins_online'),
                component: 'torrents',
                search: params.query,
                from_search: true,
                noinfo: true,
                movie: {
                    title: params.query,
                    original_title: '',
                    img: './img/img_broken.svg',
                    genres: []
                },
                page: 1
            })
        },
        onSelect: (params, close)=>{
            if(params.element.reguest && !params.element.MagnetUri){
                marnet(params.element, ()=>{
                    Modal.close()

                    Torrent.start(params.element, {
                        title: params.element.Title
                    })

                    Torrent.back(params.line.toggle.bind(params.line))
                },(text)=>{
                    Modal.update(Template.get('error',{title: Lang.translate('title_error'), text: text}))
                })

                Modal.open({
                    title: '',
                    html: Template.get('modal_pending',{text: Lang.translate('torrent_get_magnet')}),
                    onBack: ()=>{
                        Modal.close()

                        params.line.toggle()
                    }
                })
            }
            else{
                Torrent.start(params.element, {
                    title: params.element.Title
                })

                Torrent.back(params.line.toggle.bind(params.line))
            }
        }
    }

    Storage.listener.follow('change',(e)=>{
        if(e.name == 'parse_in_search'){
            Search.removeSource(source)

            if(Storage.field('parse_in_search')) Search.addSource(source)
        }
    })

    if(Storage.field('parse_in_search')){
        Search.addSource(source)
    }
}

function get(params = {}, oncomplite, onerror){
    function complite(data){
        popular(params.movie, data, {}, oncomplite)
    }

    function error(e){
        let data = {Results: []}

        popular(params.movie, data, {nolimit: true}, ()=>{
            if(data.Results.length) oncomplite(data)
            else onerror(e)
        })
    }

    if(Storage.field('parser_torrent_type') == 'jackett'){
        if(Storage.field('jackett_url')){
            url = Utils.checkEmptyUrl(Storage.field('jackett_url'))

            let ignore = false//params.from_search && !url.match(/\d+\.\d+\.\d+/g)

            if(ignore) error('')
            else{
                jackett(params, complite, error)
            }
        }
        else{
            error(Lang.translate('torrent_parser_set_link') + ': Jackett')
        }
    } else if(Storage.field('parser_torrent_type') == 'prowlarr'){
        if(Storage.field('prowlarr_url')){
            url = Utils.checkEmptyUrl(Storage.field('prowlarr_url'))
            prowlarr(params, complite, error)
        } else {
            error(Lang.translate('torrent_parser_set_link') + ': Prowlarr')
        }
    } else if(Storage.field('parser_torrent_type') == 'torrserver'){
        if(Storage.field(Storage.field('torrserver_use_link') == 'two' ? 'torrserver_url_two' : 'torrserver_url')){
            url = Utils.checkEmptyUrl(Storage.field(Storage.field('torrserver_use_link') == 'two' ? 'torrserver_url_two' : 'torrserver_url'))
            torrserver(params, complite, error)
        } else {
            error(Lang.translate('torrent_parser_set_link') + ': TorrServer')
        }
    } else {
        if(Storage.get('native')){
            torlook(params, complite, error)
        }
        else if(Storage.field('torlook_parse_type') == 'site' && Storage.field('parser_website_url')){
            url = Utils.checkEmptyUrl(Storage.field('parser_website_url'))

            torlook(params, complite, error)
        }
        else if(Storage.field('torlook_parse_type') == 'native'){
            torlook(params, complite, error)
        }
        else error(Lang.translate('torrent_parser_set_link') + ': TorLook')
    }
}

function popular(card, data, params, call){
    Account.torrentPopular({card}, (result)=>{
        let torrents = result.result.torrents.filter(t=>t.viewing_request > (params.nolimit ? 0 : 3))

        torrents.sort((a,b)=>b.viewing_average - a.viewing_average)

        torrents.forEach(t=>{
            delete t.viewed
        })

        data.Results = data.Results.concat(params.nolimit ? torrents : torrents.slice(0,3))

        call(data)
    },()=>{
        call(data)
    })
}

function viewed(hash){
    let view  = Storage.cache('torrents_view', 5000, [])

    return view.indexOf(hash) > -1
}

function torlook(params = {}, oncomplite, onerror){
    torlookApi(params, oncomplite, onerror)
}

function torlookApi(params = {}, oncomplite, onerror){
    network.timeout(1000 * Storage.field('parse_timeout'))

    let s = 'https://torlook.site/api.php?key=4JuCSML44FoEsmqK&s='
    let q = (params.search + '').replace(/( )/g, "+").toLowerCase()
    let u = s + encodeURIComponent(q)

    network.native(u,(json)=>{
        if(json.error) onerror(Lang.translate('torrent_parser_request_error'))
        else{
            let data = {
                Results: []
            }

            if(json.data){
                json.data.forEach(elem=>{
                    let item = {}

                    item.Title       = elem.title
                    item.Tracker     = elem.tracker
                    item.Size        = parseInt(elem.size)
                    item.size        = Utils.bytesToSize(item.Size)
                    item.PublishDate = parseInt(elem.date)*1000
                    item.Seeders     = parseInt(elem.seeders)
                    item.Peers       = parseInt(elem.leechers)
                    item.PublisTime  = parseInt(elem.date)*1000
                    item.hash        = Utils.hash(elem.title)
                    item.MagnetUri   = elem.magnet
                    item.viewed      = viewed(item.hash)

                    if(elem.magnet) data.Results.push(item)
                })
            }

            oncomplite(data)
        }
    },(a,c)=>{
        onerror(Lang.translate('torrent_parser_no_responce'))
    })
}

function jackett(params = {}, oncomplite, onerror){
    network.timeout(1000 * Storage.field('parse_timeout'))

    let u = url + '/api/v2.0/indexers/'+(Storage.field('jackett_interview') == 'healthy' ? 'status:healthy' : 'all')+'/results?apikey='+Storage.field('jackett_key')+'&Query='+encodeURIComponent(params.search)

    if(!params.from_search){
        let genres = params.movie.genres.map((a)=>{
            return a.name
        })

        if(!params.clarification){
            u = Utils.addUrlComponent(u,'title='+encodeURIComponent(params.movie.title))
            u = Utils.addUrlComponent(u,'title_original='+encodeURIComponent(params.movie.original_title))
        }

        u = Utils.addUrlComponent(u,'year='+encodeURIComponent(((params.movie.release_date || params.movie.first_air_date || '0000') + '').slice(0,4)))
        u = Utils.addUrlComponent(u,'is_serial='+(params.movie.first_air_date || params.movie.last_air_date ? '2' : params.other ? '0' : '1'))
        u = Utils.addUrlComponent(u,'genres='+encodeURIComponent(genres.join(',')))
        u = Utils.addUrlComponent(u, 'Category[]=' + (params.movie.number_of_seasons > 0 ? 5000 : 2000) + (params.movie.original_language == 'ja' ? ',5070' : ''))
    }

    network.native(u,(json)=>{
        if(json.Results){
            json.Results.forEach(element => {
                element.PublisTime  = Utils.strToTime(element.PublishDate)
                element.hash        = Utils.hash(element.Title)
                element.viewed      = viewed(element.hash)
                element.size        = Utils.bytesToSize(element.Size)
            })

            oncomplite(json)
        }
        else onerror(Lang.translate('torrent_parser_no_responce') + ' (' + url + ')')
    },(a,c)=>{
        onerror(Lang.translate('torrent_parser_no_responce') + ' (' + url + ')')
    })
}

// доки https://wiki.servarr.com/en/prowlarr/search#search-feed
function prowlarr(params = {}, oncomplite, onerror){
    const u = new URL('/api/v1/search', url);
    network.timeout(1000 * Storage.field('parse_timeout'));

    u.searchParams.set('apikey', Storage.field('prowlarr_key'));
    u.searchParams.set('query', params.search);


    if(!params.from_search){
        const isSerial = !!(params.movie.first_air_date || params.movie.last_air_date);

        u.searchParams.set('categories', (params.movie.number_of_seasons > 0 ? 5000 : 2000) + (params.movie.original_language == 'ja' ? ',5070' : ''));
        u.searchParams.set('type', isSerial ? 'tvsearch' : 'search')
    }

    network.native(u.href,(json)=> {
        if(Array.isArray(json)) {
            oncomplite({
                Results: json
                    .filter((e) => e.protocol === 'torrent')
                    .map((e) => {
                        const hash = Utils.hash(e.title);

                        return {
                            Title: e.title,
                            Tracker: e.indexer,
                            size: Utils.bytesToSize(e.size),
                            PublishDate: Utils.strToTime(e.publishDate),
                            Seeders: parseInt(e.seeders),
                            Peers: parseInt(e.leechers),
                            MagnetUri: e.downloadUrl,
                            viewed: viewed(hash),
                            hash
                        }
                    })
            })
        } else {
            onerror(Lang.translate('torrent_parser_no_responce') + ' (' + url + ')')
        }
    },
        ()=>{
        onerror(Lang.translate('torrent_parser_no_responce') + ' (' + url + ')')
    })
}

function torrserver(params = {}, oncomplite, onerror){
    network.timeout(1000 * Storage.field('parse_timeout'));
    
    const u = new URL('/search/', url);
    u.searchParams.set('query', params.search);
    
    network.native(u.href,(json)=>{
        oncomplite({
            Results:json.map((e) => {
                const hash = Utils.hash(e.Title);
                return {
                    Title: e.Title,
                    Tracker: e.Tracker,
                    size: e.Size,
                    PublishDate: Utils.strToTime(e.CreateDate),
                    Seeders: parseInt(e.Seed),
                    Peers: parseInt(e.Peer),
                    MagnetUri: e.Magnet,
                    viewed: viewed(hash),
                    CategoryDesc: e.Categories,
                    bitrate: '-',
                    hash
                }
            })
        })
    },(a,c)=>{
        onerror(Lang.translate('torrent_parser_no_responce') + ' (' + url + ')')
    })
}

function marnet(element, oncomplite, onerror){
    network.timeout(1000 * 15)

    let s = Utils.checkHttp(Storage.field('torlook_site')) + '/'
    let u = Storage.get('native') || Storage.field('torlook_parse_type') == 'native' ? s + element.reguest : url.replace('{q}',encodeURIComponent(s + element.reguest))

    network.native(u,(html)=>{
        let math = html.match(/magnet:(.*?)'/)

        if(math && math[1]){
            element.MagnetUri = 'magnet:' + math[1]

            oncomplite()
        }
        else{
            onerror(Lang.translate('torrent_parser_magnet_error'))
        }
    },(a,c)=>{
        onerror(network.errorDecode(a,c))
    },false,{dataType: 'text'})
}

function clear(){
    network.clear()
}

export default {
    init,
    get,
    torlook,
    jackett,
    marnet,
    clear
}
