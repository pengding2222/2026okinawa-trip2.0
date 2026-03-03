/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Map, Info, Wallet, MapPin, Navigation, Phone, Plane, Home, Car, Sun, Cloud, Receipt, Plus, Trash2, Waves, Palmtree, CheckCircle2, Circle, ClipboardList, ExternalLink, AlertCircle, GripVertical } from 'lucide-react';
import { motion, Reorder, useDragControls } from 'motion/react';

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
        id: 'd1e0', time: '11:00', title: '抵達桃園機場', type: 'transport', location: '桃園機場', 
        description: '彭🚗 9:00 郭家集合 預計 10:30 前抵達山鼻停車場\n搭乘 FD230 航班 (13:30起飛)',
        hideNav: true
      },
      { 
        id: 'd1e1', time: '15:55', title: '抵達那霸機場', type: 'transport', location: '那霸機場', 
        description: '出關後依照指示牌前往 14 號站牌搭乘接駁車前往取車。',
        tags: [{ type: 'tip', text: '先去上個廁所再出關' }]
      },
      { 
        id: 'd1e2', time: '17:30', title: 'ORIX 取車', type: 'transport', location: 'ORIX Rent-a-car Naha Airport', 
        description: '準備好台灣駕照、日文譯本、護照。',
        links: [
          { text: '⚠️ 日本自駕注意事項', url: 'https://rental-car-tips.jp/tw/rules/' },
          { text: 'YT📺：在日本自駕要注意的事', url: 'https://www.youtube.com/watch?v=vUDbQfkVGLU' }
        ],
        hideNav: true
      },
      { 
        id: 'd1e3', time: '18:30', title: '民宿 Check in', type: 'hotel', location: 'CONDOMINIUM 紅-BIN-', 
        phone: '090-9781-9313',
        description: '先到民宿放行李休息一下。\n若時間不足，直接前往餐廳',
        tags: [{ type: 'tip', text: '地址: 7 Chome-9-33 Hiyagon' }]
      },
      { 
        id: 'd1e4', time: '19:00', title: '晚餐：北谷ダイニング ちゃぁぶ～', type: 'food', location: '614-1 Kuwae, Chatan, Nakagami District, Okinawa 904-0103日本', 
        phone: '050-5385-8401',
        description: '沖繩的第一餐！人氣No.1 阿古豬涮涮鍋\n🅿️：門口有停車格，若滿位附近有店家的空地可以停車'
      },
      { 
        id: 'd1e5', time: '21:00', title: 'AEON 永旺夢樂城', type: 'activity', location: 'AEON Okinawa Rycom', 
        phone: '098-930-0425',
        description: '吃飽後直接逛到關門！',
        links: [
          { text: '【永旺夢樂城沖繩來客夢】必逛AEON Mall！美食交通、必買品牌大匯整', url: 'https://bobbyfun.tw/2024-01-07-2699/' },
          { text: '沖繩AEON MALL永旺夢樂城來客夢：最新必買/折價券/交通/退稅指南', url: 'https://mimigo.tw/aeon-mall-okinawa-rycom/' }
        ]
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
      { id: 'd2e1', time: '09:00', title: 'Chill Chill 起床', type: 'hotel', location: '民宿', description: '09:00 起床，預計 10:00 出門。' },
      { 
        id: 'd2e2', time: '11:00', title: '波上宮', type: 'activity', location: '波上宮', 
        phone: '098-868-3697',
        description: '沖繩八社之首，建在海邊懸崖上的美麗神社。',
        tags: [
          { type: 'shopping', text: '必買: 書包御守' },
          { type: 'tip', text: '🅿️1號: 離橋上拍照近, 30分200円(無上限)' },
          { type: 'tip', text: '🅿️2號: 40分200円(上限800円)' }
        ],
        customNavs: [
          { label: '1號停車場', url: 'https://www.google.com/maps/search/?api=1&query=波之上立体駐車場' },
          { label: '2號停車場', url: 'https://www.google.com/maps/search/?api=1&query=アップルパーク若狭１丁目第１' }
        ]
      },
      { 
        id: 'd2e3', time: '13:00', title: '國際通 & 牧志市場', type: 'activity', location: '國際通', 
        description: '車停國際通。逛街採買伴手禮，午餐在這裡解決。',
        tags: [
          { type: 'food', text: '必吃: 花生豆腐、香檸汁、豬肉蛋飯糰' },
          { type: 'tip', text: '🅿️1號: 第一優先(一蘭後), 整天800円' },
          { type: 'tip', text: '🅿️2號: 12H內1200円' },
          { type: 'tip', text: '🅿️3號: 唐吉訶德對面, 4H內1500円' }
        ],
        customNavs: [
          { label: '1號停車場', url: 'https://www.google.com/maps/search/?api=1&query=テクニカルパーク牧志第3' },
          { label: '2號停車場', url: 'https://www.google.com/maps/search/?api=1&query=沖縄教育出版駐車場' },
          { label: '3號停車場', url: 'https://www.google.com/maps/search/?api=1&query=Kokusai+Doriniichibanchikai+Parking+Lot' }
        ]
      },
      { 
        id: 'd2e4', time: '19:00', title: '晚餐：YAMASHiRO 豬排', type: 'food', location: 'とんかつレストランYAMASHiRO 首里店', 
        phone: '098-917-6340',
        description: '搭電車前往首里吃超人氣炸豬排。',
        tags: [{ type: 'food', text: '必點: 頂級黑豚炸豬排定食' }]
      },
      { 
        id: 'd2e5', time: '21:00', title: 'AEON / 回家', type: 'activity', location: 'AEON', 
        phone: '098-930-0425', 
        description: '回家路上逛超商＆超市，買隔天的早餐\n今天要早點睡！',
        customNavs: [
          { label: '導航至此', url: 'https://maps.app.goo.gl/VSu1NzJym1epKQS7A' }
        ]
      }
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
      { 
        id: 'd3e1', time: '07:00', title: '早起出發', type: 'hotel', location: '民宿', 
        description: '07:00 起床 08:00 出門前往北部，輪流開車補眠。\n塞車情況下預計要 2 小時才會到',
        tags: [{ type: 'tip', text: '⚠️ 北上高速公路大塞車預警' }]
      },
      { 
        id: 'd3e2', time: '10:00', title: '古宇利島', type: 'activity', location: '古宇利島', 
        phone: '0980-56-1616',
        description: '導航位置設定為停車場。可以去古宇利海灘走走，看跨海大橋。'
      },
      { 
        id: 'd3e3', time: '11:30', title: '午餐：蝦蝦飯 / しらさ食堂', type: 'food', location: '古宇利島', 
        description: '午餐有兩個選項，看當天心情決定！\n🍤 Kouri Shrimp：超人氣夏威夷風蒜香蝦蝦飯\n🍚 しらさ食堂：古宇利島必吃海鮮！滿滿新鮮海膽丼飯與海鮮定食',
        tags: [{ type: 'food', text: '必點: 蒜香奶油蝦蝦飯' }, { type: 'food', text: '必吃: 海膽丼飯' }],
        customNavs: [
          { label: '🦐 Kouri Shrimp', url: 'https://www.google.com/maps/search/?api=1&query=Kouri+Shrimp' },
          { label: '🍚 しらさ食堂', url: 'https://www.google.com/maps/search/?api=1&query=しらさ食堂' }
        ]
      },
      { 
        id: 'd3e4', time: '13:00', title: 'Shinmei Coffee', type: 'food', location: 'Shinmei Coffee Okinawa', 
        description: '質感文青咖啡廳，前往水族館前來杯招牌黑糖珍奶與職人咖啡，享受悠閒下午茶！',
        tags: [{ type: 'food', text: '必喝: 黑糖珍奶' }]
      },
      { 
        id: 'd3e5', time: '14:00', title: '美麗海水族館', type: 'activity', location: '美麗海水族館', 
        phone: '0980-48-3748',
        description: '14:00 前抵達。世界級的大型水族館。',
        tags: [{ type: 'tip', text: '15:00 有黑潮之海鯨鯊餵食秀！' }]
      },
      { 
        id: 'd3e6', time: '18:00', title: '許田休息站', type: 'food', location: '許田休息站', 
        phone: '0980-54-0880',
        description: '回程順路休息，視當天時間與體力決定是否前往。\n注意傍晚南下高速公路正值塞車高峰！',
        isOptional: true,
        tags: [{ type: 'tip', text: '💡 彈性行程' }, { type: 'food', text: '必吃: 現炸天婦羅' }, { type: 'tip', text: '⚠️ 留意南下塞車路況' }]
      },
      { 
        id: 'd3e7', time: '19:30', title: '晚餐：居酒屋', type: 'food', location: '居酒屋', 
        description: '晚餐有兩個居酒屋選項：\n🍢 選手1：沖縄食材と炉端串焼 ミハマノアシドリ (車停美國村免費停車場)\n🏮 選手2：金波銀波 (營業到 22:45)',
        customNavs: [
          { label: '🍢 ミハマノアシドリ', url: 'https://maps.app.goo.gl/Js1jhaNPXFMv1XUD8' },
          { label: '🏮 金波銀波', url: 'https://maps.app.goo.gl/A1fPHF32K6csFmir9' }
        ]
      },
      { 
        id: 'd3e8', time: '21:30', title: 'MEGA唐吉軻德 宇流麻店', type: 'shopping', location: 'MEGA唐吉軻德 宇流麻店', 
        phone: '0570-054-511', 
        description: '中部超大型 MEGA 店鋪，商品超齊全！\n營業到凌晨 4 點，半夜睡不著直接來把它給逛爛！' 
      }
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
        description: '美式復古老屋聚落，可預約 THE FLAVOR DESIGN 製作專屬客製化香水。',
        tags: [{ type: 'food', text: '必吃: oHacorte 水果塔' }],
        customNavs: [
          { label: '🅿️ 停車場', url: 'https://maps.app.goo.gl/4rm6tqWCQacSMoWr5' }
        ]
      },
      { 
        id: 'd4e4', time: '16:00', title: '美國村', type: 'activity', location: '美國村', 
        description: '逛街、看夕陽拍照，充滿異國風情。',
        tags: [
          { type: 'tip', text: '🅿️1號 Seaside: 免費' },
          { type: 'tip', text: '🅿️2號 D Parking: 免費' },
          { type: 'tip', text: '🅿️3號 永旺外: 免費' }
        ],
        customNavs: [
          { label: '1號停車場', url: 'https://maps.app.goo.gl/Dn539BpjMqiN1X7v8' },
          { label: '2號停車場', url: 'https://maps.app.goo.gl/RDHAmJRNtgTwaWL48' },
          { label: '3號停車場', url: 'https://maps.app.goo.gl/rS1hDw6R2CGoJYjA9' }
        ]
      },
      { 
        id: 'd4e5', time: '19:00', title: '晚餐：燒肉金城', type: 'food', location: '燒肉金城 北谷本店', 
        phone: '098-926-1611',
        description: '2小時石垣牛吃到飽，CP值極高！\n🅿️ 附設免費專用停車場',
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
      { id: 'd5e0', time: '07:00', title: '回家 DAY 早點起床', type: 'hotel', location: '民宿', description: '07:00 起床，08:00 出門。' },
      { 
        id: 'd5e1', time: '09:30', title: '玉泉洞', type: 'activity', location: '玉泉洞', 
        phone: '098-949-7421', 
        description: '日本第二大鐘乳石洞與沖繩世界文化王國，體驗琉球傳統文化與太鼓秀！\n預計停留時間：2 - 2.5 小時',
        links: [
          { text: '【2026沖繩玉泉洞】日本第二大鐘乳洞！沖繩世界文化王國門票交通一日遊', url: 'https://bobbyfun.tw/2024-01-11-2733/' }
        ]
      },
      { 
        id: 'd5e_aw', time: '12:30', title: '午餐：A&W 糸満店', type: 'food', location: 'A&W 糸満店', 
        description: '沖繩必吃美式速食，招牌麥根沙士配圈圈薯條超對味！'
      },
      { 
        id: 'd5e3', time: '14:00', title: '瀨長島', type: 'activity', location: '瀨長島 Umikaji Terrace', 
        description: '純白希臘風建築與無敵海景，還能近距離觀賞飛機起降。\n不排隊吃東西的話預計 1 小時可以離開'
      },
      { 
        id: 'd5e2', time: '15:30', title: 'ricoland Okinawa', type: 'shopping', location: 'ricoland Okinawa', 
        phone: '098-943-3451', 
        description: '機車部品專賣店採買。',
        tags: [{ type: 'tip', text: '⚠️ 16:30 一定要離開' }]
      },
      { 
        id: 'd5e4', time: '17:30', title: 'ORIX 還車', type: 'transport', location: 'ORIX Rent-a-car Naha Airport', 
        phone: '098-851-0543',
        description: '提前 30 分鐘離開最後的景點前往加油\n務必在 17:30 前還車',
        tags: [{ type: 'tip', text: '⚠️ 回程接駁車約 15 分鐘一班' }],
        customNavs: [
          { label: '⛽ENEOS 豐崎店', url: 'https://www.google.com/maps/search/?api=1&query=3-40+Toyosaki,+Tomigusuku,+Okinawa+901-0225日本' }
        ]
      },
      { 
        id: 'd5e5', time: '20:20', title: '快樂回家', type: 'transport', location: '那霸機場', 
        description: '結束美好的旅程！搭乘 CI123 航班 (20:20 起飛)，預計 21:00 抵達台灣。',
        tags: [
          { type: 'tip', text: '免稅店最後採買機會' },
          { type: 'tip', text: '⚠️ 手提 7 公斤 託運 1 件 23 公斤' }
        ]
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
      case 'reservation': return 'bg-sakura text-shu border-shu/10';
      case 'food': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'shopping': return 'bg-pink-50 text-pink-600 border-pink-100';
      default: return 'bg-ai/5 text-ai border-ai/10';
    }
  };

  const getThemeStyles = () => {
    switch (themeColor) {
      case 'rose': return { border: 'border-sakura', iconBg: 'bg-sakura', text: 'text-shu', nav: 'bg-shu hover:bg-shu/90' };
      case 'emerald': return { border: 'border-emerald-50', iconBg: 'bg-emerald-50', text: 'text-emerald-900', nav: 'bg-emerald-600 hover:bg-emerald-700' };
      case 'sky': return { border: 'border-ai/5', iconBg: 'bg-ai/5', text: 'text-ai', nav: 'bg-ai hover:bg-ai/90' };
      case 'amber': return { border: 'border-amber-50', iconBg: 'bg-amber-50', text: 'text-amber-900', nav: 'bg-amber-600 hover:bg-amber-700' };
      case 'indigo': return { border: 'border-indigo-50', iconBg: 'bg-indigo-50', text: 'text-indigo-900', nav: 'bg-indigo-600 hover:bg-indigo-700' };
      default: return { border: 'border-stone-100', iconBg: 'bg-stone-50', text: 'text-sumi', nav: 'bg-sumi hover:bg-sumi/90' };
    }
  };

  const styles = getThemeStyles();

  return (
    <div className={`bg-white rounded-2xl p-4 shadow-md border ${styles.border} mb-3 relative overflow-hidden group active:scale-[0.98] transition-all ${event.isOptional ? 'opacity-85 border-dashed bg-stone-50/50' : ''}`}>
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${event.type === 'food' ? 'bg-orange-400' : event.type === 'hotel' ? 'bg-cyan-400' : event.type === 'transport' ? 'bg-blue-400' : 'bg-emerald-400'}`} />
      
      <div className="flex items-start gap-4 pl-1">
        <div className="flex flex-col items-center min-w-[48px]">
          <span className={`text-sm font-serif font-black ${styles.text} tracking-tight`}>{event.time}</span>
          <div className={`w-10 h-10 rounded-xl ${styles.iconBg} flex items-center justify-center mt-2 shadow-inner`}>
            {getIcon()}
          </div>
        </div>
        
        <div className="flex-1 pt-0.5">
          <h3 className="text-lg font-serif font-black text-sumi mb-1.5 leading-tight">{event.title}</h3>
          
          <div className="flex items-center gap-1.5 text-stone-400 mb-2">
            <MapPin size={12} className="text-stone-300" />
            <span className="text-[11px] font-bold tracking-wide">{event.location}</span>
          </div>
          
          <p className="text-xs text-stone-600 leading-relaxed mb-3 font-medium whitespace-pre-line">{event.description}</p>
          
          {event.phone && (
            <div className="flex items-center gap-1.5 text-ai mb-3 bg-ai/5 px-3 py-1.5 rounded-xl w-fit border border-ai/10">
              <Phone size={10} className="text-ai/60" />
              <span className="text-[10px] font-black font-mono tracking-wider">車機電話: {event.phone}</span>
            </div>
          )}

          {event.tags && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {event.tags.map((tag: any, i: number) => (
                <span key={i} className={`text-[10px] font-black px-2 py-0.5 rounded-md border uppercase tracking-widest ${getTagStyle(tag.type)}`}>
                  {tag.text}
                </span>
              ))}
            </div>
          )}

          {event.links && (
            <div className="flex flex-col gap-2 mb-3">
              {event.links.map((link: any, idx: number) => (
                <a 
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center w-fit gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-black active:scale-95 transition-transform shadow-sm ${getTagStyle('tip')}`}
                >
                  <ExternalLink size={12} /> {link.text}
                </a>
              ))}
            </div>
          )}
          
          {event.customNavs ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {event.customNavs.map((nav: any, idx: number) => (
                <a 
                  key={idx}
                  href={nav.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${styles.nav} rounded-xl text-[10px] font-black text-white transition-all shadow-md active:scale-95 uppercase tracking-widest`}
                >
                  <Navigation size={12} /> {nav.label}
                </a>
              ))}
            </div>
          ) : event.location !== '那霸機場' && event.location !== '民宿' && !event.hideNav && (
            <div className="mt-1">
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-1.5 px-4 py-2 ${styles.nav} rounded-xl text-[10px] font-black text-white transition-all shadow-md active:scale-95 uppercase tracking-widest`}
              >
                <Navigation size={12} /> 導航至此
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
      case 'rose': return 'bg-sakura/90';
      case 'emerald': return 'bg-emerald-50/90';
      case 'sky': return 'bg-sky-50/90';
      case 'amber': return 'bg-amber-50/90';
      case 'indigo': return 'bg-indigo-50/90';
      default: return 'bg-washi/90';
    }
  };

  const getGradient = () => {
    switch (activeDay.themeColor) {
      case 'rose': return 'from-shu to-rose-600';
      case 'emerald': return 'from-emerald-600 to-teal-700';
      case 'sky': return 'from-ai to-blue-800';
      case 'amber': return 'from-amber-600 to-orange-700';
      case 'indigo': return 'from-indigo-600 to-purple-700';
      default: return 'from-shu to-rose-600';
    }
  };

  return (
    <div className="pb-28">
      {/* 氛圍頂部 */}
      <div className="relative h-36 overflow-hidden shadow-2xl">
        <img 
          src="https://picsum.photos/seed/okinawa/1080/720" 
          alt="Okinawa" 
          className="w-full h-full object-cover brightness-75 scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sumi via-sumi/20 to-transparent" />
        <div className="absolute bottom-4 left-6 right-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-shu text-white text-[9px] font-black rounded-full uppercase tracking-widest shadow-lg">Okinawa 2026</span>
            <span className="text-white/60 text-[9px] font-bold tracking-widest uppercase">Spring Journey</span>
          </div>
          <h1 className="text-3xl font-serif font-black text-white tracking-tight mb-0.5">沖繩自駕🇯🇵</h1>
          <p className="text-white/70 text-xs font-medium">五天四夜🏝️</p>
        </div>
      </div>

      <div className="max-w-md mx-auto relative z-20">
        {/* 日期切換器 (固定在上方) */}
        <div className="sticky top-0 z-30 bg-washi/95 backdrop-blur-md pt-4 pb-4 px-6 shadow-sm border-b border-stone-200/50">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide snap-x">
            {mockItinerary.map((day, idx) => (
              <button
                key={day.id}
                onClick={() => setActiveDayIdx(idx)}
                className={`flex-shrink-0 snap-start w-16 h-20 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${
                  activeDayIdx === idx 
                    ? 'bg-shu shadow-md scale-105 text-white' 
                    : 'bg-white/60 backdrop-blur-sm text-stone-400'
                }`}
              >
                <span className={`text-[9px] font-black uppercase tracking-widest mb-1 ${activeDayIdx === idx ? 'text-white/90' : ''}`}>{day.dayLabel}</span>
                <span className={`text-lg font-serif font-black ${activeDayIdx === idx ? 'text-white' : ''}`}>{day.date.split('-')[2]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 pt-4">
          {/* 當日概況 */}
        <div className="bg-white rounded-2xl p-4 shadow-md border border-stone-100 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 opacity-5"><Waves size={60} /></div>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-serif font-black text-sumi mb-0.5">{activeDay.locationName}</h2>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{activeDay.date}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end mb-0.5">
                {React.cloneElement(activeDay.weather.icon as React.ReactElement, { size: 18 })}
                <span className="text-lg font-serif font-black text-sumi">{activeDay.weather.temp}</span>
              </div>
              <p className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">{activeDay.weather.condition}</p>
            </div>
          </div>
        </div>

        {/* 行程列表 */}
        <div className="space-y-2">
          {activeDay.events.map((event) => (
            <EventCard key={event.id} event={event} themeColor={activeDay.themeColor} />
          ))}
        </div>

        <p className="text-[10px] text-stone-400 text-center mt-12 px-4 leading-relaxed font-medium">
          氣象來源：日本氣象廳 (JMA) 歷史平均數據。<br/>3 月沖繩早晚溫差大，建議採洋蔥式穿法。
        </p>
        </div>
      </div>
    </div>
  );
}

// --- 4. 分頁元件：實用資訊 ---
function InfoTab() {
  return (
    <div className="pb-28">
      <div className="sticky top-0 z-30 bg-washi/95 backdrop-blur-md pt-6 pb-4 px-6 shadow-sm border-b border-stone-200/50">
        <h1 className="text-3xl font-serif font-black text-sumi tracking-tight">旅行資訊</h1>
      </div>
      
      <div className="space-y-6 px-6 pt-6">
        {/* VJW Reminder */}
        <section>
          <div className="bg-shu rounded-2xl p-4 shadow-lg text-white relative overflow-hidden">
            <div className="absolute -right-2 -top-2 opacity-10 rotate-12"><AlertCircle size={80} /></div>
            <h2 className="text-lg font-serif font-black mb-2 flex items-center gap-1.5">
              <AlertCircle size={18} /> 提醒！
            </h2>
            <p className="text-xs font-medium leading-relaxed mb-4 opacity-90">
              Visit Japan Web (VJW) 必須在出發前填寫完成，並將產出的 <span className="font-black underline decoration-white/40 underline-offset-2">QR Code 截圖備份</span>。
            </p>
            <a 
              href="https://vjw-lp.digital.go.jp/zh-hant/" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 bg-white text-shu px-4 py-2 rounded-xl text-[10px] font-black shadow-md active:scale-95 transition-transform"
            >
              前往 VJW 官方網站 <ExternalLink size={12} />
            </a>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-black text-ai uppercase tracking-widest mb-4 flex items-center gap-2">
            <Plane size={14} /> 航班資訊
          </h2>
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-stone-100">
            <div className="mb-5 pb-5 border-b border-stone-100">
              <span className="inline-block px-2.5 py-1 bg-sakura text-shu text-[10px] font-black rounded-md mb-3 uppercase tracking-wider">去程 3/11</span>
              <div className="flex justify-between items-center">
                <div className="text-xl font-serif font-black text-sumi">FD230</div>
                <div className="text-right">
                  <div className="text-base font-black text-sumi">13:30 起飛</div>
                  <div className="text-xs text-stone-400 font-bold uppercase">15:15 Arrival</div>
                </div>
              </div>
            </div>
            <div>
              <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-md mb-3 uppercase tracking-wider">回程 3/15</span>
              <div className="flex justify-between items-center">
                <div className="text-xl font-serif font-black text-sumi">CI123</div>
                <div className="text-right">
                  <div className="text-base font-black text-sumi">20:20 起飛</div>
                  <div className="text-xs text-stone-400 font-bold uppercase">21:00 Arrival</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-black text-ai uppercase tracking-widest mb-4 flex items-center gap-2">
            <Home size={14} /> 住宿資訊
          </h2>
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-stone-100">
            <h3 className="text-lg font-serif font-black text-sumi mb-2">CONDOMINIUM 紅-BIN-</h3>
            <p className="text-xs font-bold text-stone-400 mb-5 uppercase tracking-widest">Check-in: 3/11 18:30</p>
            <div className="bg-washi p-4 rounded-2xl border border-stone-100">
              <p className="text-sm font-bold text-sumi select-all leading-relaxed mb-3">
                7 Chome-9-33 Hiyagon, Okinawa, 904-2173日本
              </p>
              <p className="text-sm font-bold text-sumi select-all leading-relaxed flex items-center gap-1.5">
                <Phone size={14} className="text-stone-400" /> 090-9781-9313 <span className="text-xs text-stone-500 font-medium">（接待時間 9:00〜20:00）</span>
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-black text-ai uppercase tracking-widest mb-4 flex items-center gap-2">
            <Car size={14} /> 租車資訊
          </h2>
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-stone-100">
            <h3 className="text-lg font-serif font-black text-sumi mb-4">ORIX Rent-a-car 那霸機場店</h3>
            
            <div className="bg-washi p-4 rounded-2xl border border-stone-100 mb-5">
              <p className="text-sm font-bold text-sumi select-all leading-relaxed mb-3">
                1-1174 Toyosaki, Tomigusuku, Okinawa 901-0225日本
              </p>
              <p className="text-sm font-bold text-sumi select-all leading-relaxed flex items-center gap-1.5">
                <Phone size={14} className="text-stone-400" /> 098-851-0543
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center bg-sakura/30 p-4 rounded-2xl border border-sakura/50">
                <span className="text-sm font-bold text-sumi">Honda Freed Hybrid</span>
                <span className="text-[10px] font-black text-shu bg-white px-3 py-1.5 rounded-lg shadow-sm">代號: 247162932</span>
              </div>
              <div className="flex justify-between items-center bg-sakura/30 p-4 rounded-2xl border border-sakura/50">
                <span className="text-sm font-bold text-sumi">TOYOTA YARIS CROSS</span>
                <span className="text-[10px] font-black text-shu bg-white px-3 py-1.5 rounded-lg shadow-sm">代號: 247162570</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-black text-ai uppercase tracking-widest mb-4 flex items-center gap-2">
            <Phone size={14} /> 緊急聯絡
          </h2>
          <div className="bg-white rounded-3xl p-3 shadow-xl border border-stone-100">
            <div className="flex justify-between items-center p-4 border-b border-stone-100">
              <span className="text-sm font-bold text-sumi">報警 (警察)</span>
              <a href="tel:110" className="flex items-center gap-2 text-ai bg-ai/5 px-5 py-2.5 rounded-2xl text-sm font-black active:scale-95 transition-transform"><Phone size={14} /> 110</a>
            </div>
            <div className="flex justify-between items-center p-4 border-b border-stone-100">
              <span className="text-sm font-bold text-sumi">救護車/消防</span>
              <a href="tel:119" className="flex items-center gap-2 text-shu bg-sakura px-5 py-2.5 rounded-2xl text-sm font-black active:scale-95 transition-transform"><Phone size={14} /> 119</a>
            </div>
            <div className="flex justify-between items-center p-4">
              <span className="text-sm font-bold text-sumi">駐日代表處<br/><span className="text-[10px] text-stone-400 font-normal">那霸分處</span></span>
              <a href="tel:098-862-7008" className="flex items-center gap-2 text-sumi bg-stone-100 px-5 py-2.5 rounded-2xl text-sm font-black active:scale-95 transition-transform"><Phone size={14} /> 撥打</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// --- 5. 分頁元件：行李檢查清單 ---
const initialChecklist = [
  {
    category: '證件文件',
    items: [
      { id: 'c1-1', text: '護照（有效期限 6 個月以上）', checked: false },
      { id: 'c1-2', text: '機票 / 電子機票', checked: false },
      { id: 'c1-3', text: '住宿訂單', checked: false },
      { id: 'c1-4', text: 'Visit Japan Web QR code', checked: false },
      { id: 'c1-5', text: '記得保旅平險', checked: false },
      { id: 'c1-6', text: '租車預約資料', checked: false },
      { id: 'c1-8', text: '台灣駕照', checked: false },
      { id: 'c1-11', text: '日文譯本', checked: false },
    ]
  },
  {
    category: '金錢與支付',
    items: [
      { id: 'c2-1', text: '日幣現金', checked: false },
      { id: 'c2-2', text: '信用卡（Visa / Master）', checked: false },
      { id: 'c2-3', text: '行動支付（Apple Pay / Google Pay）', checked: false },
      { id: 'c2-4', text: '零錢包', checked: false },
    ]
  },
  {
    category: '3C 與網路',
    items: [
      { id: 'c3-1', text: '手機', checked: false },
      { id: 'c3-2', text: '充電器', checked: false },
      { id: 'c3-3', text: '行動電源', checked: false },
      { id: 'c3-4', text: '相機 / 運動相機', checked: false },
      { id: 'c3-5', text: '記憶卡', checked: false },
      { id: 'c3-6', text: 'eSIM / 漫遊 / 網卡', checked: false },
      { id: 'c3-7', text: '延長線', checked: false },
      { id: 'c3-8', text: '充電線', checked: false },
      { id: 'c3-9', text: '車用手機架（自駕）', checked: false },
      { id: 'c3-10', text: '車充', checked: false },
    ]
  },
  {
    category: '衣物',
    items: [
      { id: 'c4-1', text: '身上穿一套', checked: false },
      { id: 'c4-2', text: '剩下全都去Shopping', checked: false },
    ]
  },
  {
    category: '盥洗與個人用品',
    items: [
      { id: 'c5-1', text: '牙刷牙膏', checked: false },
      { id: 'c5-2', text: '洗面乳', checked: false },
      { id: 'c5-3', text: '刮鬍刀', checked: false },
      { id: 'c5-4', text: '隱形眼鏡 / 藥水', checked: false },
      { id: 'c5-5', text: '衛生紙 / 濕紙巾', checked: false },
      { id: 'c5-6', text: '洗衣袋', checked: false },
    ]
  },
  {
    category: '藥品與健康',
    items: [
      { id: 'c6-1', text: '感冒藥', checked: false },
      { id: 'c6-2', text: '止痛藥', checked: false },
      { id: 'c6-3', text: '腸胃藥', checked: false },
      { id: 'c6-4', text: '暈車藥', checked: false },
      { id: 'c6-5', text: '過敏藥', checked: false },
      { id: 'c6-7', text: '個人處方藥', checked: false },
      { id: 'c6-8', text: '酒精', checked: false },
      { id: 'c6-9', text: '口罩', checked: false },
      { id: 'c6-10', text: '乳液', checked: false },
    ]
  },
  {
    category: '加分小物',
    items: [
      { id: 'c7-1', text: '泳褲', checked: false },
      { id: 'c7-3', text: '環保購物袋', checked: false },
      { id: 'c7-4', text: '行李秤', checked: false },
      { id: 'c7-5', text: '頸枕', checked: false },
    ]
  }
];

const CHECKLIST_VERSION = '1.2'; // 更新此版本號以強制所有使用者更新清單

function ChecklistItem({ item, catName, toggleItem, deleteItem }: any) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={dragControls}
      className="flex items-center justify-between p-3 border-b border-emerald-50 last:border-0 group bg-white active:shadow-md transition-shadow"
      style={{ touchAction: 'auto' }}
    >
      <div className="flex items-center gap-2 flex-1">
        <div 
          className="cursor-grab active:cursor-grabbing text-stone-200 hover:text-emerald-300 transition-colors p-2 -ml-1"
          onPointerDown={(e) => {
            dragControls.start(e);
          }}
          style={{ touchAction: 'none' }}
        >
          <GripVertical size={18} />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleItem(catName, item.id);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="flex items-center gap-3 flex-1 text-left"
        >
          {item.checked ? (
            <CheckCircle2 size={20} className="text-emerald-500" />
          ) : (
            <Circle size={20} className="text-stone-200" />
          )}
          <span className={`text-sm font-bold transition-all ${item.checked ? 'text-stone-300 line-through' : 'text-stone-700'}`}>
            {item.text}
          </span>
        </button>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteItem(catName, item.id);
        }}
        onPointerDown={(e) => e.stopPropagation()}
        className="text-stone-200 hover:text-rose-500 p-2 transition-colors"
      >
        <Trash2 size={16} />
      </button>
    </Reorder.Item>
  );
}

function ChecklistTab() {
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('okinawa_checklist');
    const savedVersion = localStorage.getItem('okinawa_checklist_version');
    
    // 如果版本不符，強制重設為初始清單
    if (savedVersion !== CHECKLIST_VERSION) {
      return initialChecklist;
    }
    
    return saved ? JSON.parse(saved) : initialChecklist;
  });

  const [newItemText, setNewItemText] = useState('');
  const [activeCategory, setActiveCategory] = useState(categories[0]?.category || '');

  useEffect(() => {
    localStorage.setItem('okinawa_checklist', JSON.stringify(categories));
    localStorage.setItem('okinawa_checklist_version', CHECKLIST_VERSION);
  }, [categories]);

  const toggleItem = (catName: string, itemId: string) => {
    setCategories(categories.map((cat: any) => {
      if (cat.category === catName) {
        return {
          ...cat,
          items: cat.items.map((item: any) => 
            item.id === itemId ? { ...item, checked: !item.checked } : item
          )
        };
      }
      return cat;
    }));
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    
    setCategories(categories.map((cat: any) => {
      if (cat.category === activeCategory) {
        return {
          ...cat,
          items: [...cat.items, { id: Date.now().toString(), text: newItemText, checked: false }]
        };
      }
      return cat;
    }));
    setNewItemText('');
  };

  const deleteItem = (catName: string, itemId: string) => {
    setCategories(categories.map((cat: any) => {
      if (cat.category === catName) {
        return {
          ...cat,
          items: cat.items.filter((item: any) => item.id !== itemId)
        };
      }
      return cat;
    }));
  };

  const handleReorder = (catName: string, reorderedItems: any[]) => {
    setCategories(categories.map((cat: any) => {
      if (cat.category === catName) {
        return { ...cat, items: reorderedItems };
      }
      return cat;
    }));
  };

  return (
    <div className="pb-28">
      <div className="sticky top-0 z-30 bg-washi/95 backdrop-blur-md pt-6 pb-4 px-6 shadow-sm border-b border-stone-200/50">
        <h1 className="text-3xl font-serif font-black text-sumi tracking-tight">行李清單</h1>
      </div>
      
      <div className="px-6 pt-6">
        <form onSubmit={addItem} className="mb-8">
          <div className="flex gap-2 w-full">
            <select 
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="w-24 flex-shrink-0 bg-white border border-stone-200 rounded-2xl px-2 py-3 text-base font-black text-ai focus:outline-none focus:ring-2 focus:ring-shu/20 shadow-sm truncate"
            >
              {categories.map((cat: any) => (
                <option key={cat.category} value={cat.category}>{cat.category}</option>
              ))}
            </select>
            <input 
              type="text" 
              placeholder="新增物品..." 
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              className="min-w-0 flex-1 bg-white border border-stone-200 rounded-2xl px-4 py-3 text-base font-bold focus:outline-none focus:ring-2 focus:ring-shu/20 shadow-sm placeholder:text-stone-300"
            />
            <button type="submit" className="flex-shrink-0 bg-shu text-white w-12 flex items-center justify-center rounded-2xl shadow-lg active:scale-95 transition-transform">
              <Plus size={22} strokeWidth={3} />
            </button>
          </div>
        </form>

      <div className="space-y-8">
        {categories.map((cat: any) => (
          <section key={cat.category}>
            <h2 className="text-xs font-black text-ai uppercase tracking-widest mb-4 flex items-center gap-2">
              <ClipboardList size={14} /> {cat.category}
            </h2>
            <div className="bg-white rounded-2xl p-2 shadow-md border border-stone-100">
              <Reorder.Group axis="y" values={cat.items} onReorder={(newOrder) => handleReorder(cat.category, newOrder)} className="space-y-0">
                {cat.items.map((item: any) => (
                  <ChecklistItem 
                    key={item.id} 
                    item={item} 
                    catName={cat.category} 
                    toggleItem={toggleItem} 
                    deleteItem={deleteItem} 
                  />
                ))}
              </Reorder.Group>
            </div>
          </section>
        ))}
      </div>
    </div>
  </div>
  );
}

// --- 6. 分頁元件：記帳表 (含台幣換算 + 持久化) ---
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
    <div className="pb-28">
      <div className="sticky top-0 z-30 bg-washi/95 backdrop-blur-md pt-6 pb-4 px-6 shadow-sm border-b border-stone-200/50 flex items-center justify-between">
        <h1 className="text-3xl font-serif font-black text-sumi tracking-tight">旅行記帳</h1>
        <button 
          onClick={() => setIsEditingRate(!isEditingRate)}
          className="text-[10px] font-black bg-sakura text-shu px-4 py-2 rounded-full active:scale-95 transition-transform shadow-sm border border-shu/10"
        >
          {isEditingRate ? '完成設定' : `匯率: ${exchangeRate}`}
        </button>
      </div>
      
      <div className="px-6 pt-6">
        {isEditingRate && (
        <div className="mb-8 p-5 bg-white rounded-3xl border border-stone-100 shadow-xl animate-in fade-in slide-in-from-top-2">
          <label className="block text-[10px] font-black text-ai uppercase tracking-widest mb-3">設定日幣匯率 (台銀賣出價參考)</label>
          <div className="flex gap-2">
            <input 
              type="number" 
              step="0.001"
              inputMode="decimal"
              value={exchangeRate}
              onChange={(e) => setExchangeRate(Number(e.target.value))}
              className="flex-1 bg-washi border border-stone-100 rounded-2xl px-5 py-3 text-base font-black text-sumi focus:outline-none focus:ring-2 focus:ring-shu/20"
            />
          </div>
        </div>
      )}

      <div className="bg-shu rounded-2xl p-6 text-white mb-6 shadow-xl relative overflow-hidden">
        <div className="absolute -right-2 -top-2 opacity-10 rotate-12"><Waves size={100} /></div>
        <p className="text-[9px] font-black text-sakura/60 mb-1 uppercase tracking-widest">總支出 (日幣 JPY)</p>
        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-xl font-serif font-medium">¥</span>
          <span className="text-4xl font-serif font-black tracking-tighter">{totalJPY.toLocaleString()}</span>
        </div>
        <div className="pt-4 border-t border-white/10">
          <p className="text-[9px] font-black text-sakura/60 mb-1 uppercase tracking-widest">預估台幣 (匯率 {exchangeRate})</p>
          <div className="flex items-baseline gap-1 text-white">
            <span className="text-xs font-medium">NT$</span>
            <span className="text-xl font-black">{totalTWD.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="mb-8 text-center">
        <p className="text-xs font-bold text-ai italic">“ 日本是免稅，不是免費！ ” 💸</p>
      </div>

      <form onSubmit={addExpense} className="space-y-4 mb-10">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 font-serif font-black text-xl">¥</span>
            <input 
              type="number" 
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="金額" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-white border border-stone-200 rounded-3xl pl-12 pr-5 py-5 text-2xl font-serif font-black text-sumi focus:outline-none focus:ring-2 focus:ring-shu/20 shadow-sm placeholder:text-stone-100"
            />
          </div>
          <button type="submit" className="flex-shrink-0 bg-shu text-white px-6 rounded-3xl hover:bg-shu/90 active:scale-95 transition-all shadow-xl flex items-center justify-center">
            <Plus size={32} strokeWidth={3} />
          </button>
        </div>
        <input 
          type="text" 
          placeholder="項目 (例: 蝦蝦飯、伴手禮)" 
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full bg-white border border-stone-200 rounded-2xl px-6 py-4 text-base font-bold focus:outline-none focus:ring-2 focus:ring-shu/20 shadow-sm placeholder:text-stone-200"
        />
      </form>

      <div className="space-y-4">
        {expenses.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-sakura rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Receipt size={36} className="text-shu/20" />
            </div>
            <p className="text-stone-300 text-sm font-bold tracking-widest uppercase">還沒有任何花費紀錄</p>
          </div>
        ) : (
          expenses.map(exp => (
            <div key={exp.id} className="flex justify-between items-center bg-white p-5 rounded-3xl border border-stone-50 shadow-lg group transition-all hover:shadow-xl">
              <span className="text-sm font-bold text-sumi">{exp.desc}</span>
              <div className="flex items-center gap-5">
                <div className="text-right">
                  <div className="text-lg font-serif font-black text-sumi">¥ {exp.amount.toLocaleString()}</div>
                  <div className="text-[10px] font-black text-stone-300 uppercase tracking-tighter">NT$ {Math.round(exp.amount * exchangeRate).toLocaleString()}</div>
                </div>
                <button onClick={() => deleteExpense(exp.id)} className="text-stone-200 hover:text-shu transition-colors p-2">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      </div>
    </div>
  );
}

// --- 主程式 ---
export default function App() {
  const [activeTab, setActiveTab] = useState('itinerary');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-washi bg-pattern font-sans text-sumi selection:bg-shu/10">
      {/* 內容區域 */}
      <main className="relative z-10">
        {activeTab === 'itinerary' && <ItineraryTab />}
        {activeTab === 'info' && <InfoTab />}
        {activeTab === 'expense' && <ExpenseTab />}
        {activeTab === 'checklist' && <ChecklistTab />}
      </main>

      {/* 底部導覽 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-stone-200 z-50 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="max-w-md mx-auto flex justify-around items-center h-20 px-4">
          <button 
            onClick={() => setActiveTab('itinerary')}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 'itinerary' ? 'text-shu scale-110' : 'text-stone-400 hover:text-stone-600'}`}
          >
            <div className={`p-2 rounded-2xl transition-colors ${activeTab === 'itinerary' ? 'bg-shu/5' : ''}`}>
              <Map size={22} strokeWidth={activeTab === 'itinerary' ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">行程</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('info')}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 'info' ? 'text-shu scale-110' : 'text-stone-400 hover:text-stone-600'}`}
          >
            <div className={`p-2 rounded-2xl transition-colors ${activeTab === 'info' ? 'bg-shu/5' : ''}`}>
              <Info size={22} strokeWidth={activeTab === 'info' ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">資訊</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('checklist')}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 'checklist' ? 'text-shu scale-110' : 'text-stone-400 hover:text-stone-600'}`}
          >
            <div className={`p-2 rounded-2xl transition-colors ${activeTab === 'checklist' ? 'bg-shu/5' : ''}`}>
              <ClipboardList size={22} strokeWidth={activeTab === 'checklist' ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">清單</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('expense')}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${activeTab === 'expense' ? 'text-shu scale-110' : 'text-stone-400 hover:text-stone-600'}`}
          >
            <div className={`p-2 rounded-2xl transition-colors ${activeTab === 'expense' ? 'bg-shu/5' : ''}`}>
              <Wallet size={22} strokeWidth={activeTab === 'expense' ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">記帳</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
