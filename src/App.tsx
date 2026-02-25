import React, { useState } from 'react';
import { Map, Info, Wallet, MapPin, Navigation, Phone } from 'lucide-react';

// --- 您的專屬沖繩行程資料 ---
const mockItinerary = [
  {
    id: 'day1',
    dayLabel: 'Day 1',
    date: '2026-03-11',
    locationName: '抵達與北谷',
    events: [
      { id: 'd1e1', time: '15:55', title: '抵達那霸機場', type: 'transport', location: '那霸機場', description: '航班降落，不需要輸入車機也不用導航至此。' },
      { id: 'd1e2', time: '17:30', title: 'ORIX 租車', type: 'transport', location: 'ORIX Rent-a-car Naha Airport', description: '取車 (地址: 1-1174 Toyosaki, Tomigusuku)' },
      { id: 'd1e3', time: '18:30', title: '民宿 Check in', type: 'hotel', location: 'CONDOMINIUM 紅-BIN-', description: '地址: 7 Chome-9-33 Hiyagon' },
      { id: 'd1e4', time: '19:00', title: '晚餐：北谷ダイニング ちゃぁぶ～', type: 'food', location: '北谷', description: '吃晚餐囉！' },
      { id: 'd1e5', time: '21:00', title: 'AEON 永旺夢樂城', type: 'activity', location: 'AEON Okinawa Rycom', description: '直接逛到關門！' }
    ]
  },
  {
    id: 'day2',
    dayLabel: 'Day 2',
    date: '2026-03-12',
    locationName: '那霸市區',
    events: [
      { id: 'd2e1', time: '09:00', title: '起床出門', type: 'hotel', location: '民宿', description: '09:00 起床，10:00 出門' },
      { id: 'd2e2', time: '11:00', title: '波上宮', type: 'activity', location: '波上宮', description: '注意：要找停車場！' },
      { id: 'd2e3', time: '13:00', title: '國際通 & 牧志市場', type: 'activity', location: '國際通', description: '車停國際通。逛街採買伴手禮，吃午餐 (花生豆腐、香檸汁、飯糰等)' },
      { id: 'd2e4', time: '19:00', title: '晚餐：とんかつレストランYAMASHiRO', type: 'food', location: '首里店', description: '搭電車前往首里吃豬排' },
      { id: 'd2e5', time: '21:00', title: 'AEON / 回家', type: 'activity', location: 'AEON', description: '回家路上逛超商，今天要早點睡！' }
    ]
  },
  {
    id: 'day3',
    dayLabel: 'Day 3',
    date: '2026-03-13',
    locationName: '北部地區',
    events: [
      { id: 'd3e1', time: '07:30', title: '起床出門', type: 'hotel', location: '民宿', description: '07:30 起床，08:30 出門' },
      { id: 'd3e2', time: '09:30', title: '古宇利海洋塔', type: 'activity', location: '古宇利島', description: '導航位置是停車場，去古宇利海灘走走' },
      { id: 'd3e3', time: '11:30', title: '午餐：Kouri Shrimp 蝦蝦飯', type: 'food', location: '古宇利島', description: '11:00營業，預計12:30離開古宇利' },
      { id: 'd3e4', time: '13:00', title: 'Shinmei Coffee', type: 'food', location: 'Shinmei Coffee', description: '買杯黑糖珍奶解解渴' },
      { id: 'd3e5', time: '14:00', title: '美麗海水族館', type: 'activity', location: '美麗海水族館', description: '14:00 前抵達，15:00 看鯨鯊表演' },
      { id: 'd3e6', time: '17:00', title: '許田休息站', type: 'food', location: '許田休息站', description: '好吃天婦羅，可以吃吃看' },
      { id: 'd3e7', time: '21:00', title: 'MEGA唐吉軻德 宇流麻店', type: 'activity', location: 'MEGA唐吉軻德', description: '有空再去，晚上可以去居酒屋' }
    ]
  },
  {
    id: 'day4',
    dayLabel: 'Day 4',
    date: '2026-03-14',
    locationName: '逛街 Day',
    events: [
      { id: 'd4e1', time: '08:30', title: '起床出門', type: 'hotel', location: '民宿', description: '08:30 起床，09:30 出門' },
      { id: 'd4e2', time: '10:00', title: 'Parco City', type: 'activity', location: 'Parco City', description: '逛街 DAY！' },
      { id: 'd4e3', time: '14:00', title: '港川外人住宅', type: 'activity', location: '港川外人住宅', description: '預計停留 1-1.5 小時離開' },
      { id: 'd4e4', time: '16:00', title: '美國村', type: 'activity', location: '美國村', description: '逛街、看夕陽拍照' },
      { id: 'd4e5', time: '19:00', title: '晚餐：燒肉金城', type: 'food', location: '燒肉金城', description: '晚餐吃燒肉' }
    ]
  },
  {
    id: 'day5',
    dayLabel: 'Day 5',
    date: '2026-03-15',
    locationName: '南部與賦歸',
    events: [
      { id: 'd5e1', time: '09:30', title: '玉泉洞', type: 'activity', location: '玉泉洞', description: '爬文看逛多久' },
      { id: 'd5e2', time: '11:30', title: 'ricoland Okinawa', type: 'activity', location: 'ricoland Okinawa', description: '機車部品店' },
      { id: 'd5e3', time: '13:00', title: 'A&W漢堡 & 瀨長島', type: 'food', location: '瀨長島', description: '吃漢堡、看飛機' },
      { id: 'd5e4', time: '17:30', title: 'ORIX 還車', type: 'transport', location: 'ORIX Rent-a-car Naha Airport', description: '17:30 前務必還車' },
      { id: 'd5e5', time: '20:20', title: '搭機返台', type: 'transport', location: '那霸機場', description: '不需要輸入車機也不用導航至此，平安回家！' }
    ]
  }
];

// --- 元件：行程卡片 ---
function EventCard({ event }: { event: any }) {
  const getIcon = () => {
    switch (event.type) {
      case 'food': return <span className="text-orange-500 text-xl">🍜</span>;
      case 'hotel': return <span className="text-indigo-500 text-xl">🏨</span>;
      case 'transport': return <span className="text-blue-500 text-xl">🚗</span>;
      default: return <span className="text-emerald-500 text-xl">📸</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 mb-4">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center min-w-[48px]">
          <span className="text-sm font-bold text-stone-800">{event.time}</span>
          <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center mt-2">
            {getIcon()}
          </div>
        </div>
        <div className="flex-1 pt-0.5">
          <h3 className="text-base font-bold text-stone-900 mb-1">{event.title}</h3>
          <div className="flex items-center gap-1 text-stone-500 mb-2">
            <MapPin size={14} />
            <span className="text-xs">{event.location}</span>
          </div>
          <p className="text-sm text-stone-600 leading-relaxed">{event.description}</p>
          <div className="mt-3 flex gap-2">
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 bg-stone-100 rounded-full text-xs font-medium text-stone-700 hover:bg-stone-200 transition-colors"
            >
              <Navigation size={12} /> Google 導航
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 分頁元件 ---
function ItineraryTab() {
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const activeDay = mockItinerary[activeDayIdx];

  return (
    <div className="pb-24 pt-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-stone-800 mb-4 px-6">沖繩自駕之旅</h1>
      <div className="sticky top-0 z-10 bg-[#F9F9F9]/90 backdrop-blur-md pt-2 pb-4 px-4 border-b border-stone-200/50 mb-4">
        <div className="flex gap-3 overflow-x-auto px-2">
          {mockItinerary.map((day, idx) => (
            <button
              key={day.id}
              onClick={() => setActiveDayIdx(idx)}
              className={`flex flex-col items-center min-w-[72px] py-2 px-3 rounded-2xl transition-all ${
                activeDayIdx === idx ? 'bg-stone-900 text-white shadow-md' : 'bg-white text-stone-500 border border-stone-200'
              }`}
            >
              <span className="text-xs font-medium mb-1">{day.dayLabel}</span>
              <span className={`text-sm font-bold ${activeDayIdx === idx ? 'text-white' : 'text-stone-800'}`}>
                {day.date.split('-').slice(1).join('/')}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="px-4">
        <div className="space-y-4">
          {activeDay.events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoTab() {
  return (
    <div className="pb-24 pt-6 max-w-md mx-auto px-6">
      <h1 className="text-2xl font-bold text-stone-800 mb-6">實用資訊</h1>
      <div className="space-y-6">
        <section>
          <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-3">緊急聯絡</h2>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
              <span className="text-sm font-medium text-stone-800">報警 (警察)</span>
              <a href="tel:110" className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full text-sm font-bold"><Phone size={14} /> 110</a>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-stone-100">
              <span className="text-sm font-medium text-stone-800">救護車/消防</span>
              <a href="tel:119" className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1.5 rounded-full text-sm font-bold"><Phone size={14} /> 119</a>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-stone-800">台北駐日經濟文化代表處<br/><span className="text-xs text-stone-500">那霸分處</span></span>
              <a href="tel:098-862-7008" className="flex items-center gap-2 text-stone-600 bg-stone-100 px-3 py-1.5 rounded-full text-sm font-bold"><Phone size={14} /> 撥打</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ExpenseTab() {
  return (
    <div className="pb-24 pt-6 max-w-md mx-auto px-6 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4">
        <Wallet size={32} className="text-stone-400" />
      </div>
      <h2 className="text-xl font-bold text-stone-800 mb-2">記帳功能開發中</h2>
      <p className="text-stone-500 text-center text-sm">未來可以在這裡記錄旅途中的花費，<br/>並自動換算匯率與分帳。</p>
    </div>
  );
}

// --- 主程式 ---
export default function App() {
  const [activeTab, setActiveTab] = useState('itinerary');

  return (
    <div className="min-h-screen bg-[#F9F9F9] font-sans selection:bg-stone-200">
      <main>
        {activeTab === 'itinerary' && <ItineraryTab />}
        {activeTab === 'info' && <InfoTab />}
        {activeTab === 'expense' && <ExpenseTab />}
      </main>
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-stone-200 pb-safe">
        <div className="max-w-md mx-auto flex justify-around items-center px-6 py-3">
          <button onClick={() => setActiveTab('itinerary')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'itinerary' ? 'text-stone-900' : 'text-stone-400'}`}>
            <Map size={24} strokeWidth={activeTab === 'itinerary' ? 2.5 : 2} />
            <span className="text-[10px] font-bold">行程</span>
          </button>
          <button onClick={() => setActiveTab('info')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'info' ? 'text-stone-900' : 'text-stone-400'}`}>
            <Info size={24} strokeWidth={activeTab === 'info' ? 2.5 : 2} />
            <span className="text-[10px] font-bold">資訊</span>
          </button>
          <button onClick={() => setActiveTab('expense')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'expense' ? 'text-stone-900' : 'text-stone-400'}`}>
            <Wallet size={24} strokeWidth={activeTab === 'expense' ? 2.5 : 2} />
            <span className="text-[10px] font-bold">記帳</span>
          </button>
        </div>
      </div>
    </div>
  );
}
