import Utils from '../utils/math'
import Platform from '../utils/platform'
import Template from '../interaction/template'
import Activity from './activity'
import Lang from '../utils/lang'
import Storage from '../utils/storage'
import Controller from './controller'

function init(){
    if(Platform.screen('mobile')){
        let bar = Template.get('navigation_bar',{})

        bar.find('.navigation-bar__item').on('click',function(){
            let action = $(this).data('action')

            if(action == 'back') window.history.back()
            else if(action == 'main'){
                Activity.push({
                    url: '',
                    title: Lang.translate('title_main') + ' - ' + Storage.field('source').toUpperCase(),
                    component: 'main',
                    source: Storage.field('source')
                })
            }
            else if(action == 'search'){
                Lampa.Search.open()
            }
            else if(action == 'settings'){
                Controller.toggle('settings')
            }
        })

        $('body').append(bar)
    }
}

export default {
    init
}