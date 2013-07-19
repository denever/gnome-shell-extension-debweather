
const St = imports.gi.St;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;
const Soup = imports.gi.Soup;

// Soup session (see https://bugzilla.gnome.org/show_bug.cgi?id=661323#c64) (Simon Legner)
const _httpSession = new Soup.SessionAsync();
Soup.Session.prototype.add_feature.call(_httpSession, new Soup.ProxyResolverDefault());

let button;

const weather_pool = { '1': 'Debian weather is clear',
		 '2': 'Debian weather is few clouds',
		 '3': 'Debian weather is overcast',
		 '4': 'Debian weather is shower',
		 '5': 'Debian weather is storm'}

const weather_icon_pool = { '1': 'weather-clear',
		 '2': 'weather-few-clouds',
		 '3': 'weather-overcast',
		 '4': 'weather-showers',
		 '5': 'weather-storm'}

function _showHello(text) {
    label = new St.Label({ style_class: 'helloworld-label', text: text });
    Main.uiGroup.add_actor(label);

    label.opacity = 255;

    let monitor = Main.layoutManager.primaryMonitor;

    label.set_position(Math.floor(monitor.width / 2 - label.width / 2),
		      Math.floor(monitor.height / 2 - label.height / 2));

    Tweener.addTween(label,
		     { opacity: 0,
		       time: 2,
		       transition: 'easeOutQuad',
		       onComplete: _hideHello });
}

function _updateIcon(icon_name){
    icon = new St.Icon({ icon_name: icon_name,
			     style_class: 'system-status-icon' });
    button.set_child(icon);
}


function _getDebianWeather(){
    var message = Soup.Message.new('GET', "http://edos.debian.net/edos-debcheck/results/unstable/latest/i386/weather.xml");
    _httpSession.queue_message(message, function(_httpSession, reply)
			       {
				   if(!reply.response_body.data)
				   {
				       return 0;
				   }
				   xml = XML(reply.response_body.data);
				   _showHello(weather_pool[xml.index]);
				   _updateIcon(weather_icon_pool[xml.index]);
			       });
}

function _hideHello() {
    Main.uiGroup.remove_actor(text);
    text = null;
}

function init() {
    button = new St.Bin({ style_class: 'panel-button',
			  reactive: true,
			  can_focus: true,
			  x_fill: true,
			  y_fill: false,
			  track_hover: true });

    let icon = new St.Icon({ icon_name: 'system-run-symbolic',
			     style_class: 'system-status-icon' });

    button.set_child(icon);
    button.connect('button-press-event', _getDebianWeather);
}

get_debweather_url: function() {
    return encodeURI("http://edos.debian.net/edos-debcheck/results/unstable/latest/i386/weather.xml")
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(button, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(button);
}
