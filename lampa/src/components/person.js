import Controller from '../interaction/controller'
import Reguest from '../utils/reguest'
import Scroll from '../interaction/scroll'
import Start from './person/start'
import Line from '../interaction/items/line'
import Api from '../interaction/api'
import Activity from '../interaction/activity'
import Arrays from '../utils/arrays'
import Empty from '../interaction/empty'
import Background from '../interaction/background'
import Layer from '../utils/layer'

let components = {
    start: Start,
    line: Line
}

function component(object){
    let network = new Reguest()
    let scroll  = new Scroll({mask:true,over:true,scroll_by_item: true})
    let items   = []
    let active  = 0
    let poster

    this.create = function(){
        this.activity.loader(true)

        scroll.minus()

        Api.person(object,(data)=>{
            this.activity.loader(false)

            if(data.person){
                poster = data.person.profile_path

                this.build('start', data.person);

                if(data.credits && data.credits.knownFor && data.credits.knownFor.length > 0) {
                    for (let i = 0; i < data.credits.knownFor.length; i++) {
                        let departament = data.credits.knownFor[i]
                        let credits = departament.credits.map(a=>{
                            a.time_sort = new Date(a.first_air_date || a.release_date || '').getTime()
                            
                            return a
                        })

                        credits.sort((a,b)=>b.time_sort - a.time_sort)

                        this.build('line', {
                            title: departament.name,
                            noimage: true,
                            results: credits,
                        })
                    }
                }

                Layer.update(scroll.render(true))
                Layer.visible(scroll.render(true))

                this.activity.toggle()
            }
            else{
                this.empty()
            }
        },this.empty.bind(this))

        return this.render()
    }

    this.empty = function(){
        let empty = new Empty()

        scroll.append(empty.render())

        this.start = empty.start

        this.activity.loader(false)

        this.activity.toggle()
    }

    this.build = function(name, data){
        let item = new components[name](data,{object:object,nomore:true})

        item.onDown = this.down
        item.onUp   = this.up
        item.onBack = this.back
        item.onToggle = ()=>{
            active = items.indexOf(item)
        }

        items.push(item)

        item.create()

        scroll.append(item.render())
    }

    this.down = function(){
        active++

        active = Math.min(active, items.length - 1)

        scroll.update(items[active].render())

        items[active].toggle()
    }

    this.up = function(){
        active--

        if(active < 0){
            active = 0

            Controller.toggle('head')
        }
        else{
            items[active].toggle()

            scroll.update(items[active].render())
        }
    }

    this.back = function(){
        Activity.backward()
    }

    this.start = function(){
        if(Activity.active().activity == this.activity && poster) Background.immediately(poster ? Api.img(poster, 'w200') : '')

        Controller.add('content',{
            toggle: ()=>{
                if(items.length){
                    items[active].toggle()
                }
                else{
                    Controller.collectionSet(scroll.render())
                    Controller.collectionFocus(false,scroll.render())
                }
            },
            update: ()=>{},
            left: ()=>{
                Controller.toggle('menu')
            },
            up: ()=>{
                Controller.toggle('head')
            },
            back: ()=>{
                Activity.backward()
            }
        })

        Controller.toggle('content')
    }

    this.pause = function(){
        
    }

    this.stop = function(){
        
    }

    this.render = function(){
        return scroll.render()
    }

    this.destroy = function(){
        network.clear()

        Arrays.destroy(items)

        scroll.destroy()

        items = []
    }
}

export default component