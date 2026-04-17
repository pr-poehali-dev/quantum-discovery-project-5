export default function Featured() {
  return (
    <div id="features" className="flex flex-col lg:flex-row lg:justify-between lg:items-center min-h-screen px-6 py-12 lg:py-0 bg-white">
      <div className="flex-1 h-[400px] lg:h-[800px] mb-8 lg:mb-0 lg:order-2">
        <img
          src="https://cdn.poehali.dev/projects/210ddf64-ba42-4e5b-8638-20e13fcb83f7/files/f17ce6a6-20e9-4baf-96b3-882badc99d12.jpg"
          alt="AI brain visualization"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 text-left lg:h-[800px] flex flex-col justify-center lg:mr-12 lg:order-1">
        <h3 className="uppercase mb-4 text-sm tracking-wide text-neutral-600">Что умеет NEURA</h3>
        <p className="text-2xl lg:text-4xl mb-8 text-neutral-900 leading-tight">
          Отвечает на любые вопросы, анализирует фотографии, помогает разобраться в сложном — просто пришли картинку или напиши запрос.
        </p>
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-xs uppercase tracking-widest text-neutral-400 mt-1 min-w-fit">01</span>
            <p className="text-neutral-700">Распознаёт текст, объекты и сцены на фото</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xs uppercase tracking-widest text-neutral-400 mt-1 min-w-fit">02</span>
            <p className="text-neutral-700">Отвечает развёрнуто и по существу на любой запрос</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-xs uppercase tracking-widest text-neutral-400 mt-1 min-w-fit">03</span>
            <p className="text-neutral-700">Работает в режиме реального времени, без задержек</p>
          </div>
        </div>
        <button className="bg-black text-white border border-black px-4 py-2 text-sm transition-all duration-300 hover:bg-white hover:text-black cursor-pointer w-fit uppercase tracking-wide">
          Начать сейчас
        </button>
      </div>
    </div>
  );
}