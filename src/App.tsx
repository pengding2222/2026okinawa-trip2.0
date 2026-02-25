import React, { useState } from 'react';
import { Map, Info, Wallet, MapPin, Navigation, Phone, Plane, Home, Car, Sun, Cloud, Receipt, Plus, Trash2 } from 'lucide-react';

// --- 1. 專屬行程資料 (包含導遊標籤) ---
const mockItinerary = [
  {
    id: 'day1',
    dayLabel: 'Day 1',
    date: '2026-03-11',
    locationName: '那霸 / 北谷',
    weather: { temp: '24°C', condition: '晴時多雲', icon: <Sun className="text-orange-400" size={24} /> },
    events: [
      { 
        id: 'd1e1', time: '15:55', title: '抵達那霸機場', type: 'transport', location: '那霸機場', 
        description: '搭乘 FD230 航班 (13:30起飛)。降落後不需要輸入車機也不用導航至此。',
        tags: [{ type: 'tip', text: '先去上個廁所再出關' }]
      },
      { 
        id: 'd1e2', time: '17:30', title: 'ORIX 租車取車', type: 'transport', location: 'ORIX Rent-a-car Naha Airport', 
        description: '準備好台灣駕照、日文譯本、護照。我們這次租了兩台車！',
        tags: [
          { type: 'reservation', text: 'Honda 預約代號: 247162932' },
          { type: 'reservation', text: 'Toyota 預約代號: 247162570' }
        ]
      },
      { 
        id: 'd1e3', time: '18:30', title: '民宿 Check in', type: 'hotel', location: 'CONDOMINIUM 紅-BIN-', 
        description: '先到民宿放行李休息一下。',
        tags: [{ type: 'tip', text: '地址: 7 Chome-9-33 Hiyagon' }]
      },
      { 
        id: 'd1e4', time: '19:00', title: '晚餐：北谷ダイニング ちゃぁぶ～', type: 'food', location: '北谷', 
        description: '沖繩的第一餐！享受道地的沖繩料理。',
        tags: [{ type: 'food', text: '必點: 沖繩苦瓜炒蛋、海葡萄' }]
      },
      { 
        id: 'd1e5', time: '21:00', title: 'AEON 永旺夢樂城', type: 'activity', location: 'AEON Okinawa Rycom', 
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
    weather: { temp: '25°C', condition: '晴朗', icon: <Sun className="text-orange-400" size={24} /> },
    events: [
      { id: 'd2e1', time: '09:00', title: '起床準備', type: 'hotel', location: '民宿', description: '09:00 起床，預計 10:00 出門。' },
      { 
        id: 'd2e2', time: '11:00', title: '波上宮', type: 'activity', location: '波上宮', 
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
        description: '搭電車前往首里吃超人氣炸豬排。',
        tags: [{ type: 'food', text: '必點: 頂級黑豚炸豬排定食' }]
      },
      { id: 'd2e5', time: '21:00', title: 'AEON / 回家', type: 'activity', location: 'AEON', description: '回家路上逛超商，今天要早點睡！' }
    ]
  },
  {
    id: 'day3',
    dayLabel: 'Day 3',
    date: '2026-03-13',
    locationName: '北部地區',
    weather: { temp: '23°C', condition: '多雲', icon: <Cloud className="text-stone-400" size={24} /> },
    events: [
      { id: 'd3e1', time: '07:30', title: '早起出發', type: 'hotel', location: '民宿', description: '07:30 起床，08:30 出門前往北部。' },
      { 
        id: 'd3e2', time: '09:30', title: '古宇利海洋塔', type: 'activity', location: '古宇利島', 
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
        description: '14:00 前抵達。世界級的大型水族館。',
        tags: [{ type: 'tip', text: '15:00 有黑潮之海鯨鯊餵食秀！' }]
      },
      { 
        id: 'd3e6', time: '17:00', title: '許田休息站', type: 'food', location: '許田休息站', 
        description: '回程順路休息。',
        tags: [{ type: 'food', text: '必吃: 現炸天婦羅' }]
      },
      { id: 'd3e7', time: '21:00', title: 'MEGA唐吉軻德 宇流麻店', type: 'shopping', location: 'MEGA唐吉軻德 宇流麻店', description: '有空再去，晚上可以去居酒屋小酌。' }
    ]
  },
  {
    id: 'day4',
    dayLabel: 'Day 4',
    date: '2026-03-14',
    locationName: '逛街 Day',
    weather: { temp: '26°C', condition: '晴朗', icon: <Sun className="text-orange-400" size={24} /> },
    events: [
      { id: 'd4e1', time: '08:30', title: '起床準備', type: 'hotel', location: '民宿', description: '08:30 起床，09:30 出門。' },
      { 
        id: 'd4e2', time: '10:00', title: 'Parco City', type: 'shopping', location: 'Parco City', 
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
    weather: { temp: '24°C', condition: '晴時多雲', icon: <Sun className="text-orange-400" size={24} /> },
    events: [
      { id: 'd5e1', time: '09:30', title: '玉泉洞', type: 'activity', location: '玉泉洞', description: '日本第二大鐘乳石洞，非常壯觀。' },
      { id: 'd5e2', time: '11:30', title: 'ricoland Okinawa', type: 'shopping', location: 'ricoland Okinawa', description: '機車部品專賣店採買。' },
      { 
        id: 'd5e3', time: '13:00', title: '瀨長島 & A&W漢堡', type: 'food', location: '瀨長島 Umikaji Terrace', 
        description: '純白色的希臘風建築，吃漢堡、看飛機起降。',
        tags: [{ type: 'food', text: '必吃: A&W 麥根沙士、圈圈薯條' }]
      },
      { 
        id: 'd5e4', time: '17:30', title: 'ORIX 還車', type: 'transport', location: 'ORIX Rent-a-car Naha Airport', 
        description: '17:30 前務必還車，記得先加滿油！'
      },
      { 
        id: 'd5e5', time: '20:20', title: '搭機返台 (CI123)', type: 'transport', location: '那霸機場', 
        description: '結束美好的旅程！20:20 起飛，預計 21:00 抵達台灣。不需要輸入車機也不用導航至此。',
        tags: [{ type: 'tip', text: '免稅店最後採買機會' }]
      }
    ]
  }
];

// --- 2. 元件：行程卡片 ---
function EventCard({ event }: { event: any }) {
  const getIcon = () => {
    switch (event.type) {
      case 'food': return <span className="text-orange-500 text-xl">🍜</span>;
      case 'hotel': return <span className="text-indigo-500 text-xl">🏨</span>;
      case 'transport': return <span className="text-blue-500 text-xl">🚗</span>;
      case 'shopping': return <span className="text-purple-500 text-xl">🛍️</span>;
      default: return <span className="text-emerald-500 text-xl">📸</span>;
    }
  };

  const getTagStyle = (type: string) => {
    switch (type) {
      case 'reservation': return 'bg-red-50 text-red-600 border-red-100';
      case 'food': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'shopping': return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-stone-100 mb-4 relative overflow-hidden">
      {/* 側邊裝飾線 */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${event.type === 'food' ? 'bg-orange-400' : event.type === 'hotel' ? 'bg-indigo-400' : event.type === 'transport' ? 'bg-blue-400' : 'bg-emerald-400'}`} />
      
      <div className="flex items-start gap-4 pl-2">
        <div className="flex flex-col items-center min-w-[48px]">
          <span className="text-sm font-black text-stone-800 tracking-tight">{event.time}</span>
          <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center mt-2 shadow-inner">
            {getIcon()}
          </div>
        </div>
        
        <div className="flex-1 pt-0.5">
          <h3 className="text-lg font-bold text-stone-900 mb-1.5 leading-tight">{event.title}</h3>
          
          <div className="flex items-center gap-1.5 text-stone-500 mb-2.5">
            <MapPin size={14} className="text-stone-400" />
            <span className="text-xs font-medium">{event.location}</span>
          </div>
          
          <p className="text-sm text-stone-600 leading-relaxed mb-3">{event.description}</p>
          
          {/* 導遊標籤區塊 */}
          {event.tags && (
            <div className="flex flex-wrap gap-2 mb-3">
              {event.tags.map((tag: any, i: number) => (
                <span key={i} className={`text-[11px] font-bold px-2.5 py-1 rounded-md border ${getTagStyle(tag.type)}`}>
                  {tag.text}
                </span>
              ))}
            </div>
          )}
          
          <div className="mt-2">
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 rounded-xl text-xs font-bold text-white hover:bg-stone-800 transition-colors shadow-sm active:scale-95"
            >
              <Navigation size={14} /> 導航至此
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 3. 分頁元件：行程 ---
function ItineraryTab() {
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const activeDay = mockItinerary[activeDayIdx];

  return (
    <div className="pb-28 pt-6 max-w-md mx-auto">
      <h1 className="text-3xl font-black text-stone-900 mb-6 px-6 tracking-tight">沖繩自駕之旅</h1>
      
      {/* 需求1: 天數固定在畫面上方 (Sticky) */}
      <div className="sticky top-0 z-20 bg-[#F4F4F5]/95 backdrop-blur-xl pt-2 pb-4 px-4 border-b border-stone-200/60 mb-6 shadow-sm">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide px-2 pb-1">
          {mockItinerary.map((day, idx) => (
            <button
              key={day.id}
              onClick={() => setActiveDayIdx(idx)}
              className={`flex flex-col items-center min-w-[76px] py-2.5 px-3 rounded-2xl transition-all duration-300 ${
                activeDayIdx === idx 
                  ? 'bg-stone-900 text-white shadow-md scale-105' 
                  : 'bg-white text-stone-500 border border-stone-200 hover:bg-stone-50'
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
        {/* 需求: 天氣預報 */}
        <div className="bg-white rounded-2xl p-4 mb-6 flex items-center justify-between shadow-sm border border-stone-100">
          <div>
            <p className="text-xs font-bold text-stone-400 mb-1 uppercase tracking-wider">今日天氣預報</p>
            <h2 className="text-lg font-black text-stone-800">{activeDay.locationName}</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-stone-800">{activeDay.weather.temp}</span>
            {activeDay.weather.icon}
          </div>
        </div>

        <div className="space-y-2">
          {activeDay.events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}

// --- 4. 分頁元件：實用資訊 ---
function InfoTab() {
  return (
    <div className="pb-28 pt-6 max-w-md mx-auto px-6">
      <h1 className="text-3xl font-black text-stone-900 mb-8 tracking-tight">實用資訊</h1>
      
      <div className="space-y-6">
        {/* 航班資訊 */}
        <section>
          <h2 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Plane size={14} /> 航班資訊
          </h2>
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100">
            <div className="mb-4 pb-4 border-b border-stone-100">
              <span className="inline-block px-2 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded mb-2">去程 3/11</span>
              <div className="flex justify-between items-center">
                <div className="text-lg font-black text-stone-800">FD230</div>
                <div className="text-right">
                  <div className="text-sm font-bold text-stone-800">13:30 起飛</div>
                  <div className="text-xs text-stone-500">15:15 降落</div>
                </div>
              </div>
            </div>
            <div>
              <span className="inline-block px-2 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold rounded mb-2">回程 3/15</span>
              <div className="flex justify-between items-center">
                <div className="text-lg font-black text-stone-800">CI123</div>
                <div className="text-right">
                  <div className="text-sm font-bold text-stone-800">20:20 起飛</div>
                  <div className="text-xs text-stone-500">21:00 降落</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 住宿資訊 */}
        <section>
          <h2 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Home size={14} /> 住宿資訊
          </h2>
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100">
            <h3 className="text-base font-bold text-stone-900 mb-1">CONDOMINIUM 紅-BIN-</h3>
            <p className="text-sm text-stone-500 mb-4">入住: 3/11 18:30</p>
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-100">
              <p className="text-xs font-bold text-stone-400 mb-1">民宿地址 (導航用)</p>
              <p className="text-sm font-medium text-stone-800 select-all">7 Chome-9-33 Hiyagon, Okinawa, 904-2173日本</p>
            </div>
          </div>
        </section>

        {/* 租車資訊 */}
        <section>
          <h2 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Car size={14} /> 租車資訊
          </h2>
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-stone-100">
            <h3 className="text-base font-bold text-stone-900 mb-3">ORIX Rent-a-car 那霸機場店</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-stone-50 p-3 rounded-xl border border-stone-100">
                <span className="text-sm font-bold text-stone-800">Honda 車輛</span>
                <span className="text-xs font-black text-red-600 bg-red-50 px-2 py-1 rounded">代號: 247162932</span>
              </div>
              <div className="flex justify-between items-center bg-stone-50 p-3 rounded-xl border border-stone-100">
                <span className="text-sm font-bold text-stone-800">Toyota 車輛</span>
                <span className="text-xs font-black text-red-600 bg-red-50 px-2 py-1 rounded">代號: 247162570</span>
              </div>
            </div>
          </div>
        </section>

        {/* 緊急聯絡 */}
        <section>
          <h2 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Phone size={14} /> 緊急聯絡
          </h2>
          <div className="bg-white rounded-3xl p-2 shadow-sm border border-stone-100">
            <div className="flex justify-between items-center p-3 border-b border-stone-50">
              <span className="text-sm font-bold text-stone-800">報警 (警察)</span>
              <a href="tel:110" className="flex items-center gap-1.5 text-blue-600 bg-blue-50 px-4 py-2 rounded-xl text-sm font-black active:scale-95 transition-transform"><Phone size={14} /> 110</a>
            </div>
            <div className="flex justify-between items-center p-3 border-b border-stone-50">
              <span className="text-sm font-bold text-stone-800">救護車/消防</span>
              <a href="tel:119" className="flex items-center gap-1.5 text-red-600 bg-red-50 px-4 py-2 rounded-xl text-sm font-black active:scale-95 transition-transform"><Phone size={14} /> 119</a>
            </div>
            <div className="flex justify-between items-center p-3">
              <span className="text-sm font-bold text-stone-800">台北駐日代表處<br/><span className="text-[10px] text-stone-400 font-normal">那霸分處</span></span>
              <a href="tel:098-862-7008" className="flex items-center gap-1.5 text-stone-700 bg-stone-100 px-4 py-2 rounded-xl text-sm font-black active:scale-95 transition-transform"><Phone size={14} /> 撥打</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// --- 5. 分頁元件：記帳表 (含台幣換算) ---
function ExpenseTab() {
  const [expenses, setExpenses] = useState<{id: number, desc: string, amount: number}[]>([]);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  
  // 匯率設定
  const exchangeRate = 0.215;

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
      <h1 className="text-3xl font-black text-stone-900 mb-6 tracking-tight">旅費記帳</h1>
      
      {/* 總額顯示區 */}
      <div className="bg-stone-900 rounded-3xl p-6 text-white mb-6 shadow-lg relative overflow-hidden">
        <div className="absolute -right-4 -top-4 opacity-10"><Receipt size={100} /></div>
        <p className="text-xs font-bold text-stone-400 mb-1">總花費 (日幣)</p>
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-xl font-medium">¥</span>
          <span className="text-4xl font-black tracking-tighter">{totalJPY.toLocaleString()}</span>
        </div>
        <div className="pt-4 border-t border-stone-700/50">
          <p className="text-xs font-bold text-stone-400 mb-1">約合台幣 (匯率 {exchangeRate})</p>
          <div className="flex items-baseline gap-1 text-emerald-400">
            <span className="text-sm font-medium">NT$</span>
            <span className="text-xl font-black">{totalTWD.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* 新增記帳表單 */}
      <form onSubmit={addExpense} className="flex gap-2 mb-8">
        <input 
          type="text" 
          placeholder="項目 (例: 晚餐)" 
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="flex-1 bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400"
        />
        <input 
          type="number" 
          placeholder="日幣金額" 
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-28 bg-white border border-stone-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400"
        />
        <button type="submit" className="bg-stone-900 text-white p-3 rounded-xl hover:bg-stone-800 active:scale-95 transition-all">
          <Plus size={20} />
        </button>
      </form>

      {/* 記帳列表 */}
      <div className="space-y-3">
        {expenses.length === 0 ? (
          <p className="text-center text-stone-400 text-sm font-medium py-8">目前還沒有任何花費紀錄</p>
        ) : (
          expenses.map(exp => (
            <div key={exp.id} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
              <span className="text-sm font-bold text-stone-800">{exp.desc}</span>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-black text-stone-900">¥ {exp.amount.toLocaleString()}</div>
                  <div className="text-[10px] font-bold text-stone-400">NT$ {Math.round(exp.amount * exchangeRate).toLocaleString()}</div>
                </div>
                <button onClick={() => deleteExpense(exp.id)} className="text-stone-300 hover:text-red-500 transition-colors p-1">
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
    <div className="min-h-screen bg-[#F4F4F5] font-sans selection:bg-stone-200">
      <main>
        {activeTab === 'itinerary' && <ItineraryTab />}
        {activeTab === 'info' && <InfoTab />}
        {activeTab === 'expense' && <ExpenseTab />}
      </main>
      
      {/* 底部導航列 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-stone-200/60 pb-safe z-50">
        <div className="max-w-md mx-auto flex justify-around items-center px-2 py-2">
          <button onClick={() => setActiveTab('itinerary')} className={`flex flex-col items-center gap-1 w-20 py-2 rounded-2xl transition-all ${activeTab === 'itinerary' ? 'text-stone-900 bg-stone-100' : 'text-stone-400 hover:text-stone-600'}`}>
            <Map size={22} strokeWidth={activeTab === 'itinerary' ? 2.5 : 2} />
            <span className="text-[10px] font-black tracking-widest">行程</span>
          </button>
          <button onClick={() => setActiveTab('info')} className={`flex flex-col items-center gap-1 w-20 py-2 rounded-2xl transition-all ${activeTab === 'info' ? 'text-stone-900 bg-stone-100' : 'text-stone-400 hover:text-stone-600'}`}>
            <Info size={22} strokeWidth={activeTab === 'info' ? 2.5 : 2} />
            <span className="text-[10px] font-black tracking-widest">資訊</span>
          </button>
          <button onClick={() => setActiveTab('expense')} className={`flex flex-col items-center gap-1 w-20 py-2 rounded-2xl transition-all ${activeTab === 'expense' ? 'text-stone-900 bg-stone-100' : 'text-stone-400 hover:text-stone-600'}`}>
            <Wallet size={22} strokeWidth={activeTab === 'expense' ? 2.5 : 2} />
            <span className="text-[10px] font-black tracking-widest">記帳</span>
          </button>
        </div>
      </div>
    </div>
  );
}
