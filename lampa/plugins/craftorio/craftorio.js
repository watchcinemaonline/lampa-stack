function startPlugin() {
    window.plugin_record_ready = true

    
    function add(){
        var getUrl = window.location;
        var baseUrl = getUrl .protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
        var moduleUrl = baseUrl+'plugins/craftorio/module.js';

        const script = document.createElement('script');
        script.type = 'module';
        script.src = moduleUrl;
        document.body.appendChild(script);
    }

    if(window.appready) add()
    else{
        Lampa.Listener.follow('app', function (e) {
            if (e.type == 'ready') add()
        })
    }
}

if(!window.plugin_record_ready) startPlugin()
