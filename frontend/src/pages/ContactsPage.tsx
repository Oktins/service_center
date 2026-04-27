import { MapPin, Phone, Mail, Clock, MessageSquare, Send } from 'lucide-react';

export default function ContactsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="section-title">Контакты</h1>
        <p className="section-subtitle">Мы всегда на связи и готовы помочь вам</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-6">
              <MapPin className="w-8 h-8 text-primary-600 mb-4" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Адрес</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                г. Минск, ул. Ленина, д. 10, оф. 204
              </p>
            </div>
            
            <div className="card p-6">
              <Clock className="w-8 h-8 text-primary-600 mb-4" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Режим работы</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Пн-Пт: 09:00 - 20:00<br />
                Сб: 10:00 - 18:00<br />
                Вс: Выходной
              </p>
            </div>
            
            <div className="card p-6">
              <Phone className="w-8 h-8 text-primary-600 mb-4" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Телефоны</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                +375 (29) 123-45-67<br />
                +375 (17) 987-65-43
              </p>
            </div>
            
            <div className="card p-6">
              <Mail className="w-8 h-8 text-primary-600 mb-4" />
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Email</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                info@servicehub.by<br />
                support@servicehub.by
              </p>
            </div>
          </div>

          <div className="card p-8">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Напишите нам</h2>
            </div>
            
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Ваше имя" className="input" />
                <input type="email" placeholder="Email" className="input" />
              </div>
              <input type="text" placeholder="Тема сообщения" className="input" />
              <textarea placeholder="Ваше сообщение..." rows={4} className="input resize-none"></textarea>
              <button className="btn-primary w-full flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Отправить сообщение
              </button>
            </form>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="h-full min-h-[400px] card overflow-hidden p-0 bg-gray-100 dark:bg-gray-800 relative group">
          <iframe
            title="Location Map"
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            src="https://www.openstreetmap.org/export/embed.html?bbox=27.550%2C53.895%2C27.570%2C53.905&amp;layer=mapnik&amp;marker=53.900%2C27.560"
            allowFullScreen
          ></iframe>
          <div className="absolute inset-0 bg-primary-600/5 pointer-events-none group-hover:bg-transparent transition-all"></div>
        </div>
      </div>
    </div>
  );
}
