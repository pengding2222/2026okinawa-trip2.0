import React, { useState, useEffect } from 'react';
import { Map, Info, Wallet, MapPin, Navigation, Phone, Plane, Home, Car, Sun, Cloud, Receipt, Plus, Trash2, Waves, Palmtree } from 'lucide-react';

// --- 1. 專屬行程資料 (包含導遊標籤、電話與氣象平均值) ---
// 氣象資料來源：日本氣象廳 (JMA) 那霸觀測站 3 月份歷史平均氣溫 (約 16°C - 22°C)
const mockItinerary = [
  {
    id: 'day1',
    dayLabel: 'Day 1',
    date: '2026-03-11',
    locationName: '那霸 / 北谷',
    themeColor: 'rose', // 春櫻粉
    weather: { temp: '21°C', condition: '涼爽舒適', icon: <Sun className="text-rose-400" size={24} /> },
    events: [
      { 
        id: 'd1e1', time: '15:55', title: '抵達那霸機場', type: 'transport', location: '那霸機場', 
        description: '搭乘 FD230 航班 (13:30起飛)。',
        tags: [{ type: 'tip', text: '先去上個廁所再出關' }]
      },
      { 
        id: 'd1e2', time: '17:30', title: 'ORIX 租車取車', type: 'transport', location: 'ORIX Rent-a-car Naha Airport', 
        phone: '098-851-0543',
        description: '準備好台灣駕照、日文譯本、護照。我們這次租了兩台車！',
        tags: [
          { type: 'reservation', text: 'Honda 預約代號: 247162932' },
          { type: 'reservation', text: 'Toyota 預約代號: 247162570' }
        ]
      },
      { 
        id: 'd1e3', time: '18:30', title: '民宿 Check in', type: 'hotel', location: 'CONDOMINIUM 紅-BIN-', 
        phone: '090-9781-931',
        description: '先到民宿放行李休息一下。',
        tags: [{ type: 'tip', text: '地址: 7 Chome-9-33 Hiyagon' }]
      },
      { 
        id: 'd1e4', time: '19:00', title: '晚餐：北谷ダイニング ちゃぁぶ～', type: 'food', location: '北谷', 
        phone: '050-5385-8401',
        description: '沖繩的第一餐！享受道地的沖繩料理。',
        tags: [{ type: 'food', text: '必點: 沖繩苦瓜炒蛋、海葡萄' }]
      },
      { 
        id: 'd1e5', time: '21:00', title: 'AEON 永旺夢樂城', type: 'activity', location: 'AEON Okinawa Rycom', 
        phone: '098-930-0425',
        description: '吃飽後直接逛到關門！',
        tags: [{ type: 'shopping', text: '必逛: 超市買宵夜水果' }]
      }
    ]
  },
  {
    id: 'day2',
    dayLabel: 'Day 2',
    date: '2026-03-12',
    locationName: '那霸市區',
    themeColor: 'emerald', // 薄荷綠
    weather: { temp: '22°C', condition: '晴朗', icon: <Sun className="text-emerald-400" size={24} /> },
    events: [
      { id: 'd2e1', time: '09:00', title: '起床準備', type: 'hotel', location: '民宿', description: '09:00 起床，預計 10:00 出門。' },
      { 
        id: 'd2e2', time: '11:00', title: '波上宮', type: 'activity', location: '波上宮', 
        phone: '098-868-3697',
        description: '沖繩八社之首，建在海邊懸崖上的美麗神社。',
        tags: [{ type: 'tip', text: '注意：附近要找停車場！' }, { type: 'shopping', text: '必買: 書包御守' }]
      },
      { 
        id: 'd2e3', time: '13:00', title: '國際通 & 牧志市場', type: 'activity', location: '國際通', 
        description: '車停國際通。逛街採買伴手禮，午餐在這裡解決。',
        tags: [{ type: 'food', text: '必吃: 花生豆腐、香檸汁、豬肉蛋飯糰' }]
      },
      { 
        id: 'd2e4', time: '19:00', title: '晚餐：YAMASHiRO 豬排', type: 'food', location: 'とんかつレストランYAMASHiRO 首里店', 
        phone: '098-917-6340',
        description: '搭電車前往首里吃超人氣炸豬排。',
        tags: [{ type: 'food', text: '必點: 頂級黑豚炸豬排定食' }]
      },
      { id: 'd2e5', time: '21:00', title: 'AEON / 回家', type: 'activity', location: 'AEON', phone: '098-930-0425', description: '回家路上逛超商，今天要早點睡！' }
    ]
  },
  {
    id: 'day3',
    dayLabel: 'Day 3',
    date: '2026-03-13',
    locationName: '北部地區',
    themeColor: 'sky', // 湛藍海
    weather: { temp: '20°C', condition: '海風稍強', icon: <Waves className="text-sky-400" size={24} /> },
    events: [
      { id: 'd3e1', time: '07:30', title: '早起出發', type: 'hotel', location: '民宿', description: '07:30 起床，08:30 出門前往北部。' },
      { 
        id: 'd3e2', time: '09:30', title: '古宇利海洋塔', type: 'activity', location: '古宇利島', 
        phone: '0980-56-1616',
        description: '導航位置設定為停車場。可以去古宇利海灘走走，看跨海大橋。'
      },
      { 
        id: 'd3e3', time: '11:30', title: '午餐：Kouri Shrimp 蝦蝦飯', type: 'food', location: 'Kouri Shrimp', 
        description: '11:00 開始營業，超人氣夏威夷風蒜香蝦蝦飯。預計 12:30 離開。',
        tags: [{ type: 'food', text: '必點: 蒜香奶油蝦蝦飯' }]
      },
      { 
        id: 'd3e4', time: '13:00', title: 'Shinmei Coffee', type: 'food', location: 'Shinmei Coffee Okinawa', 
        description: '買杯飲料解解渴。',
        tags: [{ type: 'food', text: '必喝: 黑糖珍奶' }]
      },
      { 
        id: 'd3e5', time: '14:00', title: '美麗海水族館', type: 'activity', location: '美麗海水族館', 
        phone: '0980-48-3748',
        description: '14:00 前抵達。世界級的大型水族館。',
        tags: [{ type: 'tip', text: '15:00 有黑潮之海鯨鯊餵食秀！' }]
      },
      { 
        id: 'd3e6', time: '17:00', title: '許田休息站', type: 'food', location: '許田休息站', 
        phone: '0980-54-0880',
        description: '回程順路休息。',
        tags: [{ type: 'food', text: '必吃: 現炸天婦羅' }]
      },
      { id: 'd3e7', time: '21:00', title: 'MEGA唐吉軻德 宇流麻店', type: 'shopping', location: 'MEGA唐吉軻德 宇流麻店', phone: '0570-054-511', description: '有空再去，晚上可以去居酒屋小酌。' }
    ]
  },
  {
    id: 'day4',
    dayLabel: 'Day 4',
    date: '2026-03-14',
    locationName: '逛街 Day',
    themeColor: 'amber', // 向日葵黃
    weather: { temp: '23°C', condition: '溫暖晴朗', icon: <Sun className="text-amber-400" size={24} /> },
    events: [
      { id: 'd4e1', time: '08:30', title: '起床準備', type: 'hotel', location: '民宿', description: '08:30 起床，09:30 出門。' },
      { 
        id: 'd4e2', time: '10:00', title: 'Parco City', type: 'shopping', location: 'Parco City', 
        phone: '098-871-1120',
        description: '沖繩最大級海岸購物中心，逛街 DAY！'
      },
      { 
        id: 'd4e3', time: '14:00', title: '港川外人住宅', type: 'activity', location: '港川外人住宅', 
        description: '充滿美式復古風情的小聚落，很多特色甜點店。預計停留 1-1.5 小時。',
        tags: [{ type: 'food', text: '必吃: oHacorte 水果塔' }]
      },
      { 
        id: 'd4e4', time: '16:00', title: '美國村', type: 'activity', location: '美國村', 
        description: '逛街、看夕陽拍照，充滿異國風情。'
      },
      { 
        id: 'd4e5', time: '19:00', title: '晚餐：燒肉金城', type: 'food', location: '燒肉金城 北谷本店', 
        phone: '098-926-1611',
        description: '晚餐吃石垣牛燒肉犒賞自己！',
        tags: [{ type: 'food', text: '必點: 特選石垣牛拼盤' }]
      }
    ]
  },
  {
    id: 'day5',
    dayLabel: 'Day 5',
    date: '2026-03-15',
    locationName: '南部與賦歸',
    themeColor: 'indigo', // 薰衣草紫
    weather: { temp: '19°C', condition: '稍有雲量', icon: <Cloud className="text-indigo-400" size={24} /> },
    events: [
      { id: 'd5e1', time: '09:30', title: '玉泉洞', type: 'activity', location: '玉泉洞', phone: '098-949-7421', description: '日本第二大鐘乳石洞，非常壯觀。' },
      { id: 'd5e2', time: '11:30', title: 'ricoland Okinawa', type: 'shopping', location: 'ricoland Okinawa', phone: '098-943-3451', description: '機車部品專賣店採買。' },
      { 
        id: 'd5e3', time: '13:00', title: '瀨長島 & A&W漢堡', type: 'food', location: '瀨長島 Umikaji Terrace', 
        description: '純白色的希臘風建築，吃漢堡、看飛機起降。',
        tags: [{ type: 'food', text: '必吃: A&W 麥根沙士、圈圈薯條' }]
      },
      { 
        id: 'd5e4', time: '17:30', title: 'ORIX 還車', type: 'transport', location: 'ORIX Rent-a-car Naha Airport', 
        phone: '098-851-0543',
        description: '17:30 前務必還車，記得先加滿油！'
      },
      { 
        id: 'd5e5', time: '20:20', title: '搭機返台 (CI123)', type: 'transport', location: '那霸機場', 
        description: '結束美好的旅程！20:20 起飛，預計 21:00 抵達台灣。',
        tags: [{ type: 'tip', text: '免稅店最後採買機會' }]
      }
    ]
  }
];

// --- 2. 元件：行程卡片 ---
function EventCard({ event, themeColor }: { event: any, themeColor: string, key?: any }) {
  const getIcon = () => {
    switch (event.type) {
      case 'food': return <span className="text-orange-500 text-xl">🍹</span>;
      case 'hotel': return <span className="text-cyan-500 text-xl">🏖️</span>;
      case 'transport': return <span className="text-blue-500 text-xl">🚙</span>;
      case 'shopping': return <span className="text-pink-500 text-xl">🎁</span>;
      default: return <span className="text-emerald-500 text-xl">📸</span>;
    }
  };

  const getTagStyle = (type: string) => {
    switch (type) {
      case 'reservation': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'food': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'shopping': return 'bg-pink-50 text-pink-600 border-pink-100';
      default: return 'bg-sky-50 text-sky-600 border-sky-100';
    }
  };

  const getThemeStyles = () => {
    switch (themeColor) {
      case 'rose': return { border: 'border-rose-100', iconBg: 'bg-rose-50', text: 'text-rose-900', nav: 'bg-rose-500 hover:bg-rose-600' };
      case 'emerald': return { border: 'border-emerald-100', iconBg: 'bg-emerald-50', text: 'text-emerald-900', nav: 'bg-emerald-500 hover:bg-emerald-600' };
      case 'sky': return { border: 'border-sky-100', iconBg: 'bg-sky-50', text: 'text-sky-900', nav: 'bg-sky-500 hover:bg-sky-600' };
      case 'amber': return { border: 'border-amber-100', iconBg: 'bg-amber-50', text: 'text-amber-900', nav: 'bg-amber-500 hover:bg-amber-600' };
      case 'indigo': return { border: 'border-indigo-100', iconBg: 'bg-indigo-50', text: 'text-indigo-900', nav: 'bg-indigo-500 hover:bg-indigo-600' };
      default: return { border: 'border-sky-100', iconBg: 'bg-sky-50', text: 'text-sky-900', nav: 'bg-sky-500 hover:bg-sky-600' };
    }
  };

  const styles = getThemeStyles();

  return (
    <div className={`bg-white rounded-3xl p-5 shadow-sm border ${styles.border} mb-4 relative overflow-hidden group active:scale-[0.98] transition-transform`}>
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${event.type === 'food' ? 'bg-orange-400' : event.type === 'hotel' ? 'bg-cyan-400' : event.type === 'transport' ? 'bg-blue-400' : 'bg-emerald-400'}`} />
      
      <div className="flex items-start gap-4 pl-2">
        <div className="flex flex-col items-center min-w-[48px]">
          <span className={`text-sm font-black ${styles.text} tracking-tight`}>{event.time}</span>
          <div className={`w-10 h-10 rounded-full ${styles.iconBg} flex items-center justify-center mt-2 shadow-inner`}>
            {getIcon()}
          </div>
        </div>
        
        <div className="flex-1 pt-0.5">
          <h3 className="text-lg font-bold text-stone-900 mb-1.5 leading-tight">{event.title}</h3>
          
          <div className="flex items-center gap-1.5 text-stone-400 mb-2.5">
            <MapPin size={14} className="text-stone-300" />
            <span className="text-xs font-medium">{event.location}</span>
          </div>
          
          <p className="text-sm text-stone-600 leading-relaxed mb-3">{event.description}</p>
          
          {event.phone && (
            <div className="flex items-center gap-1.5 text-stone-500 mb-3 bg-stone-50 px-3 py-1.5 rounded-xl w-fit border border-stone-100">
              <Phone size={12} className="text-stone-400" />
              <span className="text-xs font-bold font-mono">車機電話: {event.phone}</span>
            </div>
          )}

          {event.tags && (
            <div className="flex flex-wrap gap-2 mb-3">
              {event.tags.map((tag: any, i: number) => (
                <span key={i} className={`text-[11px] font-bold px-2.5 py-1 rounded-md border ${getTagStyle(tag.type)}`}>
                  {tag.text}
                </span>
              ))}
            </div>
          )}
          
          {event.location !== '那霸機場' && (
            <div className="mt-2">
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-1.5 px-4 py-2 ${styles.nav} rounded-xl text-xs font-bold text-white transition-colors shadow-sm active:scale-95`}
              >
                <Navigation size={14} /> 導航至此
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- 3. 分頁元件：行程 ---
function ItineraryTab() {
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const activeDay = mockItinerary[activeDayIdx];

  const getThemeBg = () => {
    switch (activeDay.themeColor) {
      case 'rose': return 'bg-rose-50/90';
      case 'emerald': return 'bg-emerald-50/90';
      case 'sky': return 'bg-sky-50/90';
      case 'amber': return 'bg-amber-50/90';
      case 'indigo': return 'bg-indigo-50/90';
      default: return 'bg-sky-50/90';
    }
  };

  const getGradient = () => {
    switch (activeDay.themeColor) {
      case 'rose': return 'from-rose-400 to-pink-500';
      case 'emerald': return 'from-emerald-400 to-teal-500';
      case 'sky': return 'from-sky-400 to-blue-500';
      case 'amber': return 'from-amber-400 to-orange-500';
      case 'indigo': return 'from-indigo-400 to-purple-500';
      default: return 'from-sky-400 to-blue-500';
    }
  };

  return (
    <div className="pb-28 pt-6 max-w-md mx-auto">
      <div className="flex items-center justify-between px-6 mb-6">
        <h1 className="text-3xl font-black text-stone-900 tracking-tight">2026 沖繩五天四夜 🚗</h1>
        <Palmtree className="text-emerald-500" size={28} />
      </div>
      
      <div className={`sticky top-0 z-20 ${getThemeBg()} backdrop-blur-xl pt-2 pb-4 px-4 border-b border-white/50 mb-6 shadow-sm transition-colors duration-500`}>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide px-2 pb-1">
          {mockItinerary.map((day, idx) => (
            <button
              key={day.id}
              onClick={() => setActiveDayIdx(idx)}
              className={`flex flex-col items-center min-w-[76px] py-2.5 px-3 rounded-2xl transition-all duration-300 ${
                activeDayIdx === idx 
                  ? 'bg-stone-900 text-white shadow-md scale-105' 
                  : 'bg-white text-stone-400 border border-stone-100 hover:bg-stone-50'
              }`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider mb-1 opacity-80">{day.dayLabel}</span>
              <span className={`text-sm font-black ${activeDayIdx === idx ? 'text-white' : 'text-stone-800'}`}>
                {day.date.split('-').slice(1).join('/')}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-5">
        <div className={`bg-gradient-to-br ${getGradient()} rounded-3xl p-5 mb-6 flex items-center justify-between shadow-md text-white transition-all duration-500`}>
          <div>
            <p className="text-[10px] font-bold text-white/80 mb-1 uppercase tracking-widest">MARCH WEATHER AVG.</p>
            <h2 className="text-xl font-black">{activeDay.locationName}</h2>
            <p className="text-xs text-white/80 mt-0.5">{activeDay.weather.condition}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-black">{activeDay.weather.temp}</span>
            <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm">
              {activeDay.weather.icon}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {activeDay.events.map((event) => (
            <EventCard key={event.id} event={event} themeColor={activeDay.themeColor} />
          ))}
        </div>
        
        <p className="text-[10px] text-stone-400 text-center mt-8 px-4 leading-relaxed">
          氣象來源：日本氣象廳 (JMA) 歷史平均數據。<br/>3 月沖繩早晚溫差大，建議採洋蔥式穿法。
        </p>
      </div>
    </div>
  );
}

// --- 4. 分頁元件：實用資訊 ---
function InfoTab() {
  return (
    <div className="pb-28 pt-6 max-w-md mx-auto px-6">
      <h1 className="text-3xl font-black text-sky-900 mb-8 tracking-tight">旅行手冊</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xs font-black text-sky-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Plane size={14} /> 航班資訊
          </h2>
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-sky-50">
            <div className="mb-4 pb-4 border-b border-sky-50">
              <span className="inline-block px-2 py-1 bg-sky-50 text-sky-600 text-[10px] font-bold rounded mb-2">去程 3/11</span>
              <div className="flex justify-between items-center">
                <div className="text-lg font-black text-stone-800">FD230</div>
                <div className="text-right">
                  <div className="text-sm font-bold text-stone-800">13:30 起飛</div>
                  <div className="text-xs text-stone-400">15:15 降落</div>
                </div>
              </div>
            </div>
            <div>
              <span className="inline-block px-2 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold rounded mb-2">回程 3/15</span>
              <div className="flex justify-between items-center">
                <div className="text-lg font-black text-stone-800">CI123</div>
                <div className="text-right">
                  <div className="text-sm font-bold text-stone-800">20:20 起飛</div>
                  <div className="text-xs text-stone-400">21:00 降落</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-black text-sky-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Home size={14} /> 住宿資訊
          </h2>
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-sky-50">
            <h3 className="text-base font-bold text-stone-900 mb-1">CONDOMINIUM 紅-BIN-</h3>
            <p className="text-sm text-stone-400 mb-4">入住: 3/11 18:30</p>
            <div className="bg-sky-50/50 p-3 rounded-xl border border-sky-100">
              <p className="text-[10px] font-bold text-sky-400 mb-1 uppercase">民宿地址</p>
              <p className="text-sm font-medium text-sky-900 select-all">7 Chome-9-33 Hiyagon, Okinawa, 904-2173日本</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-black text-sky-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Car size={14} /> 租車資訊
          </h2>
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-sky-50">
            <h3 className="text-base font-bold text-stone-900 mb-3">ORIX Rent-a-car 那霸機場店</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-sky-50/30 p-3 rounded-xl border border-sky-100">
                <span className="text-sm font-bold text-stone-800">Honda 車輛</span>
                <span className="text-xs font-black text-rose-600 bg-rose-50 px-2 py-1 rounded">代號: 247162932</span>
              </div>
              <div className="flex justify-between items-center bg-sky-50/30 p-3 rounded-xl border border-sky-100">
                <span className="text-sm font-bold text-stone-800">Toyota 車輛</span>
                <span className="text-xs font-black text-rose-600 bg-rose-50 px-2 py-1 rounded">代號: 247162570</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-black text-sky-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Phone size={14} /> 緊急聯絡
          </h2>
          <div className="bg-white rounded-3xl p-2 shadow-sm border border-sky-50">
            <div className="flex justify-between items-center p-3 border-b border-sky-50">
              <span className="text-sm font-bold text-stone-800">報警 (警察)</span>
              <a href="tel:110" className="flex items-center gap-1.5 text-sky-600 bg-sky-50 px-4 py-2 rounded-xl text-sm font-black active:scale-95 transition-transform"><Phone size={14} /> 110</a>
            </div>
            <div className="flex justify-between items-center p-3 border-b border-sky-50">
              <span className="text-sm font-bold text-stone-800">救護車/消防</span>
              <a href="tel:119" className="flex items-center gap-1.5 text-rose-600 bg-rose-50 px-4 py-2 rounded-xl text-sm font-black active:scale-95 transition-transform"><Phone size={14} /> 119</a>
            </div>
            <div className="flex justify-between items-center p-3">
              <span className="text-sm font-bold text-stone-800">駐日代表處<br/><span className="text-[10px] text-stone-400 font-normal">那霸分處</span></span>
              <a href="tel:098-862-7008" className="flex items-center gap-1.5 text-stone-700 bg-stone-100 px-4 py-2 rounded-xl text-sm font-black active:scale-95 transition-transform"><Phone size={14} /> 撥打</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// --- 5. 分頁元件：記帳表 (含台幣換算 + 持久化) ---
function ExpenseTab() {
  const [expenses, setExpenses] = useState<{id: number, desc: string, amount: number}[]>(() => {
    const saved = localStorage.getItem('okinawa_expenses');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [exchangeRate, setExchangeRate] = useState<number>(() => {
    const saved = localStorage.getItem('okinawa_exchange_rate');
    return saved ? Number(saved) : 0.20;
  });

  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [isEditingRate, setIsEditingRate] = useState(false);

  useEffect(() => {
    localStorage.setItem('okinawa_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('okinawa_exchange_rate', exchangeRate.toString());
  }, [exchangeRate]);

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !amount) return;
    setExpenses([{ id: Date.now(), desc, amount: Number(amount) }, ...expenses]);
    setDesc('');
    setAmount('');
  };

  const deleteExpense = (id: number) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const totalJPY = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalTWD = Math.round(totalJPY * exchangeRate);

  return (
    <div className="pb-28 pt-6 max-w-md mx-auto px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-black text-sky-900 tracking-tight">旅行記帳</h1>
        <button 
          onClick={() => setIsEditingRate(!isEditingRate)}
          className="text-[10px] font-bold bg-sky-100 text-sky-600 px-3 py-1.5 rounded-full active:scale-95 transition-transform"
        >
          {isEditingRate ? '完成設定' : `匯率: ${exchangeRate}`}
        </button>
      </div>
      
      {isEditingRate && (
        <div className="mb-6 p-4 bg-white rounded-2xl border border-sky-100 shadow-sm animate-in fade-in slide-in-from-top-2">
          <label className="block text-[10px] font-black text-sky-400 uppercase tracking-widest mb-2">設定日幣匯率 (台銀賣出價參考)</label>
          <div className="flex gap-2">
            <input 
              type="number" 
              step="0.001"
              value={exchangeRate}
              onChange={(e) => setExchangeRate(Number(e.target.value))}
              className="flex-1 bg-sky-50 border border-sky-100 rounded-xl px-4 py-2 text-sm font-bold text-sky-900 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-3xl p-6 text-white mb-6 shadow-lg relative overflow-hidden">
        <div className="absolute -right-4 -top-4 opacity-10 rotate-12"><Waves size={120} /></div>
        <p className="text-[10px] font-bold text-sky-100 mb-1 uppercase tracking-widest">Total Expenses (JPY)</p>
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-xl font-medium">¥</span>
          <span className="text-4xl font-black tracking-tighter">{totalJPY.toLocaleString()}</span>
        </div>
        <div className="pt-4 border-t border-white/20">
          <p className="text-[10px] font-bold text-sky-100 mb-1 uppercase tracking-widest">Estimated TWD (Rate {exchangeRate})</p>
          <div className="flex items-baseline gap-1 text-yellow-300">
            <span className="text-sm font-medium">NT$</span>
            <span className="text-xl font-black">{totalTWD.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <form onSubmit={addExpense} className="space-y-3 mb-8">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-300 font-black text-lg">¥</span>
            <input 
              type="number" 
              placeholder="金額" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-white border border-sky-100 rounded-2xl pl-10 pr-4 py-4 text-xl font-black text-sky-900 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 shadow-sm placeholder:text-sky-100"
            />
          </div>
          <button type="submit" className="bg-sky-500 text-white px-6 rounded-2xl hover:bg-sky-600 active:scale-95 transition-all shadow-md flex items-center justify-center">
            <Plus size={28} strokeWidth={3} />
          </button>
        </div>
        <input 
          type="text" 
          placeholder="項目 (例: 蝦蝦飯、伴手禮)" 
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full bg-white border border-sky-100 rounded-2xl px-5 py-3 text-sm font-medium focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 shadow-sm placeholder:text-stone-300"
        />
      </form>

      <div className="space-y-3">
        {expenses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Receipt size={32} className="text-sky-200" />
            </div>
            <p className="text-sky-300 text-sm font-bold">還沒有任何花費紀錄</p>
          </div>
        ) : (
          expenses.map(exp => (
            <div key={exp.id} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-sky-50 shadow-sm group">
              <span className="text-sm font-bold text-stone-700">{exp.desc}</span>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-black text-sky-900">¥ {exp.amount.toLocaleString()}</div>
                  <div className="text-[10px] font-bold text-sky-300">NT$ {Math.round(exp.amount * exchangeRate).toLocaleString()}</div>
                </div>
                <button onClick={() => deleteExpense(exp.id)} className="text-stone-200 hover:text-rose-500 transition-colors p-1">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// --- 主程式 ---
export default function App() {
  const [activeTab, setActiveTab] = useState('itinerary');

  return (
    <div className="min-h-screen bg-sky-50/30 font-sans selection:bg-sky-100">
      <main className="max-w-md mx-auto">
        {activeTab === 'itinerary' && <ItineraryTab />}
        {activeTab === 'info' && <InfoTab />}
        {activeTab === 'expense' && <ExpenseTab />}
      </main>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-sky-100 pb-safe z-50">
        <div className="max-w-md mx-auto flex justify-around items-center px-2 py-2">
          <button onClick={() => setActiveTab('itinerary')} className={`flex flex-col items-center gap-1 w-20 py-2 rounded-2xl transition-all duration-300 ${activeTab === 'itinerary' ? 'text-sky-600 bg-sky-50' : 'text-stone-300 hover:text-sky-400'}`}>
            <Map size={22} strokeWidth={activeTab === 'itinerary' ? 2.5 : 2} />
            <span className="text-[10px] font-black tracking-widest">行程</span>
          </button>
          <button onClick={() => setActiveTab('info')} className={`flex flex-col items-center gap-1 w-20 py-2 rounded-2xl transition-all duration-300 ${activeTab === 'info' ? 'text-sky-600 bg-sky-50' : 'text-stone-300 hover:text-sky-400'}`}>
            <Info size={22} strokeWidth={activeTab === 'info' ? 2.5 : 2} />
            <span className="text-[10px] font-black tracking-widest">手冊</span>
          </button>
          <button onClick={() => setActiveTab('expense')} className={`flex flex-col items-center gap-1 w-20 py-2 rounded-2xl transition-all duration-300 ${activeTab === 'expense' ? 'text-sky-600 bg-sky-50' : 'text-stone-300 hover:text-sky-400'}`}>
            <Wallet size={22} strokeWidth={activeTab === 'expense' ? 2.5 : 2} />
            <span className="text-[10px] font-black tracking-widest">記帳</span>
          </button>
        </div>
      </div>
    </div>
  );
}
