import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ymaps: any; // Yandex Maps global
  }
}

const records = [
  { title: "❄️ Абсолютный минимум", value: "-55,1°C", place: "с. Большая Соснова", date: "31 декабря 1978", coords: [57.4167, 54.6000], type: "temp", desc: "Самая низкая температура в истории Пермского края. В Перми в эту же ночь было -47,1°C. Рекорд держится до сих пор." },
  { title: "🔥 Абсолютный максимум", value: "+38,2°C", place: "г. Верещагино", date: "30 июля 2010", coords: [58.0794, 54.6581], type: "temp", desc: "Самая высокая температура, зарегистрированная в регионе. Жара 2010 года стала одной из самых разрушительных." },
  { title: "🧊 Рекордный мороз в Перми", value: "-47,1°C", place: "Пермь", date: "31 декабря 1978", coords: [58.0105, 56.2294], type: "temp", desc: "Абсолютный минимум для краевой столицы. После 1979 года температура ниже -40°C фиксировалась только один раз — 16 декабря 2009 года." },
  { title: "🌡️ Аномальная жара 2023", value: "+37,5...39,2°C", place: "Пермь", date: "11 июля 2023", coords: [58.0105, 56.2294], type: "temp", desc: "Исторический рекорд жары. Температура выше +35°C в Перми фиксировалась в 1920, 1931, 1936, 1940, 1954, 1987, 2010, 2020, 2021 и 2023 годах." },
  { title: "🧊 Самый крупный град", value: "70 мм (диаметр)", place: "с. Протасы, Пермский р-н", date: "20 августа 2008", coords: [57.9167, 55.8333], type: "precip", desc: "Самый крупный град в истории наблюдений. Градины оставляли вмятины на автомобилях." },
  { title: "🌨️ Крупный град 2023", value: "60 мм (диаметр)", place: "с. Кын, Лысьвенский р-н", date: "4 июня 2023", coords: [57.8000, 57.4333], type: "precip", desc: "Самый крупный град за 15 лет. Размером с куриное яйцо. Пострадали крыши и автомобили." },
  { title: "💧 Самый сильный ливень", value: "132 мм/сутки", place: "п. Бисер", date: "19 июля 2007", coords: [58.5000, 58.8667], type: "precip", desc: "Рекорд суточного количества осадков." },
  { title: "🌊 Ливень в Губахе", value: "114 мм/сутки", place: "г. Губаха", date: "25 июня 2015", coords: [58.8667, 57.5833], type: "precip", desc: "Больше месячной нормы осадков за сутки. Самый сильный ливень в регионе за последние годы." },
  { title: "❄️ Рекордный снегопад", value: "33 см снега", place: "Пермь", date: "28-29 апреля 2025", coords: [58.0105, 56.2294], type: "precip", desc: "Главное погодное событие 2025 года по версии Андрея Шихова. В Лысьве высота снега достигла 37 см." },
  { title: "💨 Самый сильный ветер", value: "35 м/с", place: "с. Коса", date: "10 июня 1984", coords: [59.9500, 55.0000], type: "wind", desc: "Максимальная скорость ветра за всю историю наблюдений." },
  { title: "🌪️ Массовые смерчи", value: "16 смерчей за день", place: "Гайнский, Юрлинский р-ны", date: "7 июня 2009", coords: [60.2833, 54.3333], type: "wind", desc: "Уникальное явление: в лесах остались полосы ветровала длиной до 50 км." },
  { title: "🌪️ Смерч в Суксуне", value: "F1 по шкале Фудзиты", place: "п. Суксун", date: "19 августа 2025", coords: [57.1500, 57.4000], type: "wind", desc: "Наиболее значимое конвективное явление 2025 года. Прошел через центр поселка, нанеся значительный ущерб." },
  { title: "🌊 Самый сильный паводок", value: "подъем воды 9 м", place: "г. Кунгур, р. Сылва", date: "май 1979", coords: [57.4333, 56.9333], type: "wind", desc: "Крупнейшее наводнение в истории края. Затопило значительную часть города." },
  { title: "🏔️ Усьвинские столбы", value: "высота 120 м", place: "пос. Усьва", date: "300 млн лет", coords: [58.1672, 57.7667], type: "nature", desc: "'Пермские небоскребы' — скалы высотой 120 м. 300 млн лет назад здесь было море, на скалах — окаменелости морских обитателей." },
  { title: "🧙 Камень Помянённый", value: "мистическое место", place: "Красновишерский р-н", date: "круглый год", coords: [60.4167, 56.7500], type: "mystic", desc: "'Не каждого пускает' — часто окутан туманом даже в хорошую погоду." },
  { title: "🐉 Адово озеро", value: "замкнутый водоем", place: "Гайнский район", date: "круглый год", coords: [60.4000, 54.2500], type: "mystic", desc: "Озеро в окружении болот. Легенды о водяном Вакуле и озерном чудовище. При штиле поднимается волна, способная перевернуть лодку." }
];

const COLORS: Record<string, string> = { temp: "#ff6b6b", precip: "#4dabf7", wind: "#51cf66", nature: "#20c997", mystic: "#9b59b6" };
const TYPE_NAMES: Record<string, string> = { temp: "Температурный рекорд", precip: "Осадки / Град / Ливни", wind: "Ветер / Смерчи / Паводки", nature: "Природная достопримечательность", mystic: "Мистическое место" };
const BADGE_CLASSES: Record<string, string> = { temp: "bg-red-400", precip: "bg-blue-400", wind: "bg-green-400", nature: "bg-teal-400", mystic: "bg-purple-500" };

const FILTERS = [
  { key: "all", label: "Все (16)", cls: "bg-[#004e92]" },
  { key: "temp", label: "🌡️ Температура", cls: "bg-red-400" },
  { key: "precip", label: "💧 Осадки/град", cls: "bg-blue-400" },
  { key: "wind", label: "🌪️ Ветер/смерчи", cls: "bg-green-400" },
  { key: "nature", label: "🏔️ Природа", cls: "bg-teal-400" },
  { key: "mystic", label: "🔮 Мистика", cls: "bg-purple-500" },
];

export default function MapSection() {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstance = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [loaded, setLoaded] = useState(false);

  const apiKey = import.meta.env.VITE_YANDEX_MAPS_API_KEY || "";

  useEffect(() => {
    if (document.getElementById("ymaps-script")) {
      if (window.ymaps) {
        setLoaded(true);
      }
      return;
    }
    const script = document.createElement("script");
    script.id = "ymaps-script";
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
    script.onload = () => setLoaded(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!loaded || !mapRef.current || mapInstance.current) return;
    window.ymaps.ready(() => {
      const map = new window.ymaps.Map(mapRef.current, {
        center: [58.5, 56.5],
        zoom: 6,
        controls: ["zoomControl", "fullscreenControl"],
      });
      mapInstance.current = map;

      records.forEach((r) => {
        const marker = new window.ymaps.Placemark(
          r.coords,
          {
            balloonContentHeader: `<b>${r.title}</b>`,
            balloonContentBody: `
              <div style="max-width:260px;padding:4px 0">
                <p><strong>📊 Значение:</strong> ${r.value}</p>
                <p><strong>📍 Место:</strong> ${r.place}</p>
                <p><strong>📅 Дата:</strong> ${r.date}</p>
                <p style="margin-top:6px">${r.desc}</p>
                <hr style="margin:8px 0"/>
                <p style="font-size:11px;color:#999">Источник: ГИС-центр ПГНИУ, исследования А.Н. Шихова</p>
              </div>`,
          },
          { preset: "islands#icon", iconColor: COLORS[r.type] }
        );
        map.geoObjects.add(marker);
        markersRef.current.push({ marker, type: r.type });
      });
    });
  }, [loaded]);

  useEffect(() => {
    markersRef.current.forEach(({ marker, type }) => {
      marker.options.set("visible", filter === "all" || type === filter);
    });
  }, [filter]);

  const filtered = filter === "all" ? records : records.filter((r) => r.type === filter);

  const focusMarker = (idx: number) => {
    const original = records.findIndex((r) => r === filtered[idx]);
    const r = records[original];
    if (mapInstance.current) {
      mapInstance.current.setCenter(r.coords, 10);
      markersRef.current[original]?.marker.balloon.open();
    }
  };

  return (
    <section className="bg-[#f0f4f8] py-16 px-4" id="map">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-10">
          <p className="uppercase text-sm tracking-wide text-neutral-500 mb-2">Интерактивная карта</p>
          <h2 className="text-3xl md:text-5xl font-bold text-[#004e92]">
            Климатические рекорды<br />Пермского края
          </h2>
          <p className="mt-3 text-neutral-600 text-sm">1975–2025 · По данным ГИС-центра ПГНИУ и исследовательских экспедиций</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div
            ref={mapRef}
            className="flex-[3] rounded-xl shadow-lg border border-gray-200 min-h-[400px] lg:h-[600px] bg-gray-100"
          />

          <div className="flex-1 bg-white rounded-xl shadow-md p-5 overflow-y-auto max-h-[600px]">
            <h3 className="text-[#004e92] font-bold text-base border-b-2 border-yellow-400 pb-2 mb-4">
              📌 16 точек на карте
            </h3>

            <div className="flex flex-wrap gap-2 mb-4">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-3 py-1 rounded-full text-xs font-bold text-white transition-opacity cursor-pointer ${f.cls} ${filter === f.key ? "opacity-100 ring-2 ring-offset-1 ring-black/20" : "opacity-70 hover:opacity-100"}`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="space-y-1">
              {filtered.map((r, i) => (
                <div
                  key={i}
                  onClick={() => focusMarker(i)}
                  className="p-3 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors border-b border-gray-100"
                >
                  <div className="font-bold text-[#004e92] text-sm">{r.title}</div>
                  <div className="text-red-500 font-bold text-sm">{r.value}</div>
                  <div className="text-gray-500 text-xs">📍 {r.place} · {r.date}</div>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-white text-[10px] font-bold ${BADGE_CLASSES[r.type]}`}>
                    {TYPE_NAMES[r.type]}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-gray-400 mt-4 pt-3 border-t border-gray-100">
              📊 Источники: ГИС-центр ПГНИУ, исследования А.Н. Шихова, С.В. Пьянкова<br />
              🗺️ Карта: API Яндекс.Карт
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}