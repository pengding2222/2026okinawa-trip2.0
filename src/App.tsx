import React, { useState } from 'react';
import { Map, Info, Wallet, Clock, MapPin, Navigation, Phone, ExternalLink } from 'lucide-react';

// --- 模擬資料 (行程內容) ---
const mockItinerary = [
  {
    id: 'day1',
    dayLabel: 'Day 1',
    date: '2026-05-01',
    locationName: '那霸市區',
    events: [
      { id: 'e1', time: '10:00', title: '抵達那霸機場', type: 'transport', location: '那霸機場', description: '領取行李，準備搭乘單軌電車前往市區。' },
      { id: 'e2', time: '11:30', title: '飯店寄放行李', type: 'hotel', location: '那霸國際通大和ROYNET飯店', description: '先寄放行李，輕裝逛街。' },
      { id: 'e3', time: '12:30', title: '午餐：暖暮拉麵', type: 'food', location: '暖暮拉麵 那霸牧志店', description: '必吃排隊拉麵，建議提早排隊。' },
      { id: 'e4', time: '14:00', title: '國際通逛街', type: 'activity', location: '國際通', description: '採買伴手禮、逛驚安殿堂。' },
      { id: 'e5', time: '18:30', title: '晚餐：敘敘苑燒肉', type: 'food', location: '敘敘苑 沖繩浦添PARCO CITY店', description: '享受高級和牛燒肉，已預約 18:30。' }
    ]
  },
  {
    id: 'day2',
    dayLabel: 'Day 2',
    date: '2026-05-02',
    locationName: '中部地區',
    events: [
      { id: 'e6', time: '09:00', title: 'OTS 租車取車', type: 'transport', location: 'OTS 租車 泊營業所', description: '攜帶駕照日文譯本、台灣駕照、護照。' },
      { id: 'e7', time: '10:30', title: '美國村', type: 'activity', location: '美濱美國村', description: '充滿異國風情的購物區，適合拍照。' },
      { id: 'e8', time: '12:30', title: '午餐：迴轉壽司', type: 'food', location: '迴轉壽司市場 美濱店', description: '新鮮平價的迴轉壽司。' },
      { id: 'e9', time: '15:00', title: '萬座毛', type: 'activity', location: '萬座毛', description: '欣賞像大象鼻子的天然海蝕崖。' },
      { id: 'e10', time: '17:30', title: '入住海景飯店', type: 'hotel', location: '蒙特利水療度假酒店', description: '享受無敵海景與飯店設施。' }
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
            <button className="flex items-center gap-1 px-3 py-1.5 bg-stone-100 rounded-full text-xs font-medium text-stone-700 hover:bg-stone-200 transition-colors">
              <Navigation size={12} /> 導航
            </button>
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
