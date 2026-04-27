import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQ_DATA = [
  {
    question: 'Как долго длится ремонт смартфона?',
    answer: 'В большинстве случаев (замена экрана, аккумулятора) ремонт занимает от 1 до 3 часов. Сложный ремонт материнской платы может занять до 3-5 рабочих дней.',
  },
  {
    question: 'Предоставляете ли вы гарантию на ремонт?',
    answer: 'Да, мы предоставляем официальную гарантию на выполненные работы и установленные запчасти сроком от 3 до 12 месяцев.',
  },
  {
    question: 'Какие запчасти вы используете?',
    answer: 'Мы предлагаем на выбор оригинальные запчасти или качественные аналоги (AAA-класс). Клиент всегда знает, какая деталь будет установлена.',
  },
  {
    question: 'Есть ли у вас услуга выезда мастера?',
    answer: 'Да, вы можете вызвать мастера на дом или в офис. Мастер произведет диагностику и несложный ремонт на месте.',
  },
  {
    question: 'Как отследить статус моего заказа?',
    answer: 'Вы можете отследить статус ремонта на главной странице нашего сайта, введя номер вашей заявки в блоке "Отследить заказ".',
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="section-title">Часто задаваемые вопросы</h1>
        <p className="section-subtitle">Найдите ответы на самые популярные вопросы о нашей работе</p>
      </div>

      <div className="space-y-4">
        {FAQ_DATA.map((item, index) => (
          <div 
            key={index} 
            className="card overflow-hidden border-transparent hover:border-primary-300 dark:hover:border-primary-700 transition-all"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center text-primary-600">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {item.question}
                </span>
              </div>
              <ChevronDown 
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
              />
            </button>
            
            <div 
              className={`transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 pb-6 pt-0 ml-12 text-gray-600 dark:text-gray-400">
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 p-8 bg-primary-600 rounded-3xl text-center text-white">
        <h2 className="text-2xl font-bold mb-2">Все еще остались вопросы?</h2>
        <p className="mb-6 opacity-90">Свяжитесь с нами любым удобным способом, и мы поможем!</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="tel:+78005553535" className="px-6 py-2 bg-white text-primary-600 rounded-xl font-bold hover:bg-opacity-90 transition-all">
            Позвонить нам
          </a>
          <button className="px-6 py-2 bg-primary-500 text-white border border-primary-400 rounded-xl font-bold hover:bg-primary-400 transition-all">
            Написать в чат
          </button>
        </div>
      </div>
    </div>
  );
}
