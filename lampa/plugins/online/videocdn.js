function videocdn(component, _object){
    let network  = new Lampa.Reguest()
    let extract  = {}
    let results  = []
    let object   = _object
    let select_title = ''
    let get_links_wait = false

    let filter_items = {}

    let choice = {
        season: 0,
        voice: 0,
        voice_name: '',
        voice_id: 0
    }

    /**
     * Начать поиск
     * @param {Object} _object 
     */
    this.search = function(_object, data){
        object = _object

        select_title = object.movie.title

        get_links_wait = true

        let url  = component.proxy('videocdn') + 'http://cdn.svetacdn.in/api/'
        let itm  = data[0]
        let type = itm.iframe_src.split('/').slice(-2)[0]

        if(type == 'movie') type = 'movies'

        url += type

        url = Lampa.Utils.addUrlComponent(url,'api_token=3i40G5TSECmLF77oAqnEgbx61ZWaOYaE')
        url = Lampa.Utils.addUrlComponent(url,itm.imdb_id ? 'imdb_id='+encodeURIComponent(itm.imdb_id) : 'title='+encodeURIComponent(itm.title))
        url = Lampa.Utils.addUrlComponent(url,'field='+encodeURIComponent('global'))

        network.silent(url, (found) => {
            results = found.data.filter(elem=>elem.id == itm.id)

            success(results)

            component.loading(false)

            if(!results.length) component.emptyForQuery(select_title)

        },(a,c)=>{
            component.empty(network.errorDecode(a, c))
        })
    }

    this.extendChoice = function(saved){
        Lampa.Arrays.extend(choice, saved, true)
    }

    /**
     * Сброс фильтра
     */
    this.reset = function(){
        component.reset()

        choice = {
            season: 0,
            voice: 0,
            voice_name: '',
            voice_id: 0
        }

        filter()

        append(filtred())

        component.saveChoice(choice)
    }

    /**
     * Применить фильтр
     * @param {*} type 
     * @param {*} a 
     * @param {*} b 
     */
    this.filter = function(type, a, b){
        choice[a.stype] = b.index

        if(a.stype == 'voice'){
            choice.voice_name = filter_items.voice[b.index]
            choice.voice_id = filter_items.voice_info[b.index] && filter_items.voice_info[b.index].id
        } 

        component.reset()

        filter()

        append(filtred())

        component.saveChoice(choice)
    }

    /**
     * Уничтожить
     */
    this.destroy = function(){
        network.clear()

        results = null
    }

    /**
     * Успешно, есть данные
     * @param {Object} json 
     */
    function success(json){
        results = json

        extractData(json)

        filter()

        append(filtred())
    }

    /**
     * Получить потоки
     * @param {String} str 
     * @param {Int} max_quality 
     * @returns string
     */
    function extractFile(str, max_quality){
        let url = ''

        try{
            let items = str.split(',').map(item=>{
                return {
                    quality: parseInt(item.match(/\[(\d+)p\]/)[1]),
                    file: item.replace(/\[\d+p\]/,'').split(' or ')[0]
                }
            })

            items.sort((a,b)=>{
                return b.quality - a.quality
            })

            url = items[0].file
            url = 'http:' + url.slice(0, url.lastIndexOf('/')) + '/' + (max_quality || items[0].quality) + '.mp4'
        }
        catch(e){}

        return url
    }

    function extractItems(str, max_quality){
        try{
            let items = str.split(',').map(item=>{
                return {
                    quality: parseInt(item.match(/\[(\d+)p\]/)[1]),
                    file: 'http:' + item.replace(/\[\d+p\]/,'').split(' or ')[0]
                }
            }).filter(item=>{
                return item.quality <= max_quality
            })

            items.sort((a,b)=>{
                return b.quality - a.quality
            })

            return items
        }
        catch(e){}

        return []
    }

    /**
     * Получить информацию о фильме
     * @param {Arrays} results 
     */
    function extractData(results){
        network.timeout(20000)

        let movie = results.slice(0,1)[0]

        extract = {}

        if(movie){
            let src = movie.iframe_src;

            network.native('http:'+src,(raw)=>{
                get_links_wait = false

                component.render().find('.broadcast__scan').remove()

                let math = raw.replace(/\n/g,'').match(/id="files" value="(.*?)"/)

                if(math){
                    let json = Lampa.Arrays.decodeJson(math[1].replace(/&quot;/g,'"'),{})
                    var text = document.createElement("textarea")

                    for(let i in json){
                        if (0 === (i - 0)) {
                            continue;
                        }
                        
                        text.innerHTML = json[i]

                        Lampa.Arrays.decodeJson(text.value,{})
                        
                        let max_quality = movie.media?.filter(obj => obj.translation_id === (i - 0))[0]?.max_quality;

                        if (!max_quality) {
                            max_quality = movie.translations?.filter(obj => obj.id === (i - 0))[0]?.max_quality;
                        }

                        extract[i] = {
                            json: Lampa.Arrays.decodeJson(text.value,{}),
                            //file: extractFile(json[i], max_quality)
                            items: extractItems(json[i], max_quality)
                        }

                        for(let a in extract[i].json){
                            let elem = extract[i].json[a]

                            if(elem.folder){
                                for(let f in elem.folder){
                                    let folder = elem.folder[f]
                                    
                                    //folder.file = extractFile(folder.file, max_quality)
                                    folder.items = extractItems(folder.file, max_quality)
                                }
                            }
                            //else elem.file = extractFile(elem.file, max_quality)
                            else elem.items = extractItems(elem.file, max_quality)
                        }
                    }
                }

            },()=>{
                get_links_wait = false

                component.render().find('.broadcast__scan').remove()
            },false,{dataType: 'text'})
        }
    }

    /**
     * Найти поток
     * @param {Object} element 
     * @param {Int} max_quality
     * @returns string
     */
    function getFile(element, max_quality){
        let translat = extract[element.translation]
        let id       = element.season+'_'+element.episode
        let file     = ''
        let items    = []
        let quality  = false

        if(translat){
            if(element.season){
                for(let i in translat.json){
                    let elem = translat.json[i]

                    if(elem.folder){
                        for(let f in elem.folder){
                            let folder = elem.folder[f]

                            if(folder.id == id){
                                //file = folder.file
                                items = folder.items

                                break
                            } 
                        }
                    }
                    else if(elem.id == id){
                        //file = elem.file
                        items = elem.items

                        break
                    }
                }
            }
            else{
                //file = translat.file
                items = translat.items
            } 
        }

        max_quality = parseInt(max_quality)

        /*
        if(file){
            let path = file.slice(0, file.lastIndexOf('/')) + '/'

            if(file.split('/').pop().replace('.mp4','') !== max_quality){
                file = path + max_quality + '.mp4'
            }

            quality = {}

            let mass = [1080,720,480,360]
                mass = mass.slice(mass.indexOf(max_quality))

                mass.forEach((n)=>{
                    quality[n + 'p'] = path + n + '.mp4'
                })
            
            let preferably = Lampa.Storage.get('video_quality_default','1080') + 'p'
            
            if(quality[preferably]) file = quality[preferably]
        }
        */

        if(items && items.length){
            quality = {}

            let mass = [1080,720,480,360]
                mass = mass.slice(mass.indexOf(max_quality))

                mass.forEach((n)=>{
                    let exes = items.find(a=>a.quality == n)

                    if(exes){
                        if(!file) file = exes.file

                        quality[n + 'p'] = exes.file
                    }
                })

            let preferably = Lampa.Storage.get('video_quality_default','1080') + 'p'
        
            if(quality[preferably]) file = quality[preferably]
        }

        return {
            file: file,
            quality: quality
        }
    }

    /**
     * Построить фильтр
     */
    function filter(){
        filter_items  = {
            season: [],
            voice: [],
            voice_info: []
        }
        
        results.slice(0,1).forEach(movie => {
            if(movie.season_count){
                let s = movie.season_count

                while(s--){
                    filter_items.season.push(Lampa.Lang.translate('torrent_serial_season') + ' ' + (movie.season_count - s))
                }
            }

            if(filter_items.season.length){
                movie.episodes.forEach(episode=>{
                    if(episode.season_num == choice.season + 1){
                        episode.media.forEach(media=>{
                            if(!filter_items.voice_info.find(v=>v.id == media.translation.id)){
                                filter_items.voice.push(media.translation.shorter_title)
                                filter_items.voice_info.push({
                                    id: media.translation.id
                                })
                            }
                        })
                    }
                })
            }
        })

        if(choice.voice_name){
            let inx = -1

            if(choice.voice_id){
                let voice = filter_items.voice_info.find(v=>v.id == choice.voice_id)

                if(voice) inx = filter_items.voice_info.indexOf(voice)
            }

            if(inx == -1) inx = filter_items.voice.indexOf(choice.voice_name)
            
            if(inx == -1) choice.voice = 0
            else if(inx !== choice.voice){
                choice.voice = inx
            }
        }

        component.filter(filter_items, choice)
    }

    /**
     * Отфильтровать файлы
     * @returns array
     */
    function filtred(){
        let filtred = []

        let filter_data = Lampa.Storage.get('online_filter','{}')
        
        if(object.movie.number_of_seasons){
            results.slice(0,1).forEach(movie=>{
                movie.episodes.forEach(episode=>{
                    if(episode.season_num == filter_data.season + 1){
                        let temp   = episode.media.map(m=>m)
                        let unique = []

                        temp.sort((a,b)=>{
                            return b.max_quality - a.max_quality
                        })

                        temp.forEach(m=>{
                            if(!unique.find(a=>a.translation.id == m.translation.id)){
                                unique.push(m)
                            }
                        })

                        episode.media.forEach(media=>{
                            if(media.translation.id == filter_items.voice_info[filter_data.voice].id && unique.indexOf(media) !== -1){
                                filtred.push({
                                    episode: parseInt(episode.num),
                                    season: episode.season_num,
                                    title: episode.num + ' - ' + episode.ru_title,
                                    quality: media.max_quality + 'p',
                                    translation: media.translation_id
                                })
                            }
                        })
                    }
                })
            })
        }
        else{
            results.slice(0,1).forEach(movie=>{
                movie.media.forEach(element=>{
                    filtred.push({
                        title: element.translation.title,
                        quality: element.max_quality + 'p' + (element.source_quality ? ' - ' + element.source_quality.toUpperCase() : ''),
                        translation: element.translation_id
                    })
                })
            })
        }

        return filtred
    }

    /**
     * Добавить видео
     * @param {Array} items 
     */
    function append(items){
        component.reset()

        if(get_links_wait) component.append($('<div class="broadcast__scan"><div></div></div>'))

        let viewed = Lampa.Storage.cache('online_view', 5000, [])

        let last_episode = component.getLastEpisode(items)

        items.forEach(element => {
            if(element.season) element.title = 'S'+element.season + ' / ' + Lampa.Lang.translate('torrent_serial_episode') + ' ' + element.title

            element.info = element.season ? ' / ' + filter_items.voice[choice.voice] : ''

            if(element.season){
                element.translate_episode_end = last_episode
                element.translate_voice       = filter_items.voice[choice.voice]
            }

            let hash = Lampa.Utils.hash(element.season ? [element.season,element.episode,object.movie.original_title].join('') : object.movie.original_title)
            let view = Lampa.Timeline.view(hash)
            let item = Lampa.Template.get('online',element)

            let hash_file = Lampa.Utils.hash(element.season ? [element.season,element.episode,object.movie.original_title,filter_items.voice[choice.voice]].join('') : object.movie.original_title + element.title)

            item.addClass('video--stream')

            element.timeline = view

            item.append(Lampa.Timeline.render(view))

            if(Lampa.Timeline.details){
                item.find('.online__quality').append(Lampa.Timeline.details(view,' / '))
            }

            if(viewed.indexOf(hash_file) !== -1) item.append('<div class="torrent-item__viewed">'+Lampa.Template.get('icon_star',{},true)+'</div>')

            item.on('hover:enter',()=>{
                if(object.movie.id) Lampa.Favorite.add('history', object.movie, 100)

                let extra = getFile(element, element.quality ,true)

                if(extra.file){
                    let playlist = []
                    let first = {
                        url: extra.file,
                        quality: extra.quality,
                        timeline: view,
                        title: element.season ? element.title : object.movie.title + ' / ' + element.title
                    }

                    if(element.season){
                        items.forEach(elem=>{
                            let ex = getFile(elem, elem.quality)

                            playlist.push({
                                title: elem.title,
                                url: ex.file,
                                quality: ex.quality,
                                timeline: elem.timeline
                            })
                        })
                    }
                    else{
                        playlist.push(first)
                    }

                    if(playlist.length > 1) first.playlist = playlist

                    Lampa.Player.play(first)

                    Lampa.Player.playlist(playlist)

                    if(viewed.indexOf(hash_file) == -1){
                        viewed.push(hash_file)

                        item.append('<div class="torrent-item__viewed">'+Lampa.Template.get('icon_star',{},true)+'</div>')

                        Lampa.Storage.set('online_view', viewed)
                    }
                }
                else Lampa.Noty.show(Lampa.Lang.translate(get_links_wait ? 'online_waitlink' : 'online_nolink'))
            })

            component.append(item)

            component.contextmenu({
                item,
                view,
                viewed,
                hash_file,
                element,
                file: (call)=>{call(getFile(element, element.quality ,true))}
            })
        })

        component.start(true)
    }
}

export default videocdn