const Soup = imports.gi.Soup;

const _httpSession = new Soup.SessionSync();

Soup.Session.prototype.add_feature.call(_httpSession, new Soup.ProxyResolverDefault());

var message = Soup.Message.new('GET', "http://edos.debian.net/edos-debcheck/results/unstable/latest/i386/weather.xml");

_httpSession.send_message(message);

print(message.response_body.data);
let xml = XML(message.response_body.data);

weather_pool = { '1': 'clear',
		 '2': 'few_clouds',
		 '3': 'overcast',
		 '4': 'shower',
		 '5': 'storm'}

print(weather_pool[xml.index]);
// _httpSession.queue_message(message, function(_httpSession, reply)
// 			   {
// 			       print('Hello!');
// 			       print(reply);
// 			   });
