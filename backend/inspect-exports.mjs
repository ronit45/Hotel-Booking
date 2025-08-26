import router from './src/routes/user.routes.js';
import hotelroutes from './src/routes/hotels.routes.js';
import roomroutes from './src/routes/rooms.routes.js';
import cors from 'cors';

function describe(v) {
  try {
    if (v === null) return 'null';
    if (v === undefined) return 'undefined';
    return `${typeof v}${v && v.constructor ? ' (' + v.constructor.name + ')' : ''}`;
  } catch (e) {
    return String(v);
  }
}

console.log('Inspecting exports for debugging');
console.log('user.routes ->', describe(router));
console.log('hotels.routes ->', describe(hotelroutes));
console.log('rooms.routes ->', describe(roomroutes));

try {
  const cm = cors({ origin: () => true });
  console.log('cors(...) ->', describe(cm));
} catch (e) {
  console.error('cors(...) threw:', e && e.stack ? e.stack : e);
}

console.log('Done');
